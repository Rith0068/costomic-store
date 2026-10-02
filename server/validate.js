
export class HttpError extends Error {
  constructor(status, message, details) {
    super(message)
    this.status = status
    this.details = details
  }
}

export function badRequest(message, details) {
  return new HttpError(400, message, details)
}

export function str(value, { field, min = 0, max = 500, required = false, trim = true }) {
  let out = value === undefined || value === null ? '' : String(value)
  if (trim) out = out.trim()
  if (!out) {
    if (required) throw badRequest(`${field} is required`)
    return ''
  }
  if (out.length < min) throw badRequest(`${field} must be at least ${min} characters`)
  if (out.length > max) throw badRequest(`${field} must be ${max} characters or fewer`)
  return out
}

export function num(value, { field, min = -Infinity, max = Infinity, required = false, fallback }) {
  if (value === undefined || value === null || value === '') {
    if (required) throw badRequest(`${field} is required`)
    return fallback
  }
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value))
  if (!Number.isFinite(parsed)) throw badRequest(`${field} must be a number`)
  if (parsed < min) throw badRequest(`${field} must be at least ${min}`)
  if (parsed > max) throw badRequest(`${field} must be at most ${max}`)
  return Math.round(parsed * 100) / 100
}

export function bool(value, fallback = false) {
  if (value === undefined || value === null) return fallback
  if (typeof value === 'boolean') return value
  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase())
}

export function list(value, { field, max = 40, itemMax = 200 }) {
  if (value === undefined || value === null || value === '') return []
  const arr = Array.isArray(value) ? value : String(value).split('\n')
  return arr
    .map((entry) => str(entry, { field, max: itemMax }))
    .filter(Boolean)
    .slice(0, max)
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function email(value, { required = true } = {}) {
  const out = str(value, { field: 'Email', max: 200, required }).toLowerCase()
  if (!out) return ''
  if (!EMAIL.test(out)) throw badRequest('Enter a valid email address')
  return out
}

const HEX = /^#[0-9a-f]{3,8}$/i

export function hexColor(value, { field, required = false, fallback = '#e8d5cf' } = {}) {
  const out = str(value, { field, max: 9 })
  if (!out) {
    if (required) throw badRequest(`${field} is required`)
    return fallback
  }
  if (!HEX.test(out)) throw badRequest(`${field} must be a hex colour like #e8d5cf`)
  return out
}
