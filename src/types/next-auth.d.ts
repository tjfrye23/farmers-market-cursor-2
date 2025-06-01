import 'next-auth'

// Extend next-auth types
declare module 'next-auth' {
  interface User {
    role: UserRole
  }

  interface Session {
    user: {
      id: string
      role: UserRole
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
  }
}
