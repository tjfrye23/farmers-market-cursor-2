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
import { MarketSchedule } from '@/types/marketSchedule'
import { useRouter } from 'next/navigation'
import {
  getStatusBadgeVariant,
  getStatusDisplayName,
} from '@/lib/marketScheduleUtils'

interface MarketSchedulesTableProps {
  marketSchedules: MarketSchedule[]
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
