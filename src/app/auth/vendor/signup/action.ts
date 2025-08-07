'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import {
  vendorSignupSchema,
  type VendorSignupInput,
} from '@/lib/schemas/vendor'
import { createVendorWithProfile, findUserByEmail } from '@/data/auth'
import { VendorSignupResult } from './type'

export async function signupVendor(
  data: VendorSignupInput
): Promise<VendorSignupResult> {
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

    const user = await findUserByEmail(email)
    if (user) {
      return {
        success: false,
        error: 'User already exists',
      }
    }

    // Create user and vendor profile using data layer
    const result = await createVendorWithProfile({
      name,
      email,
      password,
      businessName,
      description,
      phone,
      address,
      headerImageUrl,
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
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Something went wrong',
    }
  }
}
