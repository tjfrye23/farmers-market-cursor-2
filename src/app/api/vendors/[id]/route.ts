import { NextResponse } from 'next/server'
import { withAuth, withRateLimit, withValidation } from '@/lib/api-handler'
import { getVendor, updateVendorProfile } from '@/data/vendors'
import {
  UpdateVendorProfileInput,
  updateVendorProfileSchema,
} from '@/lib/schemas/vendor'
import { ClientVendor } from '@/types/vendors'

export const GET = withRateLimit(
  async (
    req,
    context
  ): Promise<NextResponse<ClientVendor | { error: string }>> => {
    const params = await context.params
    const id = parseInt(params.id, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid vendor ID' }, { status: 400 })
    }

    const vendor = await getVendor(id)
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }

    return NextResponse.json(vendor)
  },
  { limit: 100, windowMs: 60 * 1000 }
)

export const PUT = withRateLimit(
  withAuth(
    withValidation(
      updateVendorProfileSchema,
      async (
        req,
        data: UpdateVendorProfileInput,
        context
      ): Promise<NextResponse<ClientVendor | { error: string }>> => {
        const { session } = context

        if (!session) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const params = await context.params
        const id = parseInt(params.id, 10)

        if (isNaN(id)) {
          return NextResponse.json(
            { error: 'Invalid vendor profile ID' },
            { status: 400 }
          )
        }

        const vendor = await updateVendorProfile(id, data)
        const clientVendor: ClientVendor = {
          id: vendor.id,
          businessName: vendor.businessName,
          email: vendor.email,
          phone: vendor.phone,
          address: vendor.address,
          description: vendor.description,
          specialty: vendor.specialty,
          headerImageUrl: vendor.headerImageUrl,
          ownerName: vendor.user.name,
          status: vendor.status,
        }
        return NextResponse.json(clientVendor)
      }
    )
  ),
  { limit: 20, windowMs: 60 * 1000 }
)
