import { getProductFormData } from '@/data/product-data'
import AddProductsClient from './AddProductsClient'

export default async function AddProductsPage() {
  const formData = await getProductFormData()

  return <AddProductsClient formData={formData} />
}
