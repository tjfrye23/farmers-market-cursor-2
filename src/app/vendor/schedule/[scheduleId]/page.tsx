import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  getMarketScheduleById,
  isVendorSubscribedToSchedule,
} from '@/data/marketSchedules'
import MarketScheduleDetailClient from './MarketScheduleDetailClient'

interface MarketScheduleDetailPageProps {
  params: Promise<{
    scheduleId: string
  }>
}

export default async function MarketScheduleDetailPage({
  params,
}: MarketScheduleDetailPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    notFound()
  }

  const { scheduleId } = await params
  const [schedule, isSubscribed] = await Promise.all([
    getMarketScheduleById(parseInt(scheduleId)),
    session.user.vendorProfile
      ? isVendorSubscribedToSchedule(
          parseInt(scheduleId),
          session.user.vendorProfile.id
        )
      : false,
  ])

  if (!schedule) {
    notFound()
  }

  return (
    <MarketScheduleDetailClient
      schedule={schedule}
      user={session.user}
      isSubscribed={isSubscribed}
    />
  )
}
