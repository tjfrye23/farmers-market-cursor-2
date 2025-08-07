'use server'

import { hash } from 'bcryptjs'
import { z } from 'zod'
import { db } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { UserRole } from '@/generated/prisma/client'
import {
  vendorSignupSchema,
  type VendorSignupInput,
} from '@/lib/schemas/vendor'

export async function signupVendor(data: VendorSignupInput) {
  try {
    // Validate input
    const validatedData = vendorSignupSchema.parse(data)
    const {
      name,
      email,
      password,
      businessName,
      description,
      phone,
      address,
      headerImageUrl,
    } = validatedData

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user and vendor profile in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: UserRole.VENDOR,
        },
      })

      // Create vendor profile
      const vendorProfile = await tx.vendorProfile.create({
        data: {
          userId: user.id,
          businessName,
          description: description,
          specialty: businessName,
          email: email,
          headerImageUrl,
          phone,
          address,
        },
      })

      return { user, vendorProfile }
    })

    // Revalidate relevant paths
    revalidatePath('/')

    return {
      success: true,
      data: {
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
        },
        vendorProfile: {
          id: result.vendorProfile.id,
          businessName: result.vendorProfile.businessName,
        },
      },
    }
  } catch (error) {
    console.error('Vendor signup error:', error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid input data',
        details: error.errors,
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Something went wrong',
    }
  }
}
