export function Icon({ name, className = 'size-5', strokeWidth = 1.4 }) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  switch (name) {
    case 'menu':
      return (
        <svg {...common}>
          <path d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      )
    case 'close':
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      )
    case 'bag':
      return (
        <svg {...common}>
          <path d="M6 8h12l1 12H5L6 8Z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      )
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      )
    case 'star':
      return (
        <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5z" />
        </svg>
      )
    case 'arrow-right':
      return (
        <svg {...common}>
          <path d="M4 12h16M14 6l6 6-6 6" />
        </svg>
      )
    case 'arrow-left':
      return (
        <svg {...common}>
          <path d="M20 12H4M10 18l-6-6 6-6" />
        </svg>
      )
    case 'plus':
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      )
    case 'minus':
      return (
        <svg {...common}>
          <path d="M5 12h14" />
        </svg>
      )
    case 'check':
      return (
        <svg {...common}>
          <path d="m4 12.5 5 5L20 6.5" />
        </svg>
      )
    case 'leaf':
      return (
        <svg {...common}>
          <path d="M4 20c0-8 6-14 16-14 0 10-6 14-11 14-2.5 0-5-1-5-1Z" />
          <path d="M9 15c2-3 5-5 9-6" />
        </svg>
      )
    case 'flask':
      return (
        <svg {...common}>
          <path d="M10 3h4M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3" />
          <path d="M7.5 15h9" />
        </svg>
      )
    case 'heart':
      return (
        <svg {...common}>
          <path d="M12 20s-7-4.5-7-9.5A4 4 0 0 1 12 8a4 4 0 0 1 7 2.5C19 15.5 12 20 12 20Z" />
        </svg>
      )
    case 'truck':
      return (
        <svg {...common}>
          <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
          <circle cx="7" cy="18" r="1.6" />
          <circle cx="17" cy="18" r="1.6" />
        </svg>
      )
    case 'refresh':
      return (
        <svg {...common}>
          <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8" />
          <path d="M20 4v4h-4" />
          <path d="M20 12a8 8 0 0 1-13.7 5.6L4 16" />
          <path d="M4 20v-4h4" />
        </svg>
      )
    case 'message':
      return (
        <svg {...common}>
          <path d="M20 14a2 2 0 0 1-2 2H8l-4 3V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...common}>
          <path d="M3 6h18v12H3z" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      )
    case 'phone':
      return (
        <svg {...common}>
          <path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" />
        </svg>
      )
    case 'pin':
      return (
        <svg {...common}>
          <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      )
    case 'quote':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M9 5c-3.3 1.5-5 4-5 7.5V19h6v-6H6.5c.2-2 1.3-3.4 3.2-4.3L9 5Zm10 0c-3.3 1.5-5 4-5 7.5V19h6v-6h-3.5c.2-2 1.3-3.4 3.2-4.3L19 5Z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="3.8" />
          <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'facebook':
      return (
        <svg {...common}>
          <path d="M14 8.5V7a1.5 1.5 0 0 1 1.5-1.5H17V2.5h-2.5A4.5 4.5 0 0 0 10 7v1.5H7.5V12H10v9.5h4V12h2.6l.4-3.5H14Z" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg {...common}>
          <path d="M14 3v11.2a3.3 3.3 0 1 1-2.6-3.2" />
          <path d="M14 3.5c.4 2.2 2 3.7 4.2 3.9" />
        </svg>
      )
    default:
      return null
  }
}
