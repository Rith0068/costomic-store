import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatPrice, getCategoryById, getProductById, PRODUCTS } from '../data/products'
import { useCart } from '../context/CartContext'
import { Icon } from '../components/Icon'
import { ProductCard, Rating } from '../components/ProductCard'
import { ProductVisual, shapeForCategory } from '../components/ProductVisual'
import { Reveal, SectionHeading } from '../components/ui/Section'

const TABS = [
  { id: 'description', label: 'Description' },
  { id: 'how', label: 'How to use' },
  { id: 'ingredients', label: 'Ingredients' },
  { id: 'shipping', label: 'Shipping & returns' },
]

export default function ProductDetailRoute() {
  const { id } = useParams()
  return <ProductDetail key={id} productId={id} />
}

function ProductDetail({ productId }) {
  const product = getProductById(productId)
  const { addItem } = useCart()
  const [variant, setVariant] = useState(() => product?.sizes[0] ?? null)
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState('description')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!product) return
    document.title = `${product.name} — LUMIÈRE`
  }, [product])

  useEffect(() => {
    if (!added) return
    const timer = setTimeout(() => setAdded(false), 2000)
    return () => clearTimeout(timer)
  }, [added])

  const related = useMemo(
    () => (product ? PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id) : []),
    [product],
  )

  if (!product) {
    return (
      <section className="container-page flex flex-col items-center py-32 text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-5 text-5xl">Product not found</h1>
        <p className="mt-4 max-w-md text-ink-500">
          The product you are looking for may have been renamed or is no longer part of the
          collection.
        </p>
        <Link to="/products" className="btn-primary mt-9">
          Back to products
        </Link>
      </section>
    )
  }

  const category = getCategoryById(product.category)

  const handleAdd = () => {
    addItem(product, variant)
    setAdded(true)
  }

  return (
    <>
      <div className="container-page pt-8">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.2em] text-ink-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="inline-block py-1 transition-colors hover:text-ink-950">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link to="/products" className="inline-block py-1 transition-colors hover:text-ink-950">
                Products
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                to={`/products?category=${product.category}`}
                className="inline-block py-1 transition-colors hover:text-ink-950"
              >
                {category?.name}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-ink-700">{product.name}</li>
          </ol>
        </nav>
      </div>

      <section className="container-page grid gap-12 py-12 lg:grid-cols-2 lg:gap-16 lg:py-16">
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <div className="relative">
            <ProductVisual
              shape={shapeForCategory(product.category)}
              from={product.shade.from}
              to={product.shade.to}
              label={product.name}
              className="aspect-[4/5] w-full"
            />
            {product.badge && (
              <span className="absolute left-5 top-5 bg-ink-950 px-3.5 py-2 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-ink-50">
                {product.badge}
              </span>
            )}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {['texture', 'packaging', 'result'].map((label, index) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 border border-ink-200 p-4 text-center"
              >
                <Icon
                  name={['leaf', 'refresh', 'check'][index]}
                  className="size-5 text-ink-500"
                />
                <span className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-400">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <p className="eyebrow">{category?.name}</p>
          <h1 className="mt-4 text-4xl leading-[1.08] sm:text-5xl">{product.name}</h1>
          <p className="mt-3 text-base text-ink-500">{product.tagline}</p>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Rating value={product.rating} reviews={product.reviews} />
            <span className="h-3 w-px bg-ink-200" />
            <span className="text-lg tabular-nums">{formatPrice(product.price)}</span>
          </div>

          <p className="mt-7 leading-relaxed text-ink-600">{product.shortDescription}</p>

          <ul className="mt-7 space-y-3">
            {product.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm text-ink-600">
                <Icon name="check" className="mt-0.5 size-4 shrink-0 text-sage-500" />
                {benefit}
              </li>
            ))}
          </ul>

          {product.sizes.length > 1 && (
            <div className="mt-9">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.25em] text-ink-950">
                {category?.id === 'makeup' ? 'Shade' : 'Size'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setVariant(size)}
                    aria-pressed={variant === size}
                    className={`min-w-16 border px-4 py-2.5 text-sm transition-all duration-300 ${
                      variant === size
                        ? 'border-ink-950 bg-ink-950 text-ink-50'
                        : 'border-ink-200 text-ink-600 hover:border-ink-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-ink-200">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3.5 text-ink-600 transition-colors hover:text-ink-950"
                aria-label="Decrease quantity"
              >
                <Icon name="minus" className="size-4" />
              </button>
              <span className="min-w-9 text-center text-sm tabular-nums">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="p-3.5 text-ink-600 transition-colors hover:text-ink-950"
                aria-label="Increase quantity"
              >
                <Icon name="plus" className="size-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="btn-primary flex-1 min-w-52"
            >
              {added ? (
                <>
                  <Icon name="check" className="size-4" /> Added to bag
                </>
              ) : (
                `Add to bag · ${formatPrice(product.price * quantity)}`
              )}
            </button>
          </div>

          <p className="mt-4 flex items-center gap-2 text-xs text-ink-400">
            <Icon name="truck" className="size-4" />
            Free Swiss delivery over CHF 60 · Two complimentary samples included
          </p>

          <div className="mt-12 border-t border-ink-200">
            <div className="flex overflow-x-auto border-b border-ink-200">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  aria-selected={tab === item.id}
                  role="tab"
                  className={`shrink-0 border-b-2 px-5 py-4 text-[0.7rem] uppercase tracking-[0.18em] transition-colors ${
                    tab === item.id
                      ? 'border-ink-950 text-ink-950'
                      : 'border-transparent text-ink-400 hover:text-ink-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="py-7">
              {tab === 'description' && (
                <div className="fade-up space-y-6">
                  <p className="leading-relaxed text-ink-600">{product.description}</p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {product.keyIngredients.map((ingredient) => (
                      <div key={ingredient.name} className="border-t border-ink-200 pt-4">
                        <p className="text-sm font-medium text-ink-950">{ingredient.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.15em] text-ink-400">
                          {ingredient.note}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs uppercase tracking-[0.15em] text-ink-400">
                    Suitable for · {product.skinType.join(' · ')}
                  </p>
                </div>
              )}

              {tab === 'how' && (
                <div className="fade-up space-y-5">
                  <p className="leading-relaxed text-ink-600">{product.howToUse}</p>
                  <ol className="space-y-3">
                    {['Cleanse and pat skin dry', 'Apply in the order shown', 'Follow with SPF each morning'].map(
                      (step, index) => (
                        <li key={step} className="flex items-center gap-3 text-sm text-ink-600">
                          <span className="flex size-7 items-center justify-center rounded-full bg-ink-100 text-xs text-ink-600">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ),
                    )}
                  </ol>
                </div>
              )}

              {tab === 'ingredients' && (
                <div className="fade-up">
                  <p className="text-sm leading-relaxed text-ink-600">{product.ingredients}</p>
                  <p className="mt-5 flex items-center gap-2 text-xs text-ink-400">
                    <Icon name="leaf" className="size-4" />
                    Free from parabens, sulphates, mineral oil, parabens and synthetic fragrance.
                  </p>
                </div>
              )}

              {tab === 'shipping' && (
                <div className="fade-up space-y-3 text-sm text-ink-600">
                  <p>Standard Swiss delivery, CHF 5.90 — free on orders over CHF 60.</p>
                  <p>Express delivery available at checkout, next business day in Switzerland.</p>
                  <p>30-day returns on unopened products, return shipping covered in Switzerland.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-ink-200 py-20">
          <div className="container-page">
            <SectionHeading eyebrow="Pairs well with" title={`More from ${category?.name}`} />
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <ProductCard key={item.id} product={item} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-page pb-8">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-6 border border-ink-200 bg-ink-100/50 p-8 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="text-3xl">Not sure where to start?</h2>
              <p className="mt-2 text-sm text-ink-500">
                Take the two-minute routine finder and we will suggest the right steps.
              </p>
            </div>
            <Link to="/#routine-finder" className="btn-primary shrink-0">
              Find your routine
              <Icon name="arrow-right" className="size-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
