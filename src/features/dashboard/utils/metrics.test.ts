import { describe, it, expect } from 'vitest'
import type { Product } from '@/features/products'
import { calculateInventoryMetrics } from './metrics'

describe('calculateInventoryMetrics', () => {
  const sampleProducts: Product[] = [
    {
      id: 1,
      title: 'Out of Stock Wire',
      category: 'Electrical',
      price: 100,
      stock: 0,
      sku: 'SKU-1',
      thumbnail: '',
      description: '',
    },
    {
      id: 2,
      title: 'Low Stock Valve',
      category: 'Plumbing',
      price: 50,
      stock: 12,
      sku: 'SKU-2',
      thumbnail: '',
      description: '',
    },
    {
      id: 3,
      title: 'Ample Helmet',
      category: 'Safety',
      price: 20,
      stock: 50,
      sku: 'SKU-3',
      thumbnail: '',
      description: '',
    },
    {
      id: 4,
      title: 'Electrical Switch',
      category: 'Electrical',
      price: 10,
      stock: 40,
      sku: 'SKU-4',
      thumbnail: '',
      description: '',
    },
  ]

  it('calculates metrics for empty products array', () => {
    const result = calculateInventoryMetrics([])
    expect(result.totalSkus).toBe(0)
    expect(result.totalValuation).toBe(0)
    expect(result.lowStockCount).toBe(0)
    expect(result.outOfStockCount).toBe(0)
    expect(result.inStockCount).toBe(0)
    expect(result.categoryBreakdown).toEqual([])
    expect(result.lowStockProducts).toEqual([])
  })

  it('calculates total valuation correctly (sum of price * stock)', () => {
    // 100*0 + 50*12 + 20*50 + 10*40 = 0 + 600 + 1000 + 400 = 2000
    const result = calculateInventoryMetrics(sampleProducts)
    expect(result.totalValuation).toBe(2000)
    expect(result.formattedValuation).toBe('$2,000')
  })

  it('categorizes stock health: out of stock (0), low stock (<30), in stock (>=30)', () => {
    const result = calculateInventoryMetrics(sampleProducts)
    expect(result.outOfStockCount).toBe(1)
    expect(result.lowStockCount).toBe(1)
    expect(result.inStockCount).toBe(2)
  })

  it('sorts lowStockProducts by stock ascending', () => {
    const result = calculateInventoryMetrics(sampleProducts)
    expect(result.lowStockProducts.map((p) => p.id)).toEqual([1, 2])
    expect(result.lowStockProducts[0].stock).toBe(0)
    expect(result.lowStockProducts[1].stock).toBe(12)
  })

  it('uses totalOverride when greater than products length', () => {
    const result = calculateInventoryMetrics(sampleProducts, 1248)
    expect(result.totalSkus).toBe(1248)
  })

  it('calculates category breakdown with valuation and percentage', () => {
    const result = calculateInventoryMetrics(sampleProducts)
    // Safety: 1000 (50%), Plumbing: 600 (30%), Electrical: 400 (20%)
    expect(result.categoryBreakdown).toHaveLength(3)
    expect(result.categoryBreakdown[0].category).toBe('Safety')
    expect(result.categoryBreakdown[0].valuation).toBe(1000)
    expect(result.categoryBreakdown[0].percentage).toBe(50)
  })
})
