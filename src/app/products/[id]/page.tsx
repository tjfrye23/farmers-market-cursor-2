import { notFound } from 'next/navigation'
import { db } from '@/lib/prisma'
import ProductDetailClient from './ProductDetailClient'

interface Props {
  params: {
    id: string
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const groupId = parseInt(params.id)
  if (isNaN(groupId)) notFound()

  const group = await db.marketDayProductGroup.findUnique({
    where: { id: groupId },
    include: {
      product: {
        include: {
          vendorProfile: true,
        },
      },
      marketDay: {
        include: {
          marketSchedule: true,
        },
      },
      variations: {
        include: {
          productUnit: true,
        },
        orderBy: { id: 'asc' },
      },
    },
  })

  if (!group) notFound()

  return <ProductDetailClient group={group} />
}
