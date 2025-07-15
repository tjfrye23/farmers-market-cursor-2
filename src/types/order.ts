export interface OrderItem {
  id: number
  quantity: number
  price: number
  unit: string
  status: string
  name: string
  imageUrl: string
}

export interface Order {
  id: number
  date: string
  user: {
    name: string
    email: string
  }
  status: string
  orderItems: OrderItem[]
  total: number
  marketDay: {
    id: number
    name: string
    date: string
  }
}
