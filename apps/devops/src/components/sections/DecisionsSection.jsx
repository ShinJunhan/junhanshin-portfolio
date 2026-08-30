import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import RichText from '../../lib/richText.jsx'
import DecisionGlyph from './decisionGlyphs.jsx'

// A trade-off is only legible next to the thing that lost, so each decision
// states both sides before the reasoning, where there is a competing option to
// name. Some choices are a way of working rather than a fork, and those leave
// `over` unset and simply state what was chosen.
//
// The deck is picked from a column of keyword bubbles on the left. A bubble
// carries the short name of the decision; opening it states the decision in
// one sentence and deals the matching card onto the stage on the right, with
// the argument for it underneath.
//
// This replaced a crescent of numbered circles. The numbers were an index with
// nothing to index by: reaching decision nine meant clicking a 9 and finding
// out what it was, so the reader could not choose what to read next. A keyword
// is the thing a reader is actually selecting.
//
// This is emphatically NOT a modal. There is no overlay, no backdrop, no close
// button and no focus trap. The card is part of the page, and the reader can
// scroll past it or ignore it at any moment.

// The card being read, and the one on its way off the stage. The leaving card
// is decoration: it is aria-hidden, inert, and removed on a timer rather than
// on an animation event, so a frame that never composites cannot leave two
// faces stacked on the stage.
const LEAVE_MS = 520

// ── Sizing the bubbles ─────────────────────────────────────────────────────
//
// `text-wrap: balance` decides where the sentence breaks, and it is what stops
// one word being stranded on a second line. What it cannot do is give the
// width back: a balanced two-line sentence occupied 197 to 222px inside a
// 312px panel, so every open bubble carried 90 to 115px of empty right side.
//
// So each bubble carries three measured widths as custom properties:
// `--pill-w`, its collapsed keyword; `--bub-w`, its longest balanced line plus
// the panel's gutters; and `--say-w`, that longest line on its own. Opening one
// is then a single outward movement from the first to the second.
//
// `--say-w` is what stops the sentence re-wrapping on the way. The paragraph
// used to be laid out inside the box that was animating, so across those 320ms
// it reflowed from four lines to three to two while `balance` re-solved the
// break points at every intermediate width. Fixing the paragraph's width lays
// it out once, in its final shape, and the box travels around it.
//
// Measuring BOTH is what makes the movement read as one thing. The closed item
// used to span the column with only the pill inside it drawn narrow, so the
// width transition ran from the column inward while the pill ran outward, and
// the bubble visibly flashed full width before snapping back. Two opposing
// motions over the same 320ms.
//
// It also means neither state depends on an intrinsic keyword, so the
// animation is the same in every browser rather than snapping wherever
// `interpolate-size` is unsupported.
//
// This is the one place in the section that measures layout, and it runs on
// mount and when the column changes width rather than per selection or per
// frame.

// The rendered lines of an element, as boxes. Grouped by vertical centre with
// a tolerance of half a line, because an inline `<code>` span sits a pixel or
// two off its neighbours' baseline box and grouping on `top` alone splits one
// line into several.
function lineBoxes(el) {
  const range = document.createRange()
  range.selectNodeContents(el)
  const tolerance = (parseFloat(getComputedStyle(el).lineHeight) || 16) / 2
  const rows = []

  for (const rect of [...range.getClientRects()].sort((a, b) => a.top - b.top)) {
    if (rect.width === 0 && rect.height === 0) continue
    const middle = rect.top + rect.height / 2
    const row = rows.find((r) => Math.abs(r.middle - middle) < tolerance)
    if (row) {
      row.left = Math.min(row.left, rect.left)
      row.right = Math.max(row.right, rect.right)
    } else {
      rows.push({ middle, left: rect.left, right: rect.right })
    }
  }
  return rows
}

