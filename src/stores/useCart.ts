import { create } from 'zustand'

export interface CartItem {
  productId: number
  name: string
  imageUrl: string
  price: number
  quantity: number
  unit: string
  variationId: number
}

interface CartState {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: number, variationId: number) => void
  clearCart: () => void
  syncCart: () => Promise<void>
}

function saveCartToLocalStorage(items: CartItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(items))
  }
}

function loadCartFromLocalStorage(): CartItem[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('cart')
    if (data) return JSON.parse(data)
  }
  return []
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  addToCart: (item) => {
    set((state) => {
      const existing = state.items.find(
        (i) =>
          i.productId === item.productId && i.variationId === item.variationId
      )
      let newItems
      if (existing) {
        newItems = state.items.map((i) =>
          i.productId === item.productId && i.variationId === item.variationId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      } else {
        newItems = [...state.items, item]
      }
      saveCartToLocalStorage(newItems)
      // Optimistically update UI, then sync with backend
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      return { items: newItems }
    })
  },
  removeFromCart: (productId, variationId) => {
    set((state) => {
      const newItems = state.items.filter(
        (i) => i.productId !== productId || i.variationId !== variationId
      )
      saveCartToLocalStorage(newItems)
      // Optimistically update UI, then sync with backend
      fetch(`/api/cart?productId=${productId}&variationId=${variationId}`, {
        method: 'DELETE',
      })
      return { items: newItems }
    })
  },
  clearCart: () => {
    set(() => {
      saveCartToLocalStorage([])
      fetch('/api/cart', { method: 'DELETE' })
      return { items: [] }
    })
  },
  syncCart: async () => {
    // Try to fetch cart from backend, fallback to localStorage
    try {
      const res = await fetch('/api/cart')
      if (res.ok) {
        const data = await res.json()
        set({ items: data })
        saveCartToLocalStorage(data)
      } else {
        set({ items: loadCartFromLocalStorage() })
      }
    } catch {
      set({ items: loadCartFromLocalStorage() })
    }
  },
}))
