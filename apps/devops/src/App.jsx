import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Welcome from './components/Welcome.jsx'
import ProjectPage from './components/ProjectPage.jsx'
import NotFound from './components/NotFound.jsx'
import { findProject } from './data/projects.js'
import { useHashRoute } from './lib/useHashRoute.js'
import ThemeToggle from './components/ThemeToggle.jsx'
import { MenuIcon, PanelIcon } from './components/icons.jsx'

// Whether the project rail is folded away. Opt-in and remembered, but never
// the starting state: a first visit shows the projects, because a sidebar
// that is collapsed before anyone asked for it hides the site's own table of
// contents from the one reader who has not learned it yet.
const SIDEBAR_KEY = 'sidebar'

function readCollapsed() {
  try {
    return window.localStorage.getItem(SIDEBAR_KEY) === 'collapsed'
  } catch {
    // Private mode, or storage disabled. The rail simply does not remember.
    return false
  }
}

export default function App() {
  const slug = useHashRoute()
  const project = slug ? findProject(slug) : null

  // Only meaningful at the width where the sidebar collapses to a drawer; at
  // desktop widths the sidebar is always on screen and this is inert.
  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeDrawer = () => setDrawerOpen(false)

  // Desktop only — below the drawer breakpoint the rail is already a drawer
  // and has its own control.
  const [collapsed, setCollapsed] = useState(readCollapsed)

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_KEY, collapsed ? 'collapsed' : 'open')
    } catch {
      // Nothing to do: the preference just does not survive the session.
    }
  }, [collapsed])

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (event) => event.key === 'Escape' && setDrawerOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  return (
    // `--sidebar-w` collapses to zero on this element, and both the rail's own
    // width and the content column's left margin read it — so one value moves
    // the two of them together and they can never disagree about where the
    // rail ends.
    <div className="workspace" data-sidebar={collapsed ? 'collapsed' : 'open'}>
      {/* Rides at the rail's right edge when it is open and at the page's own
          left edge when it is not, carried across by the same custom property
          that moves the rail. One control in one place, rather than a collapse
          button that disappears with the thing it collapsed. */}
      <button
        type="button"
        className="sidebar-toggle"
        aria-expanded={!collapsed}
        aria-controls="workspace-sidebar"
        onClick={() => setCollapsed((value) => !value)}
      >
        <PanelIcon />
        <span className="sr-only">{collapsed ? 'Show projects' : 'Hide projects'}</span>
      </button>

      <button
        type="button"
        className="drawer-toggle"
        aria-expanded={drawerOpen}
        aria-controls="workspace-sidebar"
        onClick={() => setDrawerOpen(true)}
      >
        <MenuIcon />
        <span className="sr-only">Open navigation</span>
      </button>

      {/* One instance, parked top-right at every width — the same toggle
          component the landing page uses, so both sites share the theme
          contract and the `theme` key in localStorage. */}
      <div className="theme-slot">
        <ThemeToggle />
      </div>

      {drawerOpen && <div className="drawer-scrim" onClick={closeDrawer} />}

      <Sidebar activeSlug={slug} open={drawerOpen} onClose={closeDrawer} />

      <main className="content">
        {/* Three states: nothing selected, a real project, or a slug that no
            longer matches anything (a stale bookmark). */}
        {!slug && <Welcome />}
        {slug && project && <ProjectPage key={project.slug} project={project} />}
        {slug && !project && <NotFound slug={slug} />}
      </main>
    </div>
  )
}
