import { NextRequest, NextResponse } from 'next/server'
import { withAuth, withValidation, withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'
import { updateProductSchema, type UpdateProductInput } from '../route'

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
          data: {
            name: data.name,
            description: data.description,
            category: data.category,
            imageUrl: data.imageUrl,
            organic: data.organic,
            local: data.local,
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
