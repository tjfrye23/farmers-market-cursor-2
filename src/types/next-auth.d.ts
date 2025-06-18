import 'next-auth'

// Extend next-auth types
declare module 'next-auth' {
  interface User {
    id: number
    name: string
    email: string
    role: UserRole
    vendorProfile: Pick<VendorProfile, 'id' | 'name'> | null
  }

  interface Session {
    user: {
      id: number
      name: string
      email: string
      role: UserRole
      vendorProfile?: Pick<VendorProfile, 'id' | 'name'> | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number
    name: string
    email: string
    role: UserRole
    vendorProfile?: Pick<VendorProfile, 'id' | 'name'> | null
  }
}
