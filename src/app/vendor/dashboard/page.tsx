'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import {
  updateVendorOrderStatus,
  deleteVendorProduct,
} from '@/services/vendorService'
import { Order } from '@/types/order'
import { useVendorProducts } from '@/hooks/useVendorProducts'
import ProfileStatusBanner from '@/components/ProfileStatusBanner'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { MarketSchedulesTable } from '@/components/MarketSchedulesTable'
import Header from '@/components/vendor-dashboard/Header'
import Metrics from '@/components/vendor-dashboard/Metrics'
import OrdersTab from '@/components/vendor-dashboard/OrdersTab'
import ProductsTab from '@/components/vendor-dashboard/ProductsTab'
import MarketDaysTab from '@/components/vendor-dashboard/MarketDaysTab'
import OrderStatusDialog from '@/components/vendor-dashboard/OrderStatusDialog'
import { useVendorOrders } from '@/hooks/useVendorOrders'
import { useVendorMetrics } from '@/hooks/useVendorMetrics'
import { useMarketDays } from '@/hooks/useMarketDays'
import OrderHistoryTab from '@/components/vendor-dashboard/OrderHistoryTab'
import { UIProduct } from '@/types/product'

export default function VendorDashboardPage() {
  const { data: session, status } = useSession<true>({ required: true })

  const user = session?.user

  const {
    data: products = [],
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useVendorProducts()

  // Orders
  const {
    orders,
    loading: ordersLoading,
    refetch: refetchOrders,
  } = useVendorOrders()
  // Metrics
  const { metrics, loading: metricsLoading } = useVendorMetrics(user?.id)
  // Market Days
  const { data: marketDays = [], isLoading: marketDaysLoading } =
    useMarketDays()

  // Order status dialog state
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<
    'processing' | 'processed'
  >('processing')
  const [isUpdating, setIsUpdating] = useState(false)

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<UIProduct | null>(null)

  // Placeholder state for dialogs
  // TODO: Implement real state and handlers
  const resetProductForm = () => {
    setEditingProduct(null)
    setIsProductDialogOpen(false)
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

  // Handler to update status
  const handleStatusUpdate = async () => {
    if (!selectedOrder) return
    setIsUpdating(true)
    try {
      await updateVendorOrderStatus(selectedOrder.id, selectedStatus)
      await refetchOrders()
      setIsStatusDialogOpen(false)
      toast.success('Order status updated successfully!')
    } catch {
      toast.error('Failed to update order status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEditProduct = (product: UIProduct) => {
    setEditingProduct(product)
    setIsProductDialogOpen(true)
  }

  const handleAddNewProduct = () => {
    setEditingProduct(null)
    setIsProductDialogOpen(true)
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteVendorProduct(productId)
      await refetchProducts()
      toast.success('Product deleted')
    } catch {
      toast.error('Failed to delete product')
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center text-lg">
        Loading dashboard...
      </div>
    )
  }

  if (!session.user?.vendorProfile || !session.user.vendorProfile.id) {
    return (
      <div className="flex h-screen items-center justify-center text-lg">
        Please create a vendor profile to view the dashboard.
      </div>
    )
  }

  return (
    <main className="container mx-auto grow px-4 py-8">
      <Header userName={user?.name || user?.email || ''} />
      <ProfileStatusBanner userId={user.id} />
      {/* Metrics Section */}
      <Metrics
        metrics={metrics}
        loading={metricsLoading}
        currentOrdersCount={currentOrders.length}
      />
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
            <OrdersTab
              currentOrders={currentOrders}
              loading={ordersLoading}
              onUpdateStatus={handleUpdateStatus}
            />
          </TabsContent>
          <TabsContent value="history">
            <OrderHistoryTab pastOrders={pastOrders} loading={ordersLoading} />
          </TabsContent>
          <TabsContent value="products">
            <ProductsTab
              products={products}
              loading={productsLoading}
              onEdit={handleEditProduct}
              onAdd={handleAddNewProduct}
              onDelete={handleDeleteProduct}
              isDialogOpen={isProductDialogOpen}
              setDialogOpen={setIsProductDialogOpen}
              editingProduct={editingProduct}
              onResetForm={resetProductForm}
            />
          </TabsContent>
          <TabsContent value="market-days">
            <MarketDaysTab
              marketDays={marketDays}
              loading={marketDaysLoading}
            />
          </TabsContent>
          <TabsContent value="schedules">
            <MarketSchedulesTable />
          </TabsContent>
        </Tabs>
      </section>
      {/* Order Status Update Dialog */}
      <OrderStatusDialog
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        selectedOrder={selectedOrder}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onUpdate={handleStatusUpdate}
        isUpdating={isUpdating}
      />
    </main>
  )
}
