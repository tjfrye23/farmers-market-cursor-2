export interface MarketDay {
  id: number
  date: string
  location: string
  description?: string
  startTime: string
  endTime: string
  status: string
  vendors: { id: number; businessName: string }[]
} 