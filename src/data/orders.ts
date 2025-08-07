import { db } from '@/lib/prisma'
import { ClientOrder } from '@/types/order'
import { OrderStatus, OrderItemStatus } from '@/generated/prisma/client'

export async function getVendorOrders(
  vendorProfileId: number
): Promise<ClientOrder[]> {
  const orders = await db.order.findMany({
    where: {
      orderItems: {
        some: {
          marketDayProductVariation: {
            marketDayProduct: {
              product: { vendorProfileId },
            },
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
          marketDayProductVariation: {
            marketDayProduct: {
              product: { vendorProfileId },
            },
          },
        },
        include: {
          marketDayProductVariation: {
            include: {
              productVariation: {
                include: {
                  unit: true,
                  product: true,
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
    const computedStatus: OrderStatus = order.orderItems.some(
      (item) => item.status === OrderItemStatus.PROCESSING
    )
      ? OrderStatus.PENDING
      : OrderStatus.COMPLETED

    const marketDay: ClientOrder['marketDay'] = {
      id: order.marketDay.id,
      name: order.marketDay.marketSchedule.name,
      date: order.marketDay.startTime
        ? order.marketDay.startTime.toISOString().split('T')[0]
        : '',
    }

    let vendorTotal = 0
    const orderItems: ClientOrder['orderItems'] = order.orderItems.map(
      (item): ClientOrder['orderItems'][number] => {
        vendorTotal += item.price * item.quantity
        return {
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          unit: item.marketDayProductVariation.productVariation.unit.name,
          status: item.status,
          name: item.marketDayProductVariation.productVariation.product.name,
          imageUrl:
            item.marketDayProductVariation.productVariation.product.imageUrl,
        }
      }
    )

    const vendorOrder: ClientOrder = {
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

export async function getVendorOrderById(
  orderId: number,
  vendorProfileId: number
): Promise<ClientOrder | null> {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
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
          marketDayProductVariation: {
            marketDayProduct: {
              product: { vendorProfileId },
            },
          },
        },
        include: {
          unit: true,
          marketDayProductVariation: {
            include: {
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
      },
    },
  })

  if (!order || order.orderItems.length === 0) {
    return null
  }

  // Transform data to match the expected format
  return {
    id: order.id,
    date: order.createdAt.toISOString().split('T')[0],
    user: order.user,
    status: order.orderItems.some(
      (item) => item.status === OrderItemStatus.PROCESSING
    )
      ? OrderStatus.PENDING
      : OrderStatus.COMPLETED,
    orderItems: order.orderItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      unit: item.unit.name,
      status: item.status,
      name: item.marketDayProductVariation.marketDayProduct.product.name,
      imageUrl:
        item.marketDayProductVariation.marketDayProduct.product.imageUrl,
    })),
    marketDay: {
      id: order.marketDay?.id || 0,
      name: order.marketDay?.marketSchedule?.name || '',
      date: order.marketDay?.startTime
        ? order.marketDay.startTime.toISOString().split('T')[0]
        : '',
    },
    total: order.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
  }
}

/**
 * Check if there's a next order with unprocessed items for navigation
 */
export async function getNextVendorOrder(
  currentOrderId: number,
  vendorProfileId: number
): Promise<{ id: number } | null> {
  return await db.order.findFirst({
    where: {
      id: { gt: currentOrderId },
      orderItems: {
        some: {
          marketDayProductVariation: {
            marketDayProduct: {
              product: { vendorProfileId },
            },
          },
          status: 'PROCESSING',
        },
      },
    },
    select: {
      id: true,
    },
    orderBy: { id: 'asc' },
  })
}
