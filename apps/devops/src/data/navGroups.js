// The sticky menu's five entries. This is a grouping *over* the section list
// in sections.jsx — it changes nothing about what the page renders or the
// order it renders in. Sections still appear exactly as SECTIONS declares
// them; they just no longer each get their own top-level menu entry.
//
//   id        React key
//   label     what the menu shows
//   sections  every section id this group covers, so the scroll-spy can light
//             the right entry no matter which section is on screen. Kept in
//             page order and contiguous, so the highlight only ever moves
//             forward as the reader scrolls down.
//   target    where clicking scrolls to. Listed as an ordered preference: the
//             first one that this project actually rendered wins, so a group
//             stays useful when its headline section is missing.
//
// A group whose sections are all absent from a project drops out of the menu.
export const NAV_GROUPS = [
  {
    id: 'overview',
    label: 'Overview',
    sections: ['members', 'role', 'context', 'impact'],
    target: ['role', 'context', 'members', 'impact'],
  },
  {
    id: 'tech',
    label: 'Tech & Architecture',
    sections: ['stack', 'architecture'],
    target: ['stack', 'architecture'],
  },
  {
    id: 'demo',
    label: 'Demo',
    sections: ['media'],
    target: ['media'],
  },
  {
    // `decisions` sits between the demo and the links in page order, so it
    // rides along here to keep the groups contiguous — the entry still points
    // at the links, per the menu's stated purpose.
    id: 'resources',
    label: 'Resources',
    sections: ['decisions', 'links', 'readme'],
    target: ['links', 'readme', 'decisions'],
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

  return NAV_GROUPS.filter((group) => group.sections.some((id) => present.has(id))).map((group) => ({
    ...group,
    targetId: group.target.find((id) => present.has(id)),
  }))
}

// section id -> group id, so the scroll-spy can map whatever is in view back
// to the menu entry that covers it.
export function groupIdForSection(sectionId) {
  return NAV_GROUPS.find((group) => group.sections.includes(sectionId))?.id
}
