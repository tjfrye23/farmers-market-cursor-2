import { NextResponse } from 'next/server'
import { withAuth, withRateLimit, withValidation } from '@/lib/api-handler'
import { db } from '@/lib/prisma'
import {
  UpdateOrderStatusInput,
  updateOrderStatusSchema,
} from '@/lib/schemas/order'
import { UserRole } from '@/generated/prisma/client'

export const POST = withRateLimit(
  withAuth(
    withValidation(
      updateOrderStatusSchema,
      async (req, data: UpdateOrderStatusInput, context) => {
        const user = context.session?.user
        if (!user || user.role !== UserRole.VENDOR) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        if (isNaN(data.orderId)) {
          return NextResponse.json(
            { error: 'Invalid order ID' },
            { status: 400 }
          )
        }

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
          where: { id: data.orderId },
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
          return NextResponse.json(
            { error: 'Order not found' },
            { status: 404 }
          )
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
              data: { status: data.status },
            })
          )
        )
        return NextResponse.json({ success: true })
      }
    )
  ),
  { limit: 20, windowMs: 60 * 1000 }
)
