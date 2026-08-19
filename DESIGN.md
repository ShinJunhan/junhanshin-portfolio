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

Sidebar order for the team projects is EchoChallengers, Lock-N-Lock, hailcast.
The KT Cloud fellowship build is no longer among them — it has a sidebar
category of its own.

| Accent | Hex | Assigned to |
|---|---|---|
| Emerald | `#4FA88F` | EchoChallengers (self-healing infrastructure) |
| Coral-red | `#D9645A` | Lock-N-Lock (DevSecOps/security project) |
| Warm orange | `#E08A3C` | hailcast (predictive autoscaling/FinOps) |
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
  3. Kubernetes Resume Challenge write-up (separate page from #2 — demonstrates solo end-to-end skill distinct from team-based hailcast)
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
- **Junhan's colour is reserved.** `--name-pop` — the Hero's flat indigo — is
  his alone, site-wide: the welcome line, his avatar on every project, and the
  sidebar wordmark. No teammate tint, category tint, or project accent may use
  it, and the avatar palette holds no blue at all so no one else's circle can
  be mistaken for his.
- **Tech stack shows real vendor logos**, not tinted word-pills — the mark is
  what a reader recognises when scanning. Laid out as a plain grid with no
  chip, fill, or border behind each entry: the logo and its name, at a size
  worth looking at. The logos carry their own brand colors, which is why
  the project accent stays off this row: two color systems in one strip reads
  as noise. A label with no logo file yet falls back to a monogram tile.
- **The page header is centred; everything below it is left-aligned.** The
  eyebrow, the project title, and the period line centre as one block, and the
  title is the largest type on the page. This is a deliberate exception to the
  left edge everything else hangs off — the header and the sticky menu above
  it are the only centred elements, and they line up with each other. The
  title also takes `text-wrap: balance`, which is right for a centred block
  (even line lengths, no lone trailing word) and stays off the left-aligned
  section headings for the reason given below. Worth knowing: at phone width
  the longest project title now sets in five lines.
- **Section headings are large, unbulleted, and left-aligned** — a real
  heading a clear step under the project title, with the rule between sections
  doing the separating. The earlier small-label-with-a-square treatment read as
  a list, not a page. Centred headings were tried and rejected: everything on
  the page hangs off the same left edge instead. The sticky menu is the one
  centred element.
- **Body copy runs the column's full width, ragged-right.** There is no
  measure cap on prose, and the page title is uncapped too — it uses the width
  it has and only breaks when it genuinely runs out. No `text-wrap: balance`
  on headings either: left-aligned, each line should run to the edge before
  breaking, and balancing would leave the first line short of the width it has.

  The full-width look is the decision and it stands. A measure cap was tried
  and rejected: at ~68 characters the text block filled a little over half the
  1180px column and read as a narrow gutter inside a wide page, which is not
  what this layout is for. Prose runs about 132 characters at 1280px.

  **What did change is the justification.** Prose used to be justified with
  `hyphens: auto`, and Reflection justified without it. Justifying a line this
  long needs hyphenation to close the gaps it opens, and Chrome's hyphenation
  broke words at points English does not use — `inf-rastructure`, `recove-ry`,
  and `ass-igned` in the My Role paragraph, the first thing a recruiter reads.
  Without hyphenation the gaps arrive instead: a 2.9x word space in Reflection
  at 1100px and 5.06x on a phone. Ragged-right at the same width has neither
  problem, so `hyphens` is gone site-wide and Reflection no longer needs its
  own exception.

  Leading carries the width instead of a cap: `1.8` on prose rather than the
  ~1.65 a narrow measure would want, because a long line needs more room for
  the eye's return sweep to the start of the next one.
- **The README and the code frames open collapsed**, scrolling in their own
  bordered frame, faded at the bottom edge, with a toggle beneath that lifts
  the cap. **The cap is `clamp(460px, 72vh, 900px)`, not a fixed height**: at
  460px flat a large monitor got exactly as much reading room as a small
  laptop, which made these the most scrolled-in things on the page. The floor
  keeps it no smaller than it was, the ceiling keeps it a framed excerpt rather
  than something that swallows the page.
  A 30,000-character document should not push every other section off the page
  by default. The EN/KO toggle works collapsed or expanded.
- **A section heading can be named per project** where the generic label is
  weaker than a specific one — the links row reads "Link to EchoChallenger's
  Workspace" on that project and "Links" everywhere else.
- **Key impact metrics are a bento grid**, not a repeated card shape: tile
  size carries meaning, so the project's headline number takes the room its
  importance earns and the supporting stats sit around it. Four columns, with
  one big (2x2) tile, wide (2x1) tiles for numbers that need a qualifying
  phrase, and squares for the rest. One big plus two squares plus one wide
  tiles the grid exactly. Which stat is the big one is a per-project decision
  and lives in the data, never in the template. No comparisons, benchmarks, or
  citations in this section — the numbers stand on their own.
- **Links are bare marks with a name beneath**, no pill or border — the same
  treatment as the tech-stack grid, so the two read as one family. They split
  across two sections: the repo itself ("<Team> Workspace") at the top of the
  page, and everything a reader might open alongside the write-up (README,
  live dashboard, Terraform, the deck) under "Resources" further down.
- **The workspace links are the first section on a project page**, directly under the
  title and period line and grouped under Overview in the menu. Where the work
  actually lives — the repo, the dashboard — is what a reader wants first, not
  something to find at the bottom.
- **Reflection stacks its two parts** rather than setting them side by side.
  Two columns held each to half the width, which made the paragraphs gappy and
  let the second part — the harder one to write — go unread. It used to be the
  one place that justified *without* hyphenation; with justification gone
  site-wide that exception is gone too, and Reflection now sets exactly like
  every other prose block.
- **The owner's name is marked in the Members row.** Junhan's avatar already
  takes `--name-pop`; his *name* takes it too, at a heavier weight than the
  rest. On a team page where someone else is the lead, the person whose
  workspace this is should be identifiable without reading the roles. Same
  reservation rule as everywhere else — no teammate may use that colour.
- **Every member carries a short title** under their name, not only the lead.
  Two or three words: the column is about 90px wide, so anything longer wraps
  to three lines. Junhan's is the short form of the role stated in full under
  My Role.
- **Members spread across the full column**, one grid track each
  (`auto-fit, minmax(9.5rem, 1fr)`, 7.5rem below 860px) rather than a huddle
  of fixed-width cells on the left. The floor is set so a two-word name stays
  on one line — "Hwijeong Cho" was wrapping at 84px — and `1fr` spreads the
  leftover width evenly. The item fills its track at every width; a fixed
  width in the phone media query re-created the huddle once and was removed.
- **Members is its own section**, not a row of initials beside the date:
  circular initial avatars with each name beneath. The page header carries the
  title and the period only.
- **Everything that is "a set of things to look at" is a browser panel.**
  One shell — `components/BrowserPanel.jsx` — carries the tab strip, the
  address bar and the body, and four sections use it: Architecture &
  Structure, Recovery Policy, Screenshots, and Code & README. They stay
  identical by construction rather than by four components agreeing to look
  the same. The tab carries the short name and the address bar carries the
  long form, so neither has to compromise.

  **Every panel body is inset by the same pane** (`.code__pane`) and keeps its
  own border. The code frame used to run edge to edge with no outline while
  the screenshot panel beside it sat inset — same chrome, two different
  insides. One inset, applied by the shell, is what keeps them a family.

  **A control that belongs to the active tab goes below the window, not inside
  it.** The expand toggle was rendered inside the browser and the rounded
  corner clipped it. Tabs declare a `footer` and the shell places it under the
  chrome.
- **Architecture and Folder Structure are one section, a tab each.** They were
  two stacked sections, which meant scrolling past a full-width diagram to
  reach the next one and again to reach the tree. They answer the same
  question — how is this put together — so switching beats scrolling.
- **The README and Terraform are one section, a tab each — README first.**
  Same reasoning as the diagrams: both are "show me the actual source". The
  README leads because it is the way in; the Terraform is the follow-up read.
  The README's EN/KO toggle moved into its own tab's address bar; on a heading
  shared with Terraform it would sit there meaning nothing while the Terraform
  tab was showing.
- **Screenshots are a tab per scenario, and each pair stacks.** Before above
  after, both at full column width. Side by side at half the column each shot
  was too small to see what had changed, which is the only reason both are
  there. `media.scenarios` in the data is `[{ id, tab, label, before, after }]`
  — the pairing is explicit rather than inferred from the order of a flat list.
- **Source code is shown inline through one shared viewer, dressed as a
  browser window.** The whole thing sits in a bordered, rounded, shadowed
  frame — `--code-radius: 0.8rem`, a deliberate exception to the site's sharp
  2px corners, because chrome that is not rounded does not read as a browser.
  Inside it, top to bottom: a tab strip, an address bar, then the file.
  - **Tabs carry the file name only.** The full path would not fit and sits
    in the address bar directly beneath them anyway. The full path is still
    the tab's `title`, so a hover names it.
  - **The address bar carries the directory**, with a drawn folder mark, the
    directory in quiet type and the file name in ink — the split a browser
    makes between a domain and the rest of a URL, inverted so the specific
    part is the loud one.
  - **The selected tab and the address bar share one fill** (`--code-surface`,
    a wash of the project accent), so the tab appears to hang off the bar as
    one continuous surface. Its outer bottom corners curve *outward* into the
    strip through two masked pseudo-elements.
  - **The strip behind the tabs is `--code-band`, stated per theme** and
    deliberately darker than the tab surface. Earlier versions tinted the tab
    without darkening the band, and the silhouette was invisible — the shape
    only reads when there is something behind it to read against.
  - An earlier version marked the selected tab with a 2px accent rule along
    its top edge, which read as a stray line rather than as selection. The bottom fade hints at more content
  without covering the last line — the body is padded so the gradient lands on
  empty space at the end of a file. Terraform Code (under Resources) shows the main.tf
  and links out for the supporting files; Recovery Policy sits with the
  diagram and the folder tree, because the alert-to-script mapping is a
  decision worth reading, not a Terraform file. Both are deliberately narrow:
  a portfolio page shows the files that carry a decision, not the repo.
- **Folder structure** is the last tab of the Architecture & Structure panel,
  not a section of its own: the repo layout as a plain monospace tree on the
  terminal surface (`--terminal-*`, the same tokens the root page's popup
  uses). It stays dark in both themes — this is literal shell output, and it
  should read as such rather than following the page.
- **Four slots always render even when empty** — Architecture Diagram, Folder
  Structure, Screenshots + Demo Video, README.md. They show a dashed "not added yet"
  panel rather than disappearing, because they are the easiest sections to
  overlook while filling a project out. Sections whose absence is meaningful
  rather than pending (Members on a solo project) still disappear.
- **Technical Decisions is a crescent selector beside one card, not a list.**
  Numbered circles run down the **left edge** of the section on a crescent
  that bulges right at its middle and tucks back at both ends, so the circles
  at the extremes hang over the section's boundary and read as scalloped tabs
  rather than as a ring. The numbers sit next to each other with spacing alone
  between them, with a single faded blank past each end. The run traces a
  **half-ellipse** — `x` is the oval's width at that height — rather than the
  parabola it used to, so it reads as one oval edge with the ends tucking in
  sharply. Blanks *between* the numbers were tried and removed, and a long
  four-deep tail was tried and cut back: the section was carrying far more
  height than its content was worth. Picking a number brings it to the
  **vertical centre** of the section *and grows it* — size is what marks it as
  chosen while it is still travelling — and carries the whole crescent with
  it, since every circle is positioned relative to the selected one.

  **Numbers and blanks are spaced by different rules, and that is the whole
  trick.** The numbers take a constant step, wide enough to clear a selected
  circle against its neighbour, and it depends only on how many numbers there
  are — so adding blanks can never squeeze them. Past the numbers the blanks
  continue on a *decaying* step and shrink as they go, so the tail converges
  instead of marching: the arc's edge fills in, and the total can never reach
  the container's boundary however many blanks are added. One step for
  everything cannot do both jobs — widen it and the tail escapes the section
  and covers the next section's text, narrow it and the numbers collide. Both
  were shipped and both were wrong.

  **The selected circle's scale rides its own custom property**, not a
  transform string. The narrow layout has to neutralise `top`/`left` for the
  flat row, and a blanket `transform: none` there silently took the size boost
  with it.
- **The arc cycles on its own**, using the same three pieces of state as the
  Tech Stack wheel and in the same priority order: an ambient cycle, a pin set
  by a click, and an idle timer that releases the pin so the section returns to
  cycling rather than staying frozen on whatever was last clicked. Hovering
  anywhere over the selector or the card also holds it — the card is long-form
  text, and swapping it mid-sentence is worse than a wheel changing category.
  Reduced motion stops the cycle entirely.

  The reasoning: four dense trade-off paragraphs stacked as four bordered
  cards competed with each other and with everything below them. One at a
  time, chosen deliberately, is the right density. This replaced the bordered
  `.decision` card and with it the accent `border-left` the detector had
  always flagged as a side-tab.
- **The card is inline, and emphatically not a modal.** No overlay, no
  backdrop, no close button, no focus trap, nothing that takes the arrow keys
  or the scroll away from the page. The reader can ignore it, scroll past it,
  or read the rest of the page while it is showing. Keyboard support is a
  `tablist`: arrows move between numbers, and that handler is bound to the
  selector, never to the document.
- **The card is portrait and centred on the section's axis**, stacked
  title → concept mark → explanation. A hard `aspect-ratio` was tried first and
  clipped the longer explanations, so the proportion is a consequence of the
  content rather than a rule imposed on it.

  **Every card is the size of the longest decision.** Letting each take its own
  text's height gave four cards of four different shapes, which is not what a
  deck looks like. A hidden copy of every decision is stacked in one grid cell
  behind the live card — `visibility: hidden`, never `display: none`, since a
  display-none child contributes no height and height is the entire point — so
  the window ends up as tall as the tallest card and the live and leaving cards
  fill it. Measuring in JavaScript would work too, and would go stale the
  moment the copy changed.

  **The mark's `max-height` is the card's height dial**, not the figure band's
  `min-height`: the glyph renders at its cap and the band wraps it, so at
  10.5rem it was taking 189px of every card regardless of how much text the
  decision had. The band is `flex: 1 1 auto`, so on the cards whose text is
  shorter than the longest one's the spare height goes to the mark instead of
  pooling as dead space at the bottom.

  **Card width and section height trade against each other**, and both were
  measured before choosing. At 23rem the card is a proper 0.74 portrait but the
  section runs 653px; past 25rem the section stops shrinking — the arc's floor
  takes over — and the card only gets squarer. 24rem is where the two curves
  cross: 384x462, a 0.83 portrait, in a 615px section.

- **On the card, the title outranks the explanation.** It was set a step
  *below* the body text, which read as a caption sitting on top of a paragraph
  rather than as the name of the decision. The title is `--t-lead`, the card's
  copy a step down from page prose at `--t-small`. Those copy sizes are scoped
  to the card so the shared decision classes are untouched elsewhere.
- **The other decisions sit as grey filler cards fanned behind the live one**
  — the same idea as the arc's grey filler circles. They are depth only: no
  content, `aria-hidden`, fanned alternately left and right so the stack sits
  *behind* the card rather than trailing off one corner. **The fill has to be
  the grey, not the transparency**: a white ghost at low opacity on a white
  page is invisible, which is exactly how the first version shipped. The card must not stretch to the arc's row for this to work: the
  ghosts are `inset: 0` on its box, and a stretched box leaves them standing a
  head taller than the card they back.
- **The card carries a trading-card frame** — a second rule inset from the
  border plus opened corners, both in the project accent. Once the height was
  allowed to follow the text the proportions stopped reading as a card on
  their own, so the edge is what carries the idea now. Drawn with two
  pseudo-elements and layered gradients rather than eight corner nodes.
- **The whole card travels, not the text inside it.** The border, radius and
  ground live on the *face*, and the element around it is a clipping viewport
  with no frame of its own — so a complete card leaves through the top as a
  complete card rises behind it, through a full card-height of travel. An
  earlier version kept the frame static and slid only the contents, which read
  as text moving inside a card that never went anywhere. Depth here is the
  border alone: the viewport clips, and a drop shadow would be sheared off at
  its edge. Centring is `justify-self: center` pulled back
  by half the arc's column and half the gap — centred on its own column alone
  sat it noticeably right of the page's axis. The comparison line
  keeps `.decision__chose` / `.decision__over` / `.mark` exactly as they were.
  The mark is a drawn SVG named by `glyph` in the project's data, so the
  component holds no per-project knowledge; an unnamed decision gets a neutral
  default rather than a diagram that pretends to illustrate it.
- **Changing decisions is a shuffle, not a slide.** The arriving card is dealt
  off the deck — it starts offset, turned and slightly small, the way a card
  sits in a spread hand, and settles square; the leaving one is flicked away in
  the other direction; and the deck riffles behind them, replayed by keying the
  stack on the selection. Rotation is what makes it read as cards rather than
  as a panel changing its contents — an earlier straight vertical slide did
  not, however far it travelled.

  **Position and presence are CSS, not an animation loop.** The circles'
  positions are written as inline style and eased by a CSS transition, and the
  arriving card's resting state is its normal style with no `backwards` fill —
  so a frame that never composites lands everything where it belongs. The
  first build of this drove both through framer's animation and presence
  system, and a paused `requestAnimationFrame` left the circles stranded at
  the previous selection and **three card faces stacked on top of each other**.
  The leaving card is decoration only: `aria-hidden`, `inert`, and removed on
  a timer rather than on an animation event, so it cannot outlive its own
  animation. Both animations drop out under `prefers-reduced-motion`.
- **Two inline marks in narrative prose.** Backticks render as inline code on
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
- **Page heading:** the long descriptive project title is the H1, with the
  short name — the team's, for team projects — above it as a small
  accent-coloured eyebrow. The eyebrow is what ties the page back to the
  sidebar entry the reader clicked; the sidebar itself keeps the short names.
  Long titles are meant to wrap to two lines.
- **Dark mode** is the root app's system, reused rather than rebuilt: the same
  `ThemeToggle` component, the same pre-paint script in `index.html`, the same
  `theme` key in localStorage, and tokens redefined under `[data-theme]`. The
  toggle is parked top-right at every width.
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
  rather than listing every heading, centred in the content column. Workspace
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
