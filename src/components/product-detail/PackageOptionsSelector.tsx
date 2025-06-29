import React from 'react'
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'

interface PackageOptionsSelectorProps {
  variations: Array<{
    id: number
    price: number
    quantity: number
    isActive: boolean
    size: number
    packaged: boolean
    productUnit: {
      id: number
      name: string
      pluralName: string
      displayName: string
      symbol: string
    }
  }>
  selectedUnitIdx: number
  setSelectedUnitIdx: (idx: number) => void
  quantity: number
  setQuantity: (qty: number) => void
  showDropdown: boolean
  setShowDropdown: (show: boolean) => void
}

export const PackageOptionsSelector: React.FC<PackageOptionsSelectorProps> = ({
  variations,
  selectedUnitIdx,
  setSelectedUnitIdx,
  quantity,
  setQuantity,
  showDropdown,
  setShowDropdown,
}) => {
  const selectedUnit = variations[selectedUnitIdx] || variations[0]
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= selectedUnit.quantity) {
      setQuantity(newQuantity)
    }
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
            variations.length > 1 && setShowDropdown(!showDropdown)
          }
          disabled={variations.length === 1}
          style={{ minHeight: '56px' }}
        >
          <span>
            ${selectedUnit.price.toFixed(2)} / {selectedUnit.productUnit.name}
            {selectedUnit.packaged &&
              ` - ${selectedUnit.size} ${selectedUnit.productUnit.name} package`}
          </span>
          <div className="flex items-center">
            <span>
              {selectedUnit.quantity}{' '}
              {selectedUnit.quantity > 1
                ? selectedUnit.productUnit.pluralName
                : selectedUnit.productUnit.name}{' '}
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
        {variations.length > 1 && showDropdown && (
          <div className="absolute z-10 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
            {variations.map((option, idx) => (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedUnitIdx(idx)
                  setQuantity(1)
                  setShowDropdown(false)
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-base font-medium hover:bg-green-50 focus:bg-green-100 ${selectedUnitIdx === idx ? 'bg-green-100 text-green-700' : 'text-gray-900'}`}
                disabled={!option.isActive || option.quantity === 0}
              >
                <span>
                  ${option.price.toFixed(2)} / {option.productUnit.name}
                  {option.packaged &&
                    ` - ${option.size} ${option.productUnit.name} package`}
                </span>
                <span>
                  {option.quantity}{' '}
                  {selectedUnit.quantity > 1
                    ? selectedUnit.productUnit.pluralName
                    : selectedUnit.productUnit.name}{' '}
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
      <Button className="w-full" size="lg">
        Add to Cart
      </Button>
    </div>
  )
}
