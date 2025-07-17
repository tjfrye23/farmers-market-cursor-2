import React, { useState } from 'react'
import { MapPin, Clock, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import * as Collapsible from '@radix-ui/react-collapsible'
import { ClientMarketDay } from '@/types/marketDay'

interface MarketDaySelectorProps {
  marketDays: ClientMarketDay[]
  selectedMarketDay: ClientMarketDay | null
  onSelectMarketDay: (id: ClientMarketDay | null) => void
  isLoading?: boolean
  variant?: 'default' | 'compressed'
}

const MarketDaySelector: React.FC<MarketDaySelectorProps> = ({
  marketDays,
  selectedMarketDay,
  onSelectMarketDay,
  isLoading = false,
  variant = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectedDay = marketDays.find((day) => day.id === selectedMarketDay?.id)

  if (isLoading) {
    return (
      <div
        className={`w-full rounded-lg bg-gray-50 ${variant === 'compressed' ? 'h-10 p-2' : 'p-4'}`}
      >
        <div
          className={`animate-pulse rounded bg-gray-200 ${variant === 'compressed' ? 'h-4 w-24' : 'h-6 w-48'}`}
        />
      </div>
    )
  }

  const renderMarketDay = (day: ClientMarketDay, isButton = true) => {
    const date = new Date(day.startTime)
    const Component = isButton ? 'button' : 'div'

    return (
      <Component
        key={day.id}
        onClick={
          isButton
            ? () => {
                onSelectMarketDay(day)
                setIsOpen(false)
              }
            : undefined
        }
        className={`w-full rounded-lg p-4 text-left transition-colors ${
          isButton
            ? 'hover:bg-gray-100'
            : day.id === selectedMarketDay?.id
              ? 'bg-white shadow-sm'
              : 'bg-gray-50'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3
              className={`text-lg font-medium ${
                day.id === selectedMarketDay?.id
                  ? 'text-gray-900'
                  : 'text-gray-500'
              }`}
            >
              {format(date, 'EEEE, MMMM d, yyyy')} - {day.name}
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
          {day.id === selectedMarketDay?.id && !isButton && (
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

  // Compressed trigger
  const renderCompressedTrigger = () => {
    if (!selectedDay) {
      return (
        <div className="p-2 text-sm text-gray-500">Select a market day...</div>
      )
    }
    const date = new Date(selectedDay.startTime)
    return (
      <div className="flex items-center gap-2 truncate">
        <span className="truncate text-sm font-medium text-gray-900">
          {selectedDay.name}
        </span>
        <span className="truncate text-xs text-gray-500">
          {format(date, 'MMM d')}
        </span>
      </div>
    )
  }

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`relative w-full rounded-lg bg-white shadow-sm ${variant === 'compressed' ? 'h-10 min-h-[40px]' : ''}`}
    >
      <Collapsible.Trigger asChild>
        <button
          className={`flex w-full items-center justify-between rounded-lg transition-colors ${
            variant === 'compressed'
              ? 'h-10 min-h-[40px] px-2 py-1 text-sm'
              : 'p-2'
          } hover:bg-gray-50`}
        >
          <div className="flex-1 truncate">
            {variant === 'compressed' ? (
              renderCompressedTrigger()
            ) : selectedDay ? (
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

      <Collapsible.Content forceMount>
        {isOpen && (
          <div className="absolute top-full left-0 z-20 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
            {selectedMarketDay && (
              <button
                className="w-full border-b border-gray-100 px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-100"
                onClick={() => {
                  onSelectMarketDay(null)
                  setIsOpen(false)
                }}
              >
                Clear Selection
              </button>
            )}
            {marketDays.length > 0 ? (
              <div className="space-y-2 p-2">
                {marketDays
                  .filter((day) => day.id !== selectedMarketDay?.id)
                  .map((day) => renderMarketDay(day))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-gray-500">
                  No upcoming market days available.
                </p>
              </div>
            )}
          </div>
        )}
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

export default MarketDaySelector
