import { Order } from '@/types/order'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

interface PastOrdersTableProps {
  orders: Order[]
  loading: boolean
}

export default function PastOrdersTable({
  orders,
  loading,
}: PastOrdersTableProps) {
  const getOrderStatus = (order: Order) => {
    if (!order.orderItems.length) return 'N/A'
    const firstStatus = order.orderItems[0].status
    return order.orderItems.every((i) => i.status === firstStatus)
      ? firstStatus
      : 'mixed'
  }
  return loading ? (
    <div>Loading orders...</div>
  ) : orders.length > 0 ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order #</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.orderNumber ?? order.id}</TableCell>
            <TableCell>
              {order.date ? new Date(order.date).toLocaleDateString() : ''}
            </TableCell>
            <TableCell>{order.user ? order.user.name : ''}</TableCell>
            <TableCell>
              <Badge
                variant={
                  getOrderStatus(order) === 'processed'
                    ? 'secondary'
                    : getOrderStatus(order) === 'processing'
                      ? 'default'
                      : getOrderStatus(order) === 'mixed'
                        ? 'outline'
                        : 'outline'
                }
              >
                {getOrderStatus(order).charAt(0).toUpperCase() +
                  getOrderStatus(order).slice(1)}
              </Badge>
            </TableCell>
            <TableCell>${order.total.toFixed(2)}</TableCell>
            <TableCell>
              {/* TODO: Add actions (view, update status) */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <div>No order history found.</div>
  )
}
