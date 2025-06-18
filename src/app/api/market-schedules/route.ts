import { NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'

/**
 * @api {get} /api/market-schedules List Market Schedules
 * @apiName GetMarketSchedules
 * @apiGroup MarketSchedules
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object[]} schedules List of market schedules
 * @apiSuccess {Number} schedules.id Schedule ID
 * @apiSuccess {String} schedules.name Market name
 * @apiSuccess {String} schedules.description Market description
 * @apiSuccess {String} schedules.startDate Start date (YYYY-MM-DD)
 * @apiSuccess {String} schedules.endDate End date (YYYY-MM-DD)
 * @apiSuccess {String} schedules.dayOfWeek Day of the week
 * @apiSuccess {String} schedules.startTime Start time (HH:mm:ss)
 * @apiSuccess {String} schedules.endTime End time (HH:mm:ss)
 * @apiSuccess {String} schedules.location Market location
 * @apiSuccess {String} schedules.status Market status
 * @apiSuccess {Object[]} schedules.vendors List of vendors
 * @apiSuccess {Number} schedules.vendors.id Vendor ID
 * @apiSuccess {String} schedules.vendors.businessName Vendor business name
 *
 * @apiError (429) TooManyRequests Too many requests
 */
export const GET = withRateLimit(
  async () => {
    const schedules = await db.marketSchedule.findMany({
      include: {
        subscriptions: {
          select: {
            id: true,
            businessName: true,
          },
        },
      },
    })

    // Convert Date fields to ISO strings for the frontend
    const formattedSchedules = schedules.map((schedule) => ({
      ...schedule,
      startTime: schedule.startTime.toISOString(),
      endTime: schedule.endTime.toISOString(),
      onlineStartTime: schedule.onlineStartTime.toISOString(),
      onlineEndTime: schedule.onlineEndTime.toISOString(),
      vendors: schedule.subscriptions,
    }))

    return NextResponse.json(formattedSchedules)
  },
  { limit: 100, windowMs: 60 * 1000 }
)
