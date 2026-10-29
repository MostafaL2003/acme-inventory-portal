import type { Product, ProductsResponse, ProductQueryParams } from './types'

const rawBaseUrl: unknown = import.meta.env.VITE_API_BASE_URL
const API_BASE_URL: string =
  typeof rawBaseUrl === 'string' && rawBaseUrl.trim().length > 0
    ? rawBaseUrl.trim().replace(/\/+$/, '')
    : 'https://dummyjson.com'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isProduct(value: unknown): value is Product {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'number' &&
    typeof value.title === 'string' &&
    typeof value.category === 'string' &&
    typeof value.price === 'number' &&
    typeof value.stock === 'number'
  )
}

function normalizeProduct(raw: Product): Product {
  return {
    ...raw,
    sku: typeof raw.sku === 'string' && raw.sku.trim() ? raw.sku : `SKU-${raw.id}`,
    thumbnail: typeof raw.thumbnail === 'string' ? raw.thumbnail : '',
    description: typeof raw.description === 'string' ? raw.description : '',
  }
}

function isProductsResponse(value: unknown): value is ProductsResponse {
  if (!isRecord(value) || !Array.isArray(value.products)) return false
  return (
    typeof value.total === 'number' &&
    typeof value.skip === 'number' &&
    typeof value.limit === 'number' &&
    value.products.every(isProduct)
  )
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

async function requestJson<T>(
  url: string,
  init: RequestInit | undefined,
  validator: (data: unknown) => data is T,
  errorContext: string,
): Promise<T> {
  const response = await fetch(url, init)
  if (!response.ok) {
    const statusLabel = response.statusText
      ? `${response.status} ${response.statusText}`
      : `HTTP ${response.status}`
    throw new Error(`${errorContext} (${statusLabel})`)
  }

  const payload: unknown = await response.json()
  if (!validator(payload)) {
    throw new Error(`${errorContext}: Unexpected response schema from server`)
  }
  return payload
}

export async function fetchProducts(
  params: ProductQueryParams = {},
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  const { q, category, limit = 20, skip = 0, sortBy, order } = params
  const trimmedCategory = category?.trim() ?? ''
  const trimmedQuery = q?.trim() ?? ''

  let endpoint = `${API_BASE_URL}/products`
  if (trimmedCategory !== '') {
    endpoint = `${API_BASE_URL}/products/category/${encodeURIComponent(trimmedCategory)}`
  } else if (trimmedQuery !== '') {
    endpoint = `${API_BASE_URL}/products/search`
  }

  const searchParams = new URLSearchParams()
  if (trimmedQuery !== '' && trimmedCategory === '') {
    searchParams.set('q', trimmedQuery)
  }
  searchParams.set('limit', String(Math.max(1, Math.floor(limit))))
  searchParams.set('skip', String(Math.max(0, Math.floor(skip))))
  if (sortBy) searchParams.set('sortBy', sortBy)
  if (order) searchParams.set('order', order)

  const data = await requestJson(
    `${endpoint}?${searchParams.toString()}`,
    { signal },
    isProductsResponse,
    'Failed to fetch products',
  )

  return {
    ...data,
    products: data.products.map(normalizeProduct),
  }
}

export async function fetchProductById(
  id: number,
  signal?: AbortSignal,
): Promise<Product> {
  const product = await requestJson(
    `${API_BASE_URL}/products/${encodeURIComponent(String(id))}`,
    { signal },
    isProduct,
    `Failed to fetch product ${id}`,
  )
  return normalizeProduct(product)
}

export async function fetchCategories(
  options?: { readonly signal?: AbortSignal },
): Promise<string[]> {
  return requestJson(
    `${API_BASE_URL}/products/category-list`,
    { signal: options?.signal },
    isStringArray,
    'Failed to fetch categories',
  )
}

export async function updateProduct(
  id: number,
  data: Partial<Omit<Product, 'id'>>,
): Promise<Product> {
  const product = await requestJson(
    `${API_BASE_URL}/products/${encodeURIComponent(String(id))}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    isProduct,
    `Failed to update product ${id}`,
  )
  return normalizeProduct(product)
}

export async function deleteProduct(id: number): Promise<Product> {
  const product = await requestJson(
    `${API_BASE_URL}/products/${encodeURIComponent(String(id))}`,
    { method: 'DELETE' },
    isProduct,
    `Failed to delete product ${id}`,
  )
  return normalizeProduct(product)
}

