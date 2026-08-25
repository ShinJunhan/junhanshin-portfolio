// A project's presentation deck — the exported slide images plus the manifest
// that describes them — discovered the same way its README is. Dropping
// `src/content/<slug>/slides.json` into the tree is the whole wiring step.
//
// The images themselves are not imported: they sit under `public/` like every
// other project image on this site, and the manifest's `imageBase` says where.
// Bundling 70 WebP files through the graph would buy nothing — they are served
// as-is either way, and the tab loads them lazily as the reader scrolls.
const MANIFESTS = import.meta.glob('../content/*/slides.json', {
  import: 'default',
  eager: true,
})

// '../content/echochallengers/slides.json' -> 'echochallengers'
function slugOf(key) {
  return key.match(/\/content\/([^/]+)\/slides\.json$/)?.[1] ?? null
}

// The cover slides carry a section id that is deliberately absent from
// `sections` — they belong to no numbered part of the talk. They still need a
// caption, so they get this one.
const COVER_TITLE = 'Cover'

// Every slide comes out of here already carrying the two things the tab reads
// off it — where its image is and what to call it — so the component never
// does a lookup of its own and a manifest that moves house is one line here.
function normalise(manifest) {
  const titles = new Map(manifest.sections.map((section) => [section.id, section.title]))

  return {
    ...manifest,
    slides: manifest.slides.map((slide) => ({
      ...slide,
      src: `${manifest.imageBase}${slide.file}`,
      label: titles.get(slide.section) ?? COVER_TITLE,
    })),
  }
}

const BY_SLUG = {}
for (const [key, manifest] of Object.entries(MANIFESTS)) {
  const slug = slugOf(key)
  if (slug) BY_SLUG[slug] = normalise(manifest)
}

// Null for a project with no deck on disk, so its tab simply doesn't render.
export function slidesFor(slug) {
  return BY_SLUG[slug] ?? null
}
