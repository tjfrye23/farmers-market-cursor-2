import { NextResponse } from 'next/server'
import { withAuth, withRateLimit, withValidation } from '@/lib/api-handler'
import { getOrderById, updateOrderItemStatus } from '@/data/orders'
import { findVendorByUserId } from '@/data/vendors'
import {
  UpdateOrderStatusInput,
  updateOrderStatusSchema,
} from '@/lib/schemas/order'

export const POST = withRateLimit(
  withAuth(
    withValidation(
      updateOrderStatusSchema,
      async (req, data: UpdateOrderStatusInput, context) => {
        const { session } = context

        if (!session) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get vendor profile for the authenticated user
        const vendorProfile = await findVendorByUserId(session.user.id)
        if (!vendorProfile) {
          return NextResponse.json(
            { error: 'Vendor profile not found' },
            { status: 404 }
          )
        }

        // Get the order and verify it belongs to this vendor
        const order = await getOrderById(data.orderId)
        if (!order) {
          return NextResponse.json(
            { error: 'Order not found' },
            { status: 404 }
          )
        }

        // Verify that the order contains items from this vendor
        const vendorOrderItems = order.orderItems.filter(
          (item) =>
            item.marketDayProductVariation.marketDayProduct.product
              .vendorProfile.id === vendorProfile.id
        )

        if (vendorOrderItems.length === 0) {
          return NextResponse.json(
            { error: 'No items found for this vendor in the order' },
            { status: 404 }
          )
        }

        // Update all order items for this vendor
        await Promise.all(
          vendorOrderItems.map((item) =>
            updateOrderItemStatus(item.id, data.status)
          )
        )

        return NextResponse.json({ success: true })
      }
    )
  ),
  { limit: 20, windowMs: 60 * 1000 }
)
