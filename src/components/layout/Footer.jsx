import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../Icon'

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All products', to: '/products' },
      { label: 'Serums', to: '/products?category=serum' },
      { label: 'Moisturisers', to: '/products?category=moisturiser' },
      { label: 'Cleansers', to: '/products?category=cleanser' },
      { label: 'Makeup', to: '/products?category=makeup' },
      { label: 'Masks', to: '/products?category=mask' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our story', to: '/about' },
      { label: 'Ingredients', to: '/about#ingredients' },
      { label: 'Sustainability', to: '/about#sustainability' },
      { label: 'Our process', to: '/about#process' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact us', to: '/contact' },
      { label: 'Routine finder', to: '/#routine-finder' },
      { label: 'Shipping & returns', to: '/contact#shipping' },
      { label: 'FAQ', to: '/contact#faq' },
    ],
  },
]

const CURRENT_YEAR = new Date().getFullYear()

const SOCIALS = [
  { name: 'instagram', label: 'Instagram' },
  { name: 'facebook', label: 'Facebook' },
  { name: 'tiktok', label: 'TikTok' },
]

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
      return
    }
    setStatus('success')
    setEmail('')
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-5">
      <div className="flex items-center gap-3 border-b border-ink-200 py-2 focus-within:border-ink-950">
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setStatus('idle')
          }}
          placeholder="Your email address"
          aria-label="Email address for newsletter"
          className="w-full bg-transparent py-1.5 text-sm text-ink-950 outline-none placeholder:text-ink-400"
        />
        <button
          type="submit"
          className="flex size-11 shrink-0 items-center justify-center text-ink-950 transition-transform hover:translate-x-1"
          aria-label="Subscribe to newsletter"
        >
          <Icon name="arrow-right" />
        </button>
      </div>
      <p className="mt-3 h-4 text-[0.7rem]">
        {status === 'error' && (
          <span className="text-blush-600">Please enter a valid email address.</span>
        )}
        {status === 'success' && (
          <span className="text-sage-600">Thank you — please check your inbox to confirm.</span>
        )}
        {status === 'idle' && (
          <span className="text-ink-400">New formulas, 10% off your first order.</span>
        )}
      </p>
    </form>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-200 bg-ink-100/60">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-display text-3xl font-medium tracking-[0.28em] text-ink-950">
              LUMIÈRE
            </span>
            <span className="mt-1.5 text-[0.55rem] font-medium uppercase tracking-[0.42em] text-ink-400">
              Zürich
            </span>
          </Link>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink-600">
            Clean, cruelty-free skincare and cosmetics formulated in Zürich, Switzerland.
            Founded by Kim MinJuu in 2018.
          </p>
          <NewsletterForm />
          <div className="mt-7 flex gap-4">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href="#"
                onClick={(event) => event.preventDefault()}
                aria-label={social.label}
                className="flex size-10 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-all duration-300 hover:border-ink-950 hover:bg-ink-950 hover:text-ink-50"
              >
                <Icon name={social.name} className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-ink-950">
              {column.title}
            </h3>
            <ul className="mt-4 space-y-1">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="inline-block py-2 text-sm text-ink-600 transition-colors hover:text-ink-950"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-ink-200">
        <div className="container-page flex flex-col gap-4 py-6 text-[0.7rem] uppercase tracking-[0.2em] text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {CURRENT_YEAR} LUMIÈRE Cosmetics AG. All rights reserved.</p>
          <p className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#" onClick={(e) => e.preventDefault()} className="py-1.5 hover:text-ink-950">
              Privacy
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="py-1.5 hover:text-ink-950">
              Terms
            </a>
            <span className="flex items-center gap-1.5 text-sage-600">
              <Icon name="leaf" className="size-3.5" /> Leaping Bunny certified
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
