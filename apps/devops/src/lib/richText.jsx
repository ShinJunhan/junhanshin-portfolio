// Minimal inline formatting for the narrative sections. The content files are
// plain strings, not markdown documents, so this deliberately understands two
// marks and nothing else:
//
//   `code`      monospace on a code-block surface — commands, flags, paths
//   **text**    bold in the project's accent colour, not default black bold,
//               so a number or a technology lifts out of the sentence
//
// The README section goes through the real markdown renderer instead; this is
// for the hand-written prose around it. Both end up on the same inline-code
// styling, so a backtick looks identical wherever it appears on the page.
//
// Code is matched in the same pass as bold and wins where they overlap, so
// asterisks inside a backtick span stay literal.
const TOKEN = /`([^`]+)`|\*\*([^*]+?)\*\*/g

export default function RichText({ children }) {
  const text = String(children ?? '')
  const nodes = []
  let last = 0
  let match

  TOKEN.lastIndex = 0
  while ((match = TOKEN.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index))

    if (match[1] !== undefined) {
      nodes.push(
        <code className="inline-code" key={match.index}>
          {match[1]}
        </code>
      )
    } else {
      nodes.push(
        <strong className="mark" key={match.index}>
          {match[2]}
        </strong>
      )
    }
    last = match.index + match[0].length
  }

  if (last < text.length) nodes.push(text.slice(last))

  return <>{nodes}</>
}
