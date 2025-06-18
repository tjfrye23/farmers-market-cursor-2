import { Order } from '@/types/order'
import CurrentOrdersTable from './CurrentOrdersTable'

interface OrdersTabProps {
  currentOrders: Order[]
  loading: boolean
  onUpdateStatus: (order: Order) => void
}

export default function OrdersTab({
  currentOrders,
  loading,
  onUpdateStatus,
}: OrdersTabProps) {
  return (
    <>
      <section className="mb-8">
        <h2 className="mb-2 text-xl font-bold">Current Orders</h2>
        <CurrentOrdersTable
          orders={currentOrders}
          loading={loading}
          onUpdateStatus={onUpdateStatus}
        />
      </section>
    </>
  )
}
