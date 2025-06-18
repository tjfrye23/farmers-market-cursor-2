import { useState, useEffect, useCallback } from 'react'
import { getVendorOrders } from '@/services/vendorService'
import { Order } from '@/types/order'

export function useVendorOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getVendorOrders()
      const orders = data.map((order) => {
        return {
          ...order,
          vendorOrderStatus: getVendorOrderStatus(order),
        }
      })
      setOrders(orders)
    } catch (e) {
      setError('Failed to fetch orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return { orders, loading, error, refetch: fetchOrders }
}

const getVendorOrderStatus = (order: Order): Order['vendorOrderStatus'] => {
  return order.orderItems.some((item) => item.status === 'processing')
    ? 'processing'
    : 'processed'
}
