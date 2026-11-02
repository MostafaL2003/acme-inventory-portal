import { useQuery } from '@tanstack/react-query'
import {
  fetchSkuAndValuationMetrics,
  fetchLowStockMetrics,
} from '../api'
import type { InventoryMetrics } from '../types'

export function useInventoryMetrics(): InventoryMetrics {
  const valuationQuery = useQuery({
    queryKey: ['dashboard', 'sku-valuation'],
    queryFn: ({ signal }) => fetchSkuAndValuationMetrics(signal),
  })

  const lowStockQuery = useQuery({
    queryKey: ['dashboard', 'low-stock'],
    queryFn: ({ signal }) => fetchLowStockMetrics(signal),
  })

  const isLoading = valuationQuery.isLoading || lowStockQuery.isLoading
  const isError = valuationQuery.isError || lowStockQuery.isError
  const error = valuationQuery.error ?? lowStockQuery.error ?? null

  return {
    totalSkus: valuationQuery.data?.totalSkus ?? 0,
    totalValuation: valuationQuery.data?.totalValuation ?? 0,
    formattedValuation: valuationQuery.data?.formattedValuation ?? '$0',
    inStockCount: valuationQuery.data?.inStockCount ?? 0,
    categoryBreakdown: valuationQuery.data?.categoryBreakdown ?? [],
    lowStockCount: lowStockQuery.data?.lowStockCount ?? 0,
    outOfStockCount: lowStockQuery.data?.outOfStockCount ?? 0,
    lowStockProducts: lowStockQuery.data?.lowStockProducts ?? [],
    isLoading,
    isError,
    error,
  }
}

export default useInventoryMetrics
