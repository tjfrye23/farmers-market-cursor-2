import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Leaf, Award } from 'lucide-react'
import React from 'react'

interface ProductInfoProps {
  name: string
  vendorId: number
  vendorName: string
  organic: boolean
  local: boolean
  category: string
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  vendorId,
  vendorName,
  organic,
  local,
  category,
}) => (
  <div>
    <h1 className="mb-2 text-3xl font-bold text-gray-900">{name}</h1>
    <div className="mb-4">
      <Link
        href={`/vendors/${vendorId}`}
        className="text-market-green hover:text-market-green-dark text-lg font-medium"
      >
        {vendorName}
      </Link>
    </div>
    <div className="flex flex-wrap gap-2">
      {organic && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Leaf className="h-3 w-3" />
          Organic
        </Badge>
      )}
      {local && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Award className="h-3 w-3" />
          Local
        </Badge>
      )}
      <Badge variant="outline">{category}</Badge>
    </div>
  </div>
)
