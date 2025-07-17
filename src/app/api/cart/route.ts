import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import { ClientCart } from '@/types/cart'
import {
  getCart,
  getCarts,
  upsertCartWithItems,
  deleteCartItem,
  deleteAllCarts,
  deleteAllCartItems,
} from '@/data/carts'

const UpdateCartSchema = z.object({
  marketDayId: z.number(),
  marketDayProductVariationIds: z.array(z.number()),
  quantities: z.array(z.number().int().min(1)),
})

export type UpdateCartRequest = z.infer<typeof UpdateCartSchema>

export async function GET(): Promise<NextResponse<ClientCart[]>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json([], { status: 200 })
    }

    const carts = await getCarts(session.user.id)
    return NextResponse.json(carts)
  } catch (error) {
    console.error('GET /api/cart error:', error)
    return NextResponse.json([], {
      status: 500,
      statusText: 'Internal Server Error',
    })
  }
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<ClientCart | { error: string }>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const data = await req.json()
    const parse = UpdateCartSchema.safeParse(data)
    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parse.error.flatten() },
        { status: 400 }
      )
    }
    const { marketDayId, marketDayProductVariationIds, quantities } = parse.data

    await upsertCartWithItems(
      session.user.id,
      marketDayId,
      marketDayProductVariationIds,
      quantities
    )
    const updatedCart = await getCart(session.user.id, marketDayId)
    if (!updatedCart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    return NextResponse.json(updatedCart)
  } catch (error) {
    console.error('POST /api/cart error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest
): Promise<NextResponse<ClientCart | null | { error: string }>> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = new URL(req.url)
    const marketDayId = url.searchParams.get('marketDayId')
    const marketDayProductVariationId = url.searchParams.get(
      'marketDayProductVariationId'
    )

    if (!marketDayId) {
      await deleteAllCarts(session.user.id)
      return NextResponse.json(null)
    }

    if (!marketDayProductVariationId) {
      await deleteAllCartItems(session.user.id, Number(marketDayId))
    } else {
      await deleteCartItem(
        session.user.id,
        Number(marketDayId),
        Number(marketDayProductVariationId)
      )
    }

    const clientCart = await getCart(session.user.id, Number(marketDayId))

    return NextResponse.json(clientCart)
  } catch (error) {
    console.error('DELETE /api/cart error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
