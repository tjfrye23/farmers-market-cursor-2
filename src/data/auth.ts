import { db } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { UserRole } from '@/generated/prisma/client'

export interface CreateUserData {
  name: string
  email: string
  password: string
  role?: UserRole
}

export interface CreateVendorData {
  name: string
  email: string
  password: string
  businessName: string
  description: string
  phone?: string
  address?: string
  headerImageUrl: string
}

export async function findUserByEmail(email: string) {
  return await db.user.findUnique({
    where: { email },
    include: {
      vendorProfile: true,
    },
  })
}

export async function findUserById(id: number) {
  return await db.user.findUnique({
    where: { id },
    include: {
      vendorProfile: true,
    },
  })
}

export async function createUser(data: CreateUserData) {
  const hashedPassword = await hash(data.password, 12)

  return await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || UserRole.USER,
    },
  })
}

export async function createVendorWithProfile(data: CreateVendorData) {
  const hashedPassword = await hash(data.password, 12)

  return await db.$transaction(async (tx) => {
    // Create user
    const user = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: UserRole.VENDOR,
      },
    })

    // Create vendor profile
    const vendorProfile = await tx.vendorProfile.create({
      data: {
        userId: user.id,
        businessName: data.businessName,
        description: data.description,
        specialty: data.businessName,
        email: data.email,
        headerImageUrl: data.headerImageUrl,
        phone: data.phone,
        address: data.address,
      },
    })

    return { user, vendorProfile }
  })
}

export async function updateUserVerification(userId: number) {
  return await db.user.update({
    where: { id: userId },
    data: { emailVerified: new Date() },
  })
}

export async function findVerificationToken(token: string) {
  return await db.verificationToken.findUnique({
    where: { token },
  })
}

export async function createVerificationToken(data: {
  identifier: string
  token: string
  expires: Date
}) {
  return await db.verificationToken.create({
    data,
  })
}

export async function deleteVerificationToken(token: string) {
  return await db.verificationToken.delete({
    where: { token },
  })
}
