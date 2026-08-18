import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Markdown from '../Markdown.jsx'
import { readmesFor } from '../../data/readmes.js'
import { LanguageIcon } from '../icons.jsx'
import EmptySlot from './EmptySlot.jsx'

// The README's language toggle sits up on the section's heading line while the
// document itself sits below it, so the two are rendered in different places
// by ProjectPage. They still share one piece of state, which is what this
// context is for: the section registry names `ReadmeProvider` as the section's
// Wrapper, and both pieces read from it.
const ReadmeContext = createContext(null)

export function ReadmeProvider({ project, children }) {
  const variants = useMemo(() => readmesFor(project.slug), [project.slug])
  const [langId, setLangId] = useState(variants[0]?.id)
  const [expanded, setExpanded] = useState(false)
  const viewportRef = useRef(null)

  // A language can disappear when the project changes under the same mounted
  // component, so fall back to the first available rather than blanking out.
  const active = variants.find((variant) => variant.id === langId) ?? variants[0]

  // An offset into one document means nothing in another, so the frame returns
  // to the top on a language switch. The expanded state deliberately does not
  // reset — "I wanted this open" still holds.
  useEffect(() => {
    if (viewportRef.current) viewportRef.current.scrollTop = 0
  }, [active?.id])

  const value = { variants, active, setLangId, expanded, setExpanded, viewportRef }

  return <ReadmeContext.Provider value={value}>{children}</ReadmeContext.Provider>
}

// Rendered by ProjectPage into the section's heading row, right-aligned.
export function ReadmeLangToggle() {
  const { variants, active, setLangId } = useContext(ReadmeContext)

  // Nothing to toggle between when only one translation exists on disk.
  if (variants.length < 2) return null

  return (
    <div className="readme__toggle" role="group" aria-label="README language">
      <span className="readme__toggle-icon" aria-hidden="true">
        <LanguageIcon />
      </span>
      {variants.map((variant) => (
        <button
          key={variant.id}
          type="button"
          className={`readme__lang${variant.id === active.id ? ' readme__lang--on' : ''}`}
          aria-pressed={variant.id === active.id}
          onClick={() => setLangId(variant.id)}
        >
          {variant.label}
        </button>
      ))}
    </div>
  )
}

// READMEs run to tens of thousands of characters, so this opens capped in a
// frame that scrolls on its own, with a control that lifts the cap.
export default function ReadmeSection() {
  const { variants, active, expanded, setExpanded, viewportRef } = useContext(ReadmeContext)

  if (variants.length === 0) {
    return <EmptySlot>No README added yet.</EmptySlot>
  }

  return (
    <div className="readme">
      {/* The frame holds the border and the fade; the viewport inside it is
          what actually scrolls, so the fade can stay pinned to the bottom
          edge instead of scrolling away with the text. */}
      <div className={`readme__frame${expanded ? '' : ' readme__frame--capped'}`}>
        <div className="readme__viewport" ref={viewportRef}>
          <Markdown source={active.source} />
        </div>
      </div>

      <button
        type="button"
        className="readme__expand"
        aria-expanded={expanded}
        onClick={() => setExpanded((open) => !open)}
      >
        {expanded ? 'Collapse README' : 'Show full README'}
      </button>
    </div>
  )
}
