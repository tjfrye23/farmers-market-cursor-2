import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { headers } from 'next/headers'
import { VendorHeroImage } from '@/components/vendor-detail/VendorHeroImage'
import { VendorInfoCard } from '@/components/vendor-detail/VendorInfoCard'
import { VendorProductsSection } from '@/components/vendor-detail/VendorProductsSection'

async function getBaseUrl() {
  const h = await headers()
  const proto = h.get('x-forwarded-proto') || 'http'
  const host = h.get('host')
  return `${proto}://${host}`
}

async function getVendor(id: string) {
  const baseUrl = await getBaseUrl()
  const res = await fetch(`${baseUrl}/api/vendor-profiles/${id}`, {
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

async function getVendorProducts(id: string) {
  const baseUrl = await getBaseUrl()
  const res = await fetch(`${baseUrl}/api/products?vendorId=${id}`, {
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

export default async function VendorDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const vendor = await getVendor(params.id)
  if (!vendor) return notFound()
  const products = await getVendorProducts(params.id)
  const defaultImage = '/images/products/farmer-field.jpeg'

  return (
    <div className="flex min-h-screen flex-col">
      {/* TODO: Add Navbar */}
      <main className="flex-grow">
        <div className="px-4 py-4">
          <Link href="/vendors">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vendors
            </Button>
          </Link>
        </div>
        <VendorHeroImage
          imageUrl={vendor.imageUrl}
          alt={vendor.businessName}
          defaultImage={defaultImage}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="relative z-10 mx-auto -mt-16 max-w-4xl">
            <VendorInfoCard
              businessName={vendor.businessName}
              ownerName={vendor.user?.name}
              address={vendor.address}
              specialty={vendor.specialty}
              description={vendor.description}
              websiteUrl={vendor.websiteUrl}
              facebookHandle={vendor.facebookHandle}
              instagramHandle={vendor.instagramHandle}
              twitterHandle={vendor.twitterHandle}
              youtubeHandle={vendor.youtubeHandle}
            />
            <VendorProductsSection
              products={products}
              businessName={vendor.businessName}
              defaultImage={defaultImage}
            />
          </div>
        </div>
      </main>
      {/* TODO: Add Footer */}
    </div>
  )
}
