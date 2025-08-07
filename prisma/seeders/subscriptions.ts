/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedSubscriptions(
  prisma: PrismaClient,
  schedules: any[],
  vendor1Profile: any,
  vendor2Profile: any
) {
  console.log('🔗 Seeding vendor subscriptions...')

  // Add vendor subscriptions to market schedules
  if (vendor1Profile) {
    // Vendor 1 subscribes to schedule 1 and 2
    await prisma.marketSchedule.update({
      where: { id: schedules[0].id },
      data: {
        subscriptions: {
          connect: { id: vendor1Profile.id },
        },
      },
    })
    await prisma.marketSchedule.update({
      where: { id: schedules[1].id },
      data: {
        subscriptions: {
          connect: { id: vendor1Profile.id },
        },
      },
    })
  }

  if (vendor2Profile) {
    // Vendor 2 subscribes to schedule 2 and 3
    await prisma.marketSchedule.update({
      where: { id: schedules[1].id },
      data: {
        subscriptions: {
          connect: { id: vendor2Profile.id },
        },
      },
    })
    await prisma.marketSchedule.update({
      where: { id: schedules[2].id },
      data: {
        subscriptions: {
          connect: { id: vendor2Profile.id },
        },
      },
    })
  }

  // Add random subscriptions for other vendors
  for (let i = 3; i <= 17; i++) {
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: {
        userId: (
          await prisma.user.findUnique({
            where: { email: `vendor${i}@farmersmarket.com` },
          })
        )?.id,
      },
    })

    if (vendorProfile) {
      // Randomly subscribe to 1-3 schedules
      const schedulesToSubscribe = schedules
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1)

      for (const schedule of schedulesToSubscribe) {
        await prisma.marketSchedule.update({
          where: { id: schedule.id },
          data: {
            subscriptions: {
              connect: { id: vendorProfile.id },
            },
          },
        })
      }
    }
  }

  console.log('✅ Seeded vendor subscriptions')
}
