import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query'
import { fetchProducts } from '../api'
import type { ProductQueryParams, ProductsResponse } from '../types'

export function useProductsByCategoryQuery(
  category?: string,
  params: Omit<ProductQueryParams, 'category'> = {},
): UseQueryResult<ProductsResponse, Error> {
  const { limit, skip, sortBy, order } = params

  return useQuery({
    queryKey: ['products', 'category', category, { limit, skip, sortBy, order }],
    queryFn: () => fetchProducts({ ...params, category }),
    placeholderData: keepPreviousData,
    enabled: Boolean(category && category.trim() !== '' && category !== 'all'),
  })
}

export default useProductsByCategoryQuery
