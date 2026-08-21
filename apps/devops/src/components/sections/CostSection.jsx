import RichText from '../../lib/richText.jsx'
import EmptySlot from './EmptySlot.jsx'

// What the architecture costs, against what the same architecture would have
// cost built the obvious way. Two series, two colours and no more: the
// comparison is grey and the project is the page's accent, so which bar is
// "us" needs no legend lookup to work out.
//
// Bars run horizontally because the row labels are phrases rather than dates —
// vertical bars would have put "Outbound routing" under a 40px column at an
// angle. Rows are ordered by the size of the gap, largest first, so the
// section leads with the decision that saved the most.
//
// This sits last in Tech & Architecture rather than up with the metrics. The
// numbers are estimates against free-tier usage, not production billing, and
// they mean something to a reader who already knows the architecture and very
// little to one who does not.
//
// `cost` in a project's data:
//
//   unit    what the numbers are, e.g. 'USD / month'
//   series  [{ id, label }, { id, label }] — first grey, second accent
//   items   [{ label, note, <seriesId>: number, … }]
//   total   optional { <seriesId>: number } summary row
//   notes   the bullets beside the chart
//   caveat  the one line that says these are estimates

// Bars are a share of the largest number anywhere in the chart, so every row
// is on the same scale and a small row reads as small.
function scaleOf(items, series) {
  const values = items.flatMap((item) => series.map((s) => item[s.id] ?? 0))
  return Math.max(...values, 1)
}

// `$0.00` rather than `$0` — a column of money that changes width per row
// reads as sloppy, and zero is the whole point of several of these rows.
function money(value, unit) {
  const symbol = unit?.startsWith('USD') ? '$' : ''
  return `${symbol}${Number(value).toFixed(2)}`
}

export default function CostSection({ project }) {
  const cost = project.cost

  if (!cost?.items?.length) {
    return <EmptySlot>No cost analysis added yet.</EmptySlot>
  }

  const series = cost.series ?? []
  const max = scaleOf(cost.items, series)

  return (
    <div className="cost">
      <div className="cost__chart">
        <p className="cost__key">
          {series.map((s, i) => (
            <span className={`cost__key-item cost__key-item--${i === 0 ? 'base' : 'ours'}`} key={s.id}>
              <span className="cost__swatch" aria-hidden="true" />
              {s.label}
            </span>
          ))}
          <span className="cost__unit">{cost.unit}</span>
        </p>

        {/* A description list, not a table: each row is one label and its two
            readings, and the numbers are printed next to their own bars — so
            the chart is legible read straight through, with no separate data
            table hiding behind it for assistive tech. */}
        <dl className="cost__rows">
          {cost.items.map((item) => (
            <div className="cost__row" key={item.label}>
              <dt className="cost__row-label">
                {item.label}
                {item.note && <span className="cost__row-note">{item.note}</span>}
              </dt>
              <dd className="cost__row-bars">
                {series.map((s, i) => {
                  const value = item[s.id] ?? 0
                  return (
                    <span
                      className={`cost__bar cost__bar--${i === 0 ? 'base' : 'ours'}`}
                      key={s.id}
                    >
                      {/* The bar lives in its own track and the figure sits
                          beside it, so a full-length bar still has somewhere
                          to print its number and a zero-length one is not
                          hiding the number inside itself. Several of these
                          rows are zero; that is the point of the chart. */}
                      <span className="cost__bar-track">
                        <span
                          className="cost__bar-fill"
                          style={{ '--share': `${(value / max) * 100}%` }}
                        />
                      </span>
                      <span className="cost__bar-value">
                        {money(value, cost.unit)}
                        <span className="sr-only"> — {s.label}</span>
                      </span>
                    </span>
                  )
                })}
              </dd>
            </div>
          ))}

        </dl>
      </div>

      {/* The total and the caveat are the two columns' footers, and they are
          siblings in one grid row rather than the last child of each column.
          Nested, each sat above its own column's bottom edge by its own height
          — so the two rules that head them landed at different heights and the
          section read as two panels that had been placed side by side. In the
          same row they start on the same line, and one rule runs across the
          section. */}
      <div className="cost__foot cost__foot--chart">
        {cost.total && (
          <dl className="cost__row cost__row--total">
            <dt className="cost__row-label">Total</dt>
            <dd className="cost__row-bars">
              {series.map((s, i) => (
                <span className={`cost__total cost__total--${i === 0 ? 'base' : 'ours'}`} key={s.id}>
                  {money(cost.total[s.id] ?? 0, cost.unit)}
                  <span className="sr-only"> — {s.label}</span>
                </span>
              ))}
            </dd>
          </dl>
        )}
      </div>

      <div className="cost__read">
        <ul className="cost__notes">
          {(cost.notes ?? []).map((note) => (
            <li key={note}>
              <RichText>{note}</RichText>
            </li>
          ))}
        </ul>
      </div>

      <div className="cost__foot cost__foot--read">
        {cost.caveat && (
          <p className="cost__caveat">
            <RichText>{cost.caveat}</RichText>
          </p>
        )}
      </div>
    </div>
  )
}
