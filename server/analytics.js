import { CATEGORY_IDS } from './productSchema.js'
import { badRequest, bool, num, str } from './validate.js'

export const ORDER_STATUSES = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
export const LOW_STOCK_AT = 12
const DAY_MS = 24 * 60 * 60 * 1000

export const DEFAULT_SETTINGS = {
  storeName: 'LUMIÈRE',
  contactEmail: 'hello@lumiere.com',
  phone: '+41 44 000 00 00',
  address: 'Bahnhofstrasse 12, 8001 Zürich, Switzerland',
  announcement: 'Complimentary shipping on orders over CHF 80',
  freeShippingThreshold: 80,
  currency: 'CHF',
  lowStockAt: LOW_STOCK_AT,
  ordersOpen: true,
}

function dayKey(value) {
  return new Date(value).toISOString().slice(0, 10)
}

export function round2(value) {
  return Math.round(value * 100) / 100
}

function countsTowardsRevenue(order) {
  return order.status !== 'cancelled'
}

export function normaliseSettings(input = {}, existing = DEFAULT_SETTINGS) {
  const settings = { ...existing, ...input }

  return {
    storeName: str(settings.storeName, {
      field: 'Store name',
      min: 2,
      max: 60,
      required: true,
    }),
    contactEmail: str(settings.contactEmail, {
      field: 'Contact email',
      min: 5,
      max: 200,
      required: true,
    }),
    phone: str(settings.phone, { field: 'Phone', max: 40 }),
    address: str(settings.address, { field: 'Address', max: 240 }),
    announcement: str(settings.announcement, { field: 'Announcement', max: 160 }),
    freeShippingThreshold: num(settings.freeShippingThreshold, {
      field: 'Free shipping threshold',
      min: 0,
      max: 100000,
      fallback: 0,
    }),
    currency: str(settings.currency, { field: 'Currency', max: 8, required: true }).toUpperCase(),
    lowStockAt: num(settings.lowStockAt, {
      field: 'Low stock threshold',
      min: 0,
      max: 10000,
      fallback: LOW_STOCK_AT,
    }),
    ordersOpen: bool(settings.ordersOpen, true),
  }
}

export function buildSeries(orders, days = 14, now = Date.now()) {
  const start = new Date(now)
  start.setUTCHours(0, 0, 0, 0)

  const buckets = new Map()
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    buckets.set(dayKey(start.getTime() - offset * DAY_MS), { revenue: 0, orders: 0 })
  }

  for (const order of orders) {
    if (!countsTowardsRevenue(order)) continue
    const key = dayKey(order.placedAt)
    const bucket = buckets.get(key)
    if (!bucket) continue
    bucket.orders += 1
    bucket.revenue = round2(bucket.revenue + order.total)
  }

  return [...buckets.entries()].map(([date, bucket]) => ({ date, ...bucket }))
}

export function topProducts(orders, products, limit = 5) {
  const totals = new Map()

  for (const order of orders) {
    if (!countsTowardsRevenue(order)) continue
    for (const line of order.lines) {
      const entry = totals.get(line.productId) ?? {
        productId: line.productId,
        name: line.name,
        units: 0,
        revenue: 0,
      }
      entry.units += line.quantity
      entry.revenue = round2(entry.revenue + line.lineTotal)
      totals.set(line.productId, entry)
    }
  }

  return [...totals.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
    .map((entry) => ({
      ...entry,
      category:
        products.find((product) => product.id === entry.productId)?.category ?? 'unlisted',
    }))
}

export function inventoryRows(products, { lowStockAt = LOW_STOCK_AT } = {}) {
  return products
    .map((product) => {
      const stock = Number.isFinite(product.stock) ? product.stock : 0
      const value = round2(stock * product.price)
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock,
        value,
        status: stock === 0 ? 'out' : stock <= lowStockAt ? 'low' : 'ok',
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function customerRows(users, orders) {
  const byUser = new Map()

  for (const order of orders) {
    const key = order.userId ?? order.email
    const entry = byUser.get(key) ?? { orders: 0, spend: 0, lastOrderAt: null }
    if (countsTowardsRevenue(order)) {
      entry.orders += 1
      entry.spend = round2(entry.spend + order.total)
    }
    if (!entry.lastOrderAt || order.placedAt > entry.lastOrderAt) {
      entry.lastOrderAt = order.placedAt
    }
    byUser.set(key, entry)
  }

  return users
    .map((user) => {
      const stats = byUser.get(user.id) ?? { orders: 0, spend: 0, lastOrderAt: null }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        orders: stats.orders,
        spend: stats.spend,
        lastOrderAt: stats.lastOrderAt,
      }
    })
    .sort((a, b) => b.spend - a.spend || b.createdAt.localeCompare(a.createdAt))
}

export function orderRows(orders, users) {
  const nameById = new Map(users.map((user) => [user.id, user.name]))

  return [...orders]
    .reverse()
    .map((order) => ({
      ...order,
      customerName: nameById.get(order.userId) ?? 'Guest',
      itemCount: order.lines.reduce((total, line) => total + line.quantity, 0),
    }))
}

export function categorySplit(products) {
  return CATEGORY_IDS.map((id) => ({
    id,
    count: products.filter((product) => product.category === id).length,
  })).filter((entry) => entry.count > 0)
}

export function buildSummary({ products, orders, users, settings = DEFAULT_SETTINGS }) {
  const paid = orders.filter(countsTowardsRevenue)
  const revenue = round2(paid.reduce((sum, order) => sum + order.total, 0))
  const cancelled = orders.length - paid.length
  const lowStockAt = settings.lowStockAt ?? LOW_STOCK_AT
  const inventory = inventoryRows(products, { lowStockAt })

  return {
    products: products.length,
    orders: orders.length,
    cancelled,
    customers: users.filter((user) => user.role === 'customer').length,
    revenue,
    averageOrderValue: paid.length ? round2(revenue / paid.length) : 0,
    unitsSold: paid.reduce(
      (total, order) => total + order.lines.reduce((sum, line) => sum + line.quantity, 0),
      0,
    ),
    stockValue: round2(inventory.reduce((sum, row) => sum + row.value, 0)),
    unitsInStock: inventory.reduce((sum, row) => sum + row.stock, 0),
    lowStock: inventory.filter((row) => row.status !== 'ok').length,
    outOfStock: inventory.filter((row) => row.status === 'out').length,
    averageRating:
      products.length
        ? round2(products.reduce((sum, product) => sum + (product.rating || 0), 0) / products.length)
        : 0,
  }
}

export function assertOrderStatus(status) {
  const value = str(status, { field: 'Status', max: 20 }).toLowerCase()
  if (!ORDER_STATUSES.includes(value)) {
    throw badRequest(`Status must be one of: ${ORDER_STATUSES.join(', ')}`)
  }
  return value
}
