import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import GoogleProvider from 'next-auth/providers/google'
// import AppleProvider from 'next-auth/providers/apple'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/prisma'
import { NextAuthOptions } from 'next-auth'
import bcrypt from 'bcryptjs'
import type { User } from 'next-auth'
import { isValidUserRole } from '@/lib/schemas/auth'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    // AppleProvider({
    //   clientId: process.env.APPLE_ID!,
    //   clientSecret: process.env.APPLE_SECRET!,
    // }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
          include: {
            vendorProfile: true,
          },
        })

        if (!user || !user.password) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) {
          return null
        }

        // Validate user role with Zod instead of type casting
        if (!isValidUserRole(user.role)) {
          console.error('Invalid user role:', user.role)
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          vendorProfile: user.vendorProfile
            ? {
                id: user.vendorProfile.id,
                businessName: user.vendorProfile.businessName,
              }
            : null,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = typeof user.id === 'number' ? user.id : parseInt(user.id)
        token.role = user.role
        token.vendorProfile = user.vendorProfile
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.vendorProfile = token.vendorProfile
      }
      return session
    },
  },
}
