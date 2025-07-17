import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ClientMarketDay, isClientMarketDay } from '@/types/marketDay'
import { devtools } from 'zustand/middleware'

interface MarketDayState {
  selectedMarketDay: ClientMarketDay | null
  setSelectedMarketDay: (marketDay: ClientMarketDay | null) => void
}

export const useMarketDayStore = create<MarketDayState>()(
  devtools(
    persist(
      (set) => {
        // On initialization, check if the stored market day is still valid
        const initialMarketDay = getStoredMarketDay()

        return {
          selectedMarketDay: initialMarketDay,
          setSelectedMarketDay: (marketDay: ClientMarketDay | null) =>
            set({ selectedMarketDay: marketDay }),
        }
      },
      {
        name: 'selected-market-day',
      }
    ),
    {
      name: 'MarketDayStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
)

function isMarketDayActive(marketDay: ClientMarketDay | null): boolean {
  if (!marketDay) return false

  const now = new Date()
  const start = new Date(marketDay.onlineStartTime)
  const end = new Date(marketDay.onlineEndTime)

  return now >= start && now <= end
}

function getStoredMarketDay(): ClientMarketDay | null {
  try {
    const stored = localStorage.getItem('selected-market-day')
    if (stored) {
      const parsed = JSON.parse(stored).state?.selectedMarketDay

      if (isClientMarketDay(parsed) && isMarketDayActive(parsed)) {
        return parsed
      }
    }
  } catch {
    console.error('Error parsing selected market day from localStorage')
  }
  return null
}
