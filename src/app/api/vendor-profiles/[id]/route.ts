import { NextRequest, NextResponse } from 'next/server'
import { withAuth, withValidation, withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'
import {
  updateVendorProfileSchema,
  type UpdateVendorProfileInput,
} from '../route'

/**
 * @api {get} /api/vendor-profiles/:id Get Vendor Profile
 * @apiName GetVendorProfile
 * @apiGroup VendorProfiles
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} id Vendor profile ID
 *
 * @apiSuccess {Object} vendorProfile Vendor profile information
 * @apiSuccess {Number} vendorProfile.id Vendor profile ID
 * @apiSuccess {String} vendorProfile.businessName Business name
 * @apiSuccess {String} [vendorProfile.description] Business description
 * @apiSuccess {String} vendorProfile.contactEmail Contact email
 * @apiSuccess {String} [vendorProfile.contactPhone] Contact phone number
 * @apiSuccess {String} [vendorProfile.address] Business address
 * @apiSuccess {Object} vendorProfile.user User information
 * @apiSuccess {String} vendorProfile.user.name User's name
 * @apiSuccess {String} vendorProfile.user.email User's email
 * @apiSuccess {Object[]} vendorProfile.products List of products
 * @apiSuccess {Number} vendorProfile.products.id Product ID
 * @apiSuccess {String} vendorProfile.products.name Product name
 * @apiSuccess {Number} vendorProfile.products.price Product price
 * @apiSuccess {String} [vendorProfile.products.imageUrl] Product image URL
 *
 * @apiError (400) InvalidId Invalid vendor profile ID
 * @apiError (404) NotFound Vendor profile not found
 * @apiError (429) TooManyRequests Too many requests
 */
export const GET = withRateLimit(
  async (req: NextRequest, context: { params: Record<string, string> }) => {
    const id = parseInt(context.params.id, 10)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid vendor profile ID' },
        { status: 400 }
      )
    }

    const vendorProfile = await db.vendorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        products: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    })

    if (!vendorProfile) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(vendorProfile)
  },
  { limit: 100, windowMs: 60 * 1000 }
)

/**
 * @api {put} /api/vendor-profiles/:id Update Vendor Profile
 * @apiName UpdateVendorProfile
 * @apiGroup VendorProfiles
 * @apiVersion 1.0.0
 * @apiDescription Update an existing vendor profile. Requires authentication.
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {Number} id Vendor profile ID
 *
 * @apiBody {String} [businessName] Business name
 * @apiBody {String} [description] Business description
 * @apiBody {String} [contactEmail] Contact email
 * @apiBody {String} [contactPhone] Contact phone number
 * @apiBody {String} [address] Business address
 * @apiBody {Number} [userId] ID of the associated user
 *
 * @apiSuccess {Object} vendorProfile Updated vendor profile
 * @apiSuccess {Number} vendorProfile.id Vendor profile ID
 * @apiSuccess {String} vendorProfile.businessName Business name
 * @apiSuccess {String} [vendorProfile.description] Business description
 * @apiSuccess {String} vendorProfile.contactEmail Contact email
 * @apiSuccess {String} [vendorProfile.contactPhone] Contact phone number
 * @apiSuccess {String} [vendorProfile.address] Business address
 * @apiSuccess {Object} vendorProfile.user User information
 * @apiSuccess {String} vendorProfile.user.name User's name
 * @apiSuccess {String} vendorProfile.user.email User's email
 * @apiSuccess {Object[]} vendorProfile.products List of products
 * @apiSuccess {Number} vendorProfile.products.id Product ID
 * @apiSuccess {String} vendorProfile.products.name Product name
 * @apiSuccess {Number} vendorProfile.products.price Product price
 * @apiSuccess {String} [vendorProfile.products.imageUrl] Product image URL
 *
 * @apiError (400) ValidationError Invalid input data
 * @apiError (400) InvalidId Invalid vendor profile ID
 * @apiError (401) Unauthorized Authentication required
 * @apiError (429) TooManyRequests Too many requests
 */
export const PUT = withRateLimit(
  withAuth(
    withValidation(
      updateVendorProfileSchema,
      async (req, data: UpdateVendorProfileInput, context) => {
        const id = parseInt(context.params.id, 10)
        if (isNaN(id)) {
          return NextResponse.json(
            { error: 'Invalid vendor profile ID' },
            { status: 400 }
          )
        }

        const vendorProfile = await db.vendorProfile.update({
          where: { id },
          data,
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            products: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        })

        return NextResponse.json(vendorProfile)
      }
    )
  ),
  { limit: 20, windowMs: 60 * 1000 }
)

/**
 * @api {delete} /api/vendor-profiles/:id Delete Vendor Profile
 * @apiName DeleteVendorProfile
 * @apiGroup VendorProfiles
 * @apiVersion 1.0.0
 * @apiDescription Delete a vendor profile. Requires authentication.
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiParam {Number} id Vendor profile ID
 *
 * @apiSuccess (204) NoContent Vendor profile successfully deleted
 *
 * @apiError (400) InvalidId Invalid vendor profile ID
 * @apiError (401) Unauthorized Authentication required
 * @apiError (429) TooManyRequests Too many requests
 */
export const DELETE = withRateLimit(
  withAuth(
    async (req: NextRequest, context: { params: Record<string, string> }) => {
      const id = parseInt(context.params.id, 10)
      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid vendor profile ID' },
          { status: 400 }
        )
      }

      await db.vendorProfile.delete({
        where: { id },
      })

      return new NextResponse(null, { status: 204 })
    }
  ),
  { limit: 20, windowMs: 60 * 1000 }
)
