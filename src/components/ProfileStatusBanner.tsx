import { CheckCircle, Clock, AlertTriangle, XCircle, Ban } from 'lucide-react'
import { ClientVendor, getVendorStatusDisplayName } from '@/types/vendors'
import { VendorStatus } from '@/generated/prisma/client'

interface ProfileStatusBannerProps {
  vendorProfile: ClientVendor
}

export default function ProfileStatusBanner({
  vendorProfile,
}: ProfileStatusBannerProps) {
  const getStatusIcon = (status: VendorStatus) => {
    switch (status) {
      case VendorStatus.ACTIVE:
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case VendorStatus.PENDING:
        return <Clock className="h-5 w-5 text-yellow-600" />
      case VendorStatus.SUSPENDED:
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case VendorStatus.INACTIVE:
        return <XCircle className="h-5 w-5 text-gray-600" />
      case VendorStatus.BANNED:
        return <Ban className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: VendorStatus) => {
    switch (status) {
      case VendorStatus.ACTIVE:
        return 'bg-green-100 text-green-800 border-green-200'
      case VendorStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case VendorStatus.SUSPENDED:
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case VendorStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case VendorStatus.BANNED:
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusMessage = (status: VendorStatus) => {
    switch (status) {
      case VendorStatus.ACTIVE:
        return 'Your profile is approved and products are visible to customers.'
      case VendorStatus.PENDING:
        return 'Your profile is under admin review. Products will be visible once approved.'
      case VendorStatus.SUSPENDED:
        return 'Your profile has been suspended. Please contact support for more information.'
      case VendorStatus.INACTIVE:
        return 'Your profile is inactive. Please contact support to reactivate.'
      case VendorStatus.BANNED:
        return 'Your profile has been banned. Please contact support for more information.'
      default:
        return 'Your profile status is unknown. Please contact support.'
    }
  }

  return (
    <div
      className={`mb-6 flex items-center gap-3 rounded-lg border p-4 ${getStatusColor(vendorProfile.status)}`}
    >
      {getStatusIcon(vendorProfile.status)}
      <div>
        <p className="font-medium">
          Profile Status: {getVendorStatusDisplayName(vendorProfile.status)}
        </p>
        <p className="text-sm">{getStatusMessage(vendorProfile.status)}</p>
      </div>
    </div>
  )
}
