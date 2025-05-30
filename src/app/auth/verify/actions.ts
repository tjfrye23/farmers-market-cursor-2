'use server'

import { db } from '@/lib/prisma'

export async function verifyEmail(token: string) {
  if (!token) {
    return { status: 'error', message: 'Invalid verification link.' }
  }

  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return {
        status: 'error',
        message: 'Invalid or expired verification link.',
      }
    }

    const user = await db.user.findUnique({
      where: { email: verificationToken.identifier },
    })

    if (!user) {
      return { status: 'error', message: 'User not found.' }
    }

    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    })

    await db.verificationToken.delete({
      where: { token },
    })

    return {
      status: 'success',
      message: 'Email verified successfully! You can now log in.',
    }
  } catch {
    return { status: 'error', message: 'An error occurred. Please try again.' }
  }
}
