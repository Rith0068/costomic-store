import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cookieParser from 'cookie-parser'
import express from 'express'
import session from 'express-session'

import {
  clearLoginFailures,
  hashPassword,
  loginRateLimit,
  parseCredentials,
  publicUser,
  recordLoginFailure,
  requireAdmin,
  requireUser,
  verifyPassword,
} from './auth.js'
import {
  DEFAULT_SETTINGS,
  accountSummary,
  assertOrderStatus,
  buildSeries,
  buildStats,
  buildSummary,
  categorySplit,
  customerRows,
  inventoryRows,
  normaliseSettings,
  orderRows,
  registrationSeries,
  round2,
  topProducts,
} from './analytics.js'
import { normaliseProduct } from './productSchema.js'
import { ensureAdmin, ensureProducts, ensureSettings } from './seed.js'
import { createSessionStore } from './sessionStore.js'
import { newId, read, slugify, update } from './store.js'
import { HttpError, badRequest, email as parseEmail, num, str } from './validate.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(here, '..', 'dist')

if (!process.env.SESSION_SECRET) {
  console.warn('[server] SESSION_SECRET not set - sessions will not survive a restart')
}

const app = express()
app.set('trust proxy', 1)
app.use(express.json({ limit: '256kb' }))
app.use(cookieParser())
app.use(
  session({
    name: 'lumiere.sid',
    secret: process.env.SESSION_SECRET || 'dev-only-insecure-secret',
    store: createSessionStore(),
    resave: false,
    saveUninitialized: true,
    rolling: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
)

const route = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

function requireSession(req, res, next) {
  if (!req.session?.userId) return res.status(401).json({ error: 'You need to sign in to do that' })
  return next()
}

function startSession(req, user) {
  const guestCartId = `g:${req.sessionID}`
  return new Promise((resolve) => {
    req.session.regenerate(() => {
      req.session.userId = user.id
      req.session.role = user.role
      req.session.name = user.name
      req.session.email = user.email
      resolve()
    })
  }).then(() => guestCartId)
}

async function mergeGuestCart(req, guestCartId) {
  const userId = `u:${req.session.userId}`
  if (!guestCartId || guestCartId === userId) return

  const carts = await read('carts', {})
  const guest = carts[guestCartId]
  if (!guest?.items?.length) return

  await update('carts', {}, (all) => {
    const target = all[userId] ?? { items: [] }
    for (const item of guest.items) {
      const clash = target.items.find((entry) => entry.key === item.key)
      if (clash) clash.quantity = Math.min(99, clash.quantity + item.quantity)
      else target.items.push(item)
    }
    all[userId] = target
    delete all[guestCartId]
  })
}

async function loadCart(req) {
  const id = req.session?.userId ? `u:${req.session.userId}` : `g:${req.sessionID}`
  const carts = await read('carts', {})
  return carts[id] ?? { items: [] }
}

async function saveCart(req, cart) {
  const id = req.session?.userId ? `u:${req.session.userId}` : `g:${req.sessionID}`
  await update('carts', {}, (carts) => {
    carts[id] = cart
  })
  return cart
}

app.get(
  '/api/auth/me',
  route(async (req, res) => {
    if (!req.session.userId) return res.json({ user: null })
    const users = await read('users', [])
    const user = users.find((entry) => entry.id === req.session.userId)
    if (!user) {
      req.session.destroy(() => {})
      return res.json({ user: null })
    }
    return res.json({ user: publicUser(user) })
  }),
)

app.post(
  '/api/auth/register',
  route(async (req, res) => {
    const email = parseEmail(req.body?.email)
    const password = str(req.body?.password, {
      field: 'Password',
      min: 8,
      max: 200,
      required: true,
    })
    const name = str(req.body?.name, { field: 'Name', min: 2, max: 60, required: true })
    const passwordHash = await hashPassword(password)

    const created = await update('users', [], (users) => {
      if (users.some((user) => user.email === email)) return null
      const user = {
        id: newId('u'),
        name,
        email,
        passwordHash,
        role: 'customer',
        createdAt: new Date().toISOString(),
      }
      users.push(user)
      return user
    })

    if (!created) throw new HttpError(409, 'That email address cannot be used')

    const guestCartId = await startSession(req, created)
    await mergeGuestCart(req, guestCartId)
    return res.status(201).json({ user: publicUser(created), cart: await loadCart(req) })
  }),
)

app.post(
  '/api/auth/login',
  loginRateLimit,
  route(async (req, res) => {
    const { email, password } = parseCredentials(req.body)
    const users = await read('users', [])
    const user = users.find((entry) => entry.email === email)

    const hash = user?.passwordHash ?? '$2b$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012'
    const ok = await verifyPassword(password, hash)

    if (!user || !ok) {
      recordLoginFailure(req)
      throw new HttpError(401, 'Incorrect email or password')
    }

    clearLoginFailures(req)
    const guestCartId = await startSession(req, user)
    await mergeGuestCart(req, guestCartId)
    return res.json({ user: publicUser(user), cart: await loadCart(req) })
  }),
)

app.post(
  '/api/auth/logout',
  route(async (req, res) => {
    await new Promise((resolve) => req.session.destroy(resolve))
    res.clearCookie('lumiere.sid')
    return res.json({ ok: true })
  }),
)

app.post(
  '/api/auth/password',
  requireSession,
  route(async (req, res) => {
    const current = str(req.body?.currentPassword, {
      field: 'Current password',
      min: 1,
      max: 200,
      required: true,
    })
    const next = str(req.body?.newPassword, {
      field: 'New password',
      min: 8,
      max: 200,
      required: true,
    })

    const users = await read('users', [])
    const user = users.find((entry) => entry.id === req.session.userId)
    if (!user) throw new HttpError(401, 'You need to sign in to do that')
    if (!(await verifyPassword(current, user.passwordHash))) {
      throw new HttpError(403, 'Current password is incorrect')
    }

    const passwordHash = await hashPassword(next)
    await update('users', [], (all) => {
      const target = all.find((entry) => entry.id === user.id)
      if (target) target.passwordHash = passwordHash
    })
    return res.json({ ok: true })
  }),
)

app.get(
  '/api/products',
  route(async (req, res) => {
    const products = await read('products', [])
    const category = String(req.query.category ?? '').toLowerCase()
    const search = String(req.query.search ?? '').trim().toLowerCase()

    const filtered = products.filter((product) => {
      if (category && category !== 'all' && product.category !== category) return false
      if (!search) return true
      return [product.name, product.tagline, product.shortDescription, product.ingredients]
        .join(' ')
        .toLowerCase()
        .includes(search)
    })

    return res.json({ products: filtered })
  }),
)

app.get(
  '/api/products/:id',
  route(async (req, res) => {
    const products = await read('products', [])
    const wanted = String(req.params.id)
    const product = products.find(
      (entry) => entry.id === wanted || entry.slug === slugify(wanted),
    )
    if (!product) throw new HttpError(404, 'Product not found')
    return res.json({ product })
  }),
)

app.post('/api/admin/products', requireAdmin, route(createProduct))
app.put('/api/admin/products/:id', requireAdmin, route(updateProduct))
app.delete('/api/admin/products/:id', requireAdmin, route(deleteProduct))

async function createProduct(req, res) {
  const product = normaliseProduct(req.body)
  product.slug = await uniqueSlug(product.slug, null)
  await update('products', [], (products) => {
    products.push(product)
  })
  return res.status(201).json({ product })
}

async function updateProduct(req, res) {
  const products = await read('products', [])
  const index = products.findIndex((entry) => entry.id === req.params.id)
  if (index === -1) throw new HttpError(404, 'Product not found')

  const product = normaliseProduct(req.body, products[index])
  product.slug = await uniqueSlug(product.slug, products[index].id)

  await update('products', [], (all) => {
    all[index] = product
  })
  return res.json({ product })
}

async function deleteProduct(req, res) {
  const products = await read('products', [])
  if (!products.some((entry) => entry.id === req.params.id)) {
    throw new HttpError(404, 'Product not found')
  }

  await update('products', [], (all) => {
    all.splice(
      0,
      all.length,
      ...all.filter((entry) => entry.id !== req.params.id),
    )
  })
  return res.json({ ok: true, deleted: req.params.id })
}

async function uniqueSlug(base, ignoreId) {
  const products = await read('products', [])
  const root = base || 'product'
  let candidate = root
  let n = 2
  while (products.some((product) => product.slug === candidate && product.id !== ignoreId)) {
    candidate = `${root}-${n}`
    n += 1
  }
  return candidate
}

app.get(
  '/api/cart',
  route(async (req, res) => res.json({ cart: await loadCart(req) })),
)

app.post(
  '/api/cart/items',
  route(async (req, res) => {
    const productId = str(req.body?.productId, { field: 'Product', max: 60, required: true })
    const quantity = num(req.body?.quantity, { field: 'Quantity', min: 1, max: 99, fallback: 1 })
    const variant = str(req.body?.variant, { field: 'Size', max: 24 })

    const products = await read('products', [])
    const product = products.find((entry) => entry.id === productId)
    if (!product) throw new HttpError(404, 'That product no longer exists')

    const cart = await loadCart(req)
    const key = `${product.id}::${variant}`
    if (cart.items.some((item) => item.key === key)) {
      throw new HttpError(409, 'That size is already in your bag')
    }

    cart.items.push({
      key,
      productId: product.id,
      variant,
      quantity,
      addedAt: new Date().toISOString(),
      snapshot: {
        name: product.name,
        price: product.price,
        photo: product.photo,
        photoAlt: product.photoAlt,
      },
    })

    await saveCart(req, cart)
    return res.status(201).json({ cart })
  }),
)

app.patch(
  '/api/cart/items/:key',
  route(async (req, res) => {
    const quantity = num(req.body?.quantity, { field: 'Quantity', min: 0, max: 99, required: true })
    const cart = await loadCart(req)
    const item = cart.items.find((entry) => entry.key === req.params.key)
    if (!item) throw new HttpError(404, 'That item is not in your bag')

    if (quantity === 0) cart.items = cart.items.filter((entry) => entry.key !== req.params.key)
    else item.quantity = quantity

    await saveCart(req, cart)
    return res.json({ cart })
  }),
)

app.delete(
  '/api/cart/items/:key',
  route(async (req, res) => {
    const cart = await loadCart(req)
    cart.items = cart.items.filter((entry) => entry.key !== req.params.key)
    await saveCart(req, cart)
    return res.json({ cart })
  }),
)

app.delete(
  '/api/cart',
  route(async (req, res) => {
    await saveCart(req, { items: [] })
    return res.json({ cart: { items: [] } })
  }),
)

app.post(
  '/api/orders',
  route(async (req, res) => {
    requireUser(req)

    const cart = await loadCart(req)
    if (!cart.items.length) throw badRequest('Your bag is empty')

    const products = await read('products', [])
    const lines = cart.items.map((item) => {
      const product = products.find((entry) => entry.id === item.productId)
      if (!product) throw new HttpError(409, `${item.snapshot.name} is no longer available`)
      return {
        productId: product.id,
        name: product.name,
        variant: item.variant,
        quantity: item.quantity,
        unitPrice: product.price,
        lineTotal: Math.round(product.price * item.quantity * 100) / 100,
      }
    })

    const total = Math.round(lines.reduce((sum, line) => sum + line.lineTotal, 0) * 100) / 100
    const order = {
      id: newId('o'),
      userId: req.session.userId,
      email: req.session.email,
      lines,
      total,
      status: 'confirmed',
      placedAt: new Date().toISOString(),
    }

    await update('orders', [], (orders) => {
      orders.push(order)
    })
    await saveCart(req, { items: [] })

    return res.status(201).json({ order: { id: order.id, total, lines, placedAt: order.placedAt } })
  }),
)

app.get(
  '/api/orders',
  requireSession,
  route(async (req, res) => {
    if (req.session.role === 'admin') {
      const all = await read('orders', [])
      return res.json({ orders: all.slice(-100).reverse() })
    }

    const orders = await read('orders', [])
    const mine = orders.filter((order) => order.userId === req.session.userId)
    return res.json({
      orders: mine
        .slice(-100)
        .reverse()
        .map((order) => ({
          ...order,
          itemCount: order.lines.reduce((total, line) => total + line.quantity, 0),
        })),
    })
  }),
)

app.get(
  '/api/account',
  requireSession,
  route(async (req, res) => {
    const [users, orders] = await Promise.all([read('users', []), read('orders', [])])
    const user = users.find((entry) => entry.id === req.session.userId)
    if (!user) throw new HttpError(401, 'You need to sign in to do that')

    const mine = orders.filter((order) => order.userId === user.id)

    return res.json({
      user: publicUser(user),
      stats: accountSummary(mine),
      orders: mine
        .slice(-25)
        .reverse()
        .map((order) => ({
          ...order,
          itemCount: order.lines.reduce((total, line) => total + line.quantity, 0),
        })),
    })
  }),
)

app.patch(
  '/api/account',
  requireSession,
  route(async (req, res) => {
    const name = str(req.body?.name, { field: 'Name', min: 2, max: 60, required: true })

    const updated = await update('users', [], (users) => {
      const user = users.find((entry) => entry.id === req.session.userId)
      if (!user) return null
      user.name = name
      return user
    })

    if (!updated) throw new HttpError(404, 'Account not found')
    req.session.name = name

    return res.json({ user: publicUser(updated) })
  }),
)

app.get(
  '/api/admin/stats',
  requireAdmin,
  route(async (req, res) => {
    const [products, orders, users, settings] = await Promise.all([
      read('products', []),
      read('orders', []),
      read('users', []),
      read('settings', DEFAULT_SETTINGS),
    ])

    return res.json({
      stats: buildStats({ products, orders, users, settings }),
      registrations: registrationSeries(users, 30),
    })
  }),
)

app.get(
  '/api/admin/summary',
  requireAdmin,
  route(async (req, res) => {
    const [products, orders, users, settings] = await Promise.all([
      read('products', []),
      read('orders', []),
      read('users', []),
      read('settings', DEFAULT_SETTINGS),
    ])

    const summary = buildSummary({ products, orders, users, settings })
    const series = buildSeries(orders, 14)
    const half = Math.floor(series.length / 2)

    const previousRevenue = round2(
      series.slice(0, half).reduce((sum, day) => sum + day.revenue, 0),
    )
    const currentRevenue = round2(
      series.slice(half).reduce((sum, day) => sum + day.revenue, 0),
    )

    return res.json({
      summary: {
        ...summary,
        revenueDelta: round2(currentRevenue - previousRevenue),
        ordersDelta: series.slice(half).reduce((sum, day) => sum + day.orders, 0),
      },
      series,
      top: topProducts(orders, products),
      categories: categorySplit(products),
      recent: orderRows(orders, users).slice(0, 6),
      activity: products.slice(-5).reverse().map((product) => ({
        id: product.id,
        name: product.name,
        stock: product.stock ?? 0,
      })),
    })
  }),
)

app.get(
  '/api/admin/orders',
  requireAdmin,
  route(async (req, res) => {
    const [orders, users] = await Promise.all([read('orders', []), read('users', [])])
    return res.json({ orders: orderRows(orders, users) })
  }),
)

app.patch(
  '/api/admin/orders/:id',
  requireAdmin,
  route(async (req, res) => {
    const status = assertOrderStatus(req.body?.status)
    let found = false

    await update('orders', [], (orders) => {
      const order = orders.find((entry) => entry.id === req.params.id)
      if (!order) return
      found = true
      order.status = status
    })

    if (!found) throw new HttpError(404, 'Order not found')
    return res.json({ ok: true, id: req.params.id, status })
  }),
)

app.get(
  '/api/admin/customers',
  requireAdmin,
  route(async (req, res) => {
    const [users, orders] = await Promise.all([read('users', []), read('orders', [])])
    return res.json({ customers: customerRows(users, orders) })
  }),
)

app.get(
  '/api/admin/inventory',
  requireAdmin,
  route(async (req, res) => {
    const [products, settings] = await Promise.all([
      read('products', []),
      read('settings', DEFAULT_SETTINGS),
    ])
    return res.json({
      inventory: inventoryRows(products, { lowStockAt: settings.lowStockAt }),
      lowStockAt: settings.lowStockAt,
    })
  }),
)

app.patch(
  '/api/admin/inventory/:id',
  requireAdmin,
  route(async (req, res) => {
    const stock = num(req.body?.stock, {
      field: 'Stock',
      min: 0,
      max: 100000,
      required: true,
    })
    let found = false

    await update('products', [], (products) => {
      const product = products.find((entry) => entry.id === req.params.id)
      if (!product) return
      found = true
      product.stock = stock
    })

    if (!found) throw new HttpError(404, 'Product not found')
    return res.json({ ok: true, id: req.params.id, stock })
  }),
)

app.get(
  '/api/admin/settings',
  requireAdmin,
  route(async (req, res) => res.json({ settings: await read('settings', DEFAULT_SETTINGS) })),
)

app.put(
  '/api/admin/settings',
  requireAdmin,
  route(async (req, res) => {
    const current = await read('settings', DEFAULT_SETTINGS)
    const settings = normaliseSettings(req.body, current)

    await update('settings', DEFAULT_SETTINGS, (draft) => {
      Object.assign(draft, settings)
    })

    return res.json({ settings })
  }),
)

app.use('/api', (req, res) => res.status(404).json({ error: 'Unknown endpoint' }))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(dist))
  app.use((req, res) => res.sendFile(path.join(dist, 'index.html')))
}

app.use((error, req, res, _next) => {
  const status = error.status ?? 500
  if (status >= 500) console.error('[server]', error)
  res.status(status).json({
    error: status >= 500 ? 'Something went wrong on the server' : error.message,
  })
})

// Initialize (will run on import/start)
let initialized = false
async function init() {
  if (initialized) return
  initialized = true
  await ensureProducts()
  await ensureSettings()
  await ensureAdmin()
}

init().catch((err) => {
  console.error('[server] init failed:', err)
})

const port = Number(process.env.PORT ?? 3001)
if (process.env.NODE_ENV !== 'production' || process.env.RUN_SERVER !== 'true') {
  // Don't auto-listen in serverless; but allow local dev as-is? Check if running directly
  if (import.meta.url === `file://${process.argv[1]}`) {
    app.listen(port, () => {
      console.log(`[server] http://localhost:${port}`)
    })
  }
} else {
  if (import.meta.url === `file://${process.argv[1]}`) {
    app.listen(port, () => {})
  }
}

export default app