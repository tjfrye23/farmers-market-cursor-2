import { api } from './api'
import { UpdateCartRequest } from '@/app/api/cart/route'
import { ClientCart } from '@/types/cart'

export interface CartService {
  updateCart: (
    marketDayId: number,
    marketDayProductVariationIds: number[],
    quantities: number[]
  ) => Promise<ClientCart>
  getCart: (marketDayId: number) => Promise<ClientCart>
  getCarts: () => Promise<ClientCart[]>
  clearAllCarts: () => Promise<ClientCart | null>
  clearCart: (marketDayId: number) => Promise<ClientCart | null>
  removeCartItem: (marketDayId: number, variationId: number) => Promise<void>
}

export const cartService: CartService = {
  async updateCart(marketDayId, marketDayProductVariationIds, quantities) {
    const requestBody: UpdateCartRequest = {
      marketDayId,
      marketDayProductVariationIds,
      quantities,
    }
    return api.post<ClientCart>('/api/cart', requestBody)
  },
  async getCart(marketDayId) {
    return api.get<ClientCart>(`/api/cart?marketDayId=${marketDayId}`)
  },
  async getCarts() {
    return api.get<ClientCart[]>('/api/cart')
  },
  async clearAllCarts() {
    return await api.delete('/api/cart')
  },
  async clearCart(marketDayId) {
    return api.delete<ClientCart>(`/api/cart?marketDayId=${marketDayId}`)
  },
  async removeCartItem(marketDayId, variationId) {
    await api.delete(
      `/api/cart?marketDayId=${marketDayId}&marketDayProductVariationId=${variationId}`
    )
  },
}
