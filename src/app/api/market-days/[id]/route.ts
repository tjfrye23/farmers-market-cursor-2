import { NextRequest, NextResponse } from 'next/server'
import { withAuth, withValidation, withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'
import { updateMarketDaySchema, type UpdateMarketDayInput } from '../route'

/**
 * @api {get} /api/market-days/:id Get Market Day
 * @apiName GetMarketDay
 * @apiGroup MarketDays
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} id Market day ID
 *
 * @apiSuccess {Object} marketDay Market day information
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
 * @apiSuccess {Object[]} marketDay.vendors List of registered vendors
 * @apiSuccess {Number} marketDay.vendors.id Vendor profile ID
 * @apiSuccess {String} marketDay.vendors.businessName Vendor's business name
 *
 * @apiError (400) InvalidId Invalid market day ID
 * @apiError (404) NotFound Market day not found
 * @apiError (429) TooManyRequests Too many requests
 */
export const GET = withRateLimit(
  async (req: NextRequest, context: { params: Record<string, string> }) => {
    const id = parseInt(context.params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid market day ID' },
        { status: 400 }
      )
    }

    const marketDay = await db.marketDay.findUnique({
      where: { id },
      include: {
        vendors: {
          select: {
            id: true,
            businessName: true,
          },
        },
      },
    })

    if (!marketDay) {
      return NextResponse.json(
        { error: 'Market day not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(marketDay)
  },
  { limit: 100, windowMs: 60 * 1000 }
)

/**
 * @api {put} /api/market-days/:id Update Market Day
 * @apiName UpdateMarketDay
 * @apiGroup MarketDays
 * @apiVersion 1.0.0
 * @apiDescription Update an existing market day. Requires authentication.
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {Number} id Market day ID
 *
 * @apiBody {String} [date] Market day date (ISO datetime)
 * @apiBody {String} [location] Market location
 * @apiBody {String} [description] Market description
 * @apiBody {String} [startTime] Market start time (ISO datetime)
 * @apiBody {String} [endTime] Market end time (ISO datetime)
 * @apiBody {Number} [maxVendors] Maximum number of vendors allowed
 * @apiBody {String} [status] Market status (DRAFT, PUBLISHED, CANCELLED)
 * @apiBody {Number} [organizerId] ID of the market organizer
 *
 * @apiSuccess {Object} marketDay Updated market day
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
 * @apiSuccess {Object[]} marketDay.vendors List of registered vendors
 * @apiSuccess {Number} marketDay.vendors.id Vendor profile ID
 * @apiSuccess {String} marketDay.vendors.businessName Vendor's business name
 *
 * @apiError (400) ValidationError Invalid input data
 * @apiError (400) InvalidId Invalid market day ID
 * @apiError (401) Unauthorized Authentication required
 * @apiError (429) TooManyRequests Too many requests
 */
export const PUT = withRateLimit(
  withAuth(
    withValidation(
      updateMarketDaySchema,
      async (req, data: UpdateMarketDayInput, context) => {
        const id = parseInt(context.params.id, 10)
        if (isNaN(id)) {
          return NextResponse.json(
            { error: 'Invalid market day ID' },
            { status: 400 }
          )
        }

        const marketDay = await db.marketDay.update({
          where: { id },
          data,
          include: {
            vendors: {
              select: {
                id: true,
                businessName: true,
              },
            },
          },
        })

        return NextResponse.json(marketDay)
      }
    )
  ),
  { limit: 20, windowMs: 60 * 1000 }
)

/**
 * @api {delete} /api/market-days/:id Delete Market Day
 * @apiName DeleteMarketDay
 * @apiGroup MarketDays
 * @apiVersion 1.0.0
 * @apiDescription Delete a market day. Requires authentication.
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {Number} id Market day ID
 *
 * @apiSuccess (204) NoContent Market day successfully deleted
 *
 * @apiError (400) InvalidId Invalid market day ID
 * @apiError (401) Unauthorized Authentication required
 * @apiError (429) TooManyRequests Too many requests
 */
export const DELETE = withRateLimit(
  withAuth(
    async (req: NextRequest, context: { params: Record<string, string> }) => {
      const id = parseInt(context.params.id, 10)
      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid market day ID' },
          { status: 400 }
        )
      }

      await db.marketDay.delete({
        where: { id },
      })

      return new NextResponse(null, { status: 204 })
    }
  ),
  { limit: 20, windowMs: 60 * 1000 }
)
