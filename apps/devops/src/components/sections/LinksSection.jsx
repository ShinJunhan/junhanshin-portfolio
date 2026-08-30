import RichText from '../../lib/richText.jsx'
import { CheckIcon, GithubIcon, NotionIcon, SlidesIcon } from '../icons.jsx'

// Every link a project can carry, in the order each group shows them.
//
//   group     which section renders it. There is only one now — 'workspace',
//             the row under the team's name at the top of the page.
//   always    show the entry even with no URL yet, as an inert placeholder,
//             so a missing link is visible rather than silent
//   teamOnly  drops out entirely for solo work, where there is no team space
//
// Terraform is deliberately not here: it has its own section with the code
// inline and the repo link underneath, so a tile would point at the same URL
// twice.
//
// Neither is a live dashboard, and that is a decision rather than an omission.
// Live monitoring is demonstrated once, on the root site, rather than promised
// on every project page and delivered on none — a permanently greyed-out
// "Live Dashboard" tile advertised a gap on every project. See DESIGN.md; do
// not add it back here.
//
// Nor is the README. There was a second link row further down the page, also
// headed "Resources", whose README tile linked out to the very document the
// panel beneath it was already rendering inline. That row is gone and the
// panel took the name; the deck moved up here, where the repo links are.
export const LINK_KINDS = [
  { id: 'github', label: 'GitHub', icon: GithubIcon, group: 'workspace', always: true },
  {
    id: 'notion',
    label: 'Notion',
    icon: NotionIcon,
    group: 'workspace',
    always: true,
    teamOnly: true,
  },
  {
    id: 'presentation',
    label: 'Presentation',
    icon: SlidesIcon,
    group: 'workspace',
    always: true,
  },
]

// Which entries a given group shows for a given project. Used both to render
// and as the section registry's presence check, so the two can't disagree.
export function visibleLinkKinds(project, group) {
  const hasTeam = Boolean(project.team?.length)

  return LINK_KINDS.filter((kind) => {
    if (group && kind.group !== group) return false
    if (kind.teamOnly && !hasTeam) return false
    return kind.always || Boolean(project.links?.[kind.id])
  })
}

// No pill, no border: the mark carries it, with its name beneath. The whole
// tile is the hit area.
function LinkTile({ kind, href }) {
  const Icon = kind.icon

  // An `always` entry with no URL yet: same shape, inert, and announced as
  // unavailable rather than being a dead link.
  if (!href) {
    return (
      <li>
        <span className="link-tile link-tile--pending" aria-disabled="true">
          <span className="link-tile__mark">
            <Icon />
          </span>
          <span className="link-tile__label">{kind.label}</span>
          <span className="sr-only">, link not available yet</span>
        </span>
      </li>
    )
  }

  return (
    <li>
      <a className="link-tile" href={href} target="_blank" rel="noreferrer">
        <span className="link-tile__mark">
          <Icon />
        </span>
        <span className="link-tile__label">{kind.label}</span>
      </a>
    </li>
  )
}

// The three sentences a reader who is not going to scroll should still come
// away with: what the problem was, what was built, what it did. Deliberately
// one sentence each and deliberately fixed labels — the value is that every
// project answers the same three questions in the same order, so they can be
// compared without reading three write-ups.
//
// `glance` in a project's data: { why, how, result }. A project that has not
// filled it in renders the links alone, on the full width they used to have.
const GLANCE = [
  { id: 'why', label: 'Why' },
  { id: 'how', label: 'How' },
  { id: 'result', label: 'Result' },
]

// A self-contained card, not a second section. It had a heading of its own
// sitting level with "<Team> Workspace", which made two headings compete for
// the top of the page when only one of them names a section. The box is what
// says "this is a unit" now, and the name survives for assistive tech only.
//
// Each line stacks — label above, sentence below. Side by side they cost a
// label column plus a gutter out of every row and pushed the sentences onto a
// measure that wrapped them four or five lines deep, which made the opening
// block of the page the tallest thing on it.
function Glance({ glance }) {
  const lines = GLANCE.filter((line) => glance[line.id])
  if (lines.length === 0) return null

  return (
    <div className="glance">
      {/* Named inside the box rather than above it. As a heading level with
          "<Team> Workspace" it read as a second section; as a caption on the
          card it is a label on a thing, which is what it is. */}
      <p className="glance__caption">At a Glance</p>

      {/* A real term-and-description list now. It was a `dl` of bare `dd`s
          with the labels as spans, which is not a definition list — the label
          *is* the term. */}
      <dl className="glance__list">
        {lines.map((line) => (
          <div className="glance__row" key={line.id}>
            <span className="glance__check" aria-hidden="true">
              <CheckIcon />
            </span>
            <dt className="glance__label">{line.label}</dt>
            <dd className="glance__text">
              <RichText>{glance[line.id]}</RichText>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

// The links and the summary side by side, each under its own heading. Three
// small tiles took a full-width section and left most of the row empty; the
// summary is what that room is for, and putting the two together means the top
// of the page answers "where does this live" and "what was it" in one glance
// instead of two sections.
//
// **One heading and one card, not two headings.** The summary had a heading of
// its own sitting level with the workspace's, and two headings at the same
// level read as two sections — competing for the top of the page when only one
// of them names anything. The summary is a bordered box instead: self-contained
// by its own edges rather than by a title over it. This is still a `bare`
// section, because the one heading it does have belongs *inside* the left
// column rather than above both.
export default function LinksSection({ project, label, headingId }) {
  const kinds = visibleLinkKinds(project, 'workspace')
  const glance = project.glance

  return (
    <div className={`workspace-row${glance ? '' : ' workspace-row--links-only'}`}>
      <div className="workspace-row__col">
        <h2 className="section__title" id={headingId}>
          {label}
        </h2>
        <ul className="links">
          {kinds.map((kind) => (
            <LinkTile key={kind.id} kind={kind} href={project.links?.[kind.id]} />
          ))}
        </ul>
      </div>

      {glance && <Glance glance={glance} />}
    </div>
  )
}
