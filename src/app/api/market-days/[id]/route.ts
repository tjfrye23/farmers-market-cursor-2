// import { NextRequest, NextResponse } from 'next/server'
// import { withAuth, withValidation, withRateLimit } from '@/lib/api-handler'
// import { db } from '@/lib/prisma'
// import { updateMarketDaySchema, type UpdateMarketDayInput } from '../route'

// export const GET = withRateLimit(
//   async (req: NextRequest, context: { params: Record<string, string> }) => {
//     const id = parseInt(context.params.id, 10)
//     if (isNaN(id)) {
//       return NextResponse.json(
//         { error: 'Invalid market day ID' },
//         { status: 400 }
//       )
//     }

//     const marketDay = await db.marketDay.findUnique({
//       where: { id },
//       include: {
//         vendors: {
//           select: {
//             id: true,
//             businessName: true,
//           },
//         },
//       },
//     })

//     if (!marketDay) {
//       return NextResponse.json(
//         { error: 'Market day not found' },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json(marketDay)
//   },
//   { limit: 100, windowMs: 60 * 1000 }
// )

// export const PUT = withRateLimit(
//   withAuth(
//     withValidation(
//       updateMarketDaySchema,
//       async (req, data: UpdateMarketDayInput, context) => {
//         const id = parseInt(context.params.id, 10)
//         if (isNaN(id)) {
//           return NextResponse.json(
//             { error: 'Invalid market day ID' },
//             { status: 400 }
//           )
//         }

//         const marketDay = await db.marketDay.update({
//           where: { id },
//           data,
//           include: {
//             vendors: {
//               select: {
//                 id: true,
//                 businessName: true,
//               },
//             },
//           },
//         })

//         return NextResponse.json(marketDay)
//       }
//     )
//   ),
//   { limit: 20, windowMs: 60 * 1000 }
// )

// export const DELETE = withRateLimit(
//   withAuth(
//     async (req: NextRequest, context: { params: Record<string, string> }) => {
//       const id = parseInt(context.params.id, 10)
//       if (isNaN(id)) {
//         return NextResponse.json(
//           { error: 'Invalid market day ID' },
//           { status: 400 }
//         )
//       }

//       await db.marketDay.delete({
//         where: { id },
//       })

//       return new NextResponse(null, { status: 204 })
//     }
//   ),
//   { limit: 20, windowMs: 60 * 1000 }
// )
