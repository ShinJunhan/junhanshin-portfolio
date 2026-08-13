import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const START_DELAY = 500       // before sentence 1 appears
const HOLD = 1300             // each sentence's alone-time before the next mounts
const FADE_DURATION = 0.6     // seconds, each sentence's own cross-fade in
const LAYOUT_DURATION = 0.6   // seconds, the "push up" reflow animation
const HIGHLIGHT_DELAY_AFTER_MOUNT = 0.75 // seconds after a line mounts, before its own highlight sweeps
const HIGHLIGHT_DURATION = 0.35

const GREETING_DELAY = 1500       // ms after the headline finishes sweeping, before it fades into the greeting
const GREETING_FADE_DURATION = 0.6 // seconds, headline <-> greeting cross-fade
const NAME_COLOR_DELAY = 0.5      // seconds after the greeting mounts, before "Junhan" turns indigo
const NAME_COLOR_DURATION = 0.7
const POST_GREETING_HOLD = 500    // ms after the name color settles, before the hero reports "done"
const NUDGE_DELAY = 1400          // ms after the scroll hint appears before the auto-nudge scroll fires

const PLAIN_TEXT_STYLE = { color: 'var(--ink)', fontWeight: 500 }
const INK_FALLBACK = '#1F2E44'

// Solid versions of each sentence's highlight hue, used to color the
// number that leads into that sentence's occupation.
const TEACHER_HUE = 'rgb(79,168,143)'
const OPERATOR_HUE = 'rgb(224,138,60)'
// Brighter/more saturated than the other two — this is the word the
// headline wants the reader's eye to land on.
const ENGINEER_HUE = 'rgb(43,155,255)'
// Same tonal family as TEACHER_HUE/OPERATOR_HUE (mid-saturation, not neon) —
// "Junhan" settles into this indigo blue at the end of the greeting.
const INDIGO_POP = 'rgb(58,125,214)'

function Highlight({ children, color, show, glow }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', fontWeight: 700 }}>
      <span style={{ position: 'relative', zIndex: 1, color: 'var(--ink)' }}>
        {children}
      </span>
      <motion.span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-2px',
          right: '-2px',
          bottom: '2px',
          height: '50%',
          background: color,
          borderRadius: '3px',
          transformOrigin: 'left',
          zIndex: 0,
          boxShadow: glow ? `0 0 18px 2px ${ENGINEER_HUE.replace('rgb', 'rgba').replace(')', ',0.45)')}` : 'none',
        }}
        initial={{ scaleX: 0 }}
        animate={show ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: HIGHLIGHT_DURATION, delay: HIGHLIGHT_DELAY_AFTER_MOUNT, ease: 'easeOut' }}
      />
    </span>
  )
}

// "Hi, I'm Junhan." — resolves the current theme's ink color at mount so the
// before/after of the animation is a real, interpolatable color pair rather
// than an unresolved CSS variable, then sweeps "Junhan" to indigo.
function Greeting({ fontSize }) {
  const reduceMotion = useReducedMotion()
  const [nameColor, setNameColor] = useState(INK_FALLBACK)

  useEffect(() => {
    const startColor = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || INK_FALLBACK
    setNameColor(startColor)
    if (reduceMotion) {
      setNameColor(INDIGO_POP)
      return
    }
    const t = setTimeout(() => setNameColor(INDIGO_POP), NAME_COLOR_DELAY * 1000)
    return () => clearTimeout(t)
  }, [reduceMotion])

  return (
    <motion.h1
      key="greeting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: GREETING_FADE_DURATION, ease: 'easeOut' }}
      style={{
        fontSize,
        lineHeight: 1.5,
        letterSpacing: '0.01em',
        fontWeight: 700,
        margin: 0,
      }}
    >
      <span style={PLAIN_TEXT_STYLE}>Hi, I'm </span>
      <motion.span
        style={{ fontWeight: 700 }}
        animate={{ color: nameColor }}
        transition={{ duration: NAME_COLOR_DURATION, ease: 'easeOut' }}
      >
        Junhan
      </motion.span>
      <span style={PLAIN_TEXT_STYLE}>.</span>
    </motion.h1>
  )
}

