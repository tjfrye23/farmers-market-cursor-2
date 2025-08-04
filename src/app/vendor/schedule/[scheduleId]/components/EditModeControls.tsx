'use client'

import { Button } from '@/components/ui/button'
import { Save, X } from 'lucide-react'

interface EditModeControlsProps {
  isEditing: boolean
  onCancelEdit: () => void
  onSave: () => void
}

export function EditModeControls({
  isEditing,
  onCancelEdit,
  onSave,
}: EditModeControlsProps) {
  if (!isEditing) {
    return null
  }

  return (
    <div className="flex gap-2">
      <Button onClick={onCancelEdit} variant="outline" size="sm">
        <X className="mr-2 h-4 w-4" />
        Cancel
      </Button>
      <Button onClick={onSave} size="sm">
        <Save className="mr-2 h-4 w-4" />
        Save Changes
      </Button>
    </div>
  )
}
