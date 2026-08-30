# DESIGN.md — junhanshin.com / devops.junhanshin.com

Design reference for Junhan Shin's cloud/DevOps portfolio site. Use this document as the source of truth for any code, mockup, or design decision on this project — don't re-derive colors, fonts, or layout patterns from scratch. This file consolidates `portfolio_color_palette.md`, `portfolio_font_system.md`, and the layout/component decisions made during design brainstorming.

## Philosophy

- **Dashboard / system-monitor aesthetic** — the site should feel like a real infrastructure monitoring tool (status indicators, live-feeling metrics, clean data panels), not a personal blog or freelancer template.
- **Data-first, show don't tell** — real numbers (MTTR, resource counts, certifications) over descriptive prose. Screenshots, diagrams, and video over paragraphs explaining what something looks like.
- **Layered information depth** — every page should work at three levels: a 5-second visual skim (cards, status, big numbers), a 30-second scan (short descriptions, tags), and a full deep-dive (expandable or linked, for technical readers who want the whole story).
- **No personal photo.** Use the `>_` terminal mark or initials in a small rounded-square/circle slot instead of a headshot.

## Color system

### Base palette — Indigo Blue (default, used everywhere)

| Role | Hex | Usage |
|---|---|---|
| Background | `#F5F7FA` | Page background, cool blue-white |
| Primary text/headers | `#253449` | Deep navy-charcoal |
| Secondary text | `#8FA3BD` | Labels, captions, less important text |
| Card background | `#FFFFFF` | All card/panel backgrounds |
| Border | `#E2E7ED` | Card borders, dividers (1px, never shadows as the primary depth cue) |
| Base accent | `#3E5C89` | Default buttons, links, icons, status dots when no project theme applies |

### Accent colors — themed pages only

Accent color appears ONLY on: status dot, tag/badge background+text, and the primary button. Everything else on the page (background, body text, layout) stays in the base indigo palette above.

Sidebar order for the team projects is EchoChallengers, Lock-N-Lock,
ThisPod-ThatPod. The KT Cloud fellowship build is no longer among them — it has
a sidebar category of its own.

The third entry is the team's name, not the product's. ThisPod-ThatPod built an
app called hailcast, and both names are load-bearing: the sidebar, the eyebrow
and the Workspace heading are covered under **Page heading** below.

| Accent | Hex | Assigned to |
|---|---|---|
| Emerald | `#4FA88F` | EchoChallengers (self-healing infrastructure) |
| Coral-red | `#D9645A` | Lock-N-Lock (DevSecOps/security project) |
| Warm orange | `#E08A3C` | ThisPod-ThatPod / hailcast (predictive autoscaling/FinOps) |
| Steel gray | `#5C6670` | KT Cloud TECH UP fellowship project (in progress, unnamed) |
| Deep forest green | `#3D6B52` | Kubernetes Challenge; individual project one |
| Indigo (base accent) | `#3E5C89` | Cloud Resume Challenge; individual project two |

**Open gap:** there are eight project pages and six accents, so indigo and
forest are each doing double duty. Two projects sharing an accent is only a
problem if they end up adjacent in the sidebar, which today they are not — but
if the project list grows further, this palette needs two or three more entries
rather than more reuse. Decide that before adding project nine.

## Typography

Four faces, four jobs, at every width. No face swaps by breakpoint — an
earlier version swapped the heading face at 1100px, which gave the site two
identities depending on the device it was opened on.

| Role | Font | Weight | Used for |
|---|---|---|---|
| Headings | Public Sans | 800 | Page titles, section headings |
| Labels | Hanken Grotesk | 600–800 | The project list, the sticky menu, icon captions, figure captions, sidebar category labels, viewer controls |
| Body text | Newsreader | 400–700 | Paragraphs, write-ups, READMEs |
| Data and code | Chivo Mono | 400–700 | Metric numbers and their labels, eyebrows, period lines, terminal, source viewers, the `>_` mark |

All four are free, open-license fonts via Google Fonts — no attribution required.

