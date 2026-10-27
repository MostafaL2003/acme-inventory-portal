import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface FilterOption {
  value: string
  label: string
}

interface FilterDropdownProps {
  label: string
  options: FilterOption[]
  selected: string | string[]
  onChange: (value: string | string[]) => void
  isMulti?: boolean
  className?: string
}

export function FilterDropdown({
  label,
  options,
  selected,
  onChange,
  isMulti = false,
  className = '',
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedArray = Array.isArray(selected) ? selected : selected ? [selected] : []
  const hasSelection = selectedArray.length > 0 && selectedArray[0] !== 'all'

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleToggleMulti = (value: string) => {
    const next = selectedArray.includes(value)
      ? selectedArray.filter((item) => item !== value)
      : [...selectedArray, value]
    onChange(next)
  }

  const handleSelectSingle = (value: string) => {
    onChange(value === 'all' ? '' : value)
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange(isMulti ? [] : '')
  }

  const getDisplayLabel = () => {
    if (!hasSelection) return label
    if (isMulti) {
      return `${label} (${selectedArray.length})`
    }
    const found = options.find((opt) => opt.value === selectedArray[0])
    return found ? found.label : label
  }

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={`inline-flex items-center justify-between gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer ${
          hasSelection
            ? 'bg-blue-50/70 border-blue-300 text-blue-700 hover:bg-blue-100/60'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
      >
        <span>{getDisplayLabel()}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 min-w-[200px] max-h-64 overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-40">
          {hasSelection && (
            <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">
                {isMulti ? `${selectedArray.length} selected` : 'Filtered'}
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          <div className="py-1">
            {options.map((option) => {
              if (isMulti) {
                const isChecked = selectedArray.includes(option.value)
                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleMulti(option.value)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className={isChecked ? 'font-medium text-slate-900' : ''}>
                      {option.label}
                    </span>
                  </label>
                )
              }

              const isSelected =
                (!hasSelection && option.value === 'all') ||
                selectedArray[0] === option.value ||
                (!selectedArray[0] && option.value === '')

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelectSingle(option.value)}
                  className={`w-full text-left px-3 py-1.5 text-sm flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors ${
                    isSelected ? 'font-medium text-blue-600 bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterDropdown

