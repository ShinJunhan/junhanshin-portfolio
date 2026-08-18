import { GithubIcon, NotionIcon, DashboardIcon, CodeIcon } from '../icons.jsx'

// The link row, in a fixed order so it reads the same on every project page.
// `always: true` means the entry appears whether or not there is a URL yet —
// GitHub is expected on every project and Notion on every team project, so
// either one missing should be visible rather than silent. `teamOnly` entries
// drop out entirely for solo work, where there is no team space to link to.
export const LINK_KINDS = [
  { id: 'github', label: 'GitHub', icon: GithubIcon, always: true },
  { id: 'notion', label: 'Notion', icon: NotionIcon, always: true, teamOnly: true },
  { id: 'dashboard', label: 'View Live Dashboard', icon: DashboardIcon },
  { id: 'terraform', label: 'Browse Terraform Code', icon: CodeIcon },
]

// Whether the section has anything to show at all — used both here and by the
// section registry's presence check, so the two can't disagree.
export function visibleLinkKinds(project) {
  const hasTeam = Boolean(project.team?.length)
  return LINK_KINDS.filter((kind) => {
    if (kind.teamOnly && !hasTeam) return false
    return kind.always || Boolean(project.links?.[kind.id])
  })
}

export default function LinksSection({ project }) {
  return (
    <ul className="links">
      {visibleLinkKinds(project).map((kind) => {
        const href = project.links?.[kind.id]
        const Icon = kind.icon

        // An `always` entry with no URL yet: same chip, inert, and announced
        // as unavailable rather than being a dead link.
        if (!href) {
          return (
            <li key={kind.id}>
              <span className="link-chip link-chip--pending" aria-disabled="true">
                <Icon />
                {kind.label}
                <span className="sr-only"> — link not available yet</span>
              </span>
            </li>
          )
        }

        return (
          <li key={kind.id}>
            <a className="link-chip" href={href} target="_blank" rel="noreferrer">
              <Icon />
              {kind.label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
