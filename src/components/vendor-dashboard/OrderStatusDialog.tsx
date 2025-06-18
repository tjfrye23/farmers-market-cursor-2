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
import { Order } from '@/types/order'

interface OrderStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedOrder: Order | null
  selectedStatus: 'processing' | 'processed'
  onStatusChange: (status: 'processing' | 'processed') => void
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
            Change the status for order #{selectedOrder?.orderNumber}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select
            className="w-full rounded border px-3 py-2"
            value={selectedStatus}
            onChange={(e) =>
              onStatusChange(e.target.value as 'processing' | 'processed')
            }
            disabled={isUpdating}
          >
            <option value="processing">Processing</option>
            <option value="processed">Processed</option>
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
