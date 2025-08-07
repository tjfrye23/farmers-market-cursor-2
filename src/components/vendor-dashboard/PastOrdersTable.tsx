import { ClientOrder, ClientOrderItem } from '@/types/order'
import { OrderItemStatus } from '@/generated/prisma/client'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { useRouter } from 'next/navigation'

interface PastOrdersTableProps {
  orders: ClientOrder[]
  loading: boolean
}

export default function PastOrdersTable({
  orders,
  loading,
}: PastOrdersTableProps) {
  const router = useRouter()

  const getOrderStatus = (order: ClientOrder) => {
    if (!order.orderItems.length) return 'N/A'
    const firstStatus = order.orderItems[0].status
    return order.orderItems.every(
      (i: ClientOrderItem) => i.status === firstStatus
    )
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
          <TableRow
            key={order.id}
            className="hover:bg-muted/50 cursor-pointer"
            onClick={() => router.push(`/vendor/orders/${order.id}`)}
          >
            <TableCell>{order.id}</TableCell>
            <TableCell>
              {order.date ? new Date(order.date).toLocaleDateString() : ''}
            </TableCell>
            <TableCell>{order.user ? order.user.name : ''}</TableCell>
            <TableCell>
              <Badge
                variant={
                  getOrderStatus(order) === OrderItemStatus.COMPLETED
                    ? 'secondary'
                    : getOrderStatus(order) === OrderItemStatus.PROCESSING
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
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/vendor/orders/${order.id}`)
                }}
              >
                View Details
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <div>No order history found.</div>
  )
}
