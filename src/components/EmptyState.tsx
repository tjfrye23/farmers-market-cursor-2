'use client'

import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

interface EmptyStateProps {
  onAddProduct: () => void
}

export default function EmptyState({ onAddProduct }: EmptyStateProps) {
  return (
    <div className="rounded-lg bg-gray-50 py-12 text-center">
      <h3 className="mb-2 text-lg font-medium text-gray-900">
        No products in queue
      </h3>
      <p className="mb-6 text-gray-500">
        Start adding products by clicking the &ldquo;Add Another Product&rdquo;
        button.
      </p>
      <Button onClick={onAddProduct}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Product
      </Button>
    </div>
  )
}
