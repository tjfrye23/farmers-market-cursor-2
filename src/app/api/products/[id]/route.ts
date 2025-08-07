import { NextResponse } from 'next/server'
import { withAuth, withRateLimit, withValidation } from '@/lib/api-handler'
import { getProductById, updateProduct, deleteProduct } from '@/data/products'
import { findVendorByUserId } from '@/data/vendors'
import { UpdateProductInput, updateProductSchema } from '@/lib/schemas/product'
import { ClientProduct } from '@/types/product'

export const GET = withRateLimit(
  async (req, context) => {
    const params = await context.params
    const id = parseInt(params.id, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const product = await getProductById(id)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  },
  { limit: 100, windowMs: 60 * 1000 }
)

export const PUT = withRateLimit(
  withAuth(
    withValidation(
      updateProductSchema,
      async (
        req,
        data: UpdateProductInput,
        context
      ): Promise<NextResponse<ClientProduct | { error: string }>> => {
        const { session } = context

        if (!session) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const params = await context.params
        const id = parseInt(params.id, 10)
        if (isNaN(id)) {
          return NextResponse.json(
            { error: 'Invalid product ID' },
            { status: 400 }
          )
        }

        // Get vendor profile for the authenticated user
        const vendorProfile = await findVendorByUserId(session.user.id)
        if (!vendorProfile) {
          return NextResponse.json(
            { error: 'Vendor profile not found' },
            { status: 404 }
          )
        }

        const product = await updateProduct(id, data)

        const clientProduct: ClientProduct = {
          id: product.id,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          category: product.category,
          unit: product.variations[0].unit,
          price: product.variations[0].price,
          vendor: product.vendorProfile,
          organic: product.organic,
          local: product.local,
          variations: product.variations,
        }
        return NextResponse.json(clientProduct)
      }
    )
  ),
  { limit: 20, windowMs: 60 * 1000 }
)

export const DELETE = withRateLimit(
  withAuth(async (req, context) => {
    const params = await context.params
    const id = parseInt(params.id, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    await deleteProduct(id)
    return NextResponse.json({ success: true })
  }),
  { limit: 20, windowMs: 60 * 1000 }
)
