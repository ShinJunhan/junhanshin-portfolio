// README source files, discovered rather than imported one by one — dropping
// `src/content/<slug>/README.md` (and optionally `README.ko.md`) into the tree
// is the whole wiring step for a new project's README section.
const SOURCES = import.meta.glob('../content/*/README*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Every language the toggle can offer, in the order it cycles through them.
// A project only gets a toggle for the languages it actually has a file for.
export const LANGUAGES = [
  { id: 'en', label: 'EN', suffix: '' },
  { id: 'ko', label: 'KO', suffix: '.ko' },
]

// '../content/hailcast/README.ko.md' -> { slug: 'hailcast', lang: 'ko' }
function parseKey(key) {
  const match = key.match(/\/content\/([^/]+)\/README(\.([^.]+))?\.md$/)
  if (!match) return null
  return { slug: match[1], lang: match[3] ?? 'en' }
}

// Raw HTML isn't rendered in these files, so an HTML comment would otherwise
// reach the page as visible text. Stripping them here means a comment in a
// README source behaves the way whoever wrote it expected.
function stripComments(source) {
  return source.replace(/<!--[\s\S]*?-->\n?/g, '')
}

const BY_SLUG = {}
for (const [key, source] of Object.entries(SOURCES)) {
  const parsed = parseKey(key)
  if (!parsed) continue
  BY_SLUG[parsed.slug] ??= {}
  BY_SLUG[parsed.slug][parsed.lang] = stripComments(source)
}

// Returns only the languages this project has a file for, so the toggle never
// offers a translation that doesn't exist.
export function readmesFor(slug) {
  const available = BY_SLUG[slug] ?? {}
  return LANGUAGES.filter((language) => available[language.id]).map((language) => ({
    ...language,
    source: available[language.id],
  }))
}
