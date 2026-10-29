import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface SelectionState {
  selectedProductIds: number[]
}

const initialState: SelectionState = {
  selectedProductIds: [],
}

export const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    toggleSelectId: (state, action: PayloadAction<number>) => {
      const id = action.payload
      const index = state.selectedProductIds.indexOf(id)
      if (index >= 0) {
        state.selectedProductIds.splice(index, 1)
      } else {
        state.selectedProductIds.push(id)
      }
    },
    selectAllIds: (state, action: PayloadAction<number[]>) => {
      state.selectedProductIds = Array.from(new Set(action.payload))
    },
    clearSelection: (state) => {
      state.selectedProductIds = []
    },
  },
})

export const { toggleSelectId, selectAllIds, clearSelection } = selectionSlice.actions
export const selectionReducer = selectionSlice.reducer

export default selectionReducer

