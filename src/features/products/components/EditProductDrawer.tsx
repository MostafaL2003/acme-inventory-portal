import { useEffect, useRef, useMemo, type KeyboardEvent as ReactKeyboardEvent, type JSX } from 'react'
import { X, Plus, Minus, ChevronDown, Loader2 } from 'lucide-react'
import type { Product } from '../types'
import { useProductForm } from '../hooks/useProductForm'

export interface EditProductDrawerProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly product: Product | null
  readonly categories?: readonly string[]
  readonly onSave?: (updatedProduct: Partial<Product>) => void
  readonly isSaving?: boolean
}

const formatCategory = (slug: string): string =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export function EditProductDrawer({
  isOpen,
  onClose,
  product,
  categories = [],
  onSave,
  isSaving = false,
}: EditProductDrawerProps): JSX.Element | null {
  const drawerRef = useRef<HTMLElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const {
    values,
    errors,
    setTitle,
    setPrice,
    setStock,
    setCategory,
    incrementStock,
    decrementStock,
    handleSubmit,
  } = useProductForm(product, (updated): void => {
    if (!isSaving) onSave?.(updated)
  })

  const categoryOptions = useMemo<string[]>(() => {
    const set = new Set(categories)
    return values.category && !set.has(values.category) ? [values.category, ...categories] : Array.from(set)
  }, [categories, values.category])

  useEffect(() => {
    if (isOpen) titleInputRef.current?.focus()
  }, [isOpen, product?.id])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLElement>): void => {
    if (e.key === 'Escape' && !isSaving) {
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key === 'Tab' && drawerRef.current) {
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  const inputClass = (hasError: boolean): string =>
    `w-full px-3.5 py-2 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors disabled:opacity-60 ${
      hasError ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
    }`

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onKeyDown={handleKeyDown}>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={() => !isSaving && onClose()} aria-hidden="true" />

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-drawer-title"
        aria-describedby="edit-drawer-desc"
        className="relative z-10 w-full max-w-md bg-white shadow-2xl flex flex-col h-full overflow-hidden"
      >
        <header className="px-6 py-5 border-b border-slate-200 flex items-start justify-between">
          <div>
            <h2 id="edit-drawer-title" className="text-xl font-bold text-slate-900 tracking-tight">Edit Product Details</h2>
            <p id="edit-drawer-desc" className="text-sm text-slate-500 mt-1">Mass update or edit primary details</p>
          </div>
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            aria-label="Close edit drawer"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div>
              <label htmlFor="drawer-sku" className="block text-sm font-medium text-slate-700 mb-1.5">SKU</label>
              <input id="drawer-sku" type="text" disabled value={product?.sku || (product?.id ? `SKU-${product.id}` : '')} className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed select-none" />
            </div>

            <div>
              <label htmlFor="drawer-title" className="block text-sm font-medium text-slate-700 mb-1.5">Product Title</label>
              <input ref={titleInputRef} id="drawer-title" type="text" disabled={isSaving} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'drawer-title-error' : undefined} value={values.title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter product title" className={inputClass(Boolean(errors.title))} />
              {errors.title && <p id="drawer-title-error" role="alert" className="text-xs text-rose-600 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="drawer-price" className="block text-sm font-medium text-slate-700 mb-1.5">Price ($)</label>
              <input id="drawer-price" type="number" step="0.01" min="0" disabled={isSaving} aria-invalid={Boolean(errors.price)} aria-describedby={errors.price ? 'drawer-price-error' : undefined} value={values.price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className={inputClass(Boolean(errors.price))} />
              {errors.price && <p id="drawer-price-error" role="alert" className="text-xs text-rose-600 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="drawer-stock" className="block text-sm font-medium text-slate-700 mb-1.5">Stock Quantity</label>
              <div className={`flex items-center rounded-lg border bg-white overflow-hidden focus-within:ring-2 ${errors.stock ? 'border-rose-400 focus-within:ring-rose-400' : 'border-slate-300 focus-within:ring-blue-500 focus-within:border-blue-500'}`}>
                <button type="button" disabled={isSaving} aria-label="Decrease stock" onClick={decrementStock} className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-r border-slate-300 focus:outline-none focus-visible:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50">
                  <Minus className="w-4 h-4" />
                </button>
                <input id="drawer-stock" type="number" min="0" disabled={isSaving} aria-invalid={Boolean(errors.stock)} aria-describedby={errors.stock ? 'drawer-stock-error' : undefined} value={values.stock} onChange={(e) => setStock(e.target.value)} className="w-full py-2 text-center text-sm font-medium text-slate-900 focus:outline-none disabled:opacity-60" />
                <button type="button" disabled={isSaving} aria-label="Increase stock" onClick={incrementStock} className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-l border-slate-300 focus:outline-none focus-visible:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {errors.stock && <p id="drawer-stock-error" role="alert" className="text-xs text-rose-600 mt-1">{errors.stock}</p>}
            </div>

            <div>
              <label htmlFor="drawer-category" className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <div className="relative">
                <select id="drawer-category" disabled={isSaving} aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? 'drawer-category-error' : undefined} value={values.category} onChange={(e) => setCategory(e.target.value)} className={`${inputClass(Boolean(errors.category))} appearance-none cursor-pointer pr-10`}>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{formatCategory(cat)}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.category && <p id="drawer-category-error" role="alert" className="text-xs text-rose-600 mt-1">{errors.category}</p>}
            </div>
          </div>

          <footer className="p-6 border-t border-slate-200 bg-white flex items-center justify-between">
            <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
            <button type="button" disabled={isSaving} onClick={onClose} className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium text-sm rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors cursor-pointer disabled:opacity-50">
              Cancel
            </button>
          </footer>
        </form>
      </aside>
    </div>
  )
}

export default EditProductDrawer

