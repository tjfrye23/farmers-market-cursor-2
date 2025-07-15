import { CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { ClientVendor } from '@/types/vendors'

interface ProfileStatusBannerProps {
  vendorProfile: ClientVendor
}

export default function ProfileStatusBanner({
  vendorProfile,
}: ProfileStatusBannerProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'rejected':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div
      className={`mb-6 flex items-center gap-3 rounded-lg border p-4 ${getStatusColor(vendorProfile.status || 'pending')}`}
    >
      {getStatusIcon(vendorProfile.status || 'pending')}
      <div>
        <p className="font-medium">
          Profile Status:{' '}
          {vendorProfile.status === 'active'
            ? 'Active'
            : vendorProfile.status === 'pending'
              ? 'Pending Review'
              : 'Rejected'}
        </p>
        <p className="text-sm">
          {vendorProfile.status === 'active' &&
            'Your profile is approved and products are visible to customers.'}
          {vendorProfile.status === 'pending' &&
            'Your profile is under admin review. Products will be visible once approved.'}
          {vendorProfile.status === 'rejected' &&
            'Your profile was rejected. Please contact support for more information.'}
        </p>
      </div>
    </div>
  )
}
