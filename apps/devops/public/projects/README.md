# Project assets

Screenshots and demo videos, one folder per project slug:

```
public/projects/<slug>/screenshot-*.png
public/projects/<slug>/demo.mp4
```

Anything under `public/` is served from the site root, so the path in
`src/data/projects.js` is `/projects/<slug>/screenshot-1.png` — no `public`
segment.

Architecture diagrams are **not** files any more; see below.

## Architecture diagrams do not live here

**Draw a diagram in the data file instead of exporting one.** A project's
`architecture` entry carries a `diagram` — zones, nodes and edges — which
`src/components/sections/ArchDiagram.jsx` renders in the page's own type and
palette and the project's accent:

```js
architecture: [
  {
    tab: 'Overall architecture',
    caption: 'Line under the drawing',
    alt: 'Describe what it shows, not that it is a diagram',
    diagram: {
      width: 1000,
      height: 560,
      zones: [{ id: 'vpc', label: 'VPC', x: 176, y: 120, w: 640, h: 390, tone: 'region' }],
      nodes: [{ id: 'alb', label: 'ALB ingress', glyph: 'balancer', x: 490, y: 185 }],
      edges: [{ from: 'igw', to: 'alb', label: 'HTTPS' }],
    },
  },
]
```

The draw.io exports this replaced were raster images inside an SVG wrapper: up
to 1.7MB each, blurry at page width, permanently light-mode on a page that has
a dark theme, invisible to search and to a screen reader, and impossible to
edit without leaving the repo. Read the header of `ArchDiagram.jsx` for the
full vocabulary and `archGlyphs.jsx` for the marks.

An image is still supported for a view that genuinely is one — a photo of a
whiteboard, say — and a project may mix the two:

```js
{ src: '/projects/<slug>/architecture-01.jpg', alt: '…', tab: '…', caption: '…' }
```

Leave `architecture: null` and the slot shows its "not added yet" state.

## Screenshots and demo video

```js
media: {
  // One tab per scenario; each holds that scenario's before and after,
  // stacked. `tab` is the short label, `label` the address-bar line.
  scenarios: [
    {
      id: 'scenario-1',
      tab: 'Nginx down',
      label: 'Scenario 1 — Nginx down',
      before: { src: '/projects/hailcast/s1-before.png', alt: '…' },
      after: { src: '/projects/hailcast/s1-after.png', alt: '…' },
    },
  ],
  // Either a file served from public/ …
  video: { kind: 'file', src: '/projects/hailcast/demo.mp4', poster: '…', caption: '…' },
  // … or an embed URL from a host:
  // video: { kind: 'embed', src: 'https://www.youtube.com/embed/…', title: '…', caption: '…' },
},
```

`media: null`, or an entry with no scenarios and no video, omits the section.
