import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  subscribeVendorToSchedule,
  unsubscribeVendorFromSchedule,
  marketScheduleIdSchema,
} from '@/data/marketSchedules'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.vendorProfile) {
      return NextResponse.json(
        { error: 'Unauthorized - Vendor access required' },
        { status: 401 }
      )
    }

    // Validate schedule ID
    const scheduleIdResult = marketScheduleIdSchema.safeParse(params.id)
    if (!scheduleIdResult.success) {
      return NextResponse.json(
        { error: 'Invalid schedule ID' },
        { status: 400 }
      )
    }

    const vendorProfileId = session.user.vendorProfile.id

    await subscribeVendorToSchedule(scheduleIdResult.data, vendorProfileId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error subscribing to market schedule:', error)
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to subscribe to market schedule'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.vendorProfile) {
      return NextResponse.json(
        { error: 'Unauthorized - Vendor access required' },
        { status: 401 }
      )
    }

    // Validate schedule ID
    const scheduleIdResult = marketScheduleIdSchema.safeParse(params.id)
    if (!scheduleIdResult.success) {
      return NextResponse.json(
        { error: 'Invalid schedule ID' },
        { status: 400 }
      )
    }

    const vendorProfileId = session.user.vendorProfile.id

    await unsubscribeVendorFromSchedule(scheduleIdResult.data, vendorProfileId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unsubscribing from market schedule:', error)
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to unsubscribe from market schedule'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
