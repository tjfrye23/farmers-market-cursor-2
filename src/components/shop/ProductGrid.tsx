import React from 'react'
import { ProductCard } from '@/components/product/ProductCard'
import { ClientProduct } from '@/types/product'

interface ProductGridProps {
  products: ClientProduct[]
  isLoading: boolean
  error?: string | null
  favorites: Set<number>
  onFavoriteChange?: (productId: number, newValue: boolean) => void
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  error,
  favorites,
  onFavoriteChange,
}) => {
  if (isLoading) {
    return <div className="py-8 text-center">Loading products...</div>
  }
  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>
  }
  if (!products.length) {
    return (
      <div className="py-8 text-center text-gray-500">
        No products available.
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={favorites.has(product.id)}
          onFavoriteChange={onFavoriteChange}
        />
      ))}
    </div>
  )
}

export default ProductGrid
