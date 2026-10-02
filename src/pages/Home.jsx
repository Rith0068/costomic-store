import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, FAQS, PROCESS_STEPS, PRODUCTS, TESTIMONIALS, getProductById } from '../data/products'
import { useReveal } from '../hooks'
import { Icon } from '../components/Icon'
import { ProductCard, Rating } from '../components/ProductCard'
import { ProductImage } from '../components/ProductImage'
import { Marquee, Reveal, SectionHeading } from '../components/ui/Section'

const HERO_PRODUCT = getProductById('vit-c-glow-serum')

const CONCERNS = [
  {
    id: 'dehydration',
    label: 'Dehydration',
    description: 'Skin that feels tight, flaky or fine-lined from water loss.',
    picks: ['dewy-skin-serum', 'hydra-riche-cream', 'silk-milk-cleanser'],
  },
  {
    id: 'dullness',
    label: 'Dullness',
    description: 'Complexion that has lost its clarity and even tone over time.',
    picks: ['vit-c-glow-serum', 'dewy-skin-serum', 'midnight-recovery-mask'],
  },
  {
    id: 'congestion',
    label: 'Congestion & acne',
    description: 'Enlarged pores, blackheads and excess oil across the T-zone.',
    picks: ['purifying-clay-mask', 'silk-milk-cleanser', 'vit-c-glow-serum'],
  },
  {
    id: 'dryness',
    label: 'Dryness & sensitivity',
    description: 'A reactive barrier that stings at the first new active.',
    picks: ['hydra-riche-cream', 'silk-milk-cleanser', 'dewy-skin-serum'],
  },
]

