import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withAuth, withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'
import { OrderStatus } from '@/types/order'

// Validation schemas
export const createOrderSchema = z.object({
  userId: z.number().int().positive(),
  marketDayId: z.number().int().positive().optional(),
  orderItems: z.array(
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    })
  ),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
  total: z.number().positive(),
})

export const updateOrderSchema = createOrderSchema.partial()

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>

// POST body schema for status update
const updateOrderStatusSchema = z.object({
  orderId: z.number().int().positive(),
  status: z.nativeEnum(OrderStatus),
})

export const POST = withRateLimit(
  withAuth(async (req, context) => {
    const user = context.session?.user
    if (!user || user.role !== 'vendor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const body = await req.json()
    const parse = updateOrderStatusSchema.safeParse(body)
    if (!parse.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    const { orderId, status } = parse.data
    // Find vendor profile
    const vendorProfile = await db.vendorProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    })
    if (!vendorProfile) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      )
    }
    // Check if the order contains at least one product for this vendor
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            marketDayProductVariation: {
              include: {
                marketDayProduct: {
                  include: {
                    product: { select: { vendorProfileId: true } },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    const vendorOrderItems = order.orderItems.filter(
      (item) =>
        item.marketDayProductVariation.marketDayProduct.product
          .vendorProfileId === vendorProfile.id
    )
    if (vendorOrderItems.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    // Update the status of all orderItems for this vendor
    await Promise.all(
      vendorOrderItems.map((item) =>
        db.orderItem.update({
          where: { id: item.id },
          data: { status: status },
        })
      )
    )
    return NextResponse.json({ success: true })
  }),
  { limit: 20, windowMs: 60 * 1000 }
)
