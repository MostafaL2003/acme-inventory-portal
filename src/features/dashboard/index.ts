export { DashboardPage } from './components/DashboardPage'
export {
  MetricStatCard,
  type MetricStatCardProps,
} from './components/MetricStatCard'
export {
  CategoryBreakdownList,
  type CategoryBreakdownListProps,
} from './components/CategoryBreakdownList'
export {
  LowStockWatchlist,
  type LowStockWatchlistProps,
} from './components/LowStockWatchlist'
export { useInventoryMetrics } from './hooks/useInventoryMetrics'
export {
  fetchSkuAndValuationMetrics,
  fetchLowStockMetrics,
  type SkuValuationData,
  type LowStockData,
} from './api'
export { calculateInventoryMetrics } from './utils/metrics'
export type {
  CategoryMetric,
  ComputedMetrics,
  InventoryMetrics,
} from './types'
