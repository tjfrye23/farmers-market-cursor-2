import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ClientProduct,
  ClientProductSimple,
  isClientProduct,
} from '@/types/product'
import { useRouter } from 'next/navigation'
import { FavoriteButton } from './FavoriteButton'

interface ProductCardProps {
  product: ClientProduct | ClientProductSimple
  isFavorite?: boolean
  onFavoriteChange?: (productId: number, newValue: boolean) => void
}

const fallbackImage = '/images/products/farmer-field.jpeg'

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onFavoriteChange,
}) => {
  const router = useRouter()

  const [dollars, cents] = isClientProduct(product)
    ? product.price.toFixed(2).split('.')
    : [0, 0]

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="relative flex w-full cursor-pointer flex-col rounded-lg bg-white p-4 font-sans shadow-md transition-all duration-200 hover:shadow-lg">
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
          {typeof isFavorite === 'boolean' && (
            <FavoriteButton
              productId={product.id}
              isFavorite={isFavorite}
              onChange={(newValue) => onFavoriteChange?.(product.id, newValue)}
            />
          )}
        </div>
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
        {isClientProduct(product) && (
          <div className="mb-3 flex items-baseline">
            <span className="text-2xl font-bold text-gray-800">${dollars}</span>
            <span className="ml-1 text-lg text-gray-800">{cents}</span>
            <span className="ml-2 text-gray-500">/{product.unit}</span>
          </div>
        )}

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
      </div>
    </Link>
  )
}
