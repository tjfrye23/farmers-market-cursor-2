'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  getVendorMetrics,
  getVendorOrders,
  updateVendorOrderStatus,
} from '@/services/vendorService'
import { Order } from '@/types/order'
// import { useMarketSchedule } from "@/providers/MarketScheduleContext" // TODO: Re-add if needed
import { useVendorProducts } from '@/hooks/useVendorProducts'
import ProfileStatusBanner from '@/components/ProfileStatusBanner'
import ProductList from '@/components/product/ProductList'
import ProductDialog from '@/components/product/ProductDialog'
import {
  MetricCard,
  MetricCardHeader,
  MetricCardTitle,
  MetricCardContent,
} from '@/components/ui/metricCard'
import { DollarSign, Package, TrendingUp, Calendar } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, Edit } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// Define VendorMetrics type inline
interface VendorMetrics {
  totalRevenue: number
  totalOrders: number
  avgOrderValue: number
  monthlyRevenue: Array<{ month: string; revenue: number }>
}

export default function VendorDashboardPage() {
  // Auth context
  const { data: session, status } = useSession()
  const user = session?.user
  // Vendor products
  const { data: products = [], isLoading: productsLoading } = useVendorProducts(
    user?.id || ''
  )

  // Metrics state
  const [metrics, setMetrics] = useState<VendorMetrics | null>(null)
  const [metricsLoading, setMetricsLoading] = useState(true)
  // Orders state
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  // Order status dialog state
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<
    'processing' | 'processed'
  >('processing')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (user?.id) {
      setMetricsLoading(true)
      getVendorMetrics(user.id).then((data) => {
        setMetrics(data)
        setMetricsLoading(false)
      })
      setOrdersLoading(true)
      getVendorOrders(user.id).then((data) => {
        setOrders(data)
        setOrdersLoading(false)
      })
    }
  }, [user?.id])

  // Placeholder state for dialogs
  // TODO: Implement real state and handlers
  const isProductDialogOpen = false
  const editingProduct = null
  const resetProductForm = () => {}

  if (status === 'loading') {
    return <div>Loading...</div>
  }
  if (!user || user.role !== 'vendor') {
    // TODO: Ensure session.user.role is set by next-auth callbacks
    return <div>Please log in as a vendor to view the dashboard.</div>
  }

  // Split orders into current and past
  const currentOrders = orders.filter((order) => order.status === 'processing')
  const pastOrders = orders.filter((order) => order.status === 'processed')

  // Handler to open dialog
  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order)
    setSelectedStatus(order.status)
    setIsStatusDialogOpen(true)
  }

  // Handler to update status (TODO: replace with API call)
  const handleStatusUpdate = async () => {
    if (!selectedOrder) return
    setIsUpdating(true)
    try {
      const updatedOrder = await updateVendorOrderStatus(
        selectedOrder.id,
        selectedStatus
      )
      setOrders((prev) =>
        prev.map((o) =>
          o.id === updatedOrder.id ? { ...o, status: updatedOrder.status } : o
        )
      )
      setIsStatusDialogOpen(false)
      toast.success('Order status updated successfully!')
    } catch {
      toast.error('Failed to update order status')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <main className="container mx-auto flex-grow px-4 py-8">
      <h1>Vendor Dashboard (Migration in Progress)</h1>
      <ProfileStatusBanner userId={user.id} />
      {/* Metrics Section */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Metrics</h2>
        {metricsLoading ? (
          <div>Loading metrics...</div>
        ) : metrics ? (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
              <MetricCard>
                <MetricCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <MetricCardTitle className="text-left text-sm font-medium">
                    Total Revenue
                  </MetricCardTitle>
                  <DollarSign className="text-muted-foreground h-4 w-4" />
                </MetricCardHeader>
                <MetricCardContent>
                  <div className="text-left text-2xl font-bold">
                    ${metrics.totalRevenue.toFixed(2) || '0.00'}
                  </div>
                </MetricCardContent>
              </MetricCard>
              <MetricCard>
                <MetricCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <MetricCardTitle className="text-left text-sm font-medium">
                    Total Orders
                  </MetricCardTitle>
                  <Package className="text-muted-foreground h-4 w-4" />
                </MetricCardHeader>
                <MetricCardContent>
                  <div className="text-left text-2xl font-bold">
                    {metrics.totalOrders || 0}
                  </div>
                </MetricCardContent>
              </MetricCard>
              <MetricCard>
                <MetricCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <MetricCardTitle className="text-left text-sm font-medium">
                    Avg Order Value
                  </MetricCardTitle>
                  <TrendingUp className="text-muted-foreground h-4 w-4" />
                </MetricCardHeader>
                <MetricCardContent>
                  <div className="text-left text-2xl font-bold">
                    ${metrics.avgOrderValue.toFixed(2) || '0.00'}
                  </div>
                </MetricCardContent>
              </MetricCard>
              <MetricCard>
                <MetricCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <MetricCardTitle className="text-left text-sm font-medium">
                    Active Orders
                  </MetricCardTitle>
                  <Calendar className="text-muted-foreground h-4 w-4" />
                </MetricCardHeader>
                <MetricCardContent>
                  <div className="text-left text-2xl font-bold">
                    {currentOrders.length}
                  </div>
                </MetricCardContent>
              </MetricCard>
            </div>
            {/* Monthly Revenue Chart */}
            {metrics.monthlyRevenue && metrics.monthlyRevenue.length > 0 && (
              <MetricCard>
                <MetricCardHeader>
                  <MetricCardTitle className="text-left">
                    Monthly Revenue
                  </MetricCardTitle>
                </MetricCardHeader>
                <MetricCardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={metrics.monthlyRevenue}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </MetricCardContent>
              </MetricCard>
            )}
          </>
        ) : (
          <div>No metrics available.</div>
        )}
      </section>
      {/* Tabbed Interface Section */}
      <section>
        <Tabs defaultValue="current" className="space-y-4">
          <TabsList>
            <TabsTrigger value="current">
              Current Orders ({currentOrders.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              Order History ({pastOrders.length})
            </TabsTrigger>
            <TabsTrigger value="products">
              Manage Products ({products.length})
            </TabsTrigger>
            <TabsTrigger value="market-days">Market Days</TabsTrigger>
            <TabsTrigger value="schedules">Market Schedules</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            {ordersLoading ? (
              <div>Loading orders...</div>
            ) : currentOrders.length > 0 ? (
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
                  {currentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>
                        {new Date(order.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {order.customerInfo.firstName}{' '}
                        {order.customerInfo.lastName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === 'processed'
                              ? 'secondary'
                              : order.status === 'processing'
                                ? 'default'
                                : 'outline'
                          }
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="hover:bg-muted flex h-8 w-8 items-center justify-center rounded p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuItem
                              onClick={() => {
                                /* TODO: View Details handler */
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUpdateStatus(order)}
                            >
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
            )}
          </TabsContent>
          <TabsContent value="history">
            {ordersLoading ? (
              <div>Loading orders...</div>
            ) : pastOrders.length > 0 ? (
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
                  {pastOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>
                        {new Date(order.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {order.customerInfo.firstName}{' '}
                        {order.customerInfo.lastName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === 'processed'
                              ? 'secondary'
                              : order.status === 'processing'
                                ? 'default'
                                : 'outline'
                          }
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
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
            )}
          </TabsContent>
          <TabsContent value="products">
            <ProductList
              products={products}
              onEdit={() => {}}
              isLoading={productsLoading}
            />
            <ProductDialog
              isOpen={isProductDialogOpen}
              onOpenChange={() => {}}
              editingProduct={editingProduct}
              onResetForm={resetProductForm}
            />
          </TabsContent>
          <TabsContent value="market-days">
            <div>Market Days (Coming soon)</div>
          </TabsContent>
          <TabsContent value="schedules">
            <div>Market Schedules (Coming soon)</div>
          </TabsContent>
        </Tabs>
      </section>
      {/* Order Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status for order #{selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              className="w-full rounded border px-3 py-2"
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as 'processing' | 'processed')
              }
              disabled={isUpdating}
            >
              <option value="processing">Processing</option>
              <option value="processed">Processed</option>
            </select>
          </div>
          <DialogFooter>
            <Button
              onClick={handleStatusUpdate}
              disabled={
                isUpdating ||
                !selectedOrder ||
                selectedStatus === selectedOrder.status
              }
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
