import { db } from '@/lib/prisma'
import { MarketSchedule } from '@/types/marketSchedule'

export async function getVendorMarketSchedules(
  vendorId: number
): Promise<MarketSchedule[]> {
  const schedules = await db.marketSchedule.findMany({
    where: {
      subscriptions: {
        some: {
          id: vendorId,
        },
      },
    },
  })

  return schedules.map<MarketSchedule>((schedule) => ({
    ...schedule,
    startDate: new Date(schedule.startTime),
    endDate: new Date(schedule.endTime),
    onlineStartDate: new Date(schedule.onlineStartTime),
    onlineEndDate: new Date(schedule.onlineEndTime),
  }))
}
