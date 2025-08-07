import { z } from 'zod'
import { UserRole } from '@/generated/prisma/client'

// Schema for user role validation
export const userRoleSchema = z.nativeEnum(UserRole)

// Schema for user data from database
export const dbUserSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  name: z.string(),
  role: userRoleSchema,
  password: z.string(),
  vendorProfile: z
    .object({
      id: z.number().int().positive(),
      businessName: z.string(),
    })
    .nullable(),
})

// Schema for NextAuth user
export const nextAuthUserSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  name: z.string(),
  role: userRoleSchema,
  vendorProfile: z
    .object({
      id: z.number().int().positive(),
      businessName: z.string(),
    })
    .nullable(),
})

// Type guard functions using Zod
export function isValidUserRole(role: unknown): role is UserRole {
  return userRoleSchema.safeParse(role).success
}

export function isValidDbUser(
  obj: unknown
): obj is z.infer<typeof dbUserSchema> {
  return dbUserSchema.safeParse(obj).success
}

// Export types
export type DbUser = z.infer<typeof dbUserSchema>
export type NextAuthUser = z.infer<typeof nextAuthUserSchema>
