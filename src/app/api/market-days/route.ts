import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'
import { ClientMarketDay } from '@/types/marketDay'

// Validation schemas
export const createMarketDaySchema = z.object({
  date: z.string().datetime(),
  location: z.string().min(1),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  maxVendors: z.number().int().positive(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED']),
  organizerId: z.number().int().positive(),
  onlineStartTime: z.string().datetime(),
  onlineEndTime: z.string().datetime(),
  marketScheduleId: z.number().int().positive(),
})

export const updateMarketDaySchema = createMarketDaySchema.partial()

export type CreateMarketDayInput = z.infer<typeof createMarketDaySchema>
export type UpdateMarketDayInput = z.infer<typeof updateMarketDaySchema>

export const GET = withRateLimit(
  async (
    req: NextRequest
  ): Promise<NextResponse<ClientMarketDay[] | { error: string }>> => {
    const searchParams = req.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')
    const organizerId = searchParams.get('organizerId')
    const active = searchParams.get('active') === 'true'

    const where = {
      ...(startDate && { date: { gte: new Date(startDate) } }),
      ...(endDate && { date: { lte: new Date(endDate) } }),
      ...(status && { status }),
      ...(organizerId && { organizerId: parseInt(organizerId, 10) }),
    }

    try {
      const marketDays = await db.marketDay.findMany({
        where,
        include: {
          vendors: {
            select: {
              id: true,
              businessName: true,
            },
          },
          marketSchedule: true,
        },
        orderBy: {
          startTime: 'asc',
        },
      })

      let filteredMarketDays = marketDays
      if (active) {
        const now = new Date()
        filteredMarketDays = marketDays.filter((day) => {
          if (day.status !== 'PUBLISHED') return false
          const onlineStart = new Date(day.onlineStartTime)
          const onlineEnd = new Date(day.onlineEndTime)
          return now >= onlineStart && now <= onlineEnd
        })
      }

      const clientMarketDays = filteredMarketDays.map<ClientMarketDay>(
        (day) => ({
          ...day,
          startTime: day.startTime.toISOString(),
          endTime: day.endTime.toISOString(),
          onlineStartTime: day.onlineStartTime.toISOString(),
          onlineEndTime: day.onlineEndTime.toISOString(),
          name: day.marketSchedule.name,
          location: day.marketSchedule.location,
          description: day.marketSchedule.description,
        })
      )

      return NextResponse.json(clientMarketDays)
    } catch (error) {
      console.error('Failed to fetch market days:', error)
      return NextResponse.json(
        { error: 'Failed to fetch market days' },
        { status: 500 }
      )
    }
  },
  { limit: 100, windowMs: 60 * 1000 } // 100 requests per minute
)

// export const POST = withRateLimit(
//   withAuth(
//     withValidation(createMarketDaySchema, async (req, data) => {
//       const marketDay = await db.marketDay.create({
//         data,
//         include: {
//           vendors: true,
//         },
//       })

//       return NextResponse.json(marketDay, { status: 201 })
//     })
//   ),
//   { limit: 20, windowMs: 60 * 1000 } // 20 requests per minute
// )
