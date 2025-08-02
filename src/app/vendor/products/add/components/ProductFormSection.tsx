'use client'

import ProductForm from '@/components/product/ProductForm'
import { CreateProductSchema } from '@/types/product'
import { ProductFormData } from '@/data/product-data'

interface ProductFormSectionProps {
  currentProduct: CreateProductSchema | null
  onSuccess: (values: CreateProductSchema) => void
  onCancel: () => void
  formData: ProductFormData
}

export default function ProductFormSection({
  currentProduct,
  onSuccess,
  onCancel,
  formData,
}: ProductFormSectionProps) {
  const isEditing = !!currentProduct

  return (
    <div className="mb-8 overflow-hidden rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h2>
      <div className="overflow-visible">
        <ProductForm
          editingProduct={null}
          initialValues={currentProduct || undefined}
          onSuccess={onSuccess}
          onCancel={onCancel}
          submitButtonText={isEditing ? 'Save Changes' : 'Add to Queue'}
          formData={formData}
        />
      </div>
    </div>
  )
}
