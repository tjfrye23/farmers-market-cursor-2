import { db } from '@/lib/prisma'
import { ClientMarketDay, toMarketDayStatus } from '@/types/marketDay'

/**
 * Fetch all market days, including schedules and vendors.
 */
export async function getMarketDays(): Promise<ClientMarketDay[]> {
  const marketDays = await db.marketDay.findMany({
    include: {
      marketSchedule: true,
      vendors: true,
    },
    orderBy: { startTime: 'asc' },
  })
  return marketDays.map<ClientMarketDay>((marketDay) => {
    return {
      id: marketDay.id,
      name: marketDay.marketSchedule.name,
      startTime: marketDay.startTime.toISOString(),
      endTime: marketDay.endTime.toISOString(),
      onlineStartTime: marketDay.onlineStartTime.toISOString(),
      onlineEndTime: marketDay.onlineEndTime.toISOString(),
      location: marketDay.marketSchedule.location,
      description: marketDay.marketSchedule.description,
      status: toMarketDayStatus(marketDay.status),
      marketSchedule: {
        id: marketDay.marketSchedule.id,
      },
    }
  })
}

/**
 * Fetch market days for a specific vendor (only from schedules they're subscribed to).
 */
export async function getVendorMarketDays(
  vendorId: number
): Promise<ClientMarketDay[]> {
  const vendorProfile = await db.vendorProfile.findUnique({
    where: { id: vendorId },
    include: {
      marketSchedules: {
        include: {
          marketDay: {
            include: {
              marketSchedule: true,
            },
            orderBy: {
              startTime: 'asc',
            },
          },
        },
      },
    },
  })

  if (!vendorProfile) {
    return []
  }

  // Get all market days from subscribed schedules
  const marketDays = vendorProfile.marketSchedules.flatMap(
    (schedule) => schedule.marketDay
  )

  return marketDays.map<ClientMarketDay>((marketDay) => {
    return {
      id: marketDay.id,
      name: marketDay.marketSchedule.name,
      startTime: marketDay.startTime.toISOString(),
      endTime: marketDay.endTime.toISOString(),
      onlineStartTime: marketDay.onlineStartTime.toISOString(),
      onlineEndTime: marketDay.onlineEndTime.toISOString(),
      location: marketDay.marketSchedule.location,
      description: marketDay.marketSchedule.description,
      status: toMarketDayStatus(marketDay.status),
      marketSchedule: {
        id: marketDay.marketSchedule.id,
      },
    }
  })
}

export async function getMarketDayById(
  id: string
): Promise<ClientMarketDay | null> {
  const marketDay = await db.marketDay.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      marketSchedule: true,
    },
  })

  if (!marketDay) {
    return null
  }

  return {
    id: marketDay.id,
    name: marketDay.marketSchedule.name,
    startTime: marketDay.startTime.toISOString(),
    endTime: marketDay.endTime.toISOString(),
    onlineStartTime: marketDay.onlineStartTime.toISOString(),
    onlineEndTime: marketDay.onlineEndTime.toISOString(),
    location: marketDay.marketSchedule.location,
    description: marketDay.marketSchedule.description,
    status: toMarketDayStatus(marketDay.status),
    marketSchedule: {
      id: marketDay.marketSchedule.id,
    },
  }
}
