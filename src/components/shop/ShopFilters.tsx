import React from 'react'
import { ChevronDown } from 'lucide-react'

interface Vendor {
  id: string
  name: string
  businessName: string
}

interface ShopFiltersProps {
  filterVisible: boolean
  setFilterVisible: (visible: boolean) => void
  categoryFilter: string[]
  setCategoryFilter: (categories: string[]) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  vendorFilter: string[]
  setVendorFilter: (vendors: string[]) => void
  categories: string[]
  vendors: Vendor[]
}

const ShopFilters: React.FC<ShopFiltersProps> = ({
  filterVisible,
  setFilterVisible,
  categoryFilter,
  setCategoryFilter,
  priceRange,
  setPriceRange,
  vendorFilter,
  setVendorFilter,
  categories,
  vendors,
}) => {
  // Handlers
  const handleCategoryChange = (cat: string) => {
    setCategoryFilter(
      categoryFilter.includes(cat)
        ? categoryFilter.filter((c) => c !== cat)
        : [...categoryFilter, cat]
    )
  }
  const handleVendorChange = (id: string) => {
    setVendorFilter(
      vendorFilter.includes(id)
        ? vendorFilter.filter((v) => v !== id)
        : [...vendorFilter, id]
    )
  }
  const handleMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange([Number(e.target.value), priceRange[1]])
  }
  const handleMaxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange([priceRange[0], Number(e.target.value)])
  }

  // Calculate active filters count
  const activeFiltersCount =
    categoryFilter.length +
    vendorFilter.length +
    (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0)

  return (
    <div className="mb-4 rounded-lg bg-white p-4 shadow">
      <button
        className="flex w-full items-center justify-between"
        onClick={() => setFilterVisible(!filterVisible)}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-market-green rounded-full px-2 py-0.5 text-xs text-white">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {filterVisible ? 'Hide' : 'Show'} Filters
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              filterVisible ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      <div
        className={`mt-4 space-y-6 overflow-hidden transition-all ${
          filterVisible ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Category Filter */}
        <div>
          <div className="mb-2 font-medium">Category</div>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={categoryFilter.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                  className="text-market-green focus:ring-market-green rounded border-gray-300"
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Vendor Filter */}
        <div>
          <div className="mb-2 font-medium">Vendor</div>
          <div className="space-y-2">
            {vendors.map((vendor) => (
              <label
                key={vendor.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={vendorFilter.includes(vendor.id)}
                  onChange={() => handleVendorChange(vendor.id)}
                  className="text-market-green focus:ring-market-green rounded border-gray-300"
                />
                {vendor.businessName}
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <div className="mb-2 font-medium">Price Range</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">$</span>
              <input
                type="number"
                min={0}
                value={priceRange[0]}
                onChange={handleMinPrice}
                className="focus:border-market-green focus:ring-market-green w-16 rounded border border-gray-300 px-2 py-1 text-sm focus:ring-1 focus:outline-none"
              />
            </div>
            <span className="text-gray-500">-</span>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">$</span>
              <input
                type="number"
                min={0}
                value={priceRange[1]}
                onChange={handleMaxPrice}
                className="focus:border-market-green focus:ring-market-green w-16 rounded border border-gray-300 px-2 py-1 text-sm focus:ring-1 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopFilters
