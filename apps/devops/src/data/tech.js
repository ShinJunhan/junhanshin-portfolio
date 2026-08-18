// Maps a tech-stack entry to its vendor logo. Projects list plain labels
// ('GitHub Actions', 'Route 53') and the label is slugified to find the file,
// so adding a logo is usually just dropping the SVG in the right folder — see
// src/assets/icons/README.md.
//
// Only labels that need a slug the filename doesn't match, or that live in a
// folder the slug doesn't imply, need an entry in OVERRIDES.
//
// The icons live under src/assets rather than public/ specifically so this
// glob works: Vite copies public/ verbatim and does not resolve imports into
// it, so globbing there yields URLs that exist in dev and 404 in a build.

const TOOL_ICONS = import.meta.glob('../assets/icons/tools/*.svg', {
  query: '?url',
  import: 'default',
  eager: true,
})

const AWS_ICONS = import.meta.glob('../assets/icons/aws/*.svg', {
  query: '?url',
  import: 'default',
  eager: true,
})

// 'GitHub Actions' -> 'github-actions', 'Route 53' -> 'route-53'
export function techSlug(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Slugs whose icon file is named differently.
const OVERRIDES = {
  'route-53': 'route53',
  'amazon-s3': 's3',
  'aws-lambda': 'lambda',
}

function index(modules, folder) {
  const byName = {}
  for (const [path, url] of Object.entries(modules)) {
    const name = path.split('/').pop().replace(/\.svg$/, '')
    byName[name] = url
  }
  return { byName, folder }
}

const SOURCES = [index(TOOL_ICONS, 'tools'), index(AWS_ICONS, 'aws')]

// Returns the icon URL for a label, or null when no logo has been added yet —
// the tag falls back to a monogram tile rather than a broken image.
export function techIcon(label) {
  const name = OVERRIDES[techSlug(label)] ?? techSlug(label)
  for (const source of SOURCES) {
    if (source.byName[name]) return source.byName[name]
  }
  return null
}

// First letter, for the fallback tile. Kept to one character: two letters at
// tile size read as text rather than as a mark.
export function techInitial(label) {
  return label.trim()[0]?.toUpperCase() ?? '?'
}
