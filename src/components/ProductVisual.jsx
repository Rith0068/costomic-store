const SHAPES = {
  bottle: 'M32 16h8v8h-8zM34 24h4v34a4 4 0 0 1-4 4 4 4 0 0 1-4-4z',
  jar: 'M28 20h16l-1 6H29zM28 26h16a3 3 0 0 1 3 3v22a4 4 0 0 1-4 4H29a4 4 0 0 1-4-4V29a3 3 0 0 1 3-3z',
  tube: 'M30 18h12l-1.5 4H31.5zM30 22h12v30a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4z',
  dropper: 'M34 12h4v10h-4zM32 22h8v6h-8zM31 28h10a3 3 0 0 1 3 3v19a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4V31a3 3 0 0 1 3-3z',
  compact: 'M14 26h36a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V30a4 4 0 0 1 4-4z',
  puff: 'M32 12c11 0 18 7 18 16s-7 16-18 16-18-7-18-16 7-16 18-16z',
}

const SIZE_RATIO = {
  bottle: { w: 22, h: 52, y: 12 },
  jar: { w: 30, h: 34, y: 24 },
  tube: { w: 24, h: 44, y: 18 },
  dropper: { w: 24, h: 46, y: 12 },
  compact: { w: 44, h: 28, y: 26 },
  puff: { w: 36, h: 32, y: 12 },
}

export function ProductVisual({ shape = 'bottle', from, to, label, className = '' }) {
  const ratio = SIZE_RATIO[shape] ?? SIZE_RATIO.bottle
  const gradientId = `g-${shape}-${from?.slice(1) ?? 'a'}-${to?.slice(1) ?? 'b'}`

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: `linear-gradient(150deg, ${from}, ${to})` }}>
      <div
        className="absolute inset-0 opacity-25 mix-blend-multiply"
        style={{ background: `radial-gradient(120% 80% at 20% 10%, #fff 0%, transparent 55%)` }}
      />
      <svg
        viewBox="0 0 64 64"
        className="relative z-10 size-full"
        role="img"
        aria-label={label ? `${label} product illustration` : 'Product illustration'}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <ellipse cx="32" cy={ratio.y + ratio.h + 4} rx={ratio.w * 0.85} ry="3.5" fill="#000" opacity="0.10" />
        <path
          d={SHAPES[shape]}
          fill={`url(#${gradientId})`}
          stroke="#ffffff"
          strokeOpacity="0.5"
          strokeWidth="0.8"
        />
        <rect
          x={32 - ratio.w * 0.34}
          y={ratio.y + ratio.h * 0.42}
          width={ratio.w * 0.68}
          height={ratio.h * 0.3}
          rx="1"
          fill={to}
          opacity="0.35"
        />
      </svg>
    </div>
  )
}
