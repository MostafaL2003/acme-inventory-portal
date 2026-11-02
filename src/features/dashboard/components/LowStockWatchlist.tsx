import { useState, useMemo, type JSX } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Search, ChevronLeft, ChevronRight, PackageCheck } from 'lucide-react'
import { StockStatusBadge, type Product } from '@/features/products'
import { useAppDispatch } from '@/shared/hooks'
import { openEditDrawer } from '@/shared/store'

export interface LowStockWatchlistProps {
  readonly products: readonly Product[]
  readonly isLoading?: boolean
  readonly onReorder?: (product: Product) => void
}

const PAGE_SIZE = 5

function getWarehouseLocation(id: number): string {
  return `Aisle ${(id % 12) + 1}-${String.fromCharCode(65 + (id % 6))}`
}

export function LowStockWatchlist({
  products,
  isLoading = false,
  onReorder,
}: LowStockWatchlistProps): JSX.Element {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [filterText, setFilterText] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = filterText.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q),
    )
  }, [products, filterText])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleAction = (product: Product): void => {
    if (onReorder) {
      onReorder(product)
      return
    }
    queryClient.setQueryData(['product', product.id], product)
    dispatch(openEditDrawer(product.id))
    navigate('/products')
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="h-6 w-52 bg-slate-200 animate-pulse rounded" />
        <div className="h-64 w-full bg-slate-100 animate-pulse rounded-xl" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Critical Reorder Queue</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
            Out of Stock & Low Stock
          </span>
        </div>
        <div className="relative w-64 max-w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => { setFilterText(e.target.value); setPage(1) }}
            placeholder="Filter queue..."
            aria-label="Filter critical reorder queue"
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center text-slate-500">
          <PackageCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-700">All stock healthy</p>
          <p className="text-xs text-slate-400 mt-0.5">No products currently meet the critical reorder threshold.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th scope="col" className="py-3 px-4">SKU</th>
                <th scope="col" className="py-3 px-3">Thumbnail</th>
                <th scope="col" className="py-3 px-4">Product Name</th>
                <th scope="col" className="py-3 px-4">Category</th>
                <th scope="col" className="py-3 px-4">Stock</th>
                <th scope="col" className="py-3 px-4">Location</th>
                <th scope="col" className="py-3 px-4">Status</th>
                <th scope="col" className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-600 font-medium whitespace-nowrap">{product.sku}</td>
                  <td className="py-3 px-3">
                    <img src={product.thumbnail} alt="" className="w-8 h-8 rounded-md object-cover bg-slate-100 border border-slate-200/60" loading="lazy" />
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 max-w-[200px] truncate">{product.title}</td>
                  <td className="py-3 px-4">
                    <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-slate-600 hover:text-blue-600 transition-colors capitalize underline-offset-2 hover:underline">
                      {product.category.replace('-', ' ')}
                    </Link>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{product.stock}</td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{getWarehouseLocation(product.id)}</td>
                  <td className="py-3 px-4"><StockStatusBadge stock={product.stock} /></td>
                  <td className="py-3 px-4 text-right">
                    <button type="button" onClick={() => handleAction(product)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs cursor-pointer">
                      Reorder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > PAGE_SIZE && (
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} alerts
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-md hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-slate-700">{currentPage} / {totalPages}</span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-md hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LowStockWatchlist
