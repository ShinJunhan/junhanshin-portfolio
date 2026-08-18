import { useEffect, useMemo, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { techIcon, techInitial } from '../../data/tech.js'

// The shared wheel, used by every project's Tech Stack section. It knows
// nothing about any particular project: give it a project's categories and it
// draws that project's wheel — any number of categories, any number of icons
// in each.
//
// Expected shape, straight from a project's `stack` in data/projects.js:
//
//   [{ category: 'IaC/Automation', items: ['Terraform', …], tint: '…' }, …]
//
// `tint` is optional. Without it a category takes the next hue from the
// default palette below, so a project only names colours when it wants
// something specific.

// The fallback palette, in order. No blue in the list: --name-pop is reserved
// for Junhan site-wide, and a category ring in the same family would read as
// his colour. Seven entries, which covers the deepest stack so far; a project
// with more categories than this cycles back round to the start.
const DEFAULT_TINTS = [
  'var(--c-emerald)',
  'var(--c-orange)',
  'var(--c-coral)',
  'var(--c-forest)',
  'var(--c-violet)',
  'var(--c-steel)',
  'var(--c-indigo)',
]

const CYCLE_MS = 2400
// How long a selection survives with no further interaction before the wheel
// goes back to its ambient state. Long enough to read the category, short
// enough that an abandoned click doesn't freeze the wheel for good.
const RESUME_MS = 6000

// Geometry, in the 0–100 space the wheel's container is measured in. The pie
// occupies the middle, the icons ride a ring outside it.
const CENTER = 50
const PIE_R = 31
const LABEL_R = 18
const ICON_R = 44

const polar = (radius, degrees) => {
  const rad = ((degrees - 90) * Math.PI) / 180
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) }
}

// One pie slice as an SVG path: centre, out to the arc's start, round to its
// end, back to centre.
function slicePath(start, span) {
  const from = polar(PIE_R, start)
  const to = polar(PIE_R, start + span)
  const largeArc = span > 180 ? 1 : 0

  return `M ${CENTER} ${CENTER} L ${from.x} ${from.y} A ${PIE_R} ${PIE_R} 0 ${largeArc} 1 ${to.x} ${to.y} Z`
}

export default function TechStackWheel({ groups }) {
  const reduceMotion = useReducedMotion()
  const [cycleIndex, setCycleIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState(null)
  const [pinnedIndex, setPinnedIndex] = useState(null)
  // Bumped on every interaction so the idle timer below restarts. A plain
  // boolean could not distinguish "still interacting" from "interacted once".
  const [interactionAt, setInteractionAt] = useState(0)

  const activeIndex = hoverIndex ?? pinnedIndex ?? cycleIndex
  const paused = hoverIndex !== null || pinnedIndex !== null

  // Wedges are sized by how many icons a category holds, not split evenly:
  // an even split gave a one-icon category the same wedge as a four-icon one
  // and left an obvious empty arc. Each category's icons then spread across
  // its own wedge, so the group sits directly outside the slice it belongs to.
  const arcs = useMemo(() => {
    const total = groups.reduce((sum, group) => sum + group.items.length, 0)
    let cursor = 0

    return groups.map((group, index) => {
      const span = (group.items.length / total) * 360
      const arc = {
        start: cursor,
        span,
        mid: cursor + span / 2,
        tint: group.tint ?? DEFAULT_TINTS[index % DEFAULT_TINTS.length],
      }
      cursor += span
      return arc
    })
  }, [groups])

  useEffect(() => {
    if (reduceMotion || paused || groups.length < 2) return

    const timer = setInterval(
      () => setCycleIndex((index) => (index + 1) % groups.length),
      CYCLE_MS
    )
    return () => clearInterval(timer)
  }, [reduceMotion, paused, groups.length])

  // A pinned category releases itself once the reader stops interacting, so
  // the wheel returns to cycling on its own rather than staying frozen on
  // whatever was last clicked.
  useEffect(() => {
    if (pinnedIndex === null) return

    const timer = setTimeout(() => setPinnedIndex(null), RESUME_MS)
    return () => clearTimeout(timer)
  }, [pinnedIndex, interactionAt])

  const touch = () => setInteractionAt(Date.now())
  const select = (index) => {
    touch()
    setPinnedIndex((current) => (current === index ? null : index))
  }
  const preview = (index) => {
    touch()
    setHoverIndex(index)
  }

  const ringItems = groups.flatMap((group, groupIndex) =>
    group.items.map((item, itemIndex) => ({
      item,
      groupIndex,
      angle:
        arcs[groupIndex].start +
        ((itemIndex + 0.5) * arcs[groupIndex].span) / group.items.length,
    }))
  )

  return (
    <div className="wheel" onMouseLeave={() => setHoverIndex(null)}>
      <div className="wheel__stage">
        <svg className="wheel__pie" viewBox="0 0 100 100" aria-hidden="true">
          {groups.map((group, index) => (
            <path
              key={group.category}
              d={slicePath(arcs[index].start, arcs[index].span)}
              className={`wheel__slice${index === activeIndex ? ' wheel__slice--on' : ''}`}
              style={{ '--slice-tint': arcs[index].tint }}
              onMouseEnter={() => preview(index)}
              onClick={() => select(index)}
            />
          ))}
        </svg>

        {/* Labels are HTML rather than SVG text, and run along their wedge's
            radius rather than across it. A wedge sized to one icon is only ~16
            degrees wide — no horizontal label fits that, but a radial one has
            the whole radius to use. Rotated to stay upright on both sides. */}
        {groups.map((group, index) => {
          const { mid } = arcs[index]
          const at = polar(LABEL_R, mid)
          const upright = mid > 180 ? mid + 90 : mid - 90

          return (
            <button
              key={group.category}
              type="button"
              className={`wheel__label${index === activeIndex ? ' wheel__label--on' : ''}`}
              style={{
                left: `${at.x}%`,
                top: `${at.y}%`,
                transform: `translate(-50%, -50%) rotate(${upright}deg)`,
              }}
              aria-pressed={index === pinnedIndex}
              onMouseEnter={() => preview(index)}
              onFocus={() => preview(index)}
              onBlur={() => setHoverIndex(null)}
              onClick={() => select(index)}
            >
              {group.category}
            </button>
          )
        })}

        <ul className="wheel__ring">
          {ringItems.map(({ item, groupIndex, angle }) => {
            const at = polar(ICON_R, angle)
            const icon = techIcon(item)
            const on = groupIndex === activeIndex

            return (
              <li
                key={item}
                className={`wheel__node${on ? ' wheel__node--on' : ''}`}
                style={{
                  left: `${at.x}%`,
                  top: `${at.y}%`,
                  '--node-tint': arcs[groupIndex].tint,
                }}
                onMouseEnter={() => preview(groupIndex)}
                onClick={() => select(groupIndex)}
              >
                <span className="wheel__node-mark">
                  {icon ? (
                    <img src={icon} alt="" loading="lazy" />
                  ) : (
                    <span className="wheel__node-initial" aria-hidden="true">
                      {techInitial(item)}
                    </span>
                  )}
                </span>
                {/* Names the individual tool, which is a different question
                    from which category is selected — hence its own tooltip
                    rather than leaning on the category highlight. */}
                <span className="wheel__node-name" aria-hidden="true">
                  {item}
                </span>
                <span className="sr-only">
                  {item} — {groups[groupIndex].category}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
