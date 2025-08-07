import z from 'zod'
import { MarketScheduleStatus } from '@/generated/prisma/client'

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

export const marketScheduleIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'Schedule ID must be a number')
    .transform(Number),
})

export type UpdateMarketScheduleInput = z.infer<
  typeof updateMarketScheduleSchema
>
