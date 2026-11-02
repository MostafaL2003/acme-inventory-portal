import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertOctagon, RotateCcw } from 'lucide-react'

export interface AppErrorBoundaryProps {
  readonly children: ReactNode
  readonly fallback?:
    | ReactNode
    | ((props: { error: Error; reset: () => void }) => ReactNode)
  readonly onReset?: () => void
}

interface AppErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  public override state: AppErrorBoundaryState = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { hasError: true, error }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Unhandled UI exception in AppErrorBoundary:', error, errorInfo)
  }

  public reset = (): void => {
    this.props.onReset?.()
    this.setState({ hasError: false, error: null })
  }

  public override render(): ReactNode {
    const { hasError, error } = this.state
    const { children, fallback } = this.props

    if (!hasError || !error) {
      return children
    }

    if (typeof fallback === 'function') {
      return fallback({ error, reset: this.reset })
    }

    if (fallback) {
      return fallback
    }

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="min-h-[40vh] flex flex-col items-center justify-center p-6 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-4 text-rose-600 shadow-xs">
          <AlertOctagon className="w-7 h-7" aria-hidden="true" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Application Error Encountered
        </h3>

        <p className="text-sm text-slate-500 max-w-md mt-2">
          {error.message || 'An unexpected error interrupted this view.'}
        </p>

        <button
          type="button"
          onClick={this.reset}
          className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Reset and Retry</span>
        </button>
      </div>
    )
  }
}

export default AppErrorBoundary
