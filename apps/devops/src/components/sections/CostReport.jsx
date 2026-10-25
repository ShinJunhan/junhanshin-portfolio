import RichText from '../../lib/richText.jsx'

// The detailed cost report (`cost.layout: 'report'`, Midam). One project acted
// as a startup on a fixed budget, so its cost section is the longest on the
// site: four headline tiles, the daily bill, the estimates against the budget,
// where the money went, the savings the team priced, what went wrong, the
// production estimate, and Junhan's own part. Every figure comes from the
// data; nothing here computes a number a reader would quote.

// Same rule as the rest of the page: keep hyphenated words whole and tie the
// last two words together, so justified text never ends on one word.
function unbroken(text) {
  if (!text) return text
  return text
    .split('`')
    .map((part, i) => (i % 2 === 1 ? part : part.replace(/(\w)-(\w)/g, '$1‑$2')))
    .join('`')
    .replace(/ (?=[^ ]+$)/, ' ')
}

function Prose({ children }) {
  return (
    <p className="cr__text">
      <RichText>{unbroken(children)}</RichText>
    </p>
  )
}

function Head({ title, sub }) {
  return (
    <>
      <h3 className="cr__title">{title}</h3>
      {sub && <p className="cr__sub">{sub}</p>}
    </>
  )
}

// A thin bar split into parts, with short keys under it. Used at the foot of
// every headline tile so the four tiles end on the same line.
function SplitBar({ parts, keys }) {
  return (
    <div className="cr__split">
      <span className="cr__split-bar" aria-hidden="true">
        {parts.map((part, i) => (
          <span key={i} className={`cr__tone--${part.tone}`} style={{ flexGrow: part.share }} />
        ))}
      </span>
      {keys && (
        <span className="cr__split-keys">
          {keys.map((key) => (
            <span key={key}>
              <RichText>{key}</RichText>
            </span>
          ))}
        </span>
      )}
    </div>
  )
}

function Headline({ tiles }) {
  return (
    <ul className="cr__tiles">
      {tiles.map((tile) => (
        <li className="cr__card cr__tile" key={tile.label}>
          <p className="cr__value">
            {tile.value}
            {tile.suffix && <small>{tile.suffix}</small>}
          </p>
          <p className="cr__label">{tile.label}</p>
          {tile.note && <p className="cr__note">{unbroken(tile.note)}</p>}
          {tile.bar && <SplitBar parts={tile.bar} keys={tile.keys} />}
        </li>
      ))}
    </ul>
  )
}

// Daily cost as stacked columns: GPU on top in the accent, everything else
// under it in grey. Heights share one scale, the largest day.
function Daily({ daily }) {
  const max = Math.max(...daily.days.map((day) => day.total))
  return (
    <section className="cr__card">
      <Head title={daily.title} sub={daily.sub} />
      <div className="cr__days" role="img" aria-label={daily.days.map((d) => `${d.label} $${d.total}`).join(', ')}>
        {daily.days.map((day) => {
          const gpu = day.gpu ?? 0
          return (
            <div className="cr__day" key={day.label}>
              <span className="cr__day-value">${day.total.toFixed(2)}</span>
              {gpu > 0 && <span className="cr__day-gpu" style={{ height: `${(gpu / max) * 100}%` }} />}
              <span
                className={`cr__day-rest${gpu ? '' : ' cr__day-rest--top'}`}
                style={{ height: `max(2px, ${((day.total - gpu) / max) * 100}%)` }}
              />
              <span className="cr__day-label">{day.label}</span>
            </div>
          )
        })}
      </div>
      <p className="cr__legend">
        <span>
          <i className="cr__tone--accent" />
          {daily.legend[0]}
        </span>
        <span>
          <i className="cr__tone--muted" />
          {daily.legend[1]}
        </span>
        {daily.legend[2] && <span>{daily.legend[2]}</span>}
      </p>
      <Prose>{daily.text}</Prose>
    </section>
  )
}

