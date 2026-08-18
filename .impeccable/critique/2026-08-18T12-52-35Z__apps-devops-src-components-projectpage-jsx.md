---
target: apps/devops project workspace (ProjectPage.jsx)
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
timestamp: 2026-08-18T12-52-35Z
slug: apps-devops-src-components-projectpage-jsx
---
**Method: dual-agent** (A: design review, isolated · B: detector + browser evidence, isolated)
**Target:** `apps/devops/src/components/ProjectPage.jsx` and everything it renders — inspected live at `#/`, `#/projects/echochallengers`, `#/projects/hailcast`, and a bad slug, desktop + mobile, both themes.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Scroll-spy runs backwards mid-page; images reserve no height (document grows 8,247px → 10,311px); `document.title` identical on all 8 routes |
| 2 | Match System / Real World | 2 | Welcome hint says "Select a project from the left" — on a phone there is no left |
| 3 | User Control and Freedom | 3 | Hash routing survives refresh, Esc closes drawer — but the wheel un-pins a clicked category after 6s |
| 4 | Consistency and Standards | 3 | Strong internal system; loses a point to NotFound's raw browser-blue link |
| 5 | Error Prevention | 2 | EmptySlot prevents the author's omissions by showing them to the recruiter |
| 6 | Recognition Rather Than Recall | 2 | 17 of 22 tech-stack marks are grey capitals; five ambiguous pairs (A/A, N/N, P/P, F/F, G/G) |
| 7 | Flexibility and Efficiency | 2 | Two users at opposite speeds, no fast path to the numbers |
| 8 | Aesthetic and Minimalist Design | 2 | 55,303 chars on one page (~37 min); ~5 MB unoptimised JPEG |
| 9 | Error Recovery | 2 | NotFound renders the bad slug in the welcome gradient at hero size |
| 10 | Help and Documentation | 2 | hint tooltips hover-only on the abbreviations a non-engineer needs; nothing says who Junhan is |
| **Total** | | **22/40** | **Needs work — the deep-dive is excellent, the entry is not** |

## Design Specificity Verdict

Authored in its bones, category-default where it matters most.

Real authorship: a Recovery Policy section deliberately separate from Terraform; `metrics[].size` making the headline number an editorial decision; Avatars assigning tints before render with the owner skipped; richText understanding exactly two marks.

Anonymous: the page header is a generic CMS header (eyebrow/H1/date/links/avatars). The sidebar is a file tree — eight identical entries, no status. The tech-stack wheel is the one component liftable into an unrelated product unchanged, and it is the most elaborate thing in the app.

The deep-dive is specific; the entry is generic. Backwards for a surface whose primary user leaves before reaching the deep-dive.

**Deterministic scan.** detect.mjs on apps/devops/src: exit 2, 3 findings — side-tab ×2 (global.css:1522, :1805), gradient-text ×1 (global.css:412). In-page detector (mutation preflight passed): 20 findings on echochallengers, 14 on hailcast, 3 on welcome. Rules: low-contrast, undersized-ui-text ×10, justified-text ×5, overused-font, skipped-heading, em-dash-overuse (hailcast only), dark-glow.

