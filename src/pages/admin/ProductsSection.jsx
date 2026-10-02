import { useMemo, useState } from 'react'
import { useResource } from '../../hooks'
import { formatPrice } from '../../data/products'
import { api } from '../../lib/api'
import {
  EmptyState,
  ErrorNote,
  Loading,
  Panel,
  SearchInput,
  StatCard,
} from './parts'
import { ProductEditor } from './ProductEditor'

const EMPTY = []

export default function ProductsSection() {
  const { data, error, loading, reload } = useResource(() => api.products())
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')

  const products = data?.products ?? EMPTY

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return products
    return products.filter((product) =>
      [product.name, product.category, product.tagline].join(' ').toLowerCase().includes(term),
    )
  }, [products, query])

  const catalogueValue = products.reduce((sum, p) => sum + p.price, 0)
  const averagePrice = products.length
    ? Math.round((catalogueValue / products.length) * 100) / 100
    : 0

  const remove = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This cannot be undone.`,
    )
    if (!confirmed) return

    setBusyId(product.id)
    setActionError('')
    try {
      await api.deleteProduct(product.id)
      if (editing?.id === product.id) setEditing(null)
      await reload()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      {(error || actionError) && <ErrorNote>{error || actionError}</ErrorNote>}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Products" value={products.length} icon="box" />
        <StatCard label="Average price" value={formatPrice(averagePrice)} icon="gauge" />
        <StatCard
          label="Priced under CHF 50"
          value={products.filter((p) => p.price < 50).length}
          icon="orders"
        />
      </div>

      {editing !== null && (
        <ProductEditor
          key={editing.id ?? 'new'}
          product={editing.id ? editing : null}
          onSaved={async () => {
            setEditing(null)
            await reload()
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      <Panel
        title="Catalogue"
        description={`${products.length} products`}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-56">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Filter products"
                label="Filter products"
              />
            </div>
            <button
              type="button"
              onClick={() => setEditing({})}
              className="btn-primary px-5 py-2.5"
            >
              New product
            </button>
          </div>
        }
      >
        {loading && !data ? (
          <Loading label="Loading catalogue" />
        ) : visible.length === 0 ? (
          <EmptyState
            title="No products match"
            description="Try a different search term, or create a new product."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-xs uppercase tracking-[0.15em] text-ink-500">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="py-3 pr-4 font-medium">Category</th>
                  <th className="py-3 pr-4 font-medium">Price</th>
                  <th className="py-3 pr-4 font-medium">Stock</th>
                  <th className="py-3 pr-5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {visible.map((product) => (
                  <tr key={product.id} className="hover:bg-ink-50">
                    <td className="px-5 py-4">
                      <span className="block text-ink-950">{product.name}</span>
                      <span className="text-xs text-ink-400">
                        {product.id}
                        {product.badge && ` · ${product.badge}`}
                      </span>
                    </td>
                    <td className="py-4 pr-4 capitalize text-ink-600">{product.category}</td>
                    <td className="py-4 pr-4 tabular-nums">{formatPrice(product.price)}</td>
                    <td className="py-4 pr-4 tabular-nums text-ink-600">{product.stock ?? 0}</td>
                    <td className="py-4 pr-5">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditing(product)}
                          className="border border-ink-200 px-3 py-1.5 text-xs uppercase tracking-[0.15em] transition-colors hover:border-ink-950"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={busyId === product.id}
                          onClick={() => remove(product)}
                          className="border border-blush-500/50 px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-blush-600 transition-colors hover:border-blush-600 disabled:opacity-40"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}
