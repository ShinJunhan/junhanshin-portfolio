import { useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { BandReveal } from './bandReveal.js'

// Five axes, apex up. `value` is the share of the full radius each axis
// reaches (0–1) — draft weighting, meant to be tuned rather than measured.
// `evidence` is the blurb the vertex label reveals when clicked.
const AXES = [
  {
    id: 'leadership',
    color: 'var(--soft-leadership)',
    label: 'Leadership',
    value: 0.94,
    evidence:
      'Led three cross-functional bootcamp teams to delivery, including one where I stepped in as de facto lead after the assigned leader became inactive. Directed vendor and temporary staff at Wellness College despite no formal reporting authority.',
  },
  {
    id: 'communication',
    color: 'var(--soft-communication)',
    label: 'Communication',
    value: 0.97,
    evidence:
      'Ten years of teaching experience translating technical material into clear instruction. Recognized by management for communication quality with parents and stakeholders; maintained zero student attrition across three years of tutoring.',
  },
  {
    id: 'adaptability',
    color: 'var(--soft-adaptability)',
    label: 'Adaptability',
    value: 0.9,
    evidence:
      'Delivered results across three randomly assigned bootcamp teams with different members each time, adapting to new collaborators and dynamics under time pressure.',
  },
  {
    id: 'budget',
    color: 'var(--soft-budget)',
    label: 'Budget ownership',
    value: 0.85,
    evidence:
      'Managed a ~1.7 billion KRW annual program budget, tracking spend against combined government and private funding sources.',
  },
  {
    id: 'crisis',
    color: 'var(--soft-conflict)',
    label: 'Conflict Resolution',
    value: 0.88,
    evidence:
      'De-escalated conflicts with upset parents over student performance concerns, preventing withdrawals while maintaining trust.',
  },
]

// Chart geometry, in viewBox units. The label ring sits outside the outer
// grid ring so the text never crosses the pentagon.
const VB = 420
const CX = VB / 2
const CY = VB / 2
const R = 148
// Pushed further out than the outer ring to clear body-sized labels: the
// text is set at 1rem+, so a tighter ring would put the text back over the
// pentagon's edge.
const LABEL_R = R * 1.18
const RINGS = [0.25, 0.5, 0.75, 1]
// Extra clearance in px between a label's box and its vertex, on top of the
// ring above — the ring is measured to the anchor point, not to the glyphs.
const LABEL_GAP = 10

// The apex label sits fully above its point rather than beside it, so the
// same ring and gap put it visibly further from the shape than the four
// that flank it. It gets its own, tighter pair.
const TOP_LABEL_R = R * 1.08
const TOP_LABEL_GAP = 3

// Apex up, then clockwise.
function pointAt(i, radius) {
  const a = (-90 + i * 72) * (Math.PI / 180)
  return { x: CX + Math.cos(a) * radius, y: CY + Math.sin(a) * radius }
}

function ringPath(scale) {
  return AXES.map((_, i) => {
    const p = pointAt(i, R * scale)
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
  }).join(' ')
}

const DATA_PATH = AXES.map((axis, i) => {
  const p = pointAt(i, R * axis.value)
  return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
}).join(' ')

// Which side of the chart a label sits on, so it grows away from the shape
// instead of overlapping it.
function anchorFor(i) {
  if (i === 0) return 'center'
  return i <= 2 ? 'start' : 'end'
}

// Below this width there is no room to ring the chart with body-sized
// labels — at 375px a label is nearly as wide as the whole pentagon, so
// they would sit on the shape and run past the band. The chart keeps the
// width to itself and the labels become a legend under it.
function useIsPhone() {
  const query = '(max-width: 620px)'
  const [phone, setPhone] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e) => setPhone(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return phone
}

export default function SoftSkills({ baseDelay = 0 }) {
  const reduceMotion = useReducedMotion()
  const inView = useContext(BandReveal)
  const phone = useIsPhone()
  // Index of the axis whose evidence is open in the modal, or null.
  const [openAt, setOpenAt] = useState(null)
  const openId = openAt === null ? null : AXES[openAt].id

  return (
    <motion.div
      className="radar"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: reduceMotion ? 0 : baseDelay,
            staggerChildren: reduceMotion ? 0 : 0.14,
          },
        },
      }}
    >
      <motion.div
        className="radar__chart"
        variants={{
          hidden: { opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.94 },
          visible: { opacity: 1, scale: 1, transition: { duration: reduceMotion ? 0 : 0.5, ease: 'easeOut' } },
        }}
      >
        {/* The stage is the square the chart is drawn in; the labels sit on
            the ring outside it and spill into the column's side padding. */}
        <div className="radar__stage">
        <svg viewBox={`0 0 ${VB} ${VB}`} className="radar__svg" role="img" aria-label="Soft skills radar chart">
          {RINGS.map((s) => (
            <polygon
              key={s}
              points={ringPath(s)}
              fill="none"
              stroke="var(--radar-grid)"
              strokeWidth="1"
            />
          ))}
          {AXES.map((axis, i) => {
            const p = pointAt(i, R)
            return (
              <line
                key={axis.id}
                x1={CX}
                y1={CY}
                x2={p.x}
                y2={p.y}
                stroke="var(--radar-grid)"
                strokeWidth="1"
              />
            )
          })}

          {/* Flat fill, flat stroke — no gradient, no shadow. */}
          <motion.polygon
            points={DATA_PATH}
            fill="var(--radar-fill)"
            stroke="var(--radar-line)"
            strokeWidth="2"
            strokeLinejoin="round"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : baseDelay + 0.15, ease: 'easeOut' }}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          />

          {AXES.map((axis, i) => {
            const p = pointAt(i, R * axis.value)
            const on = axis.id === openId
            return (
              <circle
                key={axis.id}
                cx={p.x}
                cy={p.y}
                r={on ? 7 : 4.5}
                fill={on ? axis.color : 'var(--card-bg)'}
                stroke={axis.color}
                strokeWidth="2"
              />
            )
          })}
        </svg>

        {/* Labels are real buttons layered over the chart rather than SVG
            text, so they get a focus ring, a hit area, and normal styling. */}
        {!phone &&
          AXES.map((axis, i) => {
            const anchor = anchorFor(i)
            const p = pointAt(i, anchor === 'center' ? TOP_LABEL_R : LABEL_R)
            const shift =
              anchor === 'center' ? `translate(-50%, calc(-100% - ${TOP_LABEL_GAP}px))`
              : anchor === 'start' ? `translate(${LABEL_GAP}px, -50%)`
              : `translate(calc(-100% - ${LABEL_GAP}px), -50%)`
            return (
              <button
                key={axis.id}
                type="button"
                className={`radar__label${axis.id === openId ? ' radar__label--on' : ''}`}
                aria-haspopup="dialog"
                onClick={() => setOpenAt(i)}
                style={{
                  '--axis-color': axis.color,
                  left: `${(p.x / VB) * 100}%`,
                  top: `${(p.y / VB) * 100}%`,
                  transform: shift,
                }}
              >
                {axis.label}
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Same buttons, same modal — just listed under the chart instead of
          ringed around it, where there is no room for them. */}
      {phone && (
        <motion.ul
          className="radar__legend"
          variants={{
            hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 12 },
            visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.45, ease: 'easeOut' } },
          }}
        >
          {AXES.map((axis, i) => (
            <li key={axis.id}>
              <button
                type="button"
                className={`radar__legend-item${axis.id === openId ? ' radar__legend-item--on' : ''}`}
                style={{ '--axis-color': axis.color }}
                aria-haspopup="dialog"
                onClick={() => setOpenAt(i)}
              >
                <span className="radar__legend-dot" aria-hidden="true" />
                {axis.label}
              </button>
            </li>
          ))}
        </motion.ul>
      )}

      <motion.p
        className="radar__hint"
        variants={{
          hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 12 },
          visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.45, ease: 'easeOut' } },
        }}
      >
        Select any point on the chart to see what backs it up.
      </motion.p>

      <EvidenceModal
        at={openAt}
        onClose={() => setOpenAt(null)}
        onStep={(delta) => setOpenAt((cur) => (cur + delta + AXES.length) % AXES.length)}
        reduceMotion={reduceMotion}
      />
    </motion.div>
  )
}

