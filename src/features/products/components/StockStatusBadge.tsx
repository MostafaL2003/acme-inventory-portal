import type { StockStatus } from '../types'

interface StockStatusBadgeProps {
  stock?: number
  status?: StockStatus
}

export function StockStatusBadge({ stock, status }: StockStatusBadgeProps) {
  let resolvedStatus: StockStatus = status || 'in-stock'

  if (!status && typeof stock === 'number') {
    if (stock === 0) {
      resolvedStatus = 'out-of-stock'
    } else if (stock < 30) {
      resolvedStatus = 'low-stock'
    } else {
      resolvedStatus = 'in-stock'
    }
  }

  if (resolvedStatus === 'out-of-stock') {
    return (
      <span className="inline-block px-3 py-0.5 text-xs font-medium bg-rose-100 text-rose-800 rounded-full whitespace-nowrap">
        Out of Stock
      </span>
    )
  }

  if (resolvedStatus === 'low-stock') {
    return (
      <span className="inline-block px-3 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full whitespace-nowrap">
        Low Stock
      </span>
    )
  }

  if (resolvedStatus === 'backordered') {
    return (
      <span className="inline-block px-3 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full whitespace-nowrap">
        Backordered
      </span>
    )
  }

  return (
    <span className="inline-block px-3 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full whitespace-nowrap">
      In Stock
    </span>
  )
}

export default StockStatusBadge
