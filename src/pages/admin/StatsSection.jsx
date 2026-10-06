import { useResource } from '../../hooks'
import { formatPrice } from '../../data/products'
import { api } from '../../lib/api'
import { ErrorNote, Loading, Panel, StatCard } from './parts'

function CategoryBars({ rows }) {
  const peak = Math.max(...rows.map((row) => row.count), 1)

  return (
    <ul className="divide-y divide-ink-200 px-5">
      {rows.map((row) => (
        <li key={row.id} className="flex items-center gap-4 py-3">
          <span className="w-28 shrink-0 text-sm capitalize text-ink-700">{row.id}</span>
          <span className="h-2 flex-1 bg-ink-100">
            <span
              className="block h-full bg-ink-950/85"
              style={{ width: `${(row.count / peak) * 100}%` }}
            />
          </span>
          <span className="w-10 text-right text-sm tabular-nums text-ink-600">{row.count}</span>
        </li>
      ))}
    </ul>
  )
}

export default function StatsSection() {
  const { data, error, loading } = useResource(() => api.adminStats())

  if (loading && !data) return <Loading label="Loading statistics" />
  if (error && !data) return <ErrorNote>{error}</ErrorNote>
  if (!data) return null

  const { stats, registrations } = data
  const { users, products, orders } = stats

  return (
    <div className="space-y-8">
      {error && <ErrorNote>{error}</ErrorNote>}

      <section aria-labelledby="stats-people">
        <h2 id="stats-people" className="sr-only">
          People
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Registered users"
            value={users.total}
            icon="users"
            hint={`${users.customers} customers · ${users.admins} staff`}
          />
          <StatCard
            label="Placed an order"
            value={users.withOrders}
            icon="orders"
            tone="positive"
            hint={`${users.withoutOrders} have never ordered`}
          />
          <StatCard
            label="Repeat buyers"
            value={users.repeatBuyers}
            icon="heart"
            hint="Two orders or more"
          />
          <StatCard
            label="New in 30 days"
            value={users.newIn30Days}
            icon="trending-up"
            tone={users.newIn30Days > 0 ? 'positive' : 'neutral'}
            hint="Accounts created recently"
          />
        </div>
      </section>

      <section aria-labelledby="stats-catalogue">
        <h2 id="stats-catalogue" className="sr-only">
          Catalogue
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Products"
            value={products.total}
            icon="box"
            hint={`${products.featured} featured`}
          />
          <StatCard
            label="Available"
            value={products.inStock}
            icon="check"
            tone="positive"
            hint={`${products.lowStock} low · ${products.outOfStock} out of stock`}
          />
          <StatCard
            label="Units on hand"
            value={products.unitsInStock}
            icon="flask"
            hint={`${formatPrice(products.stockValue)} at retail`}
          />
          <StatCard
            label="Orders"
            value={orders.total}
            icon="gauge"
            hint={`${orders.open} awaiting fulfilment`}
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Registrations"
          description="New accounts, last 30 days"
        >
          {registrations.every((day) => day.signups === 0) ? (
            <p className="px-5 py-10 text-center text-sm text-ink-500">
              No new accounts in the last 30 days.
            </p>
          ) : (
            <SignupChart series={registrations} />
          )}
        </Panel>

        <Panel
          title="Catalogue by category"
          description={`${products.total} products across ${products.byCategory.length} categories`}
        >
          <CategoryBars rows={products.byCategory} />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="People" description="Account breakdown">
          <dl className="grid grid-cols-1 gap-px bg-ink-200 @md:grid-cols-2">
            {[
              { label: 'Total accounts', value: users.total },
              { label: 'Customers', value: users.customers },
              { label: 'Administrators', value: users.admins },
              { label: 'Active shoppers', value: users.withOrders },
            ].map((entry) => (
              <div key={entry.label} className="bg-white px-5 py-6">
                <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-400">
                  {entry.label}
                </dt>
                <dd className="mt-2 font-display text-2xl tabular-nums">{entry.value}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title="Commerce" description="Order and revenue totals">
          <dl className="grid grid-cols-1 gap-px bg-ink-200 @md:grid-cols-2">
            {[
              { label: 'Orders placed', value: orders.total },
              { label: 'Revenue', value: formatPrice(orders.revenue) },
              { label: 'Average order', value: formatPrice(orders.averageOrderValue) },
              { label: 'Units sold', value: orders.unitsSold },
            ].map((entry) => (
              <div key={entry.label} className="bg-white px-5 py-6">
                <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-400">
                  {entry.label}
                </dt>
                <dd className="mt-2 font-display text-2xl tabular-nums">{entry.value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
    </div>
  )
}

function SignupChart({ series }) {
  const peak = Math.max(...series.map((day) => day.signups), 1)

  return (
    <div className="px-5 py-6">
      <div
        className="flex h-40 items-end gap-1"
        role="img"
        aria-label="New accounts, last 30 days"
      >
        {series.map((day) => (
          <div key={day.date} className="group relative flex-1">
            <div
              className="w-full bg-ink-950/85 transition-colors group-hover:bg-sage-500"
              style={{ height: `${Math.max((day.signups / peak) * 100, day.signups > 0 ? 4 : 1)}%` }}
            />
            <span className="sr-only">
              {day.date}: {day.signups} new accounts
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.15em] text-ink-400">
        <span>{series[0]?.date.slice(5)}</span>
        <span>peak {peak} / day</span>
        <span>{series[series.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  )
}