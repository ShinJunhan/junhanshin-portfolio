import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// A bento grid rather than a row of identical cards: tile size carries meaning,
// so the project's headline number occupies the space its importance earns and
// the supporting ones sit around it.
//
// Which stat gets which size is a per-project decision — the most impressive
// number on one project is not the same kind of number on another — so it
// comes from the data as `size`, never from anything in here.
//
//   big     2 columns x 2 rows — one per project, the headline stat
//   wide    2 columns x 1 row  — reads better with horizontal room, usually
//                                because it carries a short qualifying phrase
//   square  1 x 1              — the default: a short number that needs no room
const SIZES = { big: 'big', wide: 'wide', square: 'square' }

// Keeps a hyphenated word ("Always-On", "add-on") whole and ties the last two
// words together, so a detail line or tooltip never ends on one word and never
// splits a word after its hyphen.
function unbroken(text) {
  if (!text) return text
  return text.replace(/(\w)-(\w)/g, '$1\u2011$2').replace(/ (?=\S+$)/, '\u00a0')
}

// An abbreviated label keeps its short form — the tiles have no room to spell
// "Mean Time to Detect" out — and carries the full term in a tooltip.
//
// The tooltip follows the cursor. It used to be anchored above the tile, which
// put the explanation of a word the reader was pointing at several centimetres
// away from where they were pointing, floating over the row above; on the top
// row it hung over the section heading. A tooltip's whole job is to be next to
// the thing it explains, and on a grid of tiles the thing it explains is a few
// characters inside one of them, not the tile.
//
// It is rendered into `document.body` through a portal and positioned `fixed`.
// Both are required: the sections are wrapped in scroll-reveal elements that
// carry a `transform`, and a transformed ancestor becomes the containing block
// for `position: fixed` descendants — the tooltip would have been positioned
// against the section rather than the viewport, which is the same bug in a
// different disguise.
//
// This is a styled tooltip rather than a native `title`. The browser's own
// takes about a second of stillness to appear and is easy to miss entirely, so
// the only immediate feedback was the help cursor, which read as a tooltip
// that showed a "?" and nothing else. The `sr-only` copy is what assistive
// tech gets, since the visible tooltip is pointer- and focus-only.
function Label({ metric }) {
  // Null when hidden, otherwise the viewport point to hang the tip off.
  const [at, setAt] = useState(null)

  // A fixed tooltip is positioned against the viewport, so a scroll moves the
  // tile out from under it and leaves it hanging over whatever arrives next —
  // the pointer never left the label, so nothing else would dismiss it.
  // Scrolling with a tooltip open means the reader has moved on.
  useEffect(() => {
    if (!at) return
    const dismiss = () => setAt(null)
    window.addEventListener('scroll', dismiss, { passive: true })
    window.addEventListener('resize', dismiss)
    return () => {
      window.removeEventListener('scroll', dismiss)
      window.removeEventListener('resize', dismiss)
    }
  }, [at])

  if (!metric.hint) return metric.label

  const track = (event) => setAt({ x: event.clientX, y: event.clientY })
  // A keyboard focus has no pointer to follow, so it anchors under the word
  // itself — the same relationship, arrived at a different way.
  const anchor = (event) => {
    const box = event.currentTarget.getBoundingClientRect()
    setAt({ x: box.left, y: box.bottom })
  }

  return (
    <span
      className="bento__abbr"
      tabIndex={0}
      onMouseEnter={track}
      onMouseMove={track}
      onMouseLeave={() => setAt(null)}
      onFocus={anchor}
      onBlur={() => setAt(null)}
    >
      {metric.label}
      {at &&
        createPortal(
          <span
            className="bento__tip"
            aria-hidden="true"
            style={{ '--tip-x': `${at.x}px`, '--tip-y': `${at.y}px` }}
          >
            {unbroken(metric.hint)}
          </span>,
          document.body
        )}
      <span className="sr-only">, {metric.hint}</span>
    </span>
  )
}

