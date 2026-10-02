import { useState } from 'react'
import { ProductVisual, shapeForCategory } from './ProductVisual'

/**
 * Renders real product photography, falling back to the generated SVG artwork
 * if the photo is missing or fails to load, so the layout never breaks.
 */
export function ProductImage({ product, className = '', priority = false }) {
  const [failed, setFailed] = useState(false)
  const src = product?.photo

  if (!src || failed) {
    return (
      <ProductVisual
        shape={shapeForCategory(product?.category)}
        from={product?.shade?.from}
        to={product?.shade?.to}
        label={product?.name}
        className={className}
      />
    )
  }

  return (
    <div className={`relative overflow-hidden bg-ink-100 ${className}`}>
      <img
        src={src}
        alt={product.photoAlt ?? product.name}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
        className="size-full object-cover transition-transform duration-700 ease-out-expo"
      />
    </div>
  )
}

/**
 * Photography for editorial sections (About, Contact) that also falls back to
 * a generated gradient tile.
 */
export function EditorialImage({ src, alt, from, to, shape = 'bottle', className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <ProductVisual shape={shape} from={from} to={to} label={alt} className={className} />
    )
  }

  return (
    <div className={`relative overflow-hidden bg-ink-100 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="size-full object-cover"
      />
    </div>
  )
}
