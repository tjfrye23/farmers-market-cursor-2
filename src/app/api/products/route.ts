import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAuth, withValidation, withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ClientProduct, isCategory } from '@/types/product'
import { ProductCategory } from '@/generated/prisma/client'

// Validation schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.nativeEnum(ProductCategory),
  imageUrl: z.string().url('Please provide a valid image URL'),
  organic: z.boolean().default(false),
  local: z.boolean().default(false),
  variations: z.array(
    z.object({
      name: z.string().min(1, 'Variation name is required'),
      price: z.number().min(0, 'Price must be non-negative'),
      size: z.number().min(1, 'Size must be at least 1'),
      packaged: z.boolean().default(false),
      unitId: z.number().min(1, 'Unit is required'),
    })
  ),
})

export const updateProductSchema = createProductSchema.partial()

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>

export async function GET(
  request: NextRequest
): Promise<NextResponse<{ products: ClientProduct[] } | { error: string }>> {
  try {
    const searchParams = request.nextUrl.searchParams
    const marketDayId = searchParams.get('marketDayId')
    const categoryFilter = searchParams.getAll('category')
    const vendorFilter = searchParams.getAll('vendorId')

    if (!marketDayId) {
      return NextResponse.json(
        { error: 'Market day ID is required' },
        { status: 400 }
      )
    }

    // Convert category filter strings to ProductCategory enum values
    const categoryFilterEnums = categoryFilter
      .map((cat) => cat.toUpperCase())
      .filter(isCategory)

    if (categoryFilterEnums.length !== categoryFilter.length) {
      return NextResponse.json(
        { error: 'Invalid category filter' },
        { status: 400 }
      )
    }

    // Fetch all market day products for the market day, including product and vendor info
    const products = await db.marketDayProduct.findMany({
      where: {
        marketDayId: parseInt(marketDayId),
        isActive: true,
        ...(categoryFilterEnums.length > 0 && {
          product: {
            category: {
              in: categoryFilterEnums,
            },
          },
        }),
        ...(vendorFilter.length > 0 && {
          product: {
            vendorProfile: {
              id: {
                in: vendorFilter.map(Number),
              },
            },
          },
        }),
      },
      include: {
        product: {
          include: {
            vendorProfile: {
              select: {
                id: true,
                businessName: true,
              },
            },
          },
        },
        variations: {
          include: {
            productVariation: {
              include: {
                unit: true,
              },
            },
          },
        },
      },
    })

    const result = products.map((product): ClientProduct => {
      const primary = product.variations[0]

      return {
        id: product.product.id,
        name: product.product.name,
        description: product.product.description,
        price: primary.price,
        imageUrl: product.product.imageUrl,
        category: product.product.category,
        vendor: {
          id: product.product.vendorProfile.id,
          businessName: product.product.vendorProfile.businessName,
        },
        unit: primary.productVariation.unit,
        organic: product.product.organic,
        local: product.product.local,
        variations: product.variations.map(
          (v): ClientProduct['variations'][number] => ({
            id: v.id,
            name: v.productVariation.name,
            size: v.productVariation.size,
            packaged: v.productVariation.packaged,
            unit: v.productVariation.unit,
            price: v.price,
          })
        ),
      }
    })

    return NextResponse.json({
      products: result,
    })
  } catch (error) {
    console.error('Error fetching market day products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market day products' },
      { status: 500 }
    )
  }
}

export const POST = withRateLimit(
  withAuth(
    withValidation(
      createProductSchema,
      async (
        req,
        data: CreateProductInput
      ): Promise<NextResponse<ClientProduct | { error: string }>> => {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
          return new NextResponse('Unauthorized', { status: 401 })
        }

        // Get the vendor profile for the current user
        const vendorProfile = await db.vendorProfile.findUnique({
          where: { userId: session.user.id },
        })

        if (!vendorProfile) {
          return new NextResponse('Vendor profile not found', { status: 404 })
        }

        const product = await db.product.create({
          data: {
            name: data.name,
            description: data.description,
            category: data.category,
            imageUrl: data.imageUrl,
            organic: data.organic,
            local: data.local,
            vendorProfileId: vendorProfile.id,
          },
          include: {
            vendorProfile: true,
          },
        })

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
