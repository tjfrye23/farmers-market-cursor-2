import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { UIProduct } from '@/types/product'
import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button' // Uncomment if you have a Button component

interface ProductCardProps {
  product: UIProduct
}

interface ProductGridProps {
  products: ProductCardProps['product'][]
  isLoading: boolean
  error?: string | null
}

const fallbackImage = '/images/products/farmer-field.jpeg'

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const router = useRouter()
  // Find the primary unit option, fallback to first
  const [dollars, cents] = product.price.toFixed(2).split('.')
  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="relative flex w-full cursor-pointer flex-col rounded-lg bg-white p-4 font-sans shadow-md transition-all duration-200 hover:shadow-lg">
        {/* Product Image Container */}
        <div className="relative mb-4">
          <Image
            src={product.imageUrl || fallbackImage}
            alt={product.name}
            width={320}
            height={192}
            className="mx-auto h-48 w-full rounded object-contain"
            style={{ background: '#f3f4f6' }}
            priority={false}
          />
          {/* Favorite button */}
          <button
            type="button"
            className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white/90"
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite((f) => !f)
            }}
            aria-label={
              isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600 hover:text-red-500'
              }`}
            />
          </button>
        </div>

        {/* Organic/Local Badge */}
        {(product.organic || product.local) && (
          <div className="mb-2 flex items-center">
            <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-600">
              <span className="text-xs font-bold text-white">✓</span>
            </div>
            <span className="text-sm text-gray-600">
              {[product.organic && 'Organic', product.local && 'Local']
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-3 flex items-baseline">
          <span className="text-2xl font-bold text-gray-800">${dollars}</span>
          <span className="ml-1 text-lg text-gray-800">{cents}</span>
          <span className="ml-2 text-gray-500">/{product.unit}</span>
        </div>

        {/* Product Title */}
        <h3 className="hover:text-market-green mb-3 text-left text-base leading-tight font-medium text-gray-800 transition-colors">
          {product.name}
        </h3>

        <div className="mb-2 flex gap-x-1 text-left text-sm text-gray-500">
          from
          <div
            className="text-market-green hover:text-market-green-dark cursor-pointer underline underline-offset-2 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/vendors/${product.vendorId}`)
            }}
          >
            {product.vendorName}
          </div>
        </div>

        {/* Add to Cart button (optional, placeholder) */}
        {/* <Button className="w-full bg-market-green hover:bg-market-green-dark mt-auto">Add to Cart</Button> */}
      </div>
    </Link>
  )
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  error,
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
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
