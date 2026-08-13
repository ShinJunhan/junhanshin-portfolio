import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Concentric-ring placement: one center icon (largest), a ring of 5, then
// an outer ring of 4 — mimics the varied-size honeycomb of a watchOS app
// grid rather than a plain rectangular grid. `rf` is the icon's distance
// from center as a fraction of the circle's radius.
const LAYOUT = [
  { size: 0.24, rf: 0, angle: 0 },
  { size: 0.19, rf: 0.42, angle: 0 },
  { size: 0.19, rf: 0.42, angle: 72 },
  { size: 0.19, rf: 0.42, angle: 144 },
  { size: 0.19, rf: 0.42, angle: 216 },
  { size: 0.19, rf: 0.42, angle: 288 },
  { size: 0.15, rf: 0.78, angle: 36 },
  { size: 0.15, rf: 0.78, angle: 108 },
  { size: 0.15, rf: 0.78, angle: 180 },
  { size: 0.15, rf: 0.78, angle: 252 },
]

function Glyph({ type }) {
  const common = {
    width: '100%',
    height: '100%',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  switch (type) {
    case 'server':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="6" rx="1.5" />
          <rect x="3" y="14" width="18" height="6" rx="1.5" />
          <circle cx="7" cy="7" r="0.6" fill="currentColor" />
          <circle cx="7" cy="17" r="0.6" fill="currentColor" />
        </svg>
      )
    case 'archive':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="4" rx="1" />
          <path d="M4 8v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8" />
          <path d="M10 12h4" />
        </svg>
      )
    case 'network':
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="2.2" />
          <circle cx="18" cy="6" r="2.2" />
          <circle cx="12" cy="18" r="2.2" />
          <path d="M8 7l7.2-.6M7.5 8l3.7 8M16.5 8l-3.7 8" />
        </svg>
      )
    case 'globe':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.8 2.7 2.8 15.3 0 18M12 3c-2.8 2.7-2.8 15.3 0 18" />
        </svg>
      )
    case 'shuffle':
      return (
        <svg {...common}>
          <path d="M4 6h4l8 12h4M4 18h4l3-4.5" />
          <path d="M16 6h4M18 4l2 2-2 2M18 20l2-2-2-2" />
        </svg>
      )
    case 'database':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
          <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
        </svg>
      )
    case 'key':
      return (
        <svg {...common}>
          <circle cx="8" cy="15" r="4" />
          <path d="M11 12l9-9M16 5l3 3M18 3l3 3" />
        </svg>
      )
    case 'pulse':
      return (
        <svg {...common}>
          <path d="M3 12h4l2-7 4 14 2-7h6" />
        </svg>
      )
    case 'layers':
      return (
        <svg {...common}>
          <path d="M12 3l9 5-9 5-9-5 9-5z" />
          <path d="M3 13.5l9 5 9-5" />
        </svg>
      )
    case 'bolt':
      return (
        <svg {...common}>
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
        </svg>
      )
    case 'gear':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
        </svg>
      )
    case 'box':
      return (
        <svg {...common}>
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
          <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
        </svg>
      )
    case 'hexagon':
      return (
        <svg {...common}>
          <path d="M12 2l8 4.6v10.8L12 22l-8-4.6V6.6L12 2z" />
          <circle cx="12" cy="12" r="2.4" />
        </svg>
      )
    case 'wheel':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="2" />
          <path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8" />
        </svg>
      )
    case 'arrows-updown':
      return (
        <svg {...common}>
          <path d="M7 14l5 5 5-5M7 10l5-5 5 5" />
        </svg>
      )
    case 'play':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'wrench':
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8z" />
        </svg>
      )
    case 'sync':
      return (
        <svg {...common}>
          <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8" />
          <path d="M20 4v4h-4" />
          <path d="M20 12a8 8 0 0 1-13.7 5.7L4 16" />
          <path d="M4 20v-4h4" />
        </svg>
      )
    case 'git-branch':
      return (
        <svg {...common}>
          <circle cx="6" cy="5" r="2" />
          <circle cx="6" cy="19" r="2" />
          <circle cx="18" cy="12" r="2" />
          <path d="M6 7v10" />
          <path d="M6 15c0-4 4-6 10-6" />
        </svg>
      )
    case 'flame':
      return (
        <svg {...common}>
          <path d="M12 21c-4 0-6-2.5-6-6 0-3 2-5 3-8 1 2 1 3 2 3 .5-2-.5-4 0-6 3 2 5 5 5 8a4 4 0 0 1-4 4c1-2 0-3-1-3-.5 1.5.5 2.5 1 3z" />
        </svg>
      )
    case 'chart-bar':
      return (
        <svg {...common}>
          <line x1="5" y1="19" x2="5" y2="11" />
          <line x1="10" y1="19" x2="10" y2="5" />
          <line x1="15" y1="19" x2="15" y2="13" />
          <line x1="19" y1="19" x2="19" y2="9" />
        </svg>
      )
    case 'bell':
      return (
        <svg {...common}>
          <path d="M12 3a5 5 0 0 0-5 5v3c0 1-1 2-2 3h14c-1-1-2-2-2-3V8a5 5 0 0 0-5-5z" />
          <path d="M9.5 20a2.5 2.5 0 0 0 5 0" />
        </svg>
      )
    case 'cloud':
      return (
        <svg {...common}>
          <path d="M6.5 19a4.5 4.5 0 0 1 0-9 6 6 0 0 1 11.6-1.8A4 4 0 0 1 17.5 16" />
          <path d="M6.5 19h11" />
        </svg>
      )
    default:
      return null
  }
}

