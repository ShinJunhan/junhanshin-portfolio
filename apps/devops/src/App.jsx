import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Welcome from './components/Welcome.jsx'
import ProjectPage from './components/ProjectPage.jsx'
import NotFound from './components/NotFound.jsx'
import { findProject } from './data/projects.js'
import { useHashRoute } from './lib/useHashRoute.js'
import { MenuIcon } from './components/icons.jsx'

export default function App() {
  const slug = useHashRoute()
  const project = slug ? findProject(slug) : null

  // Only meaningful at the width where the sidebar collapses to a drawer; at
  // desktop widths the sidebar is always on screen and this is inert.
  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeDrawer = () => setDrawerOpen(false)

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (event) => event.key === 'Escape' && setDrawerOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  return (
    <div className="workspace">
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
