import { useState, useEffect, useCallback } from 'react'
import { UIProduct } from '../types/product'

export function useVendorProducts() {
  const [data, setData] = useState<UIProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/vendor/products`)
      const products = await res.json()
      setData(products)
    } catch {
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { data, isLoading, refetch: fetchProducts }
}
