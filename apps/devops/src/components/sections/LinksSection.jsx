import { GithubIcon, NotionIcon, DashboardIcon, DocIcon, SlidesIcon } from '../icons.jsx'

// Every link a project can carry, in the order each group shows them.
//
//   group     which section renders it — 'workspace' sits at the top of the
//             page under the team's name, 'resources' further down
//   always    show the entry even with no URL yet, as an inert placeholder,
//             so a missing link is visible rather than silent
//   teamOnly  drops out entirely for solo work, where there is no team space
//
// Terraform is deliberately not here: it has its own section with the code
// inline and the repo link underneath, so a tile would point at the same URL
// twice.
export const LINK_KINDS = [
  { id: 'github', label: 'GitHub', icon: GithubIcon, group: 'workspace', always: true },
  {
    id: 'notion',
    label: 'Notion',
    icon: NotionIcon,
    group: 'workspace',
    always: true,
    teamOnly: true,
  },
  { id: 'readme', label: 'README', icon: DocIcon, group: 'resources', always: true },
  {
    id: 'dashboard',
    label: 'Live Dashboard',
    icon: DashboardIcon,
    group: 'resources',
    always: true,
  },
  { id: 'presentation', label: 'Presentation', icon: SlidesIcon, group: 'resources', always: true },
]

// Which entries a given group shows for a given project. Used both to render
// and as the section registry's presence check, so the two can't disagree.
export function visibleLinkKinds(project, group) {
  const hasTeam = Boolean(project.team?.length)

  return LINK_KINDS.filter((kind) => {
    if (group && kind.group !== group) return false
    if (kind.teamOnly && !hasTeam) return false
    return kind.always || Boolean(project.links?.[kind.id])
  })
}

// No pill, no border: the mark carries it, with its name beneath. The whole
// tile is the hit area.
function LinkTile({ kind, href }) {
  const Icon = kind.icon

  // An `always` entry with no URL yet: same shape, inert, and announced as
  // unavailable rather than being a dead link.
  if (!href) {
    return (
      <li>
        <span className="link-tile link-tile--pending" aria-disabled="true">
          <span className="link-tile__mark">
            <Icon />
          </span>
          <span className="link-tile__label">{kind.label}</span>
          <span className="sr-only"> — link not available yet</span>
        </span>
      </li>
    )
  }

  return (
    <li>
      <a className="link-tile" href={href} target="_blank" rel="noreferrer">
        <span className="link-tile__mark">
          <Icon />
        </span>
        <span className="link-tile__label">{kind.label}</span>
      </a>
    </li>
  )
}

// One component, two sections: the registry passes the group it wants.
function LinksGroup({ project, group }) {
  return (
    <ul className="links">
      {visibleLinkKinds(project, group).map((kind) => (
        <LinkTile key={kind.id} kind={kind} href={project.links?.[kind.id]} />
      ))}
    </ul>
  )
}

export default function LinksSection({ project }) {
  return <LinksGroup project={project} group="workspace" />
}

export function ResourcesSection({ project }) {
  return <LinksGroup project={project} group="resources" />
}
