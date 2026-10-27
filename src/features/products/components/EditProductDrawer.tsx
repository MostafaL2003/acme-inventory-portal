import { useState, useEffect, type FormEvent } from 'react'
import { X, Plus, Minus, ChevronDown } from 'lucide-react'
import type { Product } from '../types'

export interface EditProductDrawerProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  categories?: string[]
  onSave?: (updatedProduct: Partial<Product>) => void
  isSaving?: boolean
}

const formatCategory = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export function EditProductDrawer({
  isOpen,
  onClose,
  product,
  categories = [],
  onSave,
  isSaving = false,
}: EditProductDrawerProps) {
  const [prevProductId, setPrevProductId] = useState<number | null>(product?.id ?? null)
  const [title, setTitle] = useState(product?.title ?? '')
  const [price, setPrice] = useState<string | number>(product?.price ?? '')
  const [stock, setStock] = useState<string | number>(product?.stock ?? 0)
  const [category, setCategory] = useState(product?.category ?? '')

  if (product && product.id !== prevProductId) {
    setPrevProductId(product.id)
    setTitle(product.title)
    setPrice(product.price)
    setStock(product.stock)
    setCategory(product.category)
  }

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSave?.({ title: title.trim(), price: Number(price) || 0, stock: Number(stock) || 0, category })
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} aria-hidden="true" />

      <aside aria-label="Edit Product Details" className="relative z-10 w-full max-w-md bg-white shadow-2xl flex flex-col h-full overflow-hidden">
        <header className="px-6 py-5 border-b border-slate-200 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Edit Product Details</h2>
            <p className="text-sm text-slate-500 mt-1">Mass update or edit primary details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit drawer"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div>
              <label htmlFor="drawer-sku" className="block text-sm font-medium text-slate-700 mb-1.5">SKU</label>
              <input
                id="drawer-sku"
                type="text"
                disabled
                value={product?.sku || (product?.id ? `SKU-${product.id}` : '')}
                className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed select-none"
              />
            </div>

            <div>
              <label htmlFor="drawer-title" className="block text-sm font-medium text-slate-700 mb-1.5">Product Title</label>
              <input
                id="drawer-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter product title"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="drawer-price" className="block text-sm font-medium text-slate-700 mb-1.5">Price ($)</label>
              <input
                id="drawer-price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="drawer-stock" className="block text-sm font-medium text-slate-700 mb-1.5">Stock Quantity</label>
              <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <button
                  type="button"
                  aria-label="Decrease stock"
                  onClick={() => setStock((prev) => Math.max(0, (Number(prev) || 0) - 1))}
                  className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-r border-slate-300 transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  id="drawer-stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full py-2 text-center text-sm font-medium text-slate-900 focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Increase stock"
                  onClick={() => setStock((prev) => (Number(prev) || 0) + 1)}
                  className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-l border-slate-300 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="drawer-category" className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <div className="relative">
                <select
                  id="drawer-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer pr-10"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{formatCategory(cat)}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <footer className="p-6 border-t border-slate-200 bg-white flex items-center justify-between">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium text-sm rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </footer>
        </form>
      </aside>
    </div>
  )
}

export default EditProductDrawer
