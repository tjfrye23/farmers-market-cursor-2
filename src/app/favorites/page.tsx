import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { FavoritesGridClient } from './FavoritesGridClient'
import { getUserFavorites } from '@/data/favorites'

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">My Favorites</h1>
        <p className="mb-8 text-gray-600">
          Please log in to view your favorites.
        </p>
        <Link href="/auth/login">
          <Button className="bg-market-green hover:bg-market-green-dark text-white">
            Login
          </Button>
        </Link>
      </div>
    )
  }

  const products = await getUserFavorites(session.user.id)

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
      </div>
      {products.length === 0 ? (
        <div className="py-16 text-center">
          <Heart className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <h2 className="mb-2 text-2xl font-semibold text-gray-900">
            No favorites yet
          </h2>
          <p className="mb-8 text-gray-600">
            Start adding products to your favorites by clicking the heart icon
            on any product.
          </p>
          <Link href="/shop">
            <Button className="bg-market-green hover:bg-market-green-dark text-white">
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <FavoritesGridClient products={products} />
      )}
    </div>
  )
}
