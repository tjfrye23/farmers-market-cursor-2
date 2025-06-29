import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAuth, withValidation, withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UIProduct } from '@/types/product'

// Validation schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string(),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  stock: z.number().int().min(0, 'Stock must be greater than or equal to 0'),
  category: z.string(),
  imageUrl: z.string().url(),
})

export const updateProductSchema = createProductSchema.partial()

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>

export async function GET(request: NextRequest) {
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

    // Fetch all product groups for the market day, including product and vendor info
    const groups = await db.marketDayProductGroup.findMany({
      where: {
        marketDayId: parseInt(marketDayId),
        isActive: true,
        ...(categoryFilter.length > 0 && {
          product: {
            category: {
              in: categoryFilter,
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
          include: { productUnit: true },
        },
      },
    })

    const products = groups.map<UIProduct>((group) => {
      const primary =
        group.variations.find((u) => u.id === group.primaryOptionId) ||
        group.variations[0]

      return {
        id: group.product.id,
        name: group.product.name,
        description: group.product.description,
        price: primary.price,
        imageUrl: group.product.imageUrl,
        category: group.product.category,
        vendorId: group.product.vendorProfile.id,
        vendorName: group.product.vendorProfile.businessName,
        unit: primary.productUnit.displayName,
        organic: group.product.organic,
        local: group.product.local,
        variations: group.variations.map((u) => ({
          id: u.id,
          name: u.productUnit.name,
          symbol: u.productUnit.symbol,
          price: u.price,
        })),
      }
    })

    return NextResponse.json({
      products,
    })
  } catch (error) {
    console.error('Error fetching market day products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market day products' },
      { status: 500 }
    )
  }
}
/**
 * @api {post} /api/products Create Product
 * @apiName CreateProduct
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Create a new product. Requires authentication.
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiBody {String} name Product name
 * @apiBody {String} [description] Product description
 * @apiBody {Number} price Product price (must be positive)
 * @apiBody {Number} stock Available stock (must be non-negative)
 * @apiBody {String} [category] Product category
 * @apiBody {String} [imageUrl] Product image URL
 * @apiBody {Number} vendorProfileId ID of the vendor profile
 *
 * @apiSuccess (201) {Object} product Created product
 * @apiSuccess {Number} product.id Product ID
 * @apiSuccess {String} product.name Product name
 * @apiSuccess {String} [product.description] Product description
 * @apiSuccess {Number} product.price Product price
 * @apiSuccess {Number} product.stock Available stock
 * @apiSuccess {String} [product.category] Product category
 * @apiSuccess {String} [product.imageUrl] Product image URL
 * @apiSuccess {Object} product.vendorProfile Vendor information
 * @apiSuccess {String} product.vendorProfile.businessName Vendor's business name
 *
 * @apiError (400) ValidationError Invalid input data
 * @apiError (401) Unauthorized Authentication required
 * @apiError (429) TooManyRequests Too many requests
 */
export const POST = withRateLimit(
  withAuth(
    withValidation(createProductSchema, async (req, data) => {
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
          ...data,
          vendorProfileId: vendorProfile.id,
        },
        include: {
          vendorProfile: {
            select: {
              businessName: true,
            },
          },
        },
      })

      return NextResponse.json(product)
    })
  ),
  { limit: 20, windowMs: 60 * 1000 } // 20 requests per minute
)
