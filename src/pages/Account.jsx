import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { useAuth } from '../context/AuthContext'
import { useResource } from '../hooks'
import { formatPrice } from '../data/products'
import { api } from '../lib/api'
import { formatDate } from './admin/format'

const STATUS_STYLES = {
  confirmed: 'border-ink-300 bg-ink-100 text-ink-700',
  processing: 'border-gold-400/50 bg-gold-300/20 text-gold-500',
  shipped: 'border-sage-300 bg-sage-100 text-sage-600',
  delivered: 'border-sage-400 bg-sage-200 text-sage-600',
  cancelled: 'border-blush-400/50 bg-blush-100 text-blush-600',
}

const fieldClass =
  'mt-2 w-full border border-ink-200 bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-ink-400 focus:border-ink-950'

export default function Account() {
  const { user, ready, isAdmin } = useAuth()

  if (!ready) return null
  if (!user) return <Navigate to="/login?next=/account" replace />
  if (isAdmin) return <Navigate to="/admin" replace />

  return (
    <section className="container-page py-20">
      <p className="eyebrow">Your account</p>
      <h1 className="mt-4 font-display text-4xl sm:text-5xl">Hello, {user.name.split(' ')[0]}</h1>
      <p className="mt-4 max-w-xl text-sm text-ink-500">
        Member since {formatDate(user.createdAt)}. Update your details, review your orders and
        change your password.
      </p>

      <ProfilePanel user={user} />
      <PasswordPanel />
      <OrdersPanel />
    </section>
  )
}

function ProfilePanel({ user }) {
  const { applyUser } = useAuth()
  const [name, setName] = useState(user.name)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    setSaved(false)
    try {
      const data = await api.updateAccount({ name: name.trim() })
      applyUser(data.user)
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mt-14 border border-ink-200 bg-white"
      aria-labelledby="profile-heading"
    >
      <h2
        id="profile-heading"
        className="border-b border-ink-200 px-6 py-5 font-display text-2xl"
      >
        Profile
      </h2>

      <div className="grid gap-6 px-6 py-7 sm:grid-cols-2">
        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
          Full name
          <input
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setSaved(false)
            }}
            autoComplete="name"
            required
            minLength={2}
            maxLength={60}
            className={fieldClass}
          />
        </label>

        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
          Email
          <input
            type="email"
            value={user.email}
            readOnly
            aria-readonly="true"
            className={`${fieldClass} border-dashed bg-ink-100/50 text-ink-500`}
          />
          <span className="mt-1.5 block text-xs normal-case tracking-normal text-ink-400">
            Contact us to change the email on your account.
          </span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-ink-200 px-6 py-5">
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? 'Saving…' : 'Save profile'}
        </button>
        {saved && <p role="status" className="text-sm text-sage-600">Profile updated.</p>}
        {error && (
          <p role="alert" className="text-sm text-blush-600">
            {error}
          </p>
        )}
      </div>
    </form>
  )
}

function PasswordPanel() {
  const [values, setValues] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const update = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }))
    setSaved(false)
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (values.newPassword !== values.confirm) {
      setError('New passwords do not match')
      return
    }
    if (values.newPassword.length < 8) {
      setError('Use at least 8 characters')
      return
    }

    setBusy(true)
    try {
      await api.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      setValues({ currentPassword: '', newPassword: '', confirm: '' })
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mt-8 border border-ink-200 bg-white"
      aria-labelledby="password-heading"
    >
      <h2
        id="password-heading"
        className="border-b border-ink-200 px-6 py-5 font-display text-2xl"
      >
        Password
      </h2>

      <div className="grid gap-6 px-6 py-7 sm:grid-cols-3">
        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
          Current
          <input
            type="password"
            value={values.currentPassword}
            onChange={update('currentPassword')}
            autoComplete="current-password"
            required
            className={fieldClass}
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
          New password
          <input
            type="password"
            value={values.newPassword}
            onChange={update('newPassword')}
            autoComplete="new-password"
            required
            minLength={8}
            className={fieldClass}
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
          Confirm
          <input
            type="password"
            value={values.confirm}
            onChange={update('confirm')}
            autoComplete="new-password"
            required
            className={fieldClass}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-ink-200 px-6 py-5">
        <button type="submit" disabled={busy} className="btn-outline disabled:opacity-60">
          {busy ? 'Updating…' : 'Change password'}
        </button>
        {saved && <p role="status" className="text-sm text-sage-600">Password updated.</p>}
        {error && (
          <p role="alert" className="text-sm text-blush-600">
            {error}
          </p>
        )}
      </div>
    </form>
  )
}

function OrdersPanel() {
  const { data, error, loading } = useResource(() => api.account(), user?.id)

  const orders = data?.orders ?? []
  const stats = data?.stats

  return (
    <div className="mt-8 border border-ink-200 bg-white" aria-labelledby="orders-heading">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-200 px-6 py-5">
        <h2 id="orders-heading" className="font-display text-2xl">
          Order history
        </h2>
        <Link to="/products" className="link-underline text-xs uppercase tracking-[0.2em]">
          Shop again
        </Link>
      </div>

      {loading && !data ? (
        <p role="status" className="px-6 py-12 text-center text-sm text-ink-500">
          Loading your orders…
        </p>
      ) : error && !data ? (
        <p role="alert" className="px-6 py-12 text-center text-sm text-blush-600">
          {error}
        </p>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-px border-b border-ink-200 bg-ink-200 sm:grid-cols-4">
            {[
              { label: 'Orders placed', value: stats?.orders ?? 0 },
              { label: 'Lifetime spend', value: formatPrice(stats?.spend ?? 0) },
              { label: 'Items bought', value: stats?.units ?? 0 },
              {
                label: 'Last order',
                value: stats?.lastOrderAt ? formatDate(stats.lastOrderAt) : '—',
              },
            ].map((entry) => (
              <div key={entry.label} className="bg-white px-6 py-5">
                <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-400">
                  {entry.label}
                </dt>
                <dd className="mt-2 font-display text-2xl tabular-nums text-ink-950">
                  {entry.value}
                </dd>
              </div>
            ))}
          </dl>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <Icon name="bag" className="size-8 text-ink-300" strokeWidth={1} />
              <h3 className="mt-5 text-2xl">No orders yet</h3>
              <p className="mt-2 max-w-sm text-sm text-ink-500">
                When you place an order it will appear here with its status.
              </p>
              <Link to="/products" className="btn-primary mt-6">
                Browse products
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-ink-200">
              {orders.map((order) => (
                <li key={order.id} className="px-6 py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <p className="text-sm text-ink-950">{order.id}</p>
                      <p className="mt-1 text-xs text-ink-500">
                        {formatDate(order.placedAt)} · {order.itemCount} item
                        {order.itemCount === 1 ? '' : 's'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm tabular-nums">{formatPrice(order.total)}</span>
                      <span
                        className={`inline-block border px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.15em] ${
                          STATUS_STYLES[order.status] ?? STATUS_STYLES.confirmed
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1 text-xs text-ink-500">
                    {order.lines.map((line) => (
                      <li key={`${order.id}-${line.productId}-${line.variant}`}>
                        {line.quantity} × {line.name}
                        {line.variant && <span className="text-ink-400"> · {line.variant}</span>}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}