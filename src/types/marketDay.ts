export interface MarketDay {
  id: number
  location: string
  description: string
  status: string
  startTime: string
  endTime: string
  marketScheduleId: number
  marketSchedule: {
    id: number
    name: string
  }
}
