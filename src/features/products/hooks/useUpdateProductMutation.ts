import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query'
import { updateProduct } from '../api'
import type { Product, ProductsResponse } from '../types'

export interface UpdateProductVariables {
  id: number
  data: Partial<Omit<Product, 'id'>>
}

export function useUpdateProductMutation(): UseMutationResult<
  Product,
  Error,
  UpdateProductVariables
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateProductVariables) => updateProduct(id, data),
    onSuccess: (updatedProduct, variables) => {
      queryClient.setQueriesData<ProductsResponse>(
        { queryKey: ['products'] },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            products: oldData.products.map((product) =>
              product.id === variables.id
                ? { ...product, ...updatedProduct, ...variables.data }
                : product,
            ),
          }
        },
      )
    },
  })
}

export default useUpdateProductMutation
