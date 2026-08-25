import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
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

// A full turn of the drift. Four minutes is slow enough that the motion reads
// as ambient rather than as something asking to be watched — under the
// threshold at which peripheral movement competes with reading the panel
// beside it.
const SPIN_PERIOD_MS = 240000
// The snap home. Long enough to read as a movement rather than a jump cut,
// short enough that the reader's click still feels like it landed.
const SNAP_MS = 620
// The largest step the drift will take in one frame. requestAnimationFrame
// stops firing entirely while the tab is in the background, so the first frame
// after the reader comes back carries a delta of however long they were gone —
// which, uncapped, is a jump of a degree per 667ms away. Clamping to a few
// frames' worth means a backgrounded wheel simply pauses and resumes where it
// stood, rather than lurching to catch up with a rotation nobody watched.
const MAX_FRAME_MS = 50

// Geometry, in the 0–100 space the wheel's container is measured in. The pie
// occupies the middle, the icons ride a ring outside it.
const CENTER = 50
const PIE_R = 31
const LABEL_R = 18
const ICON_R = 44

// How much radial room a label gets, in the same 0–100 units. A label is
// centred on LABEL_R and runs along the radius, so its half-length is bounded
// at both ends: by the pie's edge going out, and by the hub where all seven
// wedges converge coming in. min(LABEL_R - 7, PIE_R - 2 - LABEL_R) = 11, so
// the whole allotment is 22 units. The CSS turns that into a font size — see
// `.wheel__label`.
const LABEL_SPAN = 22

// Above this many characters a category name is set on two lines instead of
// one. The font size is solved from the character count against a fixed radial
// span, and that solve has a floor — past roughly this length the floor wins,
// the text no longer fits the span, and `text-overflow` quietly eats the end of
// it. "Monitoring & Alerting" was arriving as a truncated stub.
//
// Splitting is the better trade than shrinking further: two lines of ten
// characters solve to a much larger size than one line of twenty-one, so the
// label ends up more legible than it was before it overflowed, not less.
const LABEL_WRAP_OVER = 14

// Breaks a category into at most two lines, at whichever word boundary sits
// nearest the middle. A '/' keeps its place at the end of the first line —
// 'Cloud/Infrastructure' reads as 'Cloud/' over 'Infrastructure', and a
// leading slash on the second line would read as a fraction.
function labelLines(text, over = LABEL_WRAP_OVER) {
  if (text.length <= over) return [text]

  const breaks = []
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === ' ') breaks.push({ end: i, start: i + 1 })
    else if (text[i] === '/') breaks.push({ end: i + 1, start: i + 1 })
  }
  if (!breaks.length) return [text]

  const middle = text.length / 2
  const best = breaks.reduce((a, b) =>
    Math.abs(a.end - middle) <= Math.abs(b.end - middle) ? a : b
  )
  return [text.slice(0, best.end).trim(), text.slice(best.start).trim()]
}

// Where an icon's tooltip flips from above the icon to below it, as a y in the
// same 0-100 space the wheel is drawn in.
//
// The label is drawn above its icon, and the icons ride a radius fixed as a
// *fraction* of the stage while the label stays a fixed number of pixels tall.
// So the nearer the top of the wheel an icon sits, the further its label
// reaches past the stage's own edge — where it is clipped, lands under the
// sticky section menu, or collides with the section heading. Below this line
// the label is placed under the icon instead, pointing into the empty band
// between the ring and the pie, where there is always room for it.
//
// 18 covers the worst case. A label needs about 53px of headroom, which is 15
// units at the narrowest stage the wheel is drawn at — but the icons' own boxes
// already sit a little past the rim at that size, so the threshold carries
// three units of margin on top of the measured need.
const TIP_FLIP_Y = 18

