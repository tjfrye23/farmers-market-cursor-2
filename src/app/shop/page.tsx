'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PageHeader from '@/components/PageHeader'
import ProductGrid from '@/components/shop/ProductGrid'
import ShopFilters from '@/components/shop/ShopFilters'
import MarketDaySelector from '@/components/shop/MarketDaySelector'
import ShopAvailabilityBanner from '@/components/shop/ShopAvailabilityBanner'
import { useShopFilters } from '@/hooks/useShopFilters'
import { useMarketDays } from '@/hooks/useMarketDays'
import { useVendors } from '@/hooks/useVendors'
import { useCategories } from '@/hooks/useCategories'
import { useMarketDayProducts } from '@/hooks/useMarketDayProducts'

export default function ShopPage() {
  const searchParams = useSearchParams()
  const [filterVisible, setFilterVisible] = useState(false)
  const [selectedMarketDay, setSelectedMarketDay] = useState<number | null>(
    null
  )

  const {
    categoryFilter,
    setCategoryFilter,
    priceRange,
    setPriceRange,
    vendorFilter,
    setVendorFilter,
  } = useShopFilters()

  // Fetch market days
  const { data: marketDays = [], isLoading: isMarketDaysLoading } =
    useMarketDays()

  // Fetch vendors
  const { data: vendors = [] } = useVendors()

  // Fetch categories
  const { data: categories = [] } = useCategories(selectedMarketDay)

  // Fetch market day product groups
  const {
    data: products = [],
    isLoading: isProductsLoading,
    error,
  } = useMarketDayProducts({
    categoryFilter,
    vendorFilter,
    priceRange,
    selectedMarketDay,
  })

  useEffect(() => {
    // Simulate reading categories from search params
    const initialCategories = searchParams.getAll('category')
    setCategoryFilter(initialCategories)
  }, [searchParams, setCategoryFilter])

  useEffect(() => {
    if (selectedMarketDay) {
      localStorage.setItem('selectedMarketDay', selectedMarketDay.toString())
    } else {
      localStorage.removeItem('selectedMarketDay')
    }
  }, [selectedMarketDay])

  // Ensure priceRange is always [number, number]
  const safePriceRange: [number, number] = priceRange ?? [0, 100]

  return (
    <div className="flex min-h-screen flex-col">
      {/* TODO: Navbar */}
      <main className="flex-grow">
        <PageHeader title="Market" />
        <div className="container mx-auto px-4 py-8">
          <ShopAvailabilityBanner />
          <div className="mb-6">
            <MarketDaySelector
              marketDays={marketDays}
              selectedMarketDay={selectedMarketDay}
              onSelectMarketDay={setSelectedMarketDay}
              isLoading={isMarketDaysLoading}
            />
          </div>
          <div className="relative flex flex-col gap-8 lg:flex-row">
            <aside className="lg:w-64 lg:flex-shrink-0">
              <ShopFilters
                filterVisible={filterVisible}
                setFilterVisible={setFilterVisible}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                priceRange={safePriceRange}
                setPriceRange={setPriceRange}
                vendorFilter={vendorFilter}
                setVendorFilter={setVendorFilter}
                categories={categories}
                vendors={vendors}
              />
            </aside>
            <section className="flex-1">
              <ProductGrid
                products={products}
                isLoading={isProductsLoading}
                error={error?.message}
              />
            </section>
          </div>
        </div>
      </main>
      {/* TODO: Footer */}
    </div>
  )
}
