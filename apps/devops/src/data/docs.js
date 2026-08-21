// Long-form markdown that belongs to a project — its README, its runbook —
// discovered rather than imported one by one. Dropping
// `src/content/<slug>/RUNBOOK.md` into the tree is the whole wiring step, the
// same as it already was for a README, and either document may carry a `.ko`
// translation beside it.
const SOURCES = import.meta.glob('../content/*/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Every language the toggle can offer, in the order it cycles through them.
// A document only gets a toggle for the languages it actually has a file for.
export const LANGUAGES = [
  { id: 'en', label: 'EN', suffix: '' },
  { id: 'ko', label: 'KO', suffix: '.ko' },
]

// '../content/hailcast/README.ko.md'
//   -> { slug: 'hailcast', doc: 'README', lang: 'ko' }
function parseKey(key) {
  const match = key.match(/\/content\/([^/]+)\/([A-Za-z0-9_-]+?)(\.([a-z]{2}))?\.md$/)
  if (!match) return null
  return { slug: match[1], doc: match[2], lang: match[4] ?? 'en' }
}

// Raw HTML isn't rendered in these files, so an HTML comment would otherwise
// reach the page as visible text. Stripping them here means a comment in a
// source file behaves the way whoever wrote it expected.
function stripComments(source) {
  return source.replace(/<!--[\s\S]*?-->\n?/g, '')
}

const BY_SLUG = {}
for (const [key, source] of Object.entries(SOURCES)) {
  const parsed = parseKey(key)
  if (!parsed) continue
  BY_SLUG[parsed.slug] ??= {}
  BY_SLUG[parsed.slug][parsed.doc] ??= {}
  BY_SLUG[parsed.slug][parsed.doc][parsed.lang] = stripComments(source)
}

// Returns only the languages this document exists in, so the toggle never
// offers a translation that isn't on disk. An absent document comes back as
// an empty list and its tab simply doesn't render.
export function docsFor(slug, doc = 'README') {
  const available = BY_SLUG[slug]?.[doc] ?? {}
  return LANGUAGES.filter((language) => available[language.id]).map((language) => ({
    ...language,
    source: available[language.id],
  }))
}
