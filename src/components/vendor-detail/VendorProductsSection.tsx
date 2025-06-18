import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { VendorProductCard } from './VendorProductCard'

interface VendorProduct {
  id: string | number
  name: string
  price: number
  unit?: string
  imageUrl?: string | null
}

interface VendorProductsSectionProps {
  products: VendorProduct[]
  businessName: string
  defaultImage: string
}

export const VendorProductsSection: React.FC<VendorProductsSectionProps> = ({
  products,
  businessName,
  defaultImage,
}) => (
  <div className="mt-10">
    <h2 className="font-display text-market-green-dark mb-6 text-2xl font-semibold">
      Products from {businessName}
    </h2>
    {products.length === 0 ? (
      <div className="rounded-lg bg-gray-50 p-8 text-center">
        <p className="mb-4 text-gray-600">
          No products available from this vendor yet.
        </p>
        <Link href="/shop">
          <Button className="bg-market-green hover:bg-market-green-dark">
            Browse All Products
          </Button>
        </Link>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <VendorProductCard
            key={product.id}
            product={product}
            defaultImage={defaultImage}
          />
        ))}
      </div>
    )}
  </div>
)
