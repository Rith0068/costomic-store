import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const fieldClass = (hasError) =>
  `mt-2 w-full border bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-ink-400 ${
    hasError ? 'border-blush-500' : 'border-ink-200 focus:border-ink-950'
  }`

export default function Register() {
  const { register } = useAuth()
  const { refresh } = useCart()
  const navigate = useNavigate()

  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const update = (field) => (event) =>
    setValues((current) => ({ ...current, [field]: event.target.value }))

  const validate = () => {
    const next = {}
    if (values.name.trim().length < 2) next.name = 'Enter your name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
      next.email = 'Enter a valid email address'
    }
    if (values.password.length < 8) next.password = 'Use at least 8 characters'
    if (values.password !== values.confirm) next.confirm = 'Passwords do not match'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!validate()) return

    setBusy(true)
    try {
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      })
      await refresh()
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-24">
      <div className="w-full max-w-md">
        <p className="eyebrow text-center">Create an account</p>
        <h1 className="mt-4 text-center font-display text-4xl">Join LUMIÈRE</h1>
        <p className="mx-auto mt-4 max-w-sm text-center text-sm text-ink-500">
          Save your routine, check out faster and keep your bag across devices.
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
            Full name
            <input
              type="text"
              value={values.name}
              onChange={update('name')}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              placeholder="Jane Doe"
              className={fieldClass(errors.name)}
            />
            {errors.name && (
              <span className="mt-1.5 block text-xs normal-case tracking-normal text-blush-600">
                {errors.name}
              </span>
            )}
          </label>

          <label className="mt-6 block text-xs uppercase tracking-[0.15em] text-ink-500">
            Email
            <input
              type="email"
              value={values.email}
              onChange={update('email')}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              placeholder="you@example.com"
              className={fieldClass(errors.email)}
            />
            {errors.email && (
              <span className="mt-1.5 block text-xs normal-case tracking-normal text-blush-600">
                {errors.email}
              </span>
            )}
          </label>

          <label className="mt-6 block text-xs uppercase tracking-[0.15em] text-ink-500">
            Password
            <input
              type="password"
              value={values.password}
              onChange={update('password')}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              placeholder="At least 8 characters"
              className={fieldClass(errors.password)}
            />
            {errors.password && (
              <span className="mt-1.5 block text-xs normal-case tracking-normal text-blush-600">
                {errors.password}
              </span>
            )}
          </label>

          <label className="mt-6 block text-xs uppercase tracking-[0.15em] text-ink-500">
            Confirm password
            <input
              type="password"
              value={values.confirm}
              onChange={update('confirm')}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirm)}
              placeholder="Repeat your password"
              className={fieldClass(errors.confirm)}
            />
            {errors.confirm && (
              <span className="mt-1.5 block text-xs normal-case tracking-normal text-blush-600">
                {errors.confirm}
              </span>
            )}
          </label>

          <button type="submit" disabled={busy} className="btn-primary mt-8 w-full disabled:opacity-60">
            {busy ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-ink-500">
          Already have an account?{' '}
          <Link to="/login" className="text-ink-950 underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  )
}