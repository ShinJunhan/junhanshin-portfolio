import { useEffect, useMemo, useRef, useState } from 'react'
import Prism from 'prismjs'
import BrowserPanel, { splitPath } from '../BrowserPanel.jsx'
import Markdown from '../Markdown.jsx'
import { readmesFor } from '../../data/readmes.js'
import { ExternalIcon, LanguageIcon } from '../icons.jsx'
import EmptySlot from './EmptySlot.jsx'
import 'prismjs/components/prism-hcl'
import 'prismjs/components/prism-yaml'

// The Terraform and the README in one panel, a tab each. They were two
// sections stacked down the page and they answer the same question — show me
// the actual source — so switching between them beats scrolling between them.
//
// The README's language toggle lives in the address bar of its own tab rather
// than on the section heading: it belongs to that document, and on a shared
// heading it would sit there while Terraform was showing and mean nothing.
const GRAMMARS = { tf: 'hcl', hcl: 'hcl', tfvars: 'hcl', yml: 'yaml', yaml: 'yaml' }

function highlight(content, path) {
  const name = GRAMMARS[path.split('.').pop()?.toLowerCase()]
  const grammar = name && Prism.languages[name]
  if (!grammar) return null
  return Prism.highlight(content, grammar, name)
}

function CodeTab({ file, expanded }) {
  const viewportRef = useRef(null)
  const marked = highlight(file.content, file.path)

  useEffect(() => {
    if (viewportRef.current) viewportRef.current.scrollTop = 0
  }, [file.path])

  return (
    <>
      <div className={`code__frame${expanded ? '' : ' code__frame--capped'}`}>
        <div className="code__viewport" ref={viewportRef}>
          <pre className="code__body">
            {marked ? (
              // Prism escapes the source before wrapping it in token spans,
              // and this content is first-party — it comes from files in this
              // repo, never from anything a visitor supplies.
              <code dangerouslySetInnerHTML={{ __html: marked }} />
            ) : (
              <code>{file.content}</code>
            )}
          </pre>
        </div>
      </div>
    </>
  )
}

function ReadmeTab({ active, expanded }) {
  const viewportRef = useRef(null)

  useEffect(() => {
    if (viewportRef.current) viewportRef.current.scrollTop = 0
  }, [active?.id])

  return (
    <>
      <div className={`readme__frame${expanded ? '' : ' readme__frame--capped'}`}>
        <div className="readme__viewport" ref={viewportRef}>
          <Markdown source={active.source} />
        </div>
      </div>
    </>
  )
}

export default function SourceSection({ project }) {
  const files = project.terraform ?? []
  const variants = useMemo(() => readmesFor(project.slug), [project.slug])

  const [langId, setLangId] = useState(variants[0]?.id)
  // One expanded flag per tab id: opening the README should not also open the
  // Terraform, and coming back to a tab should find it as it was left.
  const [expandedIds, setExpandedIds] = useState({})

  const activeVariant = variants.find((v) => v.id === langId) ?? variants[0]
  const toggle = (id) => setExpandedIds((open) => ({ ...open, [id]: !open[id] }))

  if (files.length === 0 && variants.length === 0) {
    return <EmptySlot>No Terraform code or README added yet.</EmptySlot>
  }

  const tabs = []

  if (variants.length > 0) {
    tabs.push({
      id: 'readme',
      label: 'README.md',
      // The variants carry a suffix, not a path — `README.ko.md` is what the
      // Korean file is actually called on disk.
      address: `README${activeVariant.suffix}.md`,
      // Nothing to toggle between when only one translation exists on disk.
      aside:
        variants.length > 1 ? (
          <span className="readme__toggle" role="group" aria-label="README language">
            <span className="readme__toggle-icon" aria-hidden="true">
              <LanguageIcon />
            </span>
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                className={`readme__lang${variant.id === activeVariant.id ? ' readme__lang--on' : ''}`}
                aria-pressed={variant.id === activeVariant.id}
                onClick={() => setLangId(variant.id)}
              >
                {variant.label}
              </button>
            ))}
          </span>
        ) : null,
      footer: (
        <button
          type="button"
          className="readme__expand"
          aria-expanded={!!expandedIds.readme}
          onClick={() => toggle('readme')}
        >
          {expandedIds.readme ? 'Collapse README' : 'Show full README'}
        </button>
      ),
      render: () => (
        <ReadmeTab variants={variants} active={activeVariant} expanded={!!expandedIds.readme} />
      ),
    })
  }

  // Terraform after the README: the README is the way in, the source is the
  // follow-up read.
  for (const file of files) {
    tabs.push({
      id: file.path,
      label: splitPath(file.path).base,
      address: file.path,
      footer: (
        <button
          type="button"
          className="code__expand"
          aria-expanded={!!expandedIds[file.path]}
          onClick={() => toggle(file.path)}
        >
          {expandedIds[file.path] ? 'Collapse file' : 'Show full file'}
        </button>
      ),
      render: () => <CodeTab file={file} expanded={!!expandedIds[file.path]} />,
    })
  }

  return (
    <BrowserPanel label="Source files" tabs={tabs}>
      {project.links?.terraform && (
        <div className="code__foot">
          <a
            className="code__link"
            href={project.links.terraform}
            target="_blank"
            rel="noreferrer"
          >
            View full terraform/ directory on GitHub <ExternalIcon />
          </a>
        </div>
      )}
    </BrowserPanel>
  )
}