function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-100/50">
      <div className="pointer-events-none absolute -right-32 -top-32 size-[34rem] rounded-full bg-blush-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 size-[30rem] rounded-full bg-sage-200/40 blur-3xl" />

      <div className="container-page relative grid gap-12 py-20 lg:grid-cols-12 lg:gap-8 lg:py-28">
        <div className="flex flex-col justify-center lg:col-span-6">
          <p className="eyebrow fade-up flex items-center gap-3">
            <span className="h-px w-10 bg-ink-300" /> Formulated in Zürich
          </p>
          <h1 className="reveal mt-6 text-[3.25rem] leading-[1.02] sm:text-7xl lg:text-[5.5rem]">
            Skin that looks
            <br />
            <em className="font-normal italic text-ink-500">lit from within.</em>
          </h1>
          <p className="fade-up mt-7 max-w-md text-base leading-relaxed text-ink-500" style={{ animationDelay: '300ms' }}>
            Clean, cruelty-free skincare and cosmetics built on clinical evidence and
            minimal, honest formulas. Designed in Switzerland for every skin type.
          </p>
          <div
            className="fade-up mt-9 flex flex-wrap items-center gap-4"
            style={{ animationDelay: '420ms' }}
          >
            <Link to="/products" className="btn-primary">
              Shop the collection
              <Icon name="arrow-right" className="size-4" />
            </Link>
            <a href="#routine-finder" className="btn-outline">
              Find your routine
            </a>
          </div>
          <dl
            className="fade-up mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-ink-200 pt-8"
            style={{ animationDelay: '560ms' }}
          >
            {[
              { value: '120k+', label: 'Happy clients' },
              { value: '4.8/5', label: 'Average rating' },
              { value: '14', label: 'Traceable suppliers' },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-3xl text-ink-950">{stat.value}</dt>
                <dd className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-ink-400">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="fade-up relative lg:col-span-6" style={{ animationDelay: '200ms' }}>
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <ProductImage
              product={HERO_PRODUCT}
              priority
              className="aspect-[4/5] w-full"
            />
            <div className="absolute -bottom-6 -left-4 w-48 border border-ink-200 bg-ink-50/95 p-5 shadow-xl backdrop-blur sm:-left-8 sm:w-56">
              <p className="eyebrow">Bestseller</p>
              <p className="mt-2 font-display text-xl leading-tight">Vitamin C Glow Serum</p>
              <div className="mt-2">
                <Rating value={4.9} reviews={412} />
              </div>
            </div>
            <div className="absolute -right-3 top-8 flex size-24 rotate-90 items-center justify-center rounded-full border border-ink-300 bg-ink-50/80 text-center text-[0.6rem] uppercase leading-tight tracking-[0.25em] text-ink-600 sm:-right-6">
              Swiss
              <br />
              Made
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ValueProps() {
  return (
    <section className="border-b border-ink-200">
      <div className="container-page grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: 'leaf', title: 'Cruelty-free', text: 'Leaping Bunny certified' },
          { icon: 'flask', title: 'Clean formulas', text: 'No parabens or sulphates' },
          { icon: 'truck', title: 'Free delivery', text: 'On orders over CHF 60' },
          { icon: 'refresh', title: 'Refillable', text: '60% less packaging' },
        ].map((item, index) => (
          <Reveal
            key={item.title}
            delay={index * 90}
            className="flex items-center gap-4"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-700">
              <Icon name={item.icon} />
            </span>
            <div>
              <p className="text-sm font-medium tracking-wide text-ink-950">{item.title}</p>
              <p className="mt-0.5 text-xs text-ink-400">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Bestsellers() {
  const featured = PRODUCTS.filter((product) => product.badge === 'Bestseller')
  const rest = PRODUCTS.slice(0, 4)

  return (
    <section className="container-page py-24">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <SectionHeading
          eyebrow="The icons"
          title="Most loved formulas"
          text="Four products that consistently top our re-order rates, tested on over 2,000 participants across our clinical studies."
        />
        <Reveal delay={200}>
          <Link to="/products" className="btn-outline">
            View all products
            <Icon name="arrow-right" className="size-4" />
          </Link>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {rest.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      <div className="mt-24 grid items-center gap-12 border border-ink-200 bg-ink-100/40 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
        <Reveal className="flex flex-col items-center gap-10 sm:flex-row sm:items-start">
          {featured.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group w-full max-w-[9rem] flex-1"
              aria-label={product.name}
            >
              <ProductImage
                product={product}
                className="aspect-[4/5] w-full transition-transform duration-500 group-hover:-translate-y-2 [&>img]:group-hover:scale-105"
              />
            </Link>
          ))}
        </Reveal>
        <Reveal delay={120}>
          <div className="flex flex-col items-start">
            <p className="eyebrow">Client favourite</p>
            <h3 className="mt-4 text-4xl leading-tight sm:text-5xl">
              The two products
              <br />
              everyone buys first
            </h3>
            <p className="mt-5 max-w-md leading-relaxed text-ink-500">
              Nine out of ten first-time clients start with the Vitamin C Glow Serum and the Velvet
              Lip Tint. Our clinical data shows visible brightening in 86% of participants after
              four weeks of daily use.
            </p>
            <Link to={`/products/${featured[0].id}`} className="btn-primary mt-8">
              Discover the routine
              <Icon name="arrow-right" className="size-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Categories() {
  return (
    <section className="container-page pb-24">
      <SectionHeading
        eyebrow="Shop by category"
        title="Five steps to your best skin"
        align="center"
        className="mb-14"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {CATEGORIES.map((category, index) => {
          const count = PRODUCTS.filter((p) => p.category === category.id).length
          return (
            <Reveal key={category.id} delay={index * 90} className="h-full">
              <Link
                to={`/products?category=${category.id}`}
                className="group flex h-full flex-col justify-between border border-ink-200 p-6 transition-all duration-500 ease-out-expo hover:border-ink-950 hover:bg-ink-950"
              >
                <div>
                  <p className="font-display text-2xl text-ink-950 transition-colors group-hover:text-ink-50">
                    {category.name}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ink-400 transition-colors group-hover:text-ink-300">
                    {category.tagline}
                  </p>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-xs text-ink-400 transition-colors group-hover:text-ink-300">
                    {count} product{count === 1 ? '' : 's'}
                  </span>
                  <Icon
                    name="arrow-right"
                    className="size-4 text-ink-950 transition-all duration-500 group-hover:translate-x-1 group-hover:text-ink-50"
                  />
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

function RoutineFinder() {
  const [selected, setSelected] = useState(null)
  const active = CONCERNS.find((concern) => concern.id === selected)
  const picks = active
    ? active.picks.map((id) => PRODUCTS.find((product) => product.id === id)).filter(Boolean)
    : []

  return (
    <section id="routine-finder" className="scroll-mt-24 bg-ink-950 py-24 text-ink-100">
      <div className="container-page">
        <SectionHeading
          onDark
          eyebrow="Routine finder"
          title="What does your skin need?"
          text="Choose your main concern and we will build a three-step routine from the products our clients rate highest for it."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex flex-col gap-2">
              {CONCERNS.map((concern, index) => {
                const isActive = selected === concern.id
                return (
                  <Reveal key={concern.id} delay={index * 80}>
                    <button
                      type="button"
                      onClick={() => setSelected(isActive ? null : concern.id)}
                      aria-pressed={isActive}
                      className={`w-full border px-6 py-5 text-left transition-all duration-400 ${
                        isActive
                          ? 'border-ink-100 bg-ink-100/10'
                          : 'border-ink-100/15 hover:border-ink-100/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-display text-2xl text-ink-50">{concern.label}</span>
                        <Icon
                          name={isActive ? 'minus' : 'plus'}
                          className="size-4 shrink-0 text-ink-300"
                        />
                      </div>
                      {isActive && (
                        <p className="fade-up mt-3 text-sm leading-relaxed text-ink-300">
                          {concern.description}
                        </p>
                      )}
                    </button>
                  </Reveal>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            {active ? (
              <div className="fade-up border border-ink-100/15 p-8 sm:p-10">
                <p className="eyebrow text-ink-300">Your {active.label.toLowerCase()} routine</p>
                <ul className="mt-8 space-y-6">
                  {picks.map((product, index) => (
                    <li key={product.id} className="flex items-center gap-5">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink-100/20 text-xs text-ink-300">
                        {index + 1}
                      </span>
                      <Link
                        to={`/products/${product.id}`}
                        className="font-display text-2xl text-ink-50 transition-colors hover:text-gold-300"
                      >
                        {product.name}
                      </Link>
                      <span className="ml-auto hidden text-sm text-ink-400 sm:block">
                        {index === 0 ? 'Cleanse' : index === 1 ? 'Treat' : 'Seal'}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/products?concern=${active.id}`}
                  className="btn mt-10 border border-ink-100 bg-ink-50 text-ink-950 hover:bg-ink-100"
                >
                  View full routine
                  <Icon name="arrow-right" className="size-4" />
                </Link>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center border border-dashed border-ink-100/15 p-10 text-center">
                <Icon name="leaf" className="size-10 text-ink-300" strokeWidth={1} />
                <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-300">
                  Select a concern on the left and we will suggest the products our clients
                  report works best.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Philosophy() {
  return (
    <section className="container-page py-24">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Our philosophy"
            title="Fewer ingredients. Better results."
            text="We formulate backwards: start with the clinical evidence for what should work, then include only what is needed to make it work well and feel beautiful. Nothing is added for the label."
          />
          <Reveal delay={200}>
            <Link to="/about" className="btn-outline mt-9">
              Read our story
              <Icon name="arrow-right" className="size-4" />
            </Link>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {PROCESS_STEPS.map((step, index) => (
              <Reveal key={step.step} delay={index * 100}>
                <div className="border-t border-ink-200 pt-6">
                  <p className="font-display text-4xl text-ink-300">{step.step}</p>
                  <h3 className="mt-3 text-2xl">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="border-y border-ink-200 bg-ink-100/50 py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="In their words"
          title="4.8 out of 5 from 2,400 reviews"
          align="center"
          className="mb-14"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 80} className="h-full">
              <figure className="flex h-full flex-col border border-ink-200 bg-ink-50 p-7 transition-colors duration-500 hover:border-ink-400">
                <Icon name="quote" className="size-6 text-ink-300" />
                <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-ink-700">
                  “{testimonial.text}”
                </blockquote>
                <figcaption className="mt-7 border-t border-ink-200 pt-5">
                  <Rating value={testimonial.rating} />
                  <p className="mt-3 text-sm font-medium text-ink-950">{testimonial.name}</p>
                  <p className="text-xs text-ink-400">
                    {testimonial.location} · {testimonial.product}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function HomeFaq() {
  const [open, setOpen] = useState(0)
  const [ref, visible] = useReveal()

  return (
    <section className="container-page py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <div ref={ref} className="lg:col-span-4">
          <SectionHeading eyebrow="Good to know" title="Frequently asked" />
        </div>
        <div className="lg:col-span-8">
          {FAQS.slice(0, 4).map((faq, index) => {
            const isOpen = open === index
            return (
              <div key={faq.q} className="border-b border-ink-200">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-xl text-ink-950 sm:text-2xl">{faq.q}</span>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-600">
                    <Icon name={isOpen ? 'minus' : 'plus'} className="size-3.5" />
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-500 ease-out-expo ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-12 text-sm leading-relaxed text-ink-500">{faq.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
          <Link
            to="/contact#faq"
            className="link-underline mt-8 inline-block py-1 text-sm text-ink-600 hover:text-ink-950"
          >
            See all questions
          </Link>
        </div>
      </div>
      {visible && <span className="sr-only">Frequently asked questions</span>}
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <ValueProps />
      <Marquee
        items={[
          'Cruelty-free',
          'Swiss formulated',
          'Dermatologist tested',
          'Refillable',
          'Carbon-neutral delivery',
          'Full ingredient disclosure',
        ]}
      />
      <Bestsellers />
      <Categories />
      <RoutineFinder />
      <Philosophy />
      <Testimonials />
      <HomeFaq />
    </>
  )
}
