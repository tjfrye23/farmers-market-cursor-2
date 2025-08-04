'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Edit, Trash2 } from 'lucide-react'
import { MarketSchedule } from '@/types/marketSchedule'
import { Session } from 'next-auth'

interface AdminControlsProps {
  schedule: MarketSchedule
  user: Session['user']
  isEditing: boolean
  onEdit: () => void
  onDelete: () => void
}

export function AdminControls({
  schedule,
  user,
  isEditing,
  onEdit,
  onDelete,
}: AdminControlsProps) {
  const isAdmin = user?.role === 'admin'

  if (!isAdmin || isEditing) {
    return null
  }

  return (
    <>
      <Button onClick={onEdit} variant="outline">
        <Edit className="mr-2 h-4 w-4" />
        Edit Schedule
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Schedule
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Market Schedule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{schedule.name}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {}}>
              Cancel
            </Button>
            <Button
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
