import { useCallback, useEffect, useRef, useState } from 'react'
import { SlidesIcon } from '../icons.jsx'

// The presentation deck, as a tab in the Resources panel rather than as a
// place to go and get a file. It is evidence on this page like the README and
// the Terraform beside it, so it reads the same way they do: one scrolling
// column, and nothing on the tab offers the deck as a download.
//
// The speaker notes are the reason this is not just a list of images. They are
// what was actually said over each slide, so they open as a panel beside the
// column and follow whichever slide the reader is looking at — a second page
// of notes, or a note pinned under every image, would both have broken the
// pairing that makes them worth showing at all.
//
// Only ten of the seventy slides have notes, which is why each slide says so
// in its caption: without the tag the panel looks broken on the sixty that
// have nothing to show.

// How far above the frame's top edge a jumped-to slide lands. Flush against
// the edge read as a slide that had been cut off rather than one that had
// just arrived.
const JUMP_INSET = 12

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

// There is no text alternative for a slide anywhere in the manifest, and
// inventing one would be worse than saying plainly what the image is. The
// caption below carries the same words in ink, which is the honest version of
// the description for everyone.
function Slide({ slide, dimensions, registerItem }) {
  return (
    <li className="deck__slide" data-slide={slide.number} ref={registerItem}>
      <div className="deck__frame">
        <img
          src={slide.src}
          alt={`Slide ${slide.number}: ${slide.label}`}
          width={dimensions?.width}
          height={dimensions?.height}
          loading="lazy"
          decoding="async"
        />
      </div>
      <p className="deck__caption">
        <span className="deck__number">Slide {slide.number}</span>
        <span className="deck__label">{slide.label}</span>
        {slide.hasNotes && <span className="deck__tag">Notes</span>}
      </p>
    </li>
  )
}

function Notes({ slide }) {
  return (
    <aside className="deck__notes" aria-label="Speaker notes">
      <p className="deck__notes-head">
        <span className="deck__notes-slide">Slide {slide.number}</span>
        <span className="deck__notes-section">{slide.label}</span>
      </p>
      {slide.notes ? (
        <p className="deck__notes-body">{slide.notes}</p>
      ) : (
        <p className="deck__notes-empty">No speaker notes for this slide</p>
      )}
    </aside>
  )
}

