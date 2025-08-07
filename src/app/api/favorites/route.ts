import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/api-handler'
import { getUserFavorites } from '@/data/favorites'

export const GET = withAuth(async (req, context) => {
  const { session } = context
  const favorites = await getUserFavorites(session.user.id)
  return NextResponse.json(favorites)
})
