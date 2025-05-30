'use server'

import { db } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'

export async function registerUser(formData: FormData) {
  const name = formData.get('name')?.toString().trim()
  const email = formData.get('email')?.toString().toLowerCase().trim()
  const password = formData.get('password')?.toString()

  if (!name || !email || !password) {
    return { success: false, error: 'All fields are required.' }
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' }
  }

  // Check for existing user
  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return { success: false, error: 'Email is already registered.' }
  }

  const hashed = await bcrypt.hash(password, 10)
  await db.user.create({
    data: {
      name,
      email,
      password: hashed,
    },
  })

  const token = crypto.randomBytes(32).toString('hex')
  await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  })

  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`
  await sendVerificationEmail(email, verificationUrl)

  return { success: true }
}
