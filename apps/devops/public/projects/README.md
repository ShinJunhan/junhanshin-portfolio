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

### hailcast: both forms, one tab each

`hailcast` keeps **both** forms of every architecture view, paired under a
single tab with a Clean / Detailed toggle in the panel's address bar. Clean is
the drawn diagram; Detailed is the original draw.io export of the same view.
They are two levels of detail on one subject, not two diagrams, so they share
one tab and one name.

```
public/projects/hailcast/architecture-01-overall.svg   … -08-pod-architecture.svg
```

The pairing lives on the architecture entry itself:

```js
{
  tab: 'Overall architecture',
  caption: '…',            // the address bar in Clean
  alt: '…',
  diagram: { … },          // Clean
  detailed: {              // Detailed
    src: '/projects/hailcast/architecture-01-overall.svg',
    caption: '…',          // the address bar in Detailed
    alt: '…',
  },
}
```

An entry with only `diagram`, or only `src`, renders exactly as before and
grows no toggle — the pairing is opt-in per view.

Four more files sit in the same folder and are not diagrams — three Grafana
captures from the demo and the chart the cost section is built on, all lifted
from the team's final-report deck:

```
public/projects/hailcast/demo-01-predictive-scaling.png
                         demo-02-keda-queue.png
                         demo-03-worker-runtime.png
                         pod-hour-savings.png
```

The dashboards are in Korean and stay that way. Retitling someone else's
console inside a screenshot would turn evidence into a mock-up of evidence, so
the reading each panel shows is named in the scenario's `state` line and spelled
out again in its `alt`, and the capture itself is left untouched.

**Only the selected form is mounted.** `ArchitectureSection` renders one branch
or the other rather than hiding one with CSS, so a reader who never leaves
Clean never downloads the export — 567KB for the overall view alone. The
toggle's state is per tab, so switching one view to Detailed does not switch
the rest, and a tab remembers where you left it.

The drawn views were corrected against these exports — the single 2a NAT
gateway, the VPC gateway endpoint, the HPA that KEDA creates, the ClusterIP
service layer and the GitOps approval gates all came from them.

How the two compare, measured rather than assumed:

| | Clean (drawn) | Detailed (export) |
|---|---|---|
| Bytes on the wire | 0 (inline SVG) | 1.7MB across the eight, fetched on demand |
| Follows the page theme | yes | yes — `light-dark()` works |
| Readable at column width | yes | no, the dense ones need full size |
| Searchable / screen-reader text | yes | no (`alt` only) |
| Editable in-repo | yes | no |

The earlier claim in this file that exports are "permanently light-mode" was
true of the **raster** exports that were dropped; it is not true of these.

Exported images are held to the panel by `.figure__frame img`, which is
`width: 100%; height: auto`. These files are up to 1802px across and would push
the page sideways at their intrinsic size, so that rule is load-bearing — don't
give the frame an intrinsic width.

### lock-n-lock: settled

`lock-n-lock` is no longer part of that comparison. Its drawn view stays — now
tabbed **Overall architecture**, because the drawing is the whole system and
security is the lens on it, not the subset it draws — and the single
1.1MB stacked-panel export that sat beside it is gone. In its place are five
authored diagrams, one flow each:

```
public/projects/lock-n-lock/architecture-01-system-overview.svg
                            architecture-02-alerting-automation-flow.svg
                            architecture-03-user-request-flow.svg
                            architecture-04-operations-backup-flow.svg
                            architecture-05-blue-green-deployment.svg
```

These are ~2564px screenshots in an SVG wrapper, so they carry the usual export
costs — no searchable text, not editable in-repo — but ~600KB for all five
against 1.1MB for the one they replace, and one diagram per flow instead of
five panels sharing a canvas. They are kept as files because a flow drawn by
the team is theirs, not something to paraphrase into nodes and edges.

They are declared from a table in `src/data/projects.js`, not as five entries:
the folder is named once, and each row's title is the string the SVG already
carries in its own `<title>`, which becomes the tab, the address bar line and
the `alt` together. An `<img>` never exposes the title inside its SVG, so the
`alt` is the only route a screen reader has to that text.

## Presentation slides

A deck is exported once, as one WebP per slide, into its own folder beside the
project's screenshots:

```
public/projects/<slug>/slides/slide-01.webp
```

What the deck *is* — its sections, which slide starts each one, and the speaker
notes — lives with the project's other written content rather than here:

```
src/content/<slug>/slides.json
```

That file's `imageBase` is the path above, so the images and the manifest can
be moved independently and only one line changes. Dropping the two into the
tree is the whole wiring step: `src/data/slides.js` finds the manifest and the
Resources panel grows a "Project Presentation Slides" tab. No entry in
`src/data/projects.js` is involved, and a project with no `slides.json` simply
has no such tab.

The tab is view-only by design — the slides are shown, never offered as a
download — so there is no PDF or PPTX in `public/` to go with them.

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
