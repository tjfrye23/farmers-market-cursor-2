'use client'

import { Button } from '@/components/ui/button'
import { CreateProductSchema } from '@/types/product'
import Image from 'next/image'

interface ProductsQueueTableProps {
  products: CreateProductSchema[]
  onEditProduct: (index: number) => void
  onRemoveProduct: (index: number) => void
  isSubmitting: boolean
}

export default function ProductsQueueTable({
  products,
  onEditProduct,
  onRemoveProduct,
  isSubmitting,
}: ProductsQueueTableProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Features
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {products.map((product, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="mr-3 h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="mr-3 h-10 w-10 rounded-full bg-gray-200"></div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.description.substring(0, 50)}
                      {product.description.length > 50 && '...'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {product.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
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
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditProduct(index)}
                  className="text-indigo-600 hover:text-indigo-900"
                  disabled={isSubmitting}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveProduct(index)}
                  className="text-red-600 hover:text-red-900"
                  disabled={isSubmitting}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
