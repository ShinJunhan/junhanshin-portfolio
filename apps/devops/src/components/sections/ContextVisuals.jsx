// The small pictures beside each note on the `pinned` board (Midam). Each one
// restates its note's key fact so a reader scanning the board gets the point
// before reading the sentences. All colours come from theme tokens, so they
// follow dark mode.

const tint = (pct) => `color-mix(in srgb, var(--accent) ${pct}%, var(--card-bg))`

// The eight disciplines, with the two cloud ones (CI and CN) filled.
function Disciplines() {
  const codes = ['PM', 'PD', 'FE', 'BE', 'CI', 'CN', 'SEC', 'AI']
  return (
    <div className="cv-disc" role="img" aria-label="Eight disciplines, with cloud infrastructure and cloud native highlighted">
      {codes.map((code) => (
        <span key={code} className={'cv-disc__dot' + (code === 'CI' || code === 'CN' ? ' cv-disc__dot--on' : '')}>
          {code}
        </span>
      ))}
    </div>
  )
}

function WorkshopShare() {
  const r = 30
  const c = 2 * Math.PI * r
  return (
    <svg className="cv-svg" viewBox="0 0 160 80" role="img" aria-label="87.3% sell at their own workshop">
      <circle cx="40" cy="40" r={r} fill="none" stroke={tint(15)} strokeWidth="12" />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="12"
        strokeDasharray={`${c * 0.873} ${c}`}
        transform="rotate(-90 40 40)"
      />
      <text x="40" y="45" textAnchor="middle" className="cv-svg__value">87.3%</text>
      <text x="84" y="36" className="cv-svg__label">sell at own</text>
      <text x="84" y="52" className="cv-svg__label">workshop</text>
    </svg>
  )
}

function Proof() {
  return (
    <div className="cv-proof" role="img" aria-label="Certification, materials, and technique are missing from listings">
      {['certification', 'materials', 'technique'].map((item) => (
        <span key={item}>{item} ?</span>
      ))}
    </div>
  )
}

function Hub() {
  const nodes = [
    ['AI', 30, 14],
    ['BE', 170, 14],
    ['SEC', 30, 66],
    ['FE', 170, 66],
  ]
  return (
    <svg className="cv-svg" viewBox="0 0 200 80" role="img" aria-label="Four departments depend on the cloud team">
      {nodes.map(([label, x, y]) => (
        <g key={label}>
          <line x1="100" y1="40" x2={x} y2={y} stroke="var(--accent)" strokeOpacity="0.45" strokeWidth="2" />
          <circle cx={x} cy={y} r="13" fill={tint(14)} />
          <text x={x} y={y + 4} textAnchor="middle" className="cv-svg__node">{label}</text>
        </g>
      ))}
      <rect x="76" y="27" width="48" height="26" rx="7" fill="var(--accent)" />
      <text x="100" y="44" textAnchor="middle" className="cv-svg__hub">Cloud</text>
    </svg>
  )
}

function Budget() {
  const rows = [
    ['$330', 'budget', (330 / 786) * 100, true],
    ['$786', 'prod / month', 100, false],
  ]
  return (
    <div className="cv-budget" role="img" aria-label="A $330 budget against $786 a month for production">
      {rows.map(([value, label, width, strong]) => (
        <div key={value} className="cv-budget__row">
          <span className="cv-budget__value">{value}</span>
          <span>
            <span className={'cv-budget__bar' + (strong ? ' cv-budget__bar--strong' : '')} style={{ width: `${width}%` }} />
            <span className="cv-budget__label">{label}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

const VISUALS = {
  disciplines: Disciplines,
  workshopShare: WorkshopShare,
  proof: Proof,
  hub: Hub,
  budget: Budget,
}

export default function ContextVisual({ name }) {
  const Visual = VISUALS[name]
  return Visual ? <Visual /> : null
}
