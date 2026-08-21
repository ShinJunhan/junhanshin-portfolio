// A drawn architecture diagram, rendered from data rather than pasted in as
// an export. The draw.io SVGs this replaces were raster images in an SVG
// wrapper — 1.7MB each, unreadable at page width, invisible to search and to
// a screen reader, and permanently light-mode. A diagram described as nodes
// and edges renders in the page's own type and palette, follows the theme,
// scales to any width, and can be edited in the data file next to the copy it
// illustrates.
//
// The spec, straight from a project's `architecture[].diagram`:
//
//   {
//     width, height   the drawing's own coordinate space; the SVG scales it
//     zones  [{ id, label, note, x, y, w, h, tone }]
//     nodes  [{ id, label, sub, glyph, x, y, w, h, kind }]
//     edges  [{ from, to, label, dash, dir, bend, via }]
//   }
//
// `x`/`y` on a node is its centre, so moving one never means recomputing a
// corner. Zones are plain rects and are drawn first, underneath everything.
//
// Nothing here knows any project: a diagram is data, and this file is the
// vocabulary it is written in.
import { GLYPH_PATHS } from './archGlyphs.jsx'

// Node defaults, in diagram units. A node is wider than it is tall because
// the label is the payload — the glyph is a hint, not the subject.
const NODE_W = 156
const NODE_H = 62

// Zone tones. `cloud` is the provider boundary, `region` a subdivision of it,
// `onprem` anything outside the provider, `focus` the part of the picture the
// caption is actually about. They differ in fill and in whether the outline
// is dashed — never in hue, so a diagram stays inside the page's one accent.
const ZONE_TONES = ['cloud', 'region', 'onprem', 'focus']

// Where an edge leaves a box. Worked out from the geometry rather than
// declared per edge: an edge that has to restate the position it already
// implies goes stale the first time a node moves.
function edgePoint(node, toward) {
  const dx = toward.x - node.x
  const dy = toward.y - node.y
  if (Math.abs(dx) > Math.abs(dy)) {
    return { x: node.x + (Math.sign(dx) || 1) * (node.w / 2), y: node.y }
  }
  return { x: node.x, y: node.y + (Math.sign(dy) || 1) * (node.h / 2) }
}

// Orthogonal routing with rounded corners. Diagonals were tried and read as a
// sketch — a system diagram's lines should look laid out, not drawn freehand.
const CORNER = 14

// One polyline, every turn eased. The radius shrinks to fit whichever leg is
// shortest, so a tight dogleg curves less rather than overshooting into the
// leg before it.
function roundedPath(points) {
  if (points.length < 2) return ''
  const d = [`M ${points[0].x} ${points[0].y}`]

  for (let i = 1; i < points.length - 1; i += 1) {
    const prev = points[i - 1]
    const here = points[i]
    const next = points[i + 1]
    const legIn = Math.hypot(here.x - prev.x, here.y - prev.y)
    const legOut = Math.hypot(next.x - here.x, next.y - here.y)
    const r = Math.min(CORNER, legIn / 2, legOut / 2)
    if (r < 1) {
      d.push(`L ${here.x} ${here.y}`)
      continue
    }
    const before = {
      x: here.x - Math.sign(here.x - prev.x) * r,
      y: here.y - Math.sign(here.y - prev.y) * r,
    }
    const after = {
      x: here.x + Math.sign(next.x - here.x) * r,
      y: here.y + Math.sign(next.y - here.y) * r,
    }
    d.push(`L ${before.x} ${before.y}`)
    d.push(`Q ${here.x} ${here.y} ${after.x} ${after.y}`)
  }

  const last = points[points.length - 1]
  d.push(`L ${last.x} ${last.y}`)
  return d.join(' ')
}

// The two-leg L an edge takes when it has no waypoints of its own. `bend`
// forces the leg order where the automatic choice reads wrong — between two
// nodes that are nearly aligned on both axes there is no obviously right
// answer, so the data gets to say.
function route(from, to, bend) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const horizontalFirst =
    bend === 'h' ? true : bend === 'v' ? false : Math.abs(dx) > Math.abs(dy)

  const start = horizontalFirst
    ? { x: from.x + (Math.sign(dx) || 1) * (from.w / 2), y: from.y }
    : { x: from.x, y: from.y + (Math.sign(dy) || 1) * (from.h / 2) }
  const end = horizontalFirst
    ? { x: to.x - (Math.sign(dx) || 1) * (to.w / 2), y: to.y }
    : { x: to.x, y: to.y - (Math.sign(dy) || 1) * (to.h / 2) }

  const straight = horizontalFirst
    ? Math.abs(start.y - end.y) < 1
    : Math.abs(start.x - end.x) < 1
  if (straight) return { d: roundedPath([start, end]), start, end }

  const corner = horizontalFirst ? { x: end.x, y: start.y } : { x: start.x, y: end.y }
  return { d: roundedPath([start, corner, end]), start, end }
}

