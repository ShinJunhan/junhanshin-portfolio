import { useEffect, useLayoutEffect, useRef, useState, Children, useContext } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useInView } from 'framer-motion'
import SkillsHoneycomb from './SkillsHoneycomb.jsx'
import SoftSkills from './SoftSkills.jsx'
import ProjectsTicker from './ProjectsTicker.jsx'
import { BandReveal } from './bandReveal.js'

// How long the heading takes to pop in centred and then settle left, and
// how long the detail column waits before following it in.
const HEADING_DURATION = 1.45
// Sits just past the heading's settle so the two never occupy the same
// space — the heading has fully cleared the detail column before it fills.
const DETAIL_DELAY = HEADING_DURATION + 0.08
// The beat between one revealed child and the next. Named because a sibling
// that has to land on the same beat as a particular child offsets by it,
// and a bare 0.14 in two places would drift apart the first time it moved.
const STAGGER_STEP = 0.14

// Everything the About Me grid holds — contact details first, then the
// standing facts (education, languages, credential) that used to live in
// sections of their own.
const ABOUT_ITEMS = [
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
  {
    label: 'Education',
    text: 'B.S., Information and Statistics',
    // Broken explicitly rather than left to wrap: the degree, the school,
    // and the place each get their own line at every width.
    meta: ['Chungnam National University', 'Daejeon, South Korea'],
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 4L2 9l10 5 10-5-10-5z" />
        <path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />
      </svg>
    ),
  },
  {
    label: 'Certification',
    text: 'AWS Certified Solutions Architect – Associate',
    meta: 'Amazon Web Services',
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 14.5L7 22l5-2.5L17 22l-1.5-7.5" />
      </svg>
    ),
  },
  {
    label: 'Languages',
    // Three lines carrying equal weight — no language is presented as the
    // headline with the others as footnotes. Each is short enough to hold
    // one line at every card width.
    lines: [
      { name: 'English', qualifier: 'Fluent' },
      { name: 'Korean', qualifier: 'Native' },
      { name: 'Japanese', qualifier: 'Intermediate' },
    ],
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.8 2.7 2.8 15.3 0 18M12 3c-2.8 2.7-2.8 15.3 0 18" />
      </svg>
    ),
  },
]

// Where the credentials are heading: one held, one underway, three ahead.
const CERT_TRACK = [
  { label: 'AWS Certified Solutions Architect – Associate', note: 'Done', state: 'done' },
  { label: 'HashiCorp Certified: Terraform Associate', note: 'In progress', state: 'active' },
  { label: 'Certified Kubernetes Administrator (CKA)', note: 'Planned', state: 'planned' },
  { label: 'AWS Certified SysOps Administrator – Associate', note: 'Planned', state: 'planned' },
  { label: 'AWS Certified Solutions Architect – Professional', note: 'Long-term', state: 'planned' },
]

// How long each credential holds the ticker before the next one takes over.
const TICKER_MS = 2600

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

// Pentagon — the same five-sided shape the soft-skills radar is drawn on.
const SOFT_ICON = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2.5l9.5 6.9-3.6 11.1H6.1L2.5 9.4 12 2.5z" />
  </svg>
)

// The two views the Skills section holds. Each keeps the accent it carried
// when it was a section of its own, so switching still reads as moving
// between two distinct things rather than reskinning one.
const SKILL_VIEWS = [
  { id: 'technical', label: 'Technical Skills', accent: 'var(--c-emerald)', icon: SKILLS_ICON },
  { id: 'soft', label: 'Soft Skills', accent: 'var(--c-indigo)', icon: SOFT_ICON },
]

