import { ChevronDown } from 'lucide-react'

export interface PaginationBarProps {
  currentPage: number
  totalItems: number
  pageSize: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages]
  }

  if (currentPage >= totalPages - 3) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}

export function PaginationBar({
  currentPage,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
}: PaginationBarProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems)

  const pages = getPageNumbers(safeCurrentPage, totalPages)

  const isFirstPage = safeCurrentPage <= 1
  const isLastPage = safeCurrentPage >= totalPages

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 px-4 py-3 bg-white border-t border-slate-200 text-xs md:text-sm text-slate-600">
      <div className="flex items-center gap-3">
        <span>
          Showing{' '}
          <strong className="font-semibold text-slate-800">
            {startItem}-{endItem}
          </strong>{' '}
          of{' '}
          <strong className="font-semibold text-slate-800">
            {totalItems.toLocaleString()}
          </strong>{' '}
          products
        </span>

        {onPageSizeChange && (
          <div className="relative inline-block">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Rows per page"
              className="appearance-none pl-3 pr-7 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:border-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  Show {opt} rows
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}
      </div>

      <nav aria-label="Pagination Navigation" className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
          className="px-2 py-1 text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
        >
          First
        </button>

        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={isFirstPage}
          className="px-2 py-1 text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
        >
          Prev
        </button>

        <div className="flex items-center gap-1 mx-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1 text-slate-400 select-none"
                >
                  ...
                </span>
              )
            }

            const pageNum = p as number
            const isActive = pageNum === safeCurrentPage

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-8 h-8 px-2 flex items-center justify-center rounded-lg text-xs md:text-sm transition-colors cursor-pointer ${
                  isActive
                    ? 'font-semibold bg-slate-100 text-slate-900'
                    : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={isLastPage}
          className="px-2 py-1 text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
        >
          Next
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={isLastPage}
          className="px-2 py-1 text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
        >
          Last
        </button>
      </nav>
    </div>
  )
}

export default PaginationBar

