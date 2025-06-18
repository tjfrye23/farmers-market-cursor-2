import { Order } from '@/types/order'
import PastOrdersTable from './PastOrdersTable'

interface OrderHistoryTabProps {
  pastOrders: Order[]
  loading: boolean
}

export default function OrderHistoryTab({
  pastOrders,
  loading,
}: OrderHistoryTabProps) {
  return (
    <>
      <section>
        <h2 className="mb-2 text-xl font-bold">Order History</h2>
        <PastOrdersTable orders={pastOrders} loading={loading} />
      </section>
    </>
  )
}
