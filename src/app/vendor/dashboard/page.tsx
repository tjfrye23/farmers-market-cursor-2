import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import VendorDashboardClient from './vendorDashboardClient'
import { getVendorProducts } from '@/data/products'
import { getVendorOrders } from '@/data/orders'
import { getVendorMetrics } from '@/data/metrics'
import { getMarketSchedulesWithSubscriptionStatus } from '@/data/marketSchedules'
import { getVendor } from '@/data/vendors'
import { getVendorMarketDays } from '@/data/marketDays'
import { UserRole } from '@/generated/prisma/client'

export default async function VendorDashboardPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user || user.role !== UserRole.VENDOR || !user.vendorProfile?.id) {
    return <div>Please log in as a vendor to view the dashboard.</div>
  }

  const [vendor, products, orders, marketDays, marketSchedules] =
    await Promise.all([
      getVendor(user.vendorProfile.id),
      getVendorProducts(user.vendorProfile.id),
      getVendorOrders(user.vendorProfile.id),
      getVendorMarketDays(user.vendorProfile.id),
      getMarketSchedulesWithSubscriptionStatus(user.vendorProfile.id),
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
