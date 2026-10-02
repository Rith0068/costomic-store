import { useReveal } from '../../hooks'

export function Reveal({ as: Tag = 'div', delay = 0, className = '', children }) {
  const [ref, visible] = useReveal()

  return (
    <Tag
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionProperty: 'opacity, transform',
        transitionDuration: '900ms',
        transitionTimingFunction: 'var(--ease-out-expo)',
      }}
      className={`${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} ${className}`}
    >
      {children}
    </Tag>
  )
}

export function SectionHeading({ eyebrow, title, text, align = 'left', onDark = false, className = '' }) {
  const alignment =
    align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'

  return (
    <div className={`flex max-w-2xl flex-col ${alignment} ${className}`}>
      {eyebrow && (
        <Reveal>
          <p
            className={`eyebrow flex items-center gap-3 ${onDark ? 'text-ink-300' : ''}`}
          >
            {align === 'center' && <span className="h-px w-8 bg-current opacity-40" />}
            {eyebrow}
            {align === 'center' && <span className="h-px w-8 bg-current opacity-40" />}
          </p>
        </Reveal>
      )}
      <Reveal delay={80}>
        <h2
          className={`mt-4 text-4xl leading-[1.1] sm:text-5xl lg:text-6xl ${onDark ? 'text-ink-50' : ''}`}
        >
          {title}
        </h2>
      </Reveal>
      {text && (
        <Reveal delay={160}>
          <p
            className={`mt-5 max-w-xl text-base leading-relaxed ${onDark ? 'text-ink-300' : 'text-ink-500'}`}
          >
            {text}
          </p>
        </Reveal>
      )}
    </div>
  )
}

export function Marquee({ items }) {
  return (
    <div className="pause-on-hover overflow-hidden border-y border-ink-200 bg-ink-100/40 py-5">
      <div className="marquee-track flex w-max items-center gap-12">
        {Array.from({ length: 2 }, (_, loop) => (
          <div key={loop} className="flex items-center gap-12" aria-hidden={loop === 1}>
            {items.map((item) => (
              <span
                key={item}
                className="flex items-center gap-12 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-ink-500"
              >
                {item}
                <span className="size-1 rounded-full bg-gold-400" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
