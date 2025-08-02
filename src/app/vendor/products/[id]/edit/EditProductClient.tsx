'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import ProductFormSection from '@/app/vendor/products/add/components/ProductFormSection'
import { ClientProduct, CreateProductSchema } from '@/types/product'
import { ProductFormData } from '@/data/product-data'
import { ProductCategory } from '@/generated/prisma/client'

interface EditProductClientProps {
  product: ClientProduct
  formData: ProductFormData
}

export default function EditProductClient({
  product,
  formData,
}: EditProductClientProps) {
  // Convert the product to CreateProductSchema format for the form
  const convertToCreateProductSchema = (): CreateProductSchema => {
    return {
      name: product.name,
      description: product.description || '',
      category: product.category as ProductCategory,
      imageUrl: product.imageUrl,
      organic: product.organic,
      local: product.local,
      variations: product.variations.map((variation) => ({
        name: variation.name,
        price: variation.price,
        size: variation.size,
        packaged: variation.packaged,
        unitId: variation.unit.id,
      })),
    }
  }

  const handleFormSuccess = (values: CreateProductSchema) => {
    // TODO: Implement the actual update logic
    console.log('Product updated:', values)
    // You would typically make an API call here to update the product
  }

  const handleFormCancel = () => {
    // Navigate back to product details
    window.location.href = `/vendor/products/${product.id}`
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <PageHeader title="Edit Product" />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href={`/vendor/products/${product.id}`}
              className="text-market-green hover:text-market-green-dark inline-flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Product
            </Link>
          </div>

          <div className="max-w-4xl">
            {/* Product Edit Form */}
            <ProductFormSection
              currentProduct={convertToCreateProductSchema()}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
              formData={formData}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
