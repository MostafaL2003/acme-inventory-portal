export interface Product {
  id: number
  sku: string
  title: string
  thumbnail: string
  category: string
  price: number
  stock: number
  description: string
  brand?: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface ProductQueryParams {
  q?: string
  category?: string
  limit?: number
  skip?: number
  sortBy?: string
  order?: 'asc' | 'desc'
}

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

