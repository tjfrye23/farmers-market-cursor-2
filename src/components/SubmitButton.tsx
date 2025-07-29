'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

interface SubmitButtonProps {
  disabled: boolean
}

export default function SubmitButton({ disabled }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="flex items-center gap-2"
      disabled={disabled || pending}
    >
      <Save className="h-4 w-4" />
      {pending ? 'Saving...' : 'Save All Products'}
    </Button>
  )
}
