import { isOwner } from '../data/owner.js'

// Circular initial avatars for the Members section. There is no photo
// anywhere on this site (DESIGN.md), so initials on the accent palette stand
// in for one.

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
          className="avatars__item"
          style={{ '--avatar-tint': tint }}
        >
          <span className="avatars__circle" aria-hidden="true">
            {initialsOf(member)}
          </span>
          <span className="avatars__name">{member.name}</span>
          {/* Optional, and blank for most people — only whoever carries a
              title on the team gets a second line. `role` is accepted as an
              alias so either word works in the data file. */}
          {(member.title ?? member.role) && (
            <span className="avatars__role">{member.title ?? member.role}</span>
          )}
        </li>
      ))}
    </ul>
  )
}
