import { useState } from 'react'
import BrowserPanel from '../BrowserPanel.jsx'
import { ExternalIcon, LayersIcon } from '../icons.jsx'
import ArchDiagram from './ArchDiagram.jsx'
import EmptySlot from './EmptySlot.jsx'

// Architecture and repository structure, in one panel with a tab per view.
// They used to be two sections stacked down the page, which meant scrolling
// past a full-width diagram to reach the next one and again to reach the
// folder tree. They answer the same question — how is this thing put together
// — so they belong in one place you can switch inside of.
//
// An entry takes one of three forms, and a project may mix them:
//
//   { diagram: { … } }   drawn in the page's own type and palette from a node
//                        and edge description — see ArchDiagram.jsx
//   { src: '…' }         an image file, for a diagram that genuinely is one
//   { diagram, detailed: { src } }
//                        both forms of the same view, behind a Clean /
//                        Detailed toggle in the tab's address bar
//
// The drawn form is the default for this site. The exported ones it replaced
// were raster images inside an SVG wrapper: 1.7MB each, blurry at page width,
// permanently light-mode on a page with a dark theme, and completely opaque to
// a screen reader. A described diagram is none of those things, and it lives
// in the same file as the copy that explains it.
//
// The paired form exists because those two things are not actually rivals for
// every reader. The drawing answers "how does this fit together" at a glance;
// the export answers "what exactly is in it" and names every box. One tab,
// one subject, two levels of detail — rather than two tabs that look like two
// different diagrams.
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
          away rather than only ever being the page-width render. The image
          itself is held to the panel's width by `.figure__frame img`, which
          is `width: 100%; height: auto` — these files are up to 1802px across
          and would push the page sideways at their intrinsic size. */}
      <a className="figure__frame" href={src} target="_blank" rel="noreferrer">
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </a>
      <Caption caption={caption} sourceUrl={sourceUrl} />
    </figure>
  )
}

// The two levels a paired view is held at. Rides in the tab's address bar,
// the same place and the same shape as the README's language toggle — a
// control that changes what the tab is showing, not what the page is showing.
const MODES = [
  { id: 'clean', label: 'Clean' },
  { id: 'detailed', label: 'Detailed' },
]

function ViewToggle({ mode, onPick, label }) {
  return (
    <span className="readme__toggle" role="group" aria-label={`${label} detail level`}>
      <span className="readme__toggle-icon" aria-hidden="true">
        <LayersIcon />
      </span>
      {MODES.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`readme__lang${option.id === mode ? ' readme__lang--on' : ''}`}
          aria-pressed={option.id === mode}
          onClick={() => onPick(option.id)}
        >
          {option.label}
        </button>
      ))}
    </span>
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

  // Detail level per view, not one setting shared across the panel: switching
  // to Detailed on the pod diagram should not also switch the GitOps one, and
  // coming back to a tab should find it as it was left. Keyed by tab id, so a
  // view with no export never has an entry.
  const [modes, setModes] = useState({})

  if (views.length === 0 && !tree) {
    return <EmptySlot>No architecture diagram or folder structure added yet.</EmptySlot>
  }

  const tabs = views.map((view, i) => {
    const id = view.src ?? view.tab ?? `view-${i}`
    const paired = Boolean(view.diagram && view.detailed?.src)
    const mode = paired && modes[id] === 'detailed' ? 'detailed' : 'clean'
    // Whichever form is on show owns the address bar, so the line under the
    // tabs says which of the two you are looking at.
    const shown = mode === 'detailed' ? view.detailed : view

    return {
      id,
      label: shortLabel(view, i),
      // The address bar carries the long form the tab has no room for.
      address: shown.caption ?? view.caption ?? view.alt ?? shortLabel(view, i),
      aside: paired ? (
        <ViewToggle
          mode={mode}
          label={shortLabel(view, i)}
          onPick={(next) => setModes((current) => ({ ...current, [id]: next }))}
        />
      ) : null,
      // Only the chosen form is ever mounted. Rendering both and hiding one
      // with CSS would still fetch the export — up to 567KB for the overall
      // view — for a reader who never leaves the drawing.
      render: () => {
        if (mode === 'detailed') {
          return (
            <Shot
              src={view.detailed.src}
              alt={view.detailed.alt ?? view.alt}
              caption={view.detailed.caption ?? view.caption}
              sourceUrl={view.detailed.sourceUrl ?? view.sourceUrl}
            />
          )
        }
        return view.diagram ? <Drawn {...view} /> : <Shot {...view} />
      },
    }
  })

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
