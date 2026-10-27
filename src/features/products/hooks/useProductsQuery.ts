import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { fetchProducts } from '../api'
import type { ProductQueryParams, ProductsResponse } from '../types'

export function useProductsQuery(
  params: ProductQueryParams = {},
): UseQueryResult<ProductsResponse, Error> {
  const { q, category, limit, skip, sortBy, order } = params

  return useQuery({
    queryKey: ['products', { q, category, limit, skip, sortBy, order }],
    queryFn: () => fetchProducts({ q, category, limit, skip, sortBy, order }),
  })
}

export default useProductsQuery
