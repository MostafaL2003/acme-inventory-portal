import { type ReactNode } from 'react'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { store } from './store'
import { queryClient } from './queryClient'

export interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  )
}

export default Providers
