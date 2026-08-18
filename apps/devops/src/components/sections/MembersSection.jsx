import Avatars from '../Avatars.jsx'

// The team, as its own section rather than a row of initials tucked beside
// the date. Each circle carries the member's initials with the full name
// underneath, so the section reads on its own.
export default function MembersSection({ project }) {
  return <Avatars team={project.team} />
}
