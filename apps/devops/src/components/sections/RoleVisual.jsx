import { Fragment } from 'react'
import { techIcon, techTone } from '../../data/tech.js'

// The small diagram a role tile can carry above (or, on the lead, below) its
// sentence. Each one restates the sentence's claim as something you can see at
// a glance — the repos a console fans out to, a before and after, the two
// presentation dates — so the tile is not a paragraph in a box.
//
// The sentence still makes the claim. A visual never carries a fact the
// sentence beside it does not, because a recruiter skimming the section reads
// the pictures and a recruiter reading it reads the words, and the two have to
// say the same thing.
//
// `visual` in the data is { type, ...fields }:
//   hub          from { name, cmd }, to [{ name, cmd }]
//   reviews      value, unit, bars [{ name, count }]
//   result       items [{ value, unit }]
//   beforeAfter  rows [{ cmd, stage, outcome, ok }]
//   chips        items [{ text, accent }], grid (even columns instead of a ragged wrap)
//   chipRows     rows [[{ text, accent }]] — fixed rows, each stretched edge to edge
//   flow         steps [text], rows [{ name, text, active }]
//   routes       rows [{ when, profile, active }]
//   calendar     dates [{ month, day, label, active }]
//   span         from / to { icon, name, note }, then either via { icon, text }
//                or tools [{ icon, hot }] + toggle { options, active } + note