// Waypoints, for the few edges that have to go around something. The anchors
// are taken from the first and last waypoint rather than from the other node,
// so an edge that leaves rightwards and arrives from above leaves and arrives
// on the right edges — which is the entire reason for routing it by hand.
function routeVia(from, to, via) {
  const points = via.map(([x, y]) => ({ x, y }))
  const start = edgePoint(from, points[0])
  const end = edgePoint(to, points[points.length - 1])
  return { d: roundedPath([start, ...points, end]), start, end }
}

function Glyph({ name, x, y }) {
  const path = GLYPH_PATHS[name] ?? GLYPH_PATHS.service
  return (
    <g className="archd__glyph" transform={`translate(${x} ${y}) scale(0.75)`}>
      {path}
    </g>
  )
}

// Labels are wrapped by hand. SVG has no text wrapping, and `foreignObject`
// would put an HTML subtree inside the drawing — which breaks the moment the
// SVG is used anywhere but a browser, and takes the fonts with it.
//
// The line budget is computed from the node's own width rather than being one
// constant for every node, which is what the first version did: a 124-wide
// node got the same 16-character allowance as a 180-wide one, and its label
// ran 11px out through the right-hand border. Both faces here are set at
// roughly 0.48em average advance, so one figure covers the 13px label and the
// 10.5px monospace sub-line.
const AVG_ADVANCE = 6.4
const PAD_RIGHT = 10
const LABEL_LH = 15
const SUB_LH = 13

// How much horizontal room a node's text actually has: its width, less the
// column the glyph occupies and the padding on the far side.
function textWidth(w, hasGlyph) {
  return w - (hasGlyph ? 44 : 16) - PAD_RIGHT
}

