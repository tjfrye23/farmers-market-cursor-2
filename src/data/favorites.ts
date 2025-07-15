import { db } from '@/lib/prisma'

export async function getUserFavoriteProductIds(
  userId: number
): Promise<Set<number>> {
  const favorites = await db.favorite.findMany({
    where: { userId },
    select: { productId: true },
  })
  return new Set(favorites.map((fav) => fav.productId))
}
