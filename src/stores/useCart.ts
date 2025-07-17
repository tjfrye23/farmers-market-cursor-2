import { ClientCartItem, ClientCart } from '@/types/cart'
import { ClientMarketDay } from '@/types/marketDay'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'

interface CartState {
  carts: ClientCart[]
  addToCart: (item: ClientCartItem, marketDay: ClientMarketDay) => void
  removeFromCart: (
    marketDayProductVariationId: number,
    marketDayId: number
  ) => void
  clearCart: (marketDayId: number) => void
  clearAllCarts: () => void
  setCarts: (carts: ClientCart[]) => void
}

export const useCart = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        carts: [],
        addToCart: (item, marketDay) => {
          set(
            (state) => {
              const existingCart = state.carts.find(
                (c) => c.marketDay.id === marketDay.id
              )
              if (!existingCart) {
                return addCart(state, marketDay, item)
              }
              return updateCart(state, existingCart, marketDay, item)
            },
            false,
            'addToCart'
          )
        },
        removeFromCart: (marketDayProductVariationId, marketDayId) => {
          set(
            (state) => {
              return removeCartItem(
                state,
                marketDayId,
                marketDayProductVariationId
              )
            },
            false,
            'removeFromCart'
          )
        },
        clearCart: (marketDayId) => {
          set(
            (state) => {
              return removeCart(state, marketDayId)
            },
            false,
            'clearCart'
          )
        },
        clearAllCarts: () => {
          set(() => ({ carts: [] }), false, 'clearAllCarts')
        },
        setCarts: (carts) => set({ carts }, false, 'setCarts'),
      }),
      {
        name: 'cart',
      }
    ),
    {
      name: 'CartStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
)

function updateCartItem(
  items: ClientCartItem[],
  newItem: ClientCartItem
): ClientCartItem[] {
  return items.map((i) => (i.variationId === newItem.variationId ? newItem : i))
}

function addCartItem(
  items: ClientCartItem[],
  newItem: ClientCartItem
): ClientCartItem[] {
  return [...items, newItem]
}

function removeCartItem(
  state: CartState,
  marketDayId: number,
  variationId: number
): CartState {
  const updatedCarts = state.carts
    .map((c) =>
      c.marketDay.id === marketDayId
        ? {
            ...c,
            items: c.items.filter((i) => i.variationId !== variationId),
          }
        : c
    )
    .filter((c) => c.items.length > 0)
  return { ...state, carts: updatedCarts }
}

function addCart(
  state: CartState,
  marketDay: ClientMarketDay,
  item: ClientCartItem
): CartState {
  return {
    ...state,
    carts: [...state.carts, { marketDay, items: [item] }],
  }
}

function updateCart(
  state: CartState,
  existingCart: ClientCart,
  marketDay: ClientMarketDay,
  item: ClientCartItem
): CartState {
  const itemExists = existingCart.items.some(
    (i) => i.variationId === item.variationId
  )
  const updatedCarts = state.carts.map((c) =>
    c.marketDay.id === marketDay.id
      ? {
          ...c,
          items: itemExists
            ? updateCartItem(c.items, item)
            : addCartItem(c.items, item),
        }
      : c
  )
  return { ...state, carts: updatedCarts }
}

function removeCart(state: CartState, marketDayId: number): CartState {
  const updatedCarts = state.carts.filter((c) => c.marketDay.id !== marketDayId)
  return { ...state, carts: updatedCarts }
}
