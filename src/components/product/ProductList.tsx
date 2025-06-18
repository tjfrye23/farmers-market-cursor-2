import React from 'react'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
// TODO: Migrate any missing dependencies

export type Product = {
  id: number
  name: string
  description?: string
  price: number
  stock: number
  category?: string
  imageUrl?: string
  vendorProfileId: number
  createdAt?: string
  updatedAt?: string
  unit?: string
  organic?: boolean
  local?: boolean
}

interface ProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  isLoading: boolean
  onDelete?: (productId: number) => void // Optional, can be a TODO
}

export default function ProductList({ products, onEdit, isLoading, onDelete }: ProductListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">Loading your products...</div>
    )
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No products yet
        </h3>
        <p className="text-gray-500 mb-6">
          Start adding your products to the marketplace by clicking the button above.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Features</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              className="cursor-pointer hover:bg-muted/50"
            >
              <TableCell className="flex items-center">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-10 w-10 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                )}
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    <Link href={`/products/${product.id}`}>{product.name}</Link>
                  </div>
                  {product.unit && (
                    <div className="text-sm text-gray-500">{product.unit}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                ${parseFloat(product.price.toString()).toFixed(2)}
              </TableCell>
              <TableCell>
                {/* Replace with category label if you have a categories constant */}
                {product.category}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {product.organic && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Organic
                    </span>
                  )}
                  {product.local && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Local
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-indigo-600 hover:text-indigo-900"
                  onClick={() => onEdit(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-900"
                  onClick={() => onDelete ? onDelete(product.id) : alert('Delete not implemented')}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
