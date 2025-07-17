import { db } from '@/lib/prisma'
import { ClientCart, ClientCartItem } from '@/types/cart'

export const getCarts = async (userId: number): Promise<ClientCart[]> => {
  const carts = await db.cart.findMany({
    where: {
      userId,
    },
    include: {
      marketDay: {
        include: {
          marketSchedule: true,
        },
      },
      cartItems: {
        include: {
          marketDayProductVariation: {
            include: {
              productVariation: {
                include: {
                  unit: true,
                },
              },
              marketDayProduct: {
                include: {
                  marketDay: true,
                  product: { include: { vendorProfile: true } },
                },
              },
            },
          },
        },
      },
    },
  })

  const clientCart = carts.map<ClientCart>((cart) => ({
    marketDay: {
      id: cart.marketDayId,
      name: cart.marketDay.marketSchedule.name,
      location: cart.marketDay.marketSchedule.location,
      startTime: cart.marketDay.startTime.toISOString(),
      endTime: cart.marketDay.endTime.toISOString(),
      description: cart.marketDay.marketSchedule.description,
      status: cart.marketDay.status,
      marketSchedule: {
        id: cart.marketDay.marketSchedule.id,
      },
    },
    items: cart.cartItems.map<ClientCartItem>((item) => ({
      variationId: item.marketDayProductVariationId,
      quantity: item.quantity,
      name: item.marketDayProductVariation.marketDayProduct.product.name,
      imageUrl:
        item.marketDayProductVariation.marketDayProduct.product.imageUrl,
      price: item.marketDayProductVariation.price,
      unit: item.marketDayProductVariation.productVariation.unit,
      vendor:
        item.marketDayProductVariation.marketDayProduct.product.vendorProfile,
      packaged: item.marketDayProductVariation.productVariation.packaged,
      size: item.marketDayProductVariation.productVariation.size,
    })),
  }))

  return clientCart
}

export const getCart = async (
  userId: number,
  marketDayId: number
): Promise<ClientCart | null> => {
  const cart = await db.cart.findUnique({
    where: {
      userId_marketDayId: {
        userId,
        marketDayId,
      },
    },
    include: {
      marketDay: {
        include: {
          marketSchedule: true,
        },
      },
      cartItems: {
        include: {
          marketDayProductVariation: {
            include: {
              productVariation: {
                include: {
                  unit: true,
                },
              },
              marketDayProduct: {
                include: {
                  marketDay: true,
                  product: { include: { vendorProfile: true } },
                },
              },
            },
          },
        },
      },
    },
  })

  if (!cart) {
    return null
  }

  const clientCart: ClientCart = {
    marketDay: {
      id: cart.marketDayId,
      name: cart.marketDay.marketSchedule.name,
      location: cart.marketDay.marketSchedule.location,
      startTime: cart.marketDay.startTime.toISOString(),
      endTime: cart.marketDay.endTime.toISOString(),
      description: cart.marketDay.marketSchedule.description,
      status: cart.marketDay.status,
      marketSchedule: {
        id: cart.marketDay.marketSchedule.id,
      },
    },
    items: cart.cartItems.map<ClientCartItem>((item) => ({
      variationId: item.marketDayProductVariationId,
      quantity: item.quantity,
      name: item.marketDayProductVariation.marketDayProduct.product.name,
      imageUrl:
        item.marketDayProductVariation.marketDayProduct.product.imageUrl,
      price: item.marketDayProductVariation.price,
      unit: item.marketDayProductVariation.productVariation.unit,
      vendor:
        item.marketDayProductVariation.marketDayProduct.product.vendorProfile,
      packaged: item.marketDayProductVariation.productVariation.packaged,
      size: item.marketDayProductVariation.productVariation.size,
    })),
  }

  return clientCart
}

export const getCartSimple = async (
  userId: number,
  marketDayId: number
): Promise<ClientCart | null> => {
  const cart = await db.cart.findUnique({
    where: {
      userId_marketDayId: {
        userId,
        marketDayId,
      },
    },
    include: {
      marketDay: {
        include: {
          marketSchedule: true,
        },
      },
      cartItems: {
        include: {
          marketDayProductVariation: {
            include: {
              productVariation: {
                include: {
                  unit: true,
                },
              },
              marketDayProduct: {
                include: {
                  marketDay: true,
                  product: { include: { vendorProfile: true } },
                },
              },
            },
          },
        },
      },
    },
  })

  if (!cart) {
    return null
  }

  const clientCart: ClientCart = {
    marketDay: {
      id: cart.marketDayId,
      name: cart.marketDay.marketSchedule.name,
      location: cart.marketDay.marketSchedule.location,
      startTime: cart.marketDay.startTime.toISOString(),
      endTime: cart.marketDay.endTime.toISOString(),
      description: cart.marketDay.marketSchedule.description,
      status: cart.marketDay.status,
      marketSchedule: {
        id: cart.marketDay.marketSchedule.id,
      },
    },
    items: cart.cartItems.map<ClientCartItem>((item) => ({
      variationId: item.marketDayProductVariationId,
      quantity: item.quantity,
      name: item.marketDayProductVariation.marketDayProduct.product.name,
      imageUrl:
        item.marketDayProductVariation.marketDayProduct.product.imageUrl,
      price: item.marketDayProductVariation.price,
      unit: item.marketDayProductVariation.productVariation.unit,
      vendor:
        item.marketDayProductVariation.marketDayProduct.product.vendorProfile,
      packaged: item.marketDayProductVariation.productVariation.packaged,
      size: item.marketDayProductVariation.productVariation.size,
    })),
  }

  return clientCart
}

export const upsertCartWithItems = async (
  userId: number,
  marketDayId: number,
  marketDayProductVariationIds: number[],
  quantities: number[]
): Promise<void> => {
  const cart = await db.cart.upsert({
    where: {
      userId_marketDayId: {
        userId,
        marketDayId,
      },
    },
    update: {},
    create: {
      userId,
      marketDayId,
    },
  })
  await db.cartItem.deleteMany({ where: { cartId: cart.id } })
  if (marketDayProductVariationIds.length > 0) {
    await db.cartItem.createMany({
      data: marketDayProductVariationIds.map(
        (marketDayProductVariationId, index) => ({
          cartId: cart.id,
          marketDayProductVariationId,
          quantity: quantities[index],
        })
      ),
    })
  }
}

export const deleteAllCarts = async (userId: number): Promise<void> => {
  await db.cart.deleteMany({ where: { userId } })
}

export const deleteCartItem = async (
  userId: number,
  marketDayId: number,
  marketDayProductVariationId: number
): Promise<void> => {
  const cart = await db.cart.findUnique({
    where: {
      userId_marketDayId: {
        userId,
        marketDayId,
      },
    },
  })
  if (!cart) return
  await db.cartItem.delete({
    where: {
      cartId_marketDayProductVariationId: {
        cartId: cart.id,
        marketDayProductVariationId,
      },
    },
  })
}

export const deleteAllCartItems = async (
  userId: number,
  marketDayId: number
): Promise<void> => {
  const cart = await db.cart.findUnique({
    where: {
      userId_marketDayId: {
        userId,
        marketDayId,
      },
    },
  })
  if (!cart) return
  await db.cartItem.deleteMany({ where: { cartId: cart.id } })
}
