import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { fetchCategories } from '../api'

export function useCategoriesQuery(): UseQueryResult<string[], Error> {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60,
  })
}

export default useCategoriesQuery
