import { GROUPS, projectsInGroup } from '../data/projects.js'
import { projectHref } from '../lib/useHashRoute.js'
import { CloseIcon } from './icons.jsx'

// Both lists are <ol>, so the numbering is the list's — adding a project is a
// data edit with no numbers to renumber by hand.
function ProjectList({ group, activeSlug, onNavigate }) {
  const projects = projectsInGroup(group.id)
  if (projects.length === 0) return null

  return (
    <section className="sidebar__group">
      <h2 className="sidebar__group-title">{group.label}</h2>
      <ol className="sidebar__list">
        {projects.map((project) => {
          const active = project.slug === activeSlug
          return (
            <li key={project.slug}>
              <a
                className={`sidebar__link${active ? ' sidebar__link--active' : ''}`}
                href={projectHref(project.slug)}
                aria-current={active ? 'page' : undefined}
                onClick={onNavigate}
              >
                {project.title}
              </a>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default function Sidebar({ activeSlug, open, onClose }) {
  return (
    <nav
      id="workspace-sidebar"
      className={`sidebar${open ? ' sidebar--open' : ''}`}
      aria-label="Projects"
    >
      <div className="sidebar__head">
        {/* The name is the way back to the welcome state. */}
        <a className="sidebar__brand" href="#/" onClick={onClose}>
          Junhan Shin
        </a>
        {/* Only reachable at the width where the sidebar is a drawer. */}
        <button type="button" className="sidebar__close" onClick={onClose}>
          <CloseIcon />
          <span className="sr-only">Close navigation</span>
        </button>
      </div>

      {GROUPS.map((group) => (
        <ProjectList key={group.id} group={group} activeSlug={activeSlug} onNavigate={onClose} />
      ))}
    </nav>
  )
}
