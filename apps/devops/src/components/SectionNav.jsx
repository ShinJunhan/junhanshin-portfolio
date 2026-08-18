import { useEffect, useRef, useState } from 'react'
import { navGroupsFor, groupIdForSection } from '../data/navGroups.js'

// The sticky in-page menu. It shows five grouped entries rather than one per
// section — the groups come from navGroups.js, which is a layer over the same
// section list the page renders, so the two can still never disagree about
// what exists.
//
// These are buttons rather than `<a href="#role">`: the app routes on the
// hash, so writing a bare fragment into the URL would drop the reader back to
// the welcome state mid-scroll.

// How far down the viewport the bar comes to rest — its own height plus
// whatever sits above it, which is nothing on desktop and the mobile button
// strip below the breakpoint. Measured rather than restated as a number here:
// `rootMargin` takes only absolute lengths and percentages, so it can't read
// the custom properties that decide those heights.
function stickyOffset(nav) {
  if (!nav) return 0
  const restingTop = Number.parseFloat(getComputedStyle(nav).top) || 0
  return restingTop + nav.offsetHeight
}

export default function SectionNav({ sections }) {
  const groups = navGroupsFor(sections)
  const [activeId, setActiveId] = useState(groups[0]?.id)
  const navRef = useRef(null)
  const barRef = useRef(null)

  useEffect(() => {
    setActiveId(navGroupsFor(sections)[0]?.id)
  }, [sections])

  // Whichever section heading sits nearest under the sticky bar decides the
  // active entry — mapped up to the group that covers it. The bottom margin
  // keeps a short trailing section from winning just because it is fully on
  // screen.
  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean)
    if (targets.length === 0) return

    let observer

    // Crossing the mobile breakpoint changes where the bar rests, so the
    // observer is rebuilt with the new offset rather than left pointing at
    // the old one.
    function observe() {
      observer?.disconnect()
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          const groupId = visible[0] && groupIdForSection(visible[0].target.id)
          if (groupId) setActiveId(groupId)
        },
        {
          root: null,
          rootMargin: `${-(stickyOffset(navRef.current) + 8)}px 0px -55% 0px`,
          threshold: 0,
        }
      )
      targets.forEach((target) => observer.observe(target))
    }

    observe()
    window.addEventListener('resize', observe)
    return () => {
      window.removeEventListener('resize', observe)
      observer?.disconnect()
    }
  }, [sections])

  // Keep the active entry in view when the bar itself has to scroll sideways.
  useEffect(() => {
    const bar = barRef.current
    const chip = bar?.querySelector('[data-active="true"]')
    if (!bar || !chip) return
    const left = chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2
    bar.scrollTo({ left, behavior: 'smooth' })
  }, [activeId])

  function goTo(id) {
    // `scroll-margin-top` on the section clears the sticky bar, so this lands
    // the heading just below it rather than underneath.
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="section-nav" ref={navRef}>
      <div className="section-nav__bar" ref={barRef}>
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            data-active={group.id === activeId}
            className={`section-nav__item${group.id === activeId ? ' section-nav__item--on' : ''}`}
            onClick={() => goTo(group.targetId)}
          >
            {group.label}
          </button>
        ))}
      </div>
    </div>
  )
}
