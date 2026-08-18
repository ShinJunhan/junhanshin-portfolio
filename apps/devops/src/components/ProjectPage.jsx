import { useEffect, useMemo } from 'react'
import SectionNav from './SectionNav.jsx'
import Reveal from './Reveal.jsx'
import { accentFor } from '../data/projects.js'
import { sectionsFor } from '../data/sections.jsx'

// One template for every project. Nothing here knows which project it is
// rendering: the content comes from src/data/projects.js, the section order
// and presence rules from src/data/sections.jsx, and the accent from the
// project's own entry. Extending a project page means editing those, not this.
export default function ProjectPage({ project }) {
  // Memoised for identity, not for cost: the section nav keys its scroll-spy
  // effects off this array, and a fresh one each render would tear down the
  // observer and reset the highlight to the first section on every scroll.
  const sections = useMemo(() => sectionsFor(project), [project])

  // A different project is a different page as far as the reader is
  // concerned, so it starts at the top rather than wherever the last one was
  // left. `instant` because a smooth scroll here races the section nav's
  // observer and can leave the wrong chip lit.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [project.slug])

  return (
    // The accent enters the page exactly once, here, and everything below
    // reads it from `--accent`.
    <article className="project" style={{ '--accent': accentFor(project) }}>
      {/* Above the title, not below it: this is the page's navigation menu,
          and it stays pinned there while the header scrolls away under it. */}
      {sections.length > 0 && <SectionNav sections={sections} />}

      {/* The menu spans the whole content column; everything below it is held
          to the reading measure, which is why they are separate wrappers. */}
      <div className="project__body">
        <header className="project__head">
          <h1 className="project__title">{project.title}</h1>
          {/* The team used to sit here beside the date; it has its own
              Members section now. */}
          <p className="project__period">{project.period}</p>
        </header>

        <div className="project__sections">
          {sections.map(({ id, label, Body }) => (
            // Same scroll-reveal the landing page uses, one per section, so
            // each fades up as it comes into view. Reveal carries its own
            // reduced-motion handling — it renders a plain div and skips the
            // animation entirely when the reader has asked for less motion.
            // `amount="some"` rather than the default fraction: a section here
            // can be a whole rendered README, and a fraction of something that
            // tall never fits on screen to satisfy the trigger.
            <Reveal key={id} amount="some">
              <section className="section" id={id} aria-labelledby={`${id}-heading`}>
                <h2 className="section__title" id={`${id}-heading`}>
                  {label}
                </h2>
                <Body project={project} />
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </article>
  )
}
