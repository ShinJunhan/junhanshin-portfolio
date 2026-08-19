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
| `#/` | The welcome state — a greeting and a line pointing at the sidebar |
| `#/projects/<slug>` | That project's page |

The sticky menu's first entry, **Workspace**, scrolls to `#project-top` on the
page header rather than to a section — the title, period, and repo links sit
above the first section, so no section id means "the top of the page". A nav
group can set `anchor` for exactly this case; it bypasses the presence check
that `target` goes through.

Every project page is the same component, `components/ProjectPage.jsx`. It
knows nothing about any individual project; it reads three things:

- **`src/data/projects.js`** — all project content, plus the accent each one
  uses and which sidebar group it belongs to.
- **`src/data/sections.jsx`** — THE ordered list of sections, each with a
  presence rule and a component. The page renders exactly this, in order.
- **`src/data/navGroups.js`** — how those sections are grouped into the five
  entries the sticky menu shows. This is a layer *over* the section list, not
  a second copy of it: it names section ids, so a group narrows to what the
  project actually rendered and drops out when none of its sections exist.
- **`src/content/<slug>/`** — the README markdown, discovered by glob. The
  folder name is the project's `slug`; `README.md` is English and `README.ko.md`
  is the optional Korean variant the EN/KO toggle switches to. These must live
  under `src/`, not `public/` — Vite does not resolve imports into `public/`.

## Adding a project

1. Add an entry to `PROJECTS` in `src/data/projects.js` with a unique `slug`,
   a `group` (one of the `GROUPS` ids), and an `accent` from `ACCENTS`.
2. Optionally add `src/content/<slug>/README.md` (and `README.ko.md`).
3. Optionally drop assets in `public/projects/<slug>/` — see the README there.

`title` is the short name — the team's, for team projects — and is what the
sidebar shows and the page repeats as a small eyebrow above the heading.
`fullTitle` is the long descriptive H1 on the project page; it falls back to
`title` when unset, and is expected to wrap across two lines.

A few keys accept more than one shape:

| Key | Shape |
|---|---|
| `architecture` | one `{src, alt, caption, tab?}` figure, or an array of them — `tab` is the short label, falling back to the caption's first clause |
| `folderStructure` | a single string, rendered verbatim in a monospace tree, as the last tab of the architecture panel |
| `media.scenarios` | `[{id, tab, label, before, after}]` — one tab per scenario, `before`/`after` each `{src, alt}` |
| `stack` | `['AWS', …]` for one unlabelled group, or `[{category, items, tint?}]` for labelled groups |
| `team[].initials` | overrides the initials derived from the name |
| `team[].title` | optional subtitle under a member's name, e.g. `Team Lead` (`role` also accepted) |
| `decisions[].over` | optional — omit when a choice had no competing option |
| `terraform` | `[{path, content}]` — the main.tf file(s), shown inline |
| `recoveryPolicy` | `[{path, content}]` — the alert-to-recovery config |
| `metrics[].size` | `big` (2x2), `wide` (2x1), or `square` (1x1, the default) |
| `metrics[].detail` | optional qualifying phrase, mainly for `wide` tiles |
| `metrics[].hint` | expansion for an abbreviated label, shown in a tooltip on hover |

### Inline marks in narrative text

The narrative sections — My Role, Problem & Context, Technical Decisions,
Reflection — run their strings through `lib/richText.jsx`, which understands
exactly two marks:

| Written | Renders as |
|---|---|
| `` `make apply` `` | monospace on a code surface, the same styling the README renderer gives a backtick |
| `**41 AWS resources**` | bold in the project's accent colour, not default black bold |

Use them to lift the numbers, technologies, and outcomes out of the sentence
around them. Backticks are matched first, so asterisks inside a code span stay
literal. Anything else — headings, lists, links — is not markdown here; that is
what the README section is for.

The sidebar list and its numbering come from the data, so there is nothing to
renumber. Sections whose data is missing don't render — a project with only a
title produces a clean, short page.

## Adding a section to the project template

1. Write the component in `src/components/sections/`. It receives one prop,
   `project`.
2. Add an entry to `SECTIONS` in `src/data/sections.jsx` at the position it
   should occupy: an `id` (the anchor target), a `label` (the heading), a
   `has(project)` presence check, and the component as `Body`.

`label` is normally a string, but it can be a function of the project when a
section's heading should be built from the project itself — that is how the
workspace links section reads "EchoChallengers Workspace" on one page and
"hailcast Workspace" on another, from one rule. Read it through
`labelOf(section, project)`, never directly.

