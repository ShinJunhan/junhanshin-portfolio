import { techIcon, techTone } from '../../data/tech.js'

// The workspace as a column of three static cards beside At a Glance: an
// event map across the top, then Console and Network side by side. Nothing
// opens; each card shows its content at rest and ends in a link to the file
// it is drawn from. `stack` is `workspaceStack` in src/data/projects.js.

function Logo({ label, className }) {
  const icon = techIcon(label)
  if (!icon) return null
  return (
    <span className={className} data-tone={techTone(label)}>
      <img src={icon} alt="" />
    </span>
  )
}

function Card({ card, wide, children }) {
  return (
    <section className={'wst-card' + (wide ? ' wst-card--wide' : '')}>
      <div className="wst-card__top">
        <div>
          <h3>{card.title}</h3>
          <p>{card.subtitle}</p>
        </div>
        <div className="wst-card__figure">
          <strong>{card.figure.value}</strong>
          <span>{card.figure.label}</span>
        </div>
      </div>
      {children}
      <p className="wst-card__foot">
        <span>{card.foot}</span>
        <a href={card.href} target="_blank" rel="noreferrer">
          {card.linkLabel} <span aria-hidden="true">↗</span>
        </a>
      </p>
    </section>
  )
}

// Each event source points at the Lambda functions it invokes, one chip per
// function stacked at the same width. An idle function is dashed.
function EventMap({ card }) {
  return (
    <Card card={card} wide>
      <div className="wst-events">
        {card.rows.map((row) => (
          <div className="wst-events__row" key={row.source}>
            <div className="wst-events__line">
              <div className="wst-events__source">
                <Logo label={row.icon} className="wst-events__logo" />
                <div>
                  <b>{row.source}</b>
                  <span>{row.event}</span>
                </div>
              </div>
              <span className="wst-arrow" aria-hidden="true">
                →
              </span>
              <ul className="wst-events__functions">
                {row.functions.map((fn) => (
                  <li
                    className={'wst-events__function' + (fn.idle ? ' wst-events__function--idle' : '')}
                    key={fn.name}
                  >
                    <Logo label="Lambda" className="wst-events__fn-logo" />
                    {fn.name}
                  </li>
                ))}
              </ul>
            </div>
            <p>{row.text}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

// The four attack buttons in the admin console, each over the endpoint it
// hits, then where the app sends its alerts.
function Console({ card }) {
  return (
    <Card card={card}>
      <ul className="wst-attacks">
        {card.attacks.map((attack) => (
          <li key={attack.name}>
            <span className="wst-attacks__button">{attack.name}</span>
            <code>{attack.target}</code>
          </li>
        ))}
      </ul>
      <div className="wst-alerts">
        <span>{card.alerts.label}</span>
        {card.alerts.channels.map((channel) => (
          <b key={channel}>
            <Logo label={channel} className="wst-alerts__logo" />
            {channel}
          </b>
        ))}
      </div>
    </Card>
  )
}

// Who may reach what, from the security groups: a From / To / Port table
// with the service on each port captioned under its row.
function Network({ card }) {
  return (
    <Card card={card}>
      <div className="wst-routes">
        <div className="wst-routes__head" aria-hidden="true">
          <span>From</span>
          <span>To</span>
          <span>Port</span>
        </div>
        {card.routes.map((route) => (
          <div className="wst-routes__route" key={`${route.from}-${route.to}-${route.port}`}>
            <span className="wst-routes__from">{route.from}</span>
            <span className="wst-routes__to">{route.to}</span>
            <span className="wst-routes__port">{route.port}</span>
            <span className="wst-routes__service">{route.service}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function WorkspaceStack({ stack }) {
  return (
    <div className="wst">
      <EventMap card={stack.eventMap} />
      <div className="wst__pair">
        <Console card={stack.console} />
        <Network card={stack.network} />
      </div>
    </div>
  )
}
