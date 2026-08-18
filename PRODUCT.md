# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary — US recruiters and hiring managers.** Non-engineer screeners doing a
fast credibility skim, deciding whether to pass Junhan Shin on to a technical
panel. They arrive from an application, a LinkedIn profile, or a résumé link.
They are not going to read Terraform. What they need to resolve in seconds:
this person can actually do cloud/DevOps work, has shipped something real, holds
a credential, and is available where the job is.

**Primary — Junhan himself, as a working record.** The site doubles as the place
his project write-ups are kept honest and current. This is a real user with a
real job to do, not a rationalization: it is why project pages carry decision
rationale, recovery policy, and folder structure that no recruiter will read.

**Explicitly not the primary audience:** engineers on the interview panel. The
technical depth exists and should stay defensible, but when a design decision
forces a choice, the recruiter's skim and the record win over the panel's read.

Context that shapes all of the above: Junhan is a career-changer moving from
program leadership and teaching into cloud infrastructure. The site's hardest
job is closing that credibility gap with evidence rather than assertion.

## Product Purpose

A personal portfolio system that gets a career-changer hired into a US cloud/DevOps
role, and that stays worth maintaining afterward as the durable record of what he
built and why.

Success is a recruiter forwarding the link, and a project page still being accurate
a year later.

## Positioning

The proof is infrastructure work with numbers attached — mean time to recover,
resources deployed, PRs reviewed and merged, failure scenarios validated — and the
decisions behind them written out (what was chosen, over what, and why). A generic
portfolio template cannot truthfully copy this because it has no projects with
operational metrics behind it.

The career change is not hidden. A decade of teaching and program leadership
(~1.7B KRW budget, 770+ students across 15 program cycles) is real professional
history and gets its own surface rather than being buried or apologized for.

## Operating Context

- **Domains, one purpose each.** `junhanshin.com` is the personal landing page
  (`apps/root`) — intro, timeline, skills, contact, terminal popup.
  `devops.junhanshin.com` is the project workspace (`apps/devops`) and the main
  job-search target. Two further subdomains are planned: a wellness /
  program-management surface for the pre-cloud background, and
  `mynotes.junhanshin.com` for study notes.
  *(DESIGN.md still says the root domain "redirects to devops" — that is stale.
  `apps/root` is a real, built page and the root domain serves it.)*
- **Planned, not built:** the interactive terminal "show and tell" page
  (resume-as-CLI, Terraform validator, interactive VPC diagram, system status
  dashboard); the wellness/program-management subdomain; `mynotes.junhanshin.com`.
- **`mynotes.junhanshin.com` mechanism is an open decision.** Notion embedded or
  linked, versus a real app built in this repo, is undecided. It comes after the
  other surfaces are complete. Do not assume either.
- **Reading situation:** desktop skim from a link in an application, plus phone.
  Both matter; neither is a fallback for the other.
- **Language:** the interface is English. Project READMEs may carry an optional
  Korean variant via the EN/KO toggle — a bonus, never a requirement, and never a
  reason to constrain an English layout.

## Capabilities and Constraints

- **Monorepo, two Vite + React apps.** `apps/root` and `apps/devops` share design
  tokens (DESIGN.md) but no code. Future surfaces are expected to follow the same
  pattern: own app, shared token vocabulary.
- **Static hosting, no server.** Routing in `apps/devops` is on the URL hash
  specifically so deep links survive a hard refresh with no rewrite rules. Anything
  requiring a server or build-time rewrite is out of scope unless the hosting
  decision changes.
- **Hosting/deploy target is not recorded.** There is no CI workflow in the repo
  yet. Do not assume a provider.
- **Project pages are data-driven.** `apps/devops/src/data/projects.js` is the only
  per-project source; page components know nothing about any individual project.
  Adding or reordering projects is a data change, never a component change. Keep it
  that way.
- **Dark mode is a shared system**, not per-app — one `theme` key in localStorage,
  one pre-paint script, tokens redefined under `[data-theme]`.
- **Sidebar taxonomy:** three groups — Team Projects, KT Cloud TECH UP Enterprise
  Fellowship Project, Individual Projects. Eight projects total.

## Brand Commitments

- **Name and identity:** Junhan Shin. The `>_` terminal mark or initials stand in
  for a headshot — there is no personal photo anywhere on the site, by decision.
- **One colour is reserved for him**, site-wide (`--name-pop`): the welcome line,
  his avatar on every project, the sidebar wordmark. No teammate, category, or
  project accent may use it.
- Visual system (palette, typography, component patterns) is DESIGN.md's, not this
  file's.

## Evidence on Hand

**Real, verified, usable:**

- **EchoChallengers** (Apr 20 – May 22, 2026) — self-healing AWS infrastructure.
  Full write-up: role, context, six metrics (30–60s MTTR, 5–10s MTTD, 27 PRs merged,
  41 AWS resources in ~10 min, 12 cases resolved, 4 scenarios validated), seven-category
  tech stack, real Terraform `main.tf`, real `recovery_map.yml` and `alert.rules.yml`,
  four technical decisions, five named teammates, a 30k-character README (EN + KO).
- **Credential:** AWS Certified Solutions Architect – Associate. This is the only
  certification held.
- **Work history:** Team Lead, Wellness College (O2 Footprint), Feb 2025 – Mar 2026;
  freelance math tutor, Apr 2020 – Feb 2023; yoga instructor / studio receptionist,
  2014 – 2019. Education: B.S., Information and Statistics.
- **Contact:** junhanshin17@gmail.com. Based in Korea, completing a 6-month cloud
  infrastructure bootcamp; relocating to Methuen, MA in September 2026.
- **Icon assets:** real vendor SVGs under `apps/devops/src/assets/icons/`.

**Real projects, material not yet written:** Lock-N-Lock, hailcast, the KT Cloud
TECH UP fellowship build, two individual projects, Cloud Resume Challenge,
Kubernetes Challenge. All seven are genuine and will be filled in. Their current
entries are scaffolding — `period: 'TBD'`, "Decision title", placeholder metrics.

**Must never be fabricated:** metrics, periods, teammate names, decision rationale,
or outcomes for any unfilled project. Empty is correct; plausible is not. The site's
empty-slot pattern exists for exactly this reason.

**Does not exist — do not imply otherwise:** testimonials, references, employer
endorsements, production traffic, paying users, a second certification. The phone
number in `apps/root/src/components/Timeline.jsx` is a `999-999-999` placeholder,
not a real number.

## Product Principles

1. **Real numbers or nothing.** Every figure on the site traces to work actually
   done. An unfilled project shows as unfilled.
2. **Two speeds, one page.** A recruiter must reach a verdict without scrolling into
   the deep-dive; the deep-dive must reward the reader who does. Neither may be
   sacrificed to serve the other.
3. **Evidence over assertion.** Show the Terraform, the diagram, the decision and
   what it was chosen over — rather than describing skills in adjectives. This is
   how a career-changer earns belief.
4. **Each surface has one job.** Cloud proof on the devops subdomain, the person on
   the root domain, the pre-cloud decade on its own subdomain, notes on theirs. No
   surface is a dumping ground for what didn't fit elsewhere.
5. **Structure lives in data.** Content, ordering, and taxonomy come from data files
   so the site can grow for years without a component rewrite.

## Accessibility & Inclusion

- `prefers-reduced-motion` is honored throughout and is not optional: scroll reveals,
  the hero sequence, and the tech-stack auto-cycle all have a genuinely static path,
  not a faster animation.
- Light and dark themes are both first-class; neither is a degraded mode.
- No standard (WCAG level, audit requirement) has been established for this project.
