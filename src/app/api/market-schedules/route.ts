import { NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'

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
