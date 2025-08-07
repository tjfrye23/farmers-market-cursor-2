'use client'

import {
  ClientMarketSchedule,
  MarketScheduleStatus,
} from '@/types/marketSchedule'
import { Session } from 'next-auth'
import { HeaderNavigation } from './HeaderNavigation'
import { VendorSubscriptionControls } from './VendorSubscriptionControls'
import { AdminControls } from './AdminControls'
import { EditModeControls } from './EditModeControls'

interface ScheduleHeaderProps {
  schedule: ClientMarketSchedule
  user: Session['user']
  isSubscribed: boolean
  isLoading: boolean
  isEditing: boolean
  currentStatus: MarketScheduleStatus
  onSubscribe: () => void
  onUnsubscribe: () => void
  onEdit: () => void
  onCancelEdit: () => void
  onSave: () => void
  onDelete: () => void
}

export function ScheduleHeader({
  schedule,
  user,
  isSubscribed,
  isLoading,
  isEditing,
  currentStatus,
  onSubscribe,
  onUnsubscribe,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: ScheduleHeaderProps) {
  return (
    <div className="mb-6">
      <div className="mb-4 flex items-start justify-between">
        <HeaderNavigation schedule={schedule} />

        <div className="flex gap-2">
          <VendorSubscriptionControls
            schedule={schedule}
            user={user}
            isSubscribed={isSubscribed}
            isLoading={isLoading}
            currentStatus={currentStatus}
            onSubscribe={onSubscribe}
            onUnsubscribe={onUnsubscribe}
          />

          <AdminControls
            schedule={schedule}
            user={user}
            isEditing={isEditing}
            onEdit={onEdit}
            onDelete={onDelete}
          />

          <EditModeControls
            isEditing={isEditing}
            onCancelEdit={onCancelEdit}
            onSave={onSave}
          />
        </div>
      </div>
    </div>
  )
}
