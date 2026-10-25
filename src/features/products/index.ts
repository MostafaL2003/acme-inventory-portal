export { ProductsPage } from './components/ProductsPage'
export { ProductTable } from './components/ProductTable'
export { ProductRow } from './components/ProductRow'
export { StockStatusBadge } from './components/StockStatusBadge'
export type {
  Product,
  ProductsResponse,
  ProductQueryParams,
  StockStatus,
} from './types'
export {
  fetchProducts,
  fetchProductById,
  fetchCategories,
  updateProduct,
  deleteProduct,
} from './api'
export {
  useUrlProductFilters,
  type UrlProductFilters,
  type UseUrlProductFiltersReturn,
} from './hooks/useUrlProductFilters'
