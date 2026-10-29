import { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, ChevronDown } from 'lucide-react'
import { FeedbackToast } from '@/shared/components'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import { openEditDrawer, closeEditDrawer } from '@/shared/store'
import { DEFAULT_CATEGORY_SLUGS } from '../constants'
import { useUrlProductFilters } from '../hooks/useUrlProductFilters'
import { useProductsQuery } from '../hooks/useProductsQuery'
import { useCategoriesQuery } from '../hooks/useCategoriesQuery'
import { useUpdateProductMutation } from '../hooks/useUpdateProductMutation'
import { ProductTable } from './ProductTable'
import { ProductFilterToolbar } from './ProductFilterToolbar'
import { PaginationBar } from './PaginationBar'
import { EditProductDrawer } from './EditProductDrawer'
import type { Product, ProductsResponse } from '../types'

interface ToastState {
  type: 'success' | 'error'
  message: string
}

export function ProductsPage() {
  const dispatch = useAppDispatch()
  const activeEditProductId = useAppSelector((state) => state.ui.activeEditProductId)
  const queryClient = useQueryClient()

  const { filters, queryParams, setPage, setPageSize, resetFilters } = useUrlProductFilters()
  const { data: productsData, isLoading } = useProductsQuery(queryParams)
  const { data: categories = DEFAULT_CATEGORY_SLUGS } = useCategoriesQuery()
  const updateProductMutation = useUpdateProductMutation()
  const [toast, setToast] = useState<ToastState | null>(null)

  const editingProduct = useMemo<Product | null>(() => {
    if (activeEditProductId === null) return null
    const fromCurrentPage = productsData?.products.find((p) => p.id === activeEditProductId)
    if (fromCurrentPage) return fromCurrentPage

    const cachedEntries = queryClient.getQueriesData<ProductsResponse>({ queryKey: ['products'] })
    for (const [, cachedData] of cachedEntries) {
      const found = cachedData?.products.find((p) => p.id === activeEditProductId)
      if (found) return found
    }
    return null
  }, [activeEditProductId, productsData, queryClient])

  const totalItems = productsData?.total ?? 0

  const handleSaveProduct = (updatedFields: Partial<Product>) => {
    if (!editingProduct || updateProductMutation.isPending) return

    updateProductMutation.mutate(
      { id: editingProduct.id, data: updatedFields },
      {
        onSuccess: (updated) => {
          dispatch(closeEditDrawer())
          setToast({
            type: 'success',
            message: `"${updatedFields.title || updated.title}" updated successfully.`,
          })
        },
        onError: (err) => {
          setToast({
            type: 'error',
            message: err.message || 'Failed to update product. Please try again.',
          })
        },
      },
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Product Catalog
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200/70 text-slate-600">
            {isLoading ? '...' : totalItems.toLocaleString()} items
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

      <ProductFilterToolbar categories={categories} />

      <ProductTable
        products={productsData?.products ?? []}
        isLoading={isLoading}
        onAction={(product) => dispatch(openEditDrawer(product.id))}
        onResetFilters={resetFilters}
        pagination={
          <PaginationBar
            currentPage={filters.page}
            totalItems={totalItems}
            pageSize={filters.limit}
            pageSizeOptions={[10, 20, 50, 100]}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        }
      />

      <EditProductDrawer
        isOpen={Boolean(editingProduct)}
        onClose={() => dispatch(closeEditDrawer())}
        product={editingProduct}
        categories={categories}
        onSave={handleSaveProduct}
        isSaving={updateProductMutation.isPending}
      />

      {toast && (
        <FeedbackToast
          type={toast.type}
          message={toast.message}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default ProductsPage

