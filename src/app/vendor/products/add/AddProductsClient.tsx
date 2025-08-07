'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import PageHeader from '@/components/PageHeader'
import { ProductFormData } from '@/data/product-data'
import { addProducts } from './actions'
import HeaderActions from './components/HeaderActions'
import ProductFormSection from './components/ProductFormSection'
import EmptyState from '@/components/EmptyState'
import ProductsQueueSection from './components/ProductsQueueSection'
import { CreateProductSchema } from '@/types/product'

interface AddProductsClientProps {
  formData: ProductFormData
}

export default function AddProductsClient({
  formData,
}: AddProductsClientProps) {
  const router = useRouter()
  const [products, setProducts] = useState<CreateProductSchema[]>([])
  const [currentProduct, setCurrentProduct] =
    useState<CreateProductSchema | null>(null)
  const [showForm, setShowForm] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleProductSubmit = (values: CreateProductSchema) => {
    setProducts([...products, values])
    setCurrentProduct(null)
    setShowForm(false)
    toast.success(`"${values.name}" added to queue`)
  }

  const handleAddAnother = () => {
    setShowForm(true)
    setCurrentProduct(null)
  }

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...products]
    updatedProducts.splice(index, 1)
    setProducts(updatedProducts)
  }

  const handleEditProduct = (index: number) => {
    setCurrentProduct(products[index])
    setShowForm(true)
    // Remove the product from the queue so it can be edited and re-added
    const updatedProducts = [...products]
    updatedProducts.splice(index, 1)
    setProducts(updatedProducts)
  }

  const handleFormAction = async (formData: FormData) => {
    setIsSubmitting(true)

    try {
      const result = await addProducts(
        { success: false, message: '' },
        formData
      )

      if (result.success) {
        toast.success(`${result.count} products successfully added`)
        router.push('/vendor/dashboard')
      } else if (!result.success && result.message) {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error saving products:', error)
      toast.error('Failed to save products')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <PageHeader
          title="Add New Products"
          description="Add products to your shop"
          image="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        />

        <div className="container mx-auto px-4 py-8">
          <HeaderActions
            onBack={() => router.push('/vendor/dashboard')}
            onAddAnother={handleAddAnother}
            showForm={showForm}
          />

          {showForm ? (
            <ProductFormSection
              currentProduct={currentProduct}
              onSuccess={handleProductSubmit}
              onCancel={() => {
                setShowForm(false)
                setCurrentProduct(null)
              }}
              formData={formData}
            />
          ) : products.length === 0 ? (
            <EmptyState onAddProduct={handleAddAnother} />
          ) : (
            <ProductsQueueSection
              products={products}
              onEditProduct={handleEditProduct}
              onRemoveProduct={handleRemoveProduct}
              isSubmitting={isSubmitting}
              formAction={handleFormAction}
            />
          )}
        </div>
      </main>
    </div>
  )
}
