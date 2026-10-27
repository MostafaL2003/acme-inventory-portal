import { useState, useEffect } from 'react'
import { Search, X, RotateCcw } from 'lucide-react'
import { useDebouncedValue } from '@/shared/hooks'
import { useUrlProductFilters } from '../hooks/useUrlProductFilters'
import { FilterDropdown } from './FilterDropdown'
import {
  CATEGORY_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  WAREHOUSE_FILTER_OPTIONS,
  STOCK_LEVEL_FILTER_OPTIONS,
  PRICE_RANGE_FILTER_OPTIONS,
} from '../constants'

export function ProductFilterToolbar() {
  const {
    filters,
    setSearch,
    setCategories,
    setStatus,
    setWarehouse,
    setStockLevel,
    setPriceRange,
    resetFilters,
  } = useUrlProductFilters()

  const [searchInput, setSearchInput] = useState(filters.q)
  const [prevUrlQ, setPrevUrlQ] = useState(filters.q)
  const debouncedSearch = useDebouncedValue(searchInput, 300)

  if (filters.q !== prevUrlQ) {
    setPrevUrlQ(filters.q)
    setSearchInput(filters.q)
  }

  useEffect(() => {
    if (debouncedSearch === searchInput && debouncedSearch !== filters.q) {
      setSearch(debouncedSearch)
    }
  }, [debouncedSearch, searchInput, filters.q, setSearch])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearch('')
  }

  const handleResetAll = () => {
    setSearchInput('')
    resetFilters()
  }

  const hasActiveFilters = Boolean(
    searchInput ||
      filters.q ||
      filters.categories.length > 0 ||
      filters.status ||
      filters.warehouse ||
      filters.stockLevel ||
      filters.priceRange,
  )

  return (
    <div className="flex items-center flex-wrap gap-2.5">
      <div className="relative min-w-[260px] max-w-xs flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search by SKU, title, category..."
          className="w-full h-10 pl-9 pr-8 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-2xs"
        />
        {searchInput && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <FilterDropdown
        label="Category"
        isMulti
        options={CATEGORY_FILTER_OPTIONS}
        selected={filters.categories}
        onChange={(val) => setCategories(val as string[])}
      />

      <FilterDropdown
        label="Status"
        options={STATUS_FILTER_OPTIONS}
        selected={filters.status || 'all'}
        onChange={(val) => setStatus(val as string)}
      />

      <FilterDropdown
        label="Warehouse"
        options={WAREHOUSE_FILTER_OPTIONS}
        selected={filters.warehouse || 'all'}
        onChange={(val) => setWarehouse(val as string)}
      />

      <FilterDropdown
        label="Stock Level"
        options={STOCK_LEVEL_FILTER_OPTIONS}
        selected={filters.stockLevel || 'all'}
        onChange={(val) => setStockLevel(val as string)}
      />

      <FilterDropdown
        label="Price Range"
        options={PRICE_RANGE_FILTER_OPTIONS}
        selected={filters.priceRange || 'all'}
        onChange={(val) => setPriceRange(val as string)}
      />

      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleResetAll}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      )}
    </div>
  )
}

export default ProductFilterToolbar
