import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import ServiceIcon from './skillGlyphs.jsx'

// With no category selected, every icon on the site sits scattered across
// the panel as an ambient texture. Selecting one pulls that category's
// icons in to the honeycomb at full size and opacity, and dims the rest.
//
// Icons form the cluster shape themselves — no container drawn behind them.
// They sit on offset rows, so a set fills out toward a hexagonal blob: two
// side by side, five as a 3-over-2, thirteen as a 4-5-4 hexagon. The row
// plan isn't fixed per count — it's searched for against the measured box,
// so the same set packs differently in a wide panel than a narrow one.
const ROW_PITCH = 0.866 // sin(60deg) — honeycomb row spacing
const ICON_FRAC = 0.78  // disc size as a share of the centre-to-centre step
const MAX_STEP = 148    // px — ceiling on disc spacing, so a four-item
                        // category doesn't dwarf a thirteen-item one

// Every icon lays out at this size and animates by `scale`, so position and
// size are both transforms — no per-frame layout for ~60 elements.
const BASE = 100
const AMBIENT_OPACITY = 0.26
// Non-selected categories stay faintly visible behind the cluster rather
// than vanishing, so the field doesn't empty out on selection.
const DIMMED_OPACITY = 0.07
const AMBIENT_MIN = 20
const AMBIENT_MAX = 52
// Share of an icon's notional cell that the icon itself fills. Kept well
// under half so the scatter reads as texture and the converged discs are a
// clear step up in size, not a marginal one.
const AMBIENT_FILL = 0.5
// Below this much panel area per icon the scatter reads as clutter, so the
// field is thinned rather than shrunk further — this is what keeps a phone
// from showing sixty overlapping icons.
const AMBIENT_AREA_PER_ICON = 2700

// Turns a row plan into unit offsets from the centre, alternate rows
// half-stepped so the discs nest the way a honeycomb does.
function offsetsForPlan(plan) {
  const offsets = []
  plan.forEach((n, row) => {
    for (let i = 0; i < n; i++) {
      offsets.push({
        x: i - (n - 1) / 2,
        y: (row - (plan.length - 1) / 2) * ROW_PITCH,
      })
    }
  })
  return offsets
}

// The panel is usually much wider than it is tall, so left to itself the
// search below would always pick a single long row — the biggest discs, but
// a strip rather than a honeycomb. These floors keep a real offset-row shape.
function minRowsFor(count) {
  if (count >= 10) return 3
  if (count >= 4) return 2
  return 1
}

// Spreads `count` icons over `rows` rows as evenly as possible, handing any
// remainder to the middle rows first so the silhouette stays hex-like
// rather than going top-heavy.
function balancedPlan(count, rows) {
  const plan = Array.from({ length: rows }, () => Math.floor(count / rows))
  const middleFirst = Array.from({ length: rows }, (_, i) => i).sort(
    (a, b) => Math.abs(a - (rows - 1) / 2) - Math.abs(b - (rows - 1) / 2)
  )
  for (let k = 0; k < count % rows; k++) plan[middleFirst[k]] += 1
  return plan
}

// Centre-to-centre spacing a given arrangement can afford in a given box.
// +1 step in each direction so the tiles themselves fit inside the box, not
// just their centres.
function stepFor(offsets, box) {
  const unitsWide = Math.max(...offsets.map((o) => Math.abs(o.x))) * 2 + 1
  const unitsTall = Math.max(...offsets.map((o) => Math.abs(o.y))) * 2 + 1
  return Math.min(box.w / unitsWide, box.h / unitsTall)
}

// Honeycomb centres for one category, in panel coordinates.
function clusterFor(count, box) {
  let best = null
  for (let rows = minRowsFor(count); rows <= Math.min(count, 4); rows++) {
    const candidate = offsetsForPlan(balancedPlan(count, rows))
    const step = stepFor(candidate, box)
    if (!best || step > best.step) best = { offsets: candidate, step }
  }
  const step = Math.min(best.step, MAX_STEP)
  return {
    size: step * ICON_FRAC,
    spots: best.offsets.map((o) => ({ x: box.w / 2 + o.x * step, y: box.h / 2 + o.y * step })),
  }
}

// Deterministic 0–1 from a string, so an icon keeps the same scattered spot
// and size across re-renders instead of hopping on every state change.
function noise(seed) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  h ^= h >>> 15
  return (h >>> 0) / 4294967296
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

// One scattered position per icon. Stratified — one icon per cell of a grid
// over the panel, jittered inside its cell — because pure random clumps in
// places and leaves bald patches elsewhere.
function scatterFor(entries, box) {
  const n = entries.length
  const cols = Math.max(1, Math.round(Math.sqrt((n * box.w) / box.h)))
  const rows = Math.ceil(n / cols)
  const cellW = box.w / cols
  const cellH = box.h / rows
  // How many of them actually show: enough to read as texture, never so
  // many that a narrow panel turns into a solid mat of icons.
  const shown = clamp(Math.floor((box.w * box.h) / AMBIENT_AREA_PER_ICON), 10, n)
  const base = clamp(Math.sqrt((box.w * box.h) / shown) * AMBIENT_FILL, AMBIENT_MIN, AMBIENT_MAX)

  return entries.map((entry, i) => {
    const size = base * (0.7 + noise(entry.key + 'z') * 0.65)
    const half = size / 2
    const col = i % cols
    const row = Math.floor(i / cols)
    return {
      x: clamp(cellW * (col + 0.15 + noise(entry.key + 'x') * 0.7), half, box.w - half),
      y: clamp(cellH * (row + 0.15 + noise(entry.key + 'y') * 0.7), half, box.h - half),
      scale: size / BASE,
      // Beyond the density budget an icon still has a home to fly out of,
      // it just isn't drawn until its category is picked.
      shown: i < shown,
    }
  })
}

