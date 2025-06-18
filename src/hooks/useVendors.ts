import { useEffect, useState } from 'react'
import { VendorCardProps } from '@/components/VendorCard'

interface UseVendorsResult {
  vendors: VendorCardProps[]
  isLoading: boolean
  error: string | null
}

export function useVendors(): UseVendorsResult {
  const [vendors, setVendors] = useState<VendorCardProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setError(null)
    fetch('/api/vendor-profiles')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch vendors')
        return res.json()
      })
      .then(
        (
          data: {
            id: number | string
            user?: { name?: string }
            businessName?: string
            address?: string
            imageUrl?: string | null
            specialty?: string | null
          }[]
        ) => {
          if (!isMounted) return
          setVendors(
            data.map((v) => ({
              id: v.id.toString(),
              ownerName: v.user?.name || '',
              vendorName: v.businessName || '',
              location: v.address || '',
              imageUrl: v.imageUrl ?? null,
              specialty: v.specialty || '',
            }))
          )
          setIsLoading(false)
        }
      )
      .catch((err) => {
        if (!isMounted) return
        setError(err.message)
        setIsLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  return { vendors, isLoading, error }
}
