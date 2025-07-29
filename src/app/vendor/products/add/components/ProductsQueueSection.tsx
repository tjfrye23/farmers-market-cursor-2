'use client'

import { CreateProductSchema } from '@/types/product'
import ProductsQueueTable from '@/components/ProductsQueueTable'
import SubmitButton from '@/components/SubmitButton'

interface ProductsQueueSectionProps {
  products: CreateProductSchema[]
  onEditProduct: (index: number) => void
  onRemoveProduct: (index: number) => void
  isSubmitting: boolean
  formAction: (formData: FormData) => Promise<void>
}

export default function ProductsQueueSection({
  products,
  onEditProduct,
  onRemoveProduct,
  isSubmitting,
  formAction,
}: ProductsQueueSectionProps) {
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">
        Products Queue ({products.length})
      </h2>

      {/* Form for submitting products */}
      <form action={formAction} className="mb-6">
        <input type="hidden" name="products" value={JSON.stringify(products)} />
        <SubmitButton disabled={products.length === 0} />
      </form>

      <ProductsQueueTable
        products={products}
        onEditProduct={onEditProduct}
        onRemoveProduct={onRemoveProduct}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
