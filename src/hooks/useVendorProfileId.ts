import { useState, useEffect } from 'react'

export function useVendorProfileId(userId?: string | number) {
  const [vendorProfileId, setVendorProfileId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    setError(null)
    fetch(`/api/vendor-profiles?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setVendorProfileId(data[0]?.id || null)
      })
      .catch(() => {
        setError('Failed to fetch vendor profile')
        setVendorProfileId(null)
      })
      .finally(() => setLoading(false))
  }, [userId])

  return { vendorProfileId, loading, error }
}
