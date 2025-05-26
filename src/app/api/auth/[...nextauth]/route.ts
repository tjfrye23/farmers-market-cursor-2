import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import { db } from '@/lib/prisma'

export const authOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Add more providers here (e.g., Email, GitHub, etc.)
  ],
  session: {
    strategy: 'jwt' as const,
  },
  // Add callbacks, pages, events, etc. as needed
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
