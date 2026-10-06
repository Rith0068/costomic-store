import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { Redis } from '@upstash/redis'

const here = path.dirname(fileURLToPath(import.meta.url))

const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null
export const usingRedis = Boolean(redis)

// Without Redis the only writable path in a serverless sandbox is /tmp, which is
// ephemeral. Products still get seeded from src/data/products.js so the shop
// renders, but admin edits are lost on redeploy. Configure Redis to persist them.
const isServerless =
  process.env.VERCEL === '1' ||
  Boolean(process.env.NOW_REGION) ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME)

export const DATA_DIR =
  !redis && isServerless ? path.join('/tmp', 'lumiere-data') : path.join(here, 'data')
const PREFIX = 'lumiere:'

const caches = new Map()
const writeQueues = new Map()

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

export function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`)
}

function key(name) {
  return `${PREFIX}${name}`
}

export async function read(name, fallback) {
  if (redis) {
    const raw = await redis.get(key(name))
    if (raw === null || raw === undefined) {
      await redis.set(key(name), JSON.stringify(fallback))
      return fallback
    }
    return typeof raw === 'string' ? JSON.parse(raw) : raw
  }

  if (caches.has(name)) return caches.get(name)
  await ensureDir()
  try {
    const raw = await fs.readFile(filePath(name), 'utf8')
    const parsed = JSON.parse(raw)
    caches.set(name, parsed)
    return parsed
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw new Error(`Could not read ${name}.json: ${error.message}`)
    }
    caches.set(name, fallback)
    await write(name, fallback)
    return fallback
  }
}

export async function write(name, value) {
  const run = async () => {
    if (redis) {
      await redis.set(key(name), JSON.stringify(value))
      return
    }
    await ensureDir()
    const target = filePath(name)
    const tmp = `${target}.${process.pid}.tmp`
    await fs.writeFile(tmp, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
    await fs.rename(tmp, target)
  }

  const queued = (writeQueues.get(name) ?? Promise.resolve()).then(run, run)
  writeQueues.set(
    name,
    queued.catch(() => {}),
  )
  await queued

  if (!redis) caches.set(name, value)
  return value
}

export async function update(name, fallback, mutator) {
  const current = await read(name, fallback)
  const draft = structuredClone(current)
  const result = await mutator(draft)
  await write(name, draft)
  return result
}

export function newId(prefix) {
  return `${prefix}_${randomUUID().replace(/-/g, '').slice(0, 16)}`
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}
