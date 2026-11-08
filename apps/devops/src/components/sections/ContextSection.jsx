import RichText from '../../lib/richText.jsx'
import ContextVisual from './ContextVisuals.jsx'

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

// The collage board (`layout: 'collage'`). Steeper tilts than the even grid,
// because the uneven placement already says "pinned by hand" and the notes can
// lean further without reading as a broken grid. The tint follows each note's
// `tone` instead of its position, so the colour tells the reader what kind of
// note it is: why the project exists, what it built on, or where it stops.
const COLLAGE_TILTS = [-1.6, 2.4, -2.2, 1.8, -2.6, 1.4]
const TONE_TINTS = {
  why: 'var(--accent)',
  what: 'var(--c-indigo)',
  limit: 'var(--ink)',
}

// Keeps the last two words of a note together, so a justified paragraph never
// ends on a single word where `text-wrap: pretty` is not supported.
function glueLastWord(text) {
  return String(text ?? '').replace(/ (?=\S+$)/, ' ')
}

// The `pinned` board (Midam): fewer, longer notes on the project's own grid,
// each one a short list of complete sentences beside a small picture. Gentle
// tilts, since these notes are large and a steep angle on a wide card reads as
// a broken layout. The first three are the problem (accent tint); the last two
// are the team's constraints, in steel.
const PINNED_TILTS = [-0.6, 0.8, -0.9, 0.4, -0.5]
const PINNED_TINTS = { team: 'var(--c-steel)' }
// The notes that run the full width, which give their picture more room.
const WIDE_AREAS = new Set(['f', 'e', 'b'])

function Bullets({ items }) {
  return (
    <ul className="pin-note__list">
      {items.map((item) => (
        <li key={item}>
          <span>
            <RichText>{glueLastWord(item)}</RichText>
          </span>
        </li>
      ))}
    </ul>
  )
}

