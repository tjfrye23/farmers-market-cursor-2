import { withAuth } from '@/lib/api-handler'
import { db } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

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
export const GET = withAuth(async (req: NextRequest, context) => {
  const searchParams = req.nextUrl.searchParams
  const category = searchParams.get('category')

  const user = context.session?.user
  if (!user || user.role !== 'vendor' || !user.vendorProfile) {
    console.log('Forbidden', user)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  // Find vendor profile
  const vendorProfile = await db.vendorProfile.findUnique({
    where: { id: user.vendorProfile?.id },
    select: { id: true },
  })

  if (!vendorProfile) {
    return NextResponse.json([], { status: 200 })
  }

  const where = {
    ...(category && { category }),
    vendorProfileId: vendorProfile.id,
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
})
