import { Fragment, useId, useState } from 'react'
import RichText from '../../lib/richText.jsx'
import { CheckIcon, GithubIcon, NotionIcon, SlidesIcon } from '../icons.jsx'
import WorkspaceCards from './WorkspaceCards.jsx'
import WorkspaceTiles from './WorkspaceTiles.jsx'

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
// `glance` in a project's data: { why, how, result }, each in one of the
// shapes GlanceBody reads. A project that has not filled it in renders the
// links alone, on the full width they used to have.
const GLANCE = [
  { id: 'why', label: 'Why' },
  { id: 'how', label: 'How' },
  { id: 'result', label: 'Result' },
]

// One small arrow, drawn rather than typed: an arrow glyph changes weight and
// baseline from font to font, and this one has to sit centred between boxes.
function FlowArrow() {
  return (
    <svg className="flow__arrow" viewBox="0 0 16 10" aria-hidden="true">
      <path d="M0 5h13M9 1l4 4-4 4" />
    </svg>
  )
}

// Build, detect, recover, then a dashed return from Recover to Detect: the
// loop is the part that makes it self-healing, so it is drawn rather than
// described. The network every step runs over sits underneath as a base
// layer, because it is what the steps share rather than a step of its own.
//
// The diagram is presentational. Its steps are a real ordered list, so a
// screen reader gets the same order the arrows show, and the loop and the
// base are plain sentences after it.
function Flow({ flow }) {
  return (
    <div className="flow-wrap">
      <div className="flow">
        <ol className="flow__steps">
          {flow.steps.map((step, i) => (
            <li className="flow__step" key={step.key}>
              {i > 0 && <FlowArrow />}
              <div className="flow__node">
                <span className="flow__key">{step.key}</span>
                <span className="flow__tools">{step.tools}</span>
                <span className="flow__caption">{step.caption}</span>
              </div>
            </li>
          ))}
        </ol>
        {flow.loop && (
          <div className="flow__loop">
            <span className="flow__return" aria-hidden="true" />
            <span className="flow__loop-text">{flow.loop}</span>
          </div>
        )}
        {flow.base && (
          <p className="flow__base">
            <strong>{flow.base.name}</strong> {flow.base.text}
          </p>
        )}
      </div>
    </div>
  )
}

// Each figure leads with its number, set large, and names it underneath.
function Figures({ figures }) {
  return (
    <ul className="glance-figures">
      {figures.map((figure) => (
        <li className="glance-figures__item" key={figure.label}>
          <span className="glance-figures__value">{figure.value}</span>
          <span className="glance-figures__label">{figure.label}</span>
        </li>
      ))}
    </ul>
  )
}

// One tool and what it does. The name sits on its own line so the sentence
// under it can be justified without stretching the gaps inside the name.
function RailEntry({ entry, plain }) {
  const cls = ['rail__entry', plain && 'rail__entry--plain', entry.soft && 'rail__entry--soft']
    .filter(Boolean)
    .join(' ')
  return (
    <div className={cls}>
      <b>{entry.name}</b>
      <span>{entry.text}</span>
    </div>
  )
}

