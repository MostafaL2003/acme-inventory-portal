import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { updateProduct } from '../api'
import type { Product } from '../types'

export interface UpdateProductVariables {
  id: number
  data: Partial<Omit<Product, 'id'>>
}

export function useUpdateProductMutation(): UseMutationResult<
  Product,
  Error,
  UpdateProductVariables
> {
  return useMutation({
    mutationFn: ({ id, data }: UpdateProductVariables) => updateProduct(id, data),
  })
}

export default useUpdateProductMutation
