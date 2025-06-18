import React from 'react'
import {
  MetricCard,
  MetricCardHeader,
  MetricCardTitle,
  MetricCardDescription,
  MetricCardContent,
} from '@/components/ui/metricCard'
import { MapPin, Store } from 'lucide-react'
import { VendorSocialLinks } from './VendorSocialLinks'
import { VendorAbout } from './VendorAbout'
import { VendorActions } from './VendorActions'

interface VendorInfoCardProps {
  businessName: string
  ownerName?: string | null
  address?: string | null
  specialty?: string | null
  description?: string | null
  websiteUrl?: string | null
  facebookHandle?: string | null
  instagramHandle?: string | null
  twitterHandle?: string | null
  youtubeHandle?: string | null
}

export const VendorInfoCard: React.FC<VendorInfoCardProps> = ({
  businessName,
  ownerName,
  address,
  specialty,
  description,
  websiteUrl,
  facebookHandle,
  instagramHandle,
  twitterHandle,
  youtubeHandle,
}) => (
  <MetricCard className="shadow-xl">
    <MetricCardHeader className="pb-2">
      <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
        <div>
          <MetricCardTitle className="font-display text-market-green-dark text-3xl">
            {businessName}
          </MetricCardTitle>
          <MetricCardDescription className="mt-1 text-xl">
            Owned by {ownerName}
          </MetricCardDescription>
        </div>
      </div>
    </MetricCardHeader>
    <MetricCardContent className="pt-2">
      <div className="mb-4 flex items-center text-gray-600">
        <MapPin className="text-market-green mr-2 h-5 w-5" />
        <span>{address || 'California'}</span>
      </div>
      <div className="mb-6 flex items-center text-gray-600">
        <Store className="text-market-green mr-2 h-5 w-5" />
        <span>Specialty: {specialty || 'Fresh Produce'}</span>
      </div>
      <VendorSocialLinks
        websiteUrl={websiteUrl}
        facebookHandle={facebookHandle}
        instagramHandle={instagramHandle}
        twitterHandle={twitterHandle}
        youtubeHandle={youtubeHandle}
        businessName={businessName}
      />
      <VendorAbout
        businessName={businessName}
        description={description}
        ownerName={ownerName}
      />
      <VendorActions />
    </MetricCardContent>
  </MetricCard>
)
