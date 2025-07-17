import { useCart } from '@/stores/useCart'
import { ClientCartItem } from '@/types/cart'
import { useSession } from 'next-auth/react'
import { cartService } from '@/services/cartService'
import { ClientMarketDay } from '@/types/marketDay'

export function useCartActions() {
  const { data: session, status } = useSession()
  const isLoggedIn = status === 'authenticated' && !!session?.user?.id
  const {
    carts,
    addToCart,
    removeFromCart,
    clearCart,
    clearAllCarts,
    setCarts,
  } = useCart()

  const addToCartWithSync = (
    item: ClientCartItem,
    marketDay: ClientMarketDay
  ) => {
    addToCart(item, marketDay)
    if (isLoggedIn) {
      cartService.updateCart(marketDay.id, [item.variationId], [item.quantity])
    }
  }

  const removeFromCartWithSync = (
    marketDayId: number,
    marketDayProductVariationId: number
  ) => {
    removeFromCart(marketDayProductVariationId, marketDayId)
    if (isLoggedIn) {
      cartService.removeCartItem(marketDayId, marketDayProductVariationId)
    }
  }

  const clearCartWithSync = (marketDayId: number) => {
    clearCart(marketDayId)
    if (isLoggedIn) {
      cartService.clearCart(marketDayId)
    }
  }

  const clearAllCartsWithSync = () => {
    clearAllCarts()
    if (isLoggedIn) {
      cartService.clearAllCarts()
    }
  }

  return {
    carts,
    addToCart: addToCartWithSync,
    removeFromCart: removeFromCartWithSync,
    clearCart: clearCartWithSync,
    clearAllCarts: clearAllCartsWithSync,
    setCarts,
  }
}
