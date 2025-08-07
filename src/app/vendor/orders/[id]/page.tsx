import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getVendorOrderById, getNextVendorOrder } from '@/data/orders'
import VendorOrderDetailClient from './VendorOrderDetailClient'
import { UserRole } from '@/generated/prisma/client'

interface VendorOrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function VendorOrderDetailPage({
  params,
}: VendorOrderDetailPageProps) {
  const session = await getServerSession(authOptions)

  if (
    !session?.user ||
    session.user.role !== UserRole.VENDOR ||
    !session.user.vendorProfile?.id
  ) {
    notFound()
  }

  const { id } = await params
  const orderId = parseInt(id, 10)

  if (isNaN(orderId)) {
    notFound()
  }

  const [order, nextOrder] = await Promise.all([
    getVendorOrderById(orderId, session.user.vendorProfile.id),
    getNextVendorOrder(orderId, session.user.vendorProfile.id),
  ])

  if (!order) {
    notFound()
  }

  return (
    <VendorOrderDetailClient
      order={order}
      hasNextOrder={!!nextOrder}
      nextOrderId={nextOrder?.id}
      user={session.user}
    />
  )
}
