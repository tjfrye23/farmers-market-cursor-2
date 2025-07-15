import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil } from 'lucide-react'
import { VendorHeroImage } from '@/components/vendor-detail/VendorHeroImage'
import { VendorInfoCard } from '@/components/vendor-detail/VendorInfoCard'
import { VendorProductsSectionClient } from '@/components/vendor-detail/VendorProductsSectionClient'
import { getVendorById } from '@/data/vendors'
import { getUserFavoriteProductIds } from '@/data/favorites'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface VendorDetailPageProps {
  params: { id: string }
  isProfileView?: boolean
}

export default async function VendorDetailPage({
  params,
  isProfileView = false,
}: VendorDetailPageProps) {
  const vendorId = Number(params.id)
  const session = await getServerSession(authOptions)

  if (isNaN(vendorId) || !session?.user) return notFound()

  const [vendorResult, favorites] = await Promise.all([
    getVendorById(vendorId),
    getUserFavoriteProductIds(session?.user?.id),
  ])

  if (!vendorResult) return notFound()

  const { vendor, products } = vendorResult

  const defaultImage = '/images/products/farmer-field.jpeg'

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <div className="flex items-center gap-4 px-4 py-4">
          <Link href={isProfileView ? '/vendor/dashboard' : '/vendors'}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isProfileView ? 'Back to Dashboard' : 'Back to Vendors'}
            </Button>
          </Link>
          {isProfileView && (
            <Link href="/vendor/profile/edit">
              <Button
                variant="secondary"
                className="mb-4 flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
        <VendorHeroImage
          imageUrl={vendor.headerImageUrl}
          alt={vendor.businessName}
          defaultImage={defaultImage}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="relative z-10 mx-auto -mt-16 max-w-4xl">
            <VendorInfoCard
              businessName={vendor.businessName}
              ownerName={vendor.ownerName}
              address={vendor.address}
              specialty={vendor.specialty}
              description={vendor.description}
              websiteUrl={vendor.websiteUrl}
              facebookHandle={vendor.facebookHandle}
              instagramHandle={vendor.instagramHandle}
              twitterHandle={vendor.twitterHandle}
              youtubeHandle={vendor.youtubeHandle}
            />
            <VendorProductsSectionClient
              products={products}
              businessName={vendor.businessName}
              defaultImage={defaultImage}
              favorites={favorites}
            />
          </div>
        </div>
      </main>
      {/* TODO: Add Footer */}
    </div>
  )
}
