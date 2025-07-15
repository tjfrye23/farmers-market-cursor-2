export interface ClientVendor {
  id: number
  businessName: string
  description: string
  specialty: string
  phone?: string | null
  email: string
  headerImageUrl: string
  address?: string | null
  facebookHandle?: string | null
  instagramHandle?: string | null
  websiteUrl?: string | null
  youtubeHandle?: string | null
  twitterHandle?: string | null
  ownerName: string
  status: string
}
