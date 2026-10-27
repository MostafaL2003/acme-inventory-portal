import { useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { ProductQueryParams } from '../types'

export interface UrlProductFilters {
  q: string
  category: string
  categories: string[]
  status?: string
  warehouse?: string
  stockLevel?: string
  priceRange?: string
  page: number
  limit: number
  skip: number
  sortBy?: string
  order?: 'asc' | 'desc'
}

export interface UseUrlProductFiltersReturn {
  filters: UrlProductFilters
  queryParams: ProductQueryParams
  setSearch: (q: string) => void
  setCategory: (category: string) => void
  setCategories: (categories: string[]) => void
  setStatus: (status?: string) => void
  setWarehouse: (warehouse?: string) => void
  setStockLevel: (stockLevel?: string) => void
  setPriceRange: (priceRange?: string) => void
  setPage: (page: number) => void
  setSort: (sortBy?: string, order?: 'asc' | 'desc') => void
  resetFilters: () => void
}

const DEFAULT_PAGE_LIMIT = 20

export function useUrlProductFilters(): UseUrlProductFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams()

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const categories = useMemo(
    () => (category ? category.split(',').map((c) => c.trim()).filter(Boolean) : []),
    [category],
  )
  const status = searchParams.get('status') || undefined
  const warehouse = searchParams.get('warehouse') || undefined
  const stockLevel = searchParams.get('stockLevel') || undefined
  const priceRange = searchParams.get('priceRange') || undefined

  const rawPage = parseInt(searchParams.get('page') || '1', 10)
  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage
  const sortBy = searchParams.get('sortBy') || undefined
  const rawOrder = searchParams.get('order')
  const order: 'asc' | 'desc' | undefined =
    rawOrder === 'desc' || rawOrder === 'asc' ? rawOrder : undefined

  const limit = DEFAULT_PAGE_LIMIT
  const skip = (page - 1) * limit

  const filters: UrlProductFilters = useMemo(
    () => ({
      q,
      category,
      categories,
      status,
      warehouse,
      stockLevel,
      priceRange,
      page,
      limit,
      skip,
      sortBy,
      order,
    }),
    [q, category, categories, status, warehouse, stockLevel, priceRange, page, limit, skip, sortBy, order],
  )

  const queryParams: ProductQueryParams = useMemo(
    () => ({
      q: q.trim() || undefined,
      category: category.trim() || undefined,
      limit,
      skip,
      sortBy,
      order,
    }),
    [q, category, limit, skip, sortBy, order],
  )

  const updateParam = useCallback(
    (key: string, value: string | undefined) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const trimmed = value?.trim()
          if (trimmed && trimmed !== 'all') {
            next.set(key, trimmed)
          } else {
            next.delete(key)
          }
          next.delete('page')
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setSearch = useCallback((query: string) => updateParam('q', query), [updateParam])
  const setCategory = useCallback((cat: string) => updateParam('category', cat), [updateParam])
  const setCategories = useCallback(
    (cats: string[]) => updateParam('category', cats.length > 0 ? cats.join(',') : undefined),
    [updateParam],
  )
  const setStatus = useCallback((st?: string) => updateParam('status', st), [updateParam])
  const setWarehouse = useCallback((wh?: string) => updateParam('warehouse', wh), [updateParam])
  const setStockLevel = useCallback((sl?: string) => updateParam('stockLevel', sl), [updateParam])
  const setPriceRange = useCallback((pr?: string) => updateParam('priceRange', pr), [updateParam])

  const setPage = useCallback(
    (newPage: number) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (newPage > 1) next.set('page', String(newPage))
          else next.delete('page')
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setSort = useCallback(
    (newSortBy?: string, newOrder?: 'asc' | 'desc') => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (newSortBy) {
            next.set('sortBy', newSortBy)
            if (newOrder) next.set('order', newOrder)
            else next.delete('order')
          } else {
            next.delete('sortBy')
            next.delete('order')
          }
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [setSearchParams])

  return {
    filters,
    queryParams,
    setSearch,
    setCategory,
    setCategories,
    setStatus,
    setWarehouse,
    setStockLevel,
    setPriceRange,
    setPage,
    setSort,
    resetFilters,
  }
}
