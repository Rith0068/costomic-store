export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const response = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new ApiError(response.status, payload?.error ?? 'Something went wrong')
  }
  return payload
}

export const api = {
  me: () => request('/api/auth/me'),
  login: (body) => request('/api/auth/login', { method: 'POST', body }),
  register: (body) => request('/api/auth/register', { method: 'POST', body }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),

  products: () => request('/api/products'),
  product: (id) => request(`/api/products/${encodeURIComponent(id)}`),

  cart: () => request('/api/cart'),
  addToCart: (body) => request('/api/cart/items', { method: 'POST', body }),
  updateCartItem: (key, quantity) =>
    request(`/api/cart/items/${encodeURIComponent(key)}`, {
      method: 'PATCH',
      body: { quantity },
    }),
  removeCartItem: (key) =>
    request(`/api/cart/items/${encodeURIComponent(key)}`, { method: 'DELETE' }),
  clearCart: () => request('/api/cart', { method: 'DELETE' }),

  placeOrder: () => request('/api/orders', { method: 'POST', body: {} }),
  myOrders: () => request('/api/orders'),

  account: () => request('/api/account'),
  updateAccount: (body) => request('/api/account', { method: 'PATCH', body }),
  changePassword: (body) => request('/api/auth/password', { method: 'POST', body }),

  adminSummary: () => request('/api/admin/summary'),
  adminStats: () => request('/api/admin/stats'),
  adminOrders: () => request('/api/admin/orders'),
  setOrderStatus: (id, status) =>
    request(`/api/admin/orders/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: { status },
    }),
  adminCustomers: () => request('/api/admin/customers'),
  adminInventory: () => request('/api/admin/inventory'),
  setStock: (id, stock) =>
    request(`/api/admin/inventory/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: { stock },
    }),
  adminSettings: () => request('/api/admin/settings'),
  saveSettings: (body) => request('/api/admin/settings', { method: 'PUT', body }),
  createProduct: (body) => request('/api/admin/products', { method: 'POST', body }),
  updateProduct: (id, body) =>
    request(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'PUT', body }),
  deleteProduct: (id) =>
    request(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE' }),
}