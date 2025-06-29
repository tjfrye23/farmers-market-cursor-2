import { useQuery } from '@tanstack/react-query'

/**
 * Fetches the list of categories for a given market day using React Query.
 * @param selectedMarketDay The selected market day ID or null
 * @returns React Query result for categories array
 */
export function useCategories(selectedMarketDay: number | null) {
  return useQuery<string[]>({
    queryKey: ['categories', selectedMarketDay],
    queryFn: async () => {
      if (!selectedMarketDay) return []
      try {
        const res = await fetch('/api/categories')
        if (!res.ok) throw new Error('API error')
        return await res.json()
      } catch {
        return []
      }
    },
    initialData: [],
  })
}
