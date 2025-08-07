/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, UserRole } from '../../src/generated/prisma/client'
import { hash } from 'bcryptjs'

export async function seedOrders(
  prisma: PrismaClient,
  vendor1Profile: any,
  marketDay: any,
  productUnitMap: Record<string, number>
) {
  console.log('📦 Seeding orders...')

  // Create sample orders for vendor@example.com
  if (vendor1Profile) {
    // Get the market day products for vendor1 to use in orders
    const vendor1MarketDayProducts = await prisma.marketDayProduct.findMany({
      where: {
        product: {
          vendorProfileId: vendor1Profile.id,
        },
        marketDayId: marketDay.id,
      },
      include: {
        variations: {
          include: {
            productVariation: true,
          },
        },
      },
    })

    // Create a few customers for orders
    const customer1 = await prisma.user.upsert({
      where: { email: 'sarah@example.com' },
      update: {},
      create: {
        email: 'sarah@example.com',
        name: 'Sarah Johnson',
        password: await hash('password123', 12),
        role: UserRole.USER,
      },
    })

    const customer2 = await prisma.user.upsert({
      where: { email: 'mike@example.com' },
      update: {},
      create: {
        email: 'mike@example.com',
        name: 'Mike Chen',
        password: await hash('password123', 12),
        role: UserRole.USER,
      },
    })

    const customer3 = await prisma.user.upsert({
      where: { email: 'emma@example.com' },
      update: {},
      create: {
        email: 'emma@example.com',
        name: 'Emma Davis',
        password: await hash('password123', 12),
        role: UserRole.USER,
      },
    })

    // Helper function to create an order with items
    async function createOrderWithItems({
      customerId,
      status,
      orderItems,
      createdAt,
    }: {
      customerId: number
      status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
      orderItems: Array<{
        marketDayProductId: number
        variationId: number
        quantity: number
        price: number
      }>
      createdAt: Date
    }) {
      const total = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )

      const order = await prisma.order.create({
        data: {
          userId: customerId,
          marketDayId: marketDay.id,
          status,
          total,
          createdAt,
        },
      })

      for (const item of orderItems) {
        // Find the marketDayProduct and variation
        const mdp = vendor1MarketDayProducts.find(
          (p) => p.id === item.marketDayProductId
        )
        const variation = mdp?.variations.find((v) => v.id === item.variationId)
        const productUnitId =
          variation?.productVariation?.productUnitId || productUnitMap['ea']
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            marketDayProductVariationId: item.variationId,
            packaged: variation?.productVariation?.packaged || false,
            size: variation?.productVariation?.size || 0,
            productUnitId,
            quantity: item.quantity,
            price: item.price,
            status: 'PROCESSING',
          },
        })
      }

      return order
    }

    // Create sample orders
    if (vendor1MarketDayProducts.length > 0) {
      // Order 1: Pending order with tomatoes and lettuce
      await createOrderWithItems({
        customerId: customer1.id,
        status: 'PENDING',
        orderItems: [
          {
            marketDayProductId: vendor1MarketDayProducts[0].id, // Tomatoes
            variationId: vendor1MarketDayProducts[0].variations[0].id,
            quantity: 2,
            price: 4.99,
          },
          {
            marketDayProductId: vendor1MarketDayProducts[1].id, // Lettuce
            variationId: vendor1MarketDayProducts[1].variations[0].id,
            quantity: 1,
            price: 2.99,
          },
        ],
        createdAt: new Date('2024-06-14T10:30:00Z'),
      })

      // Order 2: Confirmed order with carrots
      await createOrderWithItems({
        customerId: customer2.id,
        status: 'CONFIRMED',
        orderItems: [
          {
            marketDayProductId: vendor1MarketDayProducts[2].id, // Carrots
            variationId: vendor1MarketDayProducts[2].variations[0].id,
            quantity: 3,
            price: 3.99,
          },
        ],
        createdAt: new Date('2024-06-14T11:15:00Z'),
      })

      // Order 3: Completed order with multiple items
      await createOrderWithItems({
        customerId: customer3.id,
        status: 'COMPLETED',
        orderItems: [
          {
            marketDayProductId: vendor1MarketDayProducts[0].id, // Tomatoes
            variationId: vendor1MarketDayProducts[0].variations[1].id, // 2 lb
            quantity: 1,
            price: 8.99,
          },
          {
            marketDayProductId: vendor1MarketDayProducts[2].id, // Carrots
            variationId: vendor1MarketDayProducts[2].variations[1].id, // 2 lb
            quantity: 2,
            price: 7.49,
          },
        ],
        createdAt: new Date('2024-06-13T14:20:00Z'),
      })

      // Order 4: Another pending order
      await createOrderWithItems({
        customerId: customer1.id,
        status: 'PENDING',
        orderItems: [
          {
            marketDayProductId: vendor1MarketDayProducts[1].id, // Lettuce
            variationId: vendor1MarketDayProducts[1].variations[1].id, // Bag
            quantity: 2,
            price: 6.99,
          },
        ],
        createdAt: new Date('2024-06-14T12:45:00Z'),
      })

      // Order 5: Cancelled order
      await createOrderWithItems({
        customerId: customer2.id,
        status: 'CANCELLED',
        orderItems: [
          {
            marketDayProductId: vendor1MarketDayProducts[0].id, // Tomatoes
            variationId: vendor1MarketDayProducts[0].variations[2].id, // Box
            quantity: 1,
            price: 19.99,
          },
        ],
        createdAt: new Date('2024-06-14T09:10:00Z'),
      })
    }
  }

  console.log('✅ Seeded orders')
}
