import { api } from './api'
import { MarketSchedule, MarketScheduleStatus } from '@/types/marketSchedule'

export interface MarketScheduleService {
  subscribeToSchedule: (scheduleId: number) => Promise<void>
  unsubscribeFromSchedule: (scheduleId: number) => Promise<void>
  updateSchedule: (
    scheduleId: number,
    data: UpdateMarketScheduleData
  ) => Promise<MarketSchedule>
  updateScheduleStatus: (
    scheduleId: number,
    status: MarketScheduleStatus
  ) => Promise<MarketSchedule>
  deleteSchedule: (scheduleId: number) => Promise<void>
}

export interface UpdateMarketScheduleData {
  name: string
  description: string
  location: string
  startTime: string
  endTime: string
  onlineStartTime: string
  onlineEndTime: string
  status: MarketScheduleStatus
  reoccurring: boolean
}

export const marketScheduleService: MarketScheduleService = {
  async subscribeToSchedule(scheduleId: number): Promise<void> {
    await api.post(`/api/market-schedules/${scheduleId}/subscribe`, {})
  },

  async unsubscribeFromSchedule(scheduleId: number): Promise<void> {
    await api.delete(`/api/market-schedules/${scheduleId}/subscribe`)
  },

  async updateSchedule(
    scheduleId: number,
    data: UpdateMarketScheduleData
  ): Promise<MarketSchedule> {
    return api.put<MarketSchedule>(`/api/market-schedules/${scheduleId}`, data)
  },

  async updateScheduleStatus(
    scheduleId: number,
    status: string
  ): Promise<MarketSchedule> {
    return api.put<MarketSchedule>(`/api/market-schedules/${scheduleId}`, {
      status,
    })
  },

  async deleteSchedule(scheduleId: number): Promise<void> {
    await api.delete(`/api/market-schedules/${scheduleId}`)
  },
}