// A thin bar under a tile's sentence that shows how its total divides, for a
// wide tile whose two-line sentence would otherwise leave the bottom empty.
// `split` is [{ label, value, strong }]; each part's width is its share.
function Split({ parts }) {
  return (
    <span className="bento__split">
      <span className="bento__split-bar" aria-hidden="true">
        {parts.map((part) => (
          <span
            key={part.label}
            className={`bento__split-part${part.strong ? ' bento__split-part--strong' : ''}`}
            style={{ flexGrow: part.value }}
          />
        ))}
      </span>
      <span className="bento__split-keys">
        {parts.map((part) => (
          <span key={part.label}>
            {part.label} · {part.value}
          </span>
        ))}
      </span>
    </span>
  )
}

function Tile({ metric }) {
  const size = SIZES[metric.size] ?? 'square'

  return (
    <li className={`bento__tile bento__tile--${size}`}>
      <span className="bento__value">{metric.value}</span>
      <span className="bento__label">
        <Label metric={metric} />
      </span>
      {metric.detail && <span className="bento__detail">{unbroken(metric.detail)}</span>}
      {metric.split && <Split parts={metric.split} />}
    </li>
  )
}

// One drawn mark per metric for `metricsStyle: 'tiles'`, authored for that
// layout in one stroke weight. A metric names its mark with `art`; a name
// with no entry here simply draws nothing.
const ART = {
  stack: (
    <>
      <path d="M60 22 96 40 60 58 24 40Z" />
      <path d="M24 40v14l36 18 36-18V40" />
      <path d="M24 54v14l36 18 36-18V54" />
      <path d="M24 68v14l36 18 36-18V68" />
      <path d="M60 58v42" opacity=".5" />
    </>
  ),
  modules: (
    <>
      <rect x="22" y="22" width="34" height="34" rx="7" />
      <rect x="64" y="22" width="34" height="34" rx="7" />
      <rect x="22" y="64" width="34" height="34" rx="7" />
      <rect x="64" y="64" width="34" height="34" rx="7" strokeDasharray="4 4" />
      <path d="M56 39h8M39 56v8M81 56v8M56 81h8" />
    </>
  ),
  book: (
    <>
      <path d="M60 34c-10-7-24-8-36-5v58c12-3 26-2 36 5 10-7 24-8 36-5V29c-12-3-26-2-36 5Z" />
      <path d="M60 34v58" />
      <path d="M32 44h18M32 54h18M32 64h14M70 44h18M70 54h18M70 64h12" />
    </>
  ),
  bolt: (
    <>
      <circle cx="60" cy="60" r="36" />
      <path d="M66 30 50 62h14l-8 28 22-36H64l8-24Z" />
    </>
  ),
  hybrid: (
    <>
      <rect x="18" y="44" width="34" height="38" rx="5" />
      <path d="M18 56h34M18 68h34" />
      <circle cx="26" cy="50" r="1.6" />
      <circle cx="26" cy="62" r="1.6" />
      <path d="M76 70a14 14 0 1 1 6-27 18 18 0 0 1 32 8 12 12 0 0 1-2 19Z" transform="translate(-10 -2)" />
      <path d="M52 63h18" strokeDasharray="3 4" />
    </>
  ),
  bell: (
    <>
      <path d="M60 28c-14 0-22 10-22 24v14l-7 10h58l-7-10V52c0-14-8-24-22-24Z" />
      <path d="M53 82a7 7 0 0 0 14 0" />
      <path d="M92 40a26 26 0 0 1 6 14M28 40a26 26 0 0 0-6 14" />
    </>
  ),
}

