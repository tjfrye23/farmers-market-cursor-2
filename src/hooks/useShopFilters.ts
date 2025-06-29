import { useState } from 'react'

interface MarketDayProduct {
  id: number
  marketDayId: number
  productId: number
  productUnitId: number
  price: number
  quantity: number
  isActive: boolean
  product: {
    id: number
    name: string
    description: string
    category: string
    imageUrl: string
    organic: boolean
    local: boolean
    vendorProfile: {
      id: number
      businessName: string
    }
  }
  productUnit: {
    id: number
    name: string
    displayName: string
    symbol: string
  }
}

export const useShopFilters = () => {
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null)
  const [vendorFilter, setVendorFilter] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('featured')

  const getFilteredAndSortedProducts = (products: MarketDayProduct[]) => {
    let result = [...products]

    if (categoryFilter.length > 0) {
      result = result.filter((product) =>
        categoryFilter.includes(product.product.category)
      )
    }

    if (vendorFilter.length > 0) {
      result = result.filter((product) =>
        vendorFilter.includes(product.product.vendorProfile.id.toString())
      )
    }

    if (priceRange) {
      result = result.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      )
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.product.name.localeCompare(b.product.name))
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.product.name.localeCompare(a.product.name))
    }

    return result
  }

  return {
    categoryFilter,
    setCategoryFilter,
    priceRange,
    setPriceRange,
    vendorFilter,
    setVendorFilter,
    sortBy,
    setSortBy,
    getFilteredAndSortedProducts,
  }
}
