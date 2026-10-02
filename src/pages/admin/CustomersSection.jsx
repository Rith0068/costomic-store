import { useMemo, useState } from 'react'
import { useResource } from '../../hooks'
import { formatPrice } from '../../data/products'
import { api } from '../../lib/api'
import { EmptyState, ErrorNote, Loading, Panel, SearchInput } from './parts'
import { formatDate } from './format'

const EMPTY = []

export default function CustomersSection() {
  const { data, error, loading } = useResource(() => api.adminCustomers())
  const [query, setQuery] = useState('')

  const customers = data?.customers ?? EMPTY

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return customers
    return customers.filter((customer) =>
      [customer.name, customer.email].join(' ').toLowerCase().includes(term),
    )
  }, [customers, query])

  const totalSpend = customers.reduce((sum, customer) => sum + customer.spend, 0)
  const repeat = customers.filter((customer) => customer.orders > 1).length
  const buyers = customers.filter((customer) => customer.orders > 0).length

  return (
    <div className="space-y-6">
      {error && <ErrorNote>{error}</ErrorNote>}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-ink-200 bg-white p-5">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-400">Accounts</p>
          <p className="mt-3 font-display text-3xl tabular-nums">{customers.length}</p>
        </div>
        <div className="border border-ink-200 bg-white p-5">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-400">Have ordered</p>
          <p className="mt-3 font-display text-3xl tabular-nums">
            {buyers}
            <span className="ml-2 text-sm text-ink-400">of {customers.length}</span>
          </p>
        </div>
        <div className="border border-ink-200 bg-white p-5">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-ink-400">Repeat buyers</p>
          <p className="mt-3 font-display text-3xl tabular-nums">
            {repeat}
            <span className="ml-2 text-sm text-ink-400">
              · {formatPrice(totalSpend)} lifetime
            </span>
          </p>
        </div>
      </div>

      <Panel
        title="Customers"
        description={`${customers.length} accounts`}
        action={
          <div className="w-56">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search customers"
              label="Search customers"
            />
          </div>
        }
      >
        {loading && !data ? (
          <Loading label="Loading customers" />
        ) : visible.length === 0 ? (
          <EmptyState
            title="No customers match"
            description="Try a different search term."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-xs uppercase tracking-[0.15em] text-ink-500">
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="py-3 pr-4 font-medium">Role</th>
                  <th className="py-3 pr-4 font-medium">Joined</th>
                  <th className="py-3 pr-4 font-medium">Last order</th>
                  <th className="py-3 pr-4 font-medium">Orders</th>
                  <th className="py-3 pr-5 font-medium">Lifetime spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {visible.map((customer) => (
                  <tr key={customer.id} className="hover:bg-ink-50">
                    <td className="px-5 py-4">
                      <span className="block text-ink-950">{customer.name}</span>
                      <span className="text-xs text-ink-400">{customer.email}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-block border px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.15em] ${
                          customer.role === 'admin'
                            ? 'border-ink-300 bg-ink-100 text-ink-700'
                            : 'border-ink-200 text-ink-500'
                        }`}
                      >
                        {customer.role}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-ink-600">{formatDate(customer.createdAt)}</td>
                    <td className="py-4 pr-4 text-ink-600">
                      {customer.lastOrderAt ? formatDate(customer.lastOrderAt) : '—'}
                    </td>
                    <td className="py-4 pr-4 tabular-nums text-ink-600">{customer.orders}</td>
                    <td className="py-4 pr-5 tabular-nums">{formatPrice(customer.spend)}</td>
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
