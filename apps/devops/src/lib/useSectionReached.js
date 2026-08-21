import { useEffect, useState } from 'react'

// Fires the first time a named section reaches the viewport, so a component
// *elsewhere on the page* can react to it.
//
// It exists for one moment: Junhan's circle in Members lights up as My Role
// arrives on screen, which is what ties the two sections together — the same
// person, named once and then explained. Members sits above My Role and knows
// nothing about it, so the connection has to be made by something neither of
// them owns.
//
// Deliberately not a context: the two components are in different branches of
// the section list, and a provider around both would mean the section registry
// knowing which sections talk to each other. An element id is the thing they
// already share.
//
// **Once per page, and then never again.** An earlier version replayed on
// every pass and turned the page's one authored moment into a tic — something
// that fires on every scroll is ambient decoration, and the site's own rule is
// that a thing which pulses reads as ornament rather than as signal. Firing
// once buys the room to make it slow and deliberate instead of brief and
// repeated. The observer disconnects the moment it fires, so nothing is left
// watching the page for the rest of the visit.
export default function useSectionReached(id, { rootMargin = '-35% 0px -35% 0px' } = {}) {
  const [reached, setReached] = useState(false)

  useEffect(() => {
    if (reached) return
    const target = document.getElementById(id)
    if (!target) return

    // The margin pulls the trigger line into the middle of the viewport, so
    // the cue fires when the section is genuinely being read rather than when
    // its first pixel clears the bottom edge — at which point the reader is
    // still looking at Members and would see the glow happen off to the side
    // of wherever they are actually looking.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setReached(true)
        observer.disconnect()
      },
      { root: null, rootMargin, threshold: 0 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [id, rootMargin, reached])

  return reached
}
