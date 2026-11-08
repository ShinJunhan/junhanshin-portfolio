import { Fragment, useId, useState } from 'react'
import { techIcon, techTone } from '../../data/tech.js'
import RichText from '../../lib/richText.jsx'
import { CheckIcon, GithubIcon, NotionIcon, SlidesIcon } from '../icons.jsx'
import Overview, { OverviewLinks } from './Overview.jsx'
import WorkspaceApps from './WorkspaceApps.jsx'
import WorkspaceCards from './WorkspaceCards.jsx'
import WorkspaceFaces from './WorkspaceFaces.jsx'
import WorkspaceStack from './WorkspaceStack.jsx'
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
// `oneLine` holds every label to a single line while the row sits beside the
// workspace column.
function Figures({ figures, oneLine }) {
  return (
    <ul className={'glance-figures' + (oneLine ? ' glance-figures--one-line' : '')}>
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

// An illustrative day above a control loop. The chart draws taxi calls as an
// area and the forecast floor as a step line, with one queue spike hatched
// where the reactive layer takes over; the strip under it is the loop the
// floor comes from. Values are fractions of the chart height, one per hour.
// The drawing is 464 units wide, close to the card column's own width, so the
// 13.5-unit labels render at 12px or more on a laptop.
const LOOP_W = 420
const LOOP_H = 150

function LoopChart({ loop }) {
  const patternId = useId()
  const x = (h) => 20 + (h * (LOOP_W - 30)) / 24
  const y = (v) => LOOP_H - 18 - v * (LOOP_H - 52)
  const area =
    `M${x(0)},${y(0)} ` +
    loop.calls.map((v, h) => `L${x(h)},${y(v)}`).join(' ') +
    ` L${x(24)},${y(0)} Z`
  const step =
    `M${x(0)},${y(loop.floor[0])} ` +
    loop.floor.map((v, h) => `H${x(h)} V${y(v)}`).join(' ') +
    ` H${x(24)}`
  const spike = `M${x(17.6)},${y(0.8)} L${x(18)},${y(0.95)} L${x(18.6)},${y(0.86)} L${x(19)},${y(0.8)} Z`
  const ticks = []
  for (let h = 0; h < 24; h += loop.forecastEvery) ticks.push(h)

  return (
    <div className="loop-wrap">
      <div className="loop">
        <svg className="loop__chart" viewBox={`-22 0 ${LOOP_W + 44} ${LOOP_H}`} aria-hidden="true">
          <defs>
            <pattern id={patternId} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="5" className="loop__hatch" />
            </pattern>
          </defs>
          <line x1={x(0)} x2={x(24)} y1={y(0)} y2={y(0)} className="loop__axis" />
          <path d={area} className="loop__calls" />
          <path d={step} className="loop__floor" />
          <path d={spike} className="loop__spike" fill={`url(#${patternId})`} />
          {ticks.map((h) => (
            <line key={h} x1={x(h)} x2={x(h)} y1="4" y2="11" className="loop__tick" />
          ))}
          <text className="loop__mono" x={x(0.3)} y="24">
            {loop.labels.forecast}
          </text>
          <line x1={x(6)} y1={y(0.45) - 4} x2={x(4.2)} y2={y(0.62)} className="loop__leader" />
          <text className="loop__label" x={x(1.2)} y={y(0.66)}>
            {loop.labels.floor}
          </text>
          <line x1={x(18.6)} y1={y(0.92)} x2={x(20.3)} y2={y(1)} className="loop__leader" />
          <text className="loop__label" x={x(20.4)} y={y(1) + 4}>
            {loop.labels.spike}
          </text>
          <line x1={x(22.5)} y1={y(0.38)} x2={x(22.5)} y2={y(0.58)} className="loop__leader" />
          <text className="loop__label" x={x(24)} y={y(0.62)} textAnchor="end">
            {loop.labels.scaleIn}
          </text>
          {[0, 6, 12, 18, 24].map((h) => (
            <text key={h} className="loop__axis-label" x={x(h)} y={LOOP_H - 2} textAnchor="middle">
              {String(h).padStart(2, '0')}:00
            </text>
          ))}
        </svg>
        <ul className="loop__legend" aria-hidden="true">
          <li>
            <i className="loop__swatch loop__swatch--calls" />
            taxi calls
          </li>
          <li>
            <i className="loop__swatch loop__swatch--floor" />
            forecast floor
          </li>
          <li>
            <i className="loop__swatch loop__swatch--spike" />
            queue safety net
          </li>
        </ul>
        <ol className="loop__stages">
          {loop.stages.map((stage, i) => (
            <Fragment key={stage.key}>
              {i > 0 && (
                <li className="loop__arrow" aria-hidden="true">
                  →
                </li>
              )}
              <li className="loop__stage">
                <span>{stage.key}</span>
                <b>{stage.tool}</b>
              </li>
            </Fragment>
          ))}
        </ol>
        <p className="loop__back">
          <span aria-hidden="true">↺ </span>
          {loop.back}
        </p>
        <p className="loop__note">{loop.note}</p>
      </div>
    </div>
  )
}

// One block per pod at peak. Blocks up to the forecast are filled, the one it
// ends inside is filled to its fraction, and the rest are hatched as saved.
// The bracket and the forecast label both start where the fill ends, worked
// out from the same fraction so they stay aligned at every width.
const POD_GAP = 3

function PodResult({ pods, measured }) {
  const blocks = Array.from({ length: pods.peak }, (_, i) => Math.min(1, Math.max(0, pods.forecast - i)))
  const fillEnd = `calc((100% - ${(pods.peak - 1) * POD_GAP}px) / ${pods.peak} * ${pods.forecast} + ${Math.floor(pods.forecast) * POD_GAP}px)`
  return (
    <div className="pods-wrap">
      <div className="pods">
        <span className="pods__label pods__label--sim">Simulated</span>
        <span className="pods__label pods__label--meas">Measured</span>
        <span className="pods__rule" aria-hidden="true" />
        <div className="pods__bar">
          <span className="pods__bracket" style={{ left: fillEnd }}>
            <span>{pods.saving}</span>
          </span>
          <div
            className="pods__blocks"
            style={{ gap: `${POD_GAP}px`, gridTemplateColumns: `repeat(${pods.peak}, minmax(0, 1fr))` }}
            aria-hidden="true"
          >
            {blocks.map((used, i) => (
              <i
                key={i}
                className={'pods__block' + (used === 1 ? '' : used === 0 ? ' pods__block--saved' : ' pods__block--part')}
                style={used > 0 && used < 1 ? { '--used': `${Math.round(used * 100)}%` } : undefined}
              />
            ))}
          </div>
          <div className="pods__ticks">
            <span style={{ left: fillEnd }}>{pods.forecastLabel}</span>
            <span>{pods.peakLabel}</span>
          </div>
        </div>
        <strong className="pods__value">{measured.value}</strong>
        <p className="pods__text pods__text--caption">{pods.caption}</p>
        <p className="pods__text pods__text--meas">{measured.text}</p>
      </div>
    </div>
  )
}

// The build week by week: the week and its title on one line, then what the
// week added as logo pills stretched across the full width, so every week's
// row ends flush on both sides. A tool with no logo is its name alone.
function WeekPills({ weeks }) {
  return (
    <ol className="glance-weeks">
      {weeks.map((week) => (
        <li className="glance-weeks__week" key={week.week}>
          <span className="glance-weeks__label">{week.week}</span>
          <b className="glance-weeks__title">{week.title}</b>
          <span className="glance-weeks__tools">
            {week.tools.map((tool) => {
              const icon = tool.icon && techIcon(tool.icon)
              return (
                <span className="glance-weeks__tool" key={tool.label}>
                  {icon && (
                    <span className="glance-weeks__mark" data-tone={techTone(tool.icon)}>
                      <img src={icon} alt="" />
                    </span>
                  )}
                  {tool.label}
                </span>
              )
            })}
          </span>
        </li>
      ))}
    </ol>
  )
}

// One row per threshold, all on the same scale so the rows can be compared
// at a glance: a row's squares end where its count ends, and a marked square
// names what happens at that count. Squares from `blockFrom` on are refused.
function Meters({ meters }) {
  return (
    <div className="glance-meters">
      {meters.rows.map((row) => (
        <div className="glance-meters__row" key={row.label}>
          <span className="glance-meters__name">{row.label}</span>
          <span
            className="glance-meters__scale"
            style={{ gridTemplateColumns: `repeat(${meters.scale}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: row.count }, (_, i) => {
              const n = i + 1
              const mark = row.marks?.[n]
              const cls = [
                'glance-meters__step',
                mark && 'glance-meters__step--mark',
                row.blockFrom && n >= row.blockFrom && 'glance-meters__step--block',
                n === meters.scale && 'glance-meters__step--end',
              ]
              return (
                <i className={cls.filter(Boolean).join(' ')} key={n}>
                  {mark && <span>{mark}</span>}
                </i>
              )
            })}
          </span>
        </div>
      ))}
    </div>
  )
}

// A line's shape picks its renderer. See `glance` in src/data/projects.js.
function GlanceBody({ value, open, onToggle }) {
  if (value.weeks) return <WeekPills weeks={value.weeks} />
  if (value.meters) return <Meters meters={value.meters} />
  if (value.loop) return <LoopChart loop={value.loop} />
  if (value.pods && value.measured) return <PodResult pods={value.pods} measured={value.measured} />
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
  if (value.figures) return <Figures figures={value.figures} oneLine={value.oneLine} />
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

  // A project with `overview` keeps one section heading, "<Team> Workspace",
  // with a row of links to where the work lives right under it, then the
  // overview captioned At a Glance. The overview takes At a Glance's job and
  // the link row takes the workspace cards', so neither renders here.
  if (project.overview) {
    return (
      <>
        <h2 className="section__title" id={headingId}>
          {label}
        </h2>
        {project.overview.links && <OverviewLinks links={project.overview.links} />}
        <p className="ov-heading">At a Glance</p>
        <Overview overview={project.overview} />
      </>
    )
  }

  const glance = project.glance

  // A project with `workspaceApps` gets At a Glance on the left and the four
  // places the team worked on the right, as cards that open in place. The
  // column is held to At a Glance's height whatever is open.
  if (project.workspaceApps) {
    return (
      <div className="workspace-row workspace-row--cards">
        <h2 className="section__title workspace-row__title" id={headingId}>
          {label}
        </h2>
        {glance && <Glance glance={glance} />}
        <WorkspaceApps workspace={project.workspaceApps} />
      </div>
    )
  }

  // A project with `workspaceFaces` gets At a Glance on the left and four
  // figure tiles in a 2×2 grid on the right, stretched to At a Glance's height.
  if (project.workspaceFaces) {
    return (
      <div className="workspace-row workspace-row--cards">
        <h2 className="section__title workspace-row__title" id={headingId}>
          {label}
        </h2>
        {glance && <Glance glance={glance} />}
        <WorkspaceFaces faces={project.workspaceFaces} />
      </div>
    )
  }

  // A project with `workspaceStack` gets At a Glance on the left and a column
  // of three cards on the right: one across the top, two side by side under
  // it, stretched to At a Glance's height.
  if (project.workspaceStack) {
    return (
      <div className="workspace-row workspace-row--cards">
        <h2 className="section__title workspace-row__title" id={headingId}>
          {label}
        </h2>
        {glance && <Glance glance={glance} />}
        <WorkspaceStack stack={project.workspaceStack} />
      </div>
    )
  }

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
