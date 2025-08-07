import { MarketDayStatus } from '@/generated/prisma/client'
import {
  isClientMarketDay,
  ClientMarketDay as ClientMarketDayType,
} from '@/lib/schemas/marketDay'

export type ClientMarketDay = ClientMarketDayType

export { isClientMarketDay }

// Export MarketDay as an alias for backward compatibility
export type MarketDay = ClientMarketDay

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
