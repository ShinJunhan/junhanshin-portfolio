import { motion, useReducedMotion } from 'framer-motion'

/**
 * Wraps any section/element so it fades + slides in once when scrolled
 * into view. `once: true` means it won't re-animate on scroll back up.
 *
 * `gate` (optional): if provided and false, nothing renders yet — used to
 * hold a section back until another sequence (like the Hero headline)
 * has actually finished, instead of racing an independent scroll trigger.
 *
 * `amount` (optional): how much of the element must be on screen before it
 * fires. The 0.2 default suits blocks shorter than the viewport. Anything
 * that can grow taller than about five screens — a full rendered README —
 * must pass 'some', because 20% of such an element is more than a viewport
 * and the trigger would never be met, leaving the content invisible.
 */
export default function Reveal({ children, delay = 0, style, gate = true, amount = 0.2 }) {
  const reduceMotion = useReducedMotion()

  if (!gate) return null

  if (reduceMotion) {
    return <div style={style}>{children}</div>
  }

  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
