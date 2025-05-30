import { NextRequest, NextResponse } from 'next/server'
import { withAuth, withValidation, withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'
import { updateProductSchema, type UpdateProductInput } from '../route'

/**
 * @api {get} /api/products/:id Get Product
 * @apiName GetProduct
 * @apiGroup Products
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} id Product ID
 *
 * @apiSuccess {Object} product Product information
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
 * @apiError (400) InvalidId Invalid product ID
 * @apiError (404) NotFound Product not found
 * @apiError (429) TooManyRequests Too many requests
 */
export const GET = withRateLimit(
  async (req: NextRequest, context: { params: Record<string, string> }) => {
    const id = parseInt(context.params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const product = await db.product.findUnique({
      where: { id },
      include: {
        vendorProfile: {
          select: {
            businessName: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  },
  { limit: 100, windowMs: 60 * 1000 }
)

/**
 * @api {put} /api/products/:id Update Product
 * @apiName UpdateProduct
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Update an existing product. Requires authentication.
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {Number} id Product ID
 *
 * @apiBody {String} [name] Product name
 * @apiBody {String} [description] Product description
 * @apiBody {Number} [price] Product price (must be positive)
 * @apiBody {Number} [stock] Available stock (must be non-negative)
 * @apiBody {String} [category] Product category
 * @apiBody {String} [imageUrl] Product image URL
 * @apiBody {Number} [vendorProfileId] ID of the vendor profile
 *
 * @apiSuccess {Object} product Updated product
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
 * @apiError (400) InvalidId Invalid product ID
 * @apiError (401) Unauthorized Authentication required
 * @apiError (429) TooManyRequests Too many requests
 */
export const PUT = withRateLimit(
  withAuth(
    withValidation(
      updateProductSchema,
      async (req, data: UpdateProductInput, context) => {
        const id = parseInt(context.params.id, 10)
        if (isNaN(id)) {
          return NextResponse.json(
            { error: 'Invalid product ID' },
            { status: 400 }
          )
        }

        const product = await db.product.update({
          where: { id },
          data,
          include: {
            vendorProfile: {
              select: {
                businessName: true,
              },
            },
          },
        })

        return NextResponse.json(product)
      }
    )
  ),
  { limit: 20, windowMs: 60 * 1000 }
)

/**
 * @api {delete} /api/products/:id Delete Product
 * @apiName DeleteProduct
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Delete a product. Requires authentication.
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {Number} id Product ID
 *
 * @apiSuccess (204) NoContent Product successfully deleted
 *
 * @apiError (400) InvalidId Invalid product ID
 * @apiError (401) Unauthorized Authentication required
 * @apiError (429) TooManyRequests Too many requests
 */
export const DELETE = withRateLimit(
  withAuth(
    async (req: NextRequest, context: { params: Record<string, string> }) => {
      const id = parseInt(context.params.id, 10)
      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid product ID' },
          { status: 400 }
        )
      }

      await db.product.delete({
        where: { id },
      })

      return new NextResponse(null, { status: 204 })
    }
  ),
  { limit: 20, windowMs: 60 * 1000 }
)
