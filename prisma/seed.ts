/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '../src/generated/prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('test', 12)
  const admin = await prisma.user.upsert({
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
          price: 3.99,
          category: 'Vegetables',
          imageUrl: '/images/products/tomatoes.webp',
          vendorProfileId: vendor1Profile.id,
        },
        {
          name: 'Organic Lettuce',
          description: 'Crisp organic lettuce',
          price: 2.99,
          category: 'Vegetables',
          imageUrl: '/images/products/lettuce.webp',
          vendorProfileId: vendor1Profile.id,
        },
        {
          name: 'Organic Carrots',
          description: 'Sweet organic carrots',
          price: 1.99,
          category: 'Vegetables',
          imageUrl: '/images/products/carrots.webp',
          vendorProfileId: vendor1Profile.id,
        },
        {
          name: 'Organic Zucchini',
          description: 'Fresh organic zucchini',
          price: 2.49,
          category: 'Vegetables',
          imageUrl: '/images/products/zucchini.webp',
          vendorProfileId: vendor1Profile.id,
        },
        {
          name: 'Organic Peppers',
          description: 'Colorful organic bell peppers',
          price: 4.99,
          category: 'Vegetables',
          imageUrl: '/images/products/peppers.webp',
          vendorProfileId: vendor1Profile.id,
        },
        {
          name: 'Organic Cucumbers',
          description: 'Crisp organic cucumbers',
          price: 1.79,
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
          price: 5.99,
          category: 'Bakery',
          imageUrl: '/images/products/sourdough.webp',
          vendorProfileId: vendor2Profile.id,
        },
        {
          name: 'Croissants',
          description: 'Buttery, flaky croissants',
          price: 2.99,
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
      date: new Date('2024-04-01T09:00:00Z'),
      location: 'Downtown Square',
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
      date: new Date('2024-04-08T09:00:00Z'),
      location: 'Downtown Square',
      description: 'Weekly Market',
      status: 'scheduled',
      startTime: new Date('2024-04-08T09:00:00Z'),
      endTime: new Date('2024-04-08T13:00:00Z'),
      onlineStartTime: new Date('2024-04-07T18:00:00Z'),
      onlineEndTime: new Date('2024-04-08T12:00:00Z'),
      marketSchedule: { connect: { id: schedule.id } },
    },
  })

  const marketDay3 = await prisma.marketDay.create({
    data: {
      date: new Date('2024-04-08T09:00:00Z'),
      location: 'Downtown Square non reoccurring',
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

  // Add 3 mock orders for vendor@example.com (one for each product)
  if (
    vendor1ProductIds.length === 3 &&
    customer &&
    typeof marketDay1 !== 'undefined'
  ) {
    for (let i = 0; i < 3; i++) {
      const createdOrder = await prisma.order.create({
        data: {
          userId: customer!.id,
          status: i === 0 ? 'processing' : i === 1 ? 'processing' : 'processed',
          total:
            1 *
            (await prisma.product.findUnique({
              where: { id: vendor1ProductIds[i] },
            }))!.price,
          marketDayId: marketDay1!.id,
          orderItems: {
            create: [
              {
                productId: vendor1ProductIds[i],
                quantity: 1,
                price: (await prisma.product.findUnique({
                  where: { id: vendor1ProductIds[i] },
                }))!.price,
                status: 'processing',
              },
            ],
          },
        },
        include: {
          orderItems: { include: { product: true } },
        },
      })
    }
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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
