import { db } from '@/lib/prisma'
import { ClientProduct, ClientProductSimple } from '@/types/product'

export async function getUserFavoriteProducts(
  userId: number
): Promise<ClientProductSimple[]> {
  const favorites = await db.favorite.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          vendorProfile: true,
        },
      },
    },
  })

  return favorites.map<ClientProductSimple>((fav) => {
    const product = fav.product

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      vendorId: product.vendorProfile.id,
      vendorName: product.vendorProfile.businessName,
      organic: product.organic,
      local: product.local,
    }
  })
}

/**
 * Fetch all products for a vendor, including variations.
 */
export async function getVendorProducts(
  vendorProfileId: number
): Promise<ClientProduct[]> {
  const products = await db.product.findMany({
    where: { vendorProfileId },
    include: {
      variations: true,
      vendorProfile: {
        select: {
          id: true,
          businessName: true,
        },
      },
    },
  })

  return products.map<ClientProduct>((product) => {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      vendorId: product.vendorProfile.id,
      vendorName: product.vendorProfile.businessName,
      organic: product.organic,
      local: product.local,
      unit: product.variations[0].unit,
      price: product.variations[0].price,
      variations: product.variations.map((variation) => ({
        id: variation.id,
        name: variation.name,
        size: variation.size,
        packaged: variation.packaged,
        unit: variation.unit,
        price: variation.price,
      })),
    }
  })
}
