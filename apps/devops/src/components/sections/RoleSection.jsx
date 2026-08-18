import RichText from '../../lib/richText.jsx'

// Junhan's specific contribution. Narrative prose, so it goes through the
// inline formatter — `code` and **accent-bold** are both live here.
export default function RoleSection({ project }) {
  return (
    <p className="lede">
      <RichText>{project.role}</RichText>
    </p>
  )
}
