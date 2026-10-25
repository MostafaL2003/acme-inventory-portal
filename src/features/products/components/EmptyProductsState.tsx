import { PackageSearch } from 'lucide-react'

interface EmptyProductsStateProps {
  onResetFilters?: () => void
}

export function EmptyProductsState({ onResetFilters }: EmptyProductsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <PackageSearch className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">
        No products found
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-4">
        No inventory items matched your active search or filter criteria. Try adjusting your query or reset filters.
      </p>
      {onResetFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          Reset Filters
        </button>
      )}
    </div>
  )
}

export default EmptyProductsState