// The same idea on the other axis. A label is centred on its icon, so half of
// it hangs off each side — and for the icons at the far left and right of the
// ring, that half runs past the rim and is cut off exactly as the top ones
// were. Inside these bounds the label is anchored by its near edge instead of
// its middle, so it opens *into* the wheel rather than across the rim.
//
// 20 is set against the widest label the wheel carries: 'GitHub Actions' is
// about 110px, and half of that is roughly 15 units at the smallest stage the
// wheel is drawn at. The extra five are margin.
const TIP_EDGE_X = 20

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

// ---- The drift, and why it is driven from JS --------------------------------
//
// Two layers turn against each other: the dial (the pie and its labels, which
// move as one piece so a label never slides off the wedge it names) and the
// ring of icons outside it. Opposite directions, one shared angle.
//
// The drift is decorative and it is also, unavoidably, *wrong* — an icon
// drifts away from the wedge it belongs to, and that pairing is the whole
// point of the component. So the first click anywhere on the wheel ends it:
// the rotation stops for the life of the page and both layers ease back to the
// one home alignment where every icon sits outside its own category again. Not
// to wherever the click happened — to the single fixed zero. The moment a
// reader engages, alignment is worth more than atmosphere.
//
// All of it runs from one requestAnimationFrame loop writing transforms
// straight to the DOM, rather than from a CSS animation, for two reasons:
//
//   * The snap has to start from the angle the wheel is *at*, and with a CSS
//     animation that number lives inside the compositor. Here it is just
//     `angleRef.current`.
//   * Radial labels have a handedness. A label runs along its wedge's spoke,
//     so it must flip once per turn to keep from reading upside-down, and the
//     flip point depends on the live angle — see `uprightFor`. That is a value
//     per frame, not a value per render.
//
// Nothing in this loop touches React state, so the 2.4s highlight cycle
// re-rendering underneath it cannot fight the transforms. That is also why no
// transform for these four elements is written in JSX: `paint` owns them
// outright, and a re-render that reset one would show as a stutter.
//
// The labels stay *radial* rather than being counter-rotated level, and that is
// load-bearing rather than stylistic. Level text has to fit across its wedge,
// and the one-item wedges here are ~16 degrees — 26px of arc for a word that
// needs 58px — while level labels at this radius also collide with their own
// neighbours in three of seven pairs. A narrow wedge has depth but no width,
// which is what radial labels are for.

// Which way up a radial label reads, given the angle its spoke is pointing on
// screen *right now*. A label runs along that spoke, so there are only two
// answers, and which one is right flips as the spoke crosses the vertical.
function uprightFor(angle) {
  const at = ((angle % 360) + 360) % 360
  return at > 180 ? at + 90 : at - 90
}

// The shortest way back to zero: -180 < x <= 180. Snapping from 350 degrees
// should travel 10 degrees forward, not 350 back.
function shortestToHome(angle) {
  return (((angle + 180) % 360) + 360) % 360 - 180
}

