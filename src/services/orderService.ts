import { api } from './api'
import { OrderStatus } from '@/generated/prisma/client'

export interface UpdateOrderStatusRequest {
  orderId: number
  status: OrderStatus
}

export interface OrderService {
  updateOrderStatus: (request: UpdateOrderStatusRequest) => Promise<void>
}

export const orderService: OrderService = {
  async updateOrderStatus(request: UpdateOrderStatusRequest): Promise<void> {
    await api.post('/api/vendor/orders', request)
  },
}
