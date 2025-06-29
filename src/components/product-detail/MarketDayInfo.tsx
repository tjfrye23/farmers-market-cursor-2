import { MapPin } from 'lucide-react'
import { format } from 'date-fns'
import React from 'react'

interface MarketDayInfoProps {
  scheduleName: string
  location: string
  startTime: Date | string
}

export const MarketDayInfo: React.FC<MarketDayInfoProps> = ({
  scheduleName,
  location,
  startTime,
}) => (
  <div className="rounded-lg bg-gray-50 p-4">
    <h3 className="mb-2 font-semibold">Available at {scheduleName}</h3>
    <div className="space-y-2 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        {location}
      </div>
      <div>
        {format(
          typeof startTime === 'string' ? new Date(startTime) : startTime,
          'EEEE, MMMM d, yyyy'
        )}
      </div>
    </div>
  </div>
)
