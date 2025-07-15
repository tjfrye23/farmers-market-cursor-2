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

  const group = await db.marketDayProduct.findUnique({
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
          productVariation: true,
        },
        orderBy: { id: 'asc' },
      },
    },
  })

  if (!group) notFound()

  // Map variations to expected shape for ProductDetailClient
  const mappedGroup = {
    ...group,
    variations: group.variations.map((v) => ({
      id: v.id,
      price: v.price,
      quantity: v.quantity,
      isActive: v.isActive,
      size: v.productVariation.size,
      packaged: v.productVariation.packaged,
      productUnit: {
        id: v.productVariation.id, // No direct ProductUnit, so use variation id
        name: v.productVariation.unit,
        pluralName: v.productVariation.unit + 's', // Fallback
        displayName: v.productVariation.unit,
        symbol: v.productVariation.unit,
      },
    })),
  }

  return <ProductDetailClient group={mappedGroup} />
}
