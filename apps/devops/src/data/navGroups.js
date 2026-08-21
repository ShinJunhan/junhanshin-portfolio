// The sticky menu's five entries. This is a grouping *over* the section list
// in sections.jsx — it changes nothing about what the page renders or the
// order it renders in. Sections still appear exactly as SECTIONS declares
// them; they just no longer each get their own top-level menu entry.
//
//   id        React key
//   label     what the menu shows
//   sections  every section id this group covers, so the scroll-spy can light
//             the right entry no matter which section is on screen.
//
//             Every group is now contiguous in page order. It was not:
//             `decisions` belonged with the stack and the diagrams but sat
//             after `media`, so scrolling forward lit Demo and then jumped
//             *back* to Tech & Architecture. Technical Decisions moved above
//             the screenshots, which fixes the scroll-spy and reads better
//             anyway — the trade-offs belong with the architecture, not after
//             the demo. Keep it that way: a group that is not contiguous makes
//             the only wayfinding device on a long page misreport position.
//   target    where clicking scrolls to. Listed as an ordered preference: the
//             first one that this project actually rendered wins, so a group
//             stays useful when its headline section is missing.
//   anchor    an element id outside the section list to scroll to instead —
//             used by Workspace, which lands on the page header above the
//             first section rather than on a section of its own.
//
// A group whose sections are all absent from a project drops out of the menu.
export const NAV_GROUPS = [
  {
    // The top of the page and the person who built it. Its anchor is the page
    // header rather than a section, so the first tab lands on the title, the
    // member row and the workspace block above everything else — there is no
    // separate Workspace entry any more, because "the top of the page" is not
    // a destination a reader thinks of as distinct from "the overview".
    id: 'overview',
    label: 'Overview',
    sections: ['links', 'role'],
    anchor: 'project-top',
  },
  {
    // Everything about making the thing, opening with the problem it was made
    // for. "Tech & Architecture" named the parts; "Build" names the act, which
    // is what the six sections under it are actually about.
    id: 'build',
    label: 'Build',
    sections: ['context', 'stack', 'architecture', 'steps', 'recovery', 'decisions'],
    target: ['context', 'stack', 'architecture', 'steps', 'recovery', 'decisions'],
  },
  {
    // What came of it: the numbers, what they cost, and the recording that
    // shows them happening. The metrics and the demo were two entries for one
    // idea — evidence — and splitting them made the menu longer without making
    // the page easier to navigate.
    id: 'result',
    label: 'Result',
    sections: ['impact', 'cost', 'media'],
    target: ['impact', 'cost', 'media'],
  },
  {
    id: 'resources',
    label: 'Resources',
    sections: ['source'],
    target: ['source'],
  },
  {
    id: 'reflection',
    label: 'Reflection',
    sections: ['reflection'],
    target: ['reflection'],
  },
]

// Narrows the groups to the ones this project actually has sections for, and
// resolves each one's scroll target to a section that exists on the page.
export function navGroupsFor(sections) {
  const present = new Set(sections.map((section) => section.id))

  return NAV_GROUPS.filter(
    (group) => group.anchor || group.sections.some((id) => present.has(id))
  ).map((group) => ({
    ...group,
    targetId: group.anchor ?? group.target?.find((id) => present.has(id)),
  }))
}

// section id -> group id, so the scroll-spy can map whatever is in view back
// to the menu entry that covers it.
export function groupIdForSection(sectionId) {
  return NAV_GROUPS.find((group) => group.sections.includes(sectionId))?.id
}
