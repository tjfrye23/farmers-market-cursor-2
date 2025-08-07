'use client'

import { MapPin } from 'lucide-react'
import { ClientMarketSchedule } from '@/types/marketSchedule'

interface LocationMapProps {
  schedule: ClientMarketSchedule
}

export function LocationMap({ schedule }: LocationMapProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Location</h3>
      </div>
      <p className="text-muted-foreground text-sm">{schedule.location}</p>

      {/* Mock Map Container */}
      <div className="bg-muted/20 relative h-64 w-full overflow-hidden rounded-lg border">
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
          {/* Mock Map Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
          </div>

          {/* Mock Roads */}
          <div className="absolute right-4 bottom-8 left-4 h-2 rounded bg-gray-300" />
          <div className="absolute bottom-16 left-1/2 h-8 w-2 -translate-x-1/2 transform rounded bg-gray-300" />

          {/* Mock Buildings */}
          <div className="absolute top-8 left-8 h-6 w-6 rounded bg-gray-400" />
          <div className="absolute top-8 right-8 h-6 w-6 rounded bg-gray-400" />
          <div className="absolute top-16 left-1/2 h-6 w-6 -translate-x-1/2 transform rounded bg-gray-400" />
        </div>

        {/* Location Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <div className="relative">
            <div className="h-6 w-6 animate-pulse rounded-full border-2 border-white bg-red-500 shadow-lg" />
            <div className="absolute -bottom-1 left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-2 border-l-2 border-t-red-500 border-r-transparent border-l-transparent" />
          </div>
        </div>

        {/* Mock Map Controls */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <div className="flex h-8 w-8 items-center justify-center rounded border bg-white text-xs font-bold shadow-sm">
            +
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded border bg-white text-xs font-bold shadow-sm">
            −
          </div>
        </div>

        {/* Mock Compass */}
        <div className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded border bg-white shadow-sm">
          <div className="relative h-4 w-4">
            <div className="absolute top-0 left-1/2 h-0 w-0 -translate-x-1/2 transform border-r-1 border-b-2 border-l-1 border-r-transparent border-b-gray-600 border-l-transparent" />
            <div className="absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-2 border-r-1 border-l-1 border-t-gray-600 border-r-transparent border-l-transparent" />
            <div className="absolute top-1/2 left-0 h-0 w-0 -translate-y-1/2 transform border-t-1 border-r-2 border-b-1 border-t-transparent border-r-gray-600 border-b-transparent" />
            <div className="absolute top-1/2 right-0 h-0 w-0 -translate-y-1/2 transform border-t-1 border-b-1 border-l-2 border-t-transparent border-b-transparent border-l-gray-600" />
          </div>
        </div>
      </div>

      {/* Mock Map Attribution */}
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span>Mock Map Data</span>
        <span>© 2024 Farmers Market</span>
      </div>
    </div>
  )
}
