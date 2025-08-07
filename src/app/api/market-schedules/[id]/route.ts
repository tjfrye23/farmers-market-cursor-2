import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  updateMarketSchedule,
  deleteMarketSchedule,
} from '@/data/marketSchedules'
import {
  updateMarketScheduleSchema,
  marketScheduleIdSchema,
  UpdateMarketScheduleInput,
} from '@/lib/schemas/marketSchedule'
import { withValidation } from '@/lib/api-handler'
import { UserRole } from '@/generated/prisma/client'

export const PUT = withValidation(
  updateMarketScheduleSchema,
  async (request, data: UpdateMarketScheduleInput, { params }) => {
    try {
      const session = await getServerSession(authOptions)

      if (!session?.user || session.user.role !== UserRole.ADMIN) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin access required' },
          { status: 401 }
        )
      }

      const { id } = await params
      const scheduleIdResult = marketScheduleIdSchema.safeParse({ id })
      if (!scheduleIdResult.success) {
        return NextResponse.json(
          { error: 'Invalid schedule ID' },
          { status: 400 }
        )
      }

      const updatedSchedule = await updateMarketSchedule(
        scheduleIdResult.data.id,
        data
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
)

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Validate schedule ID
    const { id } = await params
    const scheduleIdResult = marketScheduleIdSchema.safeParse({ id })
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
