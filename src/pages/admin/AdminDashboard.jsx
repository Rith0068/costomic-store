import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { Icon } from '../../components/Icon'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/admin/overview', label: 'Overview', icon: 'gauge', end: true },
  { to: '/admin/orders', label: 'Orders', icon: 'orders' },
  { to: '/admin/products', label: 'Catalogue', icon: 'box' },
  { to: '/admin/inventory', label: 'Inventory', icon: 'flask' },
  { to: '/admin/customers', label: 'Customers', icon: 'users' },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
]

function NavItems({ onNavigate }) {
  return (
    <nav aria-label="Admin sections" className="flex-1 space-y-1 px-3">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? 'bg-ink-950 text-ink-50'
                : 'text-ink-300 hover:bg-ink-900 hover:text-ink-50'
            }`
          }
        >
          <Icon name={item.icon} className="size-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function AdminDashboard() {
  const { user, ready, isAdmin, logout } = useAuth()
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (!navOpen) return undefined
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [navOpen])

  if (!ready) return null
  if (!user || !isAdmin) return <Navigate to="/login?mode=admin" replace />

  const current = NAV.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
  )

  return (
    <div className="min-h-screen bg-ink-100/40 lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col bg-ink-950 lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="border-b border-ink-900 px-6 py-6">
          <p className="font-display text-2xl tracking-tight text-ink-50">LUMIÈRE</p>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.25em] text-ink-500">
            Control panel
          </p>
        </div>

        <NavItems />

        <div className="border-t border-ink-900 px-6 py-5">
          <p className="truncate text-sm text-ink-100">{user.name}</p>
          <p className="truncate text-xs text-ink-500">{user.email}</p>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              to="/products"
              className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-ink-300 transition-colors hover:text-ink-50"
            >
              <Icon name="external" className="size-3.5" />
              View store
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 text-left text-xs uppercase tracking-[0.15em] text-ink-300 transition-colors hover:text-ink-50"
            >
              <Icon name="logout" className="size-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {navOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-30 bg-ink-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-ink-950 transition-transform duration-300 ease-out-expo lg:hidden ${
          navOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Admin navigation"
      >
        <div className="flex items-center justify-between border-b border-ink-900 px-6 py-6">
          <div>
            <p className="font-display text-2xl tracking-tight text-ink-50">LUMIÈRE</p>
            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.25em] text-ink-500">
              Control panel
            </p>
          </div>
          <button
            type="button"
            onClick={() => setNavOpen(false)}
            aria-label="Close navigation"
            className="text-ink-300"
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>

        <NavItems onNavigate={() => setNavOpen(false)} />

        <div className="border-t border-ink-900 px-6 py-5">
          <p className="truncate text-sm text-ink-100">{user.name}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-ink-300"
          >
            <Icon name="logout" className="size-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-ink-200 bg-ink-50/90 px-5 py-4 backdrop-blur lg:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Open navigation"
              className="text-ink-700 lg:hidden"
            >
              <Icon name="menu" className="size-5" />
            </button>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.25em] text-ink-400">Admin</p>
              <h1 className="font-display text-2xl leading-tight text-ink-950">
                {current?.label ?? 'Dashboard'}
              </h1>
            </div>
          </div>

          <Link to="/products" className="btn-outline hidden px-5 py-2.5 sm:inline-flex">
            View store
          </Link>
        </header>

        <main className="px-5 py-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
