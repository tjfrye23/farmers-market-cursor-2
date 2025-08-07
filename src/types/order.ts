import { OrderStatus, OrderItemStatus } from '@/generated/prisma/client'

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
