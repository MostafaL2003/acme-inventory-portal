import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface UiState {
  isCommandPaletteOpen: boolean
  activeEditProductId: number | null
}

const initialState: UiState = {
  isCommandPaletteOpen: false,
  activeEditProductId: null,
}

function isValidProductId(id: number | null): id is number {
  return typeof id === 'number' && Number.isInteger(id) && id > 0
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCommandPalette: (state): void => {
      state.isCommandPaletteOpen = true
    },
    closeCommandPalette: (state): void => {
      state.isCommandPaletteOpen = false
    },
    toggleCommandPalette: (state): void => {
      state.isCommandPaletteOpen = !state.isCommandPaletteOpen
    },
    setCommandPaletteOpen: (state, action: PayloadAction<boolean>): void => {
      state.isCommandPaletteOpen = action.payload
    },
    openEditDrawer: (state, action: PayloadAction<number>): void => {
      if (!isValidProductId(action.payload)) return
      state.activeEditProductId = action.payload
      state.isCommandPaletteOpen = false
    },
    closeEditDrawer: (state): void => {
      state.activeEditProductId = null
    },
    setActiveEditProductId: (state, action: PayloadAction<number | null>): void => {
      const nextId = action.payload
      if (nextId !== null && !isValidProductId(nextId)) return
      state.activeEditProductId = nextId
      if (nextId !== null) {
        state.isCommandPaletteOpen = false
      }
    },
  },
})

export const {
  openCommandPalette,
  closeCommandPalette,
  toggleCommandPalette,
  setCommandPaletteOpen,
  openEditDrawer,
  closeEditDrawer,
  setActiveEditProductId,
} = uiSlice.actions

export const uiReducer = uiSlice.reducer

export default uiReducer

