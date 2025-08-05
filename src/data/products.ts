import { db } from '@/lib/prisma'
import {
  ClientMarketDayProduct,
  ClientMarketDayProductVariation,
  ClientProduct,
  ClientProductSimple,
  ClientProductVariation,
} from '@/types/product'
import { toMarketDayStatus } from '@/types/marketDay'

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
      vendor: {
        id: product.vendorProfile.id,
        businessName: product.vendorProfile.businessName,
      },
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
      variations: {
        include: {
          unit: true,
        },
      },
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
      vendor: {
        id: product.vendorProfile.id,
        businessName: product.vendorProfile.businessName,
      },
      organic: product.organic,
      local: product.local,
      unit: product.variations[0].unit,
      price: product.variations[0].price,
      variations: product.variations.map<ClientProductVariation>(
        (variation) => ({
          id: variation.id,
          name: variation.name,
          size: variation.size,
          packaged: variation.packaged,
          unit: variation.unit,
          price: variation.price,
        })
      ),
    }
  })
}

export async function getProductById(
  productId: number
): Promise<ClientProduct | null> {
  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      vendorProfile: true,
      variations: {
        include: {
          unit: true,
        },
      },
    },
  })

  if (!product) return null

  if (product.variations.length === 0) return null

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    imageUrl: product.imageUrl,
    category: product.category,
    vendor: {
      id: product.vendorProfile.id,
      businessName: product.vendorProfile.businessName,
    },
    organic: product.organic,
    local: product.local,
    unit: product.variations[0].unit,
    price: product.variations[0].price,
    variations: product.variations.map<ClientProductVariation>((variation) => ({
      id: variation.id,
      name: variation.name,
      size: variation.size,
      packaged: variation.packaged,
      unit: variation.unit,
      price: variation.price,
      quantity: 0,
    })),
  }
}

export async function getMarketDayProducts(
  marketDayId: number
): Promise<ClientProduct[]> {
  const marketDayProducts = await db.marketDayProduct.findMany({
    where: {
      marketDayId,
      isActive: true,
    },
    include: {
      product: {
        include: {
          vendorProfile: {
            select: {
              id: true,
              businessName: true,
            },
          },
        },
      },
      variations: {
        where: { isActive: true },
        include: {
          productVariation: {
            include: {
              unit: true,
            },
          },
        },
        orderBy: { id: 'asc' },
      },
    },
  })

  return marketDayProducts
    .filter((mdp) => mdp.variations.length > 0)
    .map<ClientProduct>((mdp) => {
      const firstVariation = mdp.variations[0]
      return {
        id: mdp.product.id,
        name: mdp.product.name,
        description: mdp.product.description,
        imageUrl: mdp.product.imageUrl,
        category: mdp.product.category,
        vendor: {
          id: mdp.product.vendorProfile.id,
          businessName: mdp.product.vendorProfile.businessName,
        },
        organic: mdp.product.organic,
        local: mdp.product.local,
        unit: firstVariation.productVariation.unit,
        price: firstVariation.price,
        variations: mdp.variations.map<ClientProductVariation>((variation) => ({
          id: variation.id,
          name: variation.productVariation.name,
          size: variation.productVariation.size,
          packaged: variation.productVariation.packaged,
          unit: variation.productVariation.unit,
          price: variation.price,
        })),
      }
    })
}

export async function getMarketDayProductById(
  productId: number
): Promise<ClientMarketDayProduct | null> {
  const product = await db.marketDayProduct.findUnique({
    where: { id: productId },
    include: {
      product: {
        include: {
          vendorProfile: true,
        },
      },
      marketDay: {
        include: {
          marketSchedule: true,
        },
      },
      variations: {
        include: {
          productVariation: {
            include: {
              unit: true,
            },
          },
        },
        orderBy: { id: 'asc' },
      },
    },
  })

  if (!product) return null

  product.variations = product?.variations.filter((v) => v.isActive)

  if (product.variations.length === 0) return null

  return {
    id: product.id,
    name: product.product.name,
    description: product.product.description,
    imageUrl: product.product.imageUrl,
    category: product.product.category,
    vendor: {
      id: product.product.vendorProfile.id,
      businessName: product.product.vendorProfile.businessName,
    },
    organic: product.product.organic,
    local: product.product.local,
    unit: product.variations[0].productVariation.unit,
    price: product.variations[0].price,
    variations: product.variations.map<ClientMarketDayProductVariation>(
      (variation) => ({
        id: variation.id,
        name: variation.productVariation.name,
        size: variation.productVariation.size,
        packaged: variation.productVariation.packaged,
        unit: variation.productVariation.unit,
        price: variation.price,
        quantity: variation.quantity,
      })
    ),
    marketDay: {
      id: product.marketDay.id,
      marketSchedule: product.marketDay.marketSchedule,
      location: product.marketDay.marketSchedule.location,
      description: product.marketDay.marketSchedule.description,
      status: toMarketDayStatus(product.marketDay.status),
      startTime: product.marketDay.startTime.toISOString(),
      endTime: product.marketDay.endTime.toISOString(),
      onlineStartTime: product.marketDay.onlineStartTime.toISOString(),
      onlineEndTime: product.marketDay.onlineEndTime.toISOString(),
      name: product.marketDay.marketSchedule.name,
    },
  }
}
