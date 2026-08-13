import { motion, useReducedMotion } from 'framer-motion'

const stats = [
  { value: '3', label: 'Cloud infrastructure projects, technical lead on 2 of 3' },
  { value: 'AWS SAA', label: 'Certified Solutions Architect' },
  { value: 'Boston, MA', label: 'Open to on-site, hybrid, or remote' },
]

export default function StatCards() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '10px',
        marginBottom: '2rem',
      }}
      initial={reduceMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ staggerChildren: 0.12 }}
    >
      {stats.map((s) => (
        <motion.div
          key={s.label}
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
          }}
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.9rem',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-header)',
            fontWeight: 800,
            fontSize: '1.15rem',
            color: 'var(--accent-base)',
            margin: '0 0 4px',
          }}>{s.value}</p>
          <p style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.4,
          }}>{s.label}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
