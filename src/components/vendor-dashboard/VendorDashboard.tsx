import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '../ui/chart'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import {
  MetricCard,
  MetricCardHeader,
  MetricCardTitle,
  MetricCardContent,
} from '../ui/metricCard'

const chartConfig: ChartConfig = {
  revenue: {
    label: 'Revenue',
    color: '#22c55e',
  },
}

{
  /* Metrics Cards */
}
;<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
  {/* ...metrics cards... */}
</div>

{
  /* Revenue Chart */
}
{
  metrics?.monthlyRevenue && metrics.monthlyRevenue.length > 0 && (
    <MetricCard className="mb-8">
      <MetricCardHeader>
        <MetricCardTitle className="text-left">Monthly Revenue</MetricCardTitle>
      </MetricCardHeader>
      <MetricCardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.monthlyRevenue}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </MetricCardContent>
    </MetricCard>
  )
}
