import { z } from 'zod'

export type ClientMarketDay = z.infer<typeof clientMarketDaySchema>

const clientMarketDaySchema = z.object({
  id: z.number(),
  location: z.string(),
  description: z.string(),
  status: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  onlineStartTime: z.string(),
  onlineEndTime: z.string(),
  name: z.string(),
  marketSchedule: z.object({
    id: z.number(),
  }),
})

export function isClientMarketDay(obj: unknown): obj is ClientMarketDay {
  return clientMarketDaySchema.safeParse(obj).success
}
// End of Selection
