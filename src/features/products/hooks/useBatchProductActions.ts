import { useState, useCallback } from 'react'
import { useQueryClient, type QueryClient } from '@tanstack/react-query'
import { updateProduct, deleteProduct } from '../api'
import type { Product, ProductsResponse } from '../types'

export interface UseBatchProductActionsOptions {
  readonly onSuccess?: (message: string) => void
  readonly onError?: (error: Error) => void
}

export interface UseBatchProductActionsResult {
  readonly isProcessing: boolean
  readonly markOutOfStock: (ids: readonly number[]) => Promise<void>
  readonly bulkRestock: (ids: readonly number[], amount?: number) => Promise<void>
  readonly deleteSelected: (ids: readonly number[]) => Promise<void>
}

function getProductsFromCache(queryClient: QueryClient): Map<number, Product> {
  const map = new Map<number, Product>()
  const entries = queryClient.getQueriesData<ProductsResponse>({
    queryKey: ['products'],
  })
  for (const [, data] of entries) {
    if (data?.products && Array.isArray(data.products)) {
      for (const item of data.products) {
        map.set(item.id, item)
      }
    }
  }
  return map
}

export function useBatchProductActions(
  options?: UseBatchProductActionsOptions,
): UseBatchProductActionsResult {
  const queryClient = useQueryClient()
  const [isProcessing, setIsProcessing] = useState(false)

  const markOutOfStock = useCallback(
    async (ids: readonly number[]): Promise<void> => {
      if (ids.length === 0) return
      setIsProcessing(true)
      try {
        await queryClient.cancelQueries({ queryKey: ['products'] })

        await Promise.all(ids.map((id) => updateProduct(id, { stock: 0 })))

        const idSet = new Set(ids)
        queryClient.setQueriesData<ProductsResponse>(
          { queryKey: ['products'] },
          (oldData): ProductsResponse | undefined => {
            if (!oldData || !Array.isArray(oldData.products)) return oldData
            let modified = false
            const nextProducts = oldData.products.map((p) => {
              if (idSet.has(p.id)) {
                modified = true
                return { ...p, stock: 0 }
              }
              return p
            })
            return modified ? { ...oldData, products: nextProducts } : oldData
          },
        )

        const label = ids.length === 1 ? '1 product' : `${ids.length} products`
        options?.onSuccess?.(`Marked ${label} as out of stock.`)
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        options?.onError?.(error)
      } finally {
        setIsProcessing(false)
      }
    },
    [queryClient, options],
  )

  const bulkRestock = useCallback(
    async (ids: readonly number[], amount = 50): Promise<void> => {
      if (ids.length === 0) return
      setIsProcessing(true)
      try {
        await queryClient.cancelQueries({ queryKey: ['products'] })

        const cachedMap = getProductsFromCache(queryClient)
        const restockPlan = ids.map((id) => {
          const currentStock = cachedMap.get(id)?.stock ?? 0
          const newStock = currentStock + amount
          return { id, newStock }
        })

        await Promise.all(
          restockPlan.map(({ id, newStock }) =>
            updateProduct(id, { stock: newStock }),
          ),
        )

        const updateMap = new Map(restockPlan.map((p) => [p.id, p.newStock]))
        queryClient.setQueriesData<ProductsResponse>(
          { queryKey: ['products'] },
          (oldData): ProductsResponse | undefined => {
            if (!oldData || !Array.isArray(oldData.products)) return oldData
            let modified = false
            const nextProducts = oldData.products.map((p) => {
              const nextStock = updateMap.get(p.id)
              if (nextStock !== undefined) {
                modified = true
                return { ...p, stock: nextStock }
              }
              return p
            })
            return modified ? { ...oldData, products: nextProducts } : oldData
          },
        )

        const label = ids.length === 1 ? '1 product' : `${ids.length} products`
        options?.onSuccess?.(`Restocked ${label} (+${amount} stock each).`)
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        options?.onError?.(error)
      } finally {
        setIsProcessing(false)
      }
    },
    [queryClient, options],
  )

  const deleteSelected = useCallback(
    async (ids: readonly number[]): Promise<void> => {
      if (ids.length === 0) return
      setIsProcessing(true)
      try {
        await queryClient.cancelQueries({ queryKey: ['products'] })

        await Promise.all(ids.map((id) => deleteProduct(id)))

        const idSet = new Set(ids)
        queryClient.setQueriesData<ProductsResponse>(
          { queryKey: ['products'] },
          (oldData): ProductsResponse | undefined => {
            if (!oldData || !Array.isArray(oldData.products)) return oldData
            const remaining = oldData.products.filter((p) => !idSet.has(p.id))
            const removedCount = oldData.products.length - remaining.length
            if (removedCount === 0) return oldData
            return {
              ...oldData,
              total: Math.max(0, oldData.total - removedCount),
              products: remaining,
            }
          },
        )

        const label = ids.length === 1 ? '1 product' : `${ids.length} products`
        options?.onSuccess?.(`Deleted ${label} successfully.`)
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        options?.onError?.(error)
      } finally {
        setIsProcessing(false)
      }
    },
    [queryClient, options],
  )

  return {
    isProcessing,
    markOutOfStock,
    bulkRestock,
    deleteSelected,
  }
}

export default useBatchProductActions
