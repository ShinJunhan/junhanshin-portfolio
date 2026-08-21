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
//          that tile its size rather than the size being an assertion.
//   label  kept in the data as the tile's key, and deliberately not rendered.
//          A heading above every sentence was a second reading of the same
//          fact — "PR OWNER" over a sentence that opens "Reviewed and merged
//          all 27 pull requests" tells you nothing the sentence does not. The
//          emphasis moved *into* the sentence instead: the key term in each
//          one is marked in the project accent through the same `**bold**`
//          the rest of the page uses, so weight does the job the heading was
//          doing and the tile is one thing to read rather than two.
const SIZES = { lead: 'lead', medium: 'medium', small: 'small' }

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
  const lit = useSectionReached('role')

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

      <ul className="bento bento--role">
        {tiles.map((tile) => (
          <li className={`bento__tile bento__tile--${SIZES[tile.size] ?? 'small'}`} key={tile.label}>
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
  )
}
