import bcrypt from 'bcryptjs'
import { HttpError, email as parseEmail, str } from './validate.js'

export const BCRYPT_ROUNDS = 12

export function publicUser(user) {
  if (!user) return null
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }
}

export function hashPassword(plain) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS)
}

export function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash ?? '')
}

export function requireUser(req) {
  if (!req.session?.userId) throw new HttpError(401, 'You need to sign in to do that')
  return req.session.userId
}

export function isAdmin(user) {
  return user?.role === 'admin'
}

export function requireAdmin(req, res, next) {
  if (!req.session?.userId || req.session.role !== 'admin') {
    return res.status(403).json({ error: 'Administrator access required' })
  }
  return next()
}

const attempts = new Map()
const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 8

export function loginRateLimit(req, res, next) {
  const key = `${req.ip}|${String(req.body?.email ?? '').toLowerCase()}`
  const now = Date.now()
  const record = attempts.get(key)

  if (record && now - record.first > WINDOW_MS) attempts.delete(key)

  const current = attempts.get(key)
  if (current && current.count >= MAX_ATTEMPTS) {
    const waitMins = Math.ceil((WINDOW_MS - (now - current.first)) / 60000)
    res.set('Retry-After', String(waitMins * 60))
    return res.status(429).json({
      error: `Too many failed attempts. Try again in ${waitMins} minute(s).`,
    })
  }
  return next()
}

export function recordLoginFailure(req) {
  const key = `${req.ip}|${String(req.body?.email ?? '').toLowerCase()}`
  const record = attempts.get(key)
  if (record) record.count += 1
  else attempts.set(key, { count: 1, first: Date.now() })
}

export function clearLoginFailures(req) {
  attempts.delete(`${req.ip}|${String(req.body?.email ?? '').toLowerCase()}`)
}

export function parseCredentials(body = {}) {
  return {
    email: parseEmail(body.email),
    password: str(body.password, { field: 'Password', min: 8, max: 200, required: true }),
  }
}

export function resetRateLimiter() {
  attempts.clear()
}
