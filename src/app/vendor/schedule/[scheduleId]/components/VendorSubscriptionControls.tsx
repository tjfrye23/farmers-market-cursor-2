'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  ClientMarketSchedule,
  MarketScheduleStatus,
} from '@/types/marketSchedule'
import { Session } from 'next-auth'
import { UserRole } from '@/generated/prisma/client'

interface VendorSubscriptionControlsProps {
  schedule: ClientMarketSchedule
  user: Session['user']
  isSubscribed: boolean
  isLoading: boolean
  currentStatus: MarketScheduleStatus
  onSubscribe: () => void
  onUnsubscribe: () => void
}

export function VendorSubscriptionControls({
  schedule,
  user,
  isSubscribed,
  isLoading,
  currentStatus,
  onSubscribe,
  onUnsubscribe,
}: VendorSubscriptionControlsProps) {
  if (
    user?.role !== UserRole.VENDOR ||
    currentStatus !== MarketScheduleStatus.ACTIVE
  ) {
    return null
  }

  return (
    <>
      {isSubscribed ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={isLoading}>
              {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unsubscribe from Market Schedule</DialogTitle>
              <DialogDescription>
                Are you sure you want to unsubscribe from &quot;{schedule.name}
                &quot;? You will no longer receive notifications about this
                market.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => {}}>
                Cancel
              </Button>
              <Button
                onClick={onUnsubscribe}
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Button onClick={onSubscribe} disabled={isLoading}>
          {isLoading ? 'Subscribing...' : 'Subscribe to Market'}
        </Button>
      )}
    </>
  )
}
