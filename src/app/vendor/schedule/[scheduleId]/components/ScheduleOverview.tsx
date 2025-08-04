'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Store } from 'lucide-react'
import { MarketSchedule } from '@/types/marketSchedule'
import {
  getStatusBadgeVariant,
  getStatusDisplayName,
} from '@/lib/marketScheduleUtils'
import { LocationMap } from './LocationMap'

interface ScheduleOverviewProps {
  schedule: MarketSchedule
  isEditing: boolean
}

export function ScheduleOverview({
  schedule,
  isEditing,
}: ScheduleOverviewProps) {
  if (isEditing) {
    return null
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Overview
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant={getStatusBadgeVariant(schedule.status)}>
              {getStatusDisplayName(schedule.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-left">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-medium">
              <Store className="h-4 w-4" />
              Market Information
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Date:</span>{' '}
                {schedule.startDate.toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Hours:</span>{' '}
                {formatTime(schedule.startDate)} -{' '}
                {formatTime(schedule.endDate)}
              </div>
              {schedule.location && (
                <div>
                  <span className="font-medium">Location:</span>{' '}
                  {schedule.location}
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-medium">
              <Clock className="h-4 w-4" />
              Online Shop Information
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Period:</span>{' '}
                {schedule.onlineStartDate.toLocaleDateString()} -{' '}
                {schedule.onlineEndDate.toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Hours:</span>{' '}
                {formatTime(schedule.onlineStartDate)} -{' '}
                {formatTime(schedule.onlineEndDate)}
              </div>
            </div>
          </div>
        </div>
        {schedule.description && (
          <div className="mt-6">
            <h4 className="mb-2 font-medium">Description</h4>
            <p className="text-sm text-gray-600">{schedule.description}</p>
          </div>
        )}

        {/* Location Map */}
        <div className="mt-6 w-1/2">
          <LocationMap schedule={schedule} />
        </div>
      </CardContent>
    </Card>
  )
}
