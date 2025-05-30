import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/ui/globals.css'
import { RootLayout } from '@/ui/layout/root-layout'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Farmers Market',
  description: 'Connect with local farmers and fresh produce',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <RootLayout>{children}</RootLayout>
        </Providers>
      </body>
    </html>
  )
}
