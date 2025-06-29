import { MarketDay } from '@/types/marketDay'
import { useQuery } from '@tanstack/react-query'

export const useMarketDays = () => {
  return useQuery<MarketDay[]>({
    queryKey: ['marketDays'],
    queryFn: async () => {
      const res = await fetch('/api/market-days')
      if (!res.ok) throw new Error('Failed to fetch market days')
      return res.json()
    },
  })
}
