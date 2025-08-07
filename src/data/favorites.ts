import { db } from '@/lib/prisma'
import { ClientProduct } from '@/types/product'

export async function getUserFavoriteProductIds(
  userId: number
): Promise<Set<number>> {
  const favorites = await db.favorite.findMany({
    where: { userId },
    select: { productId: true },
  })
  return new Set(favorites.map((fav) => fav.productId))
}

export async function getUserFavorites(
  userId: number
): Promise<ClientProduct[]> {
  const favorites = await db.favorite.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          vendorProfile: {
            select: {
              id: true,
              businessName: true,
            },
          },
          variations: {
            include: {
              unit: true,
            },
          },
        },
      },
    },
  })

  return favorites.map((favorite) => {
    const firstVariation = favorite.product.variations[0]
    if (!firstVariation) {
      throw new Error(`Product ${favorite.product.id} has no variations`)
    }

    return {
      id: favorite.product.id,
      name: favorite.product.name,
      description: favorite.product.description,
      category: favorite.product.category,
      imageUrl: favorite.product.imageUrl,
      organic: favorite.product.organic,
      local: favorite.product.local,
      vendor: {
        id: favorite.product.vendorProfile.id,
        businessName: favorite.product.vendorProfile.businessName,
      },
      unit: {
        id: firstVariation.unit.id,
        name: firstVariation.unit.name,
        pluralName: firstVariation.unit.pluralName,
        displayName: firstVariation.unit.displayName,
        symbol: firstVariation.unit.symbol,
      },
      price: firstVariation.price,
      variations: favorite.product.variations.map((variation) => ({
        id: variation.id,
        name: variation.name,
        size: variation.size,
        packaged: variation.packaged,
        unit: {
          id: variation.unit.id,
          name: variation.unit.name,
          pluralName: variation.unit.pluralName,
          displayName: variation.unit.displayName,
          symbol: variation.unit.symbol,
        },
        price: variation.price,
      })),
    }
  })
}

export async function deleteUserFavorite(userId: number, productId: number) {
  return await db.favorite.deleteMany({
    where: { userId, productId },
  })
}

export async function createUserFavorite(userId: number, productId: number) {
  return await db.favorite.create({
    data: { userId, productId },
  })
}
