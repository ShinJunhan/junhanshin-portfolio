import { techIcon, techInitial } from '../../data/tech.js'

// Real vendor logos rather than tinted word-pills — the mark is what a reader
// scanning the page actually recognises. A stack entry with no logo on disk
// yet falls back to a monogram tile, so the row stays even and nothing shows
// as a broken image.
export default function StackSection({ project }) {
  return (
    <ul className="stack">
      {project.stack.map((item) => {
        const icon = techIcon(item)
        return (
          <li className="tech" key={item}>
            <span className="tech__mark">
              {icon ? (
                // Decorative: the label sits right next to it in text.
                <img src={icon} alt="" loading="lazy" />
              ) : (
                <span className="tech__initial" aria-hidden="true">
                  {techInitial(item)}
                </span>
              )}
            </span>
            <span className="tech__label">{item}</span>
          </li>
        )
      })}
    </ul>
  )
}