// `metricsStyle: 'tiles'` is a different grid altogether, for a page that
// should not read like the team pages' bento: three columns, the headline
// metric a tall accent tile down the left, the others white, and a wide strip
// along the bottom. Every tile carries a drawn mark and a detail line that
// says what the number makes possible. Placement comes from each metric's
// `area` (tf, roles, pb, chaos, alerts, env), and `accent: true` fills the tile.
function MarkTile({ metric }) {
  return (
    <li
      className={`mtiles__tile${metric.accent ? ' mtiles__tile--accent' : ''}${metric.area === 'env' ? ' mtiles__tile--strip' : ''}`}
      style={{ gridArea: metric.area }}
    >
      {ART[metric.art] && (
        <svg
          className="mtiles__art"
          viewBox="0 0 120 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {ART[metric.art]}
        </svg>
      )}
      <span className="mtiles__value">{metric.value}</span>
      <span className="mtiles__label">{metric.label}</span>
      {metric.detail && <span className="mtiles__detail">{unbroken(metric.detail)}</span>}
    </li>
  )
}

// `metricsStyle: 'rows'` stacks rows of uneven widths, so the gaps between
// tiles never line up from top to bottom. `metricsRows` gives each row's
// column template (for example '1.6fr 1fr 1.25fr'), and the metrics fill the
// rows in order, one per column. Each number and its label share one line,
// the label sitting on the number's baseline like a unit, with the sentence
// underneath. `accent: true` fills a tile; `cards` ([{ title, text }]) swaps
// the sentence for a row of small cards.
function RowTile({ metric }) {
  return (
    <li className={`mrows__tile${metric.accent ? ' mrows__tile--accent' : ''}`}>
      <span className="mrows__head">
        <span className="mrows__value">{metric.value}</span>
        <span className="mrows__label">{metric.label}</span>
      </span>
      {metric.cards ? (
        <span className="mrows__cards">
          {metric.cards.map((card) => (
            <span className="mrows__card" key={card.title}>
              <span className="mrows__card-title">{card.title}</span>
              <span className="mrows__card-text">{card.text}</span>
            </span>
          ))}
        </span>
      ) : (
        metric.detail && <span className="mrows__detail">{unbroken(metric.detail)}</span>
      )}
    </li>
  )
}

function Rows({ project }) {
  let next = 0
  return (
    <div className="mrows">
      {project.metricsRows.map((columns) => {
        const count = columns.trim().split(/\s+/).length
        const metrics = project.metrics.slice(next, next + count)
        next += count
        return (
          <ul className="mrows__row" style={{ '--mrows-cols': columns }} key={columns}>
            {metrics.map((metric) => (
              <RowTile metric={metric} key={metric.label} />
            ))}
          </ul>
        )
      })}
    </div>
  )
}

// `metricsStyle: 'hero'` turns the big tile into a solid accent block and
// steps every number and label up a size. Opt-in per project: the bento is
// shared, and a page should only get the louder treatment when it asks.
//
// `metricsLarge` makes the square tiles' numbers bigger and justifies the
// detail lines, for a project whose small tiles would otherwise show a lot of
// empty space. Also opt-in.
//
// `metricsEven` lines the small tiles up with each other: their content starts
// at the top instead of the middle, their labels drop a size so each fits on
// one line, and their detail lines are justified. The big tile keeps its own
// centred layout, since it spans both rows.
export default function MetricsSection({ project }) {
  if (project.metricsStyle === 'rows') return <Rows project={project} />
  if (project.metricsStyle === 'tiles') {
    return (
      <ul className="mtiles">
        {project.metrics.map((metric) => (
          <MarkTile metric={metric} key={metric.label} />
        ))}
      </ul>
    )
  }
  const style = project.metricsStyle === 'hero' ? ' bento--hero' : ''
  const large = project.metricsLarge ? ' bento--large' : ''
  const even = project.metricsEven ? ' bento--even' : ''
  return (
    <ul className={`bento${style}${large}${even}`}>
      {project.metrics.map((metric) => (
        <Tile metric={metric} key={metric.label} />
      ))}
    </ul>
  )
}
