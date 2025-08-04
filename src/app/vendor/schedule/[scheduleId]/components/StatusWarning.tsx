'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MarketScheduleStatus } from '@/types/marketSchedule'

interface StatusWarningProps {
  currentStatus: MarketScheduleStatus
}

export function StatusWarning({ currentStatus }: StatusWarningProps) {
  if (currentStatus === MarketScheduleStatus.ACTIVE) {
    return null
  }

  return (
    <div className="mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-left text-amber-600">
            <Badge variant="secondary">{currentStatus}</Badge>
            <p className="text-sm">
              This market schedule is {currentStatus} and not available for
              subscription.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
