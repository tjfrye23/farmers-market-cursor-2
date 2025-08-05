import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const favorites = await db.favorite.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  })
  return NextResponse.json(
    favorites.map((fav: { product: unknown }) => fav.product)
  )
}
