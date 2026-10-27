import { useState, useEffect, useRef } from 'react'
import { Search, X, ChevronDown, Check, RotateCcw } from 'lucide-react'
import { useDebouncedValue } from '@/shared/hooks'
import { useUrlProductFilters } from '../hooks/useUrlProductFilters'
import { PLACEHOLDER_FILTER_LABELS } from '../constants'

export interface ProductFilterToolbarProps {
  categories?: string[]
}

function formatCategoryName(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export function ProductFilterToolbar({
  categories = [],
}: ProductFilterToolbarProps) {
  const { filters, setSearch, setCategory, resetFilters } = useUrlProductFilters()

  const [searchInput, setSearchInput] = useState<string>(filters.q)
  const [prevUrlQ, setPrevUrlQ] = useState<string>(filters.q)
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const debouncedSearch = useDebouncedValue(searchInput, 300)

  if (filters.q !== prevUrlQ) {
    setPrevUrlQ(filters.q)
    setSearchInput(filters.q)
  }

  useEffect(() => {
    const settled = debouncedSearch.trim()
    if (debouncedSearch === searchInput && settled !== filters.q) {
      setSearch(settled)
    }
  }, [debouncedSearch, searchInput, filters.q, setSearch])

  useEffect(() => {
    if (!isCategoryOpen) return
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false)
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsCategoryOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isCategoryOpen])

  const handleSelectCategory = (slug: string) => {
    setCategory(slug)
    setIsCategoryOpen(false)
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearch('')
  }

  const handleReset = () => {
    setSearchInput('')
    setIsCategoryOpen(false)
    resetFilters()
  }

  const hasActiveFilters = Boolean(filters.q || filters.category)
  const activeCategoryLabel = filters.category
    ? formatCategoryName(filters.category)
    : 'Category'

  return (
    <div className="flex items-center flex-wrap gap-2.5">
      <div className="relative min-w-[260px] max-w-xs flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by SKU, title, category..."
          aria-label="Search products"
          className="w-full h-10 pl-9 pr-8 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors shadow-2xs"
        />
        {searchInput && (
          <button
            type="button"
            onClick={handleClearSearch}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div ref={dropdownRef} className="relative inline-block">
        <button
          type="button"
          onClick={() => setIsCategoryOpen((prev) => !prev)}
          aria-expanded={isCategoryOpen}
          aria-haspopup="listbox"
          className={`h-10 inline-flex items-center justify-between gap-2 px-3.5 text-sm font-medium rounded-lg border transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs ${
            filters.category
              ? 'bg-blue-50/70 border-blue-300 text-blue-700 hover:bg-blue-100/60'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          <span>{activeCategoryLabel}</span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${
              isCategoryOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isCategoryOpen && (
          <div
            role="listbox"
            className="absolute left-0 top-full mt-1.5 min-w-[200px] max-h-64 overflow-y-auto bg-white rounded-lg border border-slate-200 shadow-lg py-1 z-40"
          >
            <button
              type="button"
              role="option"
              aria-selected={!filters.category}
              onClick={() => handleSelectCategory('')}
              className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors ${
                !filters.category ? 'font-medium text-blue-600 bg-blue-50/50' : 'text-slate-700'
              }`}
            >
              <span>All Categories</span>
              {!filters.category && <Check className="w-4 h-4 text-blue-600" />}
            </button>

            {categories.map((slug) => {
              const isSelected = filters.category === slug
              return (
                <button
                  key={slug}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectCategory(slug)}
                  className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors ${
                    isSelected ? 'font-medium text-blue-600 bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{formatCategoryName(slug)}</span>
                  {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {PLACEHOLDER_FILTER_LABELS.map((label) => (
        <button
          key={label}
          type="button"
          disabled
          aria-disabled="true"
          title={`Filtering by ${label.toLowerCase()} pending WMS integration`}
          className="h-10 inline-flex items-center justify-between gap-2 px-3.5 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 opacity-75 cursor-not-allowed select-none shadow-2xs"
        >
          <span>{label}</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      ))}

      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleReset}
          className="h-10 inline-flex items-center gap-1.5 px-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  )
}

export default ProductFilterToolbar
