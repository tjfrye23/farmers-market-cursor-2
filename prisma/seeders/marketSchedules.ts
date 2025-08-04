import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedMarketSchedules(prisma: PrismaClient) {
  console.log('📅 Seeding market schedules...')

  // Create market schedules
  const schedule1 = await prisma.marketSchedule.upsert({
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
      status: 'ACTIVE',
      description: 'Main market schedule',
    },
  })

  const schedule2 = await prisma.marketSchedule.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Downtown Farmers Market',
      location: 'Downtown Plaza',
      reoccurring: true,
      startTime: new Date('2024-06-02T09:00:00Z'),
      endTime: new Date('2024-06-02T15:00:00Z'),
      onlineStartTime: new Date('2024-06-01T09:00:00Z'),
      onlineEndTime: new Date('2024-06-02T08:59:59Z'),
      status: 'ACTIVE',
      description: 'Downtown farmers market every Sunday',
    },
  })

  const schedule3 = await prisma.marketSchedule.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Riverside Artisan Market',
      location: 'Riverside Walk',
      reoccurring: true,
      startTime: new Date('2024-06-03T10:00:00Z'),
      endTime: new Date('2024-06-03T16:00:00Z'),
      onlineStartTime: new Date('2024-06-02T10:00:00Z'),
      onlineEndTime: new Date('2024-06-03T09:59:59Z'),
      status: 'ACTIVE',
      description: 'Artisan and craft market every Monday',
    },
  })

  // Create market days for each schedule
  const marketDays = []

  // Schedule 1: 3 market days
  for (let i = 0; i < 3; i++) {
    const marketDay = await prisma.marketDay.create({
      data: {
        description: `Saturday Market ${i + 1}`,
        startTime: new Date(
          new Date().setDate(new Date().getDate() + 2 + i * 7)
        ),
        endTime: new Date(new Date().setDate(new Date().getDate() + 3 + i * 7)),
        onlineStartTime: new Date(
          new Date().setDate(new Date().getDate() - 1 + i * 7)
        ),
        onlineEndTime: new Date(
          new Date().setDate(new Date().getDate() + 1 + i * 7)
        ),
        status: 'PUBLISHED',
        marketScheduleId: schedule1.id,
      },
    })
    marketDays.push(marketDay)
  }

  // Schedule 2: 5 market days
  for (let i = 0; i < 5; i++) {
    const marketDay = await prisma.marketDay.create({
      data: {
        description: `Sunday Market ${i + 1}`,
        startTime: new Date(
          new Date().setDate(new Date().getDate() + 3 + i * 7)
        ),
        endTime: new Date(new Date().setDate(new Date().getDate() + 4 + i * 7)),
        onlineStartTime: new Date(
          new Date().setDate(new Date().getDate() + 2 + i * 7)
        ),
        onlineEndTime: new Date(
          new Date().setDate(new Date().getDate() + 3 + i * 7)
        ),
        status: 'PUBLISHED',
        marketScheduleId: schedule2.id,
      },
    })
    marketDays.push(marketDay)
  }

  // Schedule 3: 2 market days
  for (let i = 0; i < 2; i++) {
    const marketDay = await prisma.marketDay.create({
      data: {
        description: `Monday Market ${i + 1}`,
        startTime: new Date(
          new Date().setDate(new Date().getDate() + 4 + i * 7)
        ),
        endTime: new Date(new Date().setDate(new Date().getDate() + 5 + i * 7)),
        onlineStartTime: new Date(
          new Date().setDate(new Date().getDate() + 3 + i * 7)
        ),
        onlineEndTime: new Date(
          new Date().setDate(new Date().getDate() + 4 + i * 7)
        ),
        status: 'PUBLISHED',
        marketScheduleId: schedule3.id,
      },
    })
    marketDays.push(marketDay)
  }

  console.log(`✅ Seeded ${marketDays.length} market days across 3 schedules`)
  return { schedules: [schedule1, schedule2, schedule3], marketDays }
}
