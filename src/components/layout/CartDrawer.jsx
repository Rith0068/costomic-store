import { Link } from 'react-router-dom'
import { formatPrice } from '../../data/products'
import { useCart } from '../../context/CartContext'
import { useLockBodyScroll, useOnEscape } from '../../hooks'
import { Icon } from '../Icon'
import { ProductImage } from '../ProductImage'

const FREE_SHIPPING_THRESHOLD = 60

export function CartDrawer() {
  const { items, subtotal, isOpen, closeCart, updateQuantity, removeItem, count } = useCart()

  useLockBodyScroll(isOpen)
  useOnEscape(closeCart, isOpen)

  if (!isOpen) return null

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
        onClick={closeCart}
        aria-label="Close shopping bag"
      />

      <aside className="fade-up absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ink-50 shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink-200 px-6 py-5">
          <h2 className="font-display text-2xl">
            Your Bag
            {count > 0 && <span className="ml-2 text-base text-ink-400">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="-mr-2 p-2 text-ink-950 transition-colors hover:text-ink-500"
            aria-label="Close shopping bag"
          >
            <Icon name="close" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <Icon name="bag" className="size-10 text-ink-300" />
            <p className="mt-5 font-display text-2xl">Your bag is empty</p>
            <p className="mt-2 text-sm text-ink-500">
              Discover our Swiss-formulated skincare and find your routine.
            </p>
            <Link to="/products" onClick={closeCart} className="btn-primary mt-7">
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-ink-200 bg-ink-100/50 px-6 py-4">
              <p className="text-xs text-ink-600">
                {remaining > 0 ? (
                  <>
                    You are{' '}
                    <span className="font-medium text-ink-950">{formatPrice(remaining)}</span> away
                    from complimentary shipping
                  </>
                ) : (
                  <span className="flex items-center gap-1.5 text-sage-600">
                    <Icon name="check" className="size-4" /> Complimentary shipping unlocked
                  </span>
                )}
              </p>
              <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-ink-200">
                <div
                  className="h-full rounded-full bg-ink-950 transition-all duration-500 ease-out-expo"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-ink-200 overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-5">
                  <Link
                    to={`/products/${item.id}`}
                    onClick={closeCart}
                    className="shrink-0"
                    aria-label={item.name}
                  >
                    <ProductImage product={item} className="size-24 rounded-sm" />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        to={`/products/${item.id}`}
                        onClick={closeCart}
                        className="font-display text-lg leading-tight hover:text-ink-500"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="shrink-0 p-1 text-ink-400 transition-colors hover:text-blush-600"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Icon name="close" className="size-4" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs uppercase tracking-[0.15em] text-ink-400">
                      {item.variant}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border border-ink-200">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="p-2 text-ink-600 transition-colors hover:text-ink-950"
                          aria-label="Decrease quantity"
                        >
                          <Icon name="minus" className="size-3.5" />
                        </button>
                        <span className="min-w-7 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="p-2 text-ink-600 transition-colors hover:text-ink-950"
                          aria-label="Increase quantity"
                        >
                          <Icon name="plus" className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-sm tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-ink-200 px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-600">Subtotal</span>
                <span className="text-lg tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-ink-400">
                Taxes included. Shipping calculated at checkout.
              </p>
              <Link to="/contact" onClick={closeCart} className="btn-primary mt-5 w-full">
                Proceed to checkout
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="mt-3 w-full text-center text-[0.7rem] uppercase tracking-[0.2em] text-ink-500 transition-colors hover:text-ink-950"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
