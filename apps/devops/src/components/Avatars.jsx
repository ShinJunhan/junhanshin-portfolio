import { isOwner } from '../data/owner.js'
import useSectionReached from '../lib/useSectionReached.js'

// Circular initial avatars for the Members section. There is no photo anywhere
// on this site (DESIGN.md), so initials on the accent palette stand in for one.
//
// A tight row of initials, and nothing else. It used to spread each member
// across a full grid track with the name beneath and a role line under that,
// which was a section's worth of height for a fact — five people, these five —
// that a reader takes in at a glance and does not come back to. The names live
// in each circle's accessible name and its tooltip; the one role that a reader
// actually needs is Junhan's, and that is stated in full in My Role directly
// below.

// Cycled per position so a team reads as several people rather than one
// repeated swatch.
//
// No blue in this list, deliberately. --name-pop is Junhan's colour site-wide,
// and the old palette led with --c-indigo, which put a near-identical blue on
// whoever happened to be listed first — usually the team lead. Teammates now
// draw from warm and green hues only, so his circle is the only blue one on
// any project.
const AVATAR_TINTS = [
  'var(--c-coral)',
  'var(--c-orange)',
  'var(--c-emerald)',
  'var(--c-forest)',
  'var(--c-steel)',
  'var(--c-violet)',
]

// "Junhan Shin" -> "JS", "Cher" -> "C". Two letters at most; a longer stack
// stops reading as a monogram.
//
// A member can set `initials` to override this. Korean given names romanize
// as two syllables — Hwijeong Cho goes by HJ, not HC — so deriving from the
// written name gets it wrong for exactly the people most likely to notice.
function initialsOf(member) {
  if (member.initials) return member.initials
  return member.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export default function Avatars({ team }) {
  // Junhan's circle lights up as My Role arrives on screen, tying the row of
  // five to the section that explains which of them he was. Once per visit —
  // see useSectionReached.
  const lit = useSectionReached('role')

  if (!team?.length) return null

  // Tints are handed out before render so the owner can be skipped in the
  // rotation: his position on a team must not shift which colour anyone else
  // gets, and he always takes --name-pop wherever he is in the list.
  let next = 0
  const tinted = team.map((member) => ({
    member,
    tint: isOwner(member) ? 'var(--name-pop)' : AVATAR_TINTS[next++ % AVATAR_TINTS.length],
  }))

  return (
    <ul className="avatars" aria-label="Team members">
      {tinted.map(({ member, tint }) => (
        <li
          key={member.name}
          className={'avatars__item' + (isOwner(member) ? ' avatars__item--owner' : '')}
          style={{ '--avatar-tint': tint }}
        >
          {/* `title` gives the pointer a name, the `sr-only` span gives
              assistive tech one. With the printed name gone the initials are
              the only visible label, and two letters are not a name — so the
              full one has to be reachable both ways rather than either. */}
          <span
            className={
              'avatars__circle' + (isOwner(member) && lit ? ' avatars__circle--lit' : '')
            }
            title={member.name}
          >
            <span aria-hidden="true">{initialsOf(member)}</span>
            <span className="sr-only">{member.name}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
