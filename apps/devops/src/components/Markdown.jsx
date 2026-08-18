import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

// Jumps to a heading inside the rendered README without touching the URL.
//
// This has to be intercepted rather than left to the browser: the app routes
// on the hash, so letting `#-troubleshooting` land in the address bar would
// read as "not a project route" and throw the reader back to the welcome
// screen mid-article.
function scrollToFragment(href) {
  const raw = href.slice(1)
  // Slugs here come from emoji headings, so the fragment may arrive either
  // percent-encoded or literal depending on how it was written.
  const target =
    document.getElementById(raw) ||
    document.getElementById(decodeURIComponent(raw))

  target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Rendered README bodies. Everything is scoped under `.markdown` in the
// stylesheet rather than styled inline, so the two language variants and any
// future long-form section all land on the same typography.
export default function Markdown({ source }) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // Gives every heading the same id GitHub would, so a README's own
        // table-of-contents links resolve here exactly as they do on GitHub.
        rehypePlugins={[rehypeSlug]}
        components={{
          // A README's own h1 repeats the project title that already sits at
          // the top of the page, so headings step down one level here and the
          // page keeps a single, correct outline. The id rehype-slug attached
          // rides along in props.
          h1: 'h4',
          h2: 'h4',
          h3: 'h5',
          a: ({ node, href, ...props }) => {
            // In-page jump: handled manually, same tab, URL untouched.
            if (href?.startsWith('#')) {
              return (
                <a
                  href={href}
                  onClick={(event) => {
                    event.preventDefault()
                    scrollToFragment(href)
                  }}
                  {...props}
                />
              )
            }
            // Everything else points off-site; open it in a new tab so the
            // reader's place in the article survives.
            return <a href={href} target="_blank" rel="noreferrer" {...props} />
          },
          // Wide tables get their own scroll rather than pushing the page out.
          table: ({ node, ...props }) => (
            <div className="markdown__table-wrap">
              <table {...props} />
            </div>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}
