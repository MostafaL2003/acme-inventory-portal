import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface SelectionState {
  selectedProductIds: number[]
}

const initialState: SelectionState = {
  selectedProductIds: [],
}

function isValidProductId(id: number): boolean {
  return Number.isInteger(id) && id > 0
}

export const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    toggleSelectId: (state, action: PayloadAction<number>): void => {
      const id = action.payload
      if (!isValidProductId(id)) return

      const index = state.selectedProductIds.indexOf(id)
      if (index >= 0) {
        state.selectedProductIds.splice(index, 1)
      } else {
        state.selectedProductIds.push(id)
      }
    },
    selectAllIds: (state, action: PayloadAction<readonly number[]>): void => {
      const uniqueValidIds = Array.from(
        new Set(action.payload.filter(isValidProductId)),
      )
      if (
        uniqueValidIds.length === state.selectedProductIds.length &&
        uniqueValidIds.every((id, idx) => id === state.selectedProductIds[idx])
      ) {
        return
      }
      state.selectedProductIds = uniqueValidIds
    },
    clearSelection: (state): void => {
      if (state.selectedProductIds.length === 0) return
      state.selectedProductIds = []
    },
  },
})

export const { toggleSelectId, selectAllIds, clearSelection } = selectionSlice.actions
export const selectionReducer = selectionSlice.reducer

export default selectionReducer

