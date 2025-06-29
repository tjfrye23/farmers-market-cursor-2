'use client'

import { SessionProvider } from 'next-auth/react'
import QueryProvider from '@/providers/QueryProvider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryProvider>
    </SessionProvider>
  )
}
