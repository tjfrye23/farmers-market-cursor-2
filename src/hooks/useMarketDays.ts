import { useState, useEffect, useCallback } from 'react'
import { MarketDay } from '@/types/marketDay'

export function useMarketDays(vendorProfileId?: number | null) {
  const [marketDays, setMarketDays] = useState<MarketDay[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMarketDays = useCallback(async () => {
    if (!vendorProfileId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/market-days')
      const data = await res.json()
      setMarketDays(
        data.filter((md: MarketDay) =>
          md.vendors.some((v) => v.id === vendorProfileId)
        )
      )
    } catch (e) {
      setError('Failed to fetch market days')
      setMarketDays([])
    } finally {
      setLoading(false)
    }
  }, [vendorProfileId])

  useEffect(() => {
    fetchMarketDays()
  }, [fetchMarketDays])

  return { marketDays, loading, error, refetch: fetchMarketDays }
}
