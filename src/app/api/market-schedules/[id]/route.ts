import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  updateMarketSchedule,
  deleteMarketSchedule,
} from '@/data/marketSchedules'
import z from 'zod'
import { MarketSchedule, MarketScheduleStatus } from '@/types/marketSchedule'

export const updateMarketScheduleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  startTime: z.string().datetime('Start time must be a valid date'),
  endTime: z.string().datetime('End time must be a valid date'),
  onlineStartTime: z
    .string()
    .datetime('Online start time must be a valid date'),
  onlineEndTime: z.string().datetime('Online end time must be a valid date'),
  status: z.nativeEnum(MarketScheduleStatus, {
    errorMap: () => ({
      message: `Status must be one of: ${Object.values(MarketScheduleStatus).join(', ')}`,
    }),
  }),
  reoccurring: z.boolean(),
})

export const marketScheduleIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'Schedule ID must be a number')
    .transform(Number),
})

export type UpdateMarketScheduleInput = z.infer<
  typeof updateMarketScheduleSchema
>

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<MarketSchedule | { error: string }>> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const scheduleIdResult = marketScheduleIdSchema.safeParse(params)
    if (!scheduleIdResult.success) {
      return NextResponse.json(
        { error: 'Invalid schedule ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const validationResult = updateMarketScheduleSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const updatedSchedule = await updateMarketSchedule(
      scheduleIdResult.data.id,
      validationResult.data
    )

    return NextResponse.json(updatedSchedule)
  } catch (error) {
    console.error('Error updating market schedule:', error)
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to update market schedule'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Validate schedule ID
    const scheduleIdResult = marketScheduleIdSchema.safeParse(params)
    if (!scheduleIdResult.success) {
      return NextResponse.json(
        { error: 'Invalid schedule ID' },
        { status: 400 }
      )
    }

    await deleteMarketSchedule(scheduleIdResult.data.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting market schedule:', error)
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to delete market schedule'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
