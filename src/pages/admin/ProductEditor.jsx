import { useState } from 'react'
import { api } from '../../lib/api'
import { CATEGORIES } from '../../data/products'

const BLANK = {
  name: '',
  tagline: '',
  category: 'serum',
  price: '',
  rating: '4.5',
  reviews: '0',
  stock: '0',
  badge: '',
  photo: '',
  photoAlt: '',
  sizes: '50ml',
  shortDescription: '',
  description: '',
  ingredients: '',
  howToUse: '',
  skinType: 'All skin types',
  benefits: '',
}

const fieldClass =
  'mt-1.5 w-full border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-ink-950'

function toForm(product) {
  if (!product) return { ...BLANK }
  return {
    name: product.name ?? '',
    tagline: product.tagline ?? '',
    category: product.category ?? 'serum',
    price: String(product.price ?? ''),
    rating: String(product.rating ?? ''),
    reviews: String(product.reviews ?? ''),
    stock: String(product.stock ?? 0),
    badge: product.badge ?? '',
    photo: product.photo ?? '',
    photoAlt: product.photoAlt ?? '',
    sizes: (product.sizes ?? []).join('\n'),
    shortDescription: product.shortDescription ?? '',
    description: product.description ?? '',
    ingredients: product.ingredients ?? '',
    howToUse: product.howToUse ?? '',
    skinType: (product.skinType ?? []).join('\n'),
    benefits: (product.benefits ?? []).join('\n'),
  }
}

function toPayload(form) {
  return {
    ...form,
    price: Number(form.price),
    rating: Number(form.rating),
    reviews: Number(form.reviews),
    stock: Number(form.stock),
    sizes: form.sizes.split('\n').filter(Boolean),
    skinType: form.skinType.split('\n').filter(Boolean),
    benefits: form.benefits.split('\n').filter(Boolean),
  }
}

export function ProductEditor({ product, onSaved, onCancel }) {
  const [form, setForm] = useState(() => toForm(product))
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (product) await api.updateProduct(product.id, toPayload(form))
      else await api.createProduct(toPayload(form))
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="border border-ink-200 bg-ink-50 p-6"
      aria-label={product ? 'Edit product' : 'New product'}
    >
      <h2 className="font-display text-2xl">
        {product ? `Edit: ${product.name}` : 'New product'}
      </h2>

      {error && (
        <p
          role="alert"
          className="mt-4 border border-blush-500/40 bg-blush-200/20 px-4 py-3 text-sm text-blush-600"
        >
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500 sm:col-span-2">
          Name
          <input value={form.name} onChange={set('name')} required className={fieldClass} />
        </label>

        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
          Price (CHF)
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={set('price')}
            required
            className={fieldClass}
          />
        </label>

        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
          Category
          <select value={form.category} onChange={set('category')} className={fieldClass}>
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
          Rating
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={form.rating}
            onChange={set('rating')}
            className={fieldClass}
          />
        </label>

        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
          Reviews
          <input
            type="number"
            min="0"
            value={form.reviews}
            onChange={set('reviews')}
            className={fieldClass}
          />
        </label>

        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
          Stock
          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={set('stock')}
            className={fieldClass}
          />
        </label>

        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
          Badge
          <input
            value={form.badge}
            onChange={set('badge')}
            placeholder="Bestseller"
            className={fieldClass}
          />
        </label>

        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
          Tagline
          <input value={form.tagline} onChange={set('tagline')} className={fieldClass} />
        </label>

        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500 sm:col-span-2">
          Short description
          <input
            value={form.shortDescription}
            onChange={set('shortDescription')}
            required
            className={fieldClass}
          />
        </label>

        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500 sm:col-span-2">
          Long description
          <textarea
            rows={4}
            value={form.description}
            onChange={set('description')}
            className={fieldClass}
          />
        </label>

        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
          Image path
          <input
            value={form.photo}
            onChange={set('photo')}
            placeholder="/products/example.jpg"
            className={fieldClass}
          />
        </label>

        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
          Image alt text
          <input value={form.photoAlt} onChange={set('photoAlt')} className={fieldClass} />
        </label>

        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
          Sizes (one per line)
          <textarea rows={3} value={form.sizes} onChange={set('sizes')} className={fieldClass} />
        </label>

        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
          Skin types (one per line)
          <textarea
            rows={3}
            value={form.skinType}
            onChange={set('skinType')}
            className={fieldClass}
          />
        </label>

        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500 sm:col-span-2">
          Benefits (one per line)
          <textarea
            rows={4}
            value={form.benefits}
            onChange={set('benefits')}
            className={fieldClass}
          />
        </label>

        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500 sm:col-span-2">
          Ingredients
          <textarea
            rows={2}
            value={form.ingredients}
            onChange={set('ingredients')}
            className={fieldClass}
          />
        </label>

        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500 sm:col-span-2">
          How to use
          <textarea
            rows={2}
            value={form.howToUse}
            onChange={set('howToUse')}
            className={fieldClass}
          />
        </label>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? 'Saving...' : product ? 'Save changes' : 'Create product'}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  )
}