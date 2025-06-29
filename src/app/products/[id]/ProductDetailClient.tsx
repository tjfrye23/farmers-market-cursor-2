'use client'

import { useState } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import { ProductImageGallery } from '@/components/product-detail/ProductImageGallery'
import { ProductInfo } from '@/components/product-detail/ProductInfo'
import { MarketDayInfo } from '@/components/product-detail/MarketDayInfo'
import { ProductDescription } from '@/components/product-detail/ProductDescription'
import { PackageOptionsSelector } from '@/components/product-detail/PackageOptionsSelector'
import { ProductUnavailable } from '@/components/product-detail/ProductUnavailable'
import { ArrowLeft } from 'lucide-react'

interface ProductDetailClientProps {
  group: {
    id: number
    isActive: boolean
    product: {
      id: number
      name: string
      description: string | null
      category: string
      imageUrl: string
      organic: boolean
      local: boolean
      vendorProfile: {
        id: number
        businessName: string
      }
    }
    marketDay: {
      id: number
      startTime: Date | string
      marketSchedule: {
        id: number
        name: string
        location: string
      }
    }
    variations: Array<{
      id: number
      price: number
      quantity: number
      isActive: boolean
      size: number
      packaged: boolean
      productUnit: {
        id: number
        name: string
        pluralName: string
        displayName: string
        symbol: string
      }
    }>
  }
}

export default function ProductDetailClient({
  group,
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedUnitIdx, setSelectedUnitIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const variations = group.variations.filter((u) => u.isActive)
  const selectedUnit = variations[selectedUnitIdx] || variations[0]

  // Create product images array for gallery (using the same image for now)
  const productImages = [
    group.product.imageUrl,
    group.product.imageUrl,
    group.product.imageUrl,
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <PageHeader title="Product Details" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-left">
            <Link
              href="/shop"
              className="text-market-green hover:text-market-green-dark mb-6 inline-flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Link>
          </div>

          <div className="max-w-6xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <ProductImageGallery
                images={productImages}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
              <div className="space-y-6">
                <ProductInfo
                  name={group.product.name}
                  vendorId={group.product.vendorProfile.id}
                  vendorName={group.product.vendorProfile.businessName}
                  category={group.product.category}
                  organic={group.product.organic}
                  local={group.product.local}
                />
                <MarketDayInfo
                  scheduleName={group.marketDay.marketSchedule.name}
                  location={group.marketDay.marketSchedule.location}
                  startTime={group.marketDay.startTime}
                />
                <ProductDescription
                  description={group.product.description}
                  showFull={showFullDescription}
                  setShowFull={setShowFullDescription}
                />
                {selectedUnit.isActive && selectedUnit.quantity > 0 ? (
                  <PackageOptionsSelector
                    variations={variations}
                    selectedUnitIdx={selectedUnitIdx}
                    setSelectedUnitIdx={setSelectedUnitIdx}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    showDropdown={showDropdown}
                    setShowDropdown={setShowDropdown}
                  />
                ) : (
                  <ProductUnavailable />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
