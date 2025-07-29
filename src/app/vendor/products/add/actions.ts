'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/prisma'
import { createProductSchema } from '@/types/product'
import { ActionState } from '@/types/actions'

export async function createProducts(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return {
      message: 'Unauthorized',
      success: false,
    }
  }

  // Get the vendor profile for the current user
  const vendorProfile = await db.vendorProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!vendorProfile) {
    return {
      message: 'Vendor profile not found',
      success: false,
    }
  }

  // Parse the products data
  const productsData = JSON.parse((formData.get('products') as string) || '[]')

  if (productsData.length === 0) {
    return {
      message: 'No products to create',
      success: false,
    }
  }

  try {
    const createdProducts = []

    for (const rawData of productsData) {
      const validatedData = createProductSchema.parse(rawData)

      // Create the product with variations
      const product = await db.product.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          category: validatedData.category,
          imageUrl: validatedData.imageUrl,
          organic: validatedData.organic,
          local: validatedData.local,
          vendorProfileId: vendorProfile.id,
          variations: {
            create: validatedData.variations.map((variation) => ({
              name: variation.name,
              price: variation.price,
              size: variation.size,
              packaged: variation.packaged,
              productUnitId: variation.unitId,
            })),
          },
        },
        include: {
          vendorProfile: true,
        },
      })

      createdProducts.push(product)
    }

    // Revalidate the vendor dashboard and products pages
    revalidatePath('/vendor/dashboard')
    revalidatePath('/vendor/products')

    return {
      success: true,
      count: createdProducts.length,
    }
  } catch (error) {
    console.error('Error creating products:', error)
    return {
      message:
        error instanceof Error ? error.message : 'Failed to create products',
      success: false,
    }
  }
}
