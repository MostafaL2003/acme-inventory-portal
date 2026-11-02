import { type JSX } from 'react'
import { Check, EyeOff, Upload, Trash2, X, Loader2 } from 'lucide-react'
import { useAppSelector } from '@/shared/hooks'

export interface BatchSelectionDockProps {
  readonly selectedIds?: readonly number[]
  readonly isProcessing?: boolean
  readonly onMarkOutOfStock?: (ids: readonly number[]) => void
  readonly onBulkRestock?: (ids: readonly number[]) => void
  readonly onDeleteSelected?: (ids: readonly number[]) => void
  readonly onClearSelection?: () => void
}

export function BatchSelectionDock({
  selectedIds,
  isProcessing = false,
  onMarkOutOfStock,
  onBulkRestock,
  onDeleteSelected,
  onClearSelection,
}: BatchSelectionDockProps): JSX.Element | null {
  const storeSelectedIds = useAppSelector(
    (state) => state.selection.selectedProductIds,
  )

  const activeIds = selectedIds !== undefined ? selectedIds : storeSelectedIds
  const count = activeIds.length

  if (count === 0) return null

  return (
    <div
      role="region"
      aria-label="Batch selection actions"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw]"
    >
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl whitespace-nowrap overflow-x-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-xs font-medium text-slate-100">
          {isProcessing ? (
            <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0" aria-hidden="true" />
          ) : (
            <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" aria-hidden="true" />
          )}
          <span>
            {count} {count === 1 ? 'item' : 'items'} selected
          </span>
        </div>

        <div className="h-5 w-px bg-slate-700/80 shrink-0" aria-hidden="true" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => onMarkOutOfStock?.(activeIds)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/40 text-xs font-medium text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <EyeOff className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Mark Out of Stock</span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => onBulkRestock?.(activeIds)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-950/70 hover:bg-blue-900/80 border border-blue-500/40 text-xs font-medium text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Bulk Restock (+50)</span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => onDeleteSelected?.(activeIds)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 border border-rose-500/40 text-xs font-medium text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Delete Selected</span>
          </button>
        </div>

        <div className="h-5 w-px bg-slate-700/80 shrink-0" aria-hidden="true" />

        <button
          type="button"
          disabled={isProcessing}
          onClick={onClearSelection}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Clear Selection</span>
        </button>
      </div>
    </div>
  )
}

export default BatchSelectionDock
