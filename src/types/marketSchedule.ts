export interface MarketSchedule {
  id: number
  name: string
  description?: string
  startDate: Date
  endDate: Date
  dayOfWeek: string
  //TODO: remove times
  startTime: Date
  endTime: Date
  onlineStartDate: Date
  onlineEndDate: Date
  location: string
  status: 'active' | 'inactive'
  vendors: { id: number; businessName: string }[]
}
