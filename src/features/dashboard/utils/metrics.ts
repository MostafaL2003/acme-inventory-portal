import type { Product } from '@/features/products'
import type { CategoryMetric, ComputedMetrics } from '../types'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function calculateInventoryMetrics(
  products: readonly Product[],
  totalOverride?: number,
): ComputedMetrics {
  const totalSkus =
    totalOverride !== undefined && totalOverride > products.length
      ? totalOverride
      : products.length

  let totalValuation = 0
  let lowStockCount = 0
  let outOfStockCount = 0
  let inStockCount = 0

  const categoryMap = new Map<
    string,
    { count: number; valuation: number }
  >()
  const lowStockList: Product[] = []

  for (const product of products) {
    const itemValuation = product.price * product.stock
    totalValuation += itemValuation

    if (product.stock === 0) {
      outOfStockCount += 1
      lowStockList.push(product)
    } else if (product.stock < 30) {
      lowStockCount += 1
      lowStockList.push(product)
    } else {
      inStockCount += 1
    }

    const currentCat = categoryMap.get(product.category) ?? {
      count: 0,
      valuation: 0,
    }
    categoryMap.set(product.category, {
      count: currentCat.count + 1,
      valuation: currentCat.valuation + itemValuation,
    })
  }

  lowStockList.sort((a, b) => a.stock - b.stock)

  const categoryBreakdown: CategoryMetric[] = Array.from(
    categoryMap.entries(),
  ).map(([category, stats]) => ({
    category,
    count: stats.count,
    valuation: Math.round(stats.valuation * 100) / 100,
    percentage:
      totalValuation > 0
        ? Math.round((stats.valuation / totalValuation) * 1000) / 10
        : 0,
  }))

  categoryBreakdown.sort((a, b) => b.valuation - a.valuation)

  const roundedValuation = Math.round(totalValuation * 100) / 100

  return {
    totalSkus,
    totalValuation: roundedValuation,
    formattedValuation: currencyFormatter.format(roundedValuation),
    lowStockCount,
    outOfStockCount,
    inStockCount,
    lowStockProducts: lowStockList,
    categoryBreakdown,
  }
}

