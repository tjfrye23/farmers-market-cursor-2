import { NextRequest, NextResponse } from 'next/server'
import { withAuth, withValidation, withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'
import { updateOrderSchema, type UpdateOrderInput } from '../route'

/**
 * @api {get} /api/orders/:id Get Order
 * @apiName GetOrder
 * @apiGroup Orders
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} id Order ID
 *
 * @apiSuccess {Object} order Order information
 * @apiSuccess {Number} order.id Order ID
 * @apiSuccess {Number} order.userId User ID
 * @apiSuccess {Number} [order.marketDayId] Market day ID
 * @apiSuccess {String} order.status Order status
 * @apiSuccess {Number} order.total Order total
 * @apiSuccess {String} order.createdAt Order creation date
 * @apiSuccess {Object} order.user User information
 * @apiSuccess {String} order.user.name User's name
 * @apiSuccess {String} order.user.email User's email
 * @apiSuccess {Object[]} order.orderItems List of order items
 * @apiSuccess {Number} order.orderItems.id Order item ID
 * @apiSuccess {Number} order.orderItems.productId Product ID
 * @apiSuccess {Number} order.orderItems.quantity Quantity
 * @apiSuccess {Number} order.orderItems.price Price at time of purchase
 * @apiSuccess {Object} order.orderItems.product Product information
 * @apiSuccess {String} order.orderItems.product.name Product name
 * @apiSuccess {String} [order.orderItems.product.imageUrl] Product image URL
 *
 * @apiError (400) InvalidId Invalid order ID
 * @apiError (404) NotFound Order not found
 * @apiError (429) TooManyRequests Too many requests
 */
export const GET = withRateLimit(
  async (req: NextRequest, context: { params: Record<string, string> }) => {
    const id = parseInt(context.params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    const order = await db.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  },
  { limit: 100, windowMs: 60 * 1000 }
)

/**
 * @api {put} /api/orders/:id Update Order
 * @apiName UpdateOrder
 * @apiGroup Orders
 * @apiVersion 1.0.0
 * @apiDescription Update an existing order. Requires authentication.
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {Number} id Order ID
 *
 * @apiBody {Number} [userId] User ID
 * @apiBody {Number} [marketDayId] Market day ID
 * @apiBody {Object[]} [orderItems] List of order items
 * @apiBody {Number} orderItems.productId Product ID
 * @apiBody {Number} orderItems.quantity Quantity
 * @apiBody {Number} orderItems.price Price at time of purchase
 * @apiBody {String} [status] Order status
 * @apiBody {Number} [total] Order total
 *
 * @apiSuccess {Object} order Updated order
 * @apiSuccess {Number} order.id Order ID
 * @apiSuccess {Number} order.userId User ID
 * @apiSuccess {Number} [order.marketDayId] Market day ID
 * @apiSuccess {String} order.status Order status
 * @apiSuccess {Number} order.total Order total
 * @apiSuccess {String} order.createdAt Order creation date
 * @apiSuccess {Object} order.user User information
 * @apiSuccess {String} order.user.name User's name
 * @apiSuccess {String} order.user.email User's email
 * @apiSuccess {Object[]} order.orderItems List of order items
 * @apiSuccess {Number} order.orderItems.id Order item ID
 * @apiSuccess {Number} order.orderItems.productId Product ID
 * @apiSuccess {Number} order.orderItems.quantity Quantity
 * @apiSuccess {Number} order.orderItems.price Price at time of purchase
 * @apiSuccess {Object} order.orderItems.product Product information
 * @apiSuccess {String} order.orderItems.product.name Product name
 * @apiSuccess {String} [order.orderItems.product.imageUrl] Product image URL
 *
 * @apiError (400) ValidationError Invalid input data
 * @apiError (400) InvalidId Invalid order ID
 * @apiError (401) Unauthorized Authentication required
 * @apiError (429) TooManyRequests Too many requests
 */
export const PUT = withRateLimit(
  withAuth(
    withValidation(
      updateOrderSchema,
      async (req, data: UpdateOrderInput, context) => {
        const id = parseInt(context.params.id, 10)
        if (isNaN(id)) {
          return NextResponse.json(
            { error: 'Invalid order ID' },
            { status: 400 }
          )
        }

        const order = await db.order.update({
          where: { id },
          data: {
            ...data,
            orderItems: data.orderItems
              ? {
                  deleteMany: {},
                  create: data.orderItems,
                }
              : undefined,
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            orderItems: {
              include: {
                product: {
                  select: {
                    name: true,
                    imageUrl: true,
                  },
                },
              },
            },
          },
        })

        return NextResponse.json(order)
      }
    )
  ),
  { limit: 20, windowMs: 60 * 1000 }
)

/**
 * @api {delete} /api/orders/:id Delete Order
 * @apiName DeleteOrder
 * @apiGroup Orders
 * @apiVersion 1.0.0
 * @apiDescription Delete an order. Requires authentication.
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {Number} id Order ID
 *
 * @apiSuccess (204) NoContent Order successfully deleted
 *
 * @apiError (400) InvalidId Invalid order ID
 * @apiError (401) Unauthorized Authentication required
 * @apiError (429) TooManyRequests Too many requests
 */
export const DELETE = withRateLimit(
  withAuth(
    async (req: NextRequest, context: { params: Record<string, string> }) => {
      const id = parseInt(context.params.id, 10)
      if (isNaN(id)) {
        return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
      }

      await db.order.delete({
        where: { id },
      })

      return new NextResponse(null, { status: 204 })
    }
  ),
  { limit: 20, windowMs: 60 * 1000 }
)
