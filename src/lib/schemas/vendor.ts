import { z } from 'zod'
import { UserRole } from '@/generated/prisma/client'

// Vendor signup schema
export const vendorSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  businessName: z
    .string()
    .min(2, 'Business name must be at least 2 characters'),
  description: z.string(),
  phone: z.string().optional(),
  address: z.string().optional(),
  headerImageUrl: z.string(),
})

export type VendorSignupInput = z.infer<typeof vendorSignupSchema>

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
  role: z.nativeEnum(UserRole).default(UserRole.VENDOR),
})

export const updateVendorProfileSchema = createVendorProfileSchema.partial()

export type CreateVendorProfileInput = z.infer<typeof createVendorProfileSchema>
export type UpdateVendorProfileInput = z.infer<typeof updateVendorProfileSchema>