// Three columns against a dashed budget line. The budget line sits at its
// own height on the same scale as the columns.
function Budget({ budget }) {
  const max = Math.max(...budget.bars.map((bar) => bar.value))
  return (
    <section className="cr__card">
      <Head title={budget.title} sub={budget.sub} />
      <div className="cr__cols">
        <span className="cr__limit" style={{ bottom: `${(budget.limit / max) * 100}%` }}>
          <span>${budget.limit} budget</span>
        </span>
        {budget.bars.map((bar) => (
          <div className="cr__col" key={bar.label}>
            <span className="cr__col-value">
              {bar.display}
              {bar.per && <small>{bar.per}</small>}
            </span>
            <span className={`cr__col-bar cr__tone--${bar.tone}`} style={{ height: `${(bar.value / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="cr__col-keys">
        {budget.bars.map((bar) => (
          <div key={bar.label}>
            <b>{bar.label}</b>
            <span>{bar.detail}</span>
          </div>
        ))}
      </div>
      {budget.text.map((text) => (
        <Prose key={text}>{text}</Prose>
      ))}
    </section>
  )
}

function Breakdown({ card }) {
  const max = Math.max(...card.rows.map((row) => row.value))
  return (
    <section className="cr__card cr__card--fill">
      <Head title={card.title} sub={card.sub} />
      <dl className="cr__rows">
        {card.rows.map((row) => (
          <div className="cr__row" key={row.label}>
            <dt>{row.label}</dt>
            <dd>
              <span
                className={`cr__row-bar cr__tone--${row.strong ? 'accent' : 'muted'}`}
                style={{ width: `max(2px, ${(row.value / max) * 100}%)` }}
              />
            </dd>
            <dd className="cr__row-value">${row.value.toFixed(2)}</dd>
          </div>
        ))}
      </dl>
      <Prose>{card.text}</Prose>
    </section>
  )
}

function Levers({ levers }) {
  return (
    <section className="cr__card">
      <Head title={levers.title} sub={levers.sub} />
      <div className="cr__lever cr__lever--head">
        <span>{levers.head[0]}</span>
        <span>{levers.head[1]}</span>
      </div>
      <ul className="cr__levers">
        {levers.items.map((item) => (
          <li className={`cr__lever cr__lever--${item.saved ? 'saved' : 'unsaved'}`} key={item.action}>
            <span>
              <span className="cr__lever-action">{item.action}</span>
              <span className="cr__lever-why">{unbroken(item.tradeoff)}</span>
            </span>
            <span className="cr__lever-result">
              <span className="cr__lever-amount">{item.amount} / mo</span>
              <span className="cr__lever-status">{item.saved ? 'Saved' : 'Not saved'}</span>
            </span>
          </li>
        ))}
      </ul>
      <Prose>{levers.text}</Prose>
    </section>
  )
}

function Misses({ misses }) {
  return (
    <section className="cr__card">
      <Head title={misses.title} sub={misses.sub} />
      <ul className="cr__misses">
        {misses.items.map((item) => (
          <li key={item.amount}>
            <span className="cr__miss-amount">{item.amount}</span>
            <p className="cr__text">
              <RichText>{unbroken(item.text)}</RichText>
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Production({ production }) {
  return (
    <section className="cr__card">
      <Head title={production.title} sub={production.sub} />
      <span className="cr__stack" aria-hidden="true">
        {production.segments.map((segment) => (
          <span key={segment.label} className={`cr__tone--${segment.tone}`} style={{ flexGrow: segment.value }}>
            {segment.label}
          </span>
        ))}
      </span>
      <p className="cr__ticks">
        {production.ticks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </p>
      {production.text.map((text) => (
        <Prose key={text}>{text}</Prose>
      ))}
    </section>
  )
}

export default function CostReport({ cost }) {
  return (
    <div className="cr">
      <Headline tiles={cost.headline} />
      <Daily daily={cost.daily} />
      <Budget budget={cost.budget} />
      <div className="cr__pair">
        {cost.breakdown.map((card) => (
          <Breakdown card={card} key={card.title} />
        ))}
      </div>
      <Levers levers={cost.levers} />
      <Misses misses={cost.misses} />
      <Production production={cost.production} />
      <section className="cr__card cr__card--mine">
        <Head title={cost.mine.title} />
        {cost.mine.text.map((text) => (
          <Prose key={text}>{text}</Prose>
        ))}
      </section>
    </div>
  )
}
