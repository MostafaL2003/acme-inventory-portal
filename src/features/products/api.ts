import type { Product, ProductsResponse, ProductQueryParams } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchProducts(
  params: ProductQueryParams = {},
): Promise<ProductsResponse> {
  const { q, category, limit = 20, skip = 0, sortBy, order } = params

  let endpoint = `${API_BASE_URL}/products`
  if (category && category.trim() !== '') {
    endpoint = `${API_BASE_URL}/products/category/${encodeURIComponent(category.trim())}`
  } else if (q && q.trim() !== '') {
    endpoint = `${API_BASE_URL}/products/search`
  }

  const searchParams = new URLSearchParams()
  if (q && q.trim() !== '' && !category) {
    searchParams.set('q', q.trim())
  }
  searchParams.set('limit', String(limit))
  searchParams.set('skip', String(skip))
  if (sortBy) searchParams.set('sortBy', sortBy)
  if (order) searchParams.set('order', order)

  const url = `${endpoint}?${searchParams.toString()}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`)
  }

  return response.json() as Promise<ProductsResponse>
}

export async function fetchProductById(id: number): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch product ${id}: ${response.statusText}`)
  }
  return response.json() as Promise<Product>
}

export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/products/category-list`)
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`)
  }
  return response.json() as Promise<string[]>
}

export async function updateProduct(
  id: number,
  data: Partial<Omit<Product, 'id'>>,
): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`Failed to update product ${id}: ${response.statusText}`)
  }
  return response.json() as Promise<Product>
}

export async function deleteProduct(id: number): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`Failed to delete product ${id}: ${response.statusText}`)
  }
  return response.json() as Promise<Product>
}

