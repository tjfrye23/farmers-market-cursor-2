import { UserRole } from '@/generated/prisma/client'

export type VendorSignupResult =
  | VendorSignupResultSuccess
  | VendorSignupResultError

interface VendorSignupResultSuccess {
  success: true
  data: {
    user: {
      id: number
      name: string
      email: string
      role: UserRole
    }
    vendorProfile: {
      id: number
      businessName: string
    }
  }
}

interface VendorSignupResultError {
  success: false
  error: string
}

export function isVendorSignupResultError(
  result: VendorSignupResult
): result is VendorSignupResultError {
  return !result.success
}
