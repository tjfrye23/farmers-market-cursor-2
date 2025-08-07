import { db } from '@/lib/prisma'
import { ClientMarketSchedule } from '@/types/marketSchedule'
import { MarketScheduleStatus } from '@/generated/prisma/client'
import { z } from 'zod'

// Zod schemas for validation
export const updateMarketScheduleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  startTime: z.string().datetime('Start time must be a valid date'),
  endTime: z.string().datetime('End time must be a valid date'),
  onlineStartTime: z
    .string()
    .datetime('Online start time must be a valid date'),
  onlineEndTime: z.string().datetime('Online end time must be a valid date'),
  status: z.nativeEnum(MarketScheduleStatus, {
    errorMap: () => ({
      message: `Status must be one of: ${Object.values(MarketScheduleStatus).join(', ')}`,
    }),
  }),
  reoccurring: z.boolean(),
})

export const marketScheduleIdSchema = z
  .string()
  .regex(/^\d+$/, 'Schedule ID must be a number')
  .transform(Number)
  .pipe(z.number().positive('Schedule ID must be a positive number'))

export type UpdateMarketScheduleInput = z.infer<
  typeof updateMarketScheduleSchema
>

export async function getMarketSchedules(): Promise<ClientMarketSchedule[]> {
  const schedules = await db.marketSchedule.findMany()

  return schedules.map<ClientMarketSchedule>((schedule) => ({
    ...schedule,
    startDate: new Date(schedule.startTime),
    endDate: new Date(schedule.endTime),
    onlineStartDate: new Date(schedule.onlineStartTime),
    onlineEndDate: new Date(schedule.onlineEndTime),
    status: schedule.status,
  }))
}

export async function getMarketSchedulesWithSubscriptionStatus(
  vendorProfileId: number
): Promise<Array<ClientMarketSchedule & { isSubscribed: boolean }>> {
  const schedules = await db.marketSchedule.findMany({
    include: {
      subscriptions: {
        where: {
          id: vendorProfileId,
        },
      },
    },
  })

  return schedules.map<ClientMarketSchedule & { isSubscribed: boolean }>(
    (schedule) => ({
      ...schedule,
      startDate: new Date(schedule.startTime),
      endDate: new Date(schedule.endTime),
      onlineStartDate: new Date(schedule.onlineStartTime),
      onlineEndDate: new Date(schedule.onlineEndTime),
      status: schedule.status,
      isSubscribed: schedule.subscriptions.length > 0,
    })
  )
}

export async function getMarketScheduleById(
  id: number
): Promise<ClientMarketSchedule | null> {
  const schedule = await db.marketSchedule.findUnique({
    where: {
      id,
    },
  })

  if (!schedule) return null

  return {
    ...schedule,
    startDate: new Date(schedule.startTime),
    endDate: new Date(schedule.endTime),
    onlineStartDate: new Date(schedule.onlineStartTime),
    onlineEndDate: new Date(schedule.onlineEndTime),
    status: schedule.status,
  }
}

export async function isVendorSubscribedToSchedule(
  scheduleId: number,
  vendorProfileId: number
): Promise<boolean> {
  const subscription = await db.marketSchedule.findFirst({
    where: {
      id: scheduleId,
      subscriptions: {
        some: {
          id: vendorProfileId,
        },
      },
    },
  })

  return !!subscription
}

export async function subscribeVendorToSchedule(
  scheduleId: number,
  vendorProfileId: number
): Promise<boolean> {
  // Check if subscription already exists
  const existingSubscription = await db.marketSchedule.findFirst({
    where: {
      id: scheduleId,
      subscriptions: {
        some: {
          id: vendorProfileId,
        },
      },
    },
  })

  if (existingSubscription) {
    return true
  }

  // Add subscription
  await db.marketSchedule.update({
    where: { id: scheduleId },
    data: {
      subscriptions: {
        connect: { id: vendorProfileId },
      },
    },
  })

  return true
}

export async function unsubscribeVendorFromSchedule(
  scheduleId: number,
  vendorProfileId: number
): Promise<boolean> {
  await db.marketSchedule.update({
    where: { id: scheduleId },
    data: {
      subscriptions: {
        disconnect: { id: vendorProfileId },
      },
    },
  })

  return true
}

export async function updateMarketSchedule(
  scheduleId: number,
  data: UpdateMarketScheduleInput
): Promise<ClientMarketSchedule> {
  try {
    const updatedSchedule = await db.marketSchedule.update({
      where: { id: scheduleId },
      data: {
        name: data.name,
        description: data.description,
        location: data.location,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        onlineStartTime: new Date(data.onlineStartTime),
        onlineEndTime: new Date(data.onlineEndTime),
        status: data.status,
        reoccurring: data.reoccurring,
      },
    })

    return {
      ...updatedSchedule,
      startDate: new Date(updatedSchedule.startTime),
      endDate: new Date(updatedSchedule.endTime),
      onlineStartDate: new Date(updatedSchedule.onlineStartTime),
      onlineEndDate: new Date(updatedSchedule.onlineEndTime),
      status: updatedSchedule.status,
    }
  } catch (error) {
    console.error('Error updating market schedule:', error)
    throw error
  }
}

export async function deleteMarketSchedule(
  scheduleId: number
): Promise<boolean> {
  try {
    await db.marketSchedule.delete({
      where: { id: scheduleId },
    })

    return true
  } catch (error) {
    console.error('Error deleting market schedule:', error)
    throw error
  }
}
