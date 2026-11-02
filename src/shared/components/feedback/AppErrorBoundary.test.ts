import { describe, it, expect, vi } from 'vitest'
import { AppErrorBoundary } from './AppErrorBoundary'

describe('AppErrorBoundary', () => {
  it('updates state via getDerivedStateFromError on exception', () => {
    const testError = new Error('Test component explosion')
    const nextState = AppErrorBoundary.getDerivedStateFromError(testError)

    expect(nextState.hasError).toBe(true)
    expect(nextState.error).toBe(testError)
  })

  it('logs error info in componentDidCatch', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const boundary = new AppErrorBoundary({ children: 'Healthy child' })
    const testError = new Error('Caught exception')
    const testInfo = { componentStack: 'at ProblemChild' }

    boundary.componentDidCatch(testError, testInfo)

    expect(consoleError).toHaveBeenCalledWith(
      'Unhandled UI exception in AppErrorBoundary:',
      testError,
      testInfo,
    )
    consoleError.mockRestore()
  })

  it('calls setState to reset and triggers onReset when reset is invoked', () => {
    let wasResetCalled = false
    const boundary = new AppErrorBoundary({
      children: 'Healthy child',
      onReset: () => {
        wasResetCalled = true
      },
    })

    const setStateSpy = vi.spyOn(boundary, 'setState').mockImplementation(() => {})

    boundary.reset()

    expect(setStateSpy).toHaveBeenCalledWith({
      hasError: false,
      error: null,
    })
    expect(wasResetCalled).toBe(true)
  })
})
