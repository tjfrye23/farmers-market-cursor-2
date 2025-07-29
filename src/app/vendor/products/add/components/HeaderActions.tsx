'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, PlusCircle } from 'lucide-react'

interface HeaderActionsProps {
  onBack: () => void
  onAddAnother: () => void
  showForm: boolean
}

export default function HeaderActions({
  onBack,
  onAddAnother,
  showForm,
}: HeaderActionsProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Button
        variant="outline"
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onAddAnother}
          className="flex items-center gap-2"
          disabled={showForm}
        >
          <PlusCircle className="h-4 w-4" />
          Add Another Product
        </Button>
      </div>
    </div>
  )
}