// A phase's detail: AWS and on-premise side by side with the tunnel between
// them, or two entries side by side.
function RailDetail({ phase, link }) {
  if (phase.split) {
    return (
      <div className="rail__split">
        <div className="rail__col">
          <span className="rail__side">AWS</span>
          {phase.split.aws.map((entry) => (
            <RailEntry key={entry.name} entry={entry} />
          ))}
        </div>
        <span className="rail__link" aria-hidden="true">
          <span>{link}</span>
        </span>
        <div className="rail__col">
          <span className="rail__side">On&#8209;premise</span>
          {phase.split.onPrem.map((entry) => (
            <RailEntry key={entry.name} entry={entry} plain />
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="rail__pair">
      {phase.pair.map((entry) => (
        <RailEntry key={entry.name} entry={entry} />
      ))}
    </div>
  )
}

// Build, Ship, Run as a numbered rail. Closed, each phase shows one summary
// line; open, it shows its detail. Phases open independently, and the label
// row above carries an Expand all control, so the open state lives in Glance.
// What triggers the next phase sits on the rail between them.
function HowRail({ rail, open, onToggle }) {
  const baseId = useId()
  return (
    <div className="rail">
      {rail.phases.map((phase, i) => {
        const isOpen = open[i]
        const bodyId = `${baseId}-phase-${i}`
        return (
          <Fragment key={phase.key}>
            {i > 0 && (
              <p className="rail__hop">
                <span aria-hidden="true">↓</span>
                {rail.hops[i - 1]}
              </p>
            )}
            <div className={'rail__phase' + (isOpen ? ' rail__phase--open' : '')}>
              <span className="rail__num" aria-hidden="true">
                {i + 1}
              </span>
              <button
                type="button"
                className="rail__head"
                aria-expanded={isOpen}
                aria-controls={bodyId}
                onClick={() => onToggle(i)}
              >
                <span className="rail__key">{phase.key}</span>
                <span className="rail__tools">{phase.tools}</span>
                <span className="rail__sign" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {!isOpen && <p className="rail__summary">{phase.summary}</p>}
              <div className="rail__body" id={bodyId} hidden={!isOpen}>
                <RailDetail phase={phase} link={rail.link} />
              </div>
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}

// A ring of equal segments, one per item, with "n/n" in the middle. The list
// beside it carries the meaning, so the drawing is hidden from assistive tech.
function Ring({ count }) {
  const c = 32
  const outer = 28
  const inner = 19
  const gap = 3
  const point = (deg, r) => {
    const a = (deg * Math.PI) / 180
    return `${(c + r * Math.cos(a)).toFixed(2)} ${(c + r * Math.sin(a)).toFixed(2)}`
  }
  const step = 360 / count
  return (
    <svg className="glance-ring__svg" viewBox="0 0 64 64" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const a0 = i * step - 90 + gap
        const a1 = (i + 1) * step - 90 - gap
        return (
          <path
            key={i}
            d={`M${point(a0, outer)} A${outer} ${outer} 0 0 1 ${point(a1, outer)} L${point(a1, inner)} A${inner} ${inner} 0 0 0 ${point(a0, inner)} Z`}
          />
        )
      })}
      <text x="32" y="36.5" textAnchor="middle">
        {count}/{count}
      </text>
    </svg>
  )
}

function PairFigure({ value, label }) {
  return (
    <div className="glance-pair__figure">
      <span className="glance-pair__value">{value}</span>
      <span className="glance-pair__label">{label}</span>
    </div>
  )
}

// Two result figures side by side: a padlock whose bars are the security
// layers, and a ring whose segments are the stack layers verified live. The
// padlock's labels sit in two columns so every tool starts at one edge.
function ResultPair({ lock, ring }) {
  return (
    <div className="glance-pair">
      <div className="glance-pair__tile glance-pair__tile--lock">
        <ul className="glance-lock">
          <li className="glance-lock__shackle" aria-hidden="true" />
          {lock.layers.map((layer) => (
            <li key={layer.name} className="glance-lock__row">
              <span
                className={'glance-lock__bar' + (layer.soft ? ' glance-lock__bar--soft' : '')}
                aria-hidden="true"
              />
              <b>{layer.name}</b>
              <span className="glance-lock__tool">{layer.tool}</span>
            </li>
          ))}
        </ul>
        <PairFigure value={lock.value} label={lock.label} />
      </div>
      <div className="glance-pair__tile">
        <PairFigure value={ring.value} label={ring.label} />
        <div className="glance-ring">
          <Ring count={ring.layers.length} />
          <ul>
            {ring.layers.map((layer) => (
              <li key={layer.key}>
                <b>{layer.key}</b>
                {layer.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// A line's shape picks its renderer. See `glance` in src/data/projects.js.
function GlanceBody({ value, open, onToggle }) {
  if (value.rail) return <HowRail rail={value.rail} open={open} onToggle={onToggle} />
  if (value.lock && value.ring) return <ResultPair lock={value.lock} ring={value.ring} />
  if (Array.isArray(value)) {
    return (
      <ul className="glance-dots">
        {value.map((item) => (
          <li key={item}>
            <RichText>{item}</RichText>
          </li>
        ))}
      </ul>
    )
  }
  if (value.flow) return <Flow flow={value.flow} />
  if (value.figures) return <Figures figures={value.figures} />
  return <RichText>{value}</RichText>
}

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
  // Open state for a How rail, kept here so the label row can offer Expand
  // all beside the rail it controls. Every phase starts closed.
  const rail = glance.how?.rail
  const [open, setOpen] = useState(() => (rail ? rail.phases.map(() => false) : []))
  const allOpen = open.length > 0 && open.every(Boolean)
  const toggle = (i) => setOpen((prev) => prev.map((value, j) => (j === i ? !value : value)))
  const toggleAll = () => setOpen((prev) => prev.map(() => !allOpen))

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
            <dt className="glance__label">
              {line.label}
              {line.id === 'how' && rail && (
                <button type="button" className="glance__expand" onClick={toggleAll}>
                  {allOpen ? 'Collapse all' : 'Expand all'}
                </button>
              )}
            </dt>
            <dd className="glance__text">
              <GlanceBody value={glance[line.id]} open={open} onToggle={toggle} />
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

  // A project with `workspaceCards` gets At a Glance on the left and four
  // static cards on the right, each ending in a link. Used where At a Glance
  // runs tall: cards hold their content at rest, so nothing has to open to be
  // read, and the column ends where At a Glance does.
  if (project.workspaceCards) {
    return (
      <div className="workspace-row workspace-row--cards">
        <h2 className="section__title workspace-row__title" id={headingId}>
          {label}
        </h2>
        {glance && <Glance glance={glance} />}
        <WorkspaceCards cards={project.workspaceCards} links={project.links} />
      </div>
    )
  }

  // A project with `workspace` tiles gets the tile grid instead of the plain
  // link icons. The heading then spans both columns, At a Glance sits on the
  // left and the tiles on the right, and the two are held to one height.
  // Every other project keeps the layout below until its tiles are written.
  if (project.workspace) {
    return (
      <div className="workspace-row workspace-row--tiles">
        <h2 className="section__title workspace-row__title" id={headingId}>
          {label}
        </h2>
        {glance && <Glance glance={glance} />}
        <WorkspaceTiles tiles={project.workspace} links={project.links} />
      </div>
    )
  }

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
