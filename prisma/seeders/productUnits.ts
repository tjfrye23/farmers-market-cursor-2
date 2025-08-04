import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedProductUnits(prisma: PrismaClient) {
  console.log('📦 Seeding product units...')

  const productUnits = [
    { name: 'pound', pluralName: 'pounds', displayName: 'Pound', symbol: 'lb' },
    { name: 'each', pluralName: 'each', displayName: 'Each', symbol: 'ea' },
    { name: 'box', pluralName: 'boxes', displayName: 'Box', symbol: 'box' },
    { name: 'bag', pluralName: 'bags', displayName: 'Bag', symbol: 'bag' },
    {
      name: 'bunch',
      pluralName: 'bunches',
      displayName: 'Bunch',
      symbol: 'bunch',
    },
    { name: 'dozen', pluralName: 'dozen', displayName: 'Dozen', symbol: 'dz' },
    { name: 'quart', pluralName: 'quarts', displayName: 'Quart', symbol: 'qt' },
    {
      name: 'gallon',
      pluralName: 'gallons',
      displayName: 'Gallon',
      symbol: 'gal',
    },
  ]

  const productUnitMap: Record<string, number> = {}

  for (const unit of productUnits) {
    const createdUnit = await prisma.productUnit.upsert({
      where: { name: unit.name },
      update: {},
      create: unit,
    })
    productUnitMap[unit.name] = createdUnit.id
  }

  console.log(`✅ Seeded ${productUnits.length} product units`)
  return productUnitMap
}
