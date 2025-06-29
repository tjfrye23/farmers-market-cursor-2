import { PrismaClient } from '../src/generated/prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
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
      name: 'Organic Farm',
      password: vendor1Password,
      role: 'vendor',
      vendorProfile: {
        create: {
          businessName: 'Organic Farm Fresh',
          description: 'Locally grown organic produce',
          phone: '555-0101',
          address: '123 Farm Road, Countryside',
          websiteUrl: 'https://organicfarmfresh.com',
          facebookHandle: 'organicfarmfresh',
          instagramHandle: 'organicfarmfresh',
          twitterHandle: 'organicfarmfresh',
          youtubeHandle: 'organicfarmfresh',
          headerImageUrl: '/images/products/farmer-field.jpeg',
          email: 'vendor@example.com',
        },
      },
    },
  })

  const vendor2Password = await hash('vendor123', 12)
  const vendor2 = await prisma.user.upsert({
    where: { email: 'bakery@farmersmarket.com' },
    update: {},
    create: {
      email: 'bakery@farmersmarket.com',
      name: 'Fresh Bakery',
      password: vendor2Password,
      role: 'vendor',
      vendorProfile: {
        create: {
          businessName: 'Fresh Baked Goods',
          description: 'Artisanal breads and pastries',
          phone: '555-0102',
          address: '456 Baker Street, Downtown',
          websiteUrl: 'https://freshbakedgoods.com',
          facebookHandle: 'freshbakedgoods',
          instagramHandle: 'freshbakedgoods',
          twitterHandle: 'freshbakedgoods',
          youtubeHandle: 'freshbakedgoods',
          headerImageUrl: '/images/products/farmer-field.jpeg',
          email: 'bakery@farmersmarket.com',
        },
      },
    },
  })

  // Create regular customer
  const customerPassword = await hash('test', 12)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'John Customer',
      password: customerPassword,
      role: 'user',
    },
  })

  // Create products
  const vendor1Profile = await prisma.vendorProfile.findUnique({
    where: { userId: vendor1.id },
  })

  const vendor2Profile = await prisma.vendorProfile.findUnique({
    where: { userId: vendor2.id },
  })

  if (vendor1Profile) {
    await prisma.product.createMany({
      data: [
        {
          name: 'Organic Tomatoes',
          description: 'Fresh organic tomatoes, locally grown',
          category: 'Vegetables',
          imageUrl: '/images/products/tomatoes.webp',
          vendorProfileId: vendor1Profile.id,
          organic: true,
          local: true,
        },
        {
          name: 'Organic Lettuce',
          description: 'Crisp organic lettuce',
          category: 'Vegetables',
          imageUrl: '/images/products/lettuce.webp',
          vendorProfileId: vendor1Profile.id,
          organic: true,
        },
        {
          name: 'Organic Carrots',
          description: 'Sweet organic carrots',
          category: 'Vegetables',
          imageUrl: '/images/products/carrots.webp',
          vendorProfileId: vendor1Profile.id,
          local: true,
        },
        {
          name: 'Organic Zucchini',
          description: 'Fresh organic zucchini',
          category: 'Vegetables',
          imageUrl: '/images/products/zucchini.webp',
          vendorProfileId: vendor1Profile.id,
        },
        {
          name: 'Organic Peppers',
          description: 'Colorful organic bell peppers',
          category: 'Vegetables',
          imageUrl: '/images/products/peppers.webp',
          vendorProfileId: vendor1Profile.id,
        },
        {
          name: 'Organic Cucumbers',
          description: 'Crisp organic cucumbers',
          category: 'Vegetables',
          imageUrl: '/images/products/cucumbers.webp',
          vendorProfileId: vendor1Profile.id,
        },
      ],
    })
  }

  if (vendor2Profile) {
    await prisma.product.createMany({
      data: [
        {
          name: 'Sourdough Bread',
          description: 'Freshly baked sourdough bread',
          category: 'Bakery',
          imageUrl: '/images/products/sourdough.webp',
          vendorProfileId: vendor2Profile.id,
        },
        {
          name: 'Croissants',
          description: 'Buttery, flaky croissants',
          category: 'Bakery',
          imageUrl: '/images/products/croissants.webp',
          vendorProfileId: vendor2Profile.id,
        },
      ],
    })
  }

  // Create a market schedule for the market days
  const schedule = await prisma.marketSchedule.create({
    data: {
      name: 'Spring Market Schedule',
      reoccurring: true,
      location: 'Downtown Square',
      description: 'Spring Market Schedule',
      startTime: new Date('2024-04-01T09:00:00Z'),
      endTime: new Date('2024-04-01T13:00:00Z'),
      onlineStartTime: new Date('2024-03-31T18:00:00Z'),
      onlineEndTime: new Date('2024-04-01T12:00:00Z'),
      status: 'PUBLISHED',
    },
  })

  const schedule2 = await prisma.marketSchedule.create({
    data: {
      name: 'Spring Market Schedule non reoccurring',
      reoccurring: false,
      location: 'Downtown Square non reoccurring',
      description: 'Spring Market Schedule non reoccurring',
      startTime: new Date('2024-04-02T09:00:00Z'),
      endTime: new Date('2024-04-02T13:00:00Z'),
      onlineStartTime: new Date('2024-03-31T18:00:00Z'),
      onlineEndTime: new Date('2024-04-01T12:00:00Z'),
      status: 'PUBLISHED',
    },
  })

  // Create market days
  const marketDay1 = await prisma.marketDay.create({
    data: {
      description: 'Spring Market Opening Day',
      status: 'scheduled',
      startTime: new Date('2024-04-01T09:00:00Z'),
      endTime: new Date('2024-04-01T13:00:00Z'),
      onlineStartTime: new Date('2024-03-31T18:00:00Z'),
      onlineEndTime: new Date('2024-04-01T12:00:00Z'),
      marketSchedule: { connect: { id: schedule.id } },
    },
  })

  const marketDay2 = await prisma.marketDay.create({
    data: {
      description: 'Weekly Market',
      status: 'scheduled',
      startTime: new Date('2024-04-08T09:00:00Z'),
      endTime: new Date('2024-04-08T13:00:00Z'),
      onlineStartTime: new Date('2024-04-07T18:00:00Z'),
      onlineEndTime: new Date('2024-04-08T12:00:00Z'),
      marketSchedule: { connect: { id: schedule.id } },
    },
  })

  await prisma.marketDay.create({
    data: {
      description: 'Spring Market Schedule non reoccurring',
      status: 'scheduled',
      startTime: new Date('2024-04-02T09:00:00Z'),
      endTime: new Date('2024-04-02T13:00:00Z'),
      onlineStartTime: new Date('2024-03-31T18:00:00Z'),
      onlineEndTime: new Date('2024-04-01T12:00:00Z'),
      marketSchedule: { connect: { id: schedule2.id } },
    },
  })

  // Add 3 mock products for vendor1Profile
  let vendor1ProductIds: number[] = []
  if (vendor1Profile) {
    // Fetch the created products to get their IDs
    const products = await prisma.product.findMany({
      where: { vendorProfileId: vendor1Profile.id },
      orderBy: { id: 'desc' },
      take: 3,
    })
    vendor1ProductIds = products.map((p) => p.id)
  }

  // Associate vendor1Profile with the first market schedule and its market days
  if (vendor1Profile && schedule && marketDay1 && marketDay2) {
    await prisma.vendorProfile.update({
      where: { id: vendor1Profile.id },
      data: {
        marketSchedules: {
          connect: [{ id: schedule.id }],
        },
        marketDays: {
          connect: [{ id: marketDay1.id }, { id: marketDay2.id }],
        },
      },
    })
  }

  // --- Seed Product Units ---
  const units = [
    { name: 'lb', pluralName: 'lbs', displayName: 'Pound', symbol: '$/lb' },
    { name: 'ea', pluralName: 'units', displayName: 'Each', symbol: '$/ea' },
    { name: 'bag', pluralName: 'bags', displayName: 'Bag', symbol: '$/bag' },
    {
      name: 'dozen',
      pluralName: 'dozen',
      displayName: 'Dozen',
      symbol: '$/dozen',
    },
  ]
  for (const unit of units) {
    await prisma.productUnit.upsert({
      where: { name: unit.name },
      update: {},
      create: unit,
    })
  }
  const allUnits = await prisma.productUnit.findMany()

  // --- Seed MarketDayProductGroups and MarketDayProducts ---
  // Get all products
  const allProducts = await prisma.product.findMany()

  // For each product, create a MarketDayProductGroup for each market day
  for (const marketDay of [marketDay1, marketDay2]) {
    for (const product of allProducts) {
      // Create the group
      const group = await prisma.marketDayProductGroup.create({
        data: {
          marketDayId: marketDay.id,
          productId: product.id,
        },
      })

      // For each unit, create a MarketDayProduct (with random price/quantity for demo)
      for (const unit of allUnits) {
        await prisma.marketDayProduct.create({
          data: {
            price: Math.floor(Math.random() * 10) + 2, // $2-$11
            quantity: Math.floor(Math.random() * 50) + 10, // 10-59
            size: Math.floor(Math.random() * 10) + 1, // 1-10
            packaged: Math.random() < 0.5, // 50% chance of being packaged
            productUnitId: unit.id,
            marketDayId: marketDay.id,
            groupId: group.id,
          },
        })
      }
    }
  }

  // Add 3 mock orders for vendor@example.com (one for each product)
  if (
    vendor1ProductIds.length === 3 &&
    customer &&
    typeof marketDay1 !== 'undefined'
  ) {
    for (let i = 0; i < 3; i++) {
      // Find a MarketDayProduct for this product and marketDay1 (pick the first unit)
      const mdp = await prisma.marketDayProduct.findFirst({
        where: {
          group: {
            marketDayId: marketDay1.id,
            productId: vendor1ProductIds[i],
          },
        },
      })
      if (!mdp) continue
      await prisma.order.create({
        data: {
          userId: customer!.id,
          status: i === 0 ? 'processing' : i === 1 ? 'processing' : 'processed',
          total: mdp.price,
          marketDayId: marketDay1!.id,
          orderItems: {
            create: [
              {
                marketDayProductId: mdp.id,
                productUnitId: mdp.productUnitId,
                quantity: 1,
                price: mdp.price,
                status: 'processing',
              },
            ],
          },
        },
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
