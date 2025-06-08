import { Order } from '../types/order'

export async function getVendorOrders(): Promise<Order[]> {
  // TODO: Replace with real API call or logic
  return []
}

export async function getVendorMetrics() {
  // TODO: Replace with real API call or logic
  return {
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    monthlyRevenue: [],
  }
}

export async function updateVendorOrderStatus(
  orderId: string,
  status: 'processing' | 'processed'
): Promise<Order> {
  // The API expects a PUT to /api/orders/[id] with { status }
  const res = await fetch(`/api/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) {
    throw new Error('Failed to update order status')
  }
  return res.json()
}
