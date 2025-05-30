/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '../src/generated/prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@farmersmarket.com' },
    update: {},
    create: {
      email: 'admin@farmersmarket.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
    },
  })

  // Create vendor users and their profiles
  const vendor1Password = await hash('vendor123', 12)
  const vendor1 = await prisma.user.upsert({
    where: { email: 'organic@farmersmarket.com' },
    update: {},
    create: {
      email: 'organic@farmersmarket.com',
      name: 'Organic Farm',
      password: vendor1Password,
      role: 'vendor',
      vendorProfile: {
        create: {
          businessName: 'Organic Farm Fresh',
          description: 'Locally grown organic produce',
          phone: '555-0101',
          address: '123 Farm Road, Countryside',
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
        },
      },
    },
  })

  // Create regular customer
  const customerPassword = await hash('customer123', 12)
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
          stock: 50,
          category: 'Vegetables',
          imageUrl: '/images/products/tomatoes.jpg',
          vendorProfileId: vendor1Profile.id,
        },
        {
          name: 'Organic Lettuce',
          description: 'Crisp organic lettuce',
          price: 2.99,
          stock: 30,
          category: 'Vegetables',
          imageUrl: '/images/products/lettuce.jpg',
          vendorProfileId: vendor1Profile.id,
        },
        {
          name: 'Organic Carrots',
          description: 'Sweet organic carrots',
          price: 1.99,
          stock: 40,
          category: 'Vegetables',
          imageUrl: '/images/products/carrots.jpg',
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
          stock: 20,
          category: 'Bakery',
          imageUrl: '/images/products/sourdough.jpg',
          vendorProfileId: vendor2Profile.id,
        },
        {
          name: 'Croissants',
          description: 'Buttery, flaky croissants',
          price: 2.99,
          stock: 30,
          category: 'Bakery',
          imageUrl: '/images/products/croissants.jpg',
          vendorProfileId: vendor2Profile.id,
        },
      ],
    })
  }

  // Create market days
  const marketDay1 = await prisma.marketDay.create({
    data: {
      date: new Date('2024-04-01T09:00:00Z'),
      location: 'Downtown Square',
      description: 'Spring Market Opening Day',
      status: 'scheduled',
    },
  })

  const marketDay2 = await prisma.marketDay.create({
    data: {
      date: new Date('2024-04-08T09:00:00Z'),
      location: 'Downtown Square',
      description: 'Weekly Market',
      status: 'scheduled',
    },
  })

  // Create a sample order
  const products = await prisma.product.findMany({
    take: 2,
  })

  if (products.length >= 2 && customer) {
    await prisma.order.create({
      data: {
        userId: customer.id,
        status: 'pending',
        total: products[0].price + products[1].price,
        marketDayId: marketDay1.id,
        orderItems: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
              price: products[0].price,
            },
            {
              productId: products[1].id,
              quantity: 1,
              price: products[1].price,
            },
          ],
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
