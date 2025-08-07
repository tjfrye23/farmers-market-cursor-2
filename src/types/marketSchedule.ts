import { MarketScheduleStatus } from '@/generated/prisma/client'

export interface ClientMarketSchedule {
  id: number
  name: string
  description: string
  startDate: Date
  endDate: Date
  onlineStartDate: Date
  onlineEndDate: Date
  location: string
  status: MarketScheduleStatus
}

// Re-export MarketScheduleStatus for convenience
export { MarketScheduleStatus }
