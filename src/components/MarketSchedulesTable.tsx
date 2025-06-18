import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMarketSchedules } from '@/hooks/useMarketSchedules'

export function MarketSchedulesTable() {
  const { marketSchedules, loading } = useMarketSchedules()

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
          <TableRow key={ms.id}>
            <TableCell>{ms.name}</TableCell>
            <TableCell>{ms.dayOfWeek}</TableCell>
            <TableCell>
              {ms.startTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {' - '}
              {ms.endTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </TableCell>
            <TableCell>{ms.location}</TableCell>
            <TableCell>
              <Badge variant={ms.status === 'active' ? 'default' : 'secondary'}>
                {ms.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