```html
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@700;800&family=Chivo+Mono:wght@400;500;600;700&family=Hanken+Grotesk:wght@600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&display=swap" rel="stylesheet">
```

**A person's name is always set in the heading face.** The welcome line, the
sidebar wordmark, and every entry in Members all use Public Sans, so "Junhan
Shin" is never set in two different faces depending on where it appears. That
was the state before: the welcome line was the heading face while the wordmark
and the member row were the label face. The rule that follows is simple —
**names and headings use the heading face, functional labels use the label
face** — and it is why the sidebar's category labels ("TEAM PROJECTS") had to
be moved explicitly: they are `hN` elements and were inheriting the heading
face, but they label a list rather than head a section.

**Headings and labels are both neutral grotesques, so they separate by weight,
size and case rather than by face.** A condensed face held the label role for
one iteration and was rejected: condensed type reads cramped, and it made the
label roles look like a different product from the headings. The cost of the
current arrangement is that the two families are close cousins — so if a label
ever needs to pull further from a heading, move it in **weight**, not in family.

Label weights: **600 for every name** — team members, icon captions, link
captions, figure captions — because 800 at 14px read as shouting. 800 is
reserved for the wordmark, the sticky menu, and screenshot captions, which
have to be identifiable at a glance. The sidebar runs 600 inactive and 700
active; **the selected item must always be the heavier of the two**, since an
earlier pass had this inverted and made the active project the lightest thing
in the list.

Figure captions sit in the label face, not the body face — they name a thing
rather than say a sentence. Screenshot captions are heavier than diagram
captions (800 vs 600) because they identify which half of a before/after pair
you are looking at, and have to read at a glance.

**Restraint is the house style, and it is enforced by weight before size.**
An earlier pass raised one role at a time — a bigger title, bigger icons,
bigger captions, a bigger rail — until the whole page was large and heavy and
nothing receded. The read was juvenile, and the cause was weight more than
size: 800 on the title, section headings, wordmark *and* menu, 700 on the
project list and the metrics, 600 on captions, labels and names. When every
role is bold, none of them is emphasis.

The correction was to widen the gap rather than shrink uniformly: the display
tier dropped to 700 and the supporting tier moved down a step and got lighter
(500 for names, captions, link labels and the project list). Ratios to hold:
**title ÷ section ≈ 2.0, section ÷ prose ≈ 1.5** on desktop, and ≈1.45 on a
phone. If a role needs to feel more important, take weight or size away from
what surrounds it before adding any to it.

Marks are sized against their own captions, not against the tile: a 44px icon
over a 12.5px label reads as a toy. Link marks are 28px and avatars 46px.

**Never state a font-size outside the scale tokens.** `--t-micro` (11px)
through `--t-brand` (24px), plus the display clamps. 11px is the floor for any
text with a job to do. The previous system carried 33 distinct sizes, eight of
them inside a 1.44px band — below the threshold at which anyone perceives a
difference, so they were noise rather than a scale.

`--display-scale` is a hierarchy control, not a face adjustment: 1.2 at narrow
widths, 1.05 above 1100px. Body copy is pinned at 17px at every width while the
heading clamps shrink, so without it a section heading lands only 1.23x the body
size on a phone. With it, the ratio holds at 1.48 on a phone and 1.68 on a
desktop.

**`--accent-wash` and `--accent-wash-strong` are not usable on a themed page.**
They are declared on `:root`, so the `var(--accent)` inside them resolves
against `:root`'s base indigo rather than the project accent bound further down
the tree — every project rendered an indigo wash regardless of its colour. Mix
at the use site instead: `color-mix(in srgb, var(--accent) 16%, var(--card-bg))`.
The tokens now name `--accent-base` explicitly so they say what they do.

Keep fonts in their lanes: Newsreader never sets a heading, Public Sans never
sets a paragraph, Hanken Grotesk never sets a heading or a sentence, and Chivo
Mono is for things that are measured — numbers, labels, timestamps, paths, code
— never for prose that happens to be technical.

