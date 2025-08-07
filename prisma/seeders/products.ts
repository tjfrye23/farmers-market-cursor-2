/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '../../src/generated/prisma/client'
import { ProductCategory } from '../../src/generated/prisma/client'

export async function seedProducts(
  prisma: PrismaClient,
  vendor1Profile: any,
  vendor2Profile: any,
  marketDay: any,
  productUnitMap: Record<string, number>
) {
  console.log('🥕 Seeding products...')

  // Helper: Seed products, variations, and market day products for a vendor
  async function seedProductWithVariationsAndMarketDay({
    productData,
    variations,
    vendorProfileId,
    marketDayId,
    pricesAndQuantities,
  }: {
    productData: {
      name: string
      description: string
      category: ProductCategory
      imageUrl: string
      organic?: boolean
      local?: boolean
    }
    variations: Array<{
      name: string
      size: number
      packaged: boolean
      unit: string
    }>
    vendorProfileId: number
    marketDayId: number
    pricesAndQuantities: Array<{ price: number; quantity: number }>
  }) {
    const product = await prisma.product.create({
      data: {
        ...productData,
        vendorProfileId,
      },
    })
    const productVariations = []
    for (const v of variations) {
      const pv = await prisma.productVariation.create({
        data: {
          name: v.name,
          size: v.size,
          packaged: v.packaged,
          productId: product.id,
          price: Math.random() * 9 + 1,
          productUnitId: productUnitMap[v.unit],
        },
      })
      productVariations.push(pv)
    }
    const marketDayProduct = await prisma.marketDayProduct.create({
      data: {
        isActive: true,
        marketDayId,
        productId: product.id,
      },
    })
    for (let i = 0; i < productVariations.length; i++) {
      await prisma.marketDayProductVariation.create({
        data: {
          price: pricesAndQuantities[i].price,
          quantity: pricesAndQuantities[i].quantity,
          isActive: true,
          marketDayProductId: marketDayProduct.id,
          productVariationId: productVariations[i].id,
        },
      })
    }
  }

  // Seed products for vendor1
  if (vendor1Profile) {
    await seedProductWithVariationsAndMarketDay({
      productData: {
        name: 'Organic Tomatoes',
        description: 'Fresh organic tomatoes, locally grown',
        category: ProductCategory.VEGETABLES,
        imageUrl: '/images/products/tomatoes.webp',
        organic: true,
        local: true,
      },
      variations: [
        { name: '1 lb', size: 1, packaged: false, unit: 'pound' },
        { name: '2 lb', size: 2, packaged: false, unit: 'pound' },
        { name: 'Box', size: 5, packaged: true, unit: 'box' },
      ],
      vendorProfileId: vendor1Profile.id,
      marketDayId: marketDay.id,
      pricesAndQuantities: [
        { price: 4.99, quantity: 20 },
        { price: 8.99, quantity: 10 },
        { price: 19.99, quantity: 5 },
      ],
    })
    await seedProductWithVariationsAndMarketDay({
      productData: {
        name: 'Organic Lettuce',
        description: 'Crisp organic lettuce',
        category: ProductCategory.VEGETABLES,
        imageUrl: '/images/products/lettuce.webp',
        organic: true,
      },
      variations: [
        { name: 'Head', size: 1, packaged: false, unit: 'each' },
        { name: 'Bag', size: 3, packaged: true, unit: 'bag' },
      ],
      vendorProfileId: vendor1Profile.id,
      marketDayId: marketDay.id,
      pricesAndQuantities: [
        { price: 2.99, quantity: 30 },
        { price: 6.99, quantity: 12 },
      ],
    })
    await seedProductWithVariationsAndMarketDay({
      productData: {
        name: 'Organic Carrots',
        description: 'Sweet organic carrots',
        category: ProductCategory.VEGETABLES,
        imageUrl: '/images/products/carrots.webp',
        local: true,
      },
      variations: [
        { name: '1 lb', size: 1, packaged: false, unit: 'pound' },
        { name: '2 lb', size: 2, packaged: false, unit: 'pound' },
      ],
      vendorProfileId: vendor1Profile.id,
      marketDayId: marketDay.id,
      pricesAndQuantities: [
        { price: 3.99, quantity: 25 },
        { price: 7.49, quantity: 10 },
      ],
    })
  }

  // Seed products for vendor2
  if (vendor2Profile) {
    await seedProductWithVariationsAndMarketDay({
      productData: {
        name: 'Sourdough Bread',
        description: 'Freshly baked sourdough bread',
        category: ProductCategory.BAKERY,
        imageUrl: '/images/products/sourdough.webp',
      },
      variations: [
        { name: 'Loaf', size: 1, packaged: true, unit: 'each' },
        { name: 'Half Loaf', size: 0.5, packaged: true, unit: 'each' },
      ],
      vendorProfileId: vendor2Profile.id,
      marketDayId: marketDay.id,
      pricesAndQuantities: [
        { price: 5.99, quantity: 15 },
        { price: 3.49, quantity: 8 },
      ],
    })
    await seedProductWithVariationsAndMarketDay({
      productData: {
        name: 'Croissants',
        description: 'Buttery, flaky croissants',
        category: ProductCategory.BAKERY,
        imageUrl: '/images/products/croissants.webp',
      },
      variations: [
        { name: 'Single', size: 1, packaged: false, unit: 'each' },
        { name: 'Box of 6', size: 6, packaged: true, unit: 'box' },
      ],
      vendorProfileId: vendor2Profile.id,
      marketDayId: marketDay.id,
      pricesAndQuantities: [
        { price: 2.49, quantity: 20 },
        { price: 12.99, quantity: 5 },
      ],
    })
  }

  console.log('✅ Seeded products')
}
