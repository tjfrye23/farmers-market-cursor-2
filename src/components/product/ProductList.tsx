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
import { ClientProduct } from '@/types/product'
import Image from 'next/image'
// TODO: Migrate any missing dependencies

interface ProductListProps {
  products: ClientProduct[]
  onEdit: (product: ClientProduct) => void
  isLoading: boolean
  onDelete?: (productId: number) => void // Optional, can be a TODO
}

export default function ProductList({
  products,
  onEdit,
  isLoading,
  onDelete,
}: ProductListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">Loading your products...</div>
    )
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 py-12 text-center">
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No products yet
        </h3>
        <p className="mb-6 text-gray-500">
          Start adding your products to the marketplace by clicking the button
          above.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
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
              className="hover:bg-muted/50 cursor-pointer"
            >
              <TableCell className="flex items-center">
                {product.imageUrl ? (
                  <Image
                    width={40}
                    height={40}
                    src={product.imageUrl}
                    alt={product.name}
                    className="mr-3 h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="mr-3 h-10 w-10 rounded-full bg-gray-200"></div>
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
                {/* Replace with category label if you have a categories constant */}
                {product.category}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {product.organic && (
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800">
                      Organic
                    </span>
                  )}
                  {product.local && (
                    <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs leading-5 font-semibold text-yellow-800">
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
                  onClick={() =>
                    onDelete
                      ? onDelete(product.id)
                      : alert('Delete not implemented')
                  }
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
