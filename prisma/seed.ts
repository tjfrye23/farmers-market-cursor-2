import { PrismaClient } from '../src/generated/prisma/client'
import { seedProductUnits } from './seeders/productUnits'
import { seedUsers } from './seeders/users'
import { seedMarketSchedules } from './seeders/marketSchedules'
import { seedSubscriptions } from './seeders/subscriptions'
import { seedProducts } from './seeders/products'
import { seedOrders } from './seeders/orders'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Seed product units
  const productUnitMap = await seedProductUnits(prisma)

  // Seed users and get vendor profiles
  const { vendor1Profile, vendor2Profile } = await seedUsers(prisma)

  // Seed market schedules and get the first market day
  const { schedules, marketDays } = await seedMarketSchedules(prisma)
  const marketDay = marketDays[0]

  // Seed vendor subscriptions
  await seedSubscriptions(prisma, schedules, vendor1Profile, vendor2Profile)

  // Seed products
  await seedProducts(
    prisma,
    vendor1Profile,
    vendor2Profile,
    marketDay,
    productUnitMap
  )

  // Seed orders
  await seedOrders(prisma, vendor1Profile, marketDay, productUnitMap)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
