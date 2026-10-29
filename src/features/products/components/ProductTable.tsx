import { useRef, useEffect, useMemo, useCallback, type ReactNode, type JSX } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import type { Product } from '../types'
import { SAMPLE_IMAGE_PRODUCTS } from '../constants'
import { toggleSelectId, selectAllIds } from '../store/selectionSlice'
import { ProductRow } from './ProductRow'
import { ProductTableSkeleton } from './ProductTableSkeleton'
import { EmptyProductsState } from './EmptyProductsState'

export interface ProductTableProps {
  readonly products?: readonly Product[]
  readonly isLoading?: boolean
  readonly selectedIds?: readonly number[]
  readonly onToggleSelect?: (id: number) => void
  readonly onToggleSelectAll?: (ids: number[]) => void
  readonly onAction?: (product: Product) => void
  readonly onResetFilters?: () => void
  readonly pagination?: ReactNode
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
}: ProductTableProps): JSX.Element {
  const dispatch = useAppDispatch()
  const storeSelectedIds = useAppSelector((state) => state.selection.selectedProductIds)
  const headerCheckboxRef = useRef<HTMLInputElement>(null)

  const activeSelected = selectedIds !== undefined ? selectedIds : storeSelectedIds
  const selectedSet = useMemo(() => new Set(activeSelected), [activeSelected])

  const { allSelected, someSelected } = useMemo(() => {
    if (products.length === 0) return { allSelected: false, someSelected: false }
    let matchedCount = 0
    for (const product of products) {
      if (selectedSet.has(product.id)) matchedCount += 1
    }
    return {
      allSelected: matchedCount === products.length,
      someSelected: matchedCount > 0,
    }
  }, [products, selectedSet])

  const isIndeterminate = someSelected && !allSelected

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate
    }
  }, [isIndeterminate])

  const handleToggle = useCallback(
    (id: number): void => {
      if (onToggleSelect) {
        onToggleSelect(id)
      } else {
        dispatch(toggleSelectId(id))
      }
    },
    [dispatch, onToggleSelect],
  )

  const handleSelectAll = useCallback((): void => {
    if (products.length === 0) return
    const pageIdSet = new Set(products.map((p) => p.id))
    const nextSelectedIds = allSelected
      ? activeSelected.filter((id) => !pageIdSet.has(id))
      : Array.from(new Set([...activeSelected, ...pageIdSet]))

    if (onToggleSelectAll) {
      onToggleSelectAll(nextSelectedIds)
    } else {
      dispatch(selectAllIds(nextSelectedIds))
    }
  }, [products, allSelected, activeSelected, onToggleSelectAll, dispatch])

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table
          aria-label="Inventory products"
          aria-busy={isLoading}
          className="w-full text-left border-collapse"
        >
          <thead>
            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 bg-white">
              <th scope="col" className="w-12 px-4 py-3.5 text-center">
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  aria-label="Select all products on current page"
                  aria-checked={isIndeterminate ? 'mixed' : allSelected}
                  disabled={isLoading || products.length === 0}
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </th>
              <th scope="col" className="px-4 py-3.5">SKU</th>
              <th scope="col" className="px-4 py-3.5">Thumbnail</th>
              <th scope="col" className="px-4 py-3.5">Product Name</th>
              <th scope="col" className="px-4 py-3.5">Category</th>
              <th scope="col" className="px-4 py-3.5">Stock</th>
              <th scope="col" className="px-4 py-3.5">Price</th>
              <th scope="col" className="px-4 py-3.5">Location</th>
              <th scope="col" className="px-4 py-3.5">Status</th>
              <th scope="col" className="px-4 py-3.5 text-center">Actions</th>
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
                  isSelected={selectedSet.has(product.id)}
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

