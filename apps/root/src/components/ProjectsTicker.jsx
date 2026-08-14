import { motion, useReducedMotion } from 'framer-motion'

// TODO: replace these placeholders with the real project titles.
const PROJECT_TITLES = [
  'Project title placeholder one',
  'Project title placeholder two',
  'Project title placeholder three',
  'Project title placeholder four',
  'Project title placeholder five',
  'Project title placeholder six',
]

const SECONDS_PER_ITEM = 2.6

export default function ProjectsTicker() {
  const reduceMotion = useReducedMotion()
  // The list is rendered twice back to back and scrolled exactly one copy's
  // worth, so the seam lands where the loop restarts and the roll looks
  // continuous rather than snapping back.
  const loop = [...PROJECT_TITLES, ...PROJECT_TITLES]

  return (
    <div className="ticker" aria-label="Project titles">
      <motion.ul
        className="ticker__track"
        animate={reduceMotion ? undefined : { y: ['0%', '-50%'] }}
        transition={
          reduceMotion
            ? undefined
            : {
                duration: PROJECT_TITLES.length * SECONDS_PER_ITEM,
                ease: 'linear',
                repeat: Infinity,
              }
        }
      >
        {loop.map((title, i) => (
          <li
            className="ticker__item"
            key={`${title}-${i}`}
            // The second copy exists only to make the loop seamless.
            aria-hidden={i >= PROJECT_TITLES.length ? 'true' : undefined}
          >
            <span className="ticker__index">
              {String((i % PROJECT_TITLES.length) + 1).padStart(2, '0')}
            </span>
            <span className="ticker__title">{title}</span>
          </li>
        ))}
      </motion.ul>
    </div>
  )
}