// The switch lands first and the view it governs follows, rather than the
// two arriving on top of each other.
const SWITCH_LEAD = 0.18

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
            staggerChildren: reduceMotion ? 0 : STAGGER_STEP,
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
    <section ref={ref} id={id} className="band" style={{ background: bandBg }}>
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
      {item.lines ? (
        item.lines.map((line) => (
          <span key={line.name} className="info-card__value">
            {line.name}
            <span className="info-card__qualifier"> — {line.qualifier}</span>
          </span>
        ))
      ) : (
        <span className="info-card__value">{item.text}</span>
      )}
      {item.meta && (
        <span className="info-card__meta">
          {[].concat(item.meta).map((line) => (
            <span key={line} className="info-card__meta-line">
              {line}
            </span>
          ))}
        </span>
      )}
    </Tag>
  )
}

function CertStep({ step }) {
  return (
    <div className={`cert-step cert-step--${step.state}`}>
      <span className="cert-step__dot" aria-hidden="true" />
      <span className="cert-step__label">{step.label}</span>
      <span className="cert-step__note">{step.note}</span>
    </div>
  )
}

// One credential at a time, cycling — what's held, what's underway, what's
// queued behind it. Pauses while the pointer or keyboard focus is on it, so
// a long name can be read at the reader's own pace rather than the timer's.
function CertRoadmap() {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [held, setHeld] = useState(false)

  useEffect(() => {
    if (reduceMotion || held) return
    const id = setInterval(() => setIndex((i) => (i + 1) % CERT_TRACK.length), TICKER_MS)
    return () => clearInterval(id)
  }, [reduceMotion, held])

  // Anyone who has asked for less motion gets the whole list at once rather
  // than a thing that moves on its own.
  if (reduceMotion) {
    return (
      <section className="cert-roadmap" aria-labelledby="cert-roadmap-title">
        <h3 className="cert-roadmap__title" id="cert-roadmap-title">
          Certification roadmap
        </h3>
        <div className="cert-list">
          {CERT_TRACK.map((step) => (
            <CertStep key={step.label} step={step} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="cert-roadmap" aria-labelledby="cert-roadmap-title">
      <h3 className="cert-roadmap__title" id="cert-roadmap-title">
        Certification roadmap
      </h3>

      <div
        className="cert-ticker"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocusCapture={() => setHeld(true)}
        onBlurCapture={() => setHeld(false)}
      >
        {/* Every entry occupies the same grid cell, so the stage is as tall
            as the longest of them and never resizes mid-cycle. The one on
            show is opaque; the rest wait just below it. */}
        <div className="cert-ticker__stage" aria-hidden="true">
          {CERT_TRACK.map((step, i) => (
            <motion.div
              key={step.label}
              className="cert-ticker__slide"
              initial={false}
              animate={{ opacity: i === index ? 1 : 0, y: i === index ? 0 : 12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ pointerEvents: i === index ? 'auto' : 'none' }}
            >
              <CertStep step={step} />
            </motion.div>
          ))}
        </div>

        <div className="cert-ticker__pips" aria-hidden="true">
          {CERT_TRACK.map((step, i) => (
            <span key={step.label} className={`cert-ticker__pip${i === index ? ' cert-ticker__pip--on' : ''}`} />
          ))}
        </div>
      </div>

      {/* The ticker only ever shows one entry, so the full sequence is kept
          here for anything reading the page rather than watching it. */}
      <ol className="sr-only">
        {CERT_TRACK.map((step) => (
          <li key={step.label}>
            {step.label} — {step.note}
          </li>
        ))}
      </ol>
    </section>
  )
}

// A segmented pill, deliberately unlike the underlined category tabs inside
// the technical view — the two controls sit within a screen of each other,
// and matching them would read as one long row of tabs at one level.
function SkillsSwitch({ value, onChange }) {
  const reduceMotion = useReducedMotion()

  // Roving tabindex: the strip is a single tab stop, and the arrows move
  // between the views, which is how a tablist is expected to behave.
  function onKeyDown(e) {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const i = SKILL_VIEWS.findIndex((v) => v.id === value)
    const next = SKILL_VIEWS[(i + dir + SKILL_VIEWS.length) % SKILL_VIEWS.length]
    onChange(next.id)
    document.getElementById(`skills-tab-${next.id}`)?.focus()
  }

  return (
    <div className="skills-switch" role="tablist" aria-label="Skills view" onKeyDown={onKeyDown}>
      {SKILL_VIEWS.map((v) => {
        const on = v.id === value
        return (
          <button
            key={v.id}
            id={`skills-tab-${v.id}`}
            type="button"
            role="tab"
            aria-selected={on}
            aria-controls="skills-panel"
            tabIndex={on ? 0 : -1}
            className={`skills-switch__tab${on ? ' skills-switch__tab--on' : ''}`}
            style={{ '--switch-accent': v.accent }}
            onClick={() => onChange(v.id)}
          >
            {/* One element shared between the two tabs, so it slides across
                rather than fading out on one and in on the other. */}
            {on && (
              <motion.span
                className="skills-switch__thumb"
                layoutId="skills-switch-thumb"
                aria-hidden="true"
                transition={
                  reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 460, damping: 38 }
                }
              />
            )}
            {/* The shape each view is actually drawn on — hexagon for the
                honeycomb, pentagon for the radar. */}
            <span className="skills-switch__glyph" aria-hidden="true">{v.icon}</span>
            <span className="skills-switch__label">{v.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// Holds the two skill views under one heading. Neither view is touched —
// each is mounted exactly as it was when it owned a section of its own; all
// this adds is which one is on show and when it starts.
function SkillsSection() {
  const reduceMotion = useReducedMotion()
  const inView = useContext(BandReveal)
  const [view, setView] = useState(SKILL_VIEWS[0].id)
  // The first view rides the band's reveal, so it still waits for the
  // heading to settle. Anything opened after that is a direct answer to a
  // click, and replaying that wait would just read as a dead panel.
  const [switched, setSwitched] = useState(false)
  const viewDelay = switched ? 0 : DETAIL_DELAY + SWITCH_LEAD

  function pick(id) {
    setSwitched(true)
    setView(id)
  }

  return (
    <div className="skills-stack">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: reduceMotion ? 0 : 0.4,
          delay: reduceMotion ? 0 : DETAIL_DELAY,
          ease: 'easeOut',
        }}
      >
        <SkillsSwitch value={view} onChange={pick} />
      </motion.div>

      {/* Swapped rather than hidden: only the chosen view is ever mounted,
          and it plays its own entrance on the way in. */}
      <div
        className="skills-view"
        id="skills-panel"
        role="tabpanel"
        aria-labelledby={`skills-tab-${view}`}
      >
        {view === 'technical' ? (
          <SkillsHoneycomb baseDelay={viewDelay} />
        ) : (
          <SoftSkills baseDelay={viewDelay} />
        )}
      </div>
    </div>
  )
}

export default function Timeline() {
  return (
    <>
      <Band id="about" heading="About Me" icon={PERSON_ICON} accent="var(--c-coral)" alt>
        <Stagger className="info-grid">
          {ABOUT_ITEMS.map((item) => (
            <InfoCard key={item.text} item={item} />
          ))}
        </Stagger>
        {/* Follows the cards in rather than sitting there while they land. */}
        <Stagger delay={DETAIL_DELAY + ABOUT_ITEMS.length * STAGGER_STEP}>
          <CertRoadmap />
        </Stagger>
      </Band>

      <Band id="projects" heading="Projects" icon={PROJECTS_ICON} accent="var(--c-orange)" alt={false}>
        <div className="projects-row">
          <Stagger>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
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
          {/* Same trigger and same enter as the sentence beside it, offset
              by one beat to match that sentence's place in the stagger — so
              the titles and the line they belong to land together, rather
              than the list simply being there already. */}
          <Stagger delay={DETAIL_DELAY + STAGGER_STEP}>
            <ProjectsTicker />
          </Stagger>
        </div>
      </Band>

      <Band id="skills" heading="Skills" icon={SKILLS_ICON} accent="var(--c-emerald)" alt>
        <SkillsSection />
      </Band>
    </>
  )
}
