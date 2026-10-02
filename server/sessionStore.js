import session from 'express-session'
import { read, write } from './store.js'

class JsonSessionStore extends session.Store {
  constructor({ maxAgeMs } = {}) {
    super()
    this.maxAgeMs = maxAgeMs
  }

  async #sessions() {
    return read('sessions', {})
  }

  #prune(all) {
    const cutoff = Date.now() - this.maxAgeMs
    for (const [sid, entry] of Object.entries(all)) {
      if (!entry?.expires && new Date(entry?.cookie?.expires ?? 0).getTime() < cutoff) {
        delete all[sid]
      }
    }
    return all
  }

  #expiry(sess) {
    const maxAge = sess?.cookie?.maxAge ?? this.maxAgeMs
    return new Date(Date.now() + maxAge).toISOString()
  }

  get(sid, cb) {
    this.#sessions()
      .then((all) => {
        const entry = all[sid]
        if (!entry) return cb(null, null)
        if (new Date(entry.expires).getTime() < Date.now()) {
          delete all[sid]
          write('sessions', all).catch(() => {})
          return cb(null, null)
        }
        cb(null, entry.data)
      })
      .catch(cb)
  }

  set(sid, sess, cb) {
    this.#sessions()
      .then((all) => {
        all[sid] = { data: sess, expires: this.#expiry(sess) }
        write('sessions', this.#prune(all)).then(() => cb(null), cb)
      })
      .catch(cb)
  }

  destroy(sid, cb) {
    this.#sessions()
      .then((all) => {
        delete all[sid]
        write('sessions', all).then(() => cb(null), cb)
      })
      .catch(cb)
  }

  touch(sid, sess, cb) {
    this.set(sid, sess, cb)
  }

  length(cb) {
    this.#sessions()
      .then((all) => cb(null, Object.keys(this.#prune(all)).length))
      .catch(cb)
  }

  clear(cb) {
    write('sessions', {}).then(() => cb(null), cb)
  }
}

export function createSessionStore() {
  return new JsonSessionStore({ maxAgeMs: 1000 * 60 * 60 * 24 * 7 })
}
