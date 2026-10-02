import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, getCategoryById } from '../data/products'
import { useCart } from '../context/CartContext'
import { Icon } from './Icon'
import { ProductImage } from './ProductImage'

export function Rating({ value, reviews, className = '' }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex gap-0.5 text-gold-500" aria-label={`Rated ${value} out of 5`}>
        {Array.from({ length: 5 }, (_, index) => (
          <Icon
            key={index}
            name="star"
            className={`size-3 ${index < Math.round(value) ? '' : 'opacity-25'}`}
          />
        ))}
      </div>
      {typeof reviews === 'number' && (
        <span className="text-xs text-ink-400">({reviews})</span>
      )}
    </div>
  )
}

export function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart()
  const [hovered, setHovered] = useState(false)
  const category = getCategoryById(product.category)

  return (
    <article
      className="group fade-up flex flex-col"
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.id}`} aria-label={product.name}>
          <ProductImage
            product={product}
            priority={index < 4}
            className="aspect-[4/5] w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.03] [&>img]:group-hover:scale-[1.03]"
          />
        </Link>

        {product.badge && (
          <span className="absolute left-4 top-4 bg-ink-950 px-3 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-ink-50">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => addItem(product)}
          className="absolute inset-x-0 bottom-0 translate-y-full bg-ink-950/95 py-4 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-ink-50 backdrop-blur transition-transform duration-500 ease-out-expo hover:bg-ink-800 focus-visible:translate-y-0 group-hover:translate-y-0"
        >
          Add to bag
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <p className="text-[0.65rem] uppercase tracking-[0.25em] text-ink-400">
          {category?.name}
        </p>
        <h3 className="mt-2 font-display text-xl leading-snug">
          <Link to={`/products/${product.id}`} className="transition-colors hover:text-ink-500">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
          {product.shortDescription}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-sm tabular-nums">{formatPrice(product.price)}</span>
          <Rating
            value={product.rating}
            reviews={hovered ? product.reviews : undefined}
            className="justify-end"
          />
        </div>
      </div>
    </article>
  )
}
