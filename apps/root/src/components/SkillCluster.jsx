import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'

// Icons form the shape themselves — no container drawn behind them. Two
// icons sit side by side; three make a triangle; larger sets fill out
// toward a hexagonal/circular blob. Plans are portrait-leaning so the
// cluster fills a tall card rather than sitting as a wide, short band.
const ROW_PLANS = {
  1: [1],
  2: [2],
  3: [1, 2],
  4: [1, 2, 1],
  5: [2, 3],
  6: [1, 2, 2, 1],
  7: [2, 3, 2],
  8: [1, 3, 3, 1],
  9: [1, 2, 3, 2, 1],
  10: [2, 3, 3, 2],
  11: [1, 3, 3, 3, 1],
  12: [3, 3, 3, 3],
  13: [2, 3, 3, 3, 2],
}
const ROW_PITCH = 0.866 // sin(60deg) — honeycomb row spacing
const ICON_FRAC = 0.78  // disc size as a share of the centre-to-centre step
// How long each icon holds its turn in the automatic walk-through. Slow
// enough to read the label without it feeling twitchy.
const AUTO_DWELL_MS = 1700

// Counts that read better as a named polygon than as honeycomb rows.
// Points are unit offsets from the centre, in steps.
const SQUARE = [
  { x: -0.5, y: -0.5 }, { x: 0.5, y: -0.5 },
  { x: -0.5, y: 0.5 }, { x: 0.5, y: 0.5 },
]
// Five points around a circle, apex up. The radius is derived so adjacent
// points sit exactly one step apart — the same neighbour spacing the
// honeycomb uses — otherwise the tiles would overlap:
//   chord = 2 * r * sin(pi/5) = 1  =>  r = 1 / (2 * sin(36deg))
const PENTAGON_R = 1 / (2 * Math.sin(Math.PI / 5))
const PENTAGON = Array.from({ length: 5 }, (_, i) => {
  const a = (-90 + i * 72) * (Math.PI / 180)
  return { x: Math.cos(a) * PENTAGON_R, y: Math.sin(a) * PENTAGON_R }
})
const POLYGONS = { 4: SQUARE, 5: PENTAGON }

// Very small sets would otherwise blow up to fill the whole card, ending up
// larger than the icons on a busy card; these hold them near the same size.
function widthCapFor(count) {
  if (count <= 2) return 0.86
  if (count <= 5) return 0.95
  return 1
}

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
    case 'broadcast':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2" />
          <path d="M8.5 15.5a5 5 0 0 1 0-7M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M5.5 18.5a9 9 0 0 1 0-13M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      )
    case 'console':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 9l3 3-3 3M13 15h4" />
        </svg>
      )
    case 'lock':
      return (
        <svg {...common}>
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          <circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'anchor':
      return (
        <svg {...common}>
          <circle cx="12" cy="5" r="2.5" />
          <path d="M12 7.5V21" />
          <path d="M5 13a7 7 0 0 0 14 0" />
          <path d="M8.5 10.5h7" />
        </svg>
      )
    case 'swap':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="11" height="9" rx="2" />
          <rect x="10" y="11" width="11" height="9" rx="2" />
        </svg>
      )
    case 'coin':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10M14.6 9.6a2.8 2.8 0 0 0-2.6-1.4c-1.6 0-2.6.8-2.6 2s1 1.8 2.6 2 2.8.6 2.8 2-1.2 2-2.8 2a3 3 0 0 1-2.7-1.4" />
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

// Positioning (the outer plain div) stays separate from the hover scale
// (the nested motion.div): framer-motion synthesizes `transform` from
// animated motion values and would otherwise overwrite the centering
// translate set on the same element.
function ClusterIcon({ service, basePath, left, top, size, active, onEnter, onLeave }) {
  return (
    <div style={{ position: 'absolute', left, top, width: size, height: size, zIndex: active ? 5 : 1 }}>
      <motion.div
        onHoverStart={onEnter}
        onHoverEnd={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        animate={{ scale: active ? 1.16 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        tabIndex={0}
        role="img"
        aria-label={service.label}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'var(--skill-disc-bg)',
          border: `1px solid ${active ? 'var(--c-indigo)' : 'var(--skill-disc-border)'}`,
          color: 'var(--c-indigo)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--skill-disc-shadow)',
        }}
      >
        <div style={{ width: '54%', height: '54%' }}>
          <ServiceIcon slug={service.slug} glyph={service.glyph} basePath={basePath} />
        </div>
        <AnimatePresence>
          {active && (
            <motion.span
              initial={{ opacity: 0, y: 4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{
                position: 'absolute',
                bottom: '112%',
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                background: 'var(--ink)',
                color: 'var(--bg)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '3px 9px',
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

// Sized from the measured box rather than a fixed viewBox: the step is
// whichever of width or height binds first, so the cluster always grows to
// fill the card without spilling out of it.
export default function SkillCluster({ services, basePath, phase = 0 }) {
  const ref = useRef(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const reduceMotion = useReducedMotion()
  const inView = useInView(ref, { amount: 0.4 })
  // Which icon the automatic walk-through is on, and which one the pointer
  // is on. A real hover wins and pauses the walk-through.
  const [autoIndex, setAutoIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setBox({ w: width, h: height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const count = services.length

  // Steps one icon at a time while the card is on screen. `phase` staggers
  // each card's start so the five don't pulse in lockstep.
  useEffect(() => {
    if (reduceMotion || !inView || hoverIndex !== null) return
    const id = setInterval(() => {
      setAutoIndex((i) => (i + 1) % count)
    }, AUTO_DWELL_MS)
    return () => clearInterval(id)
  }, [reduceMotion, inView, hoverIndex, count])

  useEffect(() => {
    setAutoIndex(phase % count)
  }, [phase, count])

  const activeIndex = hoverIndex ?? (reduceMotion || !inView ? null : autoIndex)
  // Named polygons win where one reads better than honeycomb rows;
  // everything else falls back to the row plans. Both produce offsets in
  // step-units from the centre, so the sizing below is shared.
  const poly = POLYGONS[count]
  let offsets
  if (poly) {
    offsets = poly
  } else {
    const plan = ROW_PLANS[count] || ROW_PLANS[10]
    offsets = []
    plan.forEach((n, row) => {
      for (let i = 0; i < n; i++) {
        offsets.push({
          x: i - (n - 1) / 2,
          y: (row - (plan.length - 1) / 2) * ROW_PITCH,
        })
      }
    })
  }

  // +1 step so the tiles themselves fit inside the box, not just their centres.
  const unitsWide = Math.max(...offsets.map((o) => Math.abs(o.x))) * 2 + 1
  const unitsTall = Math.max(...offsets.map((o) => Math.abs(o.y))) * 2 + 1
  const step = Math.min((box.w * widthCapFor(count)) / unitsWide, box.h / unitsTall)
  const size = step * ICON_FRAC

  const spots = offsets.map((o) => ({
    cx: box.w / 2 + o.x * step,
    cy: box.h / 2 + o.y * step,
  }))

  return (
    <div ref={ref} className="cluster">
      {step > 0 &&
        services.map((s, i) => (
          <ClusterIcon
            key={s.slug}
            service={s}
            basePath={basePath}
            left={spots[i].cx - size / 2}
            top={spots[i].cy - size / 2}
            size={size}
            active={activeIndex === i}
            onEnter={() => setHoverIndex(i)}
            onLeave={() => setHoverIndex((cur) => (cur === i ? null : cur))}
          />
        ))}
    </div>
  )
}
