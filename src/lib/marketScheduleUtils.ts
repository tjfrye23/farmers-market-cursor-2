import { MarketScheduleStatus } from '@/types/marketSchedule'

export const getStatusBadgeVariant = (status: MarketScheduleStatus) => {
  switch (status) {
    case MarketScheduleStatus.ACTIVE:
      return 'default'
    case MarketScheduleStatus.PENDING_REVIEW:
      return 'secondary'
    case MarketScheduleStatus.INACTIVE:
    case MarketScheduleStatus.CANCELLED:
      return 'destructive'
    case MarketScheduleStatus.DRAFT:
    case MarketScheduleStatus.PUBLISHED:
    default:
      return 'secondary'
  }
}

export const getStatusDisplayName = (status: MarketScheduleStatus): string => {
  switch (status) {
    case MarketScheduleStatus.DRAFT:
      return 'Draft'
    case MarketScheduleStatus.PUBLISHED:
      return 'Published'
    case MarketScheduleStatus.CANCELLED:
      return 'Cancelled'
    case MarketScheduleStatus.PENDING_REVIEW:
      return 'Pending Review'
    case MarketScheduleStatus.ACTIVE:
      return 'Active'
    case MarketScheduleStatus.INACTIVE:
      return 'Inactive'
    default:
      return status
  }
}

export const isActiveStatus = (status: MarketScheduleStatus): boolean => {
  return status === MarketScheduleStatus.ACTIVE
}

export const isEditableStatus = (status: MarketScheduleStatus): boolean => {
  return [
    MarketScheduleStatus.DRAFT,
    MarketScheduleStatus.PENDING_REVIEW,
    MarketScheduleStatus.ACTIVE,
  ].includes(status)
}

export const getAvailableStatusOptions = (): Array<{
  value: MarketScheduleStatus
  label: string
}> => {
  return [
    { value: MarketScheduleStatus.PENDING_REVIEW, label: 'Pending Review' },
    { value: MarketScheduleStatus.ACTIVE, label: 'Active' },
    { value: MarketScheduleStatus.INACTIVE, label: 'Inactive' },
  ]
}
