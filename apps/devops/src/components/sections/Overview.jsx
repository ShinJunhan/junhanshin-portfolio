import RichText from '../../lib/richText.jsx'
import { GithubIcon, NotionIcon, ShieldIcon, SlidesIcon } from '../icons.jsx'

const LINK_ICONS = { notion: NotionIcon, security: ShieldIcon, slides: SlidesIcon }

// The row under "<Team> Workspace": the GitHub organization as one wide card
// with its repositories inside, then one card per other place the work lives.
// Only the team's own repository takes the accent; the rest stay neutral so
// the eye lands on it first.
export function OverviewLinks({ links }) {
  const { org, items } = links

  // The deck has no public URL, so its card scrolls to the section that holds
  // it. A plain `#id` href would fight the hash router.
  const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="ov-links">
      <div className="ov-link ov-link--org">
        <a className="ov-link__main" href={org.href} target="_blank" rel="noreferrer">
          <span className="ov-link__icon">
            <GithubIcon />
          </span>
          <span className="ov-link__text">
            <span className="ov-link__label">{org.label}</span>
            <span className="ov-link__note">{org.note}</span>
          </span>
          <span className="ov-link__arrow" aria-hidden="true">
            ↗
          </span>
        </a>
        <ul className="ov-repos">
          {org.repos.map((repo) => (
            <li key={repo.name}>
              <a
                className={'ov-repo' + (repo.mine ? ' ov-repo--mine' : '')}
                href={repo.href}
                target="_blank"
                rel="noreferrer"
              >
                {repo.name} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {items.map((item) => {
        const Icon = LINK_ICONS[item.icon]
        const body = (
          <>
            <span className="ov-link__icon">
              <Icon />
            </span>
            <span className="ov-link__text">
              <span className="ov-link__label">{item.label}</span>
              <span className="ov-link__note">{item.note}</span>
            </span>
            <span className="ov-link__arrow" aria-hidden="true">
              {item.section ? '↓' : '↗'}
            </span>
          </>
        )
        return item.section ? (
          <button
            type="button"
            className="ov-link ov-link__main"
            key={item.label}
            onClick={() => goTo(item.section)}
          >
            {body}
          </button>
        ) : (
          <a className="ov-link ov-link__main" key={item.label} href={item.href} target="_blank" rel="noreferrer">
            {body}
          </a>
        )
      })}
    </div>
  )
}

// The opening block of a page that carries `overview` (Midam so far). It sits
// above the workspace row and takes At a Glance's place there.
//
// **Separate cards with gaps, not one box with boxes inside it.** The first
// samples were one card holding a mission box, a brand box, outlined role rows
// and stat tiles, and a box inside a box is a stock AI layout. Four sibling
// cards now, separated by the page ground, and nothing inside them carries a
// border except the chart's own nodes.
//
// **No divider rules.** The hairlines between columns and sections read as
// generated too. Space and one tinted surface, the mission band, do that work
// instead.

function Timeline({ timeline }) {
  return (
    <div className="ov-time">
      <div className="ov-time__figures">
        <p className="ov-figure">
          <span className="ov-figure__value">{timeline.weeks}</span>
          <span className="ov-figure__label">weeks</span>
        </p>
        <p className="ov-figure">
          <span className="ov-figure__value">{timeline.phases.length}</span>
          <span className="ov-figure__label">phases</span>
        </p>
      </div>
      <div className="ov-time__track">
        <ol className="ov-phases">
          {timeline.phases.map((phase, i) => (
            <li className="ov-phase" key={phase}>
              <span className="ov-phase__num">{String(i + 1).padStart(2, '0')}</span> {phase}
            </li>
          ))}
        </ol>
        <p className="ov-time__dates">
          <span>{timeline.start}</span>
          <span>{timeline.end}</span>
        </p>
      </div>
    </div>
  )
}

function Brand({ answer }) {
  return (
    <>
      {/* The deck's logo as a mask, so it can take any colour. White on the
          brand's own navy, as the deck's cover sets it. */}
      <div className="ov-brand">
        <span
          className="ov-brand__logo"
          role="img"
          aria-label="Midam logo"
          style={{ '--logo': `url(${answer.logo})` }}
        />
        <span className="ov-brand__caption">{answer.caption}</span>
      </div>
      <ul className="ov-swatches">
        {answer.swatches.map((swatch) => (
          <li key={swatch.hex}>
            <span className="ov-swatch" style={{ background: swatch.hex }} />
            <span className="ov-swatch__hex">{swatch.hex}</span>
            <span className="ov-swatch__name">{swatch.name}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

function Layers({ layers }) {
  return (
    <ul className="ov-layers">
      {layers.map((layer) => (
        <li className={'ov-layer' + (layer.mine ? ' ov-layer--mine' : '')} key={layer.name}>
          <span className="ov-layer__name">{layer.name}</span>
          <span className="ov-layer__owner">{layer.owner}</span>
        </li>
      ))}
    </ul>
  )
}

function Delivered({ items }) {
  return (
    <ul className="ov-delivered">
      {items.map((item) => (
        <li key={item.label}>
          <span className="ov-delivered__value">{item.value}</span>
          <span className="ov-delivered__label">{item.label}</span>
          <span className="ov-delivered__text">{item.text}</span>
        </li>
      ))}
    </ul>
  )
}

// The reporting chart, drawn for one shape: a lead, four groups, one group
// open into two teams, a vice lead under the first team, and three members
// under the vice lead in a single line. Coordinates are in a 1100-wide box.
const W = 1100

function Node({ x, y, w, h = 54, title, sub, tone }) {
  return (
    <g className={'ov-node' + (tone ? ` ov-node--${tone}` : '')}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="10" />
      <text className="ov-node__title" x={x} y={sub ? y - 3 : y + 5}>
        {title}
      </text>
      {sub && (
        <text className="ov-node__sub" x={x} y={y + 15}>
          {sub}
        </text>
      )}
    </g>
  )
}

const elbow = (x1, y1, x2, y2, mid) => `M${x1},${y1} V${mid} H${x2} V${y2}`

function OrgChart({ chart }) {
  const groupX = [150, 430, 700, 975]
  const groupW = [270, 220, 270, 190]
  const memberX = [470, 630, 790]
  const openIndex = chart.groups.findIndex((group) => group.open)

  return (
    <div className="ov-chart">
      <svg viewBox={`0 0 ${W} 445`} role="img" aria-label="How the team reported">
        <g className="ov-lines">
          {chart.groups.map((group, i) => (
            <path
              key={group.name}
              className={i === openIndex ? 'is-hot' : undefined}
              d={elbow(550, 62, groupX[i], 103, 82)}
            />
          ))}
          <path className="is-hot" d={elbow(700, 161, 630, 206, 184)} />
          <path d={elbow(700, 161, 880, 206, 184)} />
          <path className="is-hot" d="M630,260 V293" />
          <path className="is-hot is-dashed" d="M760,320 H880 V260" />
          <path className="is-soft" d="M630,347 V375" />
          {memberX.map((x) => (
            <path key={x} className="is-soft" d={`M630,375 H${x} V388`} />
          ))}
        </g>

        <Node x={550} y={34} w={260} h={56} title={chart.lead.name} sub={chart.lead.sub} tone="lead" />
        {chart.groups.map((group, i) => (
          <Node
            key={group.name}
            x={groupX[i]}
            y={132}
            w={groupW[i]}
            h={58}
            title={group.name}
            sub={group.sub}
            tone={i === openIndex ? 'tint' : undefined}
          />
        ))}
        {chart.teams.map((team, i) => (
          <Node
            key={team.name}
            x={i === 0 ? 630 : 880}
            y={233}
            w={i === 0 ? 200 : 170}
            title={team.name}
            sub={team.sub}
            tone={team.mine ? 'tint' : undefined}
          />
        ))}
        <Node x={630} y={320} w={260} title={chart.me.name} sub={chart.me.sub} tone="me" />
        <text className="ov-chart__liaison" x={890} y={300}>
          {chart.liaison}
        </text>
        {chart.members.map((member, i) => (
          <Node key={member.name} x={memberX[i]} y={414} w={150} h={52} title={member.name} sub={member.sub} />
        ))}
      </svg>
    </div>
  )
}

export default function Overview({ overview }) {
  return (
    <div className="ov">
      <section className="ov-card" aria-label="Mission">
        {/* The program's name labels the mission rather than heading the
            card on its own line: it says whose mission this is. */}
        <div className="ov-mission">
          <p className="ov-cap ov-cap--program">{overview.program} Mission</p>
          <p className="ov-mission__text">{overview.mission}</p>
        </div>
        <Timeline timeline={overview.timeline} />
      </section>

      <section className="ov-card ov-pair">
        <div>
          <p className="ov-cap ov-cap--start">Our Answer</p>
          <Brand answer={overview.answer} />
          <p className="ov-prose">
            <RichText>{overview.answer.text}</RichText>
          </p>
        </div>
        <div>
          <p className="ov-cap ov-cap--start">My Role</p>
          <Layers layers={overview.role.layers} />
          <p className="ov-prose">
            <RichText>{overview.role.text}</RichText>
          </p>
        </div>
      </section>

      <section className="ov-card ov-card--delivered">
        <p className="ov-cap">What we delivered</p>
        <Delivered items={overview.delivered} />
      </section>

      <section className="ov-card ov-card--chart">
        <p className="ov-cap">How the team reported</p>
        <OrgChart chart={overview.chart} />
      </section>
    </div>
  )
}