That's the whole change as far as the page goes. If the new section should
also be reachable from the sticky menu, add its id to the relevant group's
`sections` array in `src/data/navGroups.js` — the menu shows five fixed
category entries rather than one per section, so a new section joins an
existing group instead of adding a sixth. Leaving it out of every group is
fine too: the section still renders, it just isn't a jump target.

### Sections that show even when empty

A section normally disappears when `has(project)` is false. Add `always: true`
and it renders anyway, letting its component show a "not added yet" state via
`EmptySlot`. The Architecture Diagram, Folder Structure, Screenshots + Demo
Video, and README.md slots use this: they are the easiest to forget while
filling a project out, so the heading stays on the page and in the nav as a
standing reminder.

Leave `always` off where an absence is meaningful rather than pending — a solo
project has no Members section, and should not advertise one.

## Key impact metrics

A bento grid, not a row of equal cards: tile size carries meaning. Which stat
gets which size is a per-project decision — the most impressive number differs
project to project — so it comes from `metrics[].size` in the data and nothing
in the component knows which stat matters.

| `size` | Spans | For |
|---|---|---|
| `big` | 2 cols x 2 rows | The one headline stat. Spell the label out; the tile has room |
| `wide` | 2 cols x 1 row | A number that needs a qualifying phrase (`detail`) |
| `square` | 1 x 1 | The default — a short number that needs no extra room |

Give every abbreviated label a `hint`. The tile keeps the short form — there is
no room to spell "Mean Time to Detect" out in a square — and the full term
appears in a tooltip. That tooltip is a styled element, not a native `title`:
the browser's own needs about a second of stillness and is easy to miss, so the
only immediate feedback was the help cursor, which read as a tooltip showing a
"?" and nothing else. A label that is already spelled out in full, like the big
tile's, needs no `hint`.

The base grid is 5 columns. One `big` plus four `square` plus one `wide` tiles
it exactly — six tiles, ten cells, no gaps: the big tile and three squares fill
the first row, and the second takes the big tile's continuation plus the wide
tile and the last square. **Order matters**, since placement is auto-flow; the
data lists them big, square, square, square, wide, square. Three columns below
1100px, two below 860px, one below 480px, where the big tile keeps its weight
through type size and padding rather than area.

## Tech stack: the wheel

`components/sections/TechStackWheel.jsx` is shared by every project. It knows
nothing about any particular one: hand it a project's categories and it draws
that project's wheel — any number of categories, any number of icons in each.

```js
stack: [
  { category: 'Autoscaling', items: ['KEDA', 'Karpenter'] },
  { category: 'Monitoring',  items: ['Prometheus', 'Grafana'], tint: 'var(--c-coral)' },
]
```

`tint` is optional; without it a category takes the next hue from the wheel's
default palette, so a project only names colours when it wants something
specific. A flat `['AWS', …]` array still works and falls back to the card
list, since a wheel needs categories to divide the centre into.

Above 860px a project with labelled categories renders as a radial wheel —
icons on a ring, the centre divided into one pie slice per category, each slice
and its icons sharing a colour.

**Wedges are sized by item count, not split evenly.** A one-icon category on an
even split got the same wedge as a four-icon one and left an obvious empty arc.
Each category's icons then spread across its own wedge, so a group sits
directly outside the slice it belongs to.

That makes some wedges narrow — a single-icon category is about 16 degrees —
which is why the labels run *along* their wedge's radius rather than across it.
No horizontal label fits 16 degrees; a radial one has the whole radius. The
rotation is inline and per-slice, so the active state must not re-declare
`transform` in CSS or it would drop it.

One category is live at a time:

- it cycles on a timer, roulette-style, unless
- the pointer is on a slice or icon (previews it while the pointer is there), or
- a slice or icon has been clicked (pins it)

Those are three separate pieces of state, in that priority order. A single
"held" flag would make a click evaporate the moment the pointer left. A pin
releases itself after `RESUME_MS` of no interaction, so the wheel returns to
its ambient state instead of freezing on an abandoned click; every interaction
bumps a timestamp that restarts that timer.

`useReducedMotion` — the same hook `Reveal` uses — drops the auto-cycle
entirely; hover, click, and the tooltips still work.

Hovering an individual icon shows its own tooltip naming that tool. That is a
separate question from which category is selected, which is why it is its own
element and not folded into the category highlight.

Below 860px the wheel is **not rendered at all** — `useMediaQuery` swaps in the
grouped card list instead. A ring of twenty icons cannot be shrunk to phone
width, so it is a different layout rather than a smaller one. Rendering both
and hiding one with CSS would leave the hidden wheel's timer running.

## Junhan's colour

