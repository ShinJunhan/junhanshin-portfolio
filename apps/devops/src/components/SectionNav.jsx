import { useEffect, useRef, useState } from 'react'

// The sticky in-page nav. It lists exactly the sections the page rendered —
// it is handed the same filtered list the page mapped over, so it can never
// point at a heading that isn't there.
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
  const [activeId, setActiveId] = useState(sections[0]?.id)
  const navRef = useRef(null)
  const barRef = useRef(null)

  useEffect(() => {
    setActiveId(sections[0]?.id)
  }, [sections])

  // Whichever section heading sits nearest under the sticky bar is the active
  // one. The bottom margin keeps a short trailing section from winning just
  // because it is fully on screen.
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
          if (visible[0]) setActiveId(visible[0].target.id)
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

  // Keep the active chip in view when the bar itself has to scroll sideways.
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
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            data-active={section.id === activeId}
            className={`section-nav__item${section.id === activeId ? ' section-nav__item--on' : ''}`}
            onClick={() => goTo(section.id)}
          >
            {section.navLabel ?? section.label}
          </button>
        ))}
      </div>
    </div>
  )
}
