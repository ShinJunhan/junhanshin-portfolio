// TODO: replace these placeholders with the real project titles, and point
// each `href` at that project's page on devops.junhanshin.com.
const PROJECTS = [
  { title: 'Project title placeholder one', href: '#' },
  { title: 'Project title placeholder two', href: '#' },
  { title: 'Project title placeholder three', href: '#' },
  { title: 'Project title placeholder four', href: '#' },
  { title: 'Project title placeholder five', href: '#' },
  { title: 'Project title placeholder six', href: '#' },
]

const SECONDS_PER_ITEM = 2.6

const ArrowIcon = () => (
  <svg className="ticker__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

export default function ProjectsTicker() {
  // The list is rendered twice back to back and scrolled exactly one copy's
  // worth, so the seam lands where the loop restarts and the roll looks
  // continuous rather than snapping back.
  const loop = [...PROJECTS, ...PROJECTS]

  return (
    // The roll is a CSS animation rather than a scripted one so that hover
    // and focus can pause it mid-stride and resume from the same place —
    // without a pause, every row would be a moving click target.
    <div
      className="ticker"
      aria-label="Project titles"
      style={{ '--roll-duration': `${PROJECTS.length * SECONDS_PER_ITEM}s` }}
    >
      <ul className="ticker__track">
        {loop.map((project, i) => {
          // The second copy exists only to make the loop seamless — it is
          // hidden from assistive tech and skipped by the tab order.
          const duplicate = i >= PROJECTS.length
          return (
            <li className="ticker__item" key={`${project.title}-${i}`} aria-hidden={duplicate ? 'true' : undefined}>
              {/* The whole row is the link, not a button at the end of it. */}
              <a className="ticker__link" href={project.href} tabIndex={duplicate ? -1 : undefined}>
                <span className="ticker__index">
                  {String((i % PROJECTS.length) + 1).padStart(2, '0')}
                </span>
                <span className="ticker__title">{project.title}</span>
                <ArrowIcon />
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
