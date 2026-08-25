import { useEffect, useMemo, useRef, useState } from 'react'
import Prism from 'prismjs'
import BrowserPanel, { splitPath } from '../BrowserPanel.jsx'
import Markdown from '../Markdown.jsx'
import { docsFor } from '../../data/docs.js'
import { slidesFor } from '../../data/slides.js'
import { ExternalIcon, LanguageIcon } from '../icons.jsx'
import { useSlideDeck } from './SlideDeck.jsx'
import EmptySlot from './EmptySlot.jsx'
import 'prismjs/components/prism-hcl'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-python'

// The written documents and the source, one panel with a tab each, in the
// order a reader needs them: README, Runbook, Terraform, the deck.
//
// That order is the argument the section makes. The README says what the
// system is, the Runbook says how it is operated, and the Terraform is the
// evidence underneath both. A project that is only ever deployed can stop at
// the first and third; one that is meant to be *run* has a middle document,
// and putting it between them is what makes the difference visible.
//
// The presentation deck comes last, after the source, because it is the one
// document that was never the artefact — it is the account given of the work
// once the work was done, and it reads as a summary to anyone who has just
// been through the three above it.
//
// A document's language toggle lives in the address bar of its own tab rather
// than on the section heading: it belongs to that document, and on a shared
// heading it would sit there while Terraform was showing and mean nothing.
// Extension to Prism grammar. A file whose extension is not here renders as
// plain text rather than failing — `highlight` returns null and the tab falls
// back to an unhighlighted `<code>`, so adding a language is one entry here
// plus its import above, and forgetting to is a dull tab, never a broken one.
const GRAMMARS = {
  tf: 'hcl',
  hcl: 'hcl',
  tfvars: 'hcl',
  yml: 'yaml',
  yaml: 'yaml',
  sh: 'bash',
  bash: 'bash',
  py: 'python',
}

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

function DocTab({ active, expanded }) {
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

// The written documents this panel can show, in tab order. A project gets a
// tab for each one it actually has a file for, so adding a runbook to a
// project is dropping `src/content/<slug>/RUNBOOK.md` into the tree and
// nothing else.
//
//   doc      the file's base name under src/content/<slug>/
//   label    the tab
//   expand   what the toggle beneath the panel says
const DOCUMENTS = [
  { doc: 'README', label: 'README.md', expand: 'README' },
  { doc: 'RUNBOOK', label: 'RUNBOOK.md', expand: 'runbook' },
]

export default function SourceSection({ project }) {
  const files = project.terraform ?? []
  // Each document's available translations, resolved once per project.
  const documents = useMemo(
    () =>
      DOCUMENTS.map((entry) => ({ ...entry, variants: docsFor(project.slug, entry.doc) })).filter(
        (entry) => entry.variants.length > 0
      ),
    [project.slug]
  )

  // The presentation deck, if this project has one on disk. Its tab carries
  // enough state of its own — which slide is centred, whether the notes are
  // open — that the hook holds it and hands back the pieces the panel needs.
  const slideTab = useSlideDeck(useMemo(() => slidesFor(project.slug), [project.slug]))

  // Language per document, not one shared setting: the README has a Korean
  // translation and the runbook does not, and a single flag would have left
  // the toggle claiming KO on a tab that only exists in English.
  const [langIds, setLangIds] = useState({})
  // One expanded flag per tab id: opening the README should not also open the
  // Terraform, and coming back to a tab should find it as it was left.
  const [expandedIds, setExpandedIds] = useState({})

  const toggle = (id) => setExpandedIds((open) => ({ ...open, [id]: !open[id] }))

  if (files.length === 0 && documents.length === 0 && !slideTab) {
    return <EmptySlot>No README, runbook, Terraform code, or slides added yet.</EmptySlot>
  }

  const tabs = []

  for (const entry of documents) {
    const { doc, variants } = entry
    const active = variants.find((v) => v.id === langIds[doc]) ?? variants[0]

    tabs.push({
      id: doc.toLowerCase(),
      label: entry.label,
      // The variants carry a suffix, not a path — `README.ko.md` is what the
      // Korean file is actually called on disk.
      address: `${doc}${active.suffix}.md`,
      // Nothing to toggle between when only one translation exists on disk.
      aside:
        variants.length > 1 ? (
          <span className="readme__toggle" role="group" aria-label={`${doc} language`}>
            <span className="readme__toggle-icon" aria-hidden="true">
              <LanguageIcon />
            </span>
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                className={`readme__lang${variant.id === active.id ? ' readme__lang--on' : ''}`}
                aria-pressed={variant.id === active.id}
                onClick={() => setLangIds((current) => ({ ...current, [doc]: variant.id }))}
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
          aria-expanded={!!expandedIds[doc]}
          onClick={() => toggle(doc)}
        >
          {expandedIds[doc] ? `Collapse ${entry.expand}` : `Show full ${entry.expand}`}
        </button>
      ),
      render: () => <DocTab active={active} expanded={!!expandedIds[doc]} />,
    })
  }

  // The source after the documents: those are the way in, the source is the
  // follow-up read for anyone who wants to check the claims they make.
  //
  // One tab holding all of them rather than one tab each. On a project with two
  // documents and six files that was eight tabs wrapping onto two rows, and the
  // eight were not peers — two are prose and six are what the prose is about.
  // Nesting says that, and the strip fits on one line again.
  //
  // A single file still gets its own top-level tab. Wrapping one file in a
  // group would add a level of navigation to hide nothing, and the projects
  // that ship one Terraform file read better without it.
  if (files.length > 0) {
    const fileTab = (file) => ({
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

    if (files.length === 1) {
      tabs.push(fileTab(files[0]))
    } else {
      tabs.push({
        id: 'source-code',
        // Not "Terraform". The key in the data is still called that, but the
        // files under it are HCL, bash, Python and YAML, and a tab that names
        // one of the four would be wrong three times over.
        label: 'Source code',
        subTabs: files.map(fileTab),
      })
    }
  }

  // Last, and view-only: the address bar names the deck rather than a path
  // because there is no file here to open — the slides are images on a page.
  if (slideTab) {
    tabs.push({
      id: 'slides',
      label: 'Project Presentation Slides',
      address: slideTab.address,
      aside: slideTab.aside,
      render: () => slideTab.body,
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