function ServiceIcon({ slug, glyph, basePath }) {
  const [imgFailed, setImgFailed] = useState(false)
  if (imgFailed) return <Glyph type={glyph} />
  return (
    <img
      src={`${basePath}/${slug}.svg`}
      alt=""
      draggable={false}
      onError={() => setImgFailed(true)}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}

// Positioning (this outer plain div) is kept separate from the hover/scale
// animation (the nested motion.div): framer-motion synthesizes its own
// `transform` from motion values like `scale`, which silently overrides a
// plain `transform: translate(...)` string set on the same element — so
// the centering offset has to live on an element framer isn't animating.
function OrbitIcon({ service, basePath, layout }) {
  const [hovered, setHovered] = useState(false)
  const rad = (layout.angle * Math.PI) / 180
  const left = 50 + layout.rf * 42 * Math.cos(rad)
  const top = 50 + layout.rf * 42 * Math.sin(rad)

  return (
    <div
      style={{
        position: 'absolute',
        left: `${left}%`,
        top: `${top}%`,
        transform: 'translate(-50%, -50%)',
        width: `${layout.size * 100}%`,
        height: `${layout.size * 100}%`,
        zIndex: hovered ? 5 : 1,
      }}
    >
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        animate={{ scale: hovered ? 1.3 : 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        tabIndex={0}
        role="img"
        aria-label={service.label}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          // A squircle (rounded square) rather than a full circle or a
          // sharp-cornered rectangle — the iOS/watchOS app-icon shape.
          borderRadius: '30%',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          color: 'var(--accent-base)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ width: '56%', height: '56%' }}>
          <ServiceIcon slug={service.slug} glyph={service.glyph} basePath={basePath} />
        </div>
        <AnimatePresence>
          {hovered && (
            <motion.span
              initial={{ opacity: 0, y: 4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                bottom: '115%',
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                background: 'var(--ink)',
                color: 'var(--bg)',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '999px',
                pointerEvents: 'none',
                zIndex: 6,
              }}
            >
              {service.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// A circular "app grid" of icons — center icon largest, then two rings of
// progressively smaller ones. Hover (or focus, for keyboard users) grows
// an icon and reveals its name.
export default function IconOrbit({ services, basePath, diameter = 'clamp(260px, 24vw, 380px)' }) {
  return (
    <div
      style={{
        position: 'relative',
        width: diameter,
        height: diameter,
        borderRadius: '50%',
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        overflow: 'visible',
        flexShrink: 0,
      }}
    >
      {services.map((s, i) => (
        <OrbitIcon key={s.slug} service={s} basePath={basePath} layout={LAYOUT[i % LAYOUT.length]} />
      ))}
    </div>
  )
}
