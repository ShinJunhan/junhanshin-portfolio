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
          alt={`Slide ${slide.number} — ${slide.label}`}
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

  const registerItem = useCallback((element) => {
    // Detachment passes null and says nothing about which slide it was; the
    // map is emptied when the body unmounts instead, below.
    if (element) itemsRef.current.set(Number(element.dataset.slide), element)
  }, [])

  // Whichever slide the middle of the frame is over. The negative margins
  // collapse the observer's root to that centre line, so at most one slide is
  // intersecting at a time and the callback needs no comparison of its own.
  // While the line is in the gap between two slides nothing fires and the last
  // answer stands, which is also what a reader would say is on screen.
  useEffect(() => {
    if (!scroller) return undefined

    const items = itemsRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveNumber(Number(entry.target.dataset.slide))
        }
      },
      { root: scroller, rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    )

    for (const element of items.values()) observer.observe(element)
    return () => {
      observer.disconnect()
      items.clear()
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