export default function Hero({ onComplete }) {
  const reduceMotion = useReducedMotion()
  const [revealedCount, setRevealedCount] = useState(reduceMotion ? 3 : 0)
  const [showGreeting, setShowGreeting] = useState(reduceMotion)
  const [showScrollHint, setShowScrollHint] = useState(reduceMotion)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      if (window.scrollY > 40) setHasScrolled(true)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      onComplete?.()
      return
    }

    const timers = []
    timers.push(setTimeout(() => setRevealedCount(1), START_DELAY))
    timers.push(setTimeout(() => setRevealedCount(2), START_DELAY + HOLD))
    timers.push(setTimeout(() => setRevealedCount(3), START_DELAY + HOLD * 2))

    // The headline's own highlight sweep finishes this long after line 3 mounts.
    const line3MountTime = START_DELAY + HOLD * 2
    const headlineSweepDone = line3MountTime + (HIGHLIGHT_DELAY_AFTER_MOUNT + HIGHLIGHT_DURATION) * 1000

    timers.push(setTimeout(() => setShowGreeting(true), headlineSweepDone + GREETING_DELAY))

    const greetingMountTime = headlineSweepDone + GREETING_DELAY
    const nameColorDone = greetingMountTime + (NAME_COLOR_DELAY + NAME_COLOR_DURATION) * 1000
    const doneAt = nameColorDone + POST_GREETING_HOLD
    timers.push(setTimeout(() => {
      onComplete?.()
      setShowScrollHint(true)
    }, doneAt))

    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-nudge: once the hero has finished its sequence, gently scroll the
  // page down to the start of the next section on the viewer's behalf,
  // instead of leaving the hero "stuck" at full viewport height. It only
  // fires if they haven't already started scrolling themselves, and
  // respects reduced-motion preference.
  useEffect(() => {
    if (reduceMotion || !showScrollHint || hasScrolled) return
    const t = setTimeout(() => {
      if (window.scrollY < 40) {
        document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, NUDGE_DELAY)
    return () => clearTimeout(t)
  }, [reduceMotion, showScrollHint, hasScrolled])

  const lines = [
    <>
      <span style={{ ...PLAIN_TEXT_STYLE, color: TEACHER_HUE }}>10+</span>
      <span style={PLAIN_TEXT_STYLE}> years as a </span>
      <Highlight color="rgba(79,168,143,0.4)" show={revealedCount > 0}>Teacher</Highlight>
      <span style={PLAIN_TEXT_STYLE}>.</span>
    </>,
    <>
      <span style={PLAIN_TEXT_STYLE}>Then, </span>
      <span style={{ ...PLAIN_TEXT_STYLE, color: OPERATOR_HUE }}>3</span>
      <span style={PLAIN_TEXT_STYLE}> years as a </span>
      <Highlight color="rgba(224,138,60,0.4)" show={revealedCount > 1}>Public-Private Operator</Highlight>
      <span style={PLAIN_TEXT_STYLE}>.</span>
    </>,
    <>
      <span style={PLAIN_TEXT_STYLE}>Now, a dedicated </span>
      <Highlight color="rgba(43,155,255,0.55)" show={revealedCount > 2} glow>Cloud/DevOps Engineer</Highlight>
      <span style={PLAIN_TEXT_STYLE}> who builds secure, cost-aware cloud infrastructure.</span>
    </>,
  ]

  const hintVisible = showScrollHint && !hasScrolled

  return (
    <section
      className="snap-section"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: '0 var(--gutter)',
      }}
    >
      <motion.div
        layout
        transition={{ layout: { duration: LAYOUT_DURATION, ease: 'easeOut' } }}
        style={{ maxWidth: 'var(--content-width)', width: '100%' }}
      >
        <AnimatePresence mode="wait">
          {!showGreeting ? (
            <motion.h1
              key="headline"
              layout
              exit={{ opacity: 0 }}
              transition={{
                layout: { duration: LAYOUT_DURATION, ease: 'easeOut' },
                opacity: { duration: FADE_DURATION, ease: 'easeOut' },
              }}
              style={{
                fontSize: 'clamp(1.4rem, 0.95rem + 2.1vw, 2.5rem)',
                lineHeight: 1.6,
                letterSpacing: '0.01em',
                fontWeight: 700,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35em',
              }}
            >
              {lines.slice(0, revealedCount).map((line, i) => (
                <motion.span
                  key={i}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    opacity: { duration: FADE_DURATION, ease: 'easeOut' },
                    layout: { duration: LAYOUT_DURATION, ease: 'easeOut' },
                  }}
                  style={{ display: 'block' }}
                >
                  {line}
                </motion.span>
              ))}
            </motion.h1>
          ) : (
            <Greeting fontSize="clamp(1.6rem, 1.05rem + 2.3vw, 2.75rem)" />
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hintVisible ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: '999px',
          padding: '8px 16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          pointerEvents: hintVisible ? 'auto' : 'none',
        }}
      >
        scroll <span>↓</span>
      </motion.div>
    </section>
  )
}
