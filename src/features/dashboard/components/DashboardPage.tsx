import { AlertTriangle, AlertCircle } from 'lucide-react'
import { useInventoryMetrics } from '../hooks/useInventoryMetrics'
import { MetricStatCard } from './MetricStatCard'
import { CategoryBreakdownList } from './CategoryBreakdownList'

export function DashboardPage() {
  const {
    totalSkus,
    formattedValuation,
    lowStockCount,
    outOfStockCount,
    categoryBreakdown,
    isLoading,
  } = useInventoryMetrics()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Operations Dashboard
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Real-time inventory levels, stock health, and catalog valuation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricStatCard
          title="Total SKUs"
          value={isLoading ? '...' : totalSkus.toLocaleString()}
          subtitle="In warehouse"
          isLoading={isLoading}
        />
        <MetricStatCard
          title="Inventory Valuation"
          value={isLoading ? '...' : formattedValuation}
          isLoading={isLoading}
        />
        <MetricStatCard
          title="Low Stock Alerts"
          value={isLoading ? '...' : `${lowStockCount} Items`}
          icon={
            <AlertTriangle
              className="w-4 h-4 text-amber-500"
              aria-hidden="true"
            />
          }
          isLoading={isLoading}
        />
        <MetricStatCard
          title="Out of Stock"
          value={isLoading ? '...' : `${outOfStockCount} Items`}
          icon={
            <AlertCircle
              className="w-4 h-4 text-rose-500"
              aria-hidden="true"
            />
          }
          isLoading={isLoading}
        />
      </div>

      <CategoryBreakdownList
        categories={categoryBreakdown}
        isLoading={isLoading}
      />
    </div>
  )
}

export default DashboardPage
