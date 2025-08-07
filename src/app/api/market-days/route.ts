import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { ClientMarketDay } from '@/types/marketDay'
import { Prisma } from '@/generated/prisma/client'
import { marketDaysQuerySchema } from '@/lib/schemas/marketDay'

export async function GET(
  req: NextRequest
): Promise<NextResponse<ClientMarketDay[] | { error: string }>> {
  try {
    // Parse and validate query parameters with Zod
    const queryParams = Object.fromEntries(req.nextUrl.searchParams.entries())
    const validatedParams = marketDaysQuerySchema.parse(queryParams)

    const where: Prisma.MarketDayWhereInput = {
      ...(validatedParams.startDate && {
        startTime: { gte: new Date(validatedParams.startDate) },
      }),
      ...(validatedParams.endDate && {
        endTime: { lte: new Date(validatedParams.endDate) },
      }),
      ...(validatedParams.status && { status: validatedParams.status }),
      ...(validatedParams.organizerId && {
        organizerId: validatedParams.organizerId,
      }),
    }

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
    if (validatedParams.active) {
      const now = new Date()
      filteredMarketDays = marketDays.filter((day) => {
        if (day.status !== 'PUBLISHED') return false
        const onlineStart = new Date(day.onlineStartTime)
        const onlineEnd = new Date(day.onlineEndTime)
        return now >= onlineStart && now <= onlineEnd
      })
    }

    const clientMarketDays: ClientMarketDay[] = filteredMarketDays.map(
      (day) => ({
        id: day.id,
        startTime: day.startTime.toISOString(),
        endTime: day.endTime.toISOString(),
        onlineStartTime: day.onlineStartTime.toISOString(),
        onlineEndTime: day.onlineEndTime.toISOString(),
        name: day.marketSchedule.name,
        location: day.marketSchedule.location,
        description: day.marketSchedule.description,
        status: day.status,
        marketSchedule: {
          id: day.marketSchedule.id,
        },
      })
    )

    return NextResponse.json(clientMarketDays)
  } catch (error) {
    console.error('Failed to fetch market days:', error)

    // Handle Zod validation errors
    if (error instanceof Error && error.message.includes('Invalid')) {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch market days' },
      { status: 500 }
    )
  }
}
