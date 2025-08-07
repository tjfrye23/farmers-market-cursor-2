'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createProduct } from '@/data/products'
import { findVendorByUserId } from '@/data/vendors'
import { createProductSchema } from '@/lib/schemas/product'
import { ActionState } from '@/types/actions'

export async function addProducts(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return {
        message: 'Unauthorized',
        success: false,
      }
    }

    // Get vendor profile for the authenticated user
    const vendorProfile = await findVendorByUserId(session.user.id)
    if (!vendorProfile) {
      return {
        message: 'Vendor profile not found',
        success: false,
      }
    }

    const productsData = JSON.parse(
      (formData.get('products') as string) || '[]'
    )

    if (!Array.isArray(productsData) || productsData.length === 0) {
      return {
        message: 'No products to create',
        success: false,
      }
    }

    const createdProducts = []

    for (const productData of productsData) {
      const parsedProductData = createProductSchema.parse(productData)
      const product = await createProduct(vendorProfile.id, parsedProductData)
      createdProducts.push(product)
    }

    revalidatePath('/vendor/products')
    revalidatePath('/vendor/dashboard')

    return {
      success: true,
      count: createdProducts.length,
    }
  } catch (error) {
    console.error('Add products error:', error)
    return {
      message:
        error instanceof Error ? error.message : 'Failed to create products',
      success: false,
      errors: {
        products: ['Failed to create products'],
      },
    }
  }
}