export default function TechStackWheel({ groups }) {
  const reduceMotion = useReducedMotion()
  const [cycleIndex, setCycleIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState(null)
  const [pinnedIndex, setPinnedIndex] = useState(null)
  // Bumped on every interaction so the idle timer below restarts. A plain
  // boolean could not distinguish "still interacting" from "interacted once".
  const [interactionAt, setInteractionAt] = useState(0)
  // One-way: the drift never restarts once a reader has taken hold of the
  // wheel. Re-starting it would pull the icons back off their wedges under
  // someone who had just clicked to line them up.
  const [drifting, setDrifting] = useState(true)

  const dialRef = useRef(null)
  const ringRef = useRef(null)
  const labelRefs = useRef([])
  const spinRefs = useRef([])
  const nodeRefs = useRef([])
  // The live angle. Deliberately a ref: it changes every frame and nothing
  // rendered depends on it.
  const angleRef = useRef(0)

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

  // Memoised because `paint` reads it every frame to decide which way each
  // tooltip should open — see TIP_FLIP_Y.
  const ringItems = useMemo(
    () =>
      groups.flatMap((group, groupIndex) =>
        group.items.map((item, itemIndex) => ({
          item,
          groupIndex,
          angle:
            arcs[groupIndex].start +
            ((itemIndex + 0.5) * arcs[groupIndex].span) / group.items.length,
        }))
      ),
    [groups, arcs]
  )

  // Writes one angle to all four moving parts. The dial turns one way and the
  // ring the other; each label and each icon then takes back exactly the
  // rotation its own layer applied, so text and logos stay upright while their
  // positions orbit.
  const paint = useCallback(
    (angle) => {
      if (dialRef.current) dialRef.current.style.transform = `rotate(${-angle}deg)`
      if (ringRef.current) ringRef.current.style.transform = `rotate(${angle}deg)`

      // Inside a dial rotated by -angle, a label laid out on spoke `mid` is on
      // screen at `mid - angle`. Its local rotation is therefore whatever the
      // upright answer is there, minus the dial's own turn.
      labelRefs.current.forEach((node, index) => {
        if (!node || !arcs[index]) return
        const upright = uprightFor(arcs[index].mid - angle) + angle
        node.style.transform = `translate(-50%, -50%) rotate(${upright}deg)`
      })

      spinRefs.current.forEach((node) => {
        if (node) node.style.transform = `rotate(${-angle}deg)`
      })

      // A node laid out on spoke `a` is on screen at `a + angle`, because the
      // ring itself carries that rotation. Which half of the icon its tooltip
      // opens into therefore has to be decided per frame, not once at layout:
      // the ring is still turning while a reader hovers it.
      ringItems.forEach((entry, index) => {
        const node = nodeRefs.current[index]
        if (!node) return
        const rad = ((entry.angle + angle - 90) * Math.PI) / 180
        const y = CENTER + ICON_R * Math.sin(rad)
        const x = CENTER + ICON_R * Math.cos(rad)
        node.dataset.tip = y < TIP_FLIP_Y ? 'below' : 'above'
        node.dataset.tipX =
          x < TIP_EDGE_X ? 'start' : x > 100 - TIP_EDGE_X ? 'end' : 'center'
      })
    },
    [arcs, ringItems]
  )

  // The home alignment, painted before the browser gets a chance to show a
  // frame without it. Without this the labels — whose translate(-50%, -50%)
  // now lives in `paint` rather than in JSX — would flash unpositioned.
  useLayoutEffect(() => {
    paint(angleRef.current)
  }, [paint])

  useEffect(() => {
    if (reduceMotion || !drifting) return

    let last = performance.now()
    let frame = requestAnimationFrame(function step(now) {
      const elapsed = Math.min(Math.max(now - last, 0), MAX_FRAME_MS)
      last = now
      angleRef.current = (angleRef.current + (elapsed / SPIN_PERIOD_MS) * 360) % 360
      paint(angleRef.current)
      frame = requestAnimationFrame(step)
    })

    return () => cancelAnimationFrame(frame)
  }, [reduceMotion, drifting, paint])

  // The snap. Runs once, when `drifting` goes false, easing from wherever the
  // loop above left off back to the single home angle.
  useEffect(() => {
    if (drifting || reduceMotion) return

    const from = shortestToHome(angleRef.current)
    if (Math.abs(from) < 0.01) {
      angleRef.current = 0
      paint(0)
      return
    }

    const start = performance.now()
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min((now - start) / SNAP_MS, 1)
      // Cubic ease-out: quickest at the moment of the click, settling into
      // alignment rather than arriving at speed.
      angleRef.current = from * (1 - t) ** 3
      paint(angleRef.current)
      if (t < 1) frame = requestAnimationFrame(step)
      else paint((angleRef.current = 0))
    })

    return () => cancelAnimationFrame(frame)
  }, [drifting, reduceMotion, paint])

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
  // whatever was last clicked. The drift does not come back with it — see
  // `drifting` above.
  useEffect(() => {
    if (pinnedIndex === null) return

    const timer = setTimeout(() => setPinnedIndex(null), RESUME_MS)
    return () => clearTimeout(timer)
  }, [pinnedIndex, interactionAt])

  const touch = () => setInteractionAt(Date.now())
  const select = (index) => {
    touch()
    setDrifting(false)
    setPinnedIndex((current) => (current === index ? null : index))
  }
  const preview = (index) => {
    touch()
    setHoverIndex(index)
  }

  return (
    <div className="wheel" onMouseLeave={() => setHoverIndex(null)}>
      <div className="wheel__stage">
        {/* The pie and its labels turn as one piece, so a label never drifts
            off the wedge it names — only the ring outside it does. */}
        <div className="wheel__dial" ref={dialRef}>
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
              radius rather than across it. A wedge sized to one icon is only
              ~16 degrees wide — no horizontal label fits that, but a radial
              one has the whole radius to use. The rotation that keeps each one
              upright as the dial turns is written by `paint`, not here.

              Each one is sized to its own wedge rather than to a single fixed
              size for all of them. The size came out of the type scale, which
              is a fixed number of pixels, while the wheel is a fraction of
              whatever width it is given — so a long label ate a larger and
              larger share of the radius as the wheel got smaller, and
              "Cloud/Infrastructure" was already running from the hub to the
              pie's edge at full size. The CSS solves a size from the character
              count and the allotment above; short labels are capped at the
              scale's own value and never grow. */}
          {groups.map((group, index) => {
            const at = polar(LABEL_R, arcs[index].mid)

            return (
              <button
                key={group.category}
                type="button"
                ref={(node) => {
                  labelRefs.current[index] = node
                }}
                className={`wheel__label${index === activeIndex ? ' wheel__label--on' : ''}`}
                style={{
                  left: `${at.x}%`,
                  top: `${at.y}%`,
                  // The label's own length, which is what its font size is
                  // solved from. Monospace makes that solvable without
                  // measuring anything: every glyph is the same width, so the
                  // character count is the width, in ems.
                  // The *longest line*, not the whole string: the font size is
                  // solved from this, and a wrapped label's width is set by its
                  // widest line rather than by its total length.
                  '--chars': Math.max(...labelLines(group.category).map((l) => l.length)),
                  '--label-span': LABEL_SPAN,
                }}
                aria-pressed={index === pinnedIndex}
                onMouseEnter={() => preview(index)}
                onFocus={() => preview(index)}
                onBlur={() => setHoverIndex(null)}
                onClick={() => select(index)}
              >
                {labelLines(group.category).map((line) => (
                  <span className="wheel__label-line" key={line}>
                    {line}
                  </span>
                ))}
              </button>
            )
          })}
        </div>

        <ul className="wheel__ring" ref={ringRef}>
          {ringItems.map(({ item, groupIndex, angle }, index) => {
            const at = polar(ICON_R, angle)
            const icon = techIcon(item)
            const on = groupIndex === activeIndex

            return (
              <li
                key={item}
                ref={(node) => {
                  nodeRefs.current[index] = node
                }}
                className={`wheel__node${on ? ' wheel__node--on' : ''}`}
                style={{
                  left: `${at.x}%`,
                  top: `${at.y}%`,
                  '--node-tint': arcs[groupIndex].tint,
                }}
                onMouseEnter={() => preview(groupIndex)}
                onClick={() => select(groupIndex)}
              >
                {/* Counter-rotates the ring's drift so the logo and its
                    tooltip stay upright while the node orbits. Both have to be
                    inside it: an upside-down tooltip is worse than an
                    upside-down logo, and only one of the two would have been
                    fixed by rotating the mark alone. */}
                <span
                  className="wheel__node-spin"
                  ref={(node) => {
                    spinRefs.current[index] = node
                  }}
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
