import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import VendorDashboardClient from './vendorDashboardClient'
import { getMarketDays } from '@/data/marketDays'
import { getVendorProducts } from '@/data/products'
import { getVendorOrders } from '@/data/orders'
import { getVendorMetrics } from '@/data/metrics'
import { getMarketSchedules } from '@/data/marketSchedules'
import { getVendor } from '@/data/vendors'

export default async function VendorDashboardPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user || user.role !== 'vendor' || !user.vendorProfile?.id) {
    return <div>Please log in as a vendor to view the dashboard.</div>
  }

  const [vendor, products, orders, marketDays, marketSchedules] =
    await Promise.all([
      getVendor(user.vendorProfile.id),
      getVendorProducts(user.vendorProfile.id),
      getVendorOrders(user.vendorProfile.id),
      getMarketDays(),
      getMarketSchedules(),
    ])

  const metrics = getVendorMetrics(orders)

  if (!vendor) {
    return <div>Please log in as a vendor to view the dashboard.</div>
  }

  return (
    <VendorDashboardClient
      user={user}
      vendorProfile={vendor}
      products={products}
      orders={orders}
      metrics={metrics}
      marketDays={marketDays}
      marketSchedules={marketSchedules}
    />
  )
}
