'use client'

import { SessionProvider } from 'next-auth/react'
import QueryProvider from '@/providers/QueryProvider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import CartProvider from '@/providers/CartProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <CartProvider>{children}</CartProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryProvider>
    </SessionProvider>
  )
}
