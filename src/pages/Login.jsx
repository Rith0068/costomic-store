import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Icon } from '../components/Icon'

const fieldClass = (hasError) =>
  `mt-2 w-full border bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-ink-400 ${
    hasError ? 'border-blush-500' : 'border-ink-200 focus:border-ink-950'
  }`

export default function Login() {
  const { login } = useAuth()
  const { refresh } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const params = new URLSearchParams(location.search)
  const next = params.get('next') || '/'
  const adminMode = params.get('mode') === 'admin'

  const [values, setValues] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const update = (field) => (event) =>
    setValues((current) => ({ ...current, [field]: event.target.value }))

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const data = await login(values)
      await refresh()
      const isAdmin = data.user?.role === 'admin'
      if (adminMode && !isAdmin) {
        setError('That account is not an administrator.')
        return
      }
      navigate(isAdmin ? '/admin' : next, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-24">
      <div className="w-full max-w-md">
        <p className="eyebrow text-center">
          {adminMode ? 'Administrator access' : 'Welcome back'}
        </p>
        <h1 className="mt-4 text-center font-display text-4xl">
          {adminMode ? 'Store dashboard' : 'Sign in'}
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-center text-sm text-ink-500">
          {adminMode
            ? 'Enter the administrator credentials to manage the catalogue.'
            : 'Sign in to check out, or create an account if you are new here.'}
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-10">
          {error && (
            <p
              role="alert"
              className="mb-6 border border-blush-500/40 bg-blush-200/20 px-4 py-3 text-sm text-blush-600"
            >
              {error}
            </p>
          )}

          <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
            Email
            <input
              type="email"
              value={values.email}
              onChange={update('email')}
              autoComplete="email"
              required
              placeholder="you@example.com"
              className={fieldClass(false)}
            />
          </label>

          <label className="mt-6 block text-xs uppercase tracking-[0.15em] text-ink-500">
            Password
            <input
              type="password"
              value={values.password}
              onChange={update('password')}
              autoComplete="current-password"
              required
              placeholder="Your password"
              className={fieldClass(false)}
            />
          </label>

          <button type="submit" disabled={busy} className="btn-primary mt-8 w-full disabled:opacity-60">
            {busy ? 'Signing in...' : adminMode ? 'Enter dashboard' : 'Sign in'}
          </button>
        </form>

        {!adminMode && (
          <p className="mt-8 text-center text-sm text-ink-500">
            New to LUMIÈRE?{' '}
            <Link to="/register" className="text-ink-950 underline underline-offset-4">
              Create an account
            </Link>
          </p>
        )}

        <p className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ink-500 transition-colors hover:text-ink-950"
          >
            <Icon name="arrow-right" className="size-3.5" />
            Continue shopping
          </Link>
        </p>
      </div>
    </section>
  )
}