'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, ArrowRight, Mail, Phone, Save } from 'lucide-react'
import { ClientOrder, ClientOrderItem } from '@/types/order'
import { OrderStatus } from '@/generated/prisma/client'
import { Session } from 'next-auth'
import { orderService } from '@/services/orderService'
import { toast } from 'sonner'

interface VendorOrderDetailClientProps {
  order: ClientOrder
  hasNextOrder: boolean
  nextOrderId?: number
  user: Session['user']
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function VendorOrderDetailClient({
  order: initialOrder,
  hasNextOrder,
  nextOrderId,
}: VendorOrderDetailClientProps) {
  const router = useRouter()
  const [order, setOrder] = useState<ClientOrder>(initialOrder)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    initialOrder.status
  )
  const [isUpdating, setIsUpdating] = useState(false)

  // Sync selected status only on initial load
  useEffect(() => {
    setSelectedStatus(initialOrder.status)
  }, [initialOrder.status])

  const handleContactCustomer = () => {
    window.open(`mailto:${order.user.email}`, '_blank')
  }

  const handleCallCustomer = () => {
    // This would typically open a phone dialer or initiate a call
    console.log('Calling customer...')
  }

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status) return

    const previousOrder = order
    const previousStatus = order.status

    // Optimistic update - immediately update the UI
    const updatedOrder = {
      ...order,
      status: selectedStatus,
      orderItems: order.orderItems, // Don't change order item statuses
    }

    setOrder(updatedOrder)
    setIsUpdating(true)

    try {
      await orderService.updateOrderStatus({
        orderId: order.id,
        status: selectedStatus,
      })

      toast.success('Order status updated successfully')
    } catch (error) {
      console.error('Error updating order status:', error)

      // Revert optimistic update on error
      setOrder(previousOrder)
      setSelectedStatus(previousStatus)

      toast.error('Failed to update order status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleNextOrder = () => {
    if (!nextOrderId) return
    router.push(`/vendor/orders/${nextOrderId}`)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/vendor/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={handleNextOrder}
            disabled={!hasNextOrder}
            className={!hasNextOrder ? 'cursor-not-allowed opacity-50' : ''}
          >
            Next Order
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Order Details - #{order.id}
        </h1>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Order Status and Date */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium">
                  {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  {isUpdating && (
                    <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-current opacity-75"></span>
                  )}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Update Section */}
        <Card>
          <CardHeader>
            <CardTitle>Update Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Select
                  value={selectedStatus}
                  onValueChange={(value: OrderStatus) =>
                    setSelectedStatus(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleStatusUpdate}
                disabled={isUpdating || selectedStatus === order.status}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isUpdating ? 'Saving...' : 'Update Status'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Customer Information</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCallCustomer}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleContactCustomer}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{order.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{order.user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.orderItems.map((item: ClientOrderItem, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Total */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
