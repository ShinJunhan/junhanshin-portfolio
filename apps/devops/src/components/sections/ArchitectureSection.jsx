import BrowserPanel from '../BrowserPanel.jsx'
import { ExternalIcon } from '../icons.jsx'
import EmptySlot from './EmptySlot.jsx'

// Architecture and repository structure, in one panel with a tab per view.
// They used to be two sections stacked down the page, which meant scrolling
// past a full-width diagram to reach the next one and again to reach the
// folder tree. They answer the same question — how is this thing put together
// — so they belong in one place you can switch inside of.
//
// `architecture` takes either one figure or a list of them, and each may name
// a short `tab`; without one the caption's first clause is used, since a tab
// has room for a few words and a caption has room for a sentence.
function shortLabel(diagram, index) {
  if (diagram.tab) return diagram.tab
  const caption = diagram.caption ?? ''
  const [head] = caption.split(' — ')
  return head || `Diagram ${index + 1}`
}

function Diagram({ src, alt, caption, sourceUrl }) {
  return (
    <figure className="figure figure--panel">
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
  const tree = project.folderStructure

  if (diagrams.length === 0 && !tree) {
    return <EmptySlot>No architecture diagram or folder structure added yet.</EmptySlot>
  }

  const tabs = diagrams.map((diagram, i) => ({
    id: diagram.src,
    label: shortLabel(diagram, i),
    // The address bar carries the long form the tab has no room for.
    address: diagram.caption ?? diagram.alt ?? shortLabel(diagram, i),
    render: () => <Diagram {...diagram} />,
  }))

  if (tree) {
    tabs.push({
      id: 'folders',
      label: 'Folder structure',
      address: `${project.repoName ?? project.title}/`,
      render: () => (
        <div className="tree">
          <pre className="tree__body">
            <code>{tree.trim()}</code>
          </pre>
        </div>
      ),
    })
  }

  return <BrowserPanel label="Architecture views" tabs={tabs} />
}
