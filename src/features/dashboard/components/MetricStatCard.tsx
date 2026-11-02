import { type JSX, type ReactNode } from 'react'

export interface MetricStatCardProps {
  readonly title: string
  readonly value: string | number
  readonly subtitle?: string
  readonly icon?: ReactNode
  readonly isLoading?: boolean
}

export function MetricStatCard({
  title,
  value,
  subtitle,
  icon,
  isLoading = false,
}: MetricStatCardProps): JSX.Element {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[110px]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500">
          {title}
        </span>
        {icon && <div className="shrink-0">{icon}</div>}
      </div>

      <div className="mt-2">
        {isLoading ? (
          <div className="h-8 w-28 bg-slate-200 animate-pulse rounded-md" />
        ) : (
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {value}
            </span>
            {subtitle && (
              <span className="text-xs text-slate-400 font-medium">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MetricStatCard
