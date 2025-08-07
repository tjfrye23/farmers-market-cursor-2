import { VendorStatus } from '@/generated/prisma/client'

export function getVendorStatusDisplayName(status: VendorStatus): string {
  switch (status) {
    case VendorStatus.PENDING:
      return 'Pending'
    case VendorStatus.ACTIVE:
      return 'Active'
    case VendorStatus.SUSPENDED:
      return 'Suspended'
    case VendorStatus.INACTIVE:
      return 'Inactive'
    case VendorStatus.BANNED:
      return 'Banned'
    default:
      return status
  }
}

export function getVendorStatusVariant(
  status: VendorStatus
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case VendorStatus.ACTIVE:
      return 'default'
    case VendorStatus.PENDING:
      return 'outline'
    case VendorStatus.SUSPENDED:
      return 'secondary'
    case VendorStatus.INACTIVE:
      return 'secondary'
    case VendorStatus.BANNED:
      return 'destructive'
    default:
      return 'outline'
  }
}

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
  status: VendorStatus
}

export type ClientVendorSimple = Pick<ClientVendor, 'id' | 'businessName'>