function Hub({ from, to }) {
  return (
    <div className="rv-hub">
      <div className="rv-node rv-node--from">
        <b>{from.name}</b>
        <span>{from.cmd}</span>
      </div>
      <div className="rv-hub__arrows" aria-hidden="true">
        {to.map((node) => <i key={node.name} />)}
      </div>
      <div className="rv-hub__to">
        {to.map((node) => (
          <div className="rv-node" key={node.name}>
            <b>{node.name}</b>
            <span>{node.cmd}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Bars are scaled to the largest count, not to the total: the point is which
// repos took the review load, and against 248 the smaller two would vanish.
//
// `wide` gives the count column room for four-digit figures (ShimonVault's
// lines per folder), which the default column clips.
function Reviews({ value, unit, bars, wide }) {
  const max = Math.max(...bars.map((bar) => bar.count))
  return (
    <div className={'rv-reviews' + (wide ? ' rv-reviews--wide' : '')}>
      <p className="rv-reviews__head">
        <b>{value}</b>
        <span>{unit}</span>
      </p>
      <div className="rv-bars">
        {bars.map((bar) => (
          <div className="rv-bars__row" key={bar.name}>
            <span>{bar.name}</span>
            <i style={{ '--w': `${(bar.count / max) * 100}%` }} aria-hidden="true" />
            <em>{bar.count.toLocaleString('en-US')}</em>
          </div>
        ))}
      </div>
    </div>
  )
}

function Result({ items }) {
  return (
    <div className="rv-result">
      {items.map((item) => (
        <p key={item.unit}>
          <b>{item.value}</b>
          <span>{item.unit}</span>
        </p>
      ))}
    </div>
  )
}

function BeforeAfter({ rows }) {
  return (
    <div className="rv-ba">
      {rows.map((row) => (
        <div className={`rv-ba__row rv-ba__row--${row.ok ? 'ok' : 'fail'}`} key={row.cmd}>
          <code>{row.cmd}</code>
          <span>{row.stage}</span>
          <strong>{row.outcome}</strong>
        </div>
      ))}
    </div>
  )
}

// The rows are set in the data, not left to wrap, so the chips end on a full
// row instead of one leaving a single chip on a line of its own.
function ChipRows({ rows }) {
  return (
    <div className="rv-chiprows">
      {rows.map((row) => (
        <div className="rv-chiprows__row" key={row.map((item) => item.text).join(' ')}>
          {row.map((item) => (
            <span className={item.accent ? 'rv-chiprows__hot' : undefined} key={item.text}>
              {item.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

// The pipeline's stages as three equal boxes, then where each run goes.
function Flow({ steps, rows }) {
  return (
    <div className="rv-flow">
      <div className="rv-flow__steps" style={{ '--steps': steps.length }}>
        {steps.map((step, i) => (
          <Fragment key={step}>
            {i > 0 && <i aria-hidden="true">→</i>}
            <span>{step}</span>
          </Fragment>
        ))}
      </div>
      {rows.map((row) => (
        <div className={'rv-flow__row' + (row.active ? ' rv-flow__row--hot' : '')} key={row.name}>
          <b>{row.name}</b>
          <span>{row.text}</span>
        </div>
      ))}
    </div>
  )
}

function Chips({ items, grid }) {
  return (
    <div className={'rv-chips' + (grid ? ' rv-chips--grid' : '')}>
      {items.map((item) => (
        <span className={item.accent ? 'rv-chips__hot' : undefined} key={item.text}>
          {item.text}
        </span>
      ))}
    </div>
  )
}

function Routes({ rows }) {
  return (
    <div className="rv-routes">
      {rows.map((row) => (
        <div className="rv-routes__row" key={row.when}>
          <code>{row.when}</code>
          <span aria-hidden="true">→</span>
          <b className={row.active ? 'rv-routes__hot' : undefined}>{row.profile}</b>
        </div>
      ))}
    </div>
  )
}

function Calendar({ dates }) {
  return (
    <div className="rv-cal">
      {dates.map((date) => (
        <div className="rv-cal__item" key={`${date.month}${date.day}`}>
          <p className={`rv-cal__page${date.active ? ' rv-cal__page--hot' : ''}`}>
            <small>{date.month}</small>
            <b>{date.day}</b>
          </p>
          <span>{date.label}</span>
        </div>
      ))}
    </div>
  )
}

function Logo({ label, size, hot }) {
  const icon = techIcon(label)
  if (!icon) return null
  return (
    <span className={`rv-span__logo rv-span__logo--${size}${hot ? ' rv-span__logo--hot' : ''}`} data-tone={techTone(label)}>
      <img src={icon} alt="" />
    </span>
  )
}

function End({ end }) {
  return (
    <p className="rv-span__end">
      <Logo label={end.icon} size="lg" />
      <b>{end.name}</b>
      <span>{end.note}</span>
    </p>
  )
}

// Two systems at the tile's edges and what joins them in the middle. The
// middle is either a link (`via`: a logo over one line, between hairlines) or
// a switch (`toggle`), with the tools that operate it in a small triangle
// beside it. A `hot` tool is the one that flips the switch.
function Span({ from, to, via, tools, toggle, note }) {
  return (
    <div className="rv-span">
      <End end={from} />
      {via ? (
        <div className="rv-span__mid rv-span__mid--via">
          <Logo label={via.icon} size="sm" />
          <span className="rv-span__via">{via.text}</span>
        </div>
      ) : (
        <div className="rv-span__mid">
          {tools && (
            <span className="rv-span__tools">
              {tools.map((tool) => (
                <Logo label={tool.icon} size="tool" hot={tool.hot} key={tool.icon} />
              ))}
            </span>
          )}
          <span className="rv-span__switch">
            <span className="rv-span__toggle">
              {toggle.options.map((option) => (
                <span className={option === toggle.active ? 'rv-span__on' : undefined} key={option}>
                  {option}
                </span>
              ))}
            </span>
            {note && <span className="rv-span__note">{note}</span>}
          </span>
        </div>
      )}
      <End end={to} />
    </div>
  )
}

const VISUALS = {
  span: Span,
  hub: Hub,
  reviews: Reviews,
  result: Result,
  beforeAfter: BeforeAfter,
  chips: Chips,
  chipRows: ChipRows,
  flow: Flow,
  routes: Routes,
  calendar: Calendar,
}

export default function RoleVisual({ visual }) {
  const Visual = VISUALS[visual?.type]
  return Visual ? <Visual {...visual} /> : null
}
