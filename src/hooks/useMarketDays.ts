import { ClientMarketDay } from '@/types/marketDay'
import { useQuery } from '@tanstack/react-query'

export const useMarketDays = (active?: boolean) => {
  return useQuery<ClientMarketDay[]>({
    queryKey: ['marketDays', { active }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (active) {
        params.append('active', 'true')
      }
      const url = `/api/market-days?${params.toString()}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch market days')
      return res.json()
    },
  })
}
