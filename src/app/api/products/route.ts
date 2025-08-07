import { NextRequest, NextResponse } from 'next/server'
import { withAuth, withRateLimit, withValidation } from '@/lib/api-handler'
import { getMarketDayProductsByFilters, createProduct } from '@/data/products'
import { findVendorByUserId } from '@/data/vendors'
import { createProductSchema, productsQuerySchema } from '@/lib/schemas/product'
import { ClientProduct, ClientProductVariation } from '@/types/product'
import { z } from 'zod'

export const GET = withRateLimit(
  async (
    req: NextRequest
  ): Promise<NextResponse<ClientProduct[] | { error: string }>> => {
    try {
      // Parse and validate query parameters
      const queryParams = Object.fromEntries(req.nextUrl.searchParams.entries())
      const validatedParams = productsQuerySchema.parse(queryParams)

      const priceRange: [number, number] | undefined =
        validatedParams.minPrice && validatedParams.maxPrice
          ? [validatedParams.minPrice, validatedParams.maxPrice]
          : undefined

      const filters = {
        categoryFilter: validatedParams.category?.length
          ? validatedParams.category
          : undefined,
        vendorFilter: validatedParams.vendor?.length
          ? validatedParams.vendor
          : undefined,
        priceRange,
      }

      const products = await getMarketDayProductsByFilters(
        validatedParams.marketDayId,
        filters
      )

      const clientProducts = products.map<ClientProduct>((product) => ({
        id: product.id,
        name: product.product.name,
        description: product.product.description,
        imageUrl: product.product.imageUrl,
        category: product.product.category,
        unit: product.variations[0].productVariation.unit,
        price: product.variations[0].price,
        organic: product.product.organic,
        local: product.product.local,
        vendor: product.product.vendorProfile,
        variations: product.variations.map<ClientProductVariation>(
          (variation) => ({
            id: variation.id,
            name: variation.productVariation.name,
            size: variation.productVariation.size,
            packaged: variation.productVariation.packaged,
            unit: variation.productVariation.unit,
            price: variation.price,
          })
        ),
      }))

      return NextResponse.json(clientProducts)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid query parameters', details: error.errors },
          { status: 400 }
        )
      }
      throw error
    }
  },
  { limit: 100, windowMs: 60 * 1000 }
)

export const POST = withRateLimit(
  withAuth(
    withValidation(
      createProductSchema,
      async (
        req,
        data,
        context
      ): Promise<NextResponse<ClientProduct | { error: string }>> => {
        const { session } = context

        if (!session) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get vendor profile for the authenticated user
        const vendorProfile = await findVendorByUserId(session.user.id)
        if (!vendorProfile) {
          return NextResponse.json(
            { error: 'Vendor profile not found' },
            { status: 404 }
          )
        }

        const product = await createProduct(vendorProfile.id, data)

        const clientProduct: ClientProduct = {
          id: product.id,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          category: product.category,
          unit: {
            id: 0,
            name: '',
            pluralName: '',
            displayName: '',
            symbol: '',
          },
          price: 0,
          organic: product.organic,
          local: product.local,
          vendor: {
            id: product.vendorProfile.id,
            businessName: product.vendorProfile.businessName,
          },
          variations: [],
        }
        return NextResponse.json(clientProduct)
      }
    )
  ),
  { limit: 20, windowMs: 60 * 1000 } // 20 requests per minute
)
