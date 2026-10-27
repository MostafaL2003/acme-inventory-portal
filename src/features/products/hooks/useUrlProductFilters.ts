import { useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { ProductQueryParams } from '../types'

export interface UrlProductFilters {
  q: string
  category: string
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
  setPage: (page: number) => void
  setSort: (sortBy?: string, order?: 'asc' | 'desc') => void
  resetFilters: () => void
}

const DEFAULT_PAGE_LIMIT = 20

export function useUrlProductFilters(): UseUrlProductFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams()

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
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
      page,
      limit,
      skip,
      sortBy,
      order,
    }),
    [q, category, page, limit, skip, sortBy, order],
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

  const updateFilterParam = useCallback(
    (key: 'q' | 'category', value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const trimmed = value.trim()
          const normalized = trimmed && trimmed !== 'all' ? trimmed : undefined
          const current = next.get(key) || undefined

          if (current === normalized) {
            return prev
          }

          if (normalized) {
            next.set(key, normalized)
          } else {
            next.delete(key)
          }

          if (next.has('q') || next.has('category')) {
            next.set('page', '1')
          } else {
            next.delete('page')
          }

          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setSearch = useCallback(
    (newQuery: string) => updateFilterParam('q', newQuery),
    [updateFilterParam],
  )

  const setCategory = useCallback(
    (newCategory: string) => updateFilterParam('category', newCategory),
    [updateFilterParam],
  )

  const setPage = useCallback(
    (newPage: number) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const safePage = Math.max(1, Math.floor(newPage))
          if (safePage > 1 || next.has('q') || next.has('category')) {
            next.set('page', String(safePage))
          } else {
            next.delete('page')
          }
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
    setPage,
    setSort,
    resetFilters,
  }
}
