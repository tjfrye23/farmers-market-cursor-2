import { z } from 'zod'
import { MarketDayStatus } from '@/generated/prisma/client'

export const clientMarketDaySchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  onlineStartTime: z.string().datetime(),
  onlineEndTime: z.string().datetime(),
  location: z.string(),
  description: z.string(),
  status: z.nativeEnum(MarketDayStatus),
  marketSchedule: z.object({
    id: z.number().int().positive(),
  }),
})

// Schema for query parameters
export const marketDaysQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  status: z.nativeEnum(MarketDayStatus).optional(),
  organizerId: z
    .string()
    .transform((val) => {
      const parsed = parseInt(val, 10)
      if (isNaN(parsed)) {
        throw new Error('Invalid organizerId')
      }
      return parsed
    })
    .optional(),
  active: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
})

export function isClientMarketDay(
  obj: unknown
): obj is z.infer<typeof clientMarketDaySchema> {
  return clientMarketDaySchema.safeParse(obj).success
}

export type ClientMarketDay = z.infer<typeof clientMarketDaySchema>
export type MarketDaysQuery = z.infer<typeof marketDaysQuerySchema>
