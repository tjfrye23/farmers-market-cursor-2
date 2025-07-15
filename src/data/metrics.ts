/**
 * Calculate vendor metrics based on orders.
 * (You may want to move this logic to the DB for performance if needed.)
 */
export function getVendorMetrics(orders: Array<{ total?: number }>) {
  return {
    totalRevenue: 0, // TODO: Calculate real revenue
    totalOrders: orders.length,
    avgOrderValue: orders.length
      ? orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length
      : 0,
    monthlyRevenue: [],
  }
}
