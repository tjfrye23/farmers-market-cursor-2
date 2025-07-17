'use client'

import { useCartActions } from '@/hooks/useCartActions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { ClientCartItem } from '@/types/cart'
import MarketDaySelector from '@/components/shop/MarketDaySelector'
import { useEffect, useMemo, useState } from 'react'
import { ClientMarketDay } from '@/types/marketDay'

export default function CartPage() {
  const { carts, addToCart, removeFromCart, clearCart } = useCartActions()

  // Only use market days present in the user's carts
  const marketDays = useMemo(() => carts.map((cart) => cart.marketDay), [carts])

  // Default to first market day with a cart
  const [selectedMarketDay, setSelectedMarketDay] =
    useState<ClientMarketDay | null>(() =>
      carts.length > 0 ? carts[0].marketDay : null
    )

  // Keep selectedMarketDayId in sync with available carts
  useEffect(() => {
    if (!carts.length) {
      setSelectedMarketDay(null)
      return
    }
    const validMarketDayIds = new Set(carts.map((c) => c.marketDay.id))
    if (selectedMarketDay && !validMarketDayIds.has(selectedMarketDay.id)) {
      setSelectedMarketDay(carts[0].marketDay)
    }
  }, [carts, selectedMarketDay])

  // Find the cart for the selected market day
  const selectedCart = useMemo(
    () => carts.find((c) => c.marketDay.id === selectedMarketDay?.id),
    [carts, selectedMarketDay]
  )

  const handleIncrease = (item: ClientCartItem) => {
    if (!selectedMarketDay) return
    addToCart({ ...item, quantity: item.quantity + 1 }, selectedMarketDay)
  }
  const handleDecrease = (item: ClientCartItem) => {
    if (!selectedMarketDay) return
    if (item.quantity > 1) {
      addToCart({ ...item, quantity: item.quantity - 1 }, selectedMarketDay)
    } else {
      removeFromCart(selectedMarketDay.id, item.variationId)
    }
  }
  const handleClearCart = () => {
    if (selectedMarketDay) clearCart(selectedMarketDay.id)
  }

  const total = useMemo(() => {
    if (!selectedCart) return 0
    return selectedCart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
  }, [selectedCart])

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>
      <div className="mb-6">
        <MarketDaySelector
          marketDays={marketDays}
          selectedMarketDay={selectedMarketDay}
          onSelectMarketDay={setSelectedMarketDay}
          isLoading={false}
        />
      </div>
      {!selectedCart || selectedCart.items.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center">
          <h2 className="mb-4 text-xl font-semibold">Your Cart is Empty</h2>
          <Link href="/shop">
            <Button className="bg-market-green hover:bg-market-green-dark text-white">
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {selectedCart.items.map((item) => (
              <div
                key={`${selectedCart.marketDay.id}-${item.variationId}`}
                className="flex items-center gap-4 rounded-lg border p-4 shadow-sm"
              >
                <Image
                  width={80}
                  height={80}
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-20 w-20 rounded object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    ${item.price.toFixed(2)} / {item.unit?.name}
                  </div>
                  {item.packaged && (
                    <div className="text-sm text-gray-500">
                      {item.size} {item.unit?.name} package
                    </div>
                  )}
                  <div className="text-market-green-dark font-bold">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDecrease(item)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleIncrease(item)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      removeFromCart(
                        selectedCart.marketDay.id,
                        item.variationId
                      )
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-end gap-4">
            <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClearCart}>
                Clear Cart
              </Button>
              <Button className="bg-market-green hover:bg-market-green-dark text-white">
                Checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
