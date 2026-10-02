import { useLocation, Link } from 'react-router-dom'
import { formatPrice } from '../data/products'
import { Icon } from '../components/Icon'

export default function OrderConfirmation() {
  const { state } = useLocation()
  const order = state?.order

  if (!order) {
    return (
      <section className="container-page flex flex-col items-center py-32 text-center">
        <p className="eyebrow">No recent order</p>
        <h1 className="mt-5 text-4xl">Nothing to confirm</h1>
        <p className="mt-4 max-w-md text-ink-500">
          Place an order and the confirmation will appear here.
        </p>
        <Link to="/products" className="btn-primary mt-9">
          Browse products
        </Link>
      </section>
    )
  }

  return (
    <section className="container-page py-24">
      <div className="mx-auto max-w-2xl">
        <span className="flex size-14 items-center justify-center rounded-full bg-sage-200 text-sage-600">
          <Icon name="check" className="size-6" />
        </span>
        <p className="eyebrow mt-8">Order confirmed</p>
        <h1 className="mt-4 text-4xl">Thank you for your order</h1>
        <p className="mt-4 text-ink-500">
          We have emailed a receipt. Your order reference is{' '}
          <span className="font-medium text-ink-950">{order.id}</span>.
        </p>

        <ul className="mt-10 divide-y divide-ink-200 border-y border-ink-200">
          {order.lines.map((line) => (
            <li key={line.productId} className="flex items-baseline justify-between gap-6 py-4">
              <span className="text-sm">
                {line.name}
                <span className="text-ink-400">
                  {line.variant ? ` · ${line.variant}` : ''} · Qty {line.quantity}
                </span>
              </span>
              <span className="text-sm tabular-nums">{formatPrice(line.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-ink-500">Total</span>
          <span className="font-display text-2xl tabular-nums">{formatPrice(order.total)}</span>
        </div>

        <Link to="/products" className="btn-primary mt-10">
          Continue shopping
        </Link>
      </div>
    </section>
  )
}