// Two named parts rather than one block of prose — the second is the harder
// one to write, and burying it inside a paragraph is how it gets skipped.
const PARTS = [
  { id: 'learned', label: 'What I learned' },
  { id: 'differently', label: "What I'd do differently" },
]

export default function ReflectionSection({ project }) {
  return (
    <div className="reflection">
      {PARTS.map((part) => {
        const body = project.reflection?.[part.id]
        if (!body) return null
        return (
          <div className="reflection__part" key={part.id}>
            <h3 className="reflection__label">{part.label}</h3>
            <div className="prose">
              {[].concat(body).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
