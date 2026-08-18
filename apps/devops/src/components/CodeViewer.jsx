import { useEffect, useRef, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-hcl'
import 'prismjs/components/prism-yaml'

// Shared source viewer. Takes a list of files rather than one, so the same
// component serves a single file and a set of them:
//
//   files: [{ path: 'terraform/main.tf', content: '…' }, …]
//
// One file renders on its own. More than one gets a tab per file, labelled by
// its repo-relative path so it is obvious which module each belongs to.
//
// Same frame behaviour as the README section: capped height, its own scroll,
// a fade at the bottom edge, and a control that lifts the cap.

// Prism needs the grammar named, and a file extension is the only signal the
// data carries. Anything unrecognised renders as plain text rather than
// guessing wrong and mis-colouring it.
const GRAMMARS = {
  tf: 'hcl',
  hcl: 'hcl',
  tfvars: 'hcl',
  yml: 'yaml',
  yaml: 'yaml',
}

function grammarFor(path) {
  const ext = path.split('.').pop()?.toLowerCase()
  return GRAMMARS[ext] ?? null
}

function highlight(content, path) {
  const name = grammarFor(path)
  const grammar = name && Prism.languages[name]
  if (!grammar) return null

  return Prism.highlight(content, grammar, name)
}

export default function CodeViewer({ files = [], footer }) {
  const [activePath, setActivePath] = useState(files[0]?.path)
  const [expanded, setExpanded] = useState(false)
  const viewportRef = useRef(null)

  const active = files.find((file) => file.path === activePath) ?? files[0]

  // A scroll offset into one file means nothing in another.
  useEffect(() => {
    if (viewportRef.current) viewportRef.current.scrollTop = 0
  }, [active?.path])

  if (files.length === 0) return null

  const marked = highlight(active.content, active.path)

  return (
    <div className="code">
      {/* Browser-style tabs sitting directly on the frame. A single file still
          gets the tab, so the path is always labelled the same way — it just
          isn't a control, since there is nothing to switch to. */}
      <div
        className="code__tabs"
        role={files.length > 1 ? 'tablist' : undefined}
        aria-label={files.length > 1 ? 'Files' : undefined}
      >
        {files.map((file) =>
          files.length > 1 ? (
            <button
              key={file.path}
              type="button"
              role="tab"
              aria-selected={file.path === active.path}
              className={`code__tab${file.path === active.path ? ' code__tab--on' : ''}`}
              onClick={() => setActivePath(file.path)}
            >
              {file.path}
            </button>
          ) : (
            <span key={file.path} className="code__tab code__tab--on code__tab--static">
              {file.path}
            </span>
          )
        )}
      </div>

      <div className={`code__frame${expanded ? '' : ' code__frame--capped'}`}>
        <div className="code__viewport" ref={viewportRef}>
          <pre className="code__body">
            {marked ? (
              // Prism escapes the source before wrapping it in token spans,
              // and this content is first-party — it comes from files in this
              // repo, never from anything a visitor supplies.
              <code dangerouslySetInnerHTML={{ __html: marked }} />
            ) : (
              <code>{active.content}</code>
            )}
          </pre>
        </div>
      </div>

      <div className="code__foot">
        <button
          type="button"
          className="code__expand"
          aria-expanded={expanded}
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? 'Collapse file' : 'Show full file'}
        </button>
        {footer}
      </div>
    </div>
  )
}
