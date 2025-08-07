import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ClientOrder } from '@/types/order'
import { OrderStatus } from '@/generated/prisma/client'

interface OrderStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedOrder: ClientOrder | null
  selectedStatus: OrderStatus
  onStatusChange: (status: OrderStatus) => void
  onUpdate: () => void
  isUpdating: boolean
}

export default function OrderStatusDialog({
  open,
  onOpenChange,
  selectedOrder,
  selectedStatus,
  onStatusChange,
  onUpdate,
  isUpdating,
}: OrderStatusDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Change the status for order #{selectedOrder?.id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select
            className="w-full rounded border px-3 py-2"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
            disabled={isUpdating}
          >
            <option value={OrderStatus.PENDING}>Pending</option>
            <option value={OrderStatus.CONFIRMED}>Confirmed</option>
            <option value={OrderStatus.COMPLETED}>Completed</option>
            <option value={OrderStatus.CANCELLED}>Cancelled</option>
          </select>
        </div>
        <DialogFooter>
          <Button
            onClick={onUpdate}
            disabled={
              isUpdating ||
              !selectedOrder ||
              selectedStatus === selectedOrder.status
            }
          >
            {isUpdating ? 'Updating...' : 'Update Status'}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
