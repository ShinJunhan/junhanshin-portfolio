import { useState } from 'react'
import RichText from '../../lib/richText.jsx'
import { techIcon, techInitial } from '../../data/tech.js'
import useMediaQuery from '../../lib/useMediaQuery.js'
import TechStackWheel from './TechStackWheel.jsx'

// A radial layout cannot be shrunk into a phone — twenty icons on a ring at
// 375px would be unreadable at any icon size. Below this the grouped card list
// renders instead, which is a different layout rather than a smaller one.
const WHEEL_MIN_WIDTH = '(min-width: 861px)'

// Grouped under category labels rather than one flat run of marks — a stack
// this size reads better sorted into what each tool is *for*. Static grouping
// on purpose: this is a handful of items per project, not the landing page's
// filterable skills honeycomb, and a filter would be interaction for its own
// sake.
//
// `stack` takes either shape:
//   ['AWS', 'Terraform']                            one unlabelled group
//   [{ category: 'IaC/Automation', items: [...] }]  labelled groups
// so a project that has no useful categories can stay a plain list.
function groupsOf(stack) {
  if (!stack?.length) return []
  if (typeof stack[0] === 'string') return [{ category: null, items: stack }]
  return stack.filter((group) => group?.items?.length)
}

// A stack entry with no logo on disk yet falls back to a monogram tile, so the
// row stays even and nothing shows as a broken image.
function Tech({ item }) {
  const icon = techIcon(item)

  return (
    <li className="tech">
      <span className="tech__mark">
        {icon ? (
          // Decorative: the label sits right next to it in text.
          <img src={icon} alt="" loading="lazy" />
        ) : (
          <span className="tech__initial" aria-hidden="true">
            {techInitial(item)}
          </span>
        )}
      </span>
      <span className="tech__label">{item}</span>
    </li>
  )
}

// Why the load-bearing tools were picked, at the level of the tool rather than
// the line of code. Deliberately a different scope from Technical Decisions &
// Design Trade-Offs further down the page: this answers "why Terraform at all",
// that one answers "why a NAT instance over a NAT gateway". Four or five
// entries at most — the wheel already lists everything, and a note against
// every tool in it would be a second inventory rather than an argument.
//
// The same disclosure row Implementation Steps uses, for the same reason it
// uses one: four answers shown at once is four paragraphs of prose stacked
// beside a wheel, and a reader who wants none of them still has to scroll past
// all of them. The headings are questions because that is what a collapsed row
// should be — the thing you click is the question, and the panel is the answer.
//
// `stackNotes` in a project's data: [{ tool, icon, text }]. `icon` names the
// tech whose mark to borrow, so the row shows the same graphic the wheel does
// for that tool — including the monogram fallback, which is what the wheel
// shows for anything with no logo file on disk.
function ToolNote({ note, open, onToggle, index }) {
  const icon = techIcon(note.icon ?? note.tool)

  return (
    // `--disclosure-i` is the row's place in the list, and it is only ever read
    // when the wrapper is cascading — see `disclosures--cascade`.
    <li
      className={`disclosure${open ? ' disclosure--open' : ''}`}
      style={{ '--disclosure-i': index }}
    >
      <h3 className="disclosure__heading">
        <button
          type="button"
          className="disclosure__toggle"
          aria-expanded={open}
          aria-controls={`tool-${note.tool}`}
          onClick={onToggle}
        >
          <span className="tool-note__icon" aria-hidden="true">
            {icon ? (
              <img src={icon} alt="" loading="lazy" />
            ) : (
              <span className="tool-note__initial">{techInitial(note.icon ?? note.tool)}</span>
            )}
          </span>
          <span className="tool-note__question">{note.tool}</span>
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

      {/* Always mounted so it can animate, `inert` while shut so a zero-height
          panel is not read out — the same contract the phase panel keeps. */}
      <div
        className="disclosure__panel"
        id={`tool-${note.tool}`}
        data-open={open ? 'true' : 'false'}
        inert={open ? undefined : ''}
      >
        <div className="disclosure__panel-inner">
          <p>
            <RichText>{note.text}</RichText>
          </p>
        </div>
      </div>
    </li>
  )
}

