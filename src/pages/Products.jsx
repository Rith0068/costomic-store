import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CATEGORIES, PRODUCTS, getCategoryById } from '../data/products'
import { Icon } from '../components/Icon'
import { ProductCard } from '../components/ProductCard'
import { Reveal } from '../components/ui/Section'

const SKIN_TYPES = ['All skin types', 'Dry', 'Oily', 'Combination', 'Sensitive', 'Mature', 'Normal']

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Highest rated' },
  { id: 'name', label: 'Alphabetical' },
]

function FilterPanel({ skinType, onSkinType, category, onCategory, onClear, activeCount }) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[0.7rem] font-medium uppercase tracking-[0.25em] text-ink-950">
            Category
          </h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-ink-500 underline underline-offset-4 transition-colors hover:text-ink-950"
            >
              Clear ({activeCount})
            </button>
          )}
        </div>
        <ul className="mt-4 space-y-1">
          {[{ id: 'all', name: 'All products' }, ...CATEGORIES].map((item) => {
            const isActive = category === item.id
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onCategory(item.id)}
                  aria-pressed={isActive}
                  className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-ink-950 text-ink-50'
                      : 'text-ink-600 hover:bg-ink-100 hover:text-ink-950'
                  }`}
                >
                  {item.name}
                  <span className="text-xs opacity-60">
                    {item.id === 'all'
                      ? PRODUCTS.length
                      : PRODUCTS.filter((p) => p.category === item.id).length}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="border-t border-ink-200 pt-8">
        <h2 className="text-[0.7rem] font-medium uppercase tracking-[0.25em] text-ink-950">
          Skin type
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col">
          {SKIN_TYPES.map((type) => {
            const isActive = skinType === type
            return (
              <li key={type}>
                <button
                  type="button"
                  onClick={() => onSkinType(isActive ? 'all' : type)}
                  aria-pressed={isActive}
                  className={`w-full rounded-full border px-4 py-2 text-xs transition-all duration-300 lg:w-full lg:rounded-sm lg:text-left lg:text-sm ${
                    isActive
                      ? 'border-ink-950 bg-ink-950 text-ink-50'
                      : 'border-ink-200 text-ink-600 hover:border-ink-400'
                  }`}
                >
                  {type}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [skinType, setSkinType] = useState('all')
  const [sort, setSort] = useState('featured')
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    if (!filtersOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setFiltersOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [filtersOpen])

  const category = searchParams.get('category') ?? 'all'

  useEffect(() => {
    setSearchParams(
      (params) => {
        if (category === 'all') params.delete('category')
        else params.set('category', category)
        return params
      },
      { replace: true },
    )
  }, [category, setSearchParams])

  useEffect(() => {
    document.title = category === 'all'
      ? 'All products — LUMIÈRE'
      : `${getCategoryById(category)?.name ?? 'Products'} — LUMIÈRE`
  }, [category])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const result = PRODUCTS.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category
      const matchesSkin =
        skinType === 'all' || product.skinType.some((t) => t === skinType)
      const matchesQuery =
        term === '' ||
        product.name.toLowerCase().includes(term) ||
        product.shortDescription.toLowerCase().includes(term) ||
        product.ingredients.toLowerCase().includes(term)
      return matchesCategory && matchesSkin && matchesQuery
    })

    const sorters = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      name: (a, b) => a.name.localeCompare(b.name),
      featured: (a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0) || b.rating - a.rating,
    }

    return [...result].sort(sorters[sort])
  }, [category, skinType, query, sort])

  const activeCount = (category !== 'all' ? 1 : 0) + (skinType !== 'all' ? 1 : 0)

  const handleCategory = (id) => {
    if (id === 'all') {
      setSearchParams({}, { replace: true })
      return
    }
    setSearchParams({ category: id }, { replace: true })
  }

  const handleClear = () => {
    setSkinType('all')
    setSearchParams({}, { replace: true })
  }

  return (
    <>
      <section className="border-b border-ink-200 bg-ink-100/50">
        <div className="container-page py-16 lg:py-20">
          <Reveal>
            <p className="eyebrow">The collection</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              {category === 'all' ? (
                'Every formula'
              ) : (
                <>
                  {getCategoryById(category)?.name}
                  <span className="block text-2xl font-light italic text-ink-400">
                    {getCategoryById(category)?.tagline}
                  </span>
                </>
              )}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl leading-relaxed text-ink-500">
              {category === 'all'
                ? 'Eight clinically tested essentials. Filter by category or skin type to find what your routine is missing.'
                : getCategoryById(category)?.description}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-200 pb-5">
          <div className="relative flex-1 sm:max-w-sm">
            <Icon
              name="search"
              className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-ink-400"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products or ingredients"
              aria-label="Search products"
              className="w-full border-b border-ink-200 bg-transparent py-2.5 pl-7 pr-2 text-sm outline-none transition-colors placeholder:text-ink-400 focus:border-ink-950"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className="flex items-center gap-2 border border-ink-200 px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-ink-700 transition-colors hover:border-ink-950 lg:hidden"
              aria-expanded={filtersOpen}
              aria-controls="product-filters"
            >
              <Icon name="arrow-right" className="size-3.5" />
              Filters
              {activeCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-ink-950 text-[0.6rem] text-ink-50">
                  {activeCount}
                </span>
              )}
            </button>

            <label className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-ink-400">
              <span className="hidden sm:inline">Sort</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Sort products"
                className="border border-ink-200 bg-transparent px-3 py-2.5 text-xs text-ink-950 outline-none transition-colors focus:border-ink-950"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="relative isolate mt-10 grid gap-10 lg:grid-cols-12">
          {filtersOpen && (
            <button
              type="button"
              aria-label="Close filters"
              tabIndex={-1}
              onClick={() => setFiltersOpen(false)}
              className="absolute inset-0 -z-10 bg-ink-950/20 backdrop-blur-[2px] lg:hidden"
            />
          )}

          <aside
            id="product-filters"
            className={`lg:col-span-3 ${
              filtersOpen
                ? 'fade-up absolute inset-x-0 top-0 z-30 max-h-[75vh] overflow-y-auto overscroll-contain border border-ink-200 bg-ink-50 p-6 shadow-2xl lg:static lg:z-auto lg:max-h-none lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none'
                : 'hidden lg:col-span-3 lg:block'
            }`}
          >
            <FilterPanel
              skinType={skinType}
              onSkinType={setSkinType}
              category={category}
              onCategory={handleCategory}
              onClear={handleClear}
              activeCount={activeCount}
            />
          </aside>

          <div className="lg:col-span-9">
            <p className="mb-8 text-xs uppercase tracking-[0.2em] text-ink-400" aria-live="polite">
              {filtered.length} product{filtered.length === 1 ? '' : 's'}
              {query && ` matching “${query}”`}
            </p>

            {filtered.length > 0 ? (
              <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center border border-dashed border-ink-300 px-8 py-20 text-center">
                <Icon name="search" className="size-9 text-ink-300" strokeWidth={1} />
                <h2 className="mt-6 text-3xl">Nothing matches those filters</h2>
                <p className="mt-3 max-w-sm text-sm text-ink-500">
                  Try a different skin type, or clear your filters to see the full collection of
                  eight formulas.
                </p>
                <button type="button" onClick={handleClear} className="btn-primary mt-7">
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
