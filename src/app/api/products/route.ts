import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAuth, withValidation, withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'

// Validation schemas
export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  category: z.string().optional(),
  imageUrl: z.string().url().optional(),
  vendorProfileId: z.number().int().positive(),
})

export const updateProductSchema = createProductSchema.partial()

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>

/**
 * @api {get} /api/products List Products
 * @apiName GetProducts
 * @apiGroup Products
 * @apiVersion 1.0.0
 *
 * @apiQuery {String} [category] Filter products by category
 * @apiQuery {String} [vendorId] Filter products by vendor ID
 *
 * @apiSuccess {Object[]} products List of products
 * @apiSuccess {Number} products.id Product ID
 * @apiSuccess {String} products.name Product name
 * @apiSuccess {String} [products.description] Product description
 * @apiSuccess {Number} products.price Product price
 * @apiSuccess {Number} products.stock Available stock
 * @apiSuccess {String} [products.category] Product category
 * @apiSuccess {String} [products.imageUrl] Product image URL
 * @apiSuccess {Object} products.vendorProfile Vendor information
 * @apiSuccess {String} products.vendorProfile.businessName Vendor's business name
 *
 * @apiError (429) TooManyRequests Too many requests
 */
export const GET = withRateLimit(
  async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get('category')
    const vendorId = searchParams.get('vendorId')

    const where = {
      ...(category && { category }),
      ...(vendorId && { vendorProfileId: parseInt(vendorId, 10) }),
    }

    const products = await db.product.findMany({
      where,
      include: {
        vendorProfile: {
          select: {
            businessName: true,
          },
        },
      },
    })

    return NextResponse.json(products)
  },
  { limit: 100, windowMs: 60 * 1000 } // 100 requests per minute
)

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
      const product = await db.product.create({
        data,
        include: {
          vendorProfile: {
            select: {
              businessName: true,
            },
          },
        },
      })

      return NextResponse.json(product, { status: 201 })
    })
  ),
  { limit: 20, windowMs: 60 * 1000 } // 20 requests per minute
)
