import { MarketScheduleStatus as PrismaMarketScheduleStatus } from '@/generated/prisma'

export enum MarketScheduleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  PENDING_REVIEW = 'PENDING_REVIEW',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Helper function to convert Prisma enum to our enum
export function toMarketScheduleStatus(
  status: PrismaMarketScheduleStatus
): MarketScheduleStatus {
  return status as MarketScheduleStatus
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
