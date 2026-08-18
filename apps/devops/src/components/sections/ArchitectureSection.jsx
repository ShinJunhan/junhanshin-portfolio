import { ExternalIcon } from '../icons.jsx'
import EmptySlot from './EmptySlot.jsx'

// The draw.io export, embedded as an image. Drop the exported file in
// `public/projects/<slug>/` and point `architecture.src` at it — see
// public/projects/README.md for the convention.
export default function ArchitectureSection({ project }) {
  const { src, alt, caption, sourceUrl } = project.architecture ?? {}

  if (!src) {
    return <EmptySlot>No architecture diagram added yet.</EmptySlot>
  }

  return (
    <figure className="figure">
      {/* Diagrams are wide and detailed, so full-size is a click away rather
          than only ever being the page-width render. */}
      <a className="figure__frame" href={src} target="_blank" rel="noreferrer">
        <img src={src} alt={alt} loading="lazy" />
      </a>
      {(caption || sourceUrl) && (
        <figcaption className="figure__caption">
          {caption}
          {sourceUrl && (
            <a className="figure__link" href={sourceUrl} target="_blank" rel="noreferrer">
              draw.io source <ExternalIcon />
            </a>
          )}
        </figcaption>
      )}
    </figure>
  )
}
