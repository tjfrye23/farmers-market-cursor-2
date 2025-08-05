import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withRateLimit } from '@/lib/api-handler'
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
  website: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
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
