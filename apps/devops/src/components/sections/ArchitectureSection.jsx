import { ExternalIcon } from '../icons.jsx'
import EmptySlot from './EmptySlot.jsx'

// The exported diagram(s). `architecture` takes either one figure or a list
// of them — a project often has more than one view worth showing (the
// infrastructure layout and the flow through it, say), and those are two
// diagrams rather than one crowded image.
//
// Drop the files in `public/projects/<slug>/` and point each `src` at them —
// see public/projects/README.md for the convention.
function Diagram({ src, alt, caption, sourceUrl }) {
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
              diagram source <ExternalIcon />
            </a>
          )}
        </figcaption>
      )}
    </figure>
  )
}

export default function ArchitectureSection({ project }) {
  const diagrams = [].concat(project.architecture ?? []).filter((d) => d?.src)

  if (diagrams.length === 0) {
    return <EmptySlot>No architecture diagram added yet.</EmptySlot>
  }

  return (
    <div className="diagrams">
      {diagrams.map((diagram) => (
        <Diagram key={diagram.src} {...diagram} />
      ))}
    </div>
  )
}
