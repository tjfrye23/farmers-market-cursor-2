'use client'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ClientMarketSchedule } from '@/types/marketSchedule'
import { useRouter } from 'next/navigation'
import {
  getStatusBadgeVariant,
  getStatusDisplayName,
} from '@/lib/marketScheduleUtils'

interface MarketSchedulesTableProps {
  marketSchedules: (ClientMarketSchedule & { isSubscribed?: boolean })[]
  loading?: boolean
}

export function MarketSchedulesTable({
  marketSchedules,
  loading,
}: MarketSchedulesTableProps) {
  const router = useRouter()

  if (loading) {
    return <div>Loading market schedules...</div>
  }

  if (marketSchedules.length === 0) {
    return <div>No market schedules found.</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Market Name</TableHead>
          <TableHead>Day</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Subscription</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {marketSchedules.map((ms) => (
          <TableRow
            key={ms.id}
            className="hover:bg-muted/50 cursor-pointer"
            onClick={() => router.push(`/vendor/schedule/${ms.id}`)}
          >
            <TableCell>{ms.name}</TableCell>
            <TableCell>
              {new Date(ms.startDate).toLocaleDateString('en-US', {
                weekday: 'long',
              })}
            </TableCell>
            <TableCell>
              {ms.startDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {' - '}
              {ms.endDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </TableCell>
            <TableCell>{ms.location}</TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(ms.status)}>
                {getStatusDisplayName(ms.status)}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={ms.isSubscribed ? 'default' : 'secondary'}
                className={
                  ms.isSubscribed
                    ? 'bg-green-100 text-green-800 hover:bg-green-100'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
                }
              >
                {ms.isSubscribed ? 'Subscribed' : 'Not Subscribed'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
