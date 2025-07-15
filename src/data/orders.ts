import { db } from '@/lib/prisma'
import { Order } from '@/types/order'

/**
 * Fetch all orders relevant to a vendor, including nested product and user info.
 */
export async function getVendorOrders(
  vendorProfileId: number
): Promise<Order[]> {
  const orders = await db.order.findMany({
    where: {
      orderItems: {
        some: {
          marketDayProduct: {
            product: { vendorProfileId },
          },
        },
      },
    },
    include: {
      user: { select: { name: true, email: true } },
      marketDay: {
        select: {
          id: true,
          startTime: true,
          marketSchedule: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      orderItems: {
        where: {
          marketDayProduct: {
            product: { vendorProfileId },
          },
        },
        include: {
          productUnit: true,
          marketDayProduct: {
            include: {
              product: {
                select: {
                  name: true,
                  imageUrl: true,
                  vendorProfileId: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const mappedOrders = orders.map((order) => {
    const computedStatus: 'processing' | 'processed' = order.orderItems.some(
      (item) => item.status === 'processing'
    )
      ? 'processing'
      : 'processed'

    const marketDay: Order['marketDay'] = {
      id: order.marketDay.id,
      name: order.marketDay.marketSchedule.name,
      date: order.marketDay.startTime
        ? order.marketDay.startTime.toISOString().split('T')[0]
        : '',
    }

    let vendorTotal = 0
    const orderItems: Order['orderItems'] = order.orderItems.map(
      (item): Order['orderItems'][number] => {
        vendorTotal += item.price * item.quantity
        return {
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          unit: item.productUnit.name,
          status: item.status,
          name: item.marketDayProduct.product.name,
          imageUrl: item.marketDayProduct.product.imageUrl,
        }
      }
    )

    const vendorOrder: Order = {
      id: order.id,
      date: order.createdAt.toISOString().split('T')[0],
      user: order.user,
      status: computedStatus,
      orderItems,
      marketDay,
      total: vendorTotal,
    }

    return vendorOrder
  })

  return mappedOrders
}
