import { useQuery } from '@tanstack/react-query'
import { UIProduct } from '@/types/product'

interface UseMarketDayProductsParams {
  categoryFilter: string[]
  vendorFilter: string[]
  priceRange: [number, number] | null
  selectedMarketDay: number | null
}

/**
 * Fetches market day product groups using React Query based on filters and selected market day.
 * @param params categoryFilter, vendorFilter, priceRange, selectedMarketDay
 * @returns React Query result for market day products
 */
export function useMarketDayProducts({
  categoryFilter,
  vendorFilter,
  priceRange,
  selectedMarketDay,
}: UseMarketDayProductsParams) {
  return useQuery<UIProduct[], Error>({
    queryKey: [
      'marketDayProducts',
      { categoryFilter, vendorFilter, priceRange, selectedMarketDay },
    ],
    queryFn: async () => {
      if (!selectedMarketDay) return []
      const params = new URLSearchParams()
      params.append('marketDayId', selectedMarketDay.toString())
      if (categoryFilter.length > 0) {
        categoryFilter.forEach((cat) => params.append('category', cat))
      }
      if (vendorFilter.length > 0) {
        vendorFilter.forEach((v) => params.append('vendorId', v))
      }
      if (priceRange) {
        params.append('minPrice', priceRange[0].toString())
        params.append('maxPrice', priceRange[1].toString())
      }
      try {
        const res = await fetch(`/api/products?${params.toString()}`)
        if (!res.ok) throw new Error('Failed to fetch products')
        const result = await res.json()
        return result.products
      } catch {
        return []
      }
    },
    initialData: [],
  })
}
