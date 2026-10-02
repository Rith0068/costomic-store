import { Fragment, useMemo, useState } from 'react'
import { useResource } from '../../hooks'
import { formatPrice } from '../../data/products'
import { api } from '../../lib/api'
import {
  EmptyState,
  ErrorNote,
  Loading,
  Panel,
  SearchInput,
  StatusBadge,
} from './parts'
import { formatDateTime } from './format'

const STATUSES = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const EMPTY = []

export default function OrdersSection() {
  const { data, error, loading, reload } = useResource(() => api.adminOrders())
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState('')

  const orders = data?.orders ?? EMPTY

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return orders.filter((order) => {
      if (status !== 'all' && order.status !== status) return false
      if (!term) return true
      return [order.id, order.email, order.customerName]
        .join(' ')
        .toLowerCase()
        .includes(term)
    })
  }, [orders, query, status])

  const counts = useMemo(() => {
    const tally = { all: orders.length }
    for (const order of orders) tally[order.status] = (tally[order.status] ?? 0) + 1
    return tally
  }, [orders])

  const changeStatus = async (id, next) => {
    setBusyId(id)
    setActionError('')
    try {
      await api.setOrderStatus(id, next)
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

      <Panel
        title="Orders"
        description={`${orders.length} recorded`}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-56">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Search orders"
                label="Search orders"
              />
            </div>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter by status"
              className="border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink-950"
            >
              <option value="all">All ({counts.all})</option>
              {STATUSES.map((entry) => (
                <option key={entry} value={entry}>
                  {entry} ({counts[entry] ?? 0})
                </option>
              ))}
            </select>
          </div>
        }
      >
        {loading && !data ? (
          <Loading label="Loading orders" />
        ) : visible.length === 0 ? (
          <EmptyState
            title="No orders match"
            description="Try a different search term or status filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-xs uppercase tracking-[0.15em] text-ink-500">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="py-3 pr-4 font-medium">Customer</th>
                  <th className="py-3 pr-4 font-medium">Items</th>
                  <th className="py-3 pr-4 font-medium">Placed</th>
                  <th className="py-3 pr-4 font-medium">Total</th>
                  <th className="py-3 pr-5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {visible.map((order) => (
                  <Fragment key={order.id}>
                    <tr className="hover:bg-ink-50">
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                          aria-expanded={expanded === order.id}
                          className="flex items-center gap-2 text-xs text-ink-500 transition-colors hover:text-ink-950"
                        >
                          <IconChevron open={expanded === order.id} />
                          {order.id}
                        </button>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="block text-ink-950">{order.customerName}</span>
                        <span className="text-xs text-ink-400">{order.email}</span>
                      </td>
                      <td className="py-4 pr-4 tabular-nums text-ink-600">{order.itemCount}</td>
                      <td className="py-4 pr-4 text-ink-600">{formatDateTime(order.placedAt)}</td>
                      <td className="py-4 pr-4 tabular-nums">{formatPrice(order.total)}</td>
                      <td className="py-4 pr-5">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={order.status} />
                          <select
                            value={order.status}
                            disabled={busyId === order.id}
                            onChange={(event) => changeStatus(order.id, event.target.value)}
                            aria-label={`Status for order ${order.id}`}
                            className="border border-ink-200 bg-white px-2 py-1 text-xs outline-none focus:border-ink-950 disabled:opacity-50"
                          >
                            {STATUSES.map((entry) => (
                              <option key={entry} value={entry}>
                                {entry}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                    {expanded === order.id && (
                      <tr>
                        <td colSpan={6} className="bg-ink-50 px-5 py-4">
                          <ul className="space-y-2">
                            {order.lines.map((line) => (
                              <li key={`${order.id}-${line.productId}-${line.variant}`}>
                                <span className="text-ink-950">{line.name}</span>
                                {line.variant && (
                                  <span className="ml-2 text-xs text-ink-500">{line.variant}</span>
                                )}
                                <span className="ml-3 text-xs text-ink-500">
                                  {line.quantity} × {formatPrice(line.unitPrice)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}

function IconChevron({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`size-3.5 transition-transform ${open ? 'rotate-90' : ''}`}
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  )
}
