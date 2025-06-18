import { useState, useEffect, useCallback } from 'react'
import { getVendorMetrics } from '@/services/vendorService'

export function useVendorMetrics(userId?: string | number) {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getVendorMetrics(userId)
      setMetrics(data)
    } catch (e) {
      setError('Failed to fetch metrics')
      setMetrics(null)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  return { metrics, loading, error, refetch: fetchMetrics }
}
