import { db } from '@/lib/prisma'
import { MarketDay } from '@/types/marketDay'

/**
 * Fetch all market days, including schedules and vendors.
 */
export async function getMarketDays(): Promise<MarketDay[]> {
  const marketDays = await db.marketDay.findMany({
    include: {
      marketSchedule: true,
      vendors: true,
    },
    orderBy: { startTime: 'asc' },
  })
  return marketDays.map<MarketDay>((marketDay) => {
    return {
      id: marketDay.id,
      name: marketDay.marketSchedule.name,
      startTime: marketDay.startTime.toISOString(),
      endTime: marketDay.endTime.toISOString(),
      location: marketDay.marketSchedule.location,
      description: marketDay.marketSchedule.description,
      status: marketDay.status,
      marketSchedule: {
        id: marketDay.marketSchedule.id,
      },
    }
  })
}
