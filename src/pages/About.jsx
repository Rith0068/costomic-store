import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BENEFITS, CATEGORIES, PROCESS_STEPS, PRODUCTS } from '../data/products'
import { Icon } from '../components/Icon'
import { ProductVisual } from '../components/ProductVisual'
import { Reveal, SectionHeading } from '../components/ui/Section'

const TIMELINE = [
  {
    year: '2018',
    title: 'A kitchen in Zürich',
    text: 'Kim MinJuu, a cosmetic chemist, begins blending vitamin C serums in a small kitchen laboratory in Zürich-Oerlikon after repeated frustration with unstable vitamin C on the market.',
  },
  {
    year: '2020',
    title: 'First clinic, first hundred clients',
    text: 'The first 100 clients come from word of mouth at a Zürich dermatology practice. The Glow Serum formula reaches its final concentration, and the waitlist begins.',
  },
  {
    year: '2022',
    title: 'LUMIÈRE launches',
    text: 'The brand launches with six products and a single promise: full ingredient disclosure. The Zendegi derm-partner programme puts 40 clinics across Switzerland on our list.',
  },
  {
    year: '2024',
    title: 'Refill programme',
    text: 'We launch refillable packaging on our three bestsellers, cutting packaging waste per client by 60% and becoming the first cosmetics brand in Switzerland to publish full supply-chain data.',
  },
  {
    year: '2026',
    title: '120,000 clients',
    text: 'LUMIÈRE now serves more than 120,000 clients across Switzerland, the EU and the UK, from a team of 34 in a carbon-neutral Zürich facility.',
  },
]

export default function About() {
  useEffect(() => {
    document.title = 'Our story — LUMIÈRE'
  }, [])

  return (
    <>
      <section className="border-b border-ink-200 bg-ink-100/50">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-12 lg:items-end lg:py-28">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Our story</p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
                We started because
                <br />
                <em className="font-normal italic text-ink-500">nothing worked.</em>
              </h1>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={200}>
              <p className="leading-relaxed text-ink-600">
                In 2018, our founder Kim MinJuu spent a decade formulating skincare for other
                brands — and a lifetime watching people be disappointed by it. LUMIÈRE was built
                on one frustration: that the active on the front of the bottle is rarely the one
                still working by the back.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <ProductVisual
              shape="bottle"
              from="#e4dbd5"
              to="#786158"
              label="LUMIÈRE laboratory"
              className="aspect-[4/5] w-full"
            />
          </Reveal>
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Why we exist"
              title="Stability is the whole game"
              text="Vitamin C is famously unstable. It degrades in months, which is why so many serums promise more than they deliver. So we built our entire operation around solving that problem — better stabilisation, honest concentrations, and testing at six months rather than at launch."
            />
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {[
                { value: '6 mo', label: 'Stability testing window' },
                { value: '42', label: 'Skin tones in our shade testing' },
                { value: '12 wk', label: 'Clinical study per formula' },
                { value: '0', label: 'Animal testing, since 2018' },
              ].map((stat, index) => (
                <Reveal key={stat.label} delay={index * 90}>
                  <div className="border-t border-ink-200 pt-5">
                    <p className="font-display text-4xl text-ink-950">{stat.value}</p>
                    <p className="mt-1.5 text-xs uppercase tracking-[0.18em] text-ink-400">
                      {stat.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink-200 bg-ink-100/50 py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our path"
            title="Eight years, five turning points"
            align="center"
            className="mb-16"
          />
          <div className="relative">
            <div className="absolute left-[0.45rem] top-2 h-[calc(100%-1rem)] w-px bg-ink-200 lg:left-1/2" />
            {TIMELINE.map((entry, index) => (
              <Reveal
                key={entry.year}
                delay={index * 80}
                className="relative pb-12 pl-10 last:pb-0 lg:w-1/2 lg:pl-0 lg:even:ml-auto lg:even:pl-14 lg:odd:pr-14 lg:odd:text-right"
              >
                <span className="absolute left-0 top-2 size-3 rounded-full border-2 border-ink-950 bg-ink-50 lg:left-auto lg:top-2.5 lg:even:left-[-0.35rem] lg:odd:right-[-0.35rem]" />
                <p className="font-display text-2xl text-ink-500">{entry.year}</p>
                <h3 className="mt-2 text-3xl">{entry.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{entry.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="ingredients" className="container-page scroll-mt-24 py-20">
        <SectionHeading
          eyebrow="What we stand for"
          title="Four promises we do not bend"
          text="These are the constraints we build every formula inside. They cost us margin, and they are the reason clients stay."
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {BENEFITS.map((benefit, index) => (
            <Reveal key={benefit.title} delay={index * 90} className="h-full">
              <div className="flex h-full flex-col border border-ink-200 p-8 transition-colors duration-500 hover:border-ink-400">
                <span className="flex size-11 items-center justify-center rounded-full bg-ink-950 text-ink-50">
                  <Icon name="leaf" className="size-5" />
                </span>
                <h3 className="mt-6 text-3xl">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{benefit.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="process" className="scroll-mt-24 bg-ink-950 py-20 text-ink-100">
        <div className="container-page">
          <SectionHeading
            onDark
            eyebrow="Our process"
            title="From field to formula to front door"
            text="Four stages, each one documented and open to our clients on request."
          />
          <div className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, index) => (
              <Reveal key={step.step} delay={index * 100}>
                <div className="border-t border-ink-100/20 pt-6">
                  <p className="font-display text-5xl text-ink-300/50">{step.step}</p>
                  <h3 className="mt-4 text-3xl text-ink-50">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-300">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="sustainability" className="container-page scroll-mt-24 py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Sustainability"
              title="Progress, honestly measured"
              text="We publish our footprint every year, including the numbers that got worse. Here is where we actually stand in 2026."
            />
          </div>
          <div className="lg:col-span-7">
            <ul className="divide-y divide-ink-200 border-y border-ink-200">
              {[
                { label: 'Packaging waste per client', value: '−60%', progress: 60 },
                { label: 'Carbon-neutral shipping coverage', value: '100%', progress: 100 },
                { label: 'Recyclable or refillable components', value: '92%', progress: 92 },
                { label: 'Water use per unit produced', value: '−28%', progress: 28 },
                { label: 'Plastic-free outer packaging', value: '100%', progress: 100 },
              ].map((item, index) => (
                <Reveal key={item.label} delay={index * 80} as="li" className="py-6">
                  <div className="flex items-center justify-between gap-6">
                    <p className="text-sm text-ink-700">{item.label}</p>
                    <p className="font-display text-2xl tabular-nums text-ink-950">{item.value}</p>
                  </div>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-ink-950"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="flex flex-col items-center gap-8 border border-ink-200 bg-ink-100/50 p-10 text-center sm:p-14">
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="rounded-full border border-ink-200 px-5 py-2 text-xs uppercase tracking-[0.15em] text-ink-600 transition-colors hover:border-ink-950 hover:bg-ink-950 hover:text-ink-50"
              >
                {category.name}
              </Link>
            ))}
          </div>
          <h2 className="max-w-2xl text-4xl leading-tight sm:text-5xl">
            Eight formulas, {PRODUCTS.length * 40}+ five-star reviews
          </h2>
          <Link to="/products" className="btn-primary">
            Explore the collection
            <Icon name="arrow-right" className="size-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
