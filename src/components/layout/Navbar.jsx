import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useLockBodyScroll, useOnEscape, useScrollPosition } from '../../hooks'
import { Icon } from '../Icon'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function Brand({ className = '' }) {
  return (
    <Link
      to="/"
      className={`group flex flex-col leading-none ${className}`}
      aria-label="LUMIÈRE home"
    >
      <span className="font-display text-2xl font-medium tracking-[0.28em] text-ink-950 transition-colors group-hover:text-ink-600">
        LUMIÈRE
      </span>
      <span className="mt-1 text-[0.55rem] font-medium uppercase tracking-[0.42em] text-ink-400">
        Zürich
      </span>
    </Link>
  )
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrolled = useScrollPosition()
  const { count, openCart } = useCart()
  const { user, isAdmin } = useAuth()

  useLockBodyScroll(menuOpen)
  useOnEscape(() => setMenuOpen(false), menuOpen)

  return (
    <>
      <div className="hidden bg-ink-950 py-2 text-ink-200 md:block">
        <div className="container-page flex items-center justify-between text-[0.7rem] uppercase tracking-[0.22em]">
          <p>Complimentary shipping on orders over CHF 60</p>
          <p className="text-ink-400">Zürich · Genève · Basel</p>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-ink-200/70 bg-ink-50/90 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav
          className="container-page flex items-center justify-between gap-6"
          aria-label="Main navigation"
        >
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="-ml-2 p-2 text-ink-950 transition-colors hover:text-ink-500 lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Icon name="menu" className="size-6" />
          </button>

          <Brand className="shrink-0" />

          <ul className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `link-underline inline-block py-2 text-[0.78rem] font-medium uppercase tracking-[0.2em] transition-colors ${
                      isActive ? 'text-ink-950' : 'text-ink-500 hover:text-ink-950'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <Link
              to="/products"
              className="hidden p-2.5 text-ink-950 transition-colors hover:text-ink-500 sm:block"
              aria-label="Search products"
            >
              <Icon name="search" />
            </Link>
            {user ? (
              <Link
                to={isAdmin ? '/admin' : '/account'}
                className="p-2.5 text-ink-950 transition-colors hover:text-ink-500"
                aria-label={isAdmin ? 'Store dashboard' : 'Your account'}
              >
                <Icon name={isAdmin ? 'shield' : 'user'} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden p-2.5 text-ink-950 transition-colors hover:text-ink-500 sm:block"
                aria-label="Sign in"
              >
                <Icon name="user" />
              </Link>
            )}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2.5 text-ink-950 transition-colors hover:text-ink-500"
              aria-label={`Open shopping bag, ${count} item${count === 1 ? '' : 's'}`}
            >
              <Icon name="bag" />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex size-5 items-center justify-center rounded-full bg-ink-950 text-[0.65rem] font-medium text-ink-50">
                  {count}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu overlay"
          />
          <div className="fade-up absolute inset-y-0 left-0 flex w-[82%] max-w-sm flex-col bg-ink-50 px-8 py-7 shadow-2xl">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="-mr-2 p-2 text-ink-950"
                aria-label="Close menu"
              >
                <Icon name="close" className="size-6" />
              </button>
            </div>

            <ul className="mt-12 flex flex-col gap-1">
              {NAV_LINKS.map((link, index) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block border-b border-ink-200 py-4 font-display text-3xl font-light transition-colors ${
                        isActive ? 'text-ink-950' : 'text-ink-500 hover:text-ink-950'
                      }`
                    }
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-auto space-y-3 border-t border-ink-200 pt-6 text-sm text-ink-600">
              {user ? (
                <div className="space-y-3">
                  <p className="text-[0.7rem] uppercase tracking-[0.25em] text-ink-400">
                    Signed in
                  </p>
                  <p className="text-ink-950">{user.name}</p>
                  <Link
                    to={isAdmin ? '/admin' : '/account'}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-ink-950"
                  >
                    <Icon name={isAdmin ? 'shield' : 'user'} className="size-4" />
                    {isAdmin ? 'Store dashboard' : 'Your account'}
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[0.7rem] uppercase tracking-[0.25em] text-ink-400">
                    Client services
                  </p>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block text-ink-950"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block hover:text-ink-950"
                  >
                    Create an account
                  </Link>
                </div>
              )}

              <p className="text-[0.7rem] uppercase tracking-[0.25em] text-ink-400">
                Reach us
              </p>
              <a href="mailto:hello@lumiere.ch" className="block hover:text-ink-950">
                hello@lumiere.ch
              </a>
              <a href="tel:+41441234567" className="block hover:text-ink-950">
                +41 44 123 45 67
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
