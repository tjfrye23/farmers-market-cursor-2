import { ClientOrder } from '@/types/order'
import CurrentOrdersTable from './CurrentOrdersTable'

interface OrdersTabProps {
  currentOrders: ClientOrder[]
  loading: boolean
  onUpdateStatus: (order: ClientOrder) => void
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
