export interface MarketDay {
  id: number
  location: string
  description: string
  status: string
  startTime: string
  endTime: string
  name: string
  marketSchedule: {
    id: number
  }
}
