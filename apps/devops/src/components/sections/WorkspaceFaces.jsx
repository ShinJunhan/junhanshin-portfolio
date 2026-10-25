import { GithubIcon, PeopleIcon, ServerIcon, WorkflowIcon } from '../icons.jsx'

// The workspace as four static tiles in a 2×2 grid, each led by one large
// figure. Nothing opens: the tiles stretch to At a Glance's height, and the
// GitHub commit bars take up the extra room. `faces` is `workspaceFaces` in
// src/data/projects.js.

const ICONS = { github: GithubIcon, workflow: WorkflowIcon, server: ServerIcon, people: PeopleIcon }

// Commits per day as bars on one scale, labelled only at the two ends.
function Bars({ bars }) {
  const max = Math.max(...bars.days.map((d) => d.commits))
  const first = bars.days[0].day
  const last = bars.days[bars.days.length - 1].day
  return (
    <div className="wf-bars">
      <div className="wf-bars__plot" aria-hidden="true">
        {bars.days.map((d) => (
          <i
            key={d.day}
            className={'wf-bars__bar' + (d.hot ? ' wf-bars__bar--hot' : '')}
            style={{ height: `${Math.max(4, (d.commits / max) * 78)}%` }}
          />
        ))}
      </div>
      <p className="wf-bars__ends">
        <span>{first}</span>
        <span>{last}</span>
      </p>
      <p className="sr-only">
        {bars.days.map((d) => `${d.day}: ${d.commits}`).join(', ')}
      </p>
    </div>
  )
}

function Face({ face }) {
  const Icon = ICONS[face.icon]
  return (
    <section className="wf-tile">
      <div className="wf-tile__head">
        <h3>
          {Icon && <Icon />}
          {face.title}
        </h3>
        <p>{face.subtitle}</p>
      </div>
      <p className="wf-tile__figure">
        <strong>{face.value}</strong>
        <span>{face.label}</span>
      </p>
      {face.bars && <Bars bars={face.bars} />}
      {face.chips && (
        <ul className="wf-tile__chips">
          {face.chips.map((chip) => (
            <li key={chip.text} className={chip.on ? 'is-on' : undefined}>
              {chip.text}
            </li>
          ))}
        </ul>
      )}
      {face.link && (
        <a className="wf-tile__link" href={face.link.href}>
          {face.link.label} <span aria-hidden="true">→</span>
        </a>
      )}
    </section>
  )
}

export default function WorkspaceFaces({ faces }) {
  return (
    <div className="wf">
      {faces.map((face) => (
        <Face key={face.title} face={face} />
      ))}
    </div>
  )
}
