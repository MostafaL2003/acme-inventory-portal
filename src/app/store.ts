import { configureStore } from '@reduxjs/toolkit'
import { selectionReducer } from '@/features/products'
import { uiReducer } from '@/shared/store'

export const store = configureStore({
  reducer: {
    selection: selectionReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

