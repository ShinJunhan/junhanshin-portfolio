import RichText from '../../lib/richText.jsx'

// Problem and context as an idea board rather than a paragraph: the four
// things worth knowing before reading anything else are four separate
// thoughts, and a reader scanning the page should be able to take one of them
// without reading the other three. Pinned notes make that structure visible in
// a way a block of prose cannot.
//
// Every note is a complete sentence, deliberately. The format invites
// fragments — "3am pages", "self-healing, not just alerting" — and a fragment
// only works for someone who already knows the project. These are written for
// a first-time reader with no prior context, which is the whole point of the
// section.
//
// `context` takes either shape, so no other project has to change:
//   'One paragraph.'            prose, as before
//   ['First.', 'Second.']       several paragraphs
//   { notes: [{ label, text }] } the board
function notesOf(context) {
  if (context && !Array.isArray(context) && typeof context === 'object') {
    return context.notes ?? []
  }
  return null
}

// The tilt. Fixed per position rather than random: a random angle changes on
// every render, so a note would jump each time React re-rendered the section,
// and no two readers would see the same page. Alternating sign keeps adjacent
// notes from leaning the same way, which reads as a slipped grid rather than
// as a pinned board.
const TILTS = [-1.9, 1.4, -1.1, 2.1, -1.6, 1.2]

// Two tints, alternating down the board. Four notes in one wash read as a
// single block that happened to be cut into four; alternating gives the board
// the look of paper picked out of two piles, which is what a board of notes
// actually looks like.
//
// Both are colours the page already owns: the project's own accent and the
// palette's indigo. Deliberately not a third hue — one accent per themed page
// is the rule, and indigo is the base the whole site is drawn in rather than a
// second accent competing with this project's.
//
// `--c-indigo` rather than `--accent-base`, which is the same #3E5C89 in light
// mode but lifts to #3B82F6 in dark — within a few points of --name-pop, and
// that colour is Junhan's alone site-wide. `--c-indigo` lifts to #7EA3D8
// instead and stays clear of it in both themes.
const TINTS = ['var(--accent)', 'var(--c-indigo)']

export default function ContextSection({ project }) {
  const notes = notesOf(project.context)

  if (notes?.length) {
    return (
      <ul className="board">
        {notes.map((note, i) => (
          <li
            // `size` is editorial and comes from the data: which of these a
            // reader has to take and which are context around them is a fact
            // about the project, not about the layout.
            className={`board__note board__note--${note.size === 'lead' ? 'lead' : 'support'}`}
            key={note.label ?? i}
            style={{
              '--tilt': `${TILTS[i % TILTS.length]}deg`,
              '--note-tint': TINTS[i % TINTS.length],
            }}
          >
            {/* The pin. Drawn rather than a glyph, and decorative — the note
                is a list item, which is what carries the structure. */}
            <span className="board__pin" aria-hidden="true" />
            {note.label && <h3 className="board__label">{note.label}</h3>}
            <p className="board__text">
              <RichText>{note.text}</RichText>
            </p>
          </li>
        ))}
      </ul>
    )
  }

  const paragraphs = [].concat(project.context)

  return (
    <div className="prose">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>
          <RichText>{paragraph}</RichText>
        </p>
      ))}
    </div>
  )
}
