import { useState, type ReactNode } from 'react'
import type { Product } from '../types'
import { SAMPLE_IMAGE_PRODUCTS } from '../constants'
import { ProductRow } from './ProductRow'
import { ProductTableSkeleton } from './ProductTableSkeleton'
import { EmptyProductsState } from './EmptyProductsState'

interface ProductTableProps {
  products?: Product[]
  isLoading?: boolean
  selectedIds?: number[]
  onToggleSelect?: (id: number) => void
  onToggleSelectAll?: (ids: number[]) => void
  onAction?: (product: Product) => void
  onResetFilters?: () => void
  pagination?: ReactNode
}

export function ProductTable({
  products = SAMPLE_IMAGE_PRODUCTS,
  isLoading = false,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onAction,
  onResetFilters,
  pagination,
}: ProductTableProps) {
  const [internalSelectedIds, setInternalSelectedIds] = useState<number[]>([1])

  const activeSelected = selectedIds !== undefined ? selectedIds : internalSelectedIds

  const handleToggle = (id: number) => {
    if (onToggleSelect) {
      onToggleSelect(id)
    } else {
      setInternalSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      )
    }
  }

  const allSelected =
    products.length > 0 && products.every((p) => activeSelected.includes(p.id))

  const handleSelectAll = () => {
    if (onToggleSelectAll) {
      onToggleSelectAll(allSelected ? [] : products.map((p) => p.id))
    } else {
      setInternalSelectedIds(allSelected ? [] : products.map((p) => p.id))
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 bg-white">
              <th className="w-12 px-4 py-3.5 text-center">
                <input
                  type="checkbox"
                  aria-label="Select all products"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="px-4 py-3.5">SKU</th>
              <th className="px-4 py-3.5">Thumbnail</th>
              <th className="px-4 py-3.5">Product Name</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">Stock</th>
              <th className="px-4 py-3.5">Price</th>
              <th className="px-4 py-3.5">Location</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-center">Actions</th>
            </tr>
          </thead>

          {isLoading ? (
            <ProductTableSkeleton rowCount={7} />
          ) : products.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={10}>
                  <EmptyProductsState onResetFilters={onResetFilters} />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  isSelected={activeSelected.includes(product.id)}
                  onToggleSelect={handleToggle}
                  onAction={onAction}
                />
              ))}
            </tbody>
          )}
        </table>
      </div>

      {pagination}
    </div>
  )
}

export default ProductTable
