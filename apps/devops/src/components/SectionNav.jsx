import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { navGroupsFor, groupIdForSection } from '../data/navGroups.js'
import { labelOf } from '../data/sections.jsx'
import { ChevronDownIcon } from './icons.jsx'

// The sticky in-page menu. It shows five grouped entries rather than one per
// section — the groups come from navGroups.js, which is a layer over the same
// section list the page renders, so the two can still never disagree about
// what exists.
//
// Each entry that covers more than one section also drops a menu listing them,
// because five entries stopped being enough wayfinding once the pages grew to
// thirteen sections: the bar could say which quarter of the page you were in
// and nothing more. The menu is additive — the entry itself still scrolls to
// its group exactly as before, so nothing a reader already knows how to do
// changed.
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

// How long the menu stays open after the pointer leaves. The gap it has to
// survive is the 1px seam between the bar and the panel plus whatever
// diagonal the pointer cuts across a neighbouring entry on the way down; a
// panel that closes on that journey cannot be reached at all.
const CLOSE_GRACE_MS = 140

export default function SectionNav({ sections, project }) {
  const groups = navGroupsFor(sections)
  const [activeId, setActiveId] = useState(groups[0]?.id)
  // The section the reader is actually in, not just the group. The bar itself
  // only ever needed the group; the menu marks the one section they are on
  // and dims the ones they have already passed, which needs the finer answer.
  const [currentId, setCurrentId] = useState(sections[0]?.id)
  const [openId, setOpenId] = useState(null)
  const [flipped, setFlipped] = useState(false)
  const navRef = useRef(null)
  const barRef = useRef(null)
  const closeTimer = useRef(null)

  useEffect(() => {
    setActiveId(navGroupsFor(sections)[0]?.id)
    setCurrentId(sections[0]?.id)
    setOpenId(null)
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
          const sectionId = visible[0]?.target.id
          const groupId = sectionId && groupIdForSection(sectionId)
          if (sectionId) setCurrentId(sectionId)
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

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  // A menu anchored to an entry near the right edge would open off screen, so
  // it hangs from its right edge instead. Measured rather than assumed from
  // the entry's index: which entries exist, and how wide they are, depends on
  // the project and on the viewport.
  useLayoutEffect(() => {
    if (!openId) {
      setFlipped(false)
      return
    }
    const menu = navRef.current?.querySelector(
      `[data-group="${openId}"] .section-nav__menu`
    )
    if (!menu) return
    setFlipped(menu.getBoundingClientRect().right > window.innerWidth - 12)
  }, [openId])

  function open(id) {
    clearTimeout(closeTimer.current)
    setOpenId(id)
  }

  function closeSoon() {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenId(null), CLOSE_GRACE_MS)
  }

  function goTo(id) {
    // `scroll-margin-top` on the section clears the sticky bar, so this lands
    // the heading just below it rather than underneath.
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpenId(null)
  }

  // Position in the page, used to tell a section the reader has passed from
  // one still ahead of them.
  const readerAt = sections.findIndex((section) => section.id === currentId)

  return (
    <div
      className="section-nav"
      ref={navRef}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpenId(null)
      }}
    >
      <div className="section-nav__bar" ref={barRef}>
        {groups.map((group) => {
          const menued = group.items.length > 1
          const isOpen = menued && group.id === openId

          return (
            <div
              key={group.id}
              className="section-nav__group"
              data-group={group.id}
              data-open={isOpen}
              data-align={isOpen && flipped ? 'right' : 'left'}
              onMouseEnter={() => open(group.id)}
              onMouseLeave={closeSoon}
              // Focus opens the same menu hover does, so the sections are
              // reachable by keyboard: tab to the entry, tab on into its list.
              onFocus={() => open(group.id)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) closeSoon()
              }}
            >
              <button
                type="button"
                data-active={group.id === activeId}
                className={`section-nav__item${group.id === activeId ? ' section-nav__item--on' : ''}`}
                aria-haspopup={menued ? 'true' : undefined}
                aria-expanded={menued ? isOpen : undefined}
                onClick={() => goTo(group.targetId)}
              >
                {group.label}
                {menued && (
                  <span className="section-nav__caret">
                    <ChevronDownIcon />
                  </span>
                )}
              </button>

              {menued && (
                <div className="section-nav__menu" role="menu" aria-label={group.label}>
                  <p className="section-nav__menu-head">{group.label}</p>
                  {/* The list is its own box so the rail can be measured
                      against the items rather than against the panel, which
                      would put its ends wherever the heading happened to
                      leave them. */}
                  <div className="section-nav__menu-list">
                    <span className="section-nav__rail" aria-hidden="true" />
                    {group.items.map((section) => (
                      <button
                        key={section.id}
                        type="button"
                        role="menuitem"
                        className="section-nav__menu-item"
                        data-current={section.id === currentId}
                        data-read={sections.indexOf(section) < readerAt}
                        onClick={() => goTo(section.id)}
                      >
                        <span className="section-nav__dot" aria-hidden="true" />
                        <span>{labelOf(section, project)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
