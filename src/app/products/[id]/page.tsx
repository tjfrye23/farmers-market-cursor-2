import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import { getMarketDayProductById } from '@/data/products'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const productId = parseInt(id)

  if (isNaN(productId)) notFound()

  const product = await getMarketDayProductById(productId)

  if (!product) notFound()

  return <ProductDetailClient product={product} />
}
