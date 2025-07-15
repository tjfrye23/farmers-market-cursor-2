import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/prisma'

// Assumes you have Cart and CartItem models in your Prisma schema

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 })
  }
  const cart = await db.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: true },
  })
  return NextResponse.json(cart?.items || [])
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = await req.json()
  // Upsert cart and item
  let cart = await db.cart.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id },
  })
  // Upsert item (by productId + variationId)
  await db.cartItem.upsert({
    where: {
      cartId_productId_variationId: {
        cartId: cart.id,
        productId: data.productId,
        variationId: data.variationId,
      },
    },
    update: {
      quantity: { increment: data.quantity },
    },
    create: {
      cartId: cart.id,
      productId: data.productId,
      variationId: data.variationId,
      name: data.name,
      imageUrl: data.imageUrl,
      price: data.price,
      quantity: data.quantity,
      unit: data.unit,
    },
  })
  // Return updated cart
  cart = await db.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: true },
  })
  return NextResponse.json(cart?.items || [])
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const url = new URL(req.url)
  const productId = url.searchParams.get('productId')
  const variationId = url.searchParams.get('variationId')
  let cart = await db.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: true },
  })
  if (!cart) {
    return NextResponse.json([], { status: 200 })
  }
  if (productId && variationId) {
    // Remove a single item
    await db.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: Number(productId),
        variationId: Number(variationId),
      },
    })
  } else {
    // Clear all items
    await db.cartItem.deleteMany({ where: { cartId: cart.id } })
  }
  // Return updated cart
  cart = await db.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: true },
  })
  return NextResponse.json(cart?.items || [])
}