function FieldIcon({ entry, target, interactive, spotlit, accent, transition, onEnter, onLeave }) {
  const scale = target.scale * (spotlit ? 1.16 : 1)
  const labelOffset = (BASE * scale) / 2 + 10

  return (
    // initial={false} throughout: without it every icon would mount at the
    // field's origin at full size and fly out to its scattered spot on the
    // first paint. The field should simply be there, and animate only when
    // a category is picked.
    // The spotlit icon's whole group is lifted, not just its label: each
    // icon's animated transform makes it a stacking context, so a z-index
    // on the label alone only orders it within its own icon and the next
    // icon in the DOM still paints over it.
    <motion.div
      className="field-icon"
      style={{ zIndex: spotlit ? 40 : interactive ? 5 : 1 }}
      initial={false}
      animate={{ x: target.x, y: target.y }}
      transition={transition}
    >
      <motion.div
        className="field-icon__disc"
        initial={false}
        style={{
          left: -BASE / 2,
          top: -BASE / 2,
          width: BASE,
          height: BASE,
          color: accent,
          pointerEvents: interactive ? 'auto' : 'none',
        }}
        animate={{ scale, opacity: target.opacity }}
        transition={transition}
        onHoverStart={onEnter}
        onHoverEnd={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        tabIndex={interactive ? 0 : -1}
        aria-hidden={interactive ? undefined : 'true'}
        role={interactive ? 'img' : undefined}
        aria-label={interactive ? entry.service.label : undefined}
      >
        {/* Bare in the ambient field; the disc behind it fades in only once
            the icon has joined the converged cluster. */}
        <motion.span
          className="field-icon__chrome"
          style={{ border: `1px solid ${spotlit ? accent : 'var(--skill-disc-border)'}` }}
          initial={false}
          animate={{ opacity: target.chrome }}
          transition={transition}
        />
        <div style={{ position: 'absolute', inset: '23%' }}>
          <ServiceIcon slug={entry.service.slug} glyph={entry.service.glyph} basePath={entry.basePath} />
        </div>
      </motion.div>

      <AnimatePresence>
        {spotlit && (
          <motion.span
            className="field-icon__label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ transform: `translate(-50%, calc(-100% - ${labelOffset}px))` }}
          >
            {entry.service.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// `spotIndex` is driven by the section, which spotlights exactly one icon of
// the selected category at a time. A real hover wins over it.
export default function SkillField({ groups, activeId, spotIndex = null }) {
  const reduceMotion = useReducedMotion()
  const ref = useRef(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [hovered, setHovered] = useState(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    // Measured once up front as well as observed: the observer's first
    // callback lands a frame later, and the field would otherwise paint
    // empty until it arrives.
    const rect = el.getBoundingClientRect()
    setBox({ w: rect.width, h: rect.height })
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setBox({ w: width, h: height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Every icon on the page, in one flat list. Shuffled deterministically so
  // the scatter grid hands neighbouring cells to different categories —
  // in source order each category would land as a contiguous blob.
  const entries = useMemo(
    () =>
      groups
        .flatMap((group) =>
          group.services.map((service, index) => ({
            key: `${group.id}:${service.slug}`,
            groupId: group.id,
            accent: group.accent,
            basePath: group.basePath,
            service,
            index,
          }))
        )
        .sort((a, b) => noise(a.key) - noise(b.key)),
    [groups]
  )

  const ready = box.w > 0 && box.h > 0
  const scatter = useMemo(() => (ready ? scatterFor(entries, box) : []), [entries, box, ready])
  const active = groups.find((g) => g.id === activeId) ?? null
  const cluster = useMemo(
    () => (ready && active ? clusterFor(active.services.length, box) : null),
    [active, box, ready]
  )

  return (
    <div ref={ref} className="skill-field">
      {ready &&
        entries.map((entry, i) => {
          const ambient = scatter[i]
          const converged = cluster && entry.groupId === activeId
          const spot = converged ? cluster.spots[entry.index] : null

          const target = converged
            ? { x: spot.x, y: spot.y, scale: cluster.size / BASE, opacity: 1, chrome: 1 }
            : {
                x: ambient.x,
                y: ambient.y,
                scale: ambient.scale,
                chrome: 0,
                opacity: active ? DIMMED_OPACITY : ambient.shown ? AMBIENT_OPACITY : 0,
              }

          const transition = reduceMotion
            ? { duration: 0 }
            : {
                duration: converged ? 0.75 : 0.5,
                ease: [0.16, 1, 0.3, 1],
                // The cluster assembles rather than snapping into place all
                // at once; leaving it, everything lets go together.
                delay: converged ? entry.index * 0.03 : 0,
              }

          return (
            <FieldIcon
              key={entry.key}
              entry={entry}
              target={target}
              interactive={!!converged}
              spotlit={!!converged && (hovered === entry.key || (hovered === null && spotIndex === entry.index))}
              accent={converged ? entry.accent : 'var(--c-indigo)'}
              transition={transition}
              onEnter={() => setHovered(entry.key)}
              onLeave={() => setHovered((cur) => (cur === entry.key ? null : cur))}
            />
          )
        })}
    </div>
  )
}
