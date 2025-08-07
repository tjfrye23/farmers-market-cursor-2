import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getMarketDayById } from '@/data/marketDays'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import MarketDayDetailClient from './MarketDayDetailClient'
import { Metadata } from 'next'
import { getMarketDayProducts } from '@/data/products'
import { UserRole } from '@/generated/prisma/client'

interface MarketDayDetailPageProps {
  params: Promise<{
    dayId: string
  }>
}

export async function generateMetadata({
  params,
}: MarketDayDetailPageProps): Promise<Metadata> {
  const { dayId } = await params
  const marketDay = await getMarketDayById(dayId)

  if (!marketDay) {
    return {
      title: 'Market Day Not Found',
      description: 'The market day you are looking for does not exist.',
    }
  }

  return {
    title: `${marketDay.name} - Market Day Details`,
    description: `View details for ${marketDay.name} market day on ${new Date(marketDay.startTime).toLocaleDateString()}. Location: ${marketDay.location}`,
  }
}

export default async function MarketDayDetailPage({
  params,
}: MarketDayDetailPageProps) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== UserRole.VENDOR) {
    redirect('/auth/login')
  }

  const { dayId } = await params
  const marketDay = await getMarketDayById(dayId)
  const marketDayProducts = await getMarketDayProducts(parseInt(dayId, 10))

  if (!marketDay) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-grow items-center justify-center">
          <div className="text-left">
            <h1 className="mb-2 text-left text-2xl font-bold text-gray-900">
              Market Day Not Found
            </h1>
            <p className="mb-4 text-left text-gray-600">
              The market day you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button asChild>
              <a href="/vendor/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <MarketDayDetailClient
      marketDay={marketDay}
      marketDayProducts={marketDayProducts}
    />
  )
}
