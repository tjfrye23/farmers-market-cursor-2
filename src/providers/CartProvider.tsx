'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useRef } from 'react'
import { ClientCart } from '@/types/cart'
import { cartService } from '@/services/cartService'
import { useCartActions } from '@/hooks/useCartActions'

export default function CartProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const { carts, setCarts, clearAllCarts } = useCartActions()
  const prevUserId = useRef<string | null>(null)

  useEffect(() => {
    // On login: merge local cart to DB, then hydrate from DB
    const userId = session?.user?.id
    const userIdStr = userId ? userId.toString() : null
    if (
      status === 'authenticated' &&
      userIdStr &&
      prevUserId.current !== userIdStr
    ) {
      // Merge local cart to DB for each marketDayId
      const mergeCart = async () => {
        const dbCarts: ClientCart[] = await Promise.all(
          carts.map(async (cart) => {
            return cartService.updateCart(
              cart.marketDay.id,
              cart.items.map((item) => item.variationId),
              cart.items.map((item) => item.quantity)
            )
          })
        )
        clearAllCarts()
        setCarts(dbCarts)
      }
      mergeCart()
      prevUserId.current = userIdStr
    }

    // On logout, optionally clear cart or keep localStorage
    if (status === 'unauthenticated' && prevUserId.current) {
      prevUserId.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.id])

  return <>{children}</>
}
