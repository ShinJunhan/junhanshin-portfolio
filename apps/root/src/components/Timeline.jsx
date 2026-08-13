import { useEffect, useLayoutEffect, useRef, useState, Children, useContext } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useInView } from 'framer-motion'
import SkillsCarousel from './SkillsCarousel.jsx'
import { BandReveal } from './bandReveal.js'

// How long the heading takes to pop in centred and then settle left, and
// how long the detail column waits before following it in.
const HEADING_DURATION = 1.45
// Sits just past the heading's settle so the two never occupy the same
// space — the heading has fully cleared the detail column before it fills.
const DETAIL_DELAY = HEADING_DURATION + 0.08

const CONTACT_ITEMS = [
  {
    text: 'Methuen, MA',
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    // TODO: swap in the real phone number
    text: '999-999-999',
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2C9.5 22 2 14.5 2 6a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    text: 'junhanshin17@gmail.com',
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M4 6.5l8 6.5 8-6.5" />
      </svg>
    ),
  },
]

const PERSON_ICON = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
)

// Below this width the columns stack, so the heading has no left column to
// slide back to — it just pops in place instead.
function useIsNarrow() {
  const query = '(max-width: 760px)'
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e) => setNarrow(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return narrow
}

// The rail runs alongside the headings only — the detail column sits to its
// right, so the line reads as threading the section titles together. Its
// fill tracks scroll position directly (useScroll) rather than playing a
// timed tween, so it never advances while the reader is sitting still.
function Rail({ accent, bandBg }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{ position: 'relative', width: '2px', alignSelf: 'stretch', background: 'var(--border)', flexShrink: 0 }}
    >
      <motion.div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: fill, background: accent }} />
      <span
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: bandBg,
          border: `3px solid ${accent}`,
        }}
      />
    </div>
  )
}

// Arrives large and centred over the row, holds a beat, then scales down
// and slides into its resting place in the left column. The travel is a
// measured pixel distance (see Band) rather than a share of the heading's
// own width — headings differ a lot in width, and a fixed share either
// undershoots the centre or overshoots off the right edge.
function SectionHeading({ children, icon, accent, centerShift }) {
  const reduceMotion = useReducedMotion()
  const narrow = useIsNarrow()
  const inView = useContext(BandReveal)

  const popScale = narrow ? 1.18 : 1.42
  const resting = { opacity: 1, scale: 1, x: 0 }
  const waiting = { opacity: 0, scale: popScale, x: centerShift }

  let animate = waiting
  if (reduceMotion) animate = resting
  else if (inView) {
    animate = {
      opacity: [0, 1, 1],
      scale: [popScale, popScale, 1],
      x: [centerShift, centerShift, 0],
    }
  }

  return (
    <motion.h2
      initial={reduceMotion ? resting : waiting}
      animate={animate}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: HEADING_DURATION, times: [0, 0.34, 1], ease: ['easeOut', 'easeInOut'] }
      }
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: 'var(--font-header)',
        fontWeight: 800,
        fontSize: 'var(--h1-size)',
        lineHeight: 1.15,
        color: accent,
        textShadow: 'var(--heading-shadow)',
        margin: 0,
      }}
    >
      {icon}
      {children}
    </motion.h2>
  )
}

// Reveals its children one after another once the heading has settled,
// rather than dropping the whole block in at once.
function Stagger({ children, delay = DETAIL_DELAY }) {
  const reduceMotion = useReducedMotion()
  const inView = useContext(BandReveal)
  return (
    <motion.div
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: reduceMotion ? 0 : delay,
            staggerChildren: reduceMotion ? 0 : 0.14,
          },
        },
      }}
    >
      {Children.map(children, (child) => (
        <motion.div
          variants={{
            hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : 0.97 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: reduceMotion ? 0 : 0.45, ease: 'easeOut' },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

function Band({ heading, icon, accent, alt, wide = false, children }) {
  const bandBg = alt ? 'var(--bg-alt)' : 'var(--bg)'
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })

  // Distance from the heading's resting centre to the centre of the row.
  // When the columns stack on narrow screens the heading already spans the
  // row, so this measures to ~0 and the heading simply pops in place.
  const contentRef = useRef(null)
  const headingRef = useRef(null)
  const [centerShift, setCenterShift] = useState(0)

  useLayoutEffect(() => {
    function measure() {
      const content = contentRef.current
      const headingCol = headingRef.current
      if (!content || !headingCol) return
      const c = content.getBoundingClientRect()
      const h = headingCol.getBoundingClientRect()
      setCenterShift(c.width / 2 - (h.left - c.left + h.width / 2))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <section ref={ref} className="band snap-section" style={{ background: bandBg }}>
      <div className="band__inner">
        <div className={`section-row${wide ? ' section-row--wide' : ''}`}>
          <Rail accent={accent} bandBg={bandBg} />
          <div className="section-row__content" ref={contentRef}>
            <div className="section-row__heading" ref={headingRef}>
              <BandReveal.Provider value={inView}>
                <SectionHeading icon={icon} accent={accent} centerShift={centerShift}>
                  {heading}
                </SectionHeading>
              </BandReveal.Provider>
            </div>
            <div className="section-row__body">
              <BandReveal.Provider value={inView}>{children}</BandReveal.Provider>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactRow({ item }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        marginBottom: '0.9rem',
        color: 'var(--text-primary)',
        fontSize: 'var(--body-size)',
      }}
    >
      <span style={{ color: 'var(--c-coral)', display: 'flex', fontSize: '1.3rem' }}>{item.icon}</span>
      {item.text}
    </div>
  )
}

export default function Timeline() {
  return (
    <>
      <Band heading="About Me" icon={PERSON_ICON} accent="var(--c-coral)" alt={false}>
        <Stagger>
          {CONTACT_ITEMS.map((item) => (
            <ContactRow key={item.text} item={item} />
          ))}
        </Stagger>
      </Band>

      <Band heading="Projects" accent="var(--c-orange)" alt>
        <Stagger>
          <p style={{
            fontFamily: 'var(--font-header)',
            fontWeight: 800,
            fontSize: 'clamp(2.75rem, 1.8rem + 4vw, 4.5rem)',
            color: 'var(--c-orange)',
            textShadow: 'var(--heading-shadow)',
            margin: '0 0 0.4rem',
            lineHeight: 1,
          }}>
            7
          </p>
          <p style={{ fontSize: 'var(--body-size)', color: 'var(--text-primary)', margin: 0, maxWidth: '34ch' }}>
            completed cloud infrastructure projects (3 individual + 4 team)
          </p>
        </Stagger>
      </Band>

      <Band heading="Skills" accent="var(--c-emerald)" alt={false} wide>
        <SkillsCarousel baseDelay={DETAIL_DELAY} />
      </Band>

      <Band heading="Certifications" accent="var(--c-forest)" alt>
        <Stagger>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--c-forest)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="9" r="6" />
              <path d="M8.5 14.5L7 22l5-2.5L17 22l-1.5-7.5" />
            </svg>
            <p style={{ fontSize: 'var(--body-size)', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
              AWS Certified Solutions Architect – Associate
            </p>
          </div>
        </Stagger>
      </Band>
    </>
  )
}