function PinnedBoard({ notes }) {
  return (
    <ul className="pin-board">
      {notes.map((note, i) => (
        <li
          key={note.title}
          className={'board__note pin-note' + (WIDE_AREAS.has(note.area) ? ' pin-note--wide' : '')}
          style={{
            gridArea: note.area,
            '--tilt': `${PINNED_TILTS[i % PINNED_TILTS.length]}deg`,
            '--note-tint': PINNED_TINTS[note.tone] ?? 'var(--accent)',
          }}
        >
          <span className="board__pin" aria-hidden="true" />
          <div className="pin-note__visual">
            <ContextVisual name={note.visual} />
          </div>
          <div className="pin-note__body">
            <h3 className="pin-note__title">{glueLastWord(note.title)}</h3>
            <Bullets items={note.items} />
            {note.needs && (
              <>
                <p className="pin-note__intro">{note.needs.intro}</p>
                <ul className="pin-note__tiles">
                  {note.needs.tiles.map((tile) => (
                    <li key={tile.label}>
                      <span className="pin-note__tile-label">{tile.label}</span>
                      <span className="pin-note__tile-text">
                        <RichText>{tile.text}</RichText>
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {note.after && <Bullets items={note.after} />}
          </div>
        </li>
      ))}
    </ul>
  )
}

// The `track` board (Project1-Self-Build): one wide note for why the project
// exists, then a progress track whose four stages each sit above one note. The
// track's dots and labels deepen from the border colour to the accent as the
// stages advance. Where the four notes cannot sit in one row, the track hides
// and each note shows its own stage name instead.
const TRACK_TILTS = [-1.2, 1.6, -1.4, 1.9, -1.7]

function TrackBoard({ notes }) {
  const [hero, ...steps] = notes
  const fillOf = (i) => `${Math.round(((i + 1) / steps.length) * 100)}%`

  return (
    <ul className="board board--track">
      <li
        className="board__note board__note--lead board__note--wide"
        style={{ '--tilt': `${TRACK_TILTS[0]}deg`, '--note-tint': TINTS[0] }}
      >
        <span className="board__pin" aria-hidden="true" />
        <h3 className="board__label">{hero.label}</h3>
        <p className="board__text">
          <RichText>{glueLastWord(hero.text)}</RichText>
        </p>
      </li>
      <li className="board__track" aria-hidden="true">
        {steps.map((step, i) => (
          <span key={step.stage} style={{ '--fill': fillOf(i) }}>
            {step.stage}
          </span>
        ))}
      </li>
      {steps.map((step, i) => (
        <li
          key={step.label}
          className="board__note board__note--support"
          style={{
            '--tilt': `${TRACK_TILTS[(i + 1) % TRACK_TILTS.length]}deg`,
            '--note-tint': TINTS[(i + 1) % TINTS.length],
          }}
        >
          <span className="board__pin" aria-hidden="true" />
          <span className="board__stage" style={{ '--fill': fillOf(i) }}>
            {step.stage}
          </span>
          <h3 className="board__label">{step.label}</h3>
          <p className="board__text">
            <span className="board__lede">
              <RichText>{glueLastWord(step.lede)}</RichText>
            </span>
            <RichText>{glueLastWord(step.text)}</RichText>
          </p>
        </li>
      ))}
    </ul>
  )
}

// The `compare` board (ShimonVault): one pinned note per Lock‑N‑Lock track,
// two across. Each note reads top to bottom as the team's approach (on a
// shaded band, in the small grey size), what that setup lacked, and what this
// project set out to practice (in the reading size). Every paragraph is
// justified with its last two words bound, and the wording was tuned in the
// browser so no paragraph ends on a near-empty line.
const COMPARE_TILTS = [-1.2, 1.4, -1.6, 1.1]

function CompareBoard({ notes }) {
  return (
    <ul className="board board--compare">
      {notes.map((note, i) => {
        const [team, setup, focus] = note.parts
        return (
          <li
            key={note.label}
            className="board__note"
            style={{
              '--tilt': `${COMPARE_TILTS[i % COMPARE_TILTS.length]}deg`,
              '--note-tint': TINTS[i % TINTS.length],
            }}
          >
            <span className="board__pin" aria-hidden="true" />
            <h3 className="board__label">{note.label}</h3>
            <div className="compare__team">
              <p className="compare__cap">{team.caption}</p>
              <p className="compare__text compare__text--team">
                <RichText>{glueLastWord(team.text)}</RichText>
              </p>
            </div>
            <p className="compare__cap compare__cap--accent">{setup.caption}</p>
            <p className="compare__text compare__text--setup">
              <RichText>{glueLastWord(setup.text)}</RichText>
            </p>
            <p className="compare__cap compare__cap--accent">{focus.caption}</p>
            <p className="compare__text compare__text--focus">
              <RichText>{glueLastWord(focus.text)}</RichText>
            </p>
          </li>
        )
      })}
    </ul>
  )
}

export default function ContextSection({ project }) {
  const notes = notesOf(project.context)
  const collage = project.context?.layout === 'collage'

  if (project.context?.layout === 'compare' && notes?.length) {
    return <CompareBoard notes={notes} />
  }

  if (project.context?.layout === 'pinned' && notes?.length) {
    return <PinnedBoard notes={notes} />
  }

  if (project.context?.layout === 'track' && notes?.length) {
    return <TrackBoard notes={notes} />
  }

  if (notes?.length) {
    return (
      <ul className={collage ? 'board board--collage' : 'board'}>
        {notes.map((note, i) => (
          <li
            // `size` is editorial and comes from the data: which of these a
            // reader has to take and which are context around them is a fact
            // about the project, not about the layout.
            className={
              collage
                ? `board__note${note.hero ? ' board__note--hero' : ''}`
                : `board__note board__note--${note.size === 'lead' ? 'lead' : 'support'}`
            }
            key={note.label ?? i}
            style={{
              '--tilt': `${(collage ? COLLAGE_TILTS : TILTS)[i % TILTS.length]}deg`,
              '--note-tint': collage
                ? TONE_TINTS[note.tone] ?? TONE_TINTS.why
                : TINTS[i % TINTS.length],
            }}
          >
            {/* The pin. Drawn rather than a glyph, and decorative — the note
                is a list item, which is what carries the structure. */}
            <span className="board__pin" aria-hidden="true" />
            {note.label && <h3 className="board__label">{note.label}</h3>}
            <p className="board__text">
              {/* An optional opening sentence set larger, for the one support
                  note on a board that should break the run of same-sized
                  cards. It is the note's own first sentence, not an extra
                  headline, so the text still reads straight through. */}
              {note.lede && (
                <span className="board__lede">
                  <RichText>{note.lede}</RichText>
                </span>
              )}
              <RichText>{collage ? glueLastWord(note.text) : note.text}</RichText>
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
