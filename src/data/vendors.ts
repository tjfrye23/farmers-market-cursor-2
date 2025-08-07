import { db } from '@/lib/prisma'
import { ClientProductSimple } from '@/types/product'
import { ClientVendor } from '@/types/vendors'
import { UpdateVendorProfileInput } from '@/lib/schemas/vendor'
import z from 'zod'

export const vendorProfileIdSchema = z
  .number()
  .positive('Vendor profile ID must be a positive number')

export async function getVendorsPaginated(
  page: number,
  pageSize: number,
  search?: string
): Promise<{ vendors: ClientVendor[]; total: number }> {
  const where = search
    ? {
        OR: [
          { businessName: { contains: search } },
          { description: { contains: search } },
        ],
      }
    : {}

  const [vendors, total] = await Promise.all([
    db.vendorProfile.findMany({
      where,
      include: { user: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { businessName: 'asc' },
    }),
    db.vendorProfile.count({ where }),
  ])

  const clientVendors = vendors.map<ClientVendor>((vendor) => ({
    ...vendor,
    ownerName: vendor.user.name,
    status: vendor.status,
  }))
  return { vendors: clientVendors, total }
}

export async function getVendorById(id: number): Promise<{
  vendor: ClientVendor
  products: ClientProductSimple[]
} | null> {
  const vendor = await db.vendorProfile.findUnique({
    where: { id },
    include: { user: true, products: true },
  })

  if (!vendor) return null

  return {
    vendor: {
      ...vendor,
      ownerName: vendor.user.name,
      status: vendor.status,
    },
    products: vendor.products.map<ClientProductSimple>((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      organic: product.organic,
      local: product.local,
      vendor: vendor,
      vendorName: vendor.businessName,
    })),
  }
}

export async function getVendor(id: number): Promise<ClientVendor | null> {
  const vendor = await db.vendorProfile.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!vendor) return null

  return {
    ...vendor,
    ownerName: vendor.user.name,
    status: vendor.status,
  }
}

export async function updateVendorProfile(
  vendorId: number,
  data: UpdateVendorProfileInput
) {
  return await db.vendorProfile.update({
    where: { id: vendorId },
    data: {
      businessName: data.businessName,
      description: data.description,
      address: data.address,
      specialty: data.specialty,
      headerImageUrl: data.headerImageUrl,
      websiteUrl: data.website,
      facebookHandle: data.facebook,
      instagramHandle: data.instagram,
      twitterHandle: data.twitter,
    },
    include: {
      user: true,
    },
  })
}

export async function findVendorByUserId(userId: number) {
  return await db.vendorProfile.findUnique({
    where: { userId },
    include: {
      user: true,
    },
  })
}
