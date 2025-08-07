'use client'

import { useRouter } from 'next/navigation'
import Header from '@/components/vendor-dashboard/Header'
import ProfileStatusBanner from '@/components/ProfileStatusBanner'
import Metrics from '@/components/vendor-dashboard/Metrics'
import OrdersTab from '@/components/vendor-dashboard/OrdersTab'
import OrderHistoryTab from '@/components/vendor-dashboard/OrderHistoryTab'
import ProductsTab from '@/components/vendor-dashboard/ProductsTab'
import MarketDaysTab from '@/components/vendor-dashboard/MarketDaysTab'
import OrderStatusDialog from '@/components/vendor-dashboard/OrderStatusDialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { MarketSchedulesTable } from '@/components/MarketSchedulesTable'
import { ClientProduct } from '@/types/product'
import { ClientOrder } from '@/types/order'
import { OrderStatus } from '@/generated/prisma/client'
import { MarketSchedule } from '@/types/marketSchedule'
import { Session } from 'next-auth'
import { ClientVendor } from '@/types/vendors'
import { ClientMarketDay } from '@/types/marketDay'

interface Metrics {
  totalRevenue: number
  totalOrders: number
  avgOrderValue: number
  monthlyRevenue: Array<{ month: string; revenue: number }>
}

interface VendorDashboardClientProps {
  user: Session['user']
  vendorProfile: ClientVendor
  products: ClientProduct[]
  orders: ClientOrder[]
  metrics: Metrics
  marketDays: ClientMarketDay[]
  marketSchedules: (MarketSchedule & { isSubscribed: boolean })[]
}

export default function VendorDashboardClient({
  user,
  vendorProfile,
  products,
  orders,
  metrics,
  marketDays,
  marketSchedules,
}: VendorDashboardClientProps) {
  const router = useRouter()

  // Placeholder state and handlers for demonstration
  const metricsLoading = false
  const ordersLoading = false
  const productsLoading = false
  const marketDaysLoading = false
  const currentOrders = orders.filter((o) => o.status === OrderStatus.PENDING)
  const pastOrders = orders.filter((o) => o.status !== OrderStatus.PENDING)
  const isProductDialogOpen = false
  const setIsProductDialogOpen = () => {}
  const editingProduct = null
  const resetProductForm = () => {}
  const handleEditProduct = () => {}
  const handleAddNewProduct = () => {
    router.push('/vendor/products/add')
  }
  const handleDeleteProduct = () => {}
  const handleUpdateStatus = () => {}
  const isStatusDialogOpen = false
  const setIsStatusDialogOpen = () => {}
  const selectedOrder = null
  const selectedStatus: OrderStatus = OrderStatus.PENDING
  const setSelectedStatus = () => {}
  const handleStatusUpdate = () => {}
  const isUpdating = false

  return (
    <main className="container mx-auto grow px-4 py-8">
      <Header userName={user?.name || user?.email || ''} />
      <ProfileStatusBanner vendorProfile={vendorProfile} />
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
            <MarketSchedulesTable marketSchedules={marketSchedules} />
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
