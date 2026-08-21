import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle.jsx'

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Me' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
]

export default function NavBar() {
  const [active, setActive] = useState('home')

  // Marks whichever section currently owns the top of the viewport. A plain
  // IntersectionObserver would flip between two sections that are both on
  // screen, so pick the last one whose top has passed under the bar.
  useEffect(() => {
    function onScroll() {
      const line = window.innerHeight * 0.35
      let current = SECTIONS[0].id
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= line) current = s.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function go(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="navbar" aria-label="Page sections">
      <div className="navbar__inner">
        <div className="navbar__links">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              className={`navbar__link${active === s.id ? ' navbar__link--active' : ''}`}
              aria-current={active === s.id ? 'true' : undefined}
            >
              {s.label}
            </button>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </nav>
  )
}
