import { newId, slugify } from './store.js'
import { badRequest, bool, hexColor, list, num, str } from './validate.js'

export const CATEGORY_IDS = ['serum', 'moisturiser', 'cleanser', 'makeup', 'mask']

function parseKeyIngredients(value) {
  if (!value) return []
  const arr = Array.isArray(value) ? value : String(value).split('\n')
  return arr
    .map((entry) => {
      if (entry && typeof entry === 'object') {
        const name = str(entry.name, { field: 'Ingredient name', max: 80 })
        if (!name) return null
        return { name, note: str(entry.note, { field: 'Ingredient note', max: 80 }) }
      }
      const [name, ...rest] = String(entry).split('|')
      return {
        name: str(name, { field: 'Ingredient name', max: 80 }),
        note: str(rest.join('|'), { field: 'Ingredient note', max: 80 }),
      }
    })
    .filter((entry) => entry.name)
    .slice(0, 12)
}

function parseSizes(value) {
  const sizes = list(value, { field: 'Size', max: 8, itemMax: 24 })
  return sizes.length ? sizes : ['50ml']
}

function parseShade(value) {
  const shade = value && typeof value === 'object' ? value : {}
  return {
    from: hexColor(shade.from, { field: 'Shade colour', fallback: '#f6d6d1' }),
    to: hexColor(shade.to, { field: 'Shade colour', fallback: '#e28f87' }),
  }
}

export function normaliseProduct(input = {}, existing = null) {
  const name = str(input.name, { field: 'Name', min: 2, max: 90, required: true })

  const category = str(input.category, {
    field: 'Category',
    max: 40,
    required: true,
  }).toLowerCase()
  if (!CATEGORY_IDS.includes(category)) {
    throw badRequest(`Category must be one of: ${CATEGORY_IDS.join(', ')}`)
  }

  const price = num(input.price, { field: 'Price', min: 0, max: 100000, required: true })
  const rating = num(input.rating ?? existing?.rating, {
    field: 'Rating',
    min: 0,
    max: 5,
    fallback: 0,
  })
  const reviews = num(input.reviews ?? existing?.reviews, {
    field: 'Reviews',
    min: 0,
    max: 1000000,
    fallback: 0,
  })
  const stock = num(input.stock ?? existing?.stock, {
    field: 'Stock',
    min: 0,
    max: 100000,
    fallback: 0,
  })

  const photo = str(input.photo, { field: 'Image', max: 400 })
  const shortDescription = str(input.shortDescription, {
    field: 'Short description',
    max: 220,
    required: true,
  })
  const description = str(input.description, { field: 'Description', max: 4000 })

  return {
    id: existing?.id || str(input.id, { field: 'Id', max: 60 }) || newId('p'),
    slug: slugify(input.slug || existing?.slug || name),
    name,
    tagline: str(input.tagline, { field: 'Tagline', max: 90 }) || shortDescription.slice(0, 70),
    category,
    price,
    rating,
    reviews,
    stock,
    badge: str(input.badge, { field: 'Badge', max: 30 }),
    photo,
    photoAlt: str(input.photoAlt, { field: 'Image alt text', max: 160 }),
    shade: parseShade(input.shade ?? existing?.shade),
    sizes: parseSizes(input.sizes ?? existing?.sizes),
    shortDescription,
    description: description || shortDescription,
    benefits: list(input.benefits, { field: 'Benefit', max: 8, itemMax: 200 }),
    ingredients: str(input.ingredients, { field: 'Ingredients', max: 1500 }),
    howToUse: str(input.howToUse, { field: 'How to use', max: 1500 }),
    skinType: list(input.skinType, { field: 'Skin type', max: 8, itemMax: 40 }),
    keyIngredients: parseKeyIngredients(input.keyIngredients),
    featured: bool(input.featured, existing?.featured ?? false),
  }
}
