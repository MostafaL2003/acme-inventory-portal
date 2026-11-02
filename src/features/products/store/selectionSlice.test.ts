import { describe, it, expect } from 'vitest'
import {
  selectionReducer,
  toggleSelectId,
  selectAllIds,
  deselectIds,
  clearSelection,
  type SelectionState,
} from './selectionSlice'

describe('selectionSlice', () => {
  const initialState: SelectionState = {
    selectedProductIds: [],
  }

  it('should initialize with an empty selection array', () => {
    expect(selectionReducer(undefined, { type: '@@INIT' })).toEqual({
      selectedProductIds: [],
    })
  })

  it('should toggle an id into the selection when absent', () => {
    const state = selectionReducer(initialState, toggleSelectId(101))
    expect(state.selectedProductIds).toEqual([101])
  })

  it('should toggle an id out of the selection when already present', () => {
    const stateWithItem: SelectionState = { selectedProductIds: [101, 102] }
    const state = selectionReducer(stateWithItem, toggleSelectId(101))
    expect(state.selectedProductIds).toEqual([102])
  })

  it('should ignore non-positive or non-integer ids', () => {
    const state1 = selectionReducer(initialState, toggleSelectId(0))
    expect(state1.selectedProductIds).toEqual([])

    const state2 = selectionReducer(initialState, toggleSelectId(-5))
    expect(state2.selectedProductIds).toEqual([])

    const state3 = selectionReducer(initialState, toggleSelectId(3.14))
    expect(state3.selectedProductIds).toEqual([])
  })

  it('should select all provided valid ids and deduplicate them', () => {
    const state = selectionReducer(initialState, selectAllIds([1, 2, 2, 3, 0, -1]))
    expect(state.selectedProductIds).toEqual([1, 2, 3])
  })

  it('should deselect specified ids when deleting or clearing a subset', () => {
    const stateWithItems: SelectionState = { selectedProductIds: [10, 20, 30, 40] }
    const state = selectionReducer(stateWithItems, deselectIds([20, 40]))
    expect(state.selectedProductIds).toEqual([10, 30])
  })

  it('should empty selectedProductIds when deselecting all selected ids', () => {
    const stateWithItems: SelectionState = { selectedProductIds: [10, 20] }
    const state = selectionReducer(stateWithItems, deselectIds([10, 20]))
    expect(state.selectedProductIds).toEqual([])
  })

  it('should clear selection completely on clearSelection', () => {
    const stateWithItems: SelectionState = { selectedProductIds: [1, 2, 3, 4, 5] }
    const state = selectionReducer(stateWithItems, clearSelection())
    expect(state.selectedProductIds).toEqual([])
  })
})
