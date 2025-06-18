import {
  MetricCard,
  MetricCardHeader,
  MetricCardTitle,
  MetricCardContent,
} from '@/components/ui/metricCard'
import { DollarSign, Package, TrendingUp, Calendar } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart'

interface MetricsProps {
  metrics: {
    totalRevenue: number
    totalOrders: number
    avgOrderValue: number
    monthlyRevenue: Array<{ month: string; revenue: number }>
  } | null
  loading: boolean
  currentOrdersCount: number
}

export default function Metrics({
  metrics,
  loading,
  currentOrdersCount,
}: MetricsProps) {
  if (loading) return <div>Loading metrics...</div>
  // Mock data for development/demo
  const mockMonthlyRevenue = [
    { month: 'Jan', revenue: 1200 },
    { month: 'Feb', revenue: 2100 },
    { month: 'Mar', revenue: 800 },
    { month: 'Apr', revenue: 1600 },
    { month: 'May', revenue: 2400 },
    { month: 'Jun', revenue: 1800 },
    { month: 'Jul', revenue: 2000 },
    { month: 'Aug', revenue: 2200 },
    { month: 'Sep', revenue: 1700 },
    { month: 'Oct', revenue: 2500 },
    { month: 'Nov', revenue: 1900 },
    { month: 'Dec', revenue: 2300 },
  ]
  const fallbackMetrics = {
    totalRevenue: 22000,
    totalOrders: 120,
    avgOrderValue: 183.33,
    monthlyRevenue: mockMonthlyRevenue,
  }
  const safeMetrics =
    metrics && metrics.monthlyRevenue && metrics.monthlyRevenue.length > 0
      ? metrics
      : fallbackMetrics

  const chartConfig: ChartConfig = {
    revenue: {
      label: 'Revenue',
      color: '#22c55e',
    },
  }

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-2xl font-bold">Metrics</h2>
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
              $
              {safeMetrics.totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || '0.00'}
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
              {safeMetrics.totalOrders || 0}
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
              $
              {safeMetrics.avgOrderValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || '0.00'}
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
              {currentOrdersCount}
            </div>
          </MetricCardContent>
        </MetricCard>
      </div>
      {safeMetrics.monthlyRevenue && safeMetrics.monthlyRevenue.length > 0 && (
        <MetricCard>
          <MetricCardHeader>
            <MetricCardTitle className="text-left">
              Monthly Revenue
            </MetricCardTitle>
          </MetricCardHeader>
          <MetricCardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={safeMetrics.monthlyRevenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </MetricCardContent>
        </MetricCard>
      )}
    </section>
  )
}
