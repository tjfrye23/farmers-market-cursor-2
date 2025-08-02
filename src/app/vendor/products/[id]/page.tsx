import { notFound } from 'next/navigation'
import { getProductById } from '@/data/products'
import ProductDetailClient from '@/app/products/[id]/ProductDetailClient'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function VendorProductDetailPage(props: Props) {
  const { id } = await props.params
  const productId = parseInt(id)

  if (isNaN(productId)) notFound()

  const product = await getProductById(productId)

  if (!product) notFound()

  return <ProductDetailClient product={product} pageType="vendor" />
}
