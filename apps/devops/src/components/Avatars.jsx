// Circular initial avatars for the Members section. There is no photo
// anywhere on this site (DESIGN.md), so initials on the accent palette stand
// in for one.

// Cycled per position so a team reads as several people rather than one
// repeated swatch. Deliberately the section-accent palette, not new colors.
const AVATAR_TINTS = [
  'var(--c-indigo)',
  'var(--c-coral)',
  'var(--c-orange)',
  'var(--c-emerald)',
  'var(--c-steel)',
  'var(--c-forest)',
]

// "Junhan Shin" -> "JS", "Cher" -> "C". Two letters at most; a longer stack
// stops reading as a monogram.
function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export default function Avatars({ team }) {
  if (!team?.length) return null

  return (
    <ul className="avatars" aria-label="Team members">
      {team.map((member, i) => (
        <li
          key={member.name}
          className="avatars__item"
          style={{ '--avatar-tint': AVATAR_TINTS[i % AVATAR_TINTS.length] }}
        >
          <span className="avatars__circle" aria-hidden="true">
            {initialsOf(member.name)}
          </span>
          <span className="avatars__name">{member.name}</span>
        </li>
      ))}
    </ul>
  )
}
