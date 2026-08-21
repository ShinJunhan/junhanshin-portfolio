import { useCallback, useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import RichText from '../../lib/richText.jsx'
import DecisionGlyph from './decisionGlyphs.jsx'

// A trade-off is only legible next to the thing that lost, so each decision
// states both sides before the reasoning — where there is a competing option
// to name. Some choices are a way of working rather than a fork, and those
// leave `over` unset and simply state what was chosen.
//
// The decisions are picked from a crescent of numbered circles down the left
// edge and read in a single card on the right. Four dense trade-offs stacked
// as four bordered panels competed with each other and with everything below
// them; one at a time, chosen deliberately, is the right density for this.
//
// This is emphatically NOT a modal. There is no overlay, no backdrop, no
// close button and no focus trap — the card is part of the page, and the
// reader can scroll past it or ignore it at any moment.

// The numbers sit next to each other with no blanks between them — spacing
// alone separates them. Blanks appear only beyond the ends of the run, where
// the arc would otherwise stop abruptly at whichever number happens to be
// last.
const NUMBERED_EVERY = 1
const CENTRE_SLOT_PAD = 1 // blank slots kept beyond each end of the run

// The crescent: x bulges rightward at the centre and tucks back to the edge
// at both ends, so the circles at the extremes hang over the section's left
// boundary and the middle ones lean in.
//
// Vertical placement is a share of the panel, bounded, rather than a raw
// pixel step: a fixed step carried the far end of the run past the container
// and over the neighbouring section's text.
//
// Numbers and blanks are spaced by different rules, which is what lets the
// arc carry a long faded tail without the numbers bunching. The numbers get a
// constant step wide enough to clear a selected circle against its neighbour.
// Past them the blanks continue on a decaying step and shrink as they go, so
// the tail converges instead of marching — the arc's edge fills in, and the
// total can never reach the container's boundary however many blanks there
// are. A single step for everything cannot do both: widen it and the tail
// escapes, narrow it and the numbers collide.
// The step between adjacent numbers, as a % of the panel's height. This is a
// *ceiling*, not the value: it is what four decisions get, and it is already
// the tightest spacing a full-size circle can take against a selected
// neighbour without touching.
const NUM_STEP_MAX = 12.8
// How far from the centre the furthest slot may sit. Every position is
// relative to the selected circle, so with the *first* decision selected the
// last one sits a full run below centre — and the run has to end inside the
// panel. It did not: at seven decisions the fixed step put the last two
// numbers at 101% and 114%, hanging over the section below. The step now
// divides this budget by however many numbers there are, so the arc fits any
// number of decisions by getting tighter rather than by escaping.
//
// 46.7 is chosen so that four decisions still resolve to exactly NUM_STEP_MAX
// and the pages that already existed are pixel-identical.
const RUN_BUDGET = 46.7
// The first blank sits further out than the gaps between numbers do: it has
// to clear a full-size number against a smaller circle. Stated as a ratio of
// the step rather than as a constant, because the step is no longer one — at
// four decisions this reproduces the 8.3 it used to be.
const TAIL_RATIO = 0.649
const TAIL_DECAY = 0.6 // each further blank advances less than the last
const BLANK_DECAY = 0.74 // …and is smaller than the last
const BULGE_X = 54 // px, at the widest point of the oval
// The circles shrink with the step, so a tight run never collides. Below the
// ceiling the size is derived from the step in CSS — see `--pip-size`, which
// is a fraction of the arc's own height rather than a measured pixel value,
// so nothing here has to observe the layout to stay correct.
const PIP_CEILING = '3rem'
// Clearance between two adjacent circles, before the selected one grows.
// Worked back from the worst pair — a selected circle at SELECTED_SCALE
// against its full-size neighbour — which is what actually decides whether
// the run reads as separate marks. At 6 it left 3.6px between them.
const PIP_GAP = 7

// The step for a given number of decisions, and the horizontal sweep that
// goes with it. The sweep has to be normalised against the run's real extent
// — a fixed figure would have flattened the ellipse as the step shrank.
function geometry(count) {
  const reach = Math.max(1, count - 1)
  const step = Math.min(NUM_STEP_MAX, RUN_BUDGET / (reach + TAIL_RATIO))
  const tailStep = step * TAIL_RATIO
  return { reach, step, tailStep, spanMax: reach * step + tailStep }
}

// The panel grows for a long run rather than shrinking the circles to fit it,
// because purely tightening the step got seven decisions into the arc at 27px
// — small enough that the run read as a scrollbar rather than as the numbered
// selector it is.
//
// But height is not free either. At 5.9rem an item the seven-decision arc ran
// 661px against a 462px card, and the section was mostly the empty column
// beside the deck. This is the settled trade: the arc lands near the card's
// own height, and the circles stay half again the size that was too small.
// Both goals cannot be fully met at once — a run that always centres its
// selection needs vertical room in proportion to how long it is and how big
// its marks are, and with seven decisions two of those three have to give.
//
// Four decisions land under the floor and keep the height and the 48px circles
// they always had.
const ARC_MIN_REM = 28.5
const ARC_PER_ITEM_REM = 4.9

function arcHeight(count) {
  return `${Math.max(ARC_MIN_REM, count * ARC_PER_ITEM_REM).toFixed(2)}rem`
}

// The selected circle grows as well as centring itself: size is what marks it
// as chosen while it is moving, before it has arrived anywhere meaningful.
// 1.14 rather than 1.18: the growth is what sets the tightest clearance in the
// whole run, and the four points it gives back buy real circle size at every
// panel height. It still reads as chosen — nothing else in the arc grows.
const SELECTED_SCALE = 1.14

// Auto-cycle, matching the Tech Stack wheel on the same page so the two
// sections behave alike.
const CYCLE_MS = 5200
const RESUME_MS = 9000

// Position is written as plain inline style and eased by a CSS transition,
// not driven by an animation loop. The resting layout is then correct the
// instant it renders — a frame that never composites (a background tab, a
// paused rAF) leaves the circles where they belong rather than stranded at
// the previous selection. The transition is what animates; the style is what
// is true. `prefers-reduced-motion` drops the transition in CSS.
// Distance from the selected circle, in % of the panel: a constant step while
// we are still among the numbers, then a decaying one for the blank tail.
function offsetToSpan(steps, numberReach, step, tailStep) {
  const within = Math.min(steps, numberReach)
  let span = within * step
  for (let k = 0; k < steps - numberReach; k += 1) {
    span += tailStep * TAIL_DECAY ** k
  }
  return span
}

function slotStyle(offset, { reach: numberReach, step, tailStep, spanMax }, selected, blank) {
  const steps = Math.abs(offset)
  const span = offsetToSpan(steps, numberReach, step, tailStep)
  const beyond = Math.max(0, steps - numberReach)
  // The tail shrinks as it recedes. That is what lets it be packed tightly
  // enough to close the gap at the arc's edge without the dots touching.
  const scale = selected
    ? SELECTED_SCALE
    : blank
      ? BLANK_DECAY ** beyond
      : 1 - Math.min(steps / Math.max(numberReach, 1), 1) * 0.12
  // A true half-ellipse rather than the parabola this used to trace: x is the
  // ellipse's width at this height, so the run reads as one oval edge instead
  // of a slack curve, and the ends tuck in sharply against the boundary.
  const t = Math.min(1, span / spanMax)
  return {
    top: `${50 + Math.sign(offset) * span}%`,
    left: `${BULGE_X * Math.sqrt(Math.max(0, 1 - t * t))}px`,
    '--pip-scale': scale.toFixed(3),
  }
}

export default function DecisionsSection({ project }) {
  const decisions = project.decisions ?? []
  const reduceMotion = useReducedMotion()
  // Inline, so something is always shown: an empty card would be a hole in
  // the page rather than an invitation.
  // Auto-cycle, pause on interaction, resume when the reader goes quiet —
  // the same three pieces of state the Tech Stack wheel uses, in the same
  // priority order. `pinned` is what a click sets; `cycle` is the ambient
  // state it overrides.
  const [cycle, setCycle] = useState(0)
  const [pinned, setPinned] = useState(null)
  const [hovering, setHovering] = useState(false)
  // Bumped on every interaction so the idle timer restarts. A plain boolean
  // could not tell "still interacting" from "interacted once".
  const [interactionAt, setInteractionAt] = useState(0)
  const at = pinned ?? cycle
  // The card that is leaving. Purely decorative: it is aria-hidden, inert,
  // and removed on a timer rather than on an animation event, so a frame that
  // never composites cannot leave faces stacked on the card. The card that is
  // *staying* is always rendered in its normal resting position — the slide
  // is an animation over that, never the thing that puts it there.
  const [leaving, setLeaving] = useState(null)

  const select = useCallback(
    (next) => {
      setInteractionAt(Date.now())
      setPinned(next)
      setCycle(next)
      setLeaving((current) => (next === at ? current : at))
    },
    [at]
  )

  useEffect(() => {
    if (leaving === null) return
    const timer = setTimeout(() => setLeaving(null), 520)
    return () => clearTimeout(timer)
  }, [leaving])

  const paused = pinned !== null || hovering

  useEffect(() => {
    if (reduceMotion || paused || decisions.length < 2) return

    const timer = setInterval(() => {
      setCycle((index) => {
        const next = (index + 1) % decisions.length
        setLeaving(index)
        return next
      })
    }, CYCLE_MS)
    return () => clearInterval(timer)
  }, [reduceMotion, paused, decisions.length])

  // A pinned decision releases itself once the reader stops interacting, so
  // the arc returns to cycling rather than staying frozen on whatever was
  // last clicked.
  useEffect(() => {
    if (pinned === null) return
    const timer = setTimeout(() => setPinned(null), RESUME_MS)
    return () => clearTimeout(timer)
  }, [pinned, interactionAt])

  const onKeyDown = useCallback(
    (e) => {
      // Scoped to the selector, never to the document: this must not take the
      // arrow keys away from the page the way a modal would.
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
      e.preventDefault()
      const delta = e.key === 'ArrowDown' ? 1 : -1
      const next = (at + delta + decisions.length) % decisions.length
      select(next)
      e.currentTarget
        .querySelectorAll('.arc__pip--live')
        [next]?.focus()
    },
    [at, decisions.length, select]
  )

  if (decisions.length === 0) return null

  // Slot layout: numbered circles every other slot, blanks between and beyond.
  const runLength = (decisions.length - 1) * NUMBERED_EVERY + 1
  const totalSlots = runLength + CENTRE_SLOT_PAD * 2
  const selectedSlot = CENTRE_SLOT_PAD + at * NUMBERED_EVERY
  // Spacing among the numbers depends only on how many numbers there are, so
  // adding blanks to the tail can never squeeze them.
  const geo = geometry(decisions.length)

  const decision = decisions[at]

  return (
    <div
      className="decisions"
      // Hovering anywhere over the pair holds the cycle. The card is long-form
      // text, and swapping it out from under someone mid-sentence is worse
      // than a wheel changing category.
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className="arc"
        role="tablist"
        aria-label="Technical decisions and design trade-offs"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        // The circle size rides the step so a tighter run cannot collide.
        // Expressed against the arc's own height rather than measured, so it
        // is right on the first paint and stays right through a resize.
        style={{
          '--arc-h': arcHeight(decisions.length),
          '--pip-size': `min(${PIP_CEILING}, calc(var(--arc-h) * ${(
            geo.step / 100
          ).toFixed(5)} - ${PIP_GAP}px))`,
        }}
      >
        {Array.from({ length: totalSlots }, (_, slot) => {
          const numberedIndex =
            (slot - CENTRE_SLOT_PAD) % NUMBERED_EVERY === 0
              ? (slot - CENTRE_SLOT_PAD) / NUMBERED_EVERY
              : null
          const live =
            numberedIndex !== null &&
            numberedIndex >= 0 &&
            numberedIndex < decisions.length

          // Every circle is placed relative to the selected one, so choosing
          // a number carries the whole crescent with it.
          const isOn = live && numberedIndex === at
          const style = slotStyle(slot - selectedSlot, geo, isOn, !live)
          const className = `arc__pip${live ? ' arc__pip--live' : ' arc__pip--blank'}${
            isOn ? ' arc__pip--on' : ''
          }`

          if (!live) {
            return (
              <span key={`blank-${slot}`} className={className} style={style} aria-hidden="true" />
            )
          }

          return (
            <button
              key={decisions[numberedIndex].title}
              type="button"
              role="tab"
              aria-selected={isOn}
              tabIndex={isOn ? 0 : -1}
              onClick={() => select(numberedIndex)}
              className={className}
              style={style}
            >
              <span className="arc__digit">{numberedIndex + 1}</span>
              <span className="sr-only">{decisions[numberedIndex].title}</span>
            </button>
          )
        })}
      </div>

      <div className="dcard" role="tabpanel" aria-live="polite">
        {/* The rest of the deck, faint and fanned behind the live card. The
            column was one card floating in a lot of empty white; the stack
            says how many decisions there are without asking anyone to read
            them. Depth only — no content, and out of the a11y tree. */}
        <div
          /* Keyed on the selection so the riffle replays on every deal. */
          key={`deck-${at}`}
          className="dcard__stack dcard__stack--riffling"
          aria-hidden="true"
        >
          {decisions.slice(1).map((_, i) => (
            <span key={i} className="dcard__ghost" style={{ '--depth': i + 1 }} />
          ))}
        </div>

        <div className="dcard__window">
          {/* Every card, stacked in one grid cell and hidden. It contributes
              nothing but height — which is the point: the window ends up as
              tall as the *longest* decision, so all four cards are the same
              size instead of each shrinking to its own text. Measuring in JS
              would work too, and would go stale the moment the copy changed. */}
          <div className="dcard__sizer" aria-hidden="true" inert="">
            {decisions.map((d, i) => (
              <Face key={`sizer-${i}`} index={i} decision={d} variant="sizer" />
            ))}
          </div>

          {leaving !== null && leaving !== at && (
            <Face
              key={`leaving-${leaving}`}
              index={leaving}
              decision={decisions[leaving]}
              variant="leaving"
            />
          )}
          <Face key={at} index={at} decision={decision} variant="live" />
        </div>
      </div>
    </div>
  )
}

// Both directions slide upward: the card being read leaves through the top
// while the next one rises into its place, so a run through the decisions
// reads as one continuous movement rather than as a shuffle.
// `sizer` is the one that stays in flow: it is what gives the window its
// height. The live and leaving cards are taken out of flow on top of it, so
// they fill whatever the tallest decision established.
const FACE_CLASS = {
  live: ' dcard__face--arriving',
  leaving: ' dcard__face--leaving',
  sizer: '',
}

function Face({ index, decision, variant = 'live' }) {
  return (
    <article
      className={`dcard__face${FACE_CLASS[variant]}`}
      aria-hidden={variant === 'leaving' ? 'true' : undefined}
      inert={variant === 'leaving' ? '' : undefined}
    >
      <header className="dcard__head">
        <span className="dcard__index">{index + 1}</span>
        <h3 className="dcard__title">
          <RichText>{decision.title}</RichText>
        </h3>
      </header>

      <div className="dcard__figure">
        <DecisionGlyph name={decision.glyph} />
      </div>

      <div className="dcard__body">
        <p className="decision__choice">
          <span className="decision__chose">
            <RichText>{decision.chose}</RichText>
          </span>
          {decision.over && (
            <span className="decision__over">
              {' over '}
              <RichText>{decision.over}</RichText>
            </span>
          )}
        </p>
        <p className="decision__why">
          <RichText>{decision.why}</RichText>
        </p>
      </div>
    </article>
  )
}
