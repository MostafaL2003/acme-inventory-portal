import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useProductsQuery,
  type Product,
  type ProductsResponse,
} from '@/features/products'
import { calculateInventoryMetrics } from '../utils/metrics'
import type { InventoryMetrics } from '../types'

export function useInventoryMetrics(): InventoryMetrics {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error } = useProductsQuery({ limit: 100 })

  const metrics = useMemo(() => {
    const productsMap = new Map<number, Product>()

    if (data?.products && Array.isArray(data.products)) {
      for (const product of data.products) {
        productsMap.set(product.id, product)
      }
    }

    const cachedQueries = queryClient.getQueriesData<ProductsResponse>({
      queryKey: ['products'],
    })
    for (const [, cached] of cachedQueries) {
      if (cached?.products && Array.isArray(cached.products)) {
        for (const product of cached.products) {
          productsMap.set(product.id, product)
        }
      }
    }

    const products = Array.from(productsMap.values())
    const totalOverride = data?.total

    return calculateInventoryMetrics(products, totalOverride)
  }, [data, queryClient])

  return {
    ...metrics,
    isLoading: isLoading && metrics.totalSkus === 0,
    isError,
    error,
  }
}

export default useInventoryMetrics
