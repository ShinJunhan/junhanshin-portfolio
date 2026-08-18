import { useState } from 'react'
import Markdown from '../Markdown.jsx'
import { readmesFor } from '../../data/readmes.js'
import { LanguageIcon } from '../icons.jsx'
import EmptySlot from './EmptySlot.jsx'

// The project's README, rendered in full. The toggle only appears when a
// second translation actually exists on disk.
export default function ReadmeSection({ project }) {
  const variants = readmesFor(project.slug)
  const [langId, setLangId] = useState(variants[0]?.id)

  if (variants.length === 0) {
    return <EmptySlot>No README added yet.</EmptySlot>
  }

  // A language can disappear when the project changes under the same mounted
  // component, so fall back to the first available rather than blanking out.
  const active = variants.find((variant) => variant.id === langId) ?? variants[0]

  return (
    <div className="readme">
      {variants.length > 1 && (
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
      )}
      <Markdown source={active.source} />
    </div>
  )
}
