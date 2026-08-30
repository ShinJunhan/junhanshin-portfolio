import RichText from '../../lib/richText.jsx'
import { OWNER } from '../../data/owner.js'
import useSectionReached from '../../lib/useSectionReached.js'

// My Role as a bento of duties, sized by how much of the project each one was.
//
// The tiles carry sentences, not phrases. A metric tile can be "27 / PRs
// Merged" because the number is the content; a role tile's content is what was
// actually done, and "PR owner — 27 PRs" says nothing a reader can use. Each
// tile is a claim someone could check.
//
// `role` takes either shape:
//   'Narrative prose.'                 the lede paragraph, as before
//   { tiles: [{ size, label, stat, text }] }
//
//   title  the role, in one line, under the monogram
//   size   lead | medium | small — three tiers, not one repeated shape. On the
//          six-column grid they span 3x2, 3x1 and 2x1, which fills eighteen
//          cells over three rows exactly. Six equal tiles was the version this
//          replaced: a uniform grid says every duty weighed the same, which is
//          the one thing this section exists to deny.
//   stat   optional { value, unit } — a figure large enough to be read from
//          across the section. Only the lead tile has one; it is what earns
//          that tile its size rather than the size being an assertion. A
//          project that counts more than one thing puts them in the section's
//          own `figures` band instead: two figures inside one tile is a tile
//          asked to be a table.
//   label  kept in the data as the tile's key, and deliberately not rendered.
//          A heading above every sentence was a second reading of the same
//          fact — "PR OWNER" over a sentence that opens "Reviewed and merged
//          all 27 pull requests" tells you nothing the sentence does not. The
//          emphasis moved *into* the sentence instead: the key term in each
//          one is marked in the project accent through the same `**bold**`
//          the rest of the page uses, so weight does the job the heading was
//          doing and the tile is one thing to read rather than two.
const SIZES = { lead: 'lead', medium: 'medium', small: 'small' }

// How the tiers are laid out on the six-column grid. Three arrangements, one
// per project, because three pages running the identical mosaic made the
// section read as a template the projects were poured into rather than as a
// description of what each one actually was.
//
// The tier vocabulary does not change — a lead is still the headline duty
// everywhere. What changes is the shape it takes:
//
//   columns  lead 3x2 at the left with two mediums stacked beside it
//   mosaic   lead 4x3, with the small tiles in a narrow strip down its right
//   mirror   `columns` reflected — the lead sits at the right instead
//
// Every arrangement has to tile its project's tile counts exactly; the counts
// differ (six tiles on two projects, eight on the third) and a mismatch shows
// as a hole rather than as a smaller grid. See global.css for the cell maths.
const LAYOUTS = { columns: 'columns', mosaic: 'mosaic', mirror: 'mirror' }

// Same rule as the Members row: two letters at most, and an explicit override
// wins, because Korean given names romanize as two syllables and deriving from
// the written name gets it wrong for the people most likely to notice.
function initialsOf(name, override) {
  if (override) return override
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

function tilesOf(role) {
  if (role && !Array.isArray(role) && typeof role === 'object') return role.tiles ?? []
  return null
}

// The monogram and the role title, as their own column down the left of the
// section with the tiles beside them. Identity belongs to the section, not to
// any one duty: inside the lead tile it made that tile structurally different
// from the other five and implied the avatar was part of the Infrastructure
// Build claim rather than of all six.
//
// The mark is sized like a profile picture rather than a badge — it is the
// only portrait on a site with no photographs, and at 56px it read as an
// annotation on the heading above it. It is also the far half of a pair: the
// matching circle in Members lights up as this one lands. See
// lib/useSectionReached.js.
function Who({ project, lit }) {
  const owner = project.team?.find((member) => member.name === OWNER.name)
  // The full role, stated once. It used to be split — a short form here and a
  // "PR Owner" heading down in a tile — which made one job read as two.
  const title = project.role?.title ?? owner?.title ?? owner?.role ?? OWNER.name

  return (
    <div className="role__who">
      <span className={`role-mark${lit ? ' role-mark--lit' : ''}`} aria-hidden="true">
        {initialsOf(OWNER.name, owner?.initials)}
      </span>
      <p className="role__title">{title}</p>
    </div>
  )
}

export default function RoleSection({ project }) {
  const tiles = tilesOf(project.role)
  // Section-level, not tile-level: these describe the track, and the band
  // renders only for a project that writes them.
  const figures = project.role?.figures ?? []
  const lit = useSectionReached('role')
  // `columns` is the fallback rather than a "default arrangement": a project
  // that names no layout gets the one whose cell maths works for both six and
  // eight tiles, so a new project renders correctly before anyone has chosen
  // a shape for it.
  const layout = LAYOUTS[project.role?.layout] ?? 'columns'

  if (!tiles?.length) {
    return (
      <p className="lede">
        <RichText>{project.role}</RichText>
      </p>
    )
  }

  return (
    <div className="role">
      <Who project={project} lit={lit} />

      <div className="role__stack">
        {/* The figures, when a project has more than one to give. They sit
            across the top of the section rather than inside the lead tile,
            because a tile is a duty and a duty is a sentence: counting is a
            different job, and the tile that tried to do both was half empty
            doing neither. One row, one card, one hairline between each pair.

            A project with a single figure keeps it on the lead tile, where it
            is part of that tile's claim rather than a section-wide headline. */}
        {figures.length > 0 && (
          <div className="role-band">
            {figures.map((figure) => (
              <p className="role-band__cell" key={figure.unit}>
                <span className="bento__value">{figure.value}</span>
                <span className="role-band__unit">{figure.unit}</span>
              </p>
            ))}
          </div>
        )}

        <ul className={`bento bento--role bento--role-${layout}`}>
        {tiles.map((tile) => (
          <li className={`bento__tile bento__tile--${SIZES[tile.size] ?? 'small'}`} key={tile.label}>
            {/* The label, rendered on the lead tile only.

                It has been in the data all along and was deliberately not
                shown — a heading over every sentence was a second reading of
                the same fact. On the lead that argument does not hold: the
                lead is the one tile whose height is set by its neighbours
                rather than by its own text, so it is the one tile with room to
                spare, and an eyebrow is the difference between three things
                distributed down a tall tile and two things with a hole between
                them. It names the duty; the sentence still makes the claim. */}
            {tile.size === 'lead' && tile.label && (
              <p className="role-tile__eyebrow">{tile.label}</p>
            )}

            {tile.stat && (
              <p className="role-tile__stat">
                <span className="bento__value">{tile.stat.value}</span>
                <span className="role-tile__unit">{tile.stat.unit}</span>
              </p>
            )}

            <p className="bento__prose">
              <RichText>{tile.text}</RichText>
            </p>
          </li>
        ))}
        </ul>
      </div>
    </div>
  )
}
