import { AlertTriangle } from 'lucide-react'
import { useInventoryMetrics } from '../hooks/useInventoryMetrics'

export function DashboardPage() {
  const {
    totalSkus,
    formattedValuation,
    lowStockCount,
    outOfStockCount,
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
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Total SKUs
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {isLoading ? '...' : totalSkus.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              In warehouse
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Inventory Valuation
          </span>
          <div className="mt-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {isLoading ? '...' : formattedValuation}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Low Stock Alerts
            </span>
            <AlertTriangle
              className="w-4 h-4 text-amber-500 shrink-0"
              aria-hidden="true"
            />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {isLoading ? '...' : `${lowStockCount} Items`}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Out of Stock
          </span>
          <div className="mt-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {isLoading ? '...' : `${outOfStockCount} Items`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