**Agreement:** contrast. Review measured nine failing element classes; detector independently confirmed .project__eyebrow 2.7:1 and .project__period 2.4:1, and found the eyebrow fails at a similar ratio with a different accent on hailcast (#e08a3c, 2.5:1) — the accent-on-eyebrow pattern fails across the whole palette.

**Detector-only catches:** skipped-heading (h2 "README.md" → h4) on every project page; 3px horizontal overflow at 375px from one .code__tab with a long path (global.css:1152/:1164); em-dash-overuse firing on hailcast but not echochallengers (the placeholder prose is em-dash-heavy in a way the real writing is not).

**Confirmed false positives:** dark-glow (page is light; shadow is --ink at 7%). side-tab at :1805 (blockquote's neutral --border indent). The :1522 side-tab and the welcome gradient-text are genuine matches but documented deliberate decisions — the brief wins.

Zero console errors and zero failed network requests on all routes.

## Overall Impression

Well-engineered app with a serious craft problem in the first 800 pixels. A recruiter with 40 seconds lands on a page whose first viewport holds one live link, one dead link, and five strangers' initials, with the numbers 1,383px down. Biggest opportunity: seven of eight sidebar entries ship fabricated placeholder content to the primary user — a data edit, not a redesign.

## What's Working

1. **The capped-frame idiom, reused with discipline.** ReadmeSection and CodeViewer share one behaviour against two grounds for stated reasons. `.code__body` padding-bottom lands the fade on empty space at end-of-file; `.code__viewport` contains only the horizontal overscroll axis so the wheel chains back to the page.
2. **The bento metric grid.** Five columns, sizes from data, six tiles tiling exactly, component knows nothing about which number matters. It works — which is why burying it 1,383px down is the most expensive decision on the page.
3. **The owner-colour reservation is enforced in code.** owner.js names him once, AVATAR_TINTS holds no blue, rotation skips him. A rule that cannot be violated by adding a teammate.

## Priority Issues

### [P0] Seven of eight projects ship fabricated scaffolding to the primary user
Verified in data/projects.js: `{ name: 'Teammate Two' }` / `'Teammate Three'` render as humans on three project pages (lines 290-291, 349-351, 410-411), two sharing the monogram "TT". `'0 %' Cost saved`, `'00 s' Lag removed`, `'0 %' Accuracy` render in the evidence section. `'Decision title'` appears four times. `'What the project taught me.'` is the Reflection on four projects. hailcast's README renders "Placeholder section."
**Why:** PRODUCT.md's own red line, crossed on 7 of 8 pages, in the exact categories it names. A recruiter who suspects one fabricated number discards the real 30–60s MTTR too. A first visitor has a 7-in-8 chance of clicking a placeholder.
**Fix:** Add project-level `status: 'draft'`, gate sectionsFor() on it, render drafts as title + one line + repo link. Delete every placeholder string, fake teammate, zero metric. Mark drafts in the sidebar.
**Command:** /impeccable harden

### [P0] Nothing on this surface says who Junhan is, that he is certified, or where he can work
Zero matches across src/components, src/data, index.html for the AWS certification, LinkedIn, résumé, contact, location, availability, or a link to junhanshin.com. One static `<title>` for all 8 routes, confirmed never to change on hash navigation. No OG/Twitter meta tags.
**Why:** PRODUCT.md defines the recruiter's four facts; two do not exist on the main job-search surface. Stated success is "a recruiter forwarding the link" — which pastes as an unpreviewed URL identical to seven siblings.
**Fix:** Identity block in Sidebar.jsx under the wordmark (cert · relocation · junhanshin.com · LinkedIn). Set document.title from the project in the existing slug-keyed effect; add static OG tags.
**Command:** /impeccable harden

### [P1] A recruiter cannot reach a verdict without scrolling
Measured: #links y=249/328, #members y=463/494, #impact y=1383/1808 (desktop/mobile). First viewport = one live link, one dead link, five teammates.
**Why:** PRODUCT.md Principle 2. DESIGN.md's links-first rationale describes an engineer, whom PRODUCT.md names as not primary.
**Fix:** Reorder SECTIONS to impact → role → links → context → members → stack. One array move. Hoist a two-line outcome sentence into .project__head.
**Command:** /impeccable layout

### [P1] Light mode fails contrast across every secondary and accent element; dark mode passes
Light ratios: .section-nav__item 2.40 · .project__period 2.40 · .project__eyebrow 2.67 · .decision__over 2.40 · .mark 2.67 · .bento__value at 46px 2.86 (fails even the 3:1 large-text floor) · .avatars__role 2.67. Same elements score 6.3–9.8 dark. --text-secondary is #8FA3BD light / #92A3BE dark — never actually re-tuned for #F5F7FA.
**Why:** .mark is the mechanism DESIGN.md uses to lift numbers out of a sentence — at 2.67:1 it is the lowest-contrast text in the paragraph. .decision__over is the half of the trade-off that lost, at 2.40:1. The theme most US corporate laptops default to is the broken one.
**Fix:** Split the token (light ~#5A6C85, ≈4.6:1). Add a text-only --accent-text per project at ~4.5:1 (emerald ≈ #2F7B65, orange ≈ #A85F16) for .mark, .project__eyebrow, .avatars__role, .section-nav__item--on, .decision__chose.
**Command:** /impeccable audit

### [P2] The Tech Stack is the largest block on the page and carries almost no information
17 of 22 wheel nodes fall back to a grey capital letter; five indistinguishable pairs; "AWS" renders as "A". Below 861px it becomes 7 cards, 1,844px tall. All 7 category labels are 10.88px, below the detector's 11px functional-text floor.
**Why:** DESIGN.md's rationale ("the mark is what a reader recognises") is 23% true, and DESIGN.md's own avoid-list names icon-tile stacks with no real content. The wheel is mouse-only: .wheel__node is an li with onClick.
**Fix:** Add the missing SVGs (techIcon picks them up with no code change); drop items with no real mark; two-column name+mark list on phone; real buttons.
**Command:** /impeccable polish

## Persona Red Flags

**Recruiter, 40 seconds.** First viewport: GitHub icon, greyed Notion icon, five strangers' initials, zero achievement. Likely clicks a placeholder project. Cannot find the cert, a location, availability, or contact. "Workspace" (first menu entry) sounds like the repo. Forwarded link previews identically to seven siblings.

**Phone reader.** "Select a project from the left" — there is no left. Sticky menu is 740px in a 375px viewport with scrollbar-width:none and no fade; Demo/Resources/Reflection are invisible. 108px fixed chrome = 13% of viewport. #impact at y=1808. ~5 MB JPEG on cellular. Images have no aspect-ratio, so the document grows 8,247→10,311px under the thumb. Justified prose at ~42 chars produces rivers and a mid-word break. Drawer does not lock body scroll, move focus, or trap it.

**Junhan maintaining the record.** always:true slots grew from four to six, so recovery and terraform stand as permanent "not added yet" panels on unrelated projects — the reminder became noise, and it is shown to the recruiter, not to him. DESIGN.md's accent escape clause has expired: Individual Projects reads forest, indigo, indigo, forest.

**Keyboard/low-vision reviewer.** The whole contrast table in the default theme. 64 tab stops. Wheel nodes/slices are li/path with onClick — no keyboard reach. Mobile drawer offscreen via transform with visibility:visible, no aria-hidden or inert — 10 tabbable controls while closed.

## Minor Observations

DESIGN.md ↔ code drift, seven items: (1) typography entirely stale — DESIGN.md specifies Archivo + Manrope, the app loads Inter for both --font-header and --font-body (global.css:37-38); only Fira Code survived, which also explains the overused-font finding. (2) "five category entries" — navGroups.js has six; the app README repeats "five" twice. (3) "Four slots always render" — six have always:true. (4) Bento described as four columns / one big + two squares + one wide; CSS is five columns. (5) "circular avatars are the sole exception" to sharp corners, but --radius-card:5px + box-shadow is used by .bento__tile, .stack-group, .code__tabs, .code__frame. (6) root-domain redirect line. (7) the "status dot" pattern does not exist in this app.

Dead CSS with a live intent: the ≤860px block styles `.metric`, a class that does not exist (the bento uses .bento__tile), so .bento__value is still 46.4px at 375px. `.project__title { max-width: none }` is also a no-op.

3px horizontal overflow at 375px on echochallengers from one .code__tab with a long file path.

h2 "README.md" followed by h4 on every project page — broken heading outline.

In dark mode --name-pop is darker and less prominent than the near-white text beside it: the colour reserved for Junhan makes his name the quietest word in his own greeting.

NotFound reuses .welcome__message, rendering an arbitrary slug in the indigo gradient at up to 3.4rem.

The #tech nav group is non-contiguous by design, so the active underline travels backwards once per read-through.

.section-nav carries backdrop-filter blur(14px) saturate(180%) across the full content column, repainting every scroll frame above 15 framer-motion layers and ~5 MB of decoded JPEG.

## Questions to Consider

1. If the sidebar showed only EchoChallengers today, would the site be stronger?
2. What if the default route were EchoChallengers instead of the welcome screen?
3. Whose page is this? Every heading names the project; a recruiter is hiring a person.
4. What is the tech-stack wheel actually arguing — 620px for 22 names, 17 of them grey letters?
5. Should EmptySlot ever be visible to a visitor, or should the completeness check be a build-time line to Junhan?
6. If a recruiter can take away one number, which one? Six equally-styled metrics leave it to tile geometry.
