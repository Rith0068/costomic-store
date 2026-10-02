import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { ProductsContext } from './ProductsContext'

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const data = await api.products()
      setProducts(data.products)
      setError('')
      setStatus('ready')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    api
      .products()
      .then((data) => {
        if (cancelled) return
        setProducts(data.products)
        setError('')
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  const byId = useMemo(() => {
    const map = new Map()
    for (const product of products) map.set(product.id, product)
    return map
  }, [products])

  const value = useMemo(
    () => ({
      products,
      status,
      error,
      reload: load,
      getById: (id) => byId.get(id) ?? null,
      getBySlug: (slug) => products.find((p) => p.slug === slug) ?? null,
    }),
    [products, status, error, load, byId],
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}
