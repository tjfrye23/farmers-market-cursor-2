import { z } from 'zod'
import { OrderStatus, OrderItemStatus } from '@/generated/prisma/client'

export const createOrderSchema = z.object({
  userId: z.number().int().positive(),
  marketDayId: z.number().int().positive().optional(),
  orderItems: z.array(
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    })
  ),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
  total: z.number().positive(),
})

export const updateOrderSchema = createOrderSchema.partial()

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>

// POST body schema for status update
export const updateOrderStatusSchema = z.object({
  orderId: z.number().int().positive(),
  status: z.nativeEnum(OrderItemStatus),
})

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
