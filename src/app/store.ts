import { configureStore } from '@reduxjs/toolkit'
import { selectionReducer } from '@/features/products'

export const store = configureStore({
  reducer: {
    selection: selectionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
