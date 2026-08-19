// Concept marks for the Technical Decisions card. Drawn, one stroke weight,
// one viewBox — never an emoji or a stock icon standing in for a diagram.
//
// A decision names its mark with `glyph` in the data, so this file holds no
// per-project knowledge: it is a vocabulary, and the project picks from it.
// An unknown or missing name falls back to `note`, which says "a decision"
// without pretending to illustrate one.

const COMMON = {
  viewBox: '0 0 64 64',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

// Traffic leaving a private subnet through a single translating hop.
function Route(props) {
  return (
    <svg {...COMMON} {...props}>
      <rect x="4" y="18" width="20" height="28" rx="2.5" />
      <circle cx="14" cy="27" r="2.4" />
      <circle cx="14" cy="37" r="2.4" />
      <path d="M24 32h9" />
      <rect x="27" y="26" width="12" height="12" rx="2.5" />
      <path d="M39 32h7" />
      <path d="M46 26.5a7 7 0 0 1 0 11h9a5 5 0 0 0 0-11 8 8 0 0 0-9 0z" />
      <path d="M42.5 28.5 46 32l-3.5 3.5" />
    </svg>
  )
}

// A process table with one row picked out exactly and the rest left alone.
function Process(props) {
  return (
    <svg {...COMMON} {...props}>
      <rect x="7" y="12" width="50" height="40" rx="3" />
      <path d="M7 21h50" />
      <path d="M14 29h16M14 37h22M14 45h12" />
      <path d="M40 29h10M44 45h6" />
      <circle cx="45" cy="37.5" r="7.5" />
      <path d="M42 34.5l6 6M48 34.5l-6 6" />
    </svg>
  )
}

// One feed splitting into two, so each can be read on its own.
function Channels(props) {
  return (
    <svg {...COMMON} {...props}>
      <path d="M8 32h12c6 0 6-12 12-12h10" />
      <path d="M8 32h12c6 0 6 12 12 12h10" />
      <circle cx="8" cy="32" r="3" />
      <rect x="42" y="13" width="15" height="14" rx="2.5" />
      <rect x="42" y="37" width="15" height="14" rx="2.5" />
      <path d="M46 20h7M46 44h7" />
    </svg>
  )
}

// Three lanes with work merging forward through a single gate.
function Branch(props) {
  return (
    <svg {...COMMON} {...props}>
      <path d="M12 14h24c6 0 6 18 12 18" />
      <path d="M12 50h24c6 0 6-18 12-18" />
      <path d="M12 32h36" />
      <circle cx="12" cy="14" r="3" />
      <circle cx="12" cy="32" r="3" />
      <circle cx="12" cy="50" r="3" />
      <circle cx="51" cy="32" r="4.5" />
    </svg>
  )
}

// The default: a decision, not an illustration of one.
function Note(props) {
  return (
    <svg {...COMMON} {...props}>
      <path d="M18 10h20l12 12v32a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3z" />
      <path d="M38 10v12h12" />
      <path d="M23 34h18M23 42h12" />
    </svg>
  )
}

const GLYPHS = {
  route: Route,
  process: Process,
  channels: Channels,
  branch: Branch,
  note: Note,
}

export default function DecisionGlyph({ name, ...props }) {
  const Mark = GLYPHS[name] ?? GLYPHS.note
  return <Mark {...props} />
}
