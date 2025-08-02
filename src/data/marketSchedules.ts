import { db } from '@/lib/prisma'
import { MarketSchedule } from '@/types/marketSchedule'

export async function getMarketSchedules(): Promise<MarketSchedule[]> {
  const schedules = await db.marketSchedule.findMany()

  return schedules.map<MarketSchedule>((schedule) => ({
    ...schedule,
    startDate: new Date(schedule.startTime),
    endDate: new Date(schedule.endTime),
    onlineStartDate: new Date(schedule.onlineStartTime),
    onlineEndDate: new Date(schedule.onlineEndTime),
  }))
}
