'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { ClientMarketDayProduct } from '@/types/product'
import { ProductUnavailable } from './ProductUnavailable'
import { useCartActions } from '@/hooks/useCartActions'
import { useMarketDayStore } from '@/stores/useMarketDay'

interface PackageOptionsSelectorProps {
  product: ClientMarketDayProduct
}

export const PackageOptionsSelector: React.FC<PackageOptionsSelectorProps> = ({
  product,
}) => {
  const [selectedUnitIdx, setSelectedUnitIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showDropdown, setShowDropdown] = useState(false)
  const { addToCart } = useCartActions()
  const { selectedMarketDay } = useMarketDayStore()
  // Determine if product is available on the selected market day
  const isAvailable =
    product.marketDay.id === selectedMarketDay?.id &&
    product.variations.length > 0

  const selectedUnit =
    product.variations[selectedUnitIdx] || product.variations[0]

  const handleAddToCart = () => {
    if (!selectedUnit || selectedUnit.quantity < 1 || !isAvailable) return
    addToCart(
      {
        name: product.name,
        imageUrl: product.imageUrl,
        price: selectedUnit.price,
        quantity,
        unit: selectedUnit.unit,
        variationId: selectedUnit.id,
        packaged: selectedUnit.packaged,
        size: selectedUnit.size,
        vendor: product.vendor,
      },
      product.marketDay
    )
    toast.success('Added to cart!')
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= selectedUnit.quantity) {
      setQuantity(newQuantity)
    }
  }

  if (!isAvailable) {
    return <ProductUnavailable />
  }

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Package Options
      </label>
      <div className="relative">
        <button
          type="button"
          className="text-m flex w-full items-center justify-between rounded-xl border-2 border-green-500 bg-gray-50 px-4 py-4 text-left font-semibold text-gray-900 focus:ring-2 focus:ring-green-400 focus:outline-none"
          onClick={() =>
            product.variations.length > 1 && setShowDropdown(!showDropdown)
          }
          disabled={product.variations.length === 1}
          style={{ minHeight: '56px' }}
        >
          <span>
            ${selectedUnit.price.toFixed(2)} / {selectedUnit.unit.name}
            {selectedUnit.packaged &&
              ` - ${selectedUnit.size} ${selectedUnit.unit.name} package`}
          </span>
          <div className="flex items-center">
            <span>
              {selectedUnit.quantity}{' '}
              {selectedUnit.quantity > 1
                ? selectedUnit.unit.pluralName
                : selectedUnit.unit.name}{' '}
              available
            </span>
            <svg
              className={`ml-2 h-5 w-5 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>
        {product.variations.length > 1 && showDropdown && (
          <div className="absolute z-10 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
            {product.variations.map((option, idx) => (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedUnitIdx(idx)
                  setQuantity(1)
                  setShowDropdown(false)
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-base font-medium hover:bg-green-50 focus:bg-green-100 ${selectedUnitIdx === idx ? 'bg-green-100 text-green-700' : 'text-gray-900'}`}
                disabled={option.quantity === 0}
              >
                <span>
                  ${option.price.toFixed(2)} / {option.unit.name}
                  {option.packaged &&
                    ` - ${option.size} ${option.unit.name} package`}
                </span>
                <span>
                  {option.quantity}{' '}
                  {selectedUnit.quantity > 1
                    ? selectedUnit.unit.pluralName
                    : selectedUnit.unit.name}{' '}
                  available
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Quantity Selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= selectedUnit.quantity}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-gray-900">Total</span>
          <span className="text-xl font-bold text-gray-900">
            ${(selectedUnit.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>
      <Button
        className="w-full"
        size="lg"
        onClick={handleAddToCart}
        disabled={!handleAddToCart}
      >
        Add to Cart
      </Button>
    </div>
  )
}
