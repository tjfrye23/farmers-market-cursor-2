'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/providers/auth-provider'

export function Header() {
  const { user, loading } = useAuth()

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Farmers Market
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/products" className="hover:text-gray-600">
            Products
          </Link>
          <Link href="/vendors" className="hover:text-gray-600">
            Vendors
          </Link>
          <Link href="/market-days" className="hover:text-gray-600">
            Market Days
          </Link>
          {loading ? (
            <span className="h-8 w-20 animate-pulse rounded bg-gray-200" />
          ) : user ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {}}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
