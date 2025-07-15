import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withAuth, withRateLimit } from '@/lib/api-handler'
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

// POST body schema for status update
const updateOrderStatusSchema = z.object({
  orderId: z.number().int().positive(),
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
})

// /**
//  * @api {get} /api/orders List Orders
//  * @apiName GetOrders
//  * @apiGroup Orders
//  * @apiVersion 1.0.0
//  *
//  * @apiQuery {String} [userId] Filter orders by user ID
//  * @apiQuery {String} [marketDayId] Filter orders by market day ID
//  * @apiQuery {String} [status] Filter by status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
//  *
//  * @apiSuccess {Object[]} orders List of orders
//  * @apiSuccess {Number} orders.id Order ID
//  * @apiSuccess {Number} orders.userId User ID
//  * @apiSuccess {Number} [orders.marketDayId] Market day ID
//  * @apiSuccess {String} orders.status Order status
//  * @apiSuccess {Number} orders.total Order total
//  * @apiSuccess {String} orders.createdAt Order creation date
//  * @apiSuccess {Object} orders.user User information
//  * @apiSuccess {String} orders.user.name User's name
//  * @apiSuccess {String} orders.user.email User's email
//  * @apiSuccess {Object[]} orders.orderItems List of order items
//  * @apiSuccess {Number} orders.orderItems.id Order item ID
//  * @apiSuccess {Number} orders.orderItems.productId Product ID
//  * @apiSuccess {Number} orders.orderItems.quantity Quantity
//  * @apiSuccess {Number} orders.orderItems.price Price at time of purchase
//  * @apiSuccess {Object} orders.orderItems.product Product information
//  * @apiSuccess {String} orders.orderItems.product.name Product name
//  * @apiSuccess {String} [orders.orderItems.product.imageUrl] Product image URL
//  *
//  * @apiError (429) TooManyRequests Too many requests
//  */
// export const GET = withRateLimit(
//   withAuth(async (req, context) => {
//     try {
//       const user = context.session?.user
//       if (!user || user.role !== 'vendor' || !user.vendorProfile) {
//         console.log('Forbidden', user)
//         return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
//       }
//       // Find vendor profile
//       const vendorProfile = await db.vendorProfile.findUnique({
//         where: { id: user.vendorProfile?.id },
//         select: { id: true },
//       })

//       if (!vendorProfile) {
//         return NextResponse.json([], { status: 200 })
//       }

//       // Find all orders where any orderItem.product.vendorProfileId matches this vendor
//       const orders = await db.order.findMany({
//         where: {
//           orderItems: {
//             some: {
//               marketDayProduct: {
//                 product: { vendorProfileId: vendorProfile.id },
//               },
//             },
//           },
//         },
//         include: {
//           user: { select: { name: true, email: true } },
//           marketDay: {
//             select: {
//               id: true,
//               startTime: true,
//               marketSchedule: {
//                 select: {
//                   id: true,
//                   name: true,
//                 },
//               },
//             },
//           },
//           orderItems: {
//             where: {
//               marketDayProduct: {
//                 product: { vendorProfileId: vendorProfile.id },
//               },
//             },
//             include: {
//               productUnit: true,
//               marketDayProduct: {
//                 include: {
//                   product: {
//                     select: {
//                       name: true,
//                       imageUrl: true,
//                       vendorProfileId: true,
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//         orderBy: { createdAt: 'desc' },
//       })

//       const mappedOrders = orders.map((order) => {
//         const computedStatus: 'processing' | 'processed' =
//           order.orderItems.some((item) => item.status === 'processing')
//             ? 'processing'
//             : 'processed'

//         const marketDay: Order['marketDay'] = {
//           id: order.marketDay.id,
//           name: order.marketDay.marketSchedule.name,
//           date: order.marketDay.startTime
//             ? order.marketDay.startTime.toISOString().split('T')[0]
//             : '',
//         }

//         let vendorTotal = 0
//         const orderItems: Order['orderItems'] = order.orderItems.map(
//           (item): Order['orderItems'][number] => {
//             vendorTotal += item.price * item.quantity
//             return {
//               id: item.id,
//               quantity: item.quantity,
//               price: item.price,
//               unit: item.productUnit.name,
//               status: item.status,
//               name: item.marketDayProduct.product.name,
//               imageUrl: item.marketDayProduct.product.imageUrl,
//             }
//           }
//         )

//         const vendorOrder: Order = {
//           id: order.id,
//           date: order.createdAt.toISOString().split('T')[0],
//           user: order.user,
//           status: computedStatus,
//           orderItems,
//           marketDay,
//           total: vendorTotal,
//         }

//         return vendorOrder
//       })

//       return NextResponse.json(mappedOrders)
//     } catch (e) {
//       console.error('Failed to fetch market days:', e)
//       return NextResponse.json(
//         { error: 'Failed to fetch market days' },
//         { status: 500 }
//       )
//     }
//   }),
//   { limit: 100, windowMs: 60 * 1000 }
// )

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
            marketDayProduct: {
              include: {
                product: { select: { vendorProfileId: true } },
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
        item.marketDayProduct.product.vendorProfileId === vendorProfile.id
    )
    if (vendorOrderItems.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    // Update the status of all orderItems for this vendor
    await Promise.all(
      vendorOrderItems.map((item) =>
        db.orderItem.update({
          where: { id: item.id },
          data: { status },
        })
      )
    )
    return NextResponse.json({ success: true })
  }),
  { limit: 20, windowMs: 60 * 1000 }
)
