import RichText from '../../lib/richText.jsx'
import RoleVisual from './RoleVisual.jsx'
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
//   tracks optional { items, short, rows [{ name, caption, owned }] }: a track strip
//          drawn above the tiles in place of the figures band
//   even   on a tile: share its spare height evenly instead of leaving a strip
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
//   areas    the project draws its own grid: `role.areas` is one string per
//            row of a twelve-column grid, and each tile names its `area`.
//            hailcast uses it, because its tiles carry visuals of different
//            heights and no fixed span pattern sat them without holes.
//
// Every arrangement has to tile its project's tile counts exactly; the counts
// differ (six tiles on two projects, eight on the third) and a mismatch shows
// as a hole rather than as a smaller grid. See global.css for the cell maths.
const LAYOUTS = { columns: 'columns', mosaic: 'mosaic', mirror: 'mirror', areas: 'areas' }

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

// Ties the last two words of a sentence together, so no tile ends on a line
// holding a single word. Only on the `areas` layout, whose tiles were checked
// line by line with it; the other pages were approved without it.
function glueLastWord(text) {
  return String(text ?? '').replace(/ (?=\S+$)/, '\u00A0')
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
  // A second role, when the project gives one, sits under the title in a pill
  // rather than being joined to it with "and": two short lines read faster
  // than one long one, and the title keeps the larger size to itself.
  const subtitle = project.role?.subtitle

  return (
    <div className="role__who">
      <span className={`role-mark${lit ? ' role-mark--lit' : ''}`} aria-hidden="true">
        {initialsOf(OWNER.name, owner?.initials)}
      </span>
      {subtitle ? (
        <div className="role__titles">
          <p className="role__title">{title}</p>
          <p className="role__subtitle">{subtitle}</p>
        </div>
      ) : (
        <p className="role__title">{title}</p>
      )}
    </div>
  )
}

// The track strip (ShimonVault): one row per project, the same five tracks in
// each, the owned ones filled. It sits where a team page puts its figures band,
// because on a solo project the count that matters is how many tracks were
// covered, set against the team project that split them five ways.
function TrackStrip({ tracks }) {
  return (
    <div className="role-tracks">
      {tracks.rows.map((row) => {
        const owned = row.owned === 'all' ? tracks.items : row.owned
        return (
          <div className="role-tracks__row" key={row.name}>
            <p className="role-tracks__name">
              {row.name}
              <span>{row.caption}</span>
            </p>
            <ol>
              {tracks.items.map((item, i) => (
                <li
                  className={owned.includes(item) ? 'role-tracks__on' : undefined}
                  data-short={tracks.short?.[i]}
                  key={item}
                >
                  <span>{item}</span>
                </li>
              ))}
            </ol>
            <p className="role-tracks__count">
              {owned.length} of {tracks.items.length}
            </p>
          </div>
        )
      })}
    </div>
  )
}

// The `stats` layout (Midam): a hero tile counting the files written, with a
// bar per folder, and six figure tiles around it on the project's own areas
// grid. Each tile leads with one figure, its unit on the same line, and a
// sentence under it. There are no eyebrows: a grey label over every figure
// read as generated. `size: 'large'` sets a figure a step up where its tile
// would otherwise end in empty space, and `prose` sets that tile's sentence at
// the reading size for the same reason.
function StatsBento({ role }) {
  const { hero, tiles = [], areas = [] } = role
  const max = Math.max(...hero.bars.map((bar) => bar.count))

  return (
    <ul className="rs" style={{ '--role-areas': areas.map((row) => `"${row}"`).join(' ') }}>
      <li className="rs__tile rs__tile--hero" style={{ gridArea: 'A' }}>
        <p className="rs__title">{hero.title}</p>
        <p className="rs__figure rs__figure--hero">
          {hero.value}
          <span className="rs__unit">{hero.unit}</span>
        </p>
        <ul className="rs__bars">
          {hero.bars.map((bar) => (
            <li key={bar.name}>
              <span className="rs__bar-name">{bar.name}</span>
              <span
                className={'rs__bar' + (bar.strong ? ' rs__bar--strong' : '')}
                style={{ width: `${(bar.count / max) * 100}%` }}
              />
              <span className="rs__bar-count">{bar.count}</span>
            </li>
          ))}
        </ul>
        <p className="rs__prose">
          <RichText>{glueLastWord(hero.text)}</RichText>
        </p>
      </li>

      {tiles.map((tile) => (
        <li className="rs__tile" style={{ gridArea: tile.area }} key={tile.area}>
          <p className={'rs__figure' + (tile.size === 'large' ? ' rs__figure--large' : '')}>
            {tile.value}
            <span className="rs__unit">{tile.unit}</span>
          </p>
          {tile.timeline && (
            <ol className="rs__timeline">
              {tile.timeline.map((step) => (
                <li key={step.date}>
                  <b>{step.date}</b>
                  <span>{step.text}</span>
                </li>
              ))}
            </ol>
          )}
          <p className={'rs__prose' + (tile.prose ? ' rs__prose--reading' : '')}>
            <RichText>{glueLastWord(tile.text)}</RichText>
          </p>
        </li>
      ))}
    </ul>
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
  const areas = layout === 'areas' ? project.role?.areas ?? [] : []
  const proseOf = (text) => (layout === 'areas' ? glueLastWord(text) : text)

  if (project.role?.layout === 'stats') {
    return (
      <div className="role role--stats">
        <Who project={project} lit={lit} />
        <StatsBento role={project.role} />
      </div>
    )
  }

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
          // `figuresInline` sets each label beside its figure on one line,
          // centred in the cell, for a band whose labels are short.
          <div className={'role-band' + (project.role?.figuresInline ? ' role-band--inline' : '')}>
            {figures.map((figure) => (
              <p className="role-band__cell" key={figure.unit}>
                <span className="bento__value">{figure.value}</span>
                <span className="role-band__unit">{figure.unit}</span>
              </p>
            ))}
          </div>
        )}

        {project.role?.tracks && <TrackStrip tracks={project.role.tracks} />}

        <ul
          className={`bento bento--role bento--role-${layout}`}
          style={areas.length ? { '--role-areas': areas.map((row) => `"${row}"`).join(' ') } : undefined}
        >
        {tiles.map((tile) => (
          <li
            className={`bento__tile bento__tile--${SIZES[tile.size] ?? 'small'}${tile.tone === 'accent' ? ' bento__tile--accent' : ''}${tile.even ? ' bento__tile--even' : ''}`}
            style={tile.area ? { '--role-area': tile.area } : undefined}
            key={tile.label}
          >
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

            {tile.visual && <RoleVisual visual={tile.visual} />}

            <p className="bento__prose">
              <RichText>{proseOf(tile.text)}</RichText>
            </p>

            {/* A second visual under the sentence. Only the lead has the
                height for one, and only when its figure is a measure of the
                sentence above it rather than a headline of its own. */}
            {tile.footer && <RoleVisual visual={tile.footer} />}
          </li>
        ))}
        </ul>
      </div>
    </div>
  )
}
