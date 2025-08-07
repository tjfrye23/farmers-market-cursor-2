'use server'

import {
  findVerificationToken,
  findUserById,
  updateUserVerification,
  deleteVerificationToken,
} from '@/data/auth'

export type VerifyEmailResult =
  | VerifyEmailResultSuccess
  | VerifyEmailResultError

interface VerifyEmailResultSuccess {
  success: true
}

interface VerifyEmailResultError {
  success: false
  error: string
}

export async function verifyEmail(token: string): Promise<VerifyEmailResult> {
  try {
    // Find verification token
    const verificationToken = await findVerificationToken(token)
    if (!verificationToken) {
      return { success: false, error: 'Invalid verification token' }
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      return { success: false, error: 'Verification token has expired' }
    }

    // Find user by email
    const user = await findUserById(parseInt(verificationToken.identifier))
    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Update user verification status
    await updateUserVerification(user.id)

    // Delete verification token
    await deleteVerificationToken(token)

    return { success: true }
  } catch (error) {
    console.error('Email verification error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Something went wrong',
    }
  }
}
