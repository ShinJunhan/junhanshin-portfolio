import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Rendered README bodies. Everything is scoped under `.markdown` in the
// stylesheet rather than styled inline, so the two language variants and any
// future long-form section all land on the same typography.
export default function Markdown({ source }) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // A README's own h1 repeats the project title that already sits at
          // the top of the page, so headings step down one level here and the
          // page keeps a single, correct outline.
          h1: 'h4',
          h2: 'h4',
          h3: 'h5',
          // README links point off-site; open them in a new tab so the page
          // scroll position survives.
          a: ({ node, ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
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
