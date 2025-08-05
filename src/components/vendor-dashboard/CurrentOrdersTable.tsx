import {
  Order,
  getOrderItemStatusDisplayName,
  getOrderItemStatusVariant,
} from '@/types/order'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CurrentOrdersTableProps {
  orders: Order[]
  loading: boolean
  onUpdateStatus: (order: Order) => void
}

export default function CurrentOrdersTable({
  orders,
  loading,
  onUpdateStatus,
}: CurrentOrdersTableProps) {
  const router = useRouter()

  const getOrderStatus = (order: Order) => {
    return order.orderItems[0].status
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
              <Badge variant={getOrderItemStatusVariant(getOrderStatus(order))}>
                {getOrderItemStatusDisplayName(getOrderStatus(order))}
              </Badge>
            </TableCell>
            <TableCell>${order.total.toFixed(2)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="hover:bg-muted flex h-8 w-8 items-center justify-center rounded p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem
                    onClick={() => router.push(`/vendor/orders/${order.id}`)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdateStatus(order)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Update Status
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <div>No current orders found.</div>
  )
}
