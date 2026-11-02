import type { Product, ProductsResponse } from '@/features/products'
import { calculateInventoryMetrics } from './utils/metrics'
import type { CategoryMetric } from './types'

const rawBaseUrl: unknown = import.meta.env.VITE_API_BASE_URL
const API_BASE_URL: string =
  typeof rawBaseUrl === 'string' && rawBaseUrl.trim().length > 0
    ? rawBaseUrl.trim().replace(/\/+$/, '')
    : 'https://dummyjson.com'

export interface SkuValuationData {
  readonly totalSkus: number
  readonly totalValuation: number
  readonly formattedValuation: string
  readonly inStockCount: number
  readonly categoryBreakdown: readonly CategoryMetric[]
}

export interface LowStockData {
  readonly lowStockCount: number
  readonly outOfStockCount: number
  readonly lowStockProducts: readonly Product[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isProductItem(value: unknown): value is Product {
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
    value.products.every(isProductItem)
  )
}

async function fetchCatalogEndpoint(
  query: string,
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  const response = await fetch(`${API_BASE_URL}/products?${query}`, { signal })
  if (!response.ok) {
    throw new Error(`Dashboard fetch failed (HTTP ${response.status})`)
  }
  const payload: unknown = await response.json()
  if (!isProductsResponse(payload)) {
    throw new Error('Dashboard fetch failed: Unexpected response schema')
  }
  return {
    ...payload,
    products: payload.products.map(normalizeProduct),
  }
}

export async function fetchSkuAndValuationMetrics(
  signal?: AbortSignal,
): Promise<SkuValuationData> {
  const data = await fetchCatalogEndpoint(
    'limit=0&select=id,title,category,price,stock,sku',
    signal,
  )
  const computed = calculateInventoryMetrics(data.products, data.total)
  return {
    totalSkus: computed.totalSkus,
    totalValuation: computed.totalValuation,
    formattedValuation: computed.formattedValuation,
    inStockCount: computed.inStockCount,
    categoryBreakdown: computed.categoryBreakdown,
  }
}

export async function fetchLowStockMetrics(
  signal?: AbortSignal,
): Promise<LowStockData> {
  const data = await fetchCatalogEndpoint(
    'limit=0&sortBy=stock&order=asc',
    signal,
  )
  const computed = calculateInventoryMetrics(data.products, data.total)
  return {
    lowStockCount: computed.lowStockCount,
    outOfStockCount: computed.outOfStockCount,
    lowStockProducts: computed.lowStockProducts,
  }
}

