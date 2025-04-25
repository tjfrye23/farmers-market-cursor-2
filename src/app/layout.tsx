import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/ui/globals.css'
import { RootLayout } from '@/ui/layout/root-layout'
import { AuthProvider } from '@/lib/providers/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Farmers Market',
  description: 'Connect with local farmers and fresh produce',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <RootLayout>{children}</RootLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
