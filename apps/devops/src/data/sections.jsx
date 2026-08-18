import MembersSection from '../components/sections/MembersSection.jsx'
import RoleSection from '../components/sections/RoleSection.jsx'
import ContextSection from '../components/sections/ContextSection.jsx'
import MetricsSection from '../components/sections/MetricsSection.jsx'
import StackSection from '../components/sections/StackSection.jsx'
import ArchitectureSection from '../components/sections/ArchitectureSection.jsx'
import MediaSection from '../components/sections/MediaSection.jsx'
import DecisionsSection from '../components/sections/DecisionsSection.jsx'
import LinksSection, { visibleLinkKinds } from '../components/sections/LinksSection.jsx'
import ReadmeSection from '../components/sections/ReadmeSection.jsx'
import ReflectionSection from '../components/sections/ReflectionSection.jsx'

// THE source of truth for a project page. The page renders this list in
// order, and the sticky anchor nav is generated from the very same filtered
// list — neither one keeps its own copy, so a section added here shows up in
// both automatically, with nothing else to update.
//
//   id        anchor target and React key; must stay unique and URL-safe
//   label     the section's heading, and the menu entry when navLabel is unset
//   navLabel  optional shorter form for the menu, which sets these in caps and
//             has to fit them all across the column; the heading itself stays
//             as descriptive as it needs to be
//   has       whether this project has anything to put in the section
//   always    render the section even when `has` is false, letting the body
//             show its own "not added yet" state. For the slots that are easy
//             to forget while filling a project out — the diagram, the
//             screenshots, the README — a standing empty heading is the point.
//             Sections whose absence is meaningful rather than pending (a solo
//             project has no Members) leave this off and disappear instead.
//   Body      the component, given the whole project
//
// The page header above all of this is just the title and the period. It is
// always present and is not an anchor target.
export const SECTIONS = [
  {
    id: 'members',
    label: 'Members',
    has: (project) => project.team?.length > 0,
    Body: MembersSection,
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
    navLabel: 'Context',
    has: (project) => Boolean(project.context),
    Body: ContextSection,
  },
  {
    id: 'impact',
    label: 'Key Impact Metrics',
    navLabel: 'Impact',
    has: (project) => project.metrics?.length > 0,
    Body: MetricsSection,
  },
  {
    id: 'stack',
    label: 'Tech Stack',
    has: (project) => project.stack?.length > 0,
    Body: StackSection,
  },
  {
    id: 'architecture',
    label: 'Architecture Diagram',
    navLabel: 'Architecture',
    has: (project) => Boolean(project.architecture?.src),
    always: true,
    Body: ArchitectureSection,
  },
  {
    id: 'media',
    label: 'Screenshots + Demo Video',
    navLabel: 'Media',
    has: (project) => Boolean(project.media?.screenshots?.length || project.media?.video),
    always: true,
    Body: MediaSection,
  },
  {
    id: 'decisions',
    label: 'Technical Decisions',
    navLabel: 'Decisions',
    has: (project) => project.decisions?.length > 0,
    Body: DecisionsSection,
  },
  {
    id: 'links',
    label: 'Links',
    has: (project) => visibleLinkKinds(project).length > 0,
    Body: LinksSection,
  },
  {
    id: 'readme',
    label: 'README.md',
    navLabel: 'README',
    has: () => true,
    always: true,
    Body: ReadmeSection,
  },
  {
    id: 'reflection',
    label: 'Reflection',
    has: (project) => Boolean(project.reflection?.learned || project.reflection?.differently),
    Body: ReflectionSection,
  },
]

export function sectionsFor(project) {
  return SECTIONS.filter((section) => section.always || section.has(project))
}
