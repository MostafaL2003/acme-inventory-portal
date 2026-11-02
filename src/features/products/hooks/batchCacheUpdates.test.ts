import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import type { ProductsResponse } from '../types'

describe('Batch Cache Updates in TanStack Query', () => {
  let queryClient: QueryClient

  const mockPage1: ProductsResponse = {
    products: [
      { id: 1, title: 'Item 1', category: 'cat', price: 10, stock: 15, sku: 'SKU-1', thumbnail: '', description: '' },
      { id: 2, title: 'Item 2', category: 'cat', price: 20, stock: 5, sku: 'SKU-2', thumbnail: '', description: '' },
    ],
    total: 3,
    skip: 0,
    limit: 2,
  }

  const mockPage2: ProductsResponse = {
    products: [
      { id: 3, title: 'Item 3', category: 'cat', price: 30, stock: 0, sku: 'SKU-3', thumbnail: '', description: '' },
    ],
    total: 3,
    skip: 2,
    limit: 2,
  }

  beforeEach(() => {
    queryClient = new QueryClient()
    queryClient.setQueryData(['products', { page: 1 }], mockPage1)
    queryClient.setQueryData(['products', { page: 2 }], mockPage2)
  })

  it('updates stock to 0 for all selected product ids across all cached pages', () => {
    const targetIds = new Set([1, 3])

    queryClient.setQueriesData<ProductsResponse>(
      { queryKey: ['products'] },
      (oldData) => {
        if (!oldData || !Array.isArray(oldData.products)) return oldData
        return {
          ...oldData,
          products: oldData.products.map((p) =>
            targetIds.has(p.id) ? { ...p, stock: 0 } : p,
          ),
        }
      },
    )

    const page1 = queryClient.getQueryData<ProductsResponse>(['products', { page: 1 }])
    const page2 = queryClient.getQueryData<ProductsResponse>(['products', { page: 2 }])

    expect(page1?.products.find((p) => p.id === 1)?.stock).toBe(0)
    expect(page1?.products.find((p) => p.id === 2)?.stock).toBe(5)
    expect(page2?.products.find((p) => p.id === 3)?.stock).toBe(0)
  })

  it('increments stock by 50 for all selected product ids', () => {
    const targetIds = new Set([1, 2])

    queryClient.setQueriesData<ProductsResponse>(
      { queryKey: ['products'] },
      (oldData) => {
        if (!oldData || !Array.isArray(oldData.products)) return oldData
        return {
          ...oldData,
          products: oldData.products.map((p) =>
            targetIds.has(p.id) ? { ...p, stock: p.stock + 50 } : p,
          ),
        }
      },
    )

    const page1 = queryClient.getQueryData<ProductsResponse>(['products', { page: 1 }])

    expect(page1?.products.find((p) => p.id === 1)?.stock).toBe(65)
    expect(page1?.products.find((p) => p.id === 2)?.stock).toBe(55)
  })

  it('removes deleted items and decrements total counter in cache', () => {
    const deleteIds = new Set([1])

    queryClient.setQueriesData<ProductsResponse>(
      { queryKey: ['products'] },
      (oldData) => {
        if (!oldData || !Array.isArray(oldData.products)) return oldData
        const remaining = oldData.products.filter((p) => !deleteIds.has(p.id))
        const removedCount = oldData.products.length - remaining.length
        if (removedCount === 0) return oldData
        return {
          ...oldData,
          total: Math.max(0, oldData.total - removedCount),
          products: remaining,
        }
      },
    )

    const page1 = queryClient.getQueryData<ProductsResponse>(['products', { page: 1 }])
    expect(page1?.products.map((p) => p.id)).toEqual([2])
    expect(page1?.total).toBe(2)
  })
})
