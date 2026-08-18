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

| Role | Font | Weight | Used for |
|---|---|---|---|
| Headers/headlines | Archivo | 700–800 | Page titles, section headers, project names |
| Body text | Manrope | 400–500 | Paragraphs, descriptions, write-ups |
| Monospace/metrics | Fira Code | 400–500 | Terminal/CLI elements, code snippets, metric callouts, the `>_` mark |

All three are free, open-license fonts via Google Fonts — no attribution required.

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=Manrope:wght@400;500&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
```

Keep fonts in their lanes: never use Archivo for body paragraphs (too heavy at length), never use Manrope for headers if a bold statement is wanted, Fira Code stays reserved for code/terminal/metric contexts only.

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
- **Metric callouts:** large bold number (Archivo or bold Manrope) with a small muted label above it (Manrope, secondary text color).
- **Avatar mark:** rounded-square, base accent color background, `>_` symbol or initials in Fira Code, white text.

## Project workspace (devops.junhanshin.com)

Implemented in `apps/devops/`. A page type not previously covered here, so the
decisions behind it are recorded below rather than left in the code.

- **Shell:** left sidebar (272px at full width) plus one content column. The sidebar
  holds the name — which is the way back to the default state, and is set
  clearly larger than anything under it — over three numbered project lists:
  "Team Projects", "KT Cloud TECH UP Enterprise Fellowship Project" (a
  category of its own, holding the one fellowship build), and "Individual
  Projects". The lists, their order, and their numbering all come from data,
  so the categories and counts are free to change.
- **Default state:** nothing selected shows a large centred "Welcome to
  Junhan's Workspace." over one quiet line — "Select a project from the left
  to explore it in full detail." Still deliberately sparse: the sidebar is the
  entry point, and the second line only says so.
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
- **Tech stack shows real vendor logos**, not tinted word-pills — the mark is
  what a reader recognises when scanning. Laid out as a plain grid with no
  chip, fill, or border behind each entry: the logo and its name, at a size
  worth looking at. The logos carry their own brand colors, which is why
  the project accent stays off this row: two color systems in one strip reads
  as noise. A label with no logo file yet falls back to a monogram tile.
- **Section headings are large, unbulleted, and left-aligned** — a real
  heading a clear step under the project title, with the rule between sections
  doing the separating. The earlier small-label-with-a-square treatment read as
  a list, not a page. Centred headings were tried and rejected: everything on
  the page hangs off the same left edge instead. The sticky menu is the one
  centred element.
- **Body copy is justified and runs the column's full width.** No measure cap
  on prose, and the page title is uncapped too — it uses the width it has and
  only breaks when it genuinely runs out. No `text-wrap: balance` on headings
  either: left-aligned, each line should run to the edge before breaking, and
  balancing would leave the first line short of the width it has. Every
  justified block also sets `hyphens: auto`; the two go together, since
  justification without hyphenation opens rivers around long technical terms.
  Trade-off worth knowing: at the 1180px measure this puts roughly 130
  characters on a line, well past the 60–80 that reads most comfortably.
  Chosen deliberately for the full-width look.
- **Members is its own section**, not a row of initials beside the date:
  circular initial avatars with each name beneath. The page header carries the
  title and the period only.
- **Three slots always render even when empty** — Architecture Diagram,
  Screenshots + Demo Video, README.md. They show a dashed "not added yet"
  panel rather than disappearing, because they are the easiest sections to
  overlook while filling a project out. Sections whose absence is meaningful
  rather than pending (Members on a solo project) still disappear.
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
- **Responsive:** the sidebar is a real column above 1100px, narrows to 224px
  through the tablet range, and becomes a drawer behind a hamburger at 860px
  and below. A fixed full-height rail is not a layout a phone can carry, so it
  is a different pattern rather than a smaller one.
- **Sticky menu:** collapses the sections into five category entries —
  Overview, Tech & Architecture, Demo, Resources, Reflection — rather than
  listing every heading, centred in the content column. The page itself is unchanged: all sections still
  render in the same order, they simply share a menu entry. Groups are
  contiguous in page order so the highlight only moves forward while scrolling.
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
- **Styling:** dark terminal-style background inside the popup is acceptable here even though the rest of the site is light-mode — this is the one intentional exception, since it reinforces the "real terminal" feel; use Fira Code for all terminal text

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