`--name-pop` is reserved for him site-wide: the welcome line, his avatar on
every project, and the sidebar wordmark. `data/owner.js` names him once so the
rule has a single source of truth.

`AVATAR_TINTS` in `components/Avatars.jsx` deliberately contains **no blue**.
It used to lead with `--c-indigo`, which put a near-identical blue on whoever
was listed first — usually the team lead. Tints are also assigned *before*
render with the owner skipped in the rotation, so his position in a team never
shifts anyone else's colour.

## The code viewer

`components/CodeViewer.jsx` is shared by the Terraform Code and Recovery Policy
sections, and by anything else that needs to show source inline. It takes a
list, never a single file:

```js
terraform: [{ path: 'terraform/main.tf', content: mainTf }],
```

The viewer is dressed as a browser window: a bordered, rounded frame holding a
tab strip, an address bar, then the file. Tabs carry the **file name only**
(`splitPath()` splits the path; the full path stays as the tab's `title`), and
the **address bar** below them carries the directory — quiet — plus the file
name in ink. The selected tab and the address bar share one fill, so the tab
reads as hanging off the bar, and the strip behind the tabs is deliberately
darker than both so the tab silhouette is visible at all.

**The band is deliberately not the code's colour.** An earlier version gave the
active tab the same dark background as the frame so the two merged seamlessly —
which made the tab look like the first line of the file rather than a control.
There are three distinct surfaces now: the band, the raised active tab on it,
and the dark code below. The active tab is marked twice over — a lighter fill
plus an accent bar along its top edge — and carries a full border, because in
dark mode its fill sits only a shade off the band and the outline is what keeps
it legible as a separate object. Every tab reserves the same border box, so
nothing shifts when the selection moves.

A single file still gets a tab, rendered as a `<span>` rather than a button
since there is nothing to switch to. Switching tabs swaps the content and
resets the scroll.
The frame behaves like the README's — capped at `clamp(460px, 72vh, 900px)` so
it grows with the screen, self-scrolling, faded at
the bottom, with a **Show full file** toggle — on the terminal surface rather
than the card one, since this is literal source.

Two things about the frame that are easy to undo by accident:

- The viewport's `overscroll-behavior` chains on the vertical axis. It was
  `contain`, which made the box swallow the wheel — reaching either end of the
  file stopped the gesture dead instead of handing it back to the page, so
  scrolling appeared to work only when the pointer was outside the code. Only
  the horizontal axis stays contained, to keep a sideways gesture from
  triggering the browser's back-navigation.
- The body carries a `padding-bottom` roughly the height of the fade, so at the
  end of the file the gradient sits over empty space instead of over the last
  line. The gradient itself stays transparent for most of its height and only
  reaches the ground at the very edge.

Highlighting is Prism with only the `hcl` and `yaml` grammars loaded, themed
from the site's own palette in `global.css` rather than importing one of
Prism's stylesheets, which would bring its own background and fight the
terminal ground. The grammar is chosen from the file extension; an unknown
extension renders as plain text instead of guessing.

File contents live under `src/content/<slug>/code/` and are pulled in with
`?raw` imports at the top of `projects.js`, so the entries stay readable rather
than carrying hundreds of lines of inline Terraform.

**Keep the scope tight.** Terraform Code shows `main.tf` only — `variables.tf`,
`outputs.tf` and the rest are covered by the GitHub link under the viewer.
Recovery Policy shows `recovery_map.yml` and `alert.rules.yml` only. Role task
files, `site.yml`, and `group_vars` are setup mechanics, not decisions worth
reading inline.

## Browser panels

`components/BrowserPanel.jsx` is the tab strip + address bar + body shell.
Four sections use it — Architecture & Structure, Recovery Policy, Screenshots,
Code & README — and `CodeViewer` renders through it too, so there is one
chrome implementation rather than several that drift.

```js
<BrowserPanel label="Files" tabs={[{ id, label, address, aside?, render() }]} />
```

`label` is the tab and should be short; `address` is the long form and is
split at the last slash so a path reads quiet-directory + ink-filename, while
a phrase with no slash renders whole. `aside` rides at the right end of the
address bar — the README's language toggle is the one user of it. `footer` is
a control belonging to that tab and is rendered **below** the window: inside
it, the browser's rounded corner clipped it.

The shell wraps every body in `.code__pane`, so a diagram, a code frame, a
tree and a screenshot pair all sit the same distance from the chrome. Bodies
should not add their own outer padding, and each should keep its own border —
that pairing is what makes four different kinds of content read as one
component.

## Section order and the sticky menu

**Every nav group must stay contiguous in page order.** `decisions` used to
sit after `media` while belonging to the `tech` group, which made the
scroll-spy light Demo and then jump back to Tech & Architecture. If you move a
section, check `navGroups.js` still maps to a monotonic sequence.

Three sections were merged and their ids are gone: `folders` folded into
`architecture`, and `terraform` + `readme` became `source`. Any bookmark or
deep link to those anchors no longer resolves.

## Technical Decisions: the crescent

`components/sections/DecisionsSection.jsx` renders the decisions as a crescent
of numbered circles down the left edge plus one card on the right. Slots
alternate numbered and blank (`NUMBERED_EVERY`), with `CENTRE_SLOT_PAD` blanks
beyond each end so the arc stays full whichever number is selected. Every slot
is positioned *relative to the selected one*, which is what carries the whole
crescent when a number is picked.

`reach` spans the entire numbered run. Shorten it and the far numbers fade to
`opacity: 0` and become unreachable — that was a real bug, not a tuning knob.

`SPAN_Y` is a **bounded percentage** of the panel, not a pixel step. A fixed
step let the far end of the run travel past the container and cover the next
section's text. Everything now lands within `±SPAN_Y` of the centre whatever
is selected.

Numbers and blanks are spaced by **different rules**, which is what lets the
tail be long without the numbers bunching:

- `NUM_STEP` is a constant step between numbers, and depends only on
  `decisions.length`. Adding blanks cannot squeeze it. It must stay clear of a
  selected circle's radius plus its neighbour's — `.arc`'s `min-height` is
  what guarantees that, since the step is a percentage of it.
- `TAIL_STEP` × `TAIL_DECAY^k` carries the blanks past the numbers on a
  decaying step, and `BLANK_DECAY^k` shrinks them as they go. The series
  converges, so the tail can never reach the container's edge however many
  blanks `CENTRE_SLOT_PAD` adds. `TAIL_STEP` is deliberately *larger* than the
  steps after it: the first gap has to clear a full-size number against a
  blank, which is a bigger jump than the gaps further out.

The horizontal sweep is a half-ellipse (`sqrt(1 - t²)`), not a parabola, so
the run reads as one oval edge.

A single step for both cannot work: wide enough for the numbers and the tail
escapes the section and covers the next section's text; tight enough for the
tail and the numbers collide. Both shipped once.

The selected circle's size comes from `--pip-scale`, set inline and applied by
CSS. Do not fold it back into a `transform` string: the ≤860px rule has to
neutralise `top`/`left` for the flat row, and a blanket `transform: none`
there removes the size boost with them.

### Auto-cycle

Same shape as `TechStackWheel`: an ambient `cycle`, a `pinned` index set by a
click, and an idle timer that clears the pin (`RESUME_MS`) so the section goes
back to cycling. Hover over the whole block also pauses — the card is long-form
text, unlike the wheel's one-word categories. `useReducedMotion` stops the
cycle outright.

**This is not a modal, and must not become one.** No overlay, no backdrop, no
close button, no focus trap, and the arrow-key handler is bound to the
selector rather than to the document. The reader keeps the page.

### Why there is no framer here

An earlier build drove the circle positions with framer's `animate` and the
card swap with `AnimatePresence`. Both depend on `requestAnimationFrame`, and
in a frame that never composites the circles stranded at the previous
selection while card faces stacked up three deep, each frozen part-way through
its exit.

Now:

- **Circle positions are inline style, eased by a CSS transition.** The style
  is what is true; the transition only animates the change. A dropped frame
  still leaves the resting layout correct.
- **The arriving card animates with a keyframe that has no `backwards` fill**,
  so its resting state is its ordinary style.
- **The ghosts' fill must be `--bg-alt`, not white at low opacity.** A white
  card at 40% on a white page is invisible; the first version of the deck could
  not be seen at all.
- **On narrow widths the ghosts pivot on their centre**, not their bottom edge.
  Rotating about the bottom swings the top corners twice as far and gave the
  page a horizontal scroll at 375px.
- **`Face` has three variants and only `sizer` stays in flow.** The hidden
  sizer — one copy of every decision, stacked in a single grid cell — is what
  gives the window its height, so all four cards come out the size of the
  longest. It must be `visibility: hidden`, never `display: none`: a
  display-none child contributes no height, and height is the entire reason it
  exists. Render the sizer's faces with the live variant by mistake and they
  turn absolute, contribute nothing, and the card collapses to zero.
- **`.dcard__figure svg`'s `max-height` is the card's height dial**, not the
  band's `min-height`. The glyph renders at its cap and the band wraps it, so
  raising the cap makes every card taller whatever its text says.
- **`.dcard` must not stretch to the grid row** (`align-self: center`). The
  ghost layers behind the card are `inset: 0` on it, so a stretched box leaves
  them taller than the card they back and the deck hangs below it.
- **The frame is on `.dcard__face`, not on `.dcard`.** `.dcard` is a clipping
  viewport with no border of its own; the card's border, radius and ground
  travel with the content. Move the frame back up to the container and the
  animation degrades into text sliding inside a card that never moves.
- **The leaving card is removed on a `setTimeout`, not on `animationend`**, so
  it cannot outlive its animation. It is `aria-hidden` and `inert` while it
  exists.

Both animations disappear under `prefers-reduced-motion`.

### Concept marks

`decisionGlyphs.jsx` is a vocabulary of drawn SVGs — `route`, `process`,
`channels`, `branch`, and a neutral `note` fallback. A decision names one with
`glyph` in `projects.js`, so no component knows anything about a particular
project. Omit it and the card shows `note` rather than a diagram pretending to
illustrate a decision it knows nothing about.

## Links

Two sections, fed by one `LINK_KINDS` list in `components/sections/LinksSection.jsx`.
Each entry declares which `group` renders it:

| Group | Section | Holds |
|---|---|---|
| `workspace` | "<Team> Workspace", top of the page | GitHub, Notion |
| `resources` | "Resources", further down | README, Live Dashboard, Terraform Code, Presentation |

Adding a link is an entry in that list plus a matching key under the project's
`links`. Every kind is `always: true`, so a missing URL shows as a greyed,
inert tile rather than disappearing — the same standing-reminder pattern the
empty content slots use.

## The README section

READMEs run to tens of thousands of characters, so the section opens capped at
`clamp(460px, 72vh, 900px)` in a bordered frame that scrolls on its own — a
flat 460px gave a large monitor no more reading room than a laptop — with a
fade at the bottom
edge and a **Show full README** control beneath it that lifts the cap and lets
the rest run inline. The control is a toggle — it collapses again.

The EN/KO toggle is independent of that: switching language works in either
state and leaves the expanded state alone. Only the frame's scroll position
resets, since an offset into one document means nothing in another.

The frame's ground is `--card-bg` rather than the `--bg-alt` a code block uses:
inline code inside the README is itself `--bg-alt` and would disappear against
a matching background.

## Theming

Dark mode is the same system as `apps/root`, not a second implementation:
`components/ThemeToggle.jsx` is a copy of that file, the pre-paint script in
`index.html` is byte-identical to the root app's, and both share the `theme`
key in localStorage. Tokens are redefined under `[data-theme='dark']` in
`styles/global.css`; components only ever read the tokens, never raw colors,
so nothing needs a dark-mode branch of its own.

## Breakpoints

| Width | Layout |
|---|---|
| > 1100px | Full 272px sidebar |
| 861–1100px | Sidebar narrows to 224px, tighter type — a full rail costs too much of a tablet viewport |
| ≤ 860px | Sidebar becomes a drawer behind a hamburger in a fixed 56px top strip; the sticky menu parks below it |
| ≤ 860px | …and the Tech Stack's category cards drop from two columns to one |
| ≤ 420px | Tech stack marks and reflection collapse to a single column |

Every `minmax()` grid floor is wrapped in `min(<floor>, 100%)`. Without that,
a track floor wider than its container forces the track to that width and
pushes the whole page sideways on a phone.

## Conventions

- No per-project values in components. Content lives in `src/data/`, colours
  and spacing in custom properties in `src/styles/global.css`.
- Headings are left-aligned and body copy is justified across the full column
  width — no `max-width` measure caps on prose. The sticky menu is the one
  centred element. `hyphens: auto` rides along with every `text-align: justify`
  — without it, justification opens visible gaps on any line carrying a long
  technical term — with **one deliberate exception**: Reflection sets
  `hyphens: none`, so it justifies through word spacing alone and never breaks
  a word mid-line, the way a word processor does. That override is scoped to
  `.reflection .prose p`; `.prose p` is shared with Problem & Context, and
  `.lede`, `.decision__why`, and the rendered README all keep hyphenating.
- One accent per project. It is bound once, to `--accent` on the project
  article, and per DESIGN.md appears only on the accent-marked spots — metric
  numbers, the page eyebrow, the active menu underline, the decision edge.
  The tech-stack row is deliberately accent-free: the vendor logos bring their
  own brand colours.
- Corners are sharp. Everything reads `--radius` / `--radius-sm` (both 2px)
  rather than hard-coding a value, so the whole app moves together. Two
  intentional exceptions: team avatars are circles, and raised cards use
  `--radius-card` (5px, matching the landing page's About Me cards) so they
  read as objects rather than cut panels.
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
