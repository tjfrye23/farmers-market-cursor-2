import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import { getMarketDayProductById } from '@/data/products'

interface Props {
  params: {
    id: string
  }
}

export default async function ProductDetailPage(props: Promise<Props>) {
  const { params } = await props
  const productId = parseInt(params.id)

  if (isNaN(productId)) notFound()

  const product = await getMarketDayProductById(productId)

  if (!product) notFound()

  return <ProductDetailClient product={product} />
}
