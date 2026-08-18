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
// This is a styled tooltip rather than a native `title`. The browser's own
// takes about a second of stillness to appear and is easy to miss entirely,
// so the only immediate feedback was the help cursor, which read as a tooltip
// that showed a "?" and nothing else. The `sr-only` copy is what assistive
// tech gets, since the visible tooltip is hover-only.
function Label({ metric }) {
  if (!metric.hint) return metric.label

  return (
    <span className="bento__abbr" tabIndex={0}>
      {metric.label}
      <span className="bento__tip" aria-hidden="true">
        {metric.hint}
      </span>
      <span className="sr-only"> — {metric.hint}</span>
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
