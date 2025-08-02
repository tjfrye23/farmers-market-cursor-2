import Link from 'next/link'
import { Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import { ProductImageGallery } from '@/components/product-detail/ProductImageGallery'
import { ProductInfo } from '@/components/product-detail/ProductInfo'
import { MarketDayInfo } from '@/components/product-detail/MarketDayInfo'
import { ProductDescription } from '@/components/product-detail/ProductDescription'
import { PackageOptionsSelector } from '@/components/product-detail/PackageOptionsSelector'
import { ArrowLeft } from 'lucide-react'
import {
  ClientMarketDayProduct,
  ClientProduct,
  isClientMarketDayProduct,
} from '@/types/product'
import { ReadOnlyPackageOptions } from '@/components/product-detail/ReadOnlyPackageOptions'

interface ProductDetailClientProps {
  product: ClientProduct | ClientMarketDayProduct
  pageType?: 'vendor' | 'shop'
}

export default function ProductDetailClient({
  product,
  pageType = 'shop',
}: ProductDetailClientProps) {
  const { backHref, backText } =
    pageType === 'vendor'
      ? {
          backHref: '/vendor/dashboard',
          backText: 'Back to Dashboard',
        }
      : {
          backHref: '/shop',
          backText: 'Back to Shop',
        }

  // Create product images array for gallery (using the same image for now)
  const productImages = [product.imageUrl, product.imageUrl]

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <PageHeader title="Product Details" />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href={backHref}
              className="text-market-green hover:text-market-green-dark inline-flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backText}
            </Link>

            {pageType === 'vendor' && (
              <Link href={`/vendor/products/${product.id}/edit`}>
                <Button className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Product
                </Button>
              </Link>
            )}
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
                {isClientMarketDayProduct(product) ? (
                  <>
                    <MarketDayInfo
                      scheduleName={product.marketDay.name}
                      location={product.marketDay.location}
                      startTime={product.marketDay.startTime}
                    />
                    <ProductDescription description={product.description} />
                    <PackageOptionsSelector product={product} />
                  </>
                ) : (
                  <>
                    <ProductDescription description={product.description} />
                    <ReadOnlyPackageOptions product={product} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
