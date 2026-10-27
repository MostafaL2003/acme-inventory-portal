import { Plus, ChevronDown } from 'lucide-react'
import { DEFAULT_CATEGORY_SLUGS } from '../constants'
import { useUrlProductFilters } from '../hooks/useUrlProductFilters'
import { ProductTable } from './ProductTable'
import { ProductFilterToolbar } from './ProductFilterToolbar'
import { PaginationBar } from './PaginationBar'

export function ProductsPage() {
  const { filters, setPage, setPageSize } = useUrlProductFilters()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Product Catalog
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200/70 text-slate-600">
            1,248 items
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-lg border border-slate-300 shadow-xs transition-colors cursor-pointer"
          >
            <span>Bulk Actions</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <ProductFilterToolbar categories={DEFAULT_CATEGORY_SLUGS} />

      <ProductTable
        pagination={
          <PaginationBar
            currentPage={filters.page}
            totalItems={1248}
            pageSize={filters.limit}
            pageSizeOptions={[10, 20, 50, 100]}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        }
      />
    </div>
  )
}

export default ProductsPage
