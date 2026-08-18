import MembersSection from '../components/sections/MembersSection.jsx'
import RoleSection from '../components/sections/RoleSection.jsx'
import ContextSection from '../components/sections/ContextSection.jsx'
import MetricsSection from '../components/sections/MetricsSection.jsx'
import StackSection from '../components/sections/StackSection.jsx'
import ArchitectureSection from '../components/sections/ArchitectureSection.jsx'
import FolderStructureSection from '../components/sections/FolderStructureSection.jsx'
import RecoveryPolicySection from '../components/sections/RecoveryPolicySection.jsx'
import TerraformSection from '../components/sections/TerraformSection.jsx'
import MediaSection from '../components/sections/MediaSection.jsx'
import DecisionsSection from '../components/sections/DecisionsSection.jsx'
import LinksSection, {
  ResourcesSection,
  visibleLinkKinds,
} from '../components/sections/LinksSection.jsx'
import ReadmeSection, {
  ReadmeProvider,
  ReadmeLangToggle,
} from '../components/sections/ReadmeSection.jsx'
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
    // First on the page, directly under the title and period line: where the
    // work actually lives is the first thing a reader wants, not the last.
    id: 'links',
    // "<Team> Workspace" everywhere, built from the project's short name —
    // the same name the sidebar shows — rather than spelled out per project.
    label: (project) => `${project.title} Workspace`,
    has: (project) => visibleLinkKinds(project, 'workspace').length > 0,
    Body: LinksSection,
  },
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
    has: (project) => Boolean(project.context),
    Body: ContextSection,
  },
  {
    id: 'impact',
    label: 'Key Impact Metrics',
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
    has: (project) => [].concat(project.architecture ?? []).some((d) => d?.src),
    always: true,
    Body: ArchitectureSection,
  },
  {
    id: 'folders',
    label: 'Folder Structure',
    has: (project) => Boolean(project.folderStructure),
    always: true,
    Body: FolderStructureSection,
  },
  {
    // Config, not Terraform — kept next to the diagram and the folder tree
    // rather than folded into the Terraform section.
    id: 'recovery',
    label: 'Recovery Policy',
    has: (project) => project.recoveryPolicy?.length > 0,
    always: true,
    Body: RecoveryPolicySection,
  },
  {
    id: 'media',
    label: 'Screenshots + Demo Video',
    has: (project) => Boolean(project.media?.screenshots?.length || project.media?.video),
    always: true,
    Body: MediaSection,
  },
  {
    id: 'decisions',
    label: 'Technical Decisions',
    has: (project) => project.decisions?.length > 0,
    Body: DecisionsSection,
  },
  {
    // The things a reader might open alongside the write-up, as opposed to the
    // repo itself — that sits at the top under the team's name.
    id: 'resources',
    label: 'Resources',
    has: (project) => visibleLinkKinds(project, 'resources').length > 0,
    Body: ResourcesSection,
  },
  {
    id: 'terraform',
    label: 'Terraform Code',
    has: (project) => project.terraform?.length > 0,
    always: true,
    Body: TerraformSection,
  },
  {
    id: 'readme',
    label: 'README.md',
    has: () => true,
    always: true,
    Wrapper: ReadmeProvider,
    Aside: ReadmeLangToggle,
    Body: ReadmeSection,
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

export function sectionsFor(project) {
  return SECTIONS.filter((section) => section.always || section.has(project))
}
