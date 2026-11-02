import { describe, it, expect } from 'vitest'
import {
  uiReducer,
  openCommandPalette,
  closeCommandPalette,
  toggleCommandPalette,
  openEditDrawer,
  closeEditDrawer,
  setActiveEditProductId,
  type UiState,
} from './uiSlice'

describe('uiSlice', () => {
  const initialState: UiState = {
    isCommandPaletteOpen: false,
    activeEditProductId: null,
  }

  it('should initialize with command palette and drawer closed', () => {
    expect(uiReducer(undefined, { type: '@@INIT' })).toEqual({
      isCommandPaletteOpen: false,
      activeEditProductId: null,
    })
  })

  it('should open, close, and toggle command palette state', () => {
    let state = uiReducer(initialState, openCommandPalette())
    expect(state.isCommandPaletteOpen).toBe(true)

    state = uiReducer(state, closeCommandPalette())
    expect(state.isCommandPaletteOpen).toBe(false)

    state = uiReducer(state, toggleCommandPalette())
    expect(state.isCommandPaletteOpen).toBe(true)

    state = uiReducer(state, toggleCommandPalette())
    expect(state.isCommandPaletteOpen).toBe(false)
  })

  it('should set activeEditProductId and close command palette when opening drawer', () => {
    const paletteOpenState: UiState = {
      isCommandPaletteOpen: true,
      activeEditProductId: null,
    }

    const state = uiReducer(paletteOpenState, openEditDrawer(42))
    expect(state.activeEditProductId).toBe(42)
    expect(state.isCommandPaletteOpen).toBe(false)
  })

  it('should ignore invalid product ids when opening edit drawer', () => {
    const state = uiReducer(initialState, openEditDrawer(-1))
    expect(state.activeEditProductId).toBe(null)
  })

  it('should clear activeEditProductId when closing drawer', () => {
    const openState: UiState = {
      isCommandPaletteOpen: false,
      activeEditProductId: 12,
    }

    const state = uiReducer(openState, closeEditDrawer())
    expect(state.activeEditProductId).toBe(null)
  })

  it('should close command palette when setting a valid product id via setActiveEditProductId', () => {
    const paletteOpenState: UiState = {
      isCommandPaletteOpen: true,
      activeEditProductId: null,
    }

    const state = uiReducer(paletteOpenState, setActiveEditProductId(99))
    expect(state.activeEditProductId).toBe(99)
    expect(state.isCommandPaletteOpen).toBe(false)
  })
})

