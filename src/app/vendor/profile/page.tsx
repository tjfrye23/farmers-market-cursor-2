import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import VendorDetailPage from '@/app/vendors/[id]/page'

export default async function VendorProfilePage() {
  const session = await getServerSession(authOptions)
  const vendorProfileId = session?.user?.vendorProfile?.id

  if (!vendorProfileId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        You must be a vendor to view this page.
      </div>
    )
  }

  return (
    <VendorDetailPage
      params={{ id: String(vendorProfileId) }}
      isProfileView={true}
    />
  )
}
