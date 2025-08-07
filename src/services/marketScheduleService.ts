import { api } from './api'
import { ClientMarketSchedule } from '@/types/marketSchedule'
import { MarketScheduleStatus } from '@/generated/prisma/client'

export interface MarketScheduleService {
  subscribeToSchedule: (scheduleId: number) => Promise<void>
  unsubscribeFromSchedule: (scheduleId: number) => Promise<void>
  updateSchedule: (
    scheduleId: number,
    data: UpdateMarketScheduleData
  ) => Promise<ClientMarketSchedule>
  updateScheduleStatus: (
    scheduleId: number,
    status: MarketScheduleStatus
  ) => Promise<ClientMarketSchedule>
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
  ): Promise<ClientMarketSchedule> {
    return api.put<ClientMarketSchedule>(
      `/api/market-schedules/${scheduleId}`,
      data
    )
  },

  async updateScheduleStatus(
    scheduleId: number,
    status: string
  ): Promise<ClientMarketSchedule> {
    return api.put<ClientMarketSchedule>(
      `/api/market-schedules/${scheduleId}`,
      {
        status,
      }
    )
  },

  async deleteSchedule(scheduleId: number): Promise<void> {
    await api.delete(`/api/market-schedules/${scheduleId}`)
  },
}
