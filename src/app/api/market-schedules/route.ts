import { NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/api-handler'
import { getMarketSchedules } from '@/data/marketSchedules'
import { ClientMarketSchedule } from '@/types/marketSchedule'

export const GET = withRateLimit(
  async (): Promise<
    NextResponse<ClientMarketSchedule[] | { error: string }>
  > => {
    const schedules = await getMarketSchedules()
    return NextResponse.json(schedules)
  },
  { limit: 100, windowMs: 60 * 1000 }
)
