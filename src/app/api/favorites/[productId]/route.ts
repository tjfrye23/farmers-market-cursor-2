import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/prisma'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { productId } = await params
  const productIdNum = Number(productId)
  if (!productIdNum) {
    return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  }

  await db.favorite.deleteMany({
    where: { userId: session.user.id, productId: productIdNum },
  })
  return new NextResponse(null, { status: 204 })
}
