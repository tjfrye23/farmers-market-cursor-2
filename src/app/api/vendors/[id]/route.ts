import { NextRequest, NextResponse } from 'next/server'
import { withAuth, withValidation, withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'
import {
  updateVendorProfileSchema,
  type UpdateVendorProfileInput,
} from '@/lib/schemas/vendor'

export const GET = withRateLimit(
  async (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ) => {
    const params = await context.params
    const id = parseInt(params.id, 10)
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

export const PUT = withRateLimit(
  withAuth(
    withValidation(
      updateVendorProfileSchema,
      async (req, data: UpdateVendorProfileInput, context) => {
        const params = await context.params
        const id = parseInt(params.id, 10)
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
