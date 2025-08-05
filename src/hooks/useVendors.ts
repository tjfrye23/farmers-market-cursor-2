import { useQuery } from '@tanstack/react-query'

/**
 * Fetches the list of vendors using React Query, with fallback to mockVendors on error.
 * @returns React Query result for vendors array
 */
export function useVendors() {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/vendors')
        if (!res.ok) throw new Error('API error')
        return await res.json()
      } catch {
        return []
      }
    },
    initialData: [],
  })
}
