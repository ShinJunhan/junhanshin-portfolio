import { useMemo, useState } from 'react'
import RichText from '../../lib/richText.jsx'
import EmptySlot from './EmptySlot.jsx'

// How the project was actually run, month by month. Two things that only work
// together: a calendar that shows *when*, and a list that says *what* — click
// a phase and the calendar answers "and that was these three weeks".
//
// The calendar is the supporting half, not the widget: it takes the narrower
// column and the phase list takes the rest. The two months stack, one above
// the other, so every column has room to spell its weekday name across the top.
//
// Stacking also fixes the accordion. The calendar column is now the taller of
// the two in every state, so the section's height is decided by it and stays
// put — opening a phase slides a panel open *inside* a box that does not move,
// instead of shoving the section's bottom edge and everything below it down
// the page.
//
// `implementation` in a project's data:
//
//   months  ['2026-04', '2026-05']   which grids to draw, in order
//   span    { from, to }             the whole project, lit when nothing is picked
//   phases  [{ id, title, range, from, to, text }]
//
// Dates are plain 'YYYY-MM-DD' strings and every comparison below is a string
// comparison on them. Deliberately not `Date`: `new Date('2026-04-20')` parses
// as UTC midnight and then renders in the reader's zone, so west of Greenwich
// the highlight starts a day early. There is no time here, only calendar days.

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const iso = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

// Day-of-week for the 1st, and how many days the month has. `Date.UTC` is
// safe here because only the arithmetic is used — nothing is ever formatted
// back out of it.
function monthGrid(key) {
  const [y, m] = key.split('-').map(Number)
  const year = y
  const month = m - 1
  const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay()
  const length = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  const cells = []
  // Leading blanks so the 1st lands under its real weekday.
  for (let i = 0; i < firstDay; i += 1) cells.push(null)
  for (let d = 1; d <= length; d += 1) cells.push({ day: d, date: iso(year, month, d) })
  // Trailing blanks to square the last row off — an unfinished row reads as a
  // clipped grid rather than as a month that happens to end mid-week.
  while (cells.length % 7 !== 0) cells.push(null)

  return { label: `${MONTH_NAMES[month]} ${year}`, cells }
}

const within = (date, range) => Boolean(range) && date >= range.from && date <= range.to