export default function DecisionsSection({ project }) {
  const decisions = project.decisions ?? []
  // Two pieces of state, not one. `at` is the decision on the stage and `open`
  // is whether its bubble is showing the sentence, because clicking the open
  // bubble closes it without emptying the stage. A card is always dealt: an
  // empty stage would be a hole in the page rather than a resting state.
  const [at, setAt] = useState(0)
  const [open, setOpen] = useState(true)
  const [leaving, setLeaving] = useState(null)
  const listRef = useRef(null)

  const select = useCallback(
    (next) => {
      if (next === at) {
        setOpen((current) => !current)
        return
      }
      setLeaving(at)
      setAt(next)
      setOpen(true)
    },
    [at]
  )

  useEffect(() => {
    if (leaving === null) return
    const timer = setTimeout(() => setLeaving(null), LEAVE_MS)
    return () => clearTimeout(timer)
  }, [leaving])

  // Measure every bubble's two widths. Runs before paint, so a bubble is never
  // seen at a width it is about to leave.
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    let live = true

    // The column's width at the last measurement, so a ResizeObserver firing
    // for a height change does not re-measure anything.
    let measuredAt = 0

    const measure = () => {
      if (!live) return
      const items = [...list.querySelectorAll('.bub__item')]
      if (items.length === 0) return
      measuredAt = list.getBoundingClientRect().width

      // Nothing animates while the measurement runs. Without this the reads
      // below return whatever the running transition is part-way through, and
      // a candidate width would be checked against the layout it replaced.
      list.dataset.measuring = 'true'

      // Back to the column's width, so `balance` picks its break points with
      // room to pick them in and each pill sits at its own content width.
      for (const item of items) {
        item.style.removeProperty('--pill-w')
        item.style.removeProperty('--bub-w')
        item.style.removeProperty('--say-w')
        item.style.removeProperty('width')
      }

      for (const item of items) {
        const say = item.querySelector('.bub__say')
        const button = item.querySelector('.bub__btn')
        const label = item.querySelector('.bub__label')
        const inner = item.querySelector('.bub__inner')
        if (!say || !button || !label || !inner) continue

        // The keyword, its numeral, the mark and the padding around them.
        const pill = Math.ceil(
          label.getBoundingClientRect().right -
            button.getBoundingClientRect().left +
            parseFloat(getComputedStyle(button).paddingRight)
        )

        const lines = lineBoxes(say)
        if (lines.length === 0) continue
        const gutters = getComputedStyle(inner)
        const widest = Math.ceil(Math.max(...lines.map((row) => row.right - row.left)))
        const sentence =
          widest + parseFloat(gutters.paddingLeft) + parseFloat(gutters.paddingRight)
        // Never narrower than the keyword it is labelled with.
        const open = Math.ceil(Math.max(sentence, pill))

        // A narrower box lets `balance` re-partition, and a partition that
        // needs one more line would be worse than the space it saved. Try the
        // candidate before committing to it. This has to happen before
        // `--say-w` is applied, because a fixed-width paragraph cannot
        // re-partition and the check would pass on every candidate.
        item.style.width = `${open}px`
        const fits = lineBoxes(say).length <= lines.length
        item.style.removeProperty('width')

        item.style.setProperty('--pill-w', `${pill}px`)
        item.style.setProperty('--say-w', `${widest}px`)
        if (fits) item.style.setProperty('--bub-w', `${open}px`)
      }

      // Commit the new widths while transitions are still off, so the
      // measurement itself never animates. Reading a box forces that flush.
      list.getBoundingClientRect()
      delete list.dataset.measuring
    }

    measure()

    // Watch the column rather than the window. The rail folds away without a
    // window resize and takes 284px of the column with it, and a `resize`
    // listener alone would never hear about it. The window listener stays as a
    // second signal; `measuredAt` makes the duplicate call a no-op.
    const remeasure = () => {
      if (Math.abs(list.getBoundingClientRect().width - measuredAt) > 0.5) measure()
    }
    const observer = new ResizeObserver(remeasure)
    observer.observe(list)
    window.addEventListener('resize', remeasure)

    // A web font landing after first paint changes every line box under it,
    // and changes no width either of those is watching.
    document.fonts?.ready.then(measure)

    return () => {
      live = false
      observer.disconnect()
      window.removeEventListener('resize', remeasure)
    }
  }, [decisions])

  // Moves the selection and takes the focus with it, so the arrow keys walk
  // the column the way they walk a list. Scoped to the bubbles, never to the
  // document: this must not take the arrow keys away from the page.
  // The arrows always open what they land on. Stepping is a way of reading
  // through the deck, so it would be strange for one to close a bubble.
  const step = useCallback(
    (delta) => {
      const next = (at + delta + decisions.length) % decisions.length
      if (next !== at) {
        setLeaving(at)
        setAt(next)
      }
      setOpen(true)
      listRef.current?.querySelectorAll('.bub__btn')[next]?.focus()
    },
    [at, decisions.length]
  )

  const onKeyDown = useCallback(
    (event) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
      event.preventDefault()
      step(event.key === 'ArrowDown' ? 1 : -1)
    },
    [step]
  )

  if (decisions.length === 0) return null

  const decision = decisions[at]

  return (
    <div className="decisions">
      {/* The stepper, in a gutter of its own. It is the only control that says
          the bubbles are a sequence rather than a set of unrelated switches. */}
      <div className="dstep">
        <button
          type="button"
          className="dstep__arrow"
          onClick={() => step(-1)}
          aria-label="Previous decision"
        >
          <Chevron up />
        </button>
        <button
          type="button"
          className="dstep__arrow"
          onClick={() => step(1)}
          aria-label="Next decision"
        >
          <Chevron />
        </button>
      </div>

      <ul className="bub" ref={listRef} onKeyDown={onKeyDown}>
        {decisions.map((item, index) => {
          const current = index === at
          const showing = current && open
          return (
            <li
              className="bub__item"
              key={item.keyword ?? item.title}
              data-open={showing}
              // Kept apart from `data-open` so a closed bubble can still say
              // which card is on the stage.
              data-current={current}
            >
              <button
                type="button"
                className="bub__btn"
                aria-expanded={showing}
                aria-controls={`decision-say-${index}`}
                onClick={() => select(index)}
              >
                <span className="bub__mark" aria-hidden="true">
                  <Plus />
                </span>
                <span className="bub__num">{String(index + 1).padStart(2, '0')}</span>
                <span className="bub__label">
                  <RichText>{item.keyword ?? item.title}</RichText>
                </span>
              </button>

              {/* Rows of 0fr to 1fr, so the panel opens without anyone
                  measuring a height. The sentence stays in the DOM while
                  closed, which is why the pill above it carries the
                  `fit-content` rather than this item: sizing the item to its
                  content measures the hidden sentence, and every bubble comes
                  out as wide as its description instead of its keyword. */}
              <div className="bub__wrap">
                <div className="bub__body">
                  <div className="bub__inner">
                    <p className="bub__say" id={`decision-say-${index}`}>
                      <RichText>{item.title}</RichText>
                    </p>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="dstage" aria-live="polite">
        <div className="dcard">
          {/* The rest of the deck, faint and fanned behind the live card. The
              column was one card floating in a lot of white; the stack says
              how many decisions there are without asking anyone to read them.
              Depth only: no content, and out of the a11y tree. */}
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

          {/* The window carries the card's proportions, a fixed 5:7, the shape
              of an actual trading card. Every decision is therefore the same
              object and the fan behind it reads as one stack rather than as
              paper of assorted sizes. Both faces can be absolute against it
              because the aspect ratio, not the content, gives it a height. */}
          <div className="dcard__window">
            {leaving !== null && leaving !== at && (
              <Face
                key={`leaving-${leaving}`}
                index={leaving}
                total={decisions.length}
                decision={decisions[leaving]}
                variant="leaving"
              />
            )}
            <Face key={at} index={at} total={decisions.length} decision={decision} variant="live" />
          </div>
        </div>

        {/* The argument, under the card rather than inside it.

            This is the split that lets the card be a card. The reasoning runs
            to 400 to 700 characters, and no box at trading-card proportions
            holds that at any width worth having. So the card keeps the
            decision, which is what was chosen and what was turned down, and
            the block beneath it takes the case for it. */}
        <div className="dwhy">
          <p className="dwhy__label" aria-hidden="true">
            Why
          </p>
          <p className="dwhy__text" key={at}>
            <RichText>{decision.why}</RichText>
          </p>
        </div>
      </div>
    </div>
  )
}

function Plus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function Chevron({ up = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={up ? 'M5 15l7-7 7 7' : 'M5 9l7 7 7-7'} />
    </svg>
  )
}

// Both directions slide upward: the card being read leaves through the top
// while the next one rises into its place, so a run through the decisions
// reads as one continuous movement rather than as a shuffle.
const FACE_CLASS = {
  live: ' dcard__face--arriving',
  leaving: ' dcard__face--leaving',
}

// The card face, built as a card rather than as a panel that happens to have a
// border: a name, a picture, a stat block, and a set number. Those four are
// what make the metaphor legible without anyone having to be told it.
//
// The name is the keyword the bubble is labelled with, so the two read as the
// same object. The sentence form of the decision lives in the bubble, and the
// reasoning is deliberately not here at all. See the `dwhy` block above.
function Face({ index, total, decision, variant = 'live' }) {
  return (
    <article
      className={`dcard__face${FACE_CLASS[variant]}`}
      aria-hidden={variant === 'leaving' ? 'true' : undefined}
      inert={variant === 'leaving' ? '' : undefined}
    >
      <header className="dcard__head">
        <span className="dcard__index">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="dcard__title">
          <RichText>{decision.keyword ?? decision.title}</RichText>
        </h3>
      </header>

      {/* The art box. A tinted panel rather than a band between two rules, and
          the one element that flexes: a card whose stat block is short gets a
          larger picture, which is what a picture box is for, instead of
          leaving a pocket of empty card under the last line. */}
      <div className="dcard__art">
        <DecisionGlyph name={decision.glyph} />
      </div>

      {/* Labelled rows, not a sentence. "Chose X over Y" read as prose and so
          did the paragraph under it; as two named fields it reads as a record,
          which is the whole claim the card is making about itself. */}
      <dl className="dcard__stat">
        <dt className="dcard__stat-key">Chose</dt>
        <dd className="dcard__stat-val">
          <RichText>{decision.chose}</RichText>
        </dd>
        {decision.over && (
          <>
            <dt className="dcard__stat-key">Over</dt>
            <dd className="dcard__stat-val dcard__stat-val--over">
              <RichText>{decision.over}</RichText>
            </dd>
          </>
        )}
      </dl>

      <p className="dcard__foot" aria-hidden="true">
        Trade-off {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </p>
    </article>
  )
}
