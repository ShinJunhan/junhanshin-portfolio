import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const START_DELAY = 500       // before sentence 1 appears
const HOLD = 1300             // each sentence's alone-time before the next mounts
const FADE_DURATION = 0.6     // seconds, each sentence's own cross-fade in
const LAYOUT_DURATION = 0.6   // seconds, the "push up" reflow animation
const HIGHLIGHT_DELAY_AFTER_MOUNT = 0.75 // seconds after a line mounts, before its own highlight sweeps
const HIGHLIGHT_DURATION = 0.35

const PLAIN_TEXT_STYLE = { color: 'var(--ink)', fontWeight: 500 }

function Highlight({ children, color, show }) {
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

  const lines = [
    <>
      <span style={PLAIN_TEXT_STYLE}>An </span>
      <Highlight color="rgba(79,168,143,0.4)" show={revealedCount > 0}>Educator</Highlight>
      <span style={PLAIN_TEXT_STYLE}> for a decade.</span>
    </>,
    <>
      <span style={PLAIN_TEXT_STYLE}>A </span>
      <Highlight color="rgba(224,138,60,0.4)" show={revealedCount > 1}>Public-Private Operator</Highlight>
      <span style={PLAIN_TEXT_STYLE}> for three years.</span>
    </>,
    <>
      <span style={PLAIN_TEXT_STYLE}>Now a dedicated </span>
      <Highlight color="rgba(28,100,242,0.65)" show={revealedCount > 2}>Cloud/DevOps Engineer</Highlight>
      <span style={PLAIN_TEXT_STYLE}>, building secure, cost-aware cloud infrastructure.</span>
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
        padding: '0 clamp(1.5rem, 6vw, 4rem)',
      }}
    >
      <div style={{ maxWidth: '900px', width: '100%' }}>
        <motion.h1
          layout
          style={{
            fontSize: 'clamp(1.75rem, 1.1rem + 3vw, 3.25rem)',
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
