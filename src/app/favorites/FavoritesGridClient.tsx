'use client'

import { ProductCard } from '@/components/product/ProductCard'
import { ClientProductSimple } from '@/types/product'

interface FavoritesGridClientProps {
  products: ClientProductSimple[]
}

export function FavoritesGridClient({ products }: FavoritesGridClientProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} isFavorite={true} />
      ))}
    </div>
  )
}
