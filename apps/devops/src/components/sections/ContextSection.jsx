// What was being built and why. Accepts either one string or an array of
// paragraphs, so a project can grow past a single block without a schema
// change.
export default function ContextSection({ project }) {
  const paragraphs = [].concat(project.context)

  return (
    <div className="prose">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  )
}
