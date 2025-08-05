import 'next-auth'
import { UserRole } from '@/lib/auth'
import { ClientVendor } from '@/types/vendors'

// Extend next-auth types
declare module 'next-auth' {
  interface User {
    id: number
    name: string
    email: string
    role: UserRole
    vendorProfile: Pick<ClientVendor, 'id' | 'businessName'> | null
  }

  interface Session {
    user: {
      id: number
      name: string
      email: string
      role: UserRole
      vendorProfile?: Pick<ClientVendor, 'id' | 'businessName'> | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number
    name: string
    email: string
    role: UserRole
    vendorProfile?: Pick<ClientVendor, 'id' | 'businessName'> | null
  }
}