// Returns the tab's parts — the line for the address bar, the toolbar that
// rides at the end of it, and the body that fills the pane — because the last
// two share state and BrowserPanel renders them in two different places. Null
// for a project with no deck.
//
// The scroll container is held in state rather than in a ref: the body is only
// mounted while its tab is the selected one, and the observer has to be set up
// when that happens, not when this section first renders.
export function useSlideDeck(deck) {
  const [scroller, setScroller] = useState(null)
  const [notesOpen, setNotesOpen] = useState(false)
  const [activeNumber, setActiveNumber] = useState(deck?.slides[0]?.number ?? 1)
  const itemsRef = useRef(new Map())

  // Keyed by slide number, and only ever written to. Detachment passes null
  // and says nothing about which slide it was, so there is nothing to remove;
  // a deck that unmounts and comes back re-registers every slide under the
  // same numbers, and the map dies with the component either way.
  //
  // It used to be emptied in the sync effect's cleanup, which meant that under
  // StrictMode's mount / unmount / remount the map was cleared after the refs
  // had attached and never refilled — leaving both this panel's sync and the
  // Jump to section control doing nothing at all in development.
  const registerItem = useCallback((element) => {
    if (element) itemsRef.current.set(Number(element.dataset.slide), element)
  }, [])

  // Whichever slide owns the top of the frame — the same rule the root site's
  // NavBar keeps for its sections: a line a fixed distance down the scroller,
  // and the last slide whose top has crossed it is the active one.
  //
  // This used to be an IntersectionObserver collapsed to the frame's centre
  // line, which handed the notes to slide N+1 while slide N still filled the
  // top half of the frame. The notes ran a slide ahead of what was being read,
  // which on a panel whose whole job is to pair the two is the one thing it
  // must not do.
  //
  // The line sits at JUMP_INSET, the same distance below the top edge that a
  // jumped-to slide lands at, and the switch therefore happens only once the
  // outgoing slide has left the frame entirely: the gap between two slides is
  // never smaller than 17px, so by the time N+1's top reaches the line at 12px
  // N's bottom is already above the top edge.
  //
  // Measured as `offsetTop - scrollTop` rather than off a bounding rect, which
  // is how `jumpTo` below places a slide. The two differ by the scroller's own
  // 1px border, and a jump landed a slide short of itself when the sync read
  // one and the scroll wrote the other: slide 30 came to rest 13.4px down
  // against a 12px line and the panel stayed on slide 29. Sharing the measure
  // makes a jump land on its own slide's notes by construction.
  useEffect(() => {
    if (!scroller) return undefined

    // Read off the DOM rather than the ref map: document order is deck order,
    // so "the last one to have crossed" needs no sort and no second source of
    // truth for what is on screen.
    const slides = [...scroller.querySelectorAll('.deck__slide')]
    const list = scroller.querySelector('.deck__list')
    const last = slides[slides.length - 1]

    // The last slides in a deck cannot reach the line on their own: the deck
    // runs out of scroll while they are still sitting in the lower half of the
    // frame, so the rule above hands the panel to whichever slide is stuck at
    // the top and the tail never gets a turn. On Lock-N-Lock that was slides
    // 70, 71 and 72 — the team's results, the reflections and the closing —
    // all with notes nobody could bring up.
    //
    // So the list is given exactly enough trailing space for the last slide to
    // come to rest on the line, which is the same distance a jump to it would
    // need. Measured rather than guessed: it depends on the frame's height and
    // on the last slide's own, and both move with the panel's width.
    function fitTail() {
      if (!list || !last) return
      list.style.setProperty('--deck-tail', '0px')
      // The last slide plus the list's own bottom padding — what already sits
      // below its top edge without any tail.
      const belowLastTop = scroller.scrollHeight - last.offsetTop
      // Nothing to do for a deck that fits its frame: there is no scrolling to
      // run out of, and growing a list that is not overflowing would resize
      // the scroller and set the observer below off against itself.
      const overflows = scroller.scrollHeight > scroller.clientHeight
      const tail = overflows ? Math.max(scroller.clientHeight - belowLastTop - JUMP_INSET, 0) : 0
      list.style.setProperty('--deck-tail', `${tail}px`)
    }

    function onScroll() {
      // Defaults to the first slide, like NavBar's does. Above the first
      // slide's top nothing has crossed the line, and the slide at the top of
      // the deck is the honest answer there — leaving the last match standing
      // instead would keep slide 69's notes up after a scroll back to the top.
      let current = slides[0]
      for (const element of slides) {
        if (element.offsetTop - scroller.scrollTop <= JUMP_INSET) current = element
      }
      if (current) setActiveNumber(Number(current.dataset.slide))
    }

    // Both the frame's height and the slides' rest on the panel's width, which
    // moves when the notes open, when the sidebar collapses and on any resize.
    const observer = new ResizeObserver(() => {
      fitTail()
      onScroll()
    })
    observer.observe(scroller)

    fitTail()
    onScroll()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      scroller.removeEventListener('scroll', onScroll)
    }
  }, [scroller])

  const jumpTo = useCallback(
    (number) => {
      const element = itemsRef.current.get(number)
      if (!scroller || !element) return
      // `offsetTop` is measured against the scroller, which is the nearest
      // positioned ancestor. Scrolling it directly rather than through
      // `scrollIntoView` keeps the gesture inside the frame — the page itself
      // should not move because someone picked a section.
      scroller.scrollTo({
        top: Math.max(element.offsetTop - JUMP_INSET, 0),
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
    },
    [scroller]
  )

  if (!deck) return null

  const active = deck.slides.find((slide) => slide.number === activeNumber) ?? deck.slides[0]
  // The covers belong to no section, so on those the picker sits on its own
  // label rather than claiming a part of the talk the reader has not reached.
  const activeSection = deck.sections.some((section) => section.id === active.section)
    ? active.section
    : ''

  const aside = (
    <span className="deck__bar">
      <span className="deck__jump">
        <span className="deck__jump-icon" aria-hidden="true">
          <SlidesIcon />
        </span>
        <select
          className="deck__select"
          aria-label="Jump to section"
          value={activeSection}
          onChange={(event) => {
            const section = deck.sections.find((entry) => entry.id === event.target.value)
            if (section) jumpTo(section.slideStart)
          }}
        >
          <option value="" disabled>
            Jump to section
          </option>
          {deck.sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.num} · {section.title}
            </option>
          ))}
        </select>
      </span>
      <button
        type="button"
        className={`deck__notes-toggle${notesOpen ? ' deck__notes-toggle--on' : ''}`}
        aria-pressed={notesOpen}
        onClick={() => setNotesOpen((open) => !open)}
      >
        Notes
      </button>
    </span>
  )

  // The outer element exists to be measured: whether the notes fit beside the
  // slides is a question about this card's width, not the window's — the same
  // window is wide or narrow here depending on the sidebar — so the stacking
  // rule is a container query and this is what it queries.
  const body = (
    <div className="deck">
      <div className="deck__stage">
        <div className="deck__scroll" ref={setScroller}>
          <ol className="deck__list">
            {deck.slides.map((slide) => (
              <Slide
                key={slide.number}
                slide={slide}
                dimensions={deck.imageDimensions}
                registerItem={registerItem}
              />
            ))}
          </ol>
        </div>
        {notesOpen && <Notes slide={active} />}
      </div>
    </div>
  )

  // The deck's own name, not a path: nothing on this tab is a file the reader
  // can open, and an address bar pointing at one would say otherwise.
  return { address: `${deck.deck} · ${deck.totalSlides} slides`, aside, body }
}
