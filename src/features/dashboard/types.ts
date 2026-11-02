import type { Product } from '@/features/products'

export interface CategoryMetric {
  readonly category: string
  readonly count: number
  readonly valuation: number
  readonly percentage: number
}

export interface ComputedMetrics {
  readonly totalSkus: number
  readonly totalValuation: number
  readonly formattedValuation: string
  readonly lowStockCount: number
  readonly outOfStockCount: number
  readonly inStockCount: number
  readonly lowStockProducts: readonly Product[]
  readonly categoryBreakdown: readonly CategoryMetric[]
}

export interface InventoryMetrics extends ComputedMetrics {
  readonly isLoading: boolean
  readonly isError: boolean
  readonly error: Error | null
}

