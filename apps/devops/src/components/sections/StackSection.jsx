import { techIcon, techInitial } from '../../data/tech.js'
import useMediaQuery from '../../lib/useMediaQuery.js'
import TechStackWheel from './TechStackWheel.jsx'

// A radial layout cannot be shrunk into a phone — twenty icons on a ring at
// 375px would be unreadable at any icon size. Below this the grouped card list
// renders instead, which is a different layout rather than a smaller one.
const WHEEL_MIN_WIDTH = '(min-width: 861px)'

// Grouped under category labels rather than one flat run of marks — a stack
// this size reads better sorted into what each tool is *for*. Static grouping
// on purpose: this is a handful of items per project, not the landing page's
// filterable skills honeycomb, and a filter would be interaction for its own
// sake.
//
// `stack` takes either shape:
//   ['AWS', 'Terraform']                            one unlabelled group
//   [{ category: 'IaC/Automation', items: [...] }]  labelled groups
// so a project that has no useful categories can stay a plain list.
function groupsOf(stack) {
  if (!stack?.length) return []
  if (typeof stack[0] === 'string') return [{ category: null, items: stack }]
  return stack.filter((group) => group?.items?.length)
}

// A stack entry with no logo on disk yet falls back to a monogram tile, so the
// row stays even and nothing shows as a broken image.
function Tech({ item }) {
  const icon = techIcon(item)

  return (
    <li className="tech">
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
}

export default function StackSection({ project }) {
  const groups = groupsOf(project.stack)
  const wheelFits = useMediaQuery(WHEEL_MIN_WIDTH)

  // The wheel needs categories to divide the centre into; an unlabelled flat
  // list has nothing to slice, so it stays a list at every width.
  if (wheelFits && groups.length > 1 && groups.every((group) => group.category)) {
    return <TechStackWheel groups={groups} />
  }

  return (
    <div className="stack-groups">
      {groups.map((group) => (
        <section className="stack-group" key={group.category ?? 'all'}>
          {group.category && <h3 className="stack-group__label">{group.category}</h3>}
          <ul className="stack">
            {group.items.map((item) => (
              <Tech item={item} key={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
