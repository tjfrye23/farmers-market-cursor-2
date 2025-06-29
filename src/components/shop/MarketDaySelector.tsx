import React, { useState } from 'react'
import { MapPin, Clock, ChevronDown } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import * as Collapsible from '@radix-ui/react-collapsible'
import { MarketDay } from '@/types/marketDay'

interface MarketDaySelectorProps {
  marketDays: MarketDay[]
  selectedMarketDay: number | null
  onSelectMarketDay: (id: number) => void
  isLoading?: boolean
}

const MarketDaySelector: React.FC<MarketDaySelectorProps> = ({
  marketDays,
  selectedMarketDay,
  onSelectMarketDay,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectedDay = marketDays.find((day) => day.id === selectedMarketDay)

  if (isLoading) {
    return (
      <div className="w-full rounded-lg bg-gray-50 p-4">
        <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  const renderMarketDay = (day: MarketDay, isButton = true) => {
    console.log(day)
    const date = day.startTime ? parseISO(day.startTime) : new Date()
    const Component = isButton ? 'button' : 'div'

    return (
      <Component
        key={day.id}
        onClick={
          isButton
            ? () => {
                onSelectMarketDay(day.id)
                setIsOpen(false)
              }
            : undefined
        }
        className={`w-full rounded-lg p-4 text-left transition-colors ${
          isButton
            ? 'hover:bg-gray-100'
            : day.id === selectedMarketDay
              ? 'bg-white shadow-sm'
              : 'bg-gray-50'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3
              className={`text-lg font-medium ${
                day.id === selectedMarketDay ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              {format(date, 'EEEE, MMMM d, yyyy')} - {day.marketSchedule.name}
            </h3>
            <div className="mt-1 flex items-center gap-4 text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {format(date, 'HH:mm')} -{' '}
                  {format(date.setHours(date.getHours() + 6), 'HH:mm')}
                </span>
              </div>
              {day.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{day.location}</span>
                </div>
              )}
            </div>
          </div>
          {day.id === selectedMarketDay && !isButton && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>
      </Component>
    )
  }

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full rounded-lg bg-white shadow-sm"
    >
      <Collapsible.Trigger asChild>
        <button className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-gray-50">
          <div className="flex-1">
            {selectedDay ? (
              renderMarketDay(selectedDay, false)
            ) : (
              <div className="p-2 text-gray-500">Select a market day...</div>
            )}
          </div>
          <div className="px-2">
            <ChevronDown
              className={`h-5 w-5 text-gray-500 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>
      </Collapsible.Trigger>

      <Collapsible.Content>
        {marketDays.length > 0 ? (
          <div className="space-y-2 border-t p-2">
            {marketDays
              .filter((day) => day.id !== selectedMarketDay)
              .map((day) => renderMarketDay(day))}
          </div>
        ) : (
          <div className="border-t p-4 text-center">
            <p className="text-gray-500">No upcoming market days available.</p>
          </div>
        )}
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

export default MarketDaySelector
