import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { MarketDay } from '@/types/marketDay'

interface MarketDaysTabProps {
  marketDays: MarketDay[]
  loading: boolean
}

export default function MarketDaysTab({
  marketDays,
  loading,
}: MarketDaysTabProps) {
  if (loading) return <div>Loading market days...</div>
  if (marketDays.length === 0) return <div>No upcoming market days found.</div>
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Market Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Market Hours</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {marketDays.map((md) => (
          <TableRow key={md.id}>
            <TableCell>{md.location}</TableCell>
            <TableCell>{new Date(md.date).toLocaleDateString()}</TableCell>
            <TableCell>
              {new Date(md.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              -{' '}
              {new Date(md.endTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </TableCell>
            <TableCell>{md.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
