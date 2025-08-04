import { PrismaClient } from '../../src/generated/prisma/client'
import { hash } from 'bcryptjs'

export async function seedUsers(prisma: PrismaClient) {
  console.log('👥 Seeding users...')

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

  console.log('✅ Seeded users')
  return { vendor1Profile, vendor2Profile }
}
