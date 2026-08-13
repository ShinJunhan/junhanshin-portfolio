import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const START_DELAY = 500       // before sentence 1 appears
const HOLD = 1300             // each sentence's alone-time before the next mounts
const FADE_DURATION = 0.6     // seconds, each sentence's own cross-fade in
const LAYOUT_DURATION = 0.6   // seconds, the "push up" reflow animation
const HIGHLIGHT_DELAY_AFTER_MOUNT = 0.75 // seconds after a line mounts, before its own highlight sweeps
const HIGHLIGHT_DURATION = 0.35
const NUDGE_DELAY = 1400      // ms after the scroll hint appears before the auto-nudge scroll fires

const PLAIN_TEXT_STYLE = { color: 'var(--ink)', fontWeight: 500 }

// Solid versions of each sentence's highlight hue, used to color the
// number that leads into that sentence's occupation.
const TEACHER_HUE = 'rgb(79,168,143)'
const OPERATOR_HUE = 'rgb(224,138,60)'
// Brighter/more saturated than the other two — this is the word the
// headline wants the reader's eye to land on.
const ENGINEER_HUE = 'rgb(43,155,255)'

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

export default function Hero({ onComplete }) {
  const reduceMotion = useReducedMotion()
  const [revealedCount, setRevealedCount] = useState(reduceMotion ? 3 : 0)
  const [showSubtitle, setShowSubtitle] = useState(reduceMotion)
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

    const afterSentence3 = START_DELAY + HOLD * 2 + FADE_DURATION * 1000
    timers.push(setTimeout(() => setShowSubtitle(true), afterSentence3 + 150))

    // Line 3's own highlight fires HIGHLIGHT_DELAY_AFTER_MOUNT after it mounts —
    // report "done" once that last sweep has actually finished.
    const line3MountTime = START_DELAY + HOLD * 2
    const doneAt = line3MountTime + (HIGHLIGHT_DELAY_AFTER_MOUNT + HIGHLIGHT_DURATION) * 1000
    timers.push(setTimeout(() => {
      onComplete?.()
      setShowScrollHint(true)
    }, doneAt))

    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-nudge: once the headline has finished its sequence, gently scroll
  // the page down on the viewer's behalf instead of leaving the hero
  // "stuck" at full viewport height. It only fires if they haven't already
  // started scrolling themselves, and respects reduced-motion preference.
  useEffect(() => {
    if (reduceMotion || !showScrollHint || hasScrolled) return
    const t = setTimeout(() => {
      if (window.scrollY < 40) {
        window.scrollBy({ top: window.innerHeight * 0.55, behavior: 'smooth' })
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
      <div style={{ maxWidth: 'var(--content-width)', width: '100%' }}>
        <motion.h1
          layout
          style={{
            fontSize: 'clamp(1.4rem, 0.95rem + 2.1vw, 2.5rem)',
            lineHeight: 1.6,
            letterSpacing: '0.01em',
            fontWeight: 700,
            marginBottom: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35em',
          }}
          transition={{ layout: { duration: LAYOUT_DURATION, ease: 'easeOut' } }}
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

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: showSubtitle ? 1 : 0, y: showSubtitle ? 0 : 8 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: 'clamp(1rem, 0.85rem + 0.5vw, 1.35rem)',
            letterSpacing: '0.01em',
            color: 'var(--ink)',
            margin: 0,
          }}
        >
          Junhan Shin — Methuen, MA
        </motion.p>
      </div>

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
