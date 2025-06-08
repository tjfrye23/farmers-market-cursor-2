import { useState, useEffect } from 'react'
import { Product } from '../types/product'

export function useVendorProducts(vendorId: string) {
  const [data, setData] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with real API call
    setTimeout(() => {
      setData([])
      setIsLoading(false)
    }, 500)
  }, [vendorId])

  return { data, isLoading }
}
