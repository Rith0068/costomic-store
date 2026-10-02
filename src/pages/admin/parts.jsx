import { Icon } from '../../components/Icon'
import { formatPrice } from '../../data/products'

const STATUS_STYLES = {
  confirmed: 'border-ink-300 bg-ink-100 text-ink-700',
  processing: 'border-gold-400/50 bg-gold-300/20 text-gold-500',
  shipped: 'border-sage-300 bg-sage-100 text-sage-600',
  delivered: 'border-sage-400 bg-sage-200 text-sage-600',
  cancelled: 'border-blush-400/50 bg-blush-100 text-blush-600',
}

const STOCK_STYLES = {
  ok: 'text-sage-600',
  low: 'text-gold-500',
  out: 'text-blush-600',
}

export function Panel({ title, description, action, children, className = '' }) {
  return (
    <section className={`border border-ink-200 bg-white ${className}`}>
      {(title || action) && (
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-200 px-5 py-4">
          <div>
            {title && <h2 className="font-display text-xl text-ink-950">{title}</h2>}
            {description && <p className="mt-1 text-xs text-ink-500">{description}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export function StatCard({ label, value, hint, tone = 'neutral', icon }) {
  const tones = {
    neutral: 'text-ink-950',
    positive: 'text-sage-600',
    warning: 'text-gold-500',
    danger: 'text-blush-600',
  }

  return (
    <div className="border border-ink-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-ink-400">
          {label}
        </p>
        {icon && <Icon name={icon} className="size-4 text-ink-300" />}
      </div>
      <p className={`mt-3 font-display text-3xl tabular-nums ${tones[tone]}`}>{value}</p>
      {hint && <p className="mt-2 text-xs text-ink-500">{hint}</p>}
    </div>
  )
}

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block border px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.15em] ${
        STATUS_STYLES[status] ?? STATUS_STYLES.confirmed
      }`}
    >
      {status}
    </span>
  )
}

export function StockBadge({ status, stock }) {
  return (
    <span className={`inline-block text-xs uppercase tracking-[0.15em] ${STOCK_STYLES[status]}`}>
      {status === 'ok' ? 'In stock' : status === 'low' ? 'Low' : 'Out'}
      <span className="ml-2 tabular-nums text-ink-500">{stock}</span>
    </span>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center px-8 py-16 text-center">
      <Icon name="box" className="size-8 text-ink-300" strokeWidth={1} />
      <h3 className="mt-5 text-2xl">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function Loading({ label = 'Loading' }) {
  return (
    <p role="status" className="px-5 py-10 text-center text-sm text-ink-500">
      {label}…
    </p>
  )
}

export function ErrorNote({ children }) {
  if (!children) return null
  return (
    <p
      role="alert"
      className="border border-blush-500/40 bg-blush-200/20 px-4 py-3 text-sm text-blush-600"
    >
      {children}
    </p>
  )
}

export function SuccessNote({ children }) {
  if (!children) return null
  return (
    <p
      role="status"
      className="border border-sage-400/50 bg-sage-100 px-4 py-3 text-sm text-sage-600"
    >
      {children}
    </p>
  )
}

export function SearchInput({ value, onChange, placeholder, label }) {
  return (
    <div className="relative">
      <Icon
        name="search"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        className="w-full border border-ink-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-ink-950"
      />
    </div>
  )
}

export function BarChart({ series }) {
  const peak = Math.max(...series.map((day) => day.revenue), 1)

  return (
    <div className="px-5 py-6">
      <div className="flex h-40 items-end gap-1.5" role="img" aria-label="Revenue, last 14 days">
        {series.map((day) => (
          <div key={day.date} className="group relative flex-1">
            <div
              className="w-full bg-ink-950/85 transition-colors group-hover:bg-blush-500"
              style={{ height: `${Math.max((day.revenue / peak) * 100, day.revenue > 0 ? 3 : 1)}%` }}
            />
            <span className="sr-only">
              {day.date}: {formatPrice(day.revenue)}, {day.orders} orders
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.15em] text-ink-400">
        <span>{series[0]?.date.slice(5)}</span>
        <span>peak {formatPrice(peak)}</span>
        <span>{series[series.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  )
}

export function MeterRow({ label, value, total }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <li className="flex items-center justify-between gap-4 py-2.5">
      <span className="truncate text-sm text-ink-700">{label}</span>
      <span className="flex items-center gap-3">
        <span className="h-1.5 w-24 bg-ink-100">
          <span className="block h-full bg-blush-400" style={{ width: `${pct}%` }} />
        </span>
        <span className="w-20 text-right text-sm tabular-nums text-ink-500">
          {formatPrice(value)}
        </span>
      </span>
    </li>
  )
}
