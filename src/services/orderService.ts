import { api } from './api'

export interface UpdateOrderStatusRequest {
  orderId: number
  status: 'PROCESSING' | 'PROCESSED'
}

export interface OrderService {
  updateOrderStatus: (request: UpdateOrderStatusRequest) => Promise<void>
}

export const orderService: OrderService = {
  async updateOrderStatus(request: UpdateOrderStatusRequest): Promise<void> {
    await api.post('/api/vendor/orders', request)
  },
}
