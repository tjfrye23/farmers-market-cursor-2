import { NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/api-handler'
import { getVendorsPaginated } from '@/data/vendors'

export const GET = withRateLimit(
  async (req) => {
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)
    const search = searchParams.get('search') || undefined

    const result = await getVendorsPaginated(page, pageSize, search)
    return NextResponse.json(result)
  },
  { limit: 100, windowMs: 60 * 1000 }
)
