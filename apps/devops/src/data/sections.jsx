import RoleSection from '../components/sections/RoleSection.jsx'
import ContextSection from '../components/sections/ContextSection.jsx'
import MetricsSection from '../components/sections/MetricsSection.jsx'
import StackSection from '../components/sections/StackSection.jsx'
import ArchitectureSection, {
  hasArchitecture,
} from '../components/sections/ArchitectureSection.jsx'
import StepsSection from '../components/sections/StepsSection.jsx'
import CostSection from '../components/sections/CostSection.jsx'
import RecoveryPolicySection from '../components/sections/RecoveryPolicySection.jsx'
import SourceSection from '../components/sections/SourceSection.jsx'
import MediaSection from '../components/sections/MediaSection.jsx'
import DecisionsSection from '../components/sections/DecisionsSection.jsx'
import LinksSection, { visibleLinkKinds } from '../components/sections/LinksSection.jsx'
import ReflectionSection from '../components/sections/ReflectionSection.jsx'

// THE source of truth for a project page. The page renders this list in
// order, and the sticky anchor nav is generated from the very same filtered
// list — neither one keeps its own copy, so a section added here shows up in
// both automatically, with nothing else to update.
//
//   id        anchor target and React key; must stay unique and URL-safe
//   label     the section's heading. Either a string, or a function of the
//             project when one project wants to name the section its own way
//             — read it through `labelOf` rather than touching it directly.
//   has       whether this project has anything to put in the section
//   always    render the section even when `has` is false, letting the body
//             show its own "not added yet" state. For the slots that are easy
//             to forget while filling a project out — the diagram, the
//             screenshots, the README — a standing empty heading is the point.
//             Sections whose absence is meaningful rather than pending (a solo
//             project has no Members) leave this off and disappear instead.
//             May also be a function of the project, for a slot that is
//             pending on most projects but genuinely not applicable on one —
//             read it through `alwaysFor` rather than testing it directly.
//   bare      the body renders its own heading(s) rather than the page putting
//             one above it. For a section whose columns mean different things
//             and each need naming — one heading over both would claim to
//             govern both. The body receives `headingId` and `label` so the
//             heading it renders is still what the section is labelled by.
//   Body      the component, given the whole project
//   Aside     optional control rendered right-aligned on the heading line —
//             for a section whose body needs a switch that belongs beside the
//             title rather than buried under it
//   Wrapper   optional wrapper around the whole section, so an Aside and a
//             Body that share state can sit in one provider
//
// The page header above all of this is just the title and the period. It is
// always present and is not an anchor target.
export const SECTIONS = [
  {
    // Where the work lives, and what it was, side by side. The links took a
    // full-width section to hold three small tiles and left most of the row
    // empty; At a Glance fills it with the only three sentences a reader who
    // is not going to scroll should still come away with.
    id: 'links',
    // "<Team> Workspace" everywhere, built from the project's short name —
    // the same name the sidebar shows — rather than spelled out per project.
    label: (project) => `${project.title} Workspace`,
    // The body renders the headings, not the page: this section is two columns
    // that mean different things, and one heading above both read as though it
    // governed the summary as well as the links. The body gets the label and
    // the heading id and puts them on the left column, then heads the right
    // column itself.
    bare: true,
    has: (project) =>
      visibleLinkKinds(project, 'workspace').length > 0 || Boolean(project.glance),
    Body: LinksSection,
  },
  {
    id: 'role',
    label: 'My Role',
    has: (project) => Boolean(project.role),
    Body: RoleSection,
  },
  {
    id: 'context',
    label: 'Problem & Context',
    has: (project) => Boolean(project.context),
    Body: ContextSection,
  },
  {
    id: 'stack',
    label: 'Tech Stack',
    has: (project) => project.stack?.length > 0,
    Body: StackSection,
  },
  {
    // The diagrams and the folder tree, one panel with a tab each. They were
    // two stacked sections; they answer the same question, so switching
    // between them beats scrolling between them.
    id: 'architecture',
    label: 'Architecture & Folder Structure',
    // Owned by the section component: a view counts whether it is an image
    // file or a diagram described in the data, and only that component knows
    // both shapes.
    has: hasArchitecture,
    always: true,
    Body: ArchitectureSection,
  },
  {
    // How the project was actually run, week by week — the calendar and the
    // phase list together. It sits directly after the architecture panel: a
    // reader who has just seen what was built is the one who wants to know
    // over what span, and it lands before the trade-offs, which are easier to
    // weigh once the timeline they were made under is on the page.
    id: 'steps',
    label: 'Implementation Steps',
    has: (project) => project.implementation?.phases?.length > 0,
    Body: StepsSection,
  },
  {
    // Config, not Terraform — kept next to the diagram and the folder tree
    // rather than folded into the Terraform section. The heading names both
    // halves of what the panel actually holds: the alert-to-script mapping and
    // the rules that decide when an alert fires at all.
    id: 'recovery',
    label: 'Recovery Logic & Alert Routing',
    has: (project) => project.recoveryPolicy?.length > 0,
    // Standing empty on a project that has not filled it in, gone entirely on
    // one that sets `recoveryPolicy: null` — a project with no recovery config
    // to show should not carry a permanent "not added yet" for a file that is
    // never going to arrive.
    always: (project) => project.recoveryPolicy !== null,
    Body: RecoveryPolicySection,
  },
  {
    // Above the screenshots, not below them. Technical Decisions belongs with
    // the stack and the diagrams both by meaning and by reading order, and
    // sitting after the demo made the sticky menu light Demo and then jump
    // back to Tech & Architecture as the reader scrolled forward.
    id: 'decisions',
    // Decisions and trade-offs are one section, not two. Every entry in the
    // deck is both — something was chosen and something was given up — and
    // splitting them would have meant deciding, per card, which half it was.
    label: 'Technical Decisions & Design Trade-Offs',
    has: (project) => project.decisions?.length > 0,
    Body: DecisionsSection,
  },
  {
    // The numbers, after the work rather than before it. Up in Overview they
    // were six figures asking to be taken on trust from a reader who had not
    // yet seen the architecture, the timeline, or the trade-offs. Here they
    // are the result of all three, and the cost table reads as the second half
    // of the same thought.
    id: 'impact',
    label: 'Key Impact Metrics',
    has: (project) => project.metrics?.length > 0,
    Body: MetricsSection,
  },
  {
    // Directly under the metrics. These are estimates against free-tier usage
    // rather than production billing, and a cost table is the wrong thing to
    // lead with: it means something to a reader who already understands the
    // architecture and almost nothing to one who does not.
    id: 'cost',
    label: 'Cost Analysis',
    has: (project) => project.cost?.items?.length > 0,
    Body: CostSection,
  },
  {
    id: 'media',
    label: 'Screenshots + Demo Video',
    has: (project) => Boolean(project.media?.scenarios?.length || project.media?.video),
    always: true,
    Body: MediaSection,
  },
  {
    // Resources: the README, the runbook and the Terraform in one panel, a tab
    // each and in that order — what the system is, how it is operated, what it
    // is made of. Each document's language toggle rides in its own tab's
    // address bar rather than on a heading shared with the others.
    //
    // This *is* Resources now. There used to be a second section of the same
    // name directly above it holding a README tile and a Presentation tile —
    // two headings called the same thing, one of which linked out to the
    // document the other one already showed inline. The panel is the real
    // resource; the deck link moved up to the workspace row at the top of the
    // page, where the repo links already live.
    id: 'source',
    label: 'Resources',
    has: (project) => project.terraform?.length > 0,
    always: true,
    Body: SourceSection,
  },
  {
    id: 'reflection',
    label: 'Reflection',
    has: (project) => Boolean(project.reflection?.learned || project.reflection?.differently),
    Body: ReflectionSection,
  },
]

// `label` may be a plain string or a function of the project, so every reader
// goes through this rather than assuming one or the other.
export function labelOf(section, project) {
  return typeof section.label === 'function' ? section.label(project) : section.label
}

// Same shape as `labelOf`, for the same reason. A project opts a standing empty
// slot out by setting that section's key to `null` — which reads differently
// from leaving it undefined: undefined is "not filled in yet", null is "this
// project does not have one". Only `always` functions look at the difference.
export function alwaysFor(section, project) {
  return typeof section.always === 'function' ? section.always(project) : section.always
}

export function sectionsFor(project) {
  return SECTIONS.filter((section) => alwaysFor(section, project) || section.has(project))
}
