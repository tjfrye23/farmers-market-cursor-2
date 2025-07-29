import { ProductCategory } from '@/generated/prisma/client'
import { db } from '@/lib/prisma'

export interface ProductFormData {
  categories: string[]
  units: Array<{
    id: number
    name: string
    pluralName: string
    displayName: string
    symbol: string
  }>
}

export async function getProductFormData(): Promise<ProductFormData> {
  // Use the ProductCategory enum values
  const categories = Object.values(ProductCategory)

  // Get all product units
  const units = await db.productUnit.findMany({
    orderBy: {
      displayName: 'asc',
    },
  })

  return {
    categories,
    units,
  }
}