export default function StepsSection({ project }) {
  const plan = project.implementation
  // Collapsed by default: the section opens as a list of four phases and a
  // calendar showing the whole run, which is the summary. Opening one is the
  // reader asking for detail, not the page insisting on it.
  //
  // A set, not a single id. As an accordion — one open at a time — opening the
  // next phase shut the one above it and the whole list jumped upward under
  // the cursor, which made a deliberate click feel like a mistake. Four
  // phases in sequence are also a thing a reader wants to compare, and an
  // accordion is the one pattern that forbids that. What a phase does is its
  // own business now; Collapse all is how you get back to the summary.
  const [openIds, setOpenIds] = useState(() => new Set())

  const toggle = (id) =>
    setOpenIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const months = useMemo(() => (plan?.months ?? []).map(monthGrid), [plan])

  if (!plan?.phases?.length) {
    return <EmptySlot>No implementation timeline added yet.</EmptySlot>
  }

  const phases = plan.phases
  // The whole project period is always the pale shade; an opened phase brings
  // its own dates up to full strength on top of it. Two weights of one hue, so
  // the baseline reading is "this is the shape of the project" and opening a
  // phase adds "and this part of it is what you just opened" — never a colour
  // per phase, on a page whose rule is one accent. With several open the lit
  // ranges simply add up, which is the point of being able to open several.
  const litRanges = phases.filter((phase) => openIds.has(phase.id))
  // The control is a toggle, never an inert button. As "Collapse all", greyed
  // out until something was open, it read as broken: the first thing a reader
  // does with a list of four collapsed phases is try to open them all, and the
  // one control on offer did nothing when they clicked it. It now says what it
  // will do from whatever state the list is in, and it always does something.
  const allOpen = litRanges.length === phases.length

  return (
    <div className="steps">
      {/* Stacked, not side by side. Two months across meant seven columns
          each in half the width, which left no room to spell the weekday
          names across the top and forced them onto their side. One month per
          row gives every column the width its name needs. */}
      <div className="steps__calendar" aria-hidden="true">
        {months.map((month) => (
          <div className="cal" key={month.label}>
            <h3 className="cal__title">{month.label}</h3>
            <div className="cal__grid">
              {/* Full names, across the top the way a wall calendar sets
                  them. Spelled out they are the unambiguous version — "Tu"
                  and "Th", "S" and "S" both need a convention the reader has
                  to already share.

                  Both forms are rendered and CSS picks one. Below the width
                  where "Wednesday" fits, the full name was simply being cut
                  off mid-word, which reads as broken rather than as an
                  abbreviation; three letters is a convention everyone does
                  share, and it is a deliberate fallback rather than a clip. */}
              {WEEKDAYS.map((name) => (
                <span className="cal__weekday" key={name}>
                  <span className="cal__weekday-full">{name}</span>
                  <span className="cal__weekday-short">{name.slice(0, 3)}</span>
                </span>
              ))}

              {month.cells.map((cell, i) =>
                cell === null ? (
                  <span className="cal__cell cal__cell--void" key={`void-${i}`} />
                ) : (
                  <span
                    className="cal__cell"
                    key={cell.date}
                    // Three states, one hue: outside the project entirely,
                    // inside it but not in the open phase, and lit.
                    data-in={within(cell.date, plan.span) ? 'true' : undefined}
                    data-lit={
                      litRanges.some((range) => within(cell.date, range)) ? 'true' : undefined
                    }
                  >
                    <span className="cal__date">{cell.day}</span>
                  </span>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* The primary half. A list of disclosures, not a tablist: each row is
          independently openable, and `aria-expanded` on a button controlling a
          region is what a screen reader already knows how to announce. */}
      <div className="disclosures__wrap">
        {/* Always here, always live, and it names the state it will move the
            list to rather than the state it is in. Reserving its row also means
            opening a phase never nudges the list down by the height of a
            button. */}
        <div className="disclosures__bar">
          <button
            type="button"
            className="disclosures__all"
            aria-expanded={allOpen}
            onClick={() =>
              setOpenIds(allOpen ? new Set() : new Set(phases.map((phase) => phase.id)))
            }
          >
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        </div>

        <ol className="disclosures">
        {phases.map((phase, index) => {
          const isOpen = openIds.has(phase.id)

          return (
            <li className={`disclosure${isOpen ? ' disclosure--open' : ''}`} key={phase.id}>
              <h3 className="disclosure__heading">
                <button
                  type="button"
                  className="disclosure__toggle"
                  aria-expanded={isOpen}
                  aria-controls={`phase-${phase.id}`}
                  // Each phase minds its own state; clicking one never shuts
                  // another. Clicking an open one closes it, and closing the
                  // last one returns the calendar to the whole-project view.
                  onClick={() => toggle(phase.id)}
                >
                  <span className="phase__index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="phase__name" id={`phase-${phase.id}-label`}>
                    {phase.title}
                  </span>
                  <span className="phase__range">{phase.range}</span>
                  {/* A chevron that turns, drawn rather than a character so it
                      keeps the site's one stroke weight. */}
                  <svg
                    className="disclosure__chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </h3>

              {/* Always mounted, so it can be animated open and shut. Mounting
                  on demand was what made this feel abrupt: an element that
                  does not exist has no height to grow *from*, so the panel
                  appeared at full size on the first frame and the list under
                  it jumped. The height is animated in CSS by a grid row going
                  0fr -> 1fr, which is the one way to transition to a height
                  nobody has measured.

                  `inert` while shut rather than `hidden`: hidden would take it
                  out of layout and kill the transition with it, but a
                  zero-height panel left in the accessibility tree would still
                  be read out. Inert removes it from that tree and from tab
                  order while leaving the box in place to animate. */}
              <div
                className="disclosure__panel"
                id={`phase-${phase.id}`}
                data-open={isOpen ? 'true' : 'false'}
                role="region"
                aria-labelledby={`phase-${phase.id}-label`}
                inert={isOpen ? undefined : ''}
              >
                <div className="disclosure__panel-inner">
                  <p>
                    <RichText>{phase.text}</RichText>
                  </p>
                </div>
              </div>
            </li>
          )
        })}
        </ol>
      </div>
    </div>
  )
}
