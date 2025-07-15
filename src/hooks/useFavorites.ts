import { useEffect, useState, useCallback } from 'react'

export function useFavorites(): {
  favorites: Set<number>
  isLoading: boolean
  handleFavoriteChange: (productId: number, newValue: boolean) => void
} {
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFavorites() {
      setLoading(true)
      try {
        const res = await fetch('/api/favorites')
        if (res.ok) {
          const data = await res.json()
          setFavorites(
            new Set(
              Array.isArray(data)
                ? data.map(
                    (fav: { id: number; productId?: number }) =>
                      fav.productId ?? fav.id
                  )
                : []
            )
          )
        }
      } finally {
        setLoading(false)
      }
    }
    fetchFavorites()
  }, [])

  const handleFavoriteChange = useCallback(
    (productId: number, newValue: boolean) => {
      setFavorites((prev) => {
        const next = new Set(prev)
        if (newValue) {
          next.add(productId)
        } else {
          next.delete(productId)
        }
        return next
      })
    },
    []
  )

  return { favorites, isLoading, handleFavoriteChange }
}
