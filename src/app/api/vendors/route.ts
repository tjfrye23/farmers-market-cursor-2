import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/api-handler'
import { db } from '@/lib/prisma'

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
