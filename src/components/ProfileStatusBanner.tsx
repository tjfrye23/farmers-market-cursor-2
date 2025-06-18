import { useState, useEffect } from 'react'
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react'

interface ProfileStatusBannerProps {
  userId: string
}

interface VendorProfile {
  id: number
  status: string
  businessName: string
  // Add other fields as needed
}

export default function ProfileStatusBanner({ userId }: ProfileStatusBannerProps) {
  const [profile, setProfile] = useState<VendorProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    fetch(`/api/vendor-profiles?userId=${userId}`)
      .then(res => res.json())
      .then((data) => {
        setProfile(data[0] || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [userId])

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

  if (loading || !profile) {
    return null
  }

  return (
    <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${getStatusColor(profile.status || 'pending')}`}>
      {getStatusIcon(profile.status || 'pending')}
      <div>
        <p className="font-medium">
          Profile Status: {profile.status === 'active' ? 'Active' : profile.status === 'pending' ? 'Pending Review' : 'Rejected'}
        </p>
        <p className="text-sm">
          {profile.status === 'active' && 'Your profile is approved and products are visible to customers.'}
          {profile.status === 'pending' && 'Your profile is under admin review. Products will be visible once approved.'}
          {profile.status === 'rejected' && 'Your profile was rejected. Please contact support for more information.'}
        </p>
      </div>
    </div>
  )
}