// Rendered into document.body rather than in place: the radar sits inside
// animated wrappers, and a transformed ancestor makes `position: fixed`
// resolve against that ancestor instead of the viewport.
function EvidenceModal({ at, onClose, onStep, reduceMotion }) {
  const cardRef = useRef(null)
  const isOpen = at !== null

  // Keyed on open/closed alone, deliberately: the callbacks below are fresh
  // on every render, and folding them in here would re-run this on each
  // navigation — pulling focus back out to the vertex mid-read.
  useEffect(() => {
    if (!isOpen) return
    const returnTo = document.activeElement
    cardRef.current?.focus()
    // Hands the caret back to the vertex that opened this, so closing
    // doesn't drop the reader at the top of the document.
    return () => returnTo?.focus?.()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onStep(-1)
      else if (e.key === 'ArrowRight') onStep(1)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose, onStep])

  if (!isOpen) return null
  const axis = AXES[at]

  return createPortal(
    <div className="radar-modal">
      <div className="radar-modal__backdrop" onClick={onClose} aria-hidden="true" />
      <motion.div
        className="radar-modal__card"
        ref={cardRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="radar-modal-title"
        style={{ '--axis-color': axis.color }}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' }}
      >
        <button type="button" className="radar-modal__close" onClick={onClose} aria-label="Close">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>

        <span className="radar-modal__eyebrow">Evidence</span>
        <h3 className="radar-modal__title" id="radar-modal-title">{axis.label}</h3>
        <p className="radar-modal__body">{axis.evidence}</p>

        <div className="radar-modal__nav">
          <button type="button" className="radar-modal__step" onClick={() => onStep(-1)} aria-label="Previous skill">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <span className="radar-modal__count">{at + 1} / {AXES.length}</span>
          <button type="button" className="radar-modal__step" onClick={() => onStep(1)} aria-label="Next skill">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  )
}
