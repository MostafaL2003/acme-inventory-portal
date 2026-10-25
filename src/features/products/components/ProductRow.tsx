import { MoreHorizontal } from 'lucide-react'
import type { Product } from '../types'
import { StockStatusBadge } from './StockStatusBadge'

interface ProductRowProps {
  product: Product
  isSelected?: boolean
  onToggleSelect?: (id: number) => void
  onAction?: (product: Product) => void
}

export function ProductRow({
  product,
  isSelected = false,
  onToggleSelect,
  onAction,
}: ProductRowProps) {
  return (
    <tr
      className={`border-b border-slate-100 transition-colors ${
        isSelected ? 'bg-blue-50/60 hover:bg-blue-50' : 'hover:bg-slate-50/70'
      }`}
    >
      <td className="w-12 px-4 py-3.5 text-center">
        <input
          type="checkbox"
          aria-label={`Select ${product.title}`}
          checked={isSelected}
          onChange={() => onToggleSelect?.(product.id)}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      </td>

      <td className="px-4 py-3.5 font-normal text-sm text-slate-700 whitespace-nowrap">
        {product.sku}
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-11 h-11 rounded-lg object-contain bg-slate-50 border border-slate-200 p-1 shrink-0"
          loading="lazy"
        />
      </td>

      <td className="px-4 py-3.5 font-medium text-sm text-slate-900 whitespace-nowrap">
        {product.title}
      </td>

      <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
        {product.category}
      </td>

      <td className="px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap">
        {product.stock.toLocaleString()}
      </td>

      <td className="px-4 py-3.5 text-sm font-medium text-slate-800 whitespace-nowrap">
        ${product.price.toFixed(2)}
      </td>

      <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">
        {product.location || 'Aisle 1-A'}
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap">
        <StockStatusBadge stock={product.stock} status={product.status} />
      </td>

      <td className="px-4 py-3.5 text-center whitespace-nowrap">
        <button
          type="button"
          aria-label={`Actions for ${product.title}`}
          onClick={() => onAction?.(product)}
          className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </td>
    </tr>
  )
}

export default ProductRow
