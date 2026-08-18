# apps/devops

`devops.junhanshin.com` — the project workspace. A separate Vite + React app
from `apps/root`, sharing its design tokens (see `../../DESIGN.md`) but none of
its code.

```bash
npm install
npm run dev      # http://localhost:5174
npm run build
```

## Shape of the app

A fixed left sidebar and one content column. Routing is on the URL hash, so
deep links survive a hard refresh on a static host with no rewrite rules:

| URL | Shows |
|---|---|
| `#/` | The welcome state — one centred line, nothing else |
| `#/projects/<slug>` | That project's page |

Every project page is the same component, `components/ProjectPage.jsx`. It
knows nothing about any individual project; it reads three things:

- **`src/data/projects.js`** — all project content, plus the accent each one
  uses and which sidebar group it belongs to.
- **`src/data/sections.jsx`** — THE ordered list of sections, each with a
  presence rule and a component. The page and the sticky anchor nav are both
  rendered from this one list, so a section added here appears in the nav
  automatically and the two can never drift apart.
- **`src/content/<slug>/`** — the README markdown, discovered by glob.

## Adding a project

1. Add an entry to `PROJECTS` in `src/data/projects.js` with a unique `slug`,
   a `group` (one of the `GROUPS` ids), and an `accent` from `ACCENTS`.
2. Optionally add `src/content/<slug>/README.md` (and `README.ko.md`).
3. Optionally drop assets in `public/projects/<slug>/` — see the README there.

The sidebar list and its numbering come from the data, so there is nothing to
renumber. Sections whose data is missing don't render, and drop out of the
sticky nav with it — a project with only a title produces a clean, short page.

## Adding a section to the project template

1. Write the component in `src/components/sections/`. It receives one prop,
   `project`.
2. Add an entry to `SECTIONS` in `src/data/sections.jsx` at the position it
   should occupy: an `id` (the anchor target), a `label` (the heading, and the
   nav text unless you also give it a shorter `navLabel`), a `has(project)`
   presence check, and the component as `Body`.

That's the whole change — the page, the anchor nav, and the scroll-spy all
read from that list. Nothing else needs updating.

### Sections that show even when empty

A section normally disappears when `has(project)` is false. Add `always: true`
and it renders anyway, letting its component show a "not added yet" state via
`EmptySlot`. The Architecture Diagram, Screenshots + Demo Video, and README.md
slots use this: they are the easiest to forget while filling a project out, so
the heading stays on the page and in the nav as a standing reminder.

Leave `always` off where an absence is meaningful rather than pending — a solo
project has no Members section, and should not advertise one.

## Conventions

- No per-project values in components. Content lives in `src/data/`, colours
  and spacing in custom properties in `src/styles/global.css`.
- One accent per project. It is bound once, to `--accent` on the project
  article, and per DESIGN.md appears only on the accent-marked spots — metric
  numbers, the active menu underline, the section square, the decision edge.
  The tech-stack row is deliberately accent-free: the vendor logos bring their
  own brand colours.
- Corners are sharp. Everything reads `--radius` / `--radius-sm` (both 2px)
  rather than hard-coding a value, so the whole app moves together. Team
  avatars are the one intentional circle.
- Sections fade in on scroll via `components/Reveal.jsx`, copied from the
  landing page so both sites move the same way. It keeps that component's
  reduced-motion behaviour — a plain `div` and no animation at all when the
  reader has asked for less motion. Project pages pass `amount="some"`,
  because a section here can be a whole rendered README and a *fraction* of
  something that tall never fits on screen to satisfy the default trigger.
- Tech-stack logos live in `src/assets/icons/`, **not** `public/` — they are
  discovered by `import.meta.glob`, and Vite does not resolve imports into
  `public/`. Screenshots and diagrams, referenced by literal path, do go in
  `public/`.
- Team-only elements (avatars, the Notion link) key off `project.team` being
  non-empty. Solo projects just omit the key.
