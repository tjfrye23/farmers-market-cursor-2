import ProductList from '@/components/product/ProductList'
import ProductDialog from '@/components/product/ProductDialog'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

interface ProductsTabProps {
  products: any[]
  loading: boolean
  onEdit: (product: any) => void
  onAdd: () => void
  onDelete: (productId: number) => void
  isDialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  editingProduct: any
  onResetForm: () => void
}

export default function ProductsTab({
  products,
  loading,
  onEdit,
  onAdd,
  onDelete,
  isDialogOpen,
  setDialogOpen,
  editingProduct,
  onResetForm,
}: ProductsTabProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Products</h2>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add New Product
        </Button>
      </div>
      <ProductList
        products={products}
        onEdit={onEdit}
        isLoading={loading}
        onDelete={onDelete}
      />
      <ProductDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        editingProduct={editingProduct}
        onResetForm={onResetForm}
      />
    </div>
  )
}
