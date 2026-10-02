import { useEffect, useState } from 'react'
import { FAQS } from '../data/products'
import { Icon } from '../components/Icon'
import { Reveal, SectionHeading } from '../components/ui/Section'

const CONTACT_METHODS = [
  {
    icon: 'message',
    title: 'Client care',
    text: 'Questions about your routine, an order or a refund? Our team answers within one business day.',
    action: 'Use the form',
    href: '#contact-form',
  },
  {
    icon: 'mail',
    title: 'Email',
    text: 'hello@lumiere.ch',
    detail: 'For press, wholesale and partnership enquiries, write to press@lumiere.ch.',
    action: 'Send an email',
    href: 'mailto:hello@lumiere.ch',
  },
  {
    icon: 'phone',
    title: 'Telephone',
    text: '+41 44 123 45 67',
    detail: 'Monday to Friday, 09:00 – 18:00 CET.',
    action: 'Call us',
    href: 'tel:+41441234567',
  },
  {
    icon: 'pin',
    title: 'Visit the boutique',
    text: 'Bahnhofstrasse 24, 8001 Zürich',
    detail: 'Routine consultations by appointment, Tuesday to Saturday.',
    action: 'Book an appointment',
    href: '#contact-form',
  },
]

const SUBJECTS = [
  'Order or delivery enquiry',
  'Product or routine advice',
  'Returns and refunds',
  'Wholesale or partnership',
  'Press and media',
  'Something else',
]

const SHIPPING_ROWS = [
  { method: 'Standard Swiss delivery', time: '2–3 business days', price: 'CHF 5.90 · Free over CHF 60' },
  { method: 'Express Swiss delivery', time: 'Next business day', price: 'CHF 12.90' },
  { method: 'European Union', time: '3–5 business days', price: 'CHF 9.90 · Free over CHF 90' },
  { method: 'United Kingdom', time: '4–6 business days', price: 'CHF 14.90' },
]

const EMPTY_FORM = {
  name: '',
  email: '',
  subject: SUBJECTS[0],
  message: '',
}

