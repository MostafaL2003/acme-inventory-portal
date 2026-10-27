import { useState, useCallback, useMemo, type FormEvent } from 'react'
import type { Product } from '../types'

export interface ProductFormValues {
  title: string
  price: string | number
  stock: string | number
  category: string
}

export interface ProductFormErrors {
  title?: string
  price?: string
  stock?: string
  category?: string
}

export interface UseProductFormReturn {
  values: ProductFormValues
  errors: ProductFormErrors
  isValid: boolean
  setTitle: (value: string) => void
  setPrice: (value: string | number) => void
  setStock: (value: string | number) => void
  setCategory: (value: string) => void
  incrementStock: () => void
  decrementStock: () => void
  validate: () => boolean
  handleSubmit: (e?: FormEvent) => boolean
  reset: (product?: Product | null) => void
}

export function useProductForm(
  initialProduct?: Product | null,
  onSubmit?: (values: { title: string; price: number; stock: number; category: string }) => void,
): UseProductFormReturn {
  const currentId = initialProduct?.id ?? null
  const [prevId, setPrevId] = useState<number | null>(currentId)
  const [title, setTitle] = useState(initialProduct?.title ?? '')
  const [price, setPrice] = useState<string | number>(initialProduct?.price ?? '')
  const [stock, setStock] = useState<string | number>(initialProduct?.stock ?? 0)
  const [category, setCategory] = useState(initialProduct?.category ?? '')
  const [errors, setErrors] = useState<ProductFormErrors>({})

  if (currentId !== prevId) {
    setPrevId(currentId)
    setTitle(initialProduct?.title ?? '')
    setPrice(initialProduct?.price ?? '')
    setStock(initialProduct?.stock ?? 0)
    setCategory(initialProduct?.category ?? '')
    setErrors({})
  }

  const validate = useCallback((): boolean => {
    const nextErrors: ProductFormErrors = {}
    const trimmedTitle = title.trim()
    const numPrice = Number(price)
    const numStock = Number(stock)

    if (!trimmedTitle) {
      nextErrors.title = 'Product title is required'
    }
    if (price === '' || Number.isNaN(numPrice) || numPrice < 0) {
      nextErrors.price = 'Price must be a non-negative number'
    }
    if (stock === '' || Number.isNaN(numStock) || !Number.isInteger(numStock) || numStock < 0) {
      nextErrors.stock = 'Stock must be a non-negative integer'
    }
    if (!category.trim()) {
      nextErrors.category = 'Category is required'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }, [title, price, stock, category])

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault()
      if (validate()) {
        onSubmit?.({
          title: title.trim(),
          price: Number(price),
          stock: Number(stock),
          category: category.trim(),
        })
        return true
      }
      return false
    },
    [validate, onSubmit, title, price, stock, category],
  )

  const incrementStock = useCallback(() => {
    setStock((prev) => {
      const val = Number(prev)
      return Number.isNaN(val) ? 1 : val + 1
    })
    setErrors((prev) => ({ ...prev, stock: undefined }))
  }, [])

  const decrementStock = useCallback(() => {
    setStock((prev) => {
      const val = Number(prev)
      return Number.isNaN(val) || val <= 0 ? 0 : val - 1
    })
    setErrors((prev) => ({ ...prev, stock: undefined }))
  }, [])

  const handleSetTitle = useCallback((val: string) => {
    setTitle(val)
    if (val.trim()) setErrors((prev) => ({ ...prev, title: undefined }))
  }, [])

  const handleSetPrice = useCallback((val: string | number) => {
    setPrice(val)
    const num = Number(val)
    if (val !== '' && !Number.isNaN(num) && num >= 0) {
      setErrors((prev) => ({ ...prev, price: undefined }))
    }
  }, [])

  const handleSetStock = useCallback((val: string | number) => {
    setStock(val)
    const num = Number(val)
    if (val !== '' && !Number.isNaN(num) && Number.isInteger(num) && num >= 0) {
      setErrors((prev) => ({ ...prev, stock: undefined }))
    }
  }, [])

  const handleSetCategory = useCallback((val: string) => {
    setCategory(val)
    if (val.trim()) setErrors((prev) => ({ ...prev, category: undefined }))
  }, [])

  const reset = useCallback((product?: Product | null) => {
    setPrevId(product?.id ?? null)
    setTitle(product?.title ?? '')
    setPrice(product?.price ?? '')
    setStock(product?.stock ?? 0)
    setCategory(product?.category ?? '')
    setErrors({})
  }, [])

  const isValid = useMemo(() => {
    const numPrice = Number(price)
    const numStock = Number(stock)
    return (
      Boolean(title.trim()) &&
      price !== '' &&
      !Number.isNaN(numPrice) &&
      numPrice >= 0 &&
      stock !== '' &&
      !Number.isNaN(numStock) &&
      Number.isInteger(numStock) &&
      numStock >= 0 &&
      Boolean(category.trim())
    )
  }, [title, price, stock, category])

  return {
    values: { title, price, stock, category },
    errors,
    isValid,
    setTitle: handleSetTitle,
    setPrice: handleSetPrice,
    setStock: handleSetStock,
    setCategory: handleSetCategory,
    incrementStock,
    decrementStock,
    validate,
    handleSubmit,
    reset,
  }
}

export default useProductForm

