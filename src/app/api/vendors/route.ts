import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAuth, withValidation, withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'

// Validation schemas
export const createVendorProfileSchema = z.object({
  businessName: z.string().min(1),
  description: z.string(),
  email: z.string().email(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  userId: z.number().int().positive(),
  headerImageUrl: z.string(),
  specialty: z.string(),
})

export const updateVendorProfileSchema = createVendorProfileSchema.partial()

export type CreateVendorProfileInput = z.infer<typeof createVendorProfileSchema>
export type UpdateVendorProfileInput = z.infer<typeof updateVendorProfileSchema>

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
            imageUrl: true,
          },
        },
      },
    })

    return NextResponse.json(vendorProfiles)
  },
  { limit: 100, windowMs: 60 * 1000 } // 100 requests per minute
)

export const POST = withRateLimit(
  withAuth(
    withValidation(createVendorProfileSchema, async (req, data) => {
      const vendorProfile = await db.vendorProfile.create({
        data: { ...data, status: 'INACTIVE' },
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
