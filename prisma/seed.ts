import { PrismaClient } from '../src/generated/prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. Seed all needed ProductUnits and keep a map of their IDs
  const productUnitNames = [
    { name: 'lb', pluralName: 'lbs', displayName: 'Pound', symbol: '$/lb' },
    { name: 'ea', pluralName: 'units', displayName: 'Each', symbol: '$/ea' },
    { name: 'box', pluralName: 'boxes', displayName: 'Box', symbol: '$/box' },
    { name: 'bag', pluralName: 'bags', displayName: 'Bag', symbol: '$/bag' },
  ]
  const productUnitMap: Record<string, number> = {}
  for (const unit of productUnitNames) {
    const created = await prisma.productUnit.upsert({
      where: { name: unit.name },
      update: {},
      create: unit,
    })
    productUnitMap[unit.name] = created.id
  }

  // Create admin user
  const adminPassword = await hash('test', 12)
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
    },
  })

  // Create vendor users and their profiles
  const vendor1Password = await hash('test', 12)
  const vendor1 = await prisma.user.upsert({
    where: { email: 'vendor@example.com' },
    update: {},
    create: {
      email: 'vendor@example.com',
      name: 'TJ Boner',
      password: vendor1Password,
      role: 'vendor',
      vendorProfile: {
        create: {
          businessName: 'Organic Farm Fresh',
          description: 'Locally grown organic produce',
          specialty: 'Organic',
          phone: '555-0101',
          address: '123 Farm Road, Countryside',
          websiteUrl: 'https://organicfarmfresh.com',
          facebookHandle: 'organicfarmfresh',
          instagramHandle: 'organicfarmfresh',
          twitterHandle: 'organicfarmfresh',
          youtubeHandle: 'organicfarmfresh',
          headerImageUrl: '/images/products/farmer-field.jpeg',
          email: 'vendor@example.com',
          status: 'active',
        },
      },
    },
  })
  const vendor1Profile = await prisma.vendorProfile.findUnique({
    where: { userId: vendor1.id },
  })

  const vendor2Password = await hash('vendor123', 12)
  const vendor2 = await prisma.user.upsert({
    where: { email: 'bakery@farmersmarket.com' },
    update: {},
    create: {
      email: 'bakery@farmersmarket.com',
      name: 'A Vendor',
      password: vendor2Password,
      role: 'vendor',
      vendorProfile: {
        create: {
          businessName: 'Fresh Baked Goods',
          description: 'Artisanal breads and pastries',
          specialty: 'Bakery',
          phone: '555-0102',
          address: '456 Baker Street, Downtown',
          websiteUrl: 'https://freshbakedgoods.com',
          facebookHandle: 'freshbakedgoods',
          instagramHandle: 'freshbakedgoods',
          twitterHandle: 'freshbakedgoods',
          youtubeHandle: 'freshbakedgoods',
          headerImageUrl: '/images/products/farmer-field.jpeg',
          email: 'bakery@farmersmarket.com',
          status: 'active',
        },
      },
    },
  })
  const vendor2Profile = await prisma.vendorProfile.findUnique({
    where: { userId: vendor2.id },
  })

  // Add 15 more vendor users and profiles
  for (let i = 3; i <= 17; i++) {
    const password = await hash('vendor' + i, 12)
    await prisma.user.upsert({
      where: { email: `vendor${i}@farmersmarket.com` },
      update: {},
      create: {
        email: `vendor${i}@farmersmarket.com`,
        name: `Vendor ${i}`,
        password,
        role: 'vendor',
        vendorProfile: {
          create: {
            businessName: `Vendor Business ${i}`,
            description: `Description for Vendor ${i}`,
            specialty: `Specialty ${i}`,
            phone: `555-01${i.toString().padStart(2, '0')}`,
            address: `${i * 10} Market Street, Cityville`,
            websiteUrl: `https://vendor${i}.com`,
            facebookHandle: `vendor${i}`,
            instagramHandle: `vendor${i}`,
            twitterHandle: `vendor${i}`,
            youtubeHandle: `vendor${i}`,
            headerImageUrl: '/images/products/farmer-field.jpeg',
            email: `vendor${i}@farmersmarket.com`,
            status: 'active',
          },
        },
      },
    })
  }

  // Create regular customer
  const customerPassword = await hash('test', 12)
  await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'John Customer',
      password: customerPassword,
      role: 'user',
    },
  })

  // Create a market schedule and a market day
  const schedule = await prisma.marketSchedule.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Main Market Schedule',
      location: 'Central Park',
      reoccurring: true,
      startTime: new Date('2024-06-01T08:00:00Z'),
      endTime: new Date('2024-06-01T14:00:00Z'),
      onlineStartTime: new Date('2024-05-31T08:00:00Z'),
      onlineEndTime: new Date('2024-06-01T07:59:59Z'),
      status: 'PUBLISHED',
      description: 'Main market schedule',
    },
  })
  const marketDay = await prisma.marketDay.create({
    data: {
      description: 'Saturday Market',
      startTime: new Date('2024-06-15T08:00:00Z'),
      endTime: new Date('2024-06-15T14:00:00Z'),
      onlineStartTime: new Date('2024-06-14T08:00:00Z'),
      onlineEndTime: new Date('2024-06-15T07:59:59Z'),
      status: 'PUBLISHED',
      marketScheduleId: schedule.id,
    },
  })

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
      category: string
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
        data: { ...v, productId: product.id, price: Math.random() * 9 + 1 },
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
        category: 'Vegetables',
        imageUrl: '/images/products/tomatoes.webp',
        organic: true,
        local: true,
      },
      variations: [
        { name: '1 lb', size: 1, packaged: false, unit: 'lb' },
        { name: '2 lb', size: 2, packaged: false, unit: 'lb' },
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
        category: 'Vegetables',
        imageUrl: '/images/products/lettuce.webp',
        organic: true,
      },
      variations: [
        { name: 'Head', size: 1, packaged: false, unit: 'ea' },
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
        category: 'Vegetables',
        imageUrl: '/images/products/carrots.webp',
        local: true,
      },
      variations: [
        { name: '1 lb', size: 1, packaged: false, unit: 'lb' },
        { name: '2 lb', size: 2, packaged: false, unit: 'lb' },
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
        category: 'Bakery',
        imageUrl: '/images/products/sourdough.webp',
      },
      variations: [
        { name: 'Loaf', size: 1, packaged: true, unit: 'ea' },
        { name: 'Half Loaf', size: 0.5, packaged: true, unit: 'ea' },
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
        category: 'Bakery',
        imageUrl: '/images/products/croissants.webp',
      },
      variations: [
        { name: 'Single', size: 1, packaged: false, unit: 'ea' },
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

  // Create sample orders for vendor@example.com
  if (vendor1Profile) {
    // Get the market day products for vendor1 to use in orders
    const vendor1MarketDayProducts = await prisma.marketDayProduct.findMany({
      where: {
        product: {
          vendorProfileId: vendor1Profile.id,
        },
        marketDayId: marketDay.id,
      },
      include: {
        variations: {
          include: {
            productVariation: true,
          },
        },
      },
    })

    // Create a few customers for orders
    const customer1 = await prisma.user.upsert({
      where: { email: 'sarah@example.com' },
      update: {},
      create: {
        email: 'sarah@example.com',
        name: 'Sarah Johnson',
        password: await hash('password123', 12),
        role: 'user',
      },
    })

    const customer2 = await prisma.user.upsert({
      where: { email: 'mike@example.com' },
      update: {},
      create: {
        email: 'mike@example.com',
        name: 'Mike Chen',
        password: await hash('password123', 12),
        role: 'user',
      },
    })

    const customer3 = await prisma.user.upsert({
      where: { email: 'emma@example.com' },
      update: {},
      create: {
        email: 'emma@example.com',
        name: 'Emma Davis',
        password: await hash('password123', 12),
        role: 'user',
      },
    })

    // Helper function to create an order with items
    async function createOrderWithItems({
      customerId,
      status,
      orderItems,
      createdAt,
    }: {
      customerId: number
      status: string
      orderItems: Array<{
        marketDayProductId: number
        variationId: number
        quantity: number
        price: number
      }>
      createdAt: Date
    }) {
      const total = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )

      const order = await prisma.order.create({
        data: {
          userId: customerId,
          marketDayId: marketDay.id,
          status,
          total,
          createdAt,
        },
      })

      for (const item of orderItems) {
        // Find the unit for this variation
        // Find the marketDayProduct and variation
        const mdp = vendor1MarketDayProducts.find(
          (p) => p.id === item.marketDayProductId
        )
        const variation = mdp?.variations.find((v) => v.id === item.variationId)
        const unitName = variation?.productVariation?.unit || 'ea'
        const productUnitId = productUnitMap[unitName] || productUnitMap['ea']
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            marketDayProductId: item.marketDayProductId,
            productUnitId,
            quantity: item.quantity,
            price: item.price,
            status: 'processing',
          },
        })
      }

      return order
    }

    // Create sample orders
    if (vendor1MarketDayProducts.length > 0) {
      // Order 1: Pending order with tomatoes and lettuce
      await createOrderWithItems({
        customerId: customer1.id,
        status: 'pending',
        orderItems: [
          {
            marketDayProductId: vendor1MarketDayProducts[0].id, // Tomatoes
            variationId: vendor1MarketDayProducts[0].variations[0].id,
            quantity: 2,
            price: 4.99,
          },
          {
            marketDayProductId: vendor1MarketDayProducts[1].id, // Lettuce
            variationId: vendor1MarketDayProducts[1].variations[0].id,
            quantity: 1,
            price: 2.99,
          },
        ],
        createdAt: new Date('2024-06-14T10:30:00Z'),
      })

      // Order 2: Confirmed order with carrots
      await createOrderWithItems({
        customerId: customer2.id,
        status: 'confirmed',
        orderItems: [
          {
            marketDayProductId: vendor1MarketDayProducts[2].id, // Carrots
            variationId: vendor1MarketDayProducts[2].variations[0].id,
            quantity: 3,
            price: 3.99,
          },
        ],
        createdAt: new Date('2024-06-14T11:15:00Z'),
      })

      // Order 3: Completed order with multiple items
      await createOrderWithItems({
        customerId: customer3.id,
        status: 'completed',
        orderItems: [
          {
            marketDayProductId: vendor1MarketDayProducts[0].id, // Tomatoes
            variationId: vendor1MarketDayProducts[0].variations[1].id, // 2 lb
            quantity: 1,
            price: 8.99,
          },
          {
            marketDayProductId: vendor1MarketDayProducts[2].id, // Carrots
            variationId: vendor1MarketDayProducts[2].variations[1].id, // 2 lb
            quantity: 2,
            price: 7.49,
          },
        ],
        createdAt: new Date('2024-06-13T14:20:00Z'),
      })

      // Order 4: Another pending order
      await createOrderWithItems({
        customerId: customer1.id,
        status: 'pending',
        orderItems: [
          {
            marketDayProductId: vendor1MarketDayProducts[1].id, // Lettuce
            variationId: vendor1MarketDayProducts[1].variations[1].id, // Bag
            quantity: 2,
            price: 6.99,
          },
        ],
        createdAt: new Date('2024-06-14T12:45:00Z'),
      })

      // Order 5: Cancelled order
      await createOrderWithItems({
        customerId: customer2.id,
        status: 'cancelled',
        orderItems: [
          {
            marketDayProductId: vendor1MarketDayProducts[0].id, // Tomatoes
            variationId: vendor1MarketDayProducts[0].variations[2].id, // Box
            quantity: 1,
            price: 19.99,
          },
        ],
        createdAt: new Date('2024-06-14T09:10:00Z'),
      })
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
