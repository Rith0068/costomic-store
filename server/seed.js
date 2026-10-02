import { PRODUCTS } from '../src/data/products.js'
import { DEFAULT_SETTINGS, normaliseSettings } from './analytics.js'
import { hashPassword } from './auth.js'
import { newId, read, update } from './store.js'

export async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@lumiere.com').toLowerCase()
  const password = process.env.ADMIN_PASSWORD

  if (!password) {
    throw new Error(
      'ADMIN_PASSWORD is not set. Copy .env.example to .env and set a password of at least 12 characters.',
    )
  }
  if (password.length < 12) {
    throw new Error('ADMIN_PASSWORD must be at least 12 characters')
  }

  const existing = (await read('users', [])).find((user) => user.email === email)
  if (existing) {
    if (existing.role !== 'admin') {
      await update('users', [], (users) => {
        const user = users.find((entry) => entry.email === email)
        if (user) user.role = 'admin'
      })
    }
    return { created: false, email }
  }

  const passwordHash = await hashPassword(password)

  await update('users', [], (users) => {
    users.push({
      id: newId('u'),
      name: 'Store Administrator',
      email,
      passwordHash,
      role: 'admin',
      createdAt: new Date().toISOString(),
    })
  })

  return { created: true, email }
}

export async function ensureProducts() {
  const current = await read('products', [])
  if (current.length) {
    let patched = 0
    await update('products', [], (products) => {
      for (const product of products) {
        if (!Number.isFinite(product.stock)) {
          product.stock = 40 + ((product.name?.length ?? 0) * 7) % 80
          patched += 1
        }
      }
    })
    return { created: 0, backfilled: patched }
  }

  await update('products', [], (products) => {
    products.push(
      ...PRODUCTS.map((product, index) => ({
        ...product,
        featured: false,
        stock: 40 + index * 11,
      })),
    )
  })
  return { created: PRODUCTS.length }
}

export async function ensureSettings() {
  const current = await read('settings', DEFAULT_SETTINGS)
  const settings = normaliseSettings({}, current)
  await update('settings', DEFAULT_SETTINGS, (draft) => {
    Object.assign(draft, settings)
  })
  return settings
}
