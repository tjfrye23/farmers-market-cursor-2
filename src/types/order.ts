import {
  OrderStatus as PrismaOrderStatus,
  OrderItemStatus as PrismaOrderItemStatus,
} from '@/generated/prisma'

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum OrderItemStatus {
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Helper function to convert Prisma enum to our enum
export function toOrderStatus(status: PrismaOrderStatus): OrderStatus {
  return status as OrderStatus
}

// Helper function to convert Prisma enum to our enum
export function toOrderItemStatus(
  status: PrismaOrderItemStatus
): OrderItemStatus {
  return status as OrderItemStatus
}

// Helper function to get display name for order status
export function getOrderStatusDisplayName(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return 'Pending'
    case OrderStatus.CONFIRMED:
      return 'Confirmed'
    case OrderStatus.COMPLETED:
      return 'Completed'
    case OrderStatus.CANCELLED:
      return 'Cancelled'
    case OrderStatus.REFUNDED:
      return 'Refunded'
    default:
      return status
  }
}

// Helper function to get display name for order item status
export function getOrderItemStatusDisplayName(status: OrderItemStatus): string {
  switch (status) {
    case OrderItemStatus.PROCESSING:
      return 'Processing'
    case OrderItemStatus.READY:
      return 'Ready'
    case OrderItemStatus.COMPLETED:
      return 'Completed'
    case OrderItemStatus.CANCELLED:
      return 'Cancelled'
    default:
      return status
  }
}

// Helper function to get badge variant for order status
export function getOrderStatusVariant(
  status: OrderStatus
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case OrderStatus.COMPLETED:
      return 'default'
    case OrderStatus.CONFIRMED:
      return 'secondary'
    case OrderStatus.PENDING:
      return 'outline'
    case OrderStatus.REFUNDED:
      return 'secondary'
    case OrderStatus.CANCELLED:
      return 'destructive'
    default:
      return 'outline'
  }
}

// Helper function to get badge variant for order item status
export function getOrderItemStatusVariant(
  status: OrderItemStatus
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case OrderItemStatus.COMPLETED:
      return 'default'
    case OrderItemStatus.READY:
      return 'secondary'
    case OrderItemStatus.PROCESSING:
      return 'outline'
    case OrderItemStatus.CANCELLED:
      return 'destructive'
    default:
      return 'outline'
  }
}

export interface ClientOrderItem {
  id: number
  quantity: number
  price: number
  unit: string
  status: OrderItemStatus
  name: string
  imageUrl: string
}

export interface ClientOrder {
  id: number
  date: string
  user: {
    name: string
    email: string
  }
  status: OrderStatus
  orderItems: ClientOrderItem[]
  total: number
  marketDay: {
    id: number
    name: string
    date: string
  }
}
