import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { ClientMarketDay, MarketDayStatus } from '@/types/marketDay'

export async function GET(
  req: NextRequest
): Promise<NextResponse<ClientMarketDay[] | { error: string }>> {
  const searchParams = req.nextUrl.searchParams
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const status = searchParams.get('status')
  const organizerId = searchParams.get('organizerId')
  const active = searchParams.get('active') === 'true'

  const where = {
    ...(startDate && { startTime: { gte: new Date(startDate) } }),
    ...(endDate && { endTime: { lte: new Date(endDate) } }),
    ...(status && { status: status as MarketDayStatus }),
    ...(organizerId && { organizerId: parseInt(organizerId, 10) }),
  }

  try {
    const marketDays = await db.marketDay.findMany({
      where,
      include: {
        vendors: {
          select: {
            id: true,
            businessName: true,
          },
        },
        marketSchedule: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    let filteredMarketDays = marketDays
    if (active) {
      const now = new Date()
      filteredMarketDays = marketDays.filter((day) => {
        if (day.status !== 'PUBLISHED') return false
        const onlineStart = new Date(day.onlineStartTime)
        const onlineEnd = new Date(day.onlineEndTime)
        return now >= onlineStart && now <= onlineEnd
      })
    }

    const clientMarketDays = filteredMarketDays.map<ClientMarketDay>((day) => ({
      id: day.id,
      startTime: day.startTime.toISOString(),
      endTime: day.endTime.toISOString(),
      onlineStartTime: day.onlineStartTime.toISOString(),
      onlineEndTime: day.onlineEndTime.toISOString(),
      name: day.marketSchedule.name,
      location: day.marketSchedule.location,
      description: day.marketSchedule.description,
      status: day.status as MarketDayStatus,
      marketSchedule: {
        id: day.marketSchedule.id,
      },
    }))

    return NextResponse.json(clientMarketDays)
  } catch (error) {
    console.error('Failed to fetch market days:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market days' },
      { status: 500 }
    )
  }
}