function ContactForm() {
  const [values, setValues] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const validate = () => {
    const next = {}
    if (values.name.trim().length < 2) next.name = 'Please enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Enter a valid email address.'
    if (values.message.trim().length < 10) next.message = 'Please give us a little more detail.'
    return next
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setStatus('success')
    setValues(EMPTY_FORM)
  }

  const update = (field) => (event) => {
    const { value } = event.target
    setValues((current) => ({ ...current, [field]: value }))
    setStatus('idle')
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const fieldClass = (hasError) =>
    `mt-2 w-full border bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-ink-400 ${
      hasError ? 'border-blush-500' : 'border-ink-200 focus:border-ink-950'
    }`

  return (
    <form id="contact-form" onSubmit={handleSubmit} noValidate className="scroll-mt-24">
      <div className="border border-ink-200 p-8 sm:p-10">
        <p className="eyebrow">Send a message</p>
        <h2 className="mt-3 text-4xl">How can we help?</h2>

        <div className="mt-9 grid gap-6 sm:grid-cols-2">
          <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
            Full name
            <input
              type="text"
              value={values.name}
              onChange={update('name')}
              placeholder="Jane Doe"
              aria-invalid={Boolean(errors.name)}
              className={fieldClass(errors.name)}
            />
            {errors.name && (
              <span className="mt-1.5 block text-xs normal-case tracking-normal text-blush-600">
                {errors.name}
              </span>
            )}
          </label>

          <label className="block text-xs uppercase tracking-[0.15em] text-ink-500">
            Email address
            <input
              type="email"
              value={values.email}
              onChange={update('email')}
              placeholder="jane@example.com"
              aria-invalid={Boolean(errors.email)}
              className={fieldClass(errors.email)}
            />
            {errors.email && (
              <span className="mt-1.5 block text-xs normal-case tracking-normal text-blush-600">
                {errors.email}
              </span>
            )}
          </label>
        </div>

        <label className="mt-6 block text-xs uppercase tracking-[0.15em] text-ink-500">
          Subject
          <select
            value={values.subject}
            onChange={update('subject')}
            className={fieldClass(false)}
          >
            {SUBJECTS.map((subject) => (
              <option key={subject}>{subject}</option>
            ))}
          </select>
        </label>

        <label className="mt-6 block text-xs uppercase tracking-[0.15em] text-ink-500">
          Message
          <textarea
            rows={6}
            value={values.message}
            onChange={update('message')}
            placeholder="Tell us a little about your skin or your order…"
            aria-invalid={Boolean(errors.message)}
            className={`${fieldClass(errors.message)} resize-y`}
          />
          {errors.message && (
            <span className="mt-1.5 block text-xs normal-case tracking-normal text-blush-600">
              {errors.message}
            </span>
          )}
        </label>

        <button type="submit" className="btn-primary mt-8 w-full sm:w-auto">
          Send message
          <Icon name="arrow-right" className="size-4" />
        </button>

        <p className="mt-4 h-5 text-xs">
          {status === 'success' && (
            <span className="flex items-center gap-1.5 text-sage-600">
              <Icon name="check" className="size-4" />
              Thank you — we will reply within one business day.
            </span>
          )}
        </p>
      </div>
    </form>
  )
}

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    document.title = 'Contact us — LUMIÈRE'
  }, [])

  return (
    <>
      <section className="border-b border-ink-200 bg-ink-100/50">
        <div className="container-page py-20 lg:py-24">
          <Reveal>
            <p className="eyebrow">Client care</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 max-w-3xl text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              Talk to a real
              <br />
              <em className="font-normal italic text-ink-500">formulator.</em>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl leading-relaxed text-ink-500">
              No scripts, no chatbots. Every message is read by our Zürich client care team, and
              skin questions are passed straight to the formulators who wrote the formula.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_METHODS.map((method, index) => (
            <Reveal key={method.title} delay={index * 90} className="h-full">
              <a
                href={method.href}
                className="group flex h-full flex-col border border-ink-200 p-7 transition-all duration-500 ease-out-expo hover:border-ink-950 hover:bg-ink-950"
              >
                <span className="flex size-11 items-center justify-center rounded-full border border-ink-200 text-ink-700 transition-colors group-hover:border-ink-100/30 group-hover:text-ink-50">
                  <Icon name={method.icon} />
                </span>
                <h2 className="mt-6 text-2xl text-ink-950 transition-colors group-hover:text-ink-50">
                  {method.title}
                </h2>
                <p className="mt-2 text-sm text-ink-600 transition-colors group-hover:text-ink-200">
                  {method.text}
                </p>
                {method.detail && (
                  <p className="mt-2 text-xs text-ink-400 transition-colors group-hover:text-ink-300">
                    {method.detail}
                  </p>
                )}
                <span className="mt-auto flex items-center gap-2 pt-6 text-[0.7rem] uppercase tracking-[0.2em] text-ink-950 transition-colors group-hover:text-ink-50">
                  {method.action}
                  <Icon
                    name="arrow-right"
                    className="size-3.5 transition-transform duration-500 group-hover:translate-x-1"
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page grid gap-12 pb-20 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        <div className="lg:col-span-5">
          <div className="border border-ink-200">
            <p className="eyebrow">Head office</p>
            <div className="px-8 pb-8">
              <h2 className="mt-3 text-3xl">LUMIÈRE Cosmetics AG</h2>
              <address className="mt-5 space-y-1 text-sm not-italic leading-relaxed text-ink-500">
                <p>Bahnhofstrasse 24</p>
                <p>8001 Zürich</p>
                <p>Switzerland</p>
              </address>
              <dl className="mt-7 space-y-3 border-t border-ink-200 pt-6 text-sm">
                {[
                  ['Registered', 'CHE-123.456.789'],
                  ['Founded', '2018'],
                  ['Team', '34 people'],
                  ['Languages', 'DE · FR · EN · IT'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-ink-400">{label}</dt>
                    <dd className="text-ink-950">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-6 border border-ink-200 p-8">
            <p className="eyebrow">Opening hours</p>
            <ul className="mt-5 space-y-2.5 text-sm text-ink-500">
              {[
                ['Monday – Friday', '09:00 – 18:00'],
                ['Saturday', '10:00 – 16:00'],
                ['Sunday', 'Closed'],
              ].map(([day, hours]) => (
                <li key={day} className="flex justify-between gap-4 border-b border-ink-100 pb-2.5 last:border-0">
                  <span>{day}</span>
                  <span className="text-ink-950">{hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="shipping" className="scroll-mt-24 border-y border-ink-200 bg-ink-100/50 py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Delivery"
            title="Shipping & returns"
            text="Tracked delivery on every order, dispatched from Zürich within one business day."
          />
          <Reveal delay={120}>
            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-300">
                    {['Method', 'Delivery time', 'Price'].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="pb-4 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-ink-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SHIPPING_ROWS.map((row) => (
                    <tr key={row.method} className="border-b border-ink-200">
                      <td className="py-4 pr-6 text-ink-950">{row.method}</td>
                      <td className="py-4 pr-6 text-ink-500">{row.time}</td>
                      <td className="py-4 tabular-nums text-ink-500">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-500">
              Unopened products can be returned within 30 days for a full refund or free
              replacement. If a formula did not work for your skin, tell us — we will find one that
              does.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="faq" className="container-page scroll-mt-24 py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Good to know" title="Frequently asked" />
          </div>
          <div className="lg:col-span-8">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div key={faq.q} className="border-b border-ink-200">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
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
          </div>
        </div>
      </section>
    </>
  )
}