function StackNotes({ notes }) {
  // Collapsed by default, and each one minds its own state — the same as the
  // phase list, and for the same reason: these are four independent answers a
  // reader may well want to compare, and an accordion is the one pattern that
  // forbids that.
  const [openIds, setOpenIds] = useState(() => new Set())
  // Whether the last thing the reader did was Expand all rather than click a
  // single row. Opening five panels at once moves the section's bottom edge
  // several hundred pixels, and doing that in one synchronised step reads as a
  // jump however well it is eased; staggering the rows turns the same movement
  // into an unfold. A single click must not be delayed by its own row number,
  // so the stagger is switched on only for the bulk control.
  const [cascade, setCascade] = useState(false)

  if (!notes?.length) return null

  const toggle = (id) => {
    setCascade(false)
    setOpenIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allOpen = openIds.size === notes.length

  return (
    <div className="disclosures__wrap stack-notes">
      {/* The same control the phase list carries, and always live for the same
          reason: the first thing a reader does with four collapsed questions is
          try to open them all. */}
      <div className="disclosures__bar">
        <button
          type="button"
          className="disclosures__all"
          aria-expanded={allOpen}
          onClick={() => {
            setCascade(true)
            setOpenIds(allOpen ? new Set() : new Set(notes.map((note) => note.tool)))
          }}
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      {/* Just the list. There used to be a second, hidden copy of it stacked in
          the same grid cell with every row open, so the column always occupied
          its fully-expanded height and the section's boundary could never move.
          That bought stability at a price the reader actually pays: with five
          notes the reserved height ran far past the wheel beside it, and the
          section opened as a screenful of empty column with a short list at the
          top of it.

          The boundary moves now, and that is the intended behaviour rather than
          a regression. What made the old arrangement necessary was the list
          being centred in its column — opening a row grew it in both directions
          and shifted the rows above out from under the cursor. Anchoring to the
          top fixes that on its own: everything above a panel stays exactly where
          it was, and only what is below it travels. Since the panels already
          animate their own height, the section's bottom edge glides with them
          instead of jumping. */}
      <ol className={`disclosures${cascade ? ' disclosures--cascade' : ''}`}>
        {notes.map((note, index) => (
          <ToolNote
            key={note.tool}
            note={note}
            index={index}
            open={openIds.has(note.tool)}
            onToggle={() => toggle(note.tool)}
          />
        ))}
      </ol>
    </div>
  )
}

export default function StackSection({ project }) {
  const groups = groupsOf(project.stack)
  const wheelFits = useMediaQuery(WHEEL_MIN_WIDTH)
  const notes = project.stackNotes

  // The wheel needs categories to divide the centre into; an unlabelled flat
  // list has nothing to slice, so it stays a list at every width.
  if (wheelFits && groups.length > 1 && groups.every((group) => group.category)) {
    // Centred alone, the wheel left half the section empty and said nothing
    // about *why* any of it was chosen. Off to the left with the reasoning
    // beside it, the section answers both questions at once — and the wheel
    // keeps every bit of its behaviour, since only the box around it moved.
    return (
      <div className={`stack-layout${notes?.length ? '' : ' stack-layout--wheel-only'}`}>
        <TechStackWheel groups={groups} />
        <StackNotes notes={notes} />
      </div>
    )
  }

  // The wheel does not render below its breakpoint, and the notes are not the
  // wheel's — they are the section's argument for why any of this was picked.
  // Losing them with the wheel would have meant a phone reader getting the
  // inventory and none of the reasoning.
  return (
    <>
      <div className="stack-groups">
        {groups.map((group) => (
          <section className="stack-group" key={group.category ?? 'all'}>
            {group.category && <h3 className="stack-group__label">{group.category}</h3>}
            <ul className="stack">
              {group.items.map((item) => (
                <Tech item={item} key={item} />
              ))}
            </ul>
          </section>
        ))}
      </div>
      <StackNotes notes={notes} />
    </>
  )
}