## Layout structure

- **Domain split:** `junhanshin.com` (root, redirects to devops subdomain) → `devops.junhanshin.com` (primary cloud/DevOps portfolio, main job-search target) → a second subdomain, not yet designed, for wellness/program-management background.
- **Page model on devops.junhanshin.com:** hybrid — a single dashboard-style landing view holds most content (status line, metric cards, project panels); project cards expand in place or link to a dedicated deep-dive page for full write-ups rather than forcing navigation away from the dashboard.
- **Sections:**
  1. Landing dashboard (default view) — status line, metric stat cards, project panel grid
  2. Cloud Resume Challenge write-up (own page, diagram-heavy)
  3. Kubernetes Resume Challenge write-up (separate page from #2 — demonstrates solo end-to-end skill distinct from the team projects)
  4. Interactive terminal "show and tell" page (secondary/opt-in, not the default entry point) — resume-as-CLI, Terraform validator/linter, interactive VPC diagram, system status dashboard
  5. AWS study notes — published via real Notion, embedded/linked rather than rebuilt from scratch

## Component patterns

- **Cards:** white background, 1px `#E2E7ED` border, border-radius 10–14px, no heavy drop shadows — depth comes from the border and white-on-off-white contrast, not shadow.
- **Status dot:** small filled circle (7–10px), accent or base-accent color, paired with a short label (e.g. "all systems operational").
- **Tags/badges:** small pill or rounded-rect, light tint of the accent color as background, accent color as text, ~10–11px font size.
- **Buttons:** solid accent color fill, white text, border-radius ~7–8px. Accent color reserved for buttons and the two other spots listed under "themed pages" above — never used broadly across a page.
- **Metric callouts:** large number in Chivo Mono 700, tight tracking, with a small uppercase mono label beneath it in the secondary text color. The number and its label share the data face; nothing else in the tile does.
- **Avatar mark:** rounded-square, base accent color background, `>_` symbol or initials in Chivo Mono, white text.

## Project workspace (devops.junhanshin.com)

Implemented in `apps/devops/`. A page type not previously covered here, so the
decisions behind it are recorded below rather than left in the code.

- **Shell:** left sidebar (304px at full width, 248px through the tablet
  range) plus one content column. The sidebar
  holds the name — **centred**, which is the one thing in the rail that is not
  part of a left-aligned list; it is the way back to the default state, and is
  set clearly larger than anything under it — over three numbered project lists:
  "Team Projects", "KT Cloud TECH UP Enterprise Fellowship Project" (a
  category of its own, holding the one fellowship build), and "Individual
  Projects". The lists, their order, and their numbering all come from data,
  so the categories and counts are free to change.
- **Default state:** nothing selected shows a large centred "Welcome to
  Junhan's Workspace." — one indigo gradient painted across the whole phrase
  and clipped to the glyphs, with the name interrupting it in the Hero's flat
  `INDIGO_POP` rather than splitting it into two sweeps — over one quiet line,
  "Select a project from the left to explore it in full detail." Still
  deliberately sparse: the sidebar is the entry point, and the second line only
  says so.
- **Routing:** on the URL hash (`#/projects/<slug>`), so a deep link survives a
  hard refresh on a static host without rewrite rules.
- **Project pages:** one shared template for all of them, parameterized by the
  project's accent and filled from a data file. Every project gets the same
  template — there is no short form. Sections whose absence is meaningful do
  not render at all: a solo project has no Members section and no Notion link,
  rather than empty slots where they would be.
- **My Role is a bento of duties, and counting is a separate job from claiming.**
  Each tile carries one duty as a full sentence, sized by how much of the project
  that duty was. A project with a single figure keeps it on the lead tile, where
  it is part of that tile's claim. A project with more than one writes `figures`
  on the role instead, and they render as a **band across the top of the
  section**: one card, one row, one cell per figure, hairline-divided.

  The band exists because the alternative failed. Two figures inside a lead tile
  that spans three rows left it 52% empty, and every fix that kept them there
  was a way of decorating the hole rather than closing it. Four rules hold the
  band together, each one a bug that was hit first:

  1. **One column per figure, never `auto-fit`.** Auto-fit wrapped three figures
     onto two columns at laptop width and left a fourth cell that existed and
     held nothing. A row of figures is a row or a stack, never a row with a hole
     at the end of it. Below 640px it becomes a stack.
  2. **Hairlines are a 1px gap over the border colour**, not a border per cell.
     A left border draws a rule at the start of a wrapped row where nothing sits
     beside it; a gap draws lines only between cells that are actually adjacent,
     in both directions.
  3. **Each figure is sized against its own cell**, with the cell as a container
     and `cqw` as the second term of a `min()`. A viewport clamp alone overflows
     at laptop width, where the cells are narrow but the viewport is not. The
     widest figure on the site sets about 1.65 times its font size, which is
     where the divisor comes from.
  4. **Figure labels stay short enough to hold one line.** They are labels, not
     sentences; if one wraps, shorten the label rather than forcing `nowrap`,
     which only moves the overflow somewhere it cannot be seen.
- **Accent placement on these pages** follows the themed-page rule above:
  metric numbers, the page eyebrow, the active menu underline, and the left
  edge of a decision card. Everything else stays base indigo. The tech-stack row is a deliberate
  exception with no accent at all — see below.
- **Corners are sharp here (2px), not the 10–14px used on the root page.** A
  considered divergence from the card pattern above, for a harder, more
  instrument-like read. Everything on these pages holds that one value so the
  page stays internally consistent; circular team avatars are the sole
  exception. If the root page is ever brought in line, change both.
- **Tech stack is a radial wheel above 860px**, one shared component across
  every project — categories, icon counts, and optional per-category colours
  all come from that project's data, so the number of segments follows the
  project rather than being fixed. Logos on a ring, the centre
  divided into one pie slice per category, slice and icons sharing a colour so
  the grouping reads without a legend, and each category's icons sitting
  directly outside its own wedge. Wedges are sized by how many icons the
  category holds, not split evenly — an even split gave a one-icon category the
  same wedge as a four-icon one and left a visible empty arc. Narrow wedges are
  why the labels run along the radius rather than across it. One category is
  live at a time — cycling on a timer like a roulette, previewed on hover,
  pinned on click, and released back to cycling after a few seconds of no
  interaction so it never stays frozen. Hovering a single icon names that tool
  in its own tooltip, which is a different question from which category is
  selected. The auto-cycle
  respects `prefers-reduced-motion` via the same `useReducedMotion` the Hero
  uses; hover and click still work under it. Below 860px the wheel is not
  rendered at all and the grouped card list takes over: a ring of twenty icons
  is not something you shrink to phone width.

  **Each category label is sized to its own wedge, not to one value for all of
  them.** It was a flat `--t-micro` in a flat `8rem` box, and both halves were
  wrong: the box was narrower than the longest label, so "Cloud/Infrastructure"
  — 146px of text in a 128px box — simply painted outside it, and a size in
  *pixels* against a wheel measured in *percentages* means a label's share of
  the radius grows as the wheel shrinks. The same word that fitted at 620px ran
  from the hub past the pie's edge on a narrower screen.

  Both are fixed by solving for the size instead of setting it. The stage is a
  query container, so `1cqi` is exactly one unit of the 0–100 space the geometry
  is drawn in — the two coordinate systems become the same one. A label centred
  on `LABEL_R` is bounded at both ends, by the pie's edge going out and the hub
  coming in, which gives it 22 units. The face is monospace, so the character
  count *is* the width in ems and no measurement is needed. `min()` caps the
  result at the type scale's own value, so a short label never grows and only a
  label that cannot fit is shrunk, only as far as it must. Every label now holds
  the same 7.2–28.8 unit allotment at any wheel size; only
  "Cloud/Infrastructure" is shrunk at all, to 11px.

  **A size in absolute units inside a proportionally-scaled drawing is a bug
  waiting for a smaller screen.** If the container scales, the type in it has
  to scale too, or it silently claims more of the drawing as the drawing gets
  smaller.
- **The wheel drifts, slowly, until it is touched.** A continuous
  counter-rotation — the icon ring one way, the pie and its labels the other,
  four minutes for a full turn. It is ambient, not informational: the wheel is
  a static picture of a stack, and this is what keeps it reading as an
  instrument rather than as a diagram of one. Four minutes is chosen to sit
  under the threshold at which motion in peripheral vision competes with
  reading; anything faster is worse than no motion at all.

  **The pie and its labels turn as one piece**, so a label never slides off the
  wedge it names — only the ring outside does. Each icon carries a
  counter-rotation of its own so the logo *and its tooltip* stay upright as the
  node orbits; both have to be inside it, since an upside-down tooltip is worse
  than an upside-down logo and rotating the mark alone fixes only one of them.

  **The drift is also, unavoidably, wrong**: it carries the icons off the
  wedges they belong to, which is the one thing the wheel's layout is for. So
  the first click anywhere on it snaps everything square and stops the drift
  for the life of the page — the moment a reader engages, alignment is worth
  more than atmosphere. Deliberately one-way, unlike the highlight cycle, which
  comes back after a few quiet seconds: a drift that returned would undo the
  alignment the reader clicked for. The highlight cycle, the hover tooltips and
  the click-to-pin all keep working exactly as before, on top of a wheel that
  is now still.

  **A full-stage rotating layer must not eat the clicks underneath it.** The
  ring has to cover the whole stage for its rotation to be about the centre,
  which turned it into a transparent sheet over the pie — and the entire inner
  circle stopped responding: no slice, no category label, no way to snap the
  wheel back from anywhere but an icon. It had been a plain static `ul` before
  the drift was added, so the pie had never needed protecting. Both sheets, the
  ring and the dial, now pass pointer events straight through; the slices, the
  labels and the icons take them back individually. **Adding motion to a layer
  is also a change to what is clickable through it** — check the hit targets
  underneath, not just the animation.

  **Nothing rotates, and that is the settled answer rather than a stopgap.**
  The wheel's one ambient behaviour is the highlight cycle: one category lit at
  a time on a timer, previewed on hover, pinned on click, released after a few
  seconds of quiet.

  A continuous drift was built and rebuilt across several rounds and always
  broke in the same place, so the reasoning is recorded here to stop anyone
  re-adding it. A drifting *ring* is fine — icons are round, and a round thing
  on a turning disc looks the same at every angle. A drifting *dial* is not,
  because the dial carries the category labels and those labels are **radial**,
  each set along its own wedge's spoke. On a turning disc they point seven
  different ways and all change together, which is what reads as text spinning.

  The textbook repair is to counter-rotate each label against the live rotation
  so it stays level — one value, read every frame by both the spin and the
  correction. **That architecture is right and its output is still wrong here,
  for reasons about this wheel's data rather than about the technique.** Level
  text has to fit across its wedge, and it has to clear its neighbours as it
  orbits. Measured on this stack: the one-item Recovery wedge is 16 degrees, 26px
  of arc for a word needing 58px; and at the label radius **three of the seven
  neighbour pairs overlap** once the labels are level, with two more inside a few
  pixels. Neither is recoverable by font size, by wrapping a single word, or by
  computing the correction more often.

  Radial labels exist precisely because a narrow wedge has depth but no width —
  and radial labels require a dial that does not turn. With the dial fixed there
  is no relative motion left for the ring to have either, so the drift went
  altogether.

  **When a fix keeps breaking somewhere new, question whether the thing being
  fixed should exist.** Three of five rounds on this component went to
  rotation-state bugs. None of them were bugs in the highlight cycle, the
  tooltips, the pinning, or the label auto-fit, all of which have worked since
  the day they were written.- **Two inline marks in narrative prose.** Backticks render as inline code on
  a bordered code surface — identical to what a backtick gets inside the
  rendered README, so the treatment is the same wherever it appears.
  `**text**` renders bold in the *project accent* rather than default black
  bold, so a number, a technology, or an outcome lifts out of the sentence
  without a second black weight competing with the headings. Deliberately just
  those two: this is prose with emphasis, not a second markdown surface.
- **Members carry an optional title** under the name — a team lead, say — in
  small monospace accent type. Blank for everyone else.
- **Screenshots sit two across**, so a before/after pair lands on one row and
  reads as a pair. Rows are separated by a rule rather than a gap, and the
  captions are heavier and larger than a diagram's — they say which half of
  the pair you are looking at, so they have to read at a glance.
- **Sections fade in on scroll**, using the same `Reveal` component as the
  landing page — including its reduced-motion path, which renders the content
  plainly with no animation at all.
- **The whole type ladder sits one notch higher than it did, and the desktop
  heading scale no longer shrinks.** Every step of `--t-*` moved by the same
  proportion — the floor from 11px to 12px, the reading size from 16.5px to
  18px — so the hierarchy is unchanged and only the ground under it moved.
  `--display-scale` above 1101px went from 0.92 to 1.04: the old figure was a
  deliberate shrink on the assumption the clamps were already generous there,
  and they were not. It put section headings at 25px under a 50px page title
  with 15px labels around them, and the page read as a reduction of itself on
  exactly the screens it is mostly opened on. Section headings are 31.6px now.
  Marks moved with the type rather than being left behind — tech logos 48→53px,
  the Members avatar 46→51px, the role monogram 56→62px.

  **The page title is the one step that came back down: its cap is 3.0rem,
  rendering 49.9px above 1101px, not the 3.4rem/56.6px the rise had put it at.**
  The header is already exactly as wide as the sections below it, so a title
  that would not fit had no width left to claim and the only room was in the
  type. At 56.6px the two longest project titles each took three lines; at
  49.9px they take two, and the four shorter titles are unchanged at one or two.
  The cost is a slightly quieter heading at laptop width, where the cap binds
  without saving a line. **When a heading does not fit, check its container
  first, then its type; do not widen a header past the content it heads.**

  **One place did not take the rise: the calendar's weekday row.** Every other
  label is free to grow; that one multiplies by seven and then has to fit
  beside a phase list that must stay the wider column. "Wednesday" at 12px
  needs 64px of column, which pushed the calendar past the list it exists to
  support. Held at 11px it needs 59px and the proportion survives. **A hard
  geometric constraint outranks a global step** — and when a bump is applied
  everywhere, the thing to go looking for is whatever was already sized by
  something other than taste.
- **The sticky menu is centred against the toggle, not against its own box.**
  The theme toggle is fixed in the top-right corner and is the only object on
  that side of the strip, which shortens the run the eye reads as the bar. With
  symmetric padding the entries were centred on the content column and
  measurably so — and still looked wrong, because that left 279px of air to the
  left of the first entry against 229px between the last one and the toggle.
  The bar reserves the toggle's own footprint (`--toggle-zone`) on its right,
  which evens the two gaps at 234px. **Symmetry against the box is not the same
  as symmetry against what is in it.**

  The padding underneath is the plain gutter. It used to carry a 3.75rem floor
  on both sides, whose only job was keeping the entries clear of the toggle;
  once the toggle had its own reserved zone the floor was dead width, and with
  the larger entries it was enough to push the bar into a scroll at tablet
  widths. Below 861px the toggle rides in the strip above the bar rather than
  on it, so there is nothing to reserve and the compensation is dropped.
- **The welcome line is three flat colours and no gradient.** "Welcome to" and
  the apostrophe-s after the name set in body ink; "Junhan" takes the flat
  indigo the landing page's Hero settles it into; "Workspace" takes the
  palette's steel. The name is the only saturated colour in the line, and that
  is what makes it the thing the screen is about — everything else is ink or
  grey, so it wins on chroma rather than on weight.

  **The gradient had to go, and softening it was not enough.** It was a wash
  clipped to the paragraph's glyphs, carrying "Welcome to" and the possessive
  either side of the name. The problem was structural, not a matter of degree:
  a ramp painted across a paragraph gives every fragment a *different* colour
  depending on where it happens to sit, and the two characters after the name
  sat far enough along the ramp to match neither the words before them nor the
  word after. They read as a typo. Flat ink cannot have that failure mode — the
  possessive simply belongs to the phrase it is part of. **A gradient across
  running text colours by position, not by meaning**; where the fragments carry
  different meanings, that is a coincidence waiting to look like a mistake.

  **"Workspace" is dusty denim** — `--c-denim`, #4A6B8A light and #8CA9C4 dark,
  a colour with exactly one job on the site and no other user. A neutral grey
  held the slot first, on the reasoning that only a neutral could never compete
  with the name beside it; denim is a blue, but a muted one, far enough from
  `--name-pop`'s vivid blue that the name still wins the line. The base accent
  was ruled out for the opposite reason: it lifts to #3B82F6 in dark, within a
  few points of `--name-pop`, and Junhan's colour stays his alone. Measured
  against the page: ink 11.7:1, name 3.9:1, denim 5.1:1 in light; 15:1, 4.4:1
  and 7.5:1 in dark — all clear of the 3:1 the 50px display size needs.
- **Page heading:** the long descriptive project title is the H1, with the
  short name — the team's, for team projects — above it as a small
  accent-coloured eyebrow. The eyebrow is what ties the page back to the
  sidebar entry the reader clicked; the sidebar itself keeps the short names.
  Long titles are meant to wrap to two lines.

  **A project may override the eyebrow**, and exactly one does. `title` is the
  team's name and drives the sidebar and the "<Team> Workspace" heading;
  `eyebrow` is optional and set only where the team built something with a name
  of its own, so ThisPod-ThatPod's page reads `hailcast` above its title. A
  project with one name leaves the field off and the eyebrow falls back to
  `title`. Two names is the exception, not the pattern: do not add the field to
  give a project a second label it does not have.
- **Dark mode** is the root app's system, reused rather than rebuilt: the same
  `ThemeToggle` component, the same pre-paint script in `index.html`, the same
  `theme` key in localStorage, and tokens redefined under `[data-theme]`. The
  toggle is parked top-right at every width.
- **The project rail folds away, and it is opt-in.** The pages are dense enough
  that 284px is worth reclaiming, so a toggle at the rail's top-right corner
  collapses it and the content column takes the full width. The preference is
  remembered, but **expanded is always the first-visit state** — a rail that is
  collapsed before anyone asked hides the site's own table of contents from the
  one reader who has not learned it yet.

  **Two width tokens, not one.** `--rail-w` is how wide the rail is drawn;
  `--sidebar-w` is how much room the content column gives up to it. They are the
  same number until the rail folds, at which point the second goes to zero while
  the first stays put — so the rail *slides out* rather than narrowing to
  nothing, which would have reflowed its own list on the way and read as the
  links collapsing rather than the panel leaving. One value moves the rail and
  the content margin together and they can never disagree about where the rail
  ends.

  The control rides at the rail's right edge when open and at the page's own
  left edge when closed, carried across by that same property, so it reads as
  one control that stayed put while the panel slid out from behind it. The arrow
  flips rather than being swapped for a mirrored twin. A folded rail is
  `visibility: hidden`, which takes it out of the tab order and the
  accessibility tree at once — a rail nobody can see must not still be a set of
  links a keyboard can reach. Below the drawer breakpoint the control is hidden
  entirely: the rail is already a drawer with its own button, and there is no
  width to reclaim.
- **Responsive:** the sidebar is a real column above 1100px, narrows to 248px
  through the tablet range, and becomes a drawer behind a hamburger at 860px
  and below. A fixed full-height rail is not a layout a phone can carry, so it
  is a different pattern rather than a smaller one.
- **Every menu group is contiguous in page order, and must stay that way.**
  Technical Decisions used to sit *after* the screenshots while belonging to
  the Tech & Architecture group, so scrolling forward lit Demo and then jumped
  *back* to Tech & Architecture. It now sits above the screenshots, which fixes
  the scroll-spy and reads better anyway — the trade-offs belong with the
  architecture, not after the demo. A non-contiguous group makes the only
  wayfinding device on a long page misreport position.
- **Sticky menu:** collapses the sections into five category entries —
  Workspace, Overview, Tech & Architecture, Demo, Resources, Reflection —
  rather than listing every heading, centred in the content column.
  Tech & Architecture now covers six sections in page order: the stack, the
  architecture panel, the implementation timeline, the recovery config, the
  decisions and trade-offs, and the cost. Adding to a group means adding to the
  end of it or inserting where page order already puts the section — a group
  that is not contiguous makes the only wayfinding device on a long page
  misreport position. Workspace
  is first and lands on the page header itself, since Overview deliberately
  skips past the title and repo links to My Role and there was otherwise no way
  back up. Tech & Architecture
  covers the stack, the architecture panel, the recovery config and the
  technical decisions. Grouping is by meaning, and every group is also
  contiguous in page order — which it was not until Technical Decisions moved
  above the screenshots. The page itself is otherwise unchanged: sections still
  render in the order SECTIONS declares, they simply share a menu entry.
  It sits *above* the project title, spanning the full content
  column rather than the narrower reading measure, and stays pinned for the
  whole page. Entries are small caps with an accent underline on the active
  one — a navigation menu, not a row of chips. It is rendered from the same
  section list the page is, so it can never offer a heading that isn't there.
  Long headings get a short menu form ("Key Impact Metrics" → "Impact") so ten
  entries fit across the column.
- **Narrow widths (≤860px):** the sidebar becomes a drawer behind a fixed
  button in a 56px top strip; the anchor nav parks below that strip.

## Terminal popup (root page — junhanshin.com only)

A resume-as-CLI terminal, accessed via a floating trigger rather than being embedded directly in page flow. Separate in purpose from any technical tools on devops.junhanshin.com — this one is personal/bio-focused (`whoami`, `experience`, `skills`, `certs`, `contact`, `help`).

- **Trigger:** floating action button, fixed position, bottom-right corner, follows scroll on both desktop and mobile — always accessible, never hidden until the end of the page
- **Icon:** the `>_` mark (same symbol used for the avatar/brand mark elsewhere), static — no pulse, glow, or bounce animation, per the "avoid decorative animation" rule below
- **Desktop behavior:** clicking opens an overlay panel on top of the page; page content stays visible but inactive behind it; closes via an X or clicking the trigger again
- **Mobile behavior:** clicking opens a full-screen takeover (not a small floating panel) — same floating-button-throughout-scroll behavior as desktop, just full-screen once opened, given limited mobile screen space
- **Styling:** dark terminal-style background inside the popup is acceptable here even though the rest of the site is light-mode — this is the one intentional exception, since it reinforces the "real terminal" feel; use Chivo Mono for all terminal text

## Spacing

- Card padding: ~0.8–1.1rem
- Grid gaps between cards: ~10–12px
- Consistent border-radius across all cards/panels/buttons within the same family (don't mix sharp and rounded corners on the same page)

## What to avoid

- Nested cards inside cards
- Generic drop shadows as the primary depth cue
- Large personal hero photo
- Pulsing/glowing status dots (a plain filled circle reads as "real system," not a decorative animation)
- Generic, non-specific CTA text ("Click Here," "Learn More" without saying what's being learned)
- Icon-tile-stack layouts (a grid of generic icons with no real content behind them)

## Notes for future sessions

Read this file before generating any new page, component, or mockup for this project. If a new page or component type isn't covered here, flag the gap explicitly rather than guessing — extend this file once a decision is made, rather than deciding silently and leaving this document out of date.
