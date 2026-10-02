import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'

export default function NotFound() {
  return (
    <section className="container-page flex flex-col items-center py-32 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-5 text-6xl leading-none sm:text-8xl">Lost</h1>
      <p className="mt-6 max-w-md leading-relaxed text-ink-500">
        The page you are looking for does not exist, or has moved. Let us point you back to
        something useful.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link to="/" className="btn-primary">
          Back to home
        </Link>
        <Link to="/products" className="btn-outline">
          Browse products
          <Icon name="arrow-right" className="size-4" />
        </Link>
      </div>
    </section>
  )
}
