// The workspace as four static cards: GitHub across the top, Notion and
// Network side by side, Presentation across the bottom. Unlike the tile grid,
// nothing opens: each card shows its content at rest and ends in a link to
// where the work lives. `cards` is `workspaceCards` in src/data/projects.js;
// a card's `link` names a key in the project's `links`, and `href` is used
// when the destination is not one of those.

function Figure({ figure }) {
  return (
    <div className="wc-card__figure">
      <strong>{figure.value}</strong>
      <span>{figure.label}</span>
    </div>
  )
}

function Card({ card, href, wide, children }) {
  return (
    <section className={'wc-card' + (wide ? ' wc-card--wide' : '')}>
      <div className="wc-card__top">
        <div className="wc-card__name">
          <h3>{card.title}</h3>
          <p>{card.subtitle}</p>
        </div>
        {card.figure && <Figure figure={card.figure} />}
      </div>
      {children}
      <p className="wc-card__foot">
        <span>{card.foot}</span>
        {href && (
          <a href={href} target="_blank" rel="noreferrer">
            {card.linkLabel} <span aria-hidden="true">↗</span>
          </a>
        )}
      </p>
    </section>
  )
}

// Branch lanes on the left, the pull request figures stacked on the right.
// The lane that is Junhan's own is tinted.
function GithubBody({ card }) {
  return (
    <div className="wc-git">
      <ul className="wc-git__lanes">
        {card.lanes.map((lane) => (
          <li key={lane.branch} className={'wc-git__lane' + (lane.mine ? ' wc-git__lane--mine' : '')}>
            <code>{lane.branch}</code>
            <span>
              <b>{lane.who}</b>
              {lane.text}
            </span>
          </li>
        ))}
      </ul>
      <ul className="wc-git__stats">
        {card.stats.map((stat) => (
          <li key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function NotionBody({ card }) {
  return (
    <ul className="wc-rows">
      {card.rows.map((row) => (
        <li key={row.label}>
          {row.href ? (
            <a href={row.href} target="_blank" rel="noreferrer">
              <span>{row.label}</span>
              <em aria-hidden="true">↗</em>
            </a>
          ) : (
            <>
              <span>{row.label}</span>
              <em>{row.count}</em>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}

// The request path from the internet to the database, one security group per
// step with its port, then the two side doors.
function NetworkBody({ card }) {
  return (
    <div className="wc-net">
      <ol className="wc-net__path">
        {card.path.map((node) => (
          <li key={node.name} className={'wc-net__node' + (node.edge ? ' wc-net__node--edge' : '')}>
            <b>{node.name}</b>
            {node.port && <em>{node.port}</em>}
          </li>
        ))}
      </ol>
      <ul className="wc-net__doors">
        {card.sideDoors.map((door) => (
          <li key={door.key}>
            <b>{door.key}</b>
            {door.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

function SlidesBody({ card }) {
  return (
    <div className="wc-slides">
      {card.slides.map((slide) => (
        <figure key={slide.number}>
          <img src={slide.src} alt={`Slide ${slide.number}: ${slide.caption}`} loading="lazy" />
          <figcaption>
            <b>{slide.number}</b>
            {slide.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

export default function WorkspaceCards({ cards, links }) {
  const hrefFor = (card) => card.href ?? links?.[card.link]
  const { github, notion, network, presentation } = cards

  return (
    <div className="wc">
      {github && (
        <Card card={github} href={hrefFor(github)} wide>
          <GithubBody card={github} />
        </Card>
      )}
      {notion && (
        <Card card={notion} href={hrefFor(notion)}>
          <NotionBody card={notion} />
        </Card>
      )}
      {network && (
        <Card card={network} href={hrefFor(network)}>
          <NetworkBody card={network} />
        </Card>
      )}
      {presentation && (
        <Card card={presentation} href={hrefFor(presentation)} wide>
          <SlidesBody card={presentation} />
        </Card>
      )}
    </div>
  )
}
