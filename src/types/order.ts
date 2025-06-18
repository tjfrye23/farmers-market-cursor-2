// Order type migrated from the other project
export interface OrderItem {
  id: number
  productId: number
  quantity: number
  price: number
  status:
    | 'processing'
    | 'processed'
    | 'pending'
    | 'confirmed'
    | 'completed'
    | 'cancelled'
  product: {
    name: string
    imageUrl?: string
    vendorProfileId: number
  }
}

export interface Order {
  id: number
  orderNumber?: string
  date?: string
  user?: {
    name: string
    email: string
  }
  status: 'processing' | 'processed'
  orderItems: OrderItem[]
  total: number
  vendorOrderStatus:
    | 'processing'
    | 'processed'
    | 'pending'
    | 'confirmed'
    | 'completed'
    | 'cancelled'
  // Add other fields as needed
}
