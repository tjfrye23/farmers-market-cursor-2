import { notFound } from 'next/navigation'
import { getProductById } from '@/data/products'
import EditProductClient from './EditProductClient'
import { getProductFormData } from '@/data/product-data'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage(props: Props) {
  const { id } = await props.params
  const productId = parseInt(id)

  if (isNaN(productId)) notFound()

  const product = await getProductById(productId)
  const formData = await getProductFormData()
  if (!product) notFound()

  return <EditProductClient product={product} formData={formData} />
}
