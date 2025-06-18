import { useState, useEffect, useCallback } from 'react'
import { MarketSchedule } from '@/types/marketSchedule'
import { toast } from 'sonner'

async function getMarketSchedules(): Promise<MarketSchedule[]> {
  const res = await fetch('/api/market-schedules')
  if (!res.ok) throw new Error('Failed to fetch market schedules')
  return res.json()
}

export function useMarketSchedules() {
  const [marketSchedules, setMarketSchedules] = useState<MarketSchedule[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMarketSchedules = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getMarketSchedules()
      setMarketSchedules(
        data.map((ms) => ({
          ...ms,
          startDate: new Date(ms.startDate),
          endDate: new Date(ms.endDate),
          startTime: new Date(ms.startTime),
          endTime: new Date(ms.endTime),
          onlineStartDate: new Date(ms.onlineStartDate),
          onlineEndDate: new Date(ms.onlineEndDate),
        }))
      )
    } catch {
      toast.error('Failed to fetch market schedules')
      setMarketSchedules([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMarketSchedules()
  }, [fetchMarketSchedules])
  return { marketSchedules, loading }
}
