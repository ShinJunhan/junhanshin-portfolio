import { motion, useReducedMotion } from 'framer-motion'

/**
 * Wraps any section/element so it fades + slides in once when scrolled
 * into view. `once: true` means it won't re-animate on scroll back up.
 *
 * `gate` (optional): if provided and false, nothing renders yet — used to
 * hold a section back until another sequence (like the Hero headline)
 * has actually finished, instead of racing an independent scroll trigger.
 */
export default function Reveal({ children, delay = 0, style, gate = true }) {
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
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
