import { NextResponse } from 'next/server'

export async function GET() {
  // const categories = await db.category.findMany()
  const categories = ['vegetables', 'fruits', 'meat', 'dairy', 'bakery']
  return NextResponse.json(categories)
}
