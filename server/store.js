import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const isVercel = process.env.VERCEL === '1' || process.env.NOW_REGION
export const DATA_DIR = isVercel ? path.join('/tmp', 'lumiere-data') : path.join(here, 'data')

const caches = new Map()
const writeQueues = new Map()

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

export function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`)
}

export async function read(name, fallback) {
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
  const run = (writeQueues.get(name) ?? Promise.resolve()).then(async () => {
    await ensureDir()
    const target = filePath(name)
    const tmp = `${target}.${process.pid}.tmp`
    await fs.writeFile(tmp, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
    await fs.rename(tmp, target)
  })
  writeQueues.set(
    name,
    run.catch(() => {}),
  )
  await run
  caches.set(name, value)
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
