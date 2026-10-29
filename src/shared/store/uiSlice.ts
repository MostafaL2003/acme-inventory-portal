import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface UiState {
  isCommandPaletteOpen: boolean
  activeEditProductId: number | null
}

const initialState: UiState = {
  isCommandPaletteOpen: false,
  activeEditProductId: null,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCommandPalette: (state) => {
      state.isCommandPaletteOpen = true
    },
    closeCommandPalette: (state) => {
      state.isCommandPaletteOpen = false
    },
    toggleCommandPalette: (state) => {
      state.isCommandPaletteOpen = !state.isCommandPaletteOpen
    },
    setCommandPaletteOpen: (state, action: PayloadAction<boolean>) => {
      state.isCommandPaletteOpen = action.payload
    },
    openEditDrawer: (state, action: PayloadAction<number>) => {
      state.activeEditProductId = action.payload
    },
    closeEditDrawer: (state) => {
      state.activeEditProductId = null
    },
    setActiveEditProductId: (state, action: PayloadAction<number | null>) => {
      state.activeEditProductId = action.payload
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


