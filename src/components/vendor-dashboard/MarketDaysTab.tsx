import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { MarketDay } from '@/types/marketDay'
import { useRouter } from 'next/navigation'

interface MarketDaysTabProps {
  marketDays: MarketDay[]
  loading: boolean
}

export default function MarketDaysTab({
  marketDays,
  loading,
}: MarketDaysTabProps) {
  const router = useRouter()

  if (loading) return <div>Loading market days...</div>
  if (marketDays.length === 0)
    return <div>No subscribed market days found.</div>

  const handleRowClick = (marketDayId: number) => {
    router.push(`/vendor/marketDay/${marketDayId}`)
  }

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
          <TableRow
            key={md.id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => handleRowClick(md.id)}
          >
            <TableCell>{md.location}</TableCell>
            <TableCell>{new Date(md.startTime).toLocaleDateString()}</TableCell>
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
