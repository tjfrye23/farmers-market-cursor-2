import React from 'react'
import Image from 'next/image'

interface VendorProduct {
  id: string | number
  name: string
  price: number
  unit?: string
  imageUrl?: string | null
}

interface VendorProductCardProps {
  product: VendorProduct
  defaultImage: string
}

export const VendorProductCard: React.FC<VendorProductCardProps> = ({
  product,
  defaultImage,
}) => (
  <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
    <div className="relative h-48 overflow-hidden">
      <Image
        src={product.imageUrl || defaultImage}
        alt={product.name}
        fill
        className="object-cover"
        sizes="100vw"
      />
    </div>
    <div className="p-4">
      <h4 className="mb-1 text-lg font-semibold">{product.name}</h4>
      <div className="text-market-green-dark text-xl font-bold">
        ${product.price}
        {product.unit && (
          <span className="ml-1 text-sm text-gray-500">/ {product.unit}</span>
        )}
      </div>
    </div>
  </div>
)
