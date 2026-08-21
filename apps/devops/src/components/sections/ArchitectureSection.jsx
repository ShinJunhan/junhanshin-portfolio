import BrowserPanel from '../BrowserPanel.jsx'
import { ExternalIcon } from '../icons.jsx'
import ArchDiagram from './ArchDiagram.jsx'
import EmptySlot from './EmptySlot.jsx'

// Architecture and repository structure, in one panel with a tab per view.
// They used to be two sections stacked down the page, which meant scrolling
// past a full-width diagram to reach the next one and again to reach the
// folder tree. They answer the same question — how is this thing put together
// — so they belong in one place you can switch inside of.
//
// An entry takes one of two forms, and a project may mix them:
//
//   { diagram: { … } }   drawn in the page's own type and palette from a node
//                        and edge description — see ArchDiagram.jsx
//   { src: '…' }         an image file, for a diagram that genuinely is one
//
// The drawn form is the default for this site. The exported ones it replaced
// were raster images inside an SVG wrapper: 1.7MB each, blurry at page width,
// permanently light-mode on a page with a dark theme, and completely opaque to
// a screen reader. A described diagram is none of those things, and it lives
// in the same file as the copy that explains it.
//
// Each entry may name a short `tab`; without one the caption's first clause is
// used, since a tab has room for a few words and a caption has room for a
// sentence.
function shortLabel(diagram, index) {
  if (diagram.tab) return diagram.tab
  const caption = diagram.caption ?? ''
  const [head] = caption.split(' — ')
  return head || `Diagram ${index + 1}`
}

function Caption({ caption, sourceUrl }) {
  if (!caption && !sourceUrl) return null

  return (
    <figcaption className="figure__caption">
      {caption}
      {sourceUrl && (
        <a className="figure__link" href={sourceUrl} target="_blank" rel="noreferrer">
          diagram source <ExternalIcon />
        </a>
      )}
    </figcaption>
  )
}

function Drawn({ diagram, alt, caption, sourceUrl }) {
  return (
    <figure className="figure figure--panel">
      {/* No "open full size" link: this one is vector all the way down and is
          already at full size — it re-renders at whatever width it is given.
          The exported images needed that link precisely because they could
          not. */}
      <div className="figure__frame figure__frame--drawn">
        <ArchDiagram diagram={diagram} title={alt ?? caption} />
      </div>
      <Caption caption={caption} sourceUrl={sourceUrl} />
    </figure>
  )
}

function Shot({ src, alt, caption, sourceUrl }) {
  return (
    <figure className="figure figure--panel">
      {/* An exported diagram is wide and detailed, so full-size is a click
          away rather than only ever being the page-width render. */}
      <a className="figure__frame" href={src} target="_blank" rel="noreferrer">
        <img src={src} alt={alt} loading="lazy" />
      </a>
      <Caption caption={caption} sourceUrl={sourceUrl} />
    </figure>
  )
}

// A view counts as present if it has something to draw, either way round.
const hasView = (view) => Boolean(view?.src || view?.diagram)

export function hasArchitecture(project) {
  return (
    [].concat(project.architecture ?? []).some(hasView) || Boolean(project.folderStructure)
  )
}

export default function ArchitectureSection({ project }) {
  const views = [].concat(project.architecture ?? []).filter(hasView)
  const tree = project.folderStructure

  if (views.length === 0 && !tree) {
    return <EmptySlot>No architecture diagram or folder structure added yet.</EmptySlot>
  }

  const tabs = views.map((view, i) => ({
    id: view.src ?? view.tab ?? `view-${i}`,
    label: shortLabel(view, i),
    // The address bar carries the long form the tab has no room for.
    address: view.caption ?? view.alt ?? shortLabel(view, i),
    render: () => (view.diagram ? <Drawn {...view} /> : <Shot {...view} />),
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
