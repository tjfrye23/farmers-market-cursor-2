import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAuth, withValidation, withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'

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
  status: z
    .enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])
    .default('PENDING'),
  total: z.number().positive(),
})

export const updateOrderSchema = createOrderSchema.partial()

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>

/**
 * @api {get} /api/orders List Orders
 * @apiName GetOrders
 * @apiGroup Orders
 * @apiVersion 1.0.0
 *
 * @apiQuery {String} [userId] Filter orders by user ID
 * @apiQuery {String} [marketDayId] Filter orders by market day ID
 * @apiQuery {String} [status] Filter by status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
 *
 * @apiSuccess {Object[]} orders List of orders
 * @apiSuccess {Number} orders.id Order ID
 * @apiSuccess {Number} orders.userId User ID
 * @apiSuccess {Number} [orders.marketDayId] Market day ID
 * @apiSuccess {String} orders.status Order status
 * @apiSuccess {Number} orders.total Order total
 * @apiSuccess {String} orders.createdAt Order creation date
 * @apiSuccess {Object} orders.user User information
 * @apiSuccess {String} orders.user.name User's name
 * @apiSuccess {String} orders.user.email User's email
 * @apiSuccess {Object[]} orders.orderItems List of order items
 * @apiSuccess {Number} orders.orderItems.id Order item ID
 * @apiSuccess {Number} orders.orderItems.productId Product ID
 * @apiSuccess {Number} orders.orderItems.quantity Quantity
 * @apiSuccess {Number} orders.orderItems.price Price at time of purchase
 * @apiSuccess {Object} orders.orderItems.product Product information
 * @apiSuccess {String} orders.orderItems.product.name Product name
 * @apiSuccess {String} [orders.orderItems.product.imageUrl] Product image URL
 *
 * @apiError (429) TooManyRequests Too many requests
 */
export const GET = withRateLimit(
  async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const marketDayId = searchParams.get('marketDayId')
    const status = searchParams.get('status')

    const where = {
      ...(userId && { userId: parseInt(userId, 10) }),
      ...(marketDayId && { marketDayId: parseInt(marketDayId, 10) }),
      ...(status && { status }),
    }

    const orders = await db.order.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  },
  { limit: 100, windowMs: 60 * 1000 } // 100 requests per minute
)

/**
 * @api {post} /api/orders Create Order
 * @apiName CreateOrder
 * @apiGroup Orders
 * @apiVersion 1.0.0
 * @apiDescription Create a new order. Requires authentication.
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiBody {Number} userId User ID
 * @apiBody {Number} [marketDayId] Market day ID
 * @apiBody {Object[]} orderItems List of order items
 * @apiBody {Number} orderItems.productId Product ID
 * @apiBody {Number} orderItems.quantity Quantity
 * @apiBody {Number} orderItems.price Price at time of purchase
 * @apiBody {String} [status] Order status (default: PENDING)
 * @apiBody {Number} total Order total
 *
 * @apiSuccess (201) {Object} order Created order
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
 * @apiError (401) Unauthorized Authentication required
 * @apiError (429) TooManyRequests Too many requests
 */
export const POST = withRateLimit(
  withAuth(
    withValidation(createOrderSchema, async (req, data) => {
      const order = await db.order.create({
        data: {
          ...data,
          orderItems: {
            create: data.orderItems,
          },
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

      return NextResponse.json(order, { status: 201 })
    })
  ),
  { limit: 20, windowMs: 60 * 1000 } // 20 requests per minute
)
