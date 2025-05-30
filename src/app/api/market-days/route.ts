import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAuth, withValidation, withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'

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
})

export const updateMarketDaySchema = createMarketDaySchema.partial()

export type CreateMarketDayInput = z.infer<typeof createMarketDaySchema>
export type UpdateMarketDayInput = z.infer<typeof updateMarketDaySchema>

/**
 * @api {get} /api/market-days List Market Days
 * @apiName GetMarketDays
 * @apiGroup MarketDays
 * @apiVersion 1.0.0
 *
 * @apiQuery {String} [startDate] Filter market days after this date
 * @apiQuery {String} [endDate] Filter market days before this date
 * @apiQuery {String} [status] Filter by status (DRAFT, PUBLISHED, CANCELLED)
 * @apiQuery {String} [organizerId] Filter by organizer ID
 *
 * @apiSuccess {Object[]} marketDays List of market days
 * @apiSuccess {Number} marketDays.id Market day ID
 * @apiSuccess {String} marketDays.date Market day date
 * @apiSuccess {String} marketDays.location Market location
 * @apiSuccess {String} [marketDays.description] Market description
 * @apiSuccess {String} marketDays.startTime Market start time
 * @apiSuccess {String} marketDays.endTime Market end time
 * @apiSuccess {Number} marketDays.maxVendors Maximum number of vendors
 * @apiSuccess {String} marketDays.status Market status
 * @apiSuccess {Object} marketDays.organizer Organizer information
 * @apiSuccess {String} marketDays.organizer.name Organizer's name
 * @apiSuccess {String} marketDays.organizer.email Organizer's email
 * @apiSuccess {Object[]} marketDays.vendors List of registered vendors
 * @apiSuccess {Number} marketDays.vendors.id Vendor profile ID
 * @apiSuccess {String} marketDays.vendors.businessName Vendor's business name
 *
 * @apiError (429) TooManyRequests Too many requests
 */
export const GET = withRateLimit(
  async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')
    const organizerId = searchParams.get('organizerId')

    const where = {
      ...(startDate && { date: { gte: new Date(startDate) } }),
      ...(endDate && { date: { lte: new Date(endDate) } }),
      ...(status && { status }),
      ...(organizerId && { organizerId: parseInt(organizerId, 10) }),
    }

    const marketDays = await db.marketDay.findMany({
      where,
      include: {
        vendors: {
          select: {
            id: true,
            businessName: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    return NextResponse.json(marketDays)
  },
  { limit: 100, windowMs: 60 * 1000 } // 100 requests per minute
)

/**
 * @api {post} /api/market-days Create Market Day
 * @apiName CreateMarketDay
 * @apiGroup MarketDays
 * @apiVersion 1.0.0
 * @apiDescription Create a new market day. Requires authentication.
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiBody {String} date Market day date (ISO datetime)
 * @apiBody {String} location Market location
 * @apiBody {String} [description] Market description
 * @apiBody {String} startTime Market start time (ISO datetime)
 * @apiBody {String} endTime Market end time (ISO datetime)
 * @apiBody {Number} maxVendors Maximum number of vendors allowed
 * @apiBody {String} status Market status (DRAFT, PUBLISHED, CANCELLED)
 * @apiBody {Number} organizerId ID of the market organizer
 *
 * @apiSuccess (201) {Object} marketDay Created market day
 * @apiSuccess {Number} marketDay.id Market day ID
 * @apiSuccess {String} marketDay.date Market day date
 * @apiSuccess {String} marketDay.location Market location
 * @apiSuccess {String} [marketDay.description] Market description
 * @apiSuccess {String} marketDay.startTime Market start time
 * @apiSuccess {String} marketDay.endTime Market end time
 * @apiSuccess {Number} marketDay.maxVendors Maximum number of vendors
 * @apiSuccess {String} marketDay.status Market status
 * @apiSuccess {Object} marketDay.organizer Organizer information
 * @apiSuccess {String} marketDay.organizer.name Organizer's name
 * @apiSuccess {String} marketDay.organizer.email Organizer's email
 *
 * @apiError (400) ValidationError Invalid input data
 * @apiError (401) Unauthorized Authentication required
 * @apiError (429) TooManyRequests Too many requests
 */
export const POST = withRateLimit(
  withAuth(
    withValidation(createMarketDaySchema, async (req, data) => {
      const marketDay = await db.marketDay.create({
        data,
        include: {
          vendors: true,
        },
      })

      return NextResponse.json(marketDay, { status: 201 })
    })
  ),
  { limit: 20, windowMs: 60 * 1000 } // 20 requests per minute
)
