export { ProductsPage } from './components/ProductsPage'
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

