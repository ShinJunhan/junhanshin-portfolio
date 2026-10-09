import { techIcon } from '../data/tech.js'

// A small glyph in front of each browser-panel tab, so the strip reads as a
// row of separate things to open rather than one label followed by faint text.
// Drawn in `currentColor`, so a tab's icon dims and lights with its label and
// follows the theme with no rules of its own. Terraform is the one exception:
// its tabs show the real logo from the tech-stack set.
//
// Resolved from the tab's label. A label with no match shows no icon, and the
// tab still works; add a line here when a new kind of tab appears.

const PATHS = {
  book: 'M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z',
  runbook:
    'M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M12 11h4M12 16h4M8 11h.01M8 16h.01',
  slides: 'M2 3h20M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3m4 18 5-5 5 5',
  code: 'm16 18 6-6-6-6M8 6l-6 6 6 6',
  diagram:
    'M17 16h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zM3 16h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zM10 2h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8',
  tree: 'M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1ZM20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1ZM3 5a2 2 0 0 0 2 2h3M3 3v13a2 2 0 0 0 2 2h3',
  map: 'M14.1 5.55a2 2 0 0 0 1.8 0l3.65-1.83A1 1 0 0 1 21 4.62v12.76a1 1 0 0 1-.55.9l-4.55 2.27a2 2 0 0 1-1.8 0l-4.2-2.1a2 2 0 0 0-1.8 0l-3.65 1.83A1 1 0 0 1 3 19.38V6.62a1 1 0 0 1 .55-.9L8.1 3.45a2 2 0 0 1 1.8 0zM15 5.76v15M9 3.24v15',
  bell: 'M10.27 21a2 2 0 0 0 3.46 0M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33',
  route: 'M3 19a3 3 0 1 0 6 0 3 3 0 1 0-6 0M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15M15 5a3 3 0 1 0 6 0 3 3 0 1 0-6 0',
  file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5',
  server:
    'M4 2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM4 14h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zM6 6h.01M6 18h.01',
  pulse: 'M22 12h-4l-3 9L9 3l-3 9H2',
  cpu: 'M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM10 9h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zM15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2',
  memory:
    'M6 19v-3M10 19v-3M14 19v-3M18 19v-3M8 11V9M16 11V9M12 11V9M2 15h20M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.84V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.84Z',
  trend: 'M22 7 13.5 15.5l-5-5L2 17M16 7h6v6',
  queue: 'm12 2 10 5-10 5L2 7zm-10 15 10 5 10-5M2 12l10 5 10-5',
  gauge: 'm12 14 4-4M3.34 19a10 10 0 1 1 17.32 0',
  chart: 'M3 3v18h18M7 16v-4M12 16V8M17 16v-7',
  receipt:
    'M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1ZM16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 17.5v-11',
  refresh:
    'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5',
  loop: 'm17 2 4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  wrench:
    'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  box: 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16ZM3.3 7l8.7 5 8.7-5M12 22V12',
  cloud: 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z',
  check: 'M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20zm-3 10 2 2 4-4',
  key: 'M7.5 10a5.5 5.5 0 1 0 0 11 5.5 5.5 0 1 0 0-11zM21 2l-9.6 9.6M15.5 7.5l3 3L22 7l-3-3',
  unlock: 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM7 11V7a5 5 0 0 1 9.9-1',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  rocket:
    'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
  zap: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
  shield:
    'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
}

// Labels that name a scene or a view rather than a file, matched whole.
const BY_LABEL = {
  'architecture diagram': 'diagram',
  'folder structure': 'tree',
  'source code': 'code',
  // EchoChallengers
  'nginx down': 'server',
  'exporter down': 'pulse',
  'high cpu': 'cpu',
  'high memory': 'memory',
  // HailCast
  'predictive scaling': 'trend',
  'keda queue trigger': 'queue',
  'worker runtime': 'gear',
  'pod-hour simulation': 'chart',
  'finops: real billing': 'receipt',
  'retraining loop': 'refresh',
  'closed-loop summary': 'loop',
  // Project1-Self-Build
  baseline: 'gauge',
  terraform: 'terraform',
  'nginx self-heal': 'wrench',
  'backend down': 'server',
  'cpu overload': 'cpu',
  'container recovery': 'box',
  'recovery on aws': 'cloud',
  // ShimonVault and Lock-N-Lock
  'normal operation': 'check',
  'credential stuffing': 'key',
  'broken access control': 'unlock',
  'bulk exfiltration': 'download',
  'monitoring stack': 'chart',
  'alert lifecycle': 'bell',
  deploy: 'rocket',
  'login brute-force': 'key',
  'api flooding': 'zap',
  'container failure': 'box',
  'secure deploy': 'shield',
}

// Labels that name a file, matched by shape so a renamed file keeps its icon.
const BY_PATTERN = [
  [/^readme/i, 'book'],
  [/^runbook/i, 'runbook'],
  [/\.tf$/i, 'terraform'],
  [/slides$/i, 'slides'],
  [/^recovery_map/i, 'map'],
  [/^alert[._]?rules/i, 'bell'],
  [/^alertmanager/i, 'route'],
  [/\.(ya?ml|json|md)$/i, 'file'],
]

function iconFor(label) {
  const text = String(label ?? '').trim()
  const exact = BY_LABEL[text.toLowerCase()]
  if (exact) return exact
  return BY_PATTERN.find(([pattern]) => pattern.test(text))?.[1] ?? null
}

export default function TabIcon({ label }) {
  const name = iconFor(label)
  if (!name) return null

  if (name === 'terraform') {
    const src = techIcon('Terraform')
    return src ? <img className="code__tab-icon" src={src} alt="" aria-hidden="true" /> : null
  }

  return (
    <svg
      className="code__tab-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
