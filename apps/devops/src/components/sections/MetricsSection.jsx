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
            {metric.hint}
          </span>,
          document.body
        )}
      <span className="sr-only">, {metric.hint}</span>
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
      {metric.detail && <span className="bento__detail">{metric.detail}</span>}
    </li>
  )
}

export default function MetricsSection({ project }) {
  return (
    <ul className="bento">
      {project.metrics.map((metric) => (
        <Tile metric={metric} key={metric.label} />
      ))}
    </ul>
  )
}
