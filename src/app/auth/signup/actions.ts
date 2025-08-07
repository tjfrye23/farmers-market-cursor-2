'use server'

import { z } from 'zod'
import {
  createVerificationToken,
  createUser,
  findUserByEmail,
} from '@/data/auth'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type SignupInput = z.infer<typeof signupSchema>

export async function signup(data: SignupInput) {
  try {
    const validatedData = signupSchema.parse(data)
    const { name, email, password } = validatedData

    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return {
        success: false,
        error: 'User already exists',
      }
    }

    // Create user using data layer
    await createUser({
      name,
      email,
      password,
    })

    // Create verification token
    const token = await createVerificationToken({
      identifier: email,
      token: crypto.randomUUID(),
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    })

    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`
    await sendVerificationEmail(email, verificationUrl)

    return { success: true }
  } catch (error) {
    console.error('Signup error:', error)
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
