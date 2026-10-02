import { useResource } from '../../hooks'
import { formatDate } from './format'
import { formatPrice } from '../../data/products'
import { api } from '../../lib/api'
import {
  BarChart,
  EmptyState,
  ErrorNote,
  Loading,
  MeterRow,
  Panel,
  StatCard,
  StatusBadge,
} from './parts'

export default function OverviewSection() {
  const { data, error, loading } = useResource(() => api.adminSummary())

  if (loading && !data) return <Loading label="Loading dashboard" />
  if (error && !data) return <ErrorNote>{error}</ErrorNote>
  if (!data) return null

  const { summary, series, top, recent, categories } = data
  const trendUp = summary.revenueDelta >= 0
  const topTotal = top.reduce((sum, entry) => sum + entry.revenue, 0)
  const topUnits = top.reduce((sum, entry) => sum + entry.units, 0)

  return (
    <div className="space-y-8">
      {error && <ErrorNote>{error}</ErrorNote>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue"
          value={formatPrice(summary.revenue)}
          icon="gauge"
          tone={trendUp ? 'positive' : 'danger'}
          hint={`${trendUp ? '+' : ''}${formatPrice(summary.revenueDelta)} this week`}
        />
        <StatCard
          label="Orders"
          value={summary.orders}
          icon="orders"
          hint={`${summary.ordersDelta} in the last 7 days`}
        />
        <StatCard
          label="Customers"
          value={summary.customers}
          icon="users"
          hint={`${summary.unitsSold} units sold all time`}
        />
        <StatCard
          label="Average order"
          value={formatPrice(summary.averageOrderValue)}
          icon="box"
          hint={`${summary.cancelled} cancelled`}
        />
      </div>

      {summary.lowStock > 0 && (
        <div className="flex flex-wrap items-center gap-3 border border-gold-400/50 bg-gold-300/15 px-5 py-4 text-sm text-gold-500">
          <span className="flex items-center gap-2 font-medium">
            <span className="inline-block size-2 rounded-full bg-gold-500" />
            {summary.lowStock} product{summary.lowStock === 1 ? '' : 's'} need restocking
          </span>
          <span className="text-gold-500/80">
            {summary.outOfStock} out of stock · {summary.unitsInStock} units on hand
          </span>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel
          title="Revenue"
          description="Last 14 days"
          className="xl:col-span-2"
        >
          <BarChart series={series} />
        </Panel>

        <Panel title="Stock on hand" description="Inventory value">
          <dl className="@container grid grid-cols-1 gap-px bg-ink-200 @md:grid-cols-2">
            <div className="bg-white px-5 py-6">
              <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-400">
                Stock value
              </dt>
              <dd className="mt-2 font-display text-2xl tabular-nums">
                {formatPrice(summary.stockValue)}
              </dd>
            </div>
            <div className="bg-white px-5 py-6">
              <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-400">
                Units
              </dt>
              <dd className="mt-2 font-display text-2xl tabular-nums">{summary.unitsInStock}</dd>
            </div>
            <div className="bg-white px-5 py-6">
              <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-400">
                Catalogue
              </dt>
              <dd className="mt-2 font-display text-2xl tabular-nums">{summary.products}</dd>
            </div>
            <div className="bg-white px-5 py-6">
              <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-400">
                Avg rating
              </dt>
              <dd className="mt-2 font-display text-2xl tabular-nums">
                {summary.averageRating.toFixed(1)}
              </dd>
            </div>
          </dl>
          {categories.length > 0 && (
            <ul className="border-t border-ink-200 px-5 py-4 text-xs text-ink-500">
              {categories.map((entry) => (
                <li key={entry.id} className="flex justify-between py-1">
                  <span className="capitalize">{entry.id}</span>
                  <span className="tabular-nums">{entry.count}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Best sellers" description={`${topUnits} units · ${formatPrice(topTotal)}`}>
          {top.length === 0 ? (
            <EmptyState
              title="No sales yet"
              description="Best sellers appear once the first order comes through."
            />
          ) : (
            <ul className="divide-y divide-ink-200 px-5">
              {top.map((entry) => (
                <MeterRow
                  key={entry.productId}
                  label={entry.name}
                  value={entry.revenue}
                  total={topTotal}
                />
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent orders" description="Latest activity">
          {recent.length === 0 ? (
            <EmptyState title="No orders yet" description="Orders will list here." />
          ) : (
            <ul className="divide-y divide-ink-200">
              {recent.map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink-950">{order.customerName}</p>
                    <p className="mt-1 text-xs text-ink-500">
                      {order.itemCount} item{order.itemCount === 1 ? '' : 's'} ·{' '}
                      {formatDate(order.placedAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <span className="text-sm tabular-nums">{formatPrice(order.total)}</span>
                    <StatusBadge status={order.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  )
}
