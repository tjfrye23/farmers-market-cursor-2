'use client'
import React, { useState } from 'react'
import { ClientProduct } from '@/types/product'

interface ReadOnlyPackageOptionsProps {
  product: ClientProduct
}

export const ReadOnlyPackageOptions: React.FC<ReadOnlyPackageOptionsProps> = ({
  product,
}) => {
  const [selectedUnitIdx, setSelectedUnitIdx] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)

  const selectedUnit =
    product.variations[selectedUnitIdx] || product.variations[0]

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
          disabled={product.variations.length < 1}
          style={{ minHeight: '56px' }}
        >
          <span>
            ${selectedUnit.price.toFixed(2)} / {selectedUnit.unit.name}
            {selectedUnit.packaged &&
              ` - ${selectedUnit.size} ${selectedUnit.unit.name} package`}
          </span>
          <div className="flex items-center">
            {product.variations.length > 1 && (
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
            )}
          </div>
        </button>
        {product.variations.length > 1 && showDropdown && (
          <div className="absolute z-10 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
            {product.variations.map((option, idx) => (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedUnitIdx(idx)
                  setShowDropdown(false)
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-base font-medium hover:bg-gray-50 focus:bg-gray-100 ${selectedUnitIdx === idx ? 'bg-gray-100 text-gray-700' : 'text-gray-900'}`}
                disabled={false}
              >
                <span>
                  ${option.price.toFixed(2)} / {option.unit.name}
                  {option.packaged &&
                    ` - ${option.size} ${option.unit.name} package`}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Read-only quantity display */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <div className="flex items-center space-x-2">
          <div className="w-12 text-center font-medium text-gray-500">0</div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-gray-900">Total</span>
          <span className="text-xl font-bold text-gray-900">
            ${selectedUnit.price.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-center text-gray-500">
        View Only
      </div>
    </div>
  )
}
