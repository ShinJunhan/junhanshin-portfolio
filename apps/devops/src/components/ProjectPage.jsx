import { useEffect, useMemo } from 'react'
import SectionNav from './SectionNav.jsx'
import Reveal from './Reveal.jsx'
import { accentFor } from '../data/projects.js'
import { sectionsFor, labelOf } from '../data/sections.jsx'
import Avatars from './Avatars.jsx'

// One template for every project. Nothing here knows which project it is
// rendering: the content comes from src/data/projects.js, the section order
// and presence rules from src/data/sections.jsx, and the accent from the
// project's own entry. Extending a project page means editing those, not this.
// Stands in for a section that declares no Wrapper. A Fragment would warn on
// the `project` prop, so this passes children through instead.
function PassThrough({ children }) {
  return children
}

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
        {/* The Workspace menu entry scrolls here rather than to a section:
            the title and period are above the first section, so there is no
            section id that means "the top of the page". */}
        <header className="project__head" id="project-top">
          {/* The short name — the team's, for team projects — kept as a quiet
              eyebrow so it still ties the page to the sidebar entry the reader
              clicked, without competing with the real title for weight. A
              project sets `eyebrow` only when the two names differ, which is
              the case where the team built something with a name of its own:
              the sidebar carries the team, the eyebrow carries the product. */}
          <p className="project__eyebrow">{project.eyebrow ?? project.title}</p>
          <h1 className="project__title">{project.fullTitle ?? project.title}</h1>
          {/* "Project Period:" is fixed chrome, so it lives here rather than
              being repeated in every project's data. The team size is derived
              from the members list for the same reason — one fact, one place.
              The full roster has its own Members section below. */}
          <p className="project__period">
            {project.team?.length > 0 && `Team of ${project.team.length} \u00b7 `}
            Project Period: {project.period}
          </p>
          {/* Part of the header, not a section of its own. Who built it belongs
              with the title and the dates — it is one more fact about the
              project, and giving it a heading, a divider and an anchor of its
              own made a row of five circles look like something to read. */}
          <Avatars team={project.team} />
        </header>

        <div className="project__sections">
          {sections.map((section) => {
            const Wrapper = section.Wrapper ?? PassThrough

            return (
              // Same scroll-reveal the landing page uses, one per section, so
              // each fades up as it comes into view. Reveal carries its own
              // reduced-motion handling — it renders a plain div and skips the
              // animation entirely when the reader has asked for less motion.
              // `amount="some"` rather than the default fraction: a section
              // here can be a whole rendered README, and a fraction of
              // something that tall never fits on screen to satisfy it.
              <Reveal key={section.id} amount="some">
                <Wrapper project={project}>
                  <section
                    className="section"
                    id={section.id}
                    aria-labelledby={`${section.id}-heading`}
                  >
                    {/* A `bare` section heads itself: its body gets the label
                        and the heading id and places them where its own layout
                        needs them. */}
                    {!section.bare && (
                      <div className="section__head">
                        <h2 className="section__title" id={`${section.id}-heading`}>
                          {labelOf(section, project)}
                        </h2>
                        {section.Aside && <section.Aside project={project} />}
                      </div>
                    )}
                    <section.Body
                      project={project}
                      label={labelOf(section, project)}
                      headingId={`${section.id}-heading`}
                    />
                  </section>
                </Wrapper>
              </Reveal>
            )
          })}
        </div>
      </div>
    </article>
  )
}
