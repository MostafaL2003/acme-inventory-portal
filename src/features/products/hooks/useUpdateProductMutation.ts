import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query'
import { updateProduct } from '../api'
import type { Product, ProductsResponse } from '../types'

export type UpdateProductPayload = Partial<Omit<Product, 'id'>>

export interface UpdateProductVariables {
  readonly id: number
  readonly data: UpdateProductPayload
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {}
  for (const key of Object.keys(obj) as Array<keyof T>) {
    if (obj[key] !== undefined) {
      result[key] = obj[key]
    }
  }
  return result
}

export function useUpdateProductMutation(): UseMutationResult<
  Product,
  Error,
  UpdateProductVariables
> {
  const queryClient = useQueryClient()

  return useMutation<Product, Error, UpdateProductVariables>({
    mutationFn: ({ id, data }: UpdateProductVariables): Promise<Product> =>
      updateProduct(id, data),
    onMutate: async (): Promise<void> => {
      await queryClient.cancelQueries({ queryKey: ['products'] })
    },
    onSuccess: (updatedProduct: Product, variables: UpdateProductVariables): void => {
      const sanitizedPatch = stripUndefined(
        variables.data as Record<string, unknown>,
      ) as UpdateProductPayload

      queryClient.setQueriesData<ProductsResponse>(
        { queryKey: ['products'] },
        (oldData): ProductsResponse | undefined => {
          if (!oldData || !Array.isArray(oldData.products)) return oldData

          const targetIndex = oldData.products.findIndex(
            (product) => product.id === variables.id,
          )
          if (targetIndex === -1) return oldData

          const nextProducts = [...oldData.products]
          nextProducts[targetIndex] = {
            ...oldData.products[targetIndex],
            ...stripUndefined(updatedProduct as unknown as Record<string, unknown>),
            ...sanitizedPatch,
            id: variables.id,
          }

          return {
            ...oldData,
            products: nextProducts,
          }
        },
      )
    },
  })
}

export default useUpdateProductMutation

