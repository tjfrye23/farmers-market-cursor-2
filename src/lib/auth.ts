import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import GoogleProvider from 'next-auth/providers/google'
// import AppleProvider from 'next-auth/providers/apple'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/prisma'
import { NextAuthOptions } from 'next-auth'
import bcrypt from 'bcryptjs'

export type UserRole = 'user' | 'vendor' | 'admin'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    // AppleProvider({
    //   clientId: process.env.APPLE_CLIENT_ID!,
    //   clientSecret: process.env.APPLE_CLIENT_SECRET!,
    // }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
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

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          vendorProfile: user.vendorProfile
            ? {
                id: user.vendorProfile.id,
                name: user.vendorProfile.businessName,
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
        // if (user.vendorProfile) {
        //   token.vendorProfile = user.vendorProfile
        // } else if (user.role === 'vendor') {
        //   const vendorProfile = await db.vendorProfile.findUnique({
        //     where: { userId: token.id },
        //     select: { id: true, businessName: true },
        //   })
        //   if (vendorProfile) {
        //     token.vendorProfile = {
        //       id: vendorProfile.id,
        //       name: vendorProfile.businessName,
        //     }
        //   }
        // }
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
