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
  StockBadge,
  SuccessNote,
} from './parts'

const EMPTY = []

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'low', label: 'Low stock' },
  { id: 'out', label: 'Out of stock' },
  { id: 'ok', label: 'Healthy' },
]

export default function InventorySection() {
  const { data, error, loading, reload } = useResource(() => api.adminInventory())
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [drafts, setDrafts] = useState({})
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')
  const [savedId, setSavedId] = useState(null)

  const inventory = data?.inventory ?? EMPTY

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return inventory.filter((row) => {
      if (filter !== 'all' && row.status !== filter) return false
      if (!term) return true
      return [row.name, row.category].join(' ').toLowerCase().includes(term)
    })
  }, [inventory, query, filter])

  const lowStockAt = data?.lowStockAt ?? 0
  const stockValue = inventory.reduce((sum, row) => sum + row.value, 0)
  const units = inventory.reduce((sum, row) => sum + row.stock, 0)
  const low = inventory.filter((row) => row.status === 'low').length
  const out = inventory.filter((row) => row.status === 'out').length

  const save = async (id) => {
    const draft = drafts[id]
    if (draft === undefined) return

    const stock = Number(draft)
    if (!Number.isFinite(stock) || stock < 0) {
      setActionError('Stock must be zero or more')
      return
    }

    setBusyId(id)
    setActionError('')
    try {
      await api.setStock(id, stock)
      setDrafts((current) => {
        const next = { ...current }
        delete next[id]
        return next
      })
      setSavedId(id)
      await reload()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const step = (row, delta) => {
    const base = drafts[row.id] ?? row.stock
    setDrafts((current) => ({ ...current, [row.id]: Math.max(0, Number(base) + delta) }))
  }

  return (
    <div className="space-y-6">
      {(error || actionError) && <ErrorNote>{error || actionError}</ErrorNote>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Stock value" value={formatPrice(stockValue)} icon="flask" />
        <StatCard label="Units on hand" value={units} icon="box" />
        <StatCard
          label="Low stock"
          value={low}
          icon="warning"
          tone={low > 0 ? 'warning' : 'neutral'}
          hint={`below ${lowStockAt} units`}
        />
        <StatCard
          label="Out of stock"
          value={out}
          icon="warning"
          tone={out > 0 ? 'danger' : 'neutral'}
        />
      </div>

      <Panel
        title="Inventory"
        description="Adjust stock levels directly"
        action={
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-56">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Search stock"
                label="Search stock"
              />
            </div>
            <div className="flex border border-ink-200">
              {FILTERS.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setFilter(entry.id)}
                  aria-pressed={filter === entry.id}
                  className={`px-3 py-2 text-xs uppercase tracking-[0.15em] transition-colors ${
                    filter === entry.id
                      ? 'bg-ink-950 text-ink-50'
                      : 'bg-white text-ink-600 hover:bg-ink-50'
                  }`}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          </div>
        }
      >
        {loading && !data ? (
          <Loading label="Loading inventory" />
        ) : visible.length === 0 ? (
          <EmptyState title="Nothing matches" description="Try another filter or search term." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-xs uppercase tracking-[0.15em] text-ink-500">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="py-3 pr-4 font-medium">Category</th>
                  <th className="py-3 pr-4 font-medium">Price</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium">Stock value</th>
                  <th className="py-3 pr-5 font-medium">Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {visible.map((row) => {
                  const draft = drafts[row.id]
                  return (
                    <tr key={row.id} className="hover:bg-ink-50">
                      <td className="px-5 py-4">
                        <span className="block text-ink-950">{row.name}</span>
                        <span className="text-xs text-ink-400">{row.id}</span>
                      </td>
                      <td className="py-4 pr-4 capitalize text-ink-600">{row.category}</td>
                      <td className="py-4 pr-4 tabular-nums text-ink-600">
                        {formatPrice(row.price)}
                      </td>
                      <td className="py-4 pr-4">
                        <StockBadge status={row.status} stock={draft ?? row.stock} />
                      </td>
                      <td className="py-4 pr-4 tabular-nums text-ink-600">
                        {formatPrice((draft ?? row.stock) * row.price)}
                      </td>
                      <td className="py-4 pr-5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => step(row, -1)}
                            aria-label={`Decrease stock for ${row.name}`}
                            className="border border-ink-200 px-2.5 py-2 transition-colors hover:border-ink-950"
                          >
                            <span aria-hidden>−</span>
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={draft ?? row.stock}
                            onChange={(event) =>
                              setDrafts((current) => ({
                                ...current,
                                [row.id]: event.target.value,
                              }))
                            }
                            aria-label={`Stock for ${row.name}`}
                            className="w-20 border border-ink-200 px-2 py-2 text-center text-sm tabular-nums outline-none focus:border-ink-950"
                          />
                          <button
                            type="button"
                            onClick={() => step(row, 1)}
                            aria-label={`Increase stock for ${row.name}`}
                            className="border border-ink-200 px-2.5 py-2 transition-colors hover:border-ink-950"
                          >
                            <span aria-hidden>+</span>
                          </button>
                          <button
                            type="button"
                            disabled={draft === undefined || busyId === row.id}
                            onClick={() => save(row.id)}
                            className="border border-ink-950 px-3 py-2 text-xs uppercase tracking-[0.15em] text-ink-950 transition-colors hover:bg-ink-950 hover:text-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {busyId === row.id ? '...' : 'Save'}
                          </button>
                          {savedId === row.id && !draft && (
                            <span className="text-xs text-sage-600">Saved</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {savedId && !visible.some((row) => drafts[row.id] !== undefined) && (
          <div className="px-5 py-4">
            <SuccessNote>Stock level updated.</SuccessNote>
          </div>
        )}
      </Panel>
    </div>
  )
}
