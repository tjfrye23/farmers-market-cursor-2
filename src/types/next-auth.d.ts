import 'next-auth'

// Extend next-auth types
declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    role: UserRole
  }

  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: UserRole
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    name: string
    email: string
    role: UserRole
  }
}
