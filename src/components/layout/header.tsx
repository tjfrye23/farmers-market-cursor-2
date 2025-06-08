'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Menu } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// TODO: Replace with real cart context/hook
function useCart() {
  return { getTotalItems: () => 0 }
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()
  const { getTotalItems } = useCart()
  const cartItemCount = getTotalItems()
  const isLoading = status === 'loading'
  const user = session?.user

  // TODO: Replace with real role logic
  const isVendor = false
  const isAdmin = false

  const getUserInitials = () => {
    if (!user) return 'U'
    const name = user.name
    return name.charAt(0).toUpperCase()
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-market-green-dark font-display text-2xl font-bold">
                Market Fresh
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/cart"
              className="hover:text-market-green relative p-2 text-gray-700 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Link>

            {/* User Actions */}
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900" />
            ) : user ? (
              <div className="flex items-center">
                <Avatar className="h-8 w-8 cursor-pointer transition-opacity hover:opacity-80">
                  {/* No user.image available, fallback only */}
                  <AvatarFallback className="bg-market-green text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div className="hidden items-center space-x-2 md:flex">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.location.href = '/auth/login'
                  }}
                  className="items-center"
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    window.location.href = '/vendor/onboarding'
                  }}
                  className="bg-market-green hover:bg-market-green-dark items-center"
                >
                  Join as a Vendor
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="rounded-md p-2 text-gray-700 focus:outline-none">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent className="w-[300px] pt-14 sm:w-[350px]">
                {/* TODO: Replace with real NavLinks and logic */}
                <div className="space-y-4 py-4">
                  <Link
                    href="/"
                    className="hover:text-market-green-dark block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/shop"
                    className="hover:text-market-green-dark block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Shop
                  </Link>
                  <Link
                    href="/favorites"
                    className="hover:text-market-green-dark block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Favorites
                  </Link>
                  <Link
                    href="/vendors"
                    className="hover:text-market-green-dark block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Our Vendors
                  </Link>
                  <Link
                    href="/markets"
                    className="hover:text-market-green-dark block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Our Markets
                  </Link>
                  <Link
                    href="/about"
                    className="hover:text-market-green-dark block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    About Us
                  </Link>
                  {user && (
                    <Link
                      href="/orders"
                      className="hover:text-market-green-dark block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      My Orders
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="block rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50 hover:text-red-700"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {isVendor && (
                    <Link
                      href="/vendor/dashboard"
                      className="text-market-green-dark hover:text-market-green-dark block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      Vendor Dashboard
                    </Link>
                  )}
                  <div className="border-t border-gray-200 pt-2">
                    {user ? (
                      <button
                        onClick={() => {
                          signOut()
                          setIsOpen(false)
                        }}
                        className="hover:text-market-green-dark flex w-full items-center rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            window.location.href = '/auth/login'
                            setIsOpen(false)
                          }}
                          className="hover:text-market-green-dark flex w-full items-center rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => {
                            window.location.href = '/vendor/onboarding'
                            setIsOpen(false)
                          }}
                          className="text-market-green hover:text-market-green-dark flex w-full items-center rounded-md px-3 py-2 text-base font-medium hover:bg-gray-50"
                        >
                          Join as a Vendor
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
