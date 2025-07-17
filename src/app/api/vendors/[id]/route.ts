import { NextRequest, NextResponse } from 'next/server'
import { withAuth, withValidation, withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'
import {
  updateVendorProfileSchema,
  type UpdateVendorProfileInput,
} from '../route'

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
