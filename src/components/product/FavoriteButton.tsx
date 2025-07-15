'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'

interface FavoriteButtonProps {
  productId: number
  isFavorite: boolean
  onChange?: (newValue: boolean) => void
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  productId,
  isFavorite,
  onChange,
}) => {
  const [loading, setLoading] = useState(false)
  const [favorite, setFavorite] = useState(isFavorite)

  const toggleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    try {
      if (favorite) {
        await fetch(`/api/favorites/${productId}`, { method: 'DELETE' })
        setFavorite(false)
        onChange?.(false)
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })
        setFavorite(true)
        onChange?.(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 disabled:opacity-50"
      onClick={toggleFavorite}
      disabled={loading}
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${
          favorite
            ? 'fill-red-500 text-red-500'
            : 'text-gray-600 hover:text-red-500'
        }`}
      />
    </button>
  )
}
