# Project assets

Diagrams, screenshots, and demo videos, one folder per project slug:

```
public/projects/<slug>/architecture.svg
public/projects/<slug>/screenshot-*.png
public/projects/<slug>/demo.mp4
```

Anything under `public/` is served from the site root, so the path in
`src/data/projects.js` is `/projects/<slug>/architecture.svg` — no `public`
segment.

## Architecture diagram

Export from draw.io as **SVG** where possible: it stays sharp at any zoom and
is usually smaller than the PNG. Then in the project's entry:

```js
architecture: {
  src: '/projects/hailcast/architecture.svg',
  alt: 'Describe what the diagram shows, not that it is a diagram',
  caption: 'Optional line under the image',
  sourceUrl: 'https://…/architecture.drawio', // optional, links the editable file
},
```

Leave `architecture: null` and the section — and its entry in the sticky nav —
does not render.

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
