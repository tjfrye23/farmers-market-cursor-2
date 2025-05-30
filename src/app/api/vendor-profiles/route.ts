import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAuth, withValidation, withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'

// Validation schemas
export const createVendorProfileSchema = z.object({
  businessName: z.string().min(1),
  description: z.string().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  userId: z.number().int().positive(),
})

export const updateVendorProfileSchema = createVendorProfileSchema.partial()

export type CreateVendorProfileInput = z.infer<typeof createVendorProfileSchema>
export type UpdateVendorProfileInput = z.infer<typeof updateVendorProfileSchema>

/**
 * @api {get} /api/vendor-profiles List Vendor Profiles
 * @apiName GetVendorProfiles
 * @apiGroup VendorProfiles
 * @apiVersion 1.0.0
 *
 * @apiQuery {String} [userId] Filter vendor profiles by user ID
 *
 * @apiSuccess {Object[]} vendorProfiles List of vendor profiles
 * @apiSuccess {Number} vendorProfiles.id Vendor profile ID
 * @apiSuccess {String} vendorProfiles.businessName Business name
 * @apiSuccess {String} [vendorProfiles.description] Business description
 * @apiSuccess {String} vendorProfiles.contactEmail Contact email
 * @apiSuccess {String} [vendorProfiles.contactPhone] Contact phone number
 * @apiSuccess {String} [vendorProfiles.address] Business address
 * @apiSuccess {Object} vendorProfiles.user User information
 * @apiSuccess {String} vendorProfiles.user.name User's name
 * @apiSuccess {String} vendorProfiles.user.email User's email
 * @apiSuccess {Object[]} vendorProfiles.products List of products
 * @apiSuccess {Number} vendorProfiles.products.id Product ID
 * @apiSuccess {String} vendorProfiles.products.name Product name
 * @apiSuccess {Number} vendorProfiles.products.price Product price
 * @apiSuccess {String} [vendorProfiles.products.imageUrl] Product image URL
 *
 * @apiError (429) TooManyRequests Too many requests
 */
export const GET = withRateLimit(
  async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get('userId')

    const where = {
      ...(userId && { userId: parseInt(userId, 10) }),
    }

    const vendorProfiles = await db.vendorProfile.findMany({
      where,
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
            price: true,
            imageUrl: true,
          },
        },
      },
    })

    return NextResponse.json(vendorProfiles)
  },
  { limit: 100, windowMs: 60 * 1000 } // 100 requests per minute
)

/**
 * @api {post} /api/vendor-profiles Create Vendor Profile
 * @apiName CreateVendorProfile
 * @apiGroup VendorProfiles
 * @apiVersion 1.0.0
 * @apiDescription Create a new vendor profile. Requires authentication.
 *
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiBody {String} businessName Business name
 * @apiBody {String} [description] Business description
 * @apiBody {String} contactEmail Contact email
 * @apiBody {String} [contactPhone] Contact phone number
 * @apiBody {String} [address] Business address
 * @apiBody {Number} userId ID of the associated user
 *
 * @apiSuccess (201) {Object} vendorProfile Created vendor profile
 * @apiSuccess {Number} vendorProfile.id Vendor profile ID
 * @apiSuccess {String} vendorProfile.businessName Business name
 * @apiSuccess {String} [vendorProfile.description] Business description
 * @apiSuccess {String} vendorProfile.contactEmail Contact email
 * @apiSuccess {String} [vendorProfile.contactPhone] Contact phone number
 * @apiSuccess {String} [vendorProfile.address] Business address
 * @apiSuccess {Object} vendorProfile.user User information
 * @apiSuccess {String} vendorProfile.user.name User's name
 * @apiSuccess {String} vendorProfile.user.email User's email
 *
 * @apiError (400) ValidationError Invalid input data
 * @apiError (401) Unauthorized Authentication required
 * @apiError (429) TooManyRequests Too many requests
 */
export const POST = withRateLimit(
  withAuth(
    withValidation(createVendorProfileSchema, async (req, data) => {
      const vendorProfile = await db.vendorProfile.create({
        data,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      })

      return NextResponse.json(vendorProfile, { status: 201 })
    })
  ),
  { limit: 20, windowMs: 60 * 1000 } // 20 requests per minute
)
