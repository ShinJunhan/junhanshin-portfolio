// The visible "nothing here yet" state for sections that always render even
// when their data is missing — the architecture diagram, the screenshots and
// demo video, and the README. Those three are easy to forget while filling a
// project out, so the slot stays on the page (and in the anchor nav) as a
// standing reminder of where the content goes.
//
// Sections whose absence is meaningful rather than pending — a solo project
// has no Members — drop out entirely instead of rendering this.
export default function EmptySlot({ children }) {
  return <p className="empty-slot">{children}</p>
}