function wrap(text, width) {
  const limit = Math.max(4, Math.floor(width / AVG_ADVANCE))
  const words = String(text ?? '').split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length > limit && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

function Node({ node }) {
  const w = node.w ?? NODE_W
  const h = node.h ?? NODE_H
  const room = textWidth(w, Boolean(node.glyph))
  const lines = wrap(node.label, room)
  // The sub-line is wrapped on the same budget rather than trusted to be
  // short. Every overflow the first version shipped was a sub-line.
  const subLines = node.sub ? wrap(node.sub, room) : []
  // The glyph sits at the left edge of the box and the text starts after it,
  // so a two-line label does not drift out from under a centred mark.
  const textLeft = node.x - w / 2 + (node.glyph ? 44 : 16)
  // Vertically centred as a block, counting every line of both parts —
  // otherwise a node with a two-line sub grows lopsided and then out through
  // the bottom border.
  const blockH = lines.length * LABEL_LH + subLines.length * SUB_LH
  const firstBaseline = node.y - blockH / 2 + 11

  return (
    <g className={`archd__node archd__node--${node.kind ?? 'service'}`}>
      <rect
        x={node.x - w / 2}
        y={node.y - h / 2}
        width={w}
        height={h}
        rx="4"
        className="archd__node-box"
      />
      {node.glyph && <Glyph name={node.glyph} x={node.x - w / 2 + 14} y={node.y - 10} />}
      <text className="archd__node-label" x={textLeft} y={firstBaseline}>
        {lines.map((line, i) => (
          <tspan key={line + i} x={textLeft} dy={i === 0 ? 0 : LABEL_LH}>
            {line}
          </tspan>
        ))}
      </text>
      {subLines.length > 0 && (
        <text
          className="archd__node-sub"
          x={textLeft}
          y={firstBaseline + lines.length * LABEL_LH - 1}
        >
          {subLines.map((line, i) => (
            <tspan key={line + i} x={textLeft} dy={i === 0 ? 0 : SUB_LH}>
              {line}
            </tspan>
          ))}
        </text>
      )}
    </g>
  )
}

function Zone({ zone }) {
  const tone = ZONE_TONES.includes(zone.tone) ? zone.tone : 'cloud'

  return (
    <g className={`archd__zone archd__zone--${tone}`}>
      <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx="6" className="archd__zone-box" />
      {zone.label && (
        <text className="archd__zone-label" x={zone.x + 12} y={zone.y + 19}>
          {zone.label}
          {zone.note && <tspan className="archd__zone-note">{`  ${zone.note}`}</tspan>}
        </text>
      )}
    </g>
  )
}

function Edge({ edge, nodes, id }) {
  const from = nodes[edge.from]
  const to = nodes[edge.to]
  // A diagram that names a node it does not define should show the rest of
  // itself rather than throwing the whole page away.
  if (!from || !to) return null

  const { d, start, end } = edge.via
    ? routeVia(from, to, edge.via)
    : route(from, to, edge.bend)

  return (
    <g className={`archd__edge${edge.dash ? ' archd__edge--dash' : ''}`}>
      <path
        d={d}
        className="archd__edge-line"
        markerEnd={`url(#${id}-arrow)`}
        markerStart={edge.dir === 'both' ? `url(#${id}-arrow-back)` : undefined}
      />
      {edge.label && <EdgeLabel edge={edge} start={start} end={end} />}
    </g>
  )
}

// A label centred above its line works for a horizontal edge and fails for a
// vertical one: the midpoint of a short vertical run is a few pixels from the
// box at either end, and "above" puts the word straight through one of them.
// A vertical edge takes its label beside the line instead, set from the left.
// `labelAt` in the data overrides both, for the routed edges where neither
// default is right.
function EdgeLabel({ edge, start, end }) {
  const vertical = Math.abs(start.x - end.x) < 1 && Math.abs(start.y - end.y) > 1
  const [ax, ay] = edge.labelAt ?? []

  return (
    <text
      className="archd__edge-label"
      x={ax ?? (vertical ? (start.x + end.x) / 2 + 8 : (start.x + end.x) / 2)}
      y={ay ?? (vertical ? (start.y + end.y) / 2 + 4 : (start.y + end.y) / 2 - 7)}
      textAnchor={edge.labelAnchor ?? (edge.labelAt ? 'middle' : vertical ? 'start' : 'middle')}
    >
      {edge.label}
    </text>
  )
}

// Markers are per-diagram rather than shared in a single sprite: two diagrams
// on the same page would otherwise fight over one id, and the second one's
// arrowheads would vanish.
let seq = 0

export default function ArchDiagram({ diagram, title, id: forcedId }) {
  const id = forcedId ?? `archd-${(seq += 1)}`
  const nodes = Object.fromEntries(
    (diagram.nodes ?? []).map((node) => [
      node.id,
      { ...node, w: node.w ?? NODE_W, h: node.h ?? NODE_H },
    ])
  )

  return (
    <svg
      className="archd"
      viewBox={`0 0 ${diagram.width} ${diagram.height}`}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* `context-stroke` so an arrowhead is always the colour of the line
            it terminates, including the accent-lit ones. */}
        <marker
          id={`${id}-arrow`}
          viewBox="0 0 10 10"
          refX="8.5"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.4 L 9 5 L 0 8.6 z" fill="context-stroke" />
        </marker>
        <marker
          id={`${id}-arrow-back`}
          viewBox="0 0 10 10"
          refX="8.5"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.4 L 9 5 L 0 8.6 z" fill="context-stroke" />
        </marker>
      </defs>

      {(diagram.zones ?? []).map((zone) => (
        <Zone key={zone.id ?? zone.label} zone={zone} />
      ))}

      {/* Edges under nodes, so a line that passes near a box tucks behind it
          rather than crossing its label. */}
      {(diagram.edges ?? []).map((edge, i) => (
        <Edge key={`${edge.from}-${edge.to}-${i}`} edge={edge} nodes={nodes} id={id} />
      ))}

      {(diagram.nodes ?? []).map((node) => (
        <Node key={node.id} node={node} />
      ))}

      {(diagram.captions ?? []).map((caption) => (
        <text
          key={caption.text}
          className={`archd__aside${caption.tone === 'accent' ? ' archd__aside--on' : ''}`}
          x={caption.x}
          y={caption.y}
          textAnchor={caption.anchor ?? 'start'}
        >
          {caption.text}
        </text>
      ))}
    </svg>
  )
}
