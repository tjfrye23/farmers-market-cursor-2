import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import { ProductImageGallery } from '@/components/product-detail/ProductImageGallery'
import { ProductInfo } from '@/components/product-detail/ProductInfo'
import { MarketDayInfo } from '@/components/product-detail/MarketDayInfo'
import { ProductDescription } from '@/components/product-detail/ProductDescription'
import { PackageOptionsSelector } from '@/components/product-detail/PackageOptionsSelector'
import { ArrowLeft } from 'lucide-react'
import { ClientMarketDayProduct } from '@/types/product'

interface ProductDetailClientProps {
  product: ClientMarketDayProduct
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  // Create product images array for gallery (using the same image for now)
  const productImages = [product.imageUrl, product.imageUrl]

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
              <ProductImageGallery images={productImages} />
              <div className="space-y-6">
                <ProductInfo
                  name={product.name}
                  vendorId={product.vendor.id}
                  vendorName={product.vendor.businessName}
                  category={product.category}
                  organic={product.organic}
                  local={product.local}
                />
                <MarketDayInfo
                  scheduleName={product.marketDay.name}
                  location={product.marketDay.location}
                  startTime={product.marketDay.startTime}
                />
                <ProductDescription description={product.description} />
                <PackageOptionsSelector product={product} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
