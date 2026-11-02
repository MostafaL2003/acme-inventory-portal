import { useState, useEffect, useMemo, useRef, useCallback, type JSX, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Search, LayoutDashboard, Package, ShoppingCart, Settings, XCircle, Edit3, CornerDownLeft, type LucideIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import { closeCommandPalette, openEditDrawer } from '@/shared/store'
import { clearSelection, type Product, type ProductsResponse } from '@/features/products'

export interface CommandItem {
  readonly id: string
  readonly label: string
  readonly category: 'Navigation' | 'Actions' | 'Products'
  readonly subtitle?: string
  readonly icon: LucideIcon
  readonly onSelect: () => void
}

export function CommandPaletteModal(): JSX.Element | null {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  const isOpen = useAppSelector((state) => state.ui.isCommandPaletteOpen)
  const selectedProductIds = useAppSelector((state) => state.selection.selectedProductIds)

  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClose = useCallback((): void => {
    setQuery('')
    setActiveIndex(0)
    dispatch(closeCommandPalette())
  }, [dispatch])

  useEffect(() => {
    if (!isOpen) return
    const frameId = window.requestAnimationFrame(() => inputRef.current?.focus())
    return (): void => window.cancelAnimationFrame(frameId)
  }, [isOpen])

  const cachedProducts = useMemo<Product[]>(() => {
    if (!isOpen) return []
    const map = new Map<number, Product>()
    queryClient.getQueryData<ProductsResponse>(['products'])?.products?.forEach((p) => map.set(p.id, p))
    for (const [, data] of queryClient.getQueriesData<ProductsResponse>({ queryKey: ['products'] })) {
      data?.products?.forEach((p) => map.set(p.id, p))
    }
    return Array.from(map.values())
  }, [isOpen, queryClient])

  const filteredCommands = useMemo<CommandItem[]>(() => {
    const q = query.trim().toLowerCase()
    const baseCommands: CommandItem[] = [
      { id: 'nav-dashboard', label: 'Go to Dashboard', category: 'Navigation', subtitle: '/dashboard', icon: LayoutDashboard, onSelect: () => navigate('/dashboard') },
      { id: 'nav-products', label: 'Go to Products', category: 'Navigation', subtitle: '/products', icon: Package, onSelect: () => navigate('/products') },
      { id: 'nav-orders', label: 'Go to Orders', category: 'Navigation', subtitle: '/orders', icon: ShoppingCart, onSelect: () => navigate('/orders') },
      { id: 'nav-settings', label: 'Go to Settings', category: 'Navigation', subtitle: '/settings', icon: Settings, onSelect: () => navigate('/settings') },
    ]

    if (selectedProductIds.length > 0) {
      baseCommands.push({
        id: 'action-clear-selection',
        label: 'Clear Selection',
        category: 'Actions',
        subtitle: `${selectedProductIds.length} selected`,
        icon: XCircle,
        onSelect: () => dispatch(clearSelection()),
      })
    }

    const matchingStatic = q === ''
      ? baseCommands
      : baseCommands.filter((c) => c.label.toLowerCase().includes(q) || c.category.toLowerCase().includes(q))

    const matchingProducts = cachedProducts
      .filter((p) => q === '' || p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
      .slice(0, q === '' ? 5 : 8)
      .map<CommandItem>((product) => ({
        id: `product-edit-${product.id}`,
        label: `Edit '${product.title}'`,
        category: 'Products',
        subtitle: `${product.sku} • $${product.price.toFixed(2)}`,
        icon: Edit3,
        onSelect: () => {
          if (!location.pathname.startsWith('/products')) navigate('/products')
          dispatch(openEditDrawer(product.id))
        },
      }))

    return [...matchingStatic, ...matchingProducts]
  }, [query, selectedProductIds.length, cachedProducts, navigate, dispatch, location.pathname])

  if (!isOpen) return null

  const safeIndex = filteredCommands.length > 0 ? Math.min(activeIndex, filteredCommands.length - 1) : 0

  const executeCommand = (item: CommandItem | undefined): void => {
    if (!item) return
    item.onSelect()
    handleClose()
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape') {
      event.preventDefault()
      handleClose()
      return
    }
    if (filteredCommands.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((safeIndex + 1) % filteredCommands.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((safeIndex - 1 + filteredCommands.length) % filteredCommands.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      executeCommand(filteredCommands[safeIndex])
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh] px-4 backdrop-blur-sm bg-slate-950/60"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0) }}
            placeholder="Type a command or search products..."
            aria-label="Search commands or products"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">ESC</kbd>
        </div>

        <div role="listbox" className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">No matching commands or cached products found.</div>
          ) : (
            filteredCommands.map((item, index) => {
              const Icon = item.icon
              const isSelected = index === safeIndex
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => executeCommand(item)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors cursor-pointer ${
                    isSelected ? 'bg-blue-600/25 text-white border border-blue-500/40' : 'text-slate-300 hover:bg-slate-800/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} aria-hidden="true" />
                    <span className="font-medium truncate">{item.label}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.subtitle && <span className="text-xs text-slate-400">{item.subtitle}</span>}
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />}
                  </div>
                </button>
              )
            })
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-800 bg-slate-900/90 text-xs text-slate-400">
          <span>↑↓ to navigate • ↵ to select • esc</span>
          <span>{filteredCommands.length} results</span>
        </div>
      </div>
    </div>
  )
}

export default CommandPaletteModal
