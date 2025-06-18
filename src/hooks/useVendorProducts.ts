import { useState, useEffect, useCallback } from 'react'
import { Product } from '../types/product'

export function useVendorProducts(vendorProfileId: string) {
  const [data, setData] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/products?vendorProfileId=${vendorProfileId}`)
      const products = await res.json()
      setData(products)
    } catch {
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, [vendorProfileId])

  useEffect(() => {
    if (vendorProfileId) {
      fetchProducts()
    }
  }, [vendorProfileId, fetchProducts])

  return { data, isLoading, refetch: fetchProducts }
}
