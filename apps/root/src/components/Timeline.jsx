import { useEffect, useLayoutEffect, useRef, useState, Children, useContext } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useInView } from 'framer-motion'
import SkillsCarousel from './SkillsCarousel.jsx'
import ProjectsTicker from './ProjectsTicker.jsx'
import { BandReveal } from './bandReveal.js'

// How long the heading takes to pop in centred and then settle left, and
// how long the detail column waits before following it in.
const HEADING_DURATION = 1.45
// Sits just past the heading's settle so the two never occupy the same
// space — the heading has fully cleared the detail column before it fills.
const DETAIL_DELAY = HEADING_DURATION + 0.08

const CONTACT_ITEMS = [
  {
    label: 'Location',
    text: 'Methuen, MA',
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: 'Phone',
    // TODO: swap in the real phone number
    text: '999-999-999',
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2C9.5 22 2 14.5 2 6a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    text: 'junhanshin17@gmail.com',
    href: 'mailto:junhanshin17@gmail.com',
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

// Stacked layers — represents a body of completed work.
const PROJECTS_ICON = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
)

// Hexagon — echoes the honeycomb shape used throughout the skill cards below.
const SKILLS_ICON = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2l8.66 5v10L12 22l-8.66-5V7z" />
  </svg>
)

// Badge/ribbon — same shape already used inline next to the AWS SAA line,
// reused here so the heading icon and the credential icon read as one motif.
const CERT_ICON = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="9" r="6" />
    <path d="M8.5 14.5L7 22l5-2.5L17 22l-1.5-7.5" />
  </svg>
)

// Rendered as cards in the same grid as the About Me details.
const CERTIFICATIONS = [
  {
    label: 'Cloud',
    text: 'AWS Certified Solutions Architect – Associate',
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 14.5L7 22l5-2.5L17 22l-1.5-7.5" />
      </svg>
    ),
  },
]

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
function Rail({ accent, bandBg, dotTop = '50%' }) {
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
          top: dotTop,
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
      className="section-heading"
      initial={reduceMotion ? resting : waiting}
      animate={animate}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: HEADING_DURATION, times: [0, 0.34, 1], ease: ['easeOut', 'easeInOut'] }
      }
    >
      <span style={{ color: accent, display: 'inline-flex' }}>{icon}</span>
      {children}
    </motion.h2>
  )
}

// Reveals its children one after another once the heading has settled,
// rather than dropping the whole block in at once.
function Stagger({ children, delay = DETAIL_DELAY, className }) {
  const reduceMotion = useReducedMotion()
  const inView = useContext(BandReveal)
  return (
    <motion.div
      className={className}
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

function Band({ id, heading, icon, accent, alt, children }) {
  const bandBg = alt ? 'var(--bg-alt)' : 'var(--bg)'
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  // Distance from the heading's resting centre to the centre of the band, so
  // it can pop in centred and then settle back to the upper left. Measured
  // rather than assumed: headings differ enough in width that a fixed share
  // would overshoot or undershoot.
  const bodyRef = useRef(null)
  const headingRef = useRef(null)
  const [centerShift, setCenterShift] = useState(0)
  const [dotTop, setDotTop] = useState('50%')

  useLayoutEffect(() => {
    function measure() {
      const body = bodyRef.current
      const head = headingRef.current
      const section = ref.current
      if (!body || !head || !section) return
      const b = body.getBoundingClientRect()
      const h = head.getBoundingClientRect()
      setCenterShift(b.width / 2 - (h.left - b.left + h.width / 2))
      // Dot rides level with the heading rather than the band's midpoint.
      const s = section.getBoundingClientRect()
      setDotTop(`${((h.top - s.top + h.height / 2) / s.height) * 100}%`)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [heading])

  return (
    <section ref={ref} id={id} className="band snap-section" style={{ background: bandBg }}>
      <div className="band__inner">
        <Rail accent={accent} bandBg={bandBg} dotTop={dotTop} />
        <div className="band__body" ref={bodyRef}>
          <BandReveal.Provider value={inView}>
            <div ref={headingRef} style={{ alignSelf: 'flex-start' }}>
              <SectionHeading icon={icon} accent={accent} centerShift={centerShift}>
                {heading}
              </SectionHeading>
            </div>
            {children}
          </BandReveal.Provider>
        </div>
      </div>
    </section>
  )
}

// Each contact detail gets its own card rather than sitting in a plain list.
function InfoCard({ item, accent = 'var(--c-coral)' }) {
  const Tag = item.href ? 'a' : 'div'
  return (
    <Tag
      className="info-card"
      style={{ '--info-accent': accent }}
      {...(item.href ? { href: item.href } : {})}
    >
      <span className="info-card__icon">{item.icon}</span>
      <span className="info-card__label">{item.label}</span>
      <span className="info-card__value">{item.text}</span>
    </Tag>
  )
}

export default function Timeline() {
  return (
    <>
      <Band id="about" heading="About Me" icon={PERSON_ICON} accent="var(--c-coral)" alt={false}>
        <Stagger className="info-grid">
          {CONTACT_ITEMS.map((item) => (
            <InfoCard key={item.text} item={item} />
          ))}
        </Stagger>
      </Band>

      <Band id="projects" heading="Projects" icon={PROJECTS_ICON} accent="var(--c-orange)" alt>
        <div className="projects-row">
          <Stagger>
            <p style={{
              fontFamily: 'var(--font-header)',
              fontWeight: 800,
              fontSize: 'clamp(5rem, 3rem + 9vw, 11rem)',
              letterSpacing: '-0.04em',
              color: 'var(--c-orange)',
              margin: '0 0 0.2rem',
              lineHeight: 0.9,
            }}>
              7
            </p>
            <p style={{ fontSize: 'var(--body-size)', color: 'var(--text-primary)', margin: 0 }}>
              completed cloud infrastructure projects
              <span style={{ display: 'block' }}>(3 individual + 4 team)</span>
            </p>
          </Stagger>
          <ProjectsTicker />
        </div>
      </Band>

      <Band id="skills" heading="Skills" icon={SKILLS_ICON} accent="var(--c-emerald)" alt={false}>
        <SkillsCarousel baseDelay={DETAIL_DELAY} className="carousel--bleed" />
      </Band>

      <Band id="certifications" heading="Certifications" icon={CERT_ICON} accent="var(--c-forest)" alt>
        <Stagger className="info-grid info-grid--cert">
          {CERTIFICATIONS.map((c) => (
            <InfoCard key={c.text} item={c} accent="var(--c-forest)" />
          ))}
        </Stagger>
      </Band>
    </>
  )
}
