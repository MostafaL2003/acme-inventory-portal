import { type JSX } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Layers } from 'lucide-react'
import type { CategoryMetric } from '../types'

export interface CategoryBreakdownListProps {
  readonly categories: readonly CategoryMetric[]
  readonly isLoading?: boolean
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function formatCategoryLabel(raw: string): string {
  return raw
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const BAR_COLORS = [
  'bg-blue-600',
  'bg-indigo-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-purple-600',
  'bg-teal-600',
  'bg-rose-600',
  'bg-cyan-600',
]

export function CategoryBreakdownList({
  categories,
  isLoading = false,
}: CategoryBreakdownListProps): JSX.Element {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="h-5 w-44 bg-slate-200 animate-pulse rounded" />
        <div className="space-y-3 pt-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-28 bg-slate-200 animate-pulse rounded" />
                <div className="h-4 w-20 bg-slate-200 animate-pulse rounded" />
              </div>
              <div className="h-2 w-full bg-slate-100 animate-pulse rounded-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center">
        <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" aria-hidden="true" />
        <p className="text-sm font-medium text-slate-600">
          No category distribution data available.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Category Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Inventory valuation and SKU volume distribution across categories
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>View catalog</span>
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="space-y-4">
        {categories.map((item, index) => {
          const colorClass = BAR_COLORS[index % BAR_COLORS.length]
          const label = formatCategoryLabel(item.category)
          const formattedValuation = currencyFormatter.format(item.valuation)

          return (
            <div key={item.category} className="space-y-1.5 group">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Link
                    to={`/products?category=${encodeURIComponent(item.category)}`}
                    className="font-medium text-slate-800 hover:text-blue-600 transition-colors truncate"
                  >
                    {label}
                  </Link>
                  <span className="text-slate-400 font-normal shrink-0">
                    ({item.count} {item.count === 1 ? 'SKU' : 'SKUs'})
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-semibold text-slate-700">
                    {formattedValuation}
                  </span>
                  <span className="text-slate-400 font-medium w-12 text-right">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div
                role="progressbar"
                aria-valuenow={item.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${label} valuation percentage`}
                className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full rounded-full transition-all duration-300 ${colorClass}`}
                  style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryBreakdownList

