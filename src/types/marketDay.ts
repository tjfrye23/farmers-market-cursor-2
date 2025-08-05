import { MarketDayStatus as PrismaMarketDayStatus } from '@/generated/prisma'

export enum MarketDayStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export interface ClientMarketDay {
  id: number
  name: string
  startTime: string
  endTime: string
  onlineStartTime: string
  onlineEndTime: string
  location: string
  description: string
  status: MarketDayStatus
  marketSchedule: {
    id: number
  }
}

// Helper function to convert Prisma enum to our enum
export function toMarketDayStatus(
  status: PrismaMarketDayStatus
): MarketDayStatus {
  return status as MarketDayStatus
}

// Helper function to get status display name
export function getMarketDayStatusDisplayName(status: MarketDayStatus): string {
  switch (status) {
    case MarketDayStatus.DRAFT:
      return 'Draft'
    case MarketDayStatus.PUBLISHED:
      return 'Published'
    case MarketDayStatus.CANCELLED:
      return 'Cancelled'
    case MarketDayStatus.ACTIVE:
      return 'Active'
    case MarketDayStatus.COMPLETED:
      return 'Completed'
    default:
      return status
  }
}

// Helper function to get status color variant
export function getMarketDayStatusVariant(
  status: MarketDayStatus
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case MarketDayStatus.COMPLETED:
      return 'secondary'
    case MarketDayStatus.ACTIVE:
      return 'default'
    case MarketDayStatus.CANCELLED:
      return 'destructive'
    case MarketDayStatus.PUBLISHED:
      return 'default'
    case MarketDayStatus.DRAFT:
    default:
      return 'outline'
  }
}
