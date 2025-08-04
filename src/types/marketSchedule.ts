export enum MarketScheduleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  PENDING_REVIEW = 'PENDING_REVIEW',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface MarketSchedule {
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
