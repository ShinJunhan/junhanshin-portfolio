import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import AwsOrbit from './AwsOrbit.jsx'

const SECTION_HEADING_STYLE = {
  fontFamily: 'var(--font-header)',
  fontWeight: 800,
  fontSize: 'var(--h1-size)',
  color: 'var(--accent-base)',
  margin: '0 0 1.5rem',
}

const CATEGORY_LABEL_STYLE = {
  fontFamily: 'var(--font-header)',
  fontWeight: 800,
  fontSize: 'clamp(1.8rem, 1.2rem + 2vw, 2.5rem)',
  color: 'var(--accent-base)',
  margin: 0,
}

const CONTACT_ITEMS = [
  {
    text: 'Methuen, MA',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    // TODO: swap in the real phone number
    text: '999-999-999',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2C9.5 22 2 14.5 2 6a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    text: 'junhanshin17@gmail.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M4 6.5l8 6.5 8-6.5" />
      </svg>
    ),
  },
]

const OTHER_SKILL_GROUPS = [
  { label: 'IaC', items: ['Terraform', 'Ansible'] },
  { label: 'Containers / Orchestration', items: ['Docker', 'Kubernetes', 'Helm', 'KEDA', 'Karpenter', 'EKS'] },
  { label: 'CI/CD & GitOps', items: ['GitHub Actions', 'Jenkins', 'ArgoCD', 'Gitea'] },
  { label: 'Monitoring', items: ['Prometheus', 'Grafana', 'AlertManager'] },
]

// A colored wash behind a word, matching the hero headline's highlight
// language — sweeps in the first time it scrolls into view.
function Highlight({ children }) {
  const reduceMotion = useReducedMotion()
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: reduceMotion ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: reduceMotion ? 0 : 0.1 }}
        style={{
          position: 'absolute',
          left: '-6px',
          right: '-6px',
          bottom: '2px',
          height: '30%',
          background: 'var(--accent-highlight)',
          borderRadius: '4px',
          transformOrigin: 'left',
          zIndex: 0,
        }}
      />
    </span>
  )
}

function Dot() {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      initial={{ scale: reduceMotion ? 1 : 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        background: 'var(--card-bg)',
        border: '3px solid var(--accent-base)',
        marginTop: '6px',
        flexShrink: 0,
      }}
    />
  )
}

// The fill only grows while the connector is actually passing through the
// viewport during a real scroll gesture — it's driven directly off scroll
// position (useScroll), not an independent timed animation, so it never
// "finishes connecting" on its own while the reader is sitting still.
function Connector() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.55'] })
  const fillHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div
      ref={ref}
      style={{
        flex: 1,
        width: '2px',
        minHeight: '110px',
        background: 'var(--border)',
        marginTop: '6px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--accent-base)', height: fillHeight }} />
    </div>
  )
}

function Milestone({ children, showConnector = true }) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', flexShrink: 0 }}>
        <Dot />
        {showConnector && <Connector />}
      </div>
      {/* Generous bottom padding keeps each "feature" its own moment as you
          scroll, instead of the next one crowding in underneath it. */}
      <div style={{ flex: 1, paddingBottom: '6rem', minWidth: 0 }}>{children}</div>
    </div>
  )
}

// Apple-style feature reveal: slides up and fades in as it enters view.
function SlideIn({ children, delay = 0 }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: 'easeOut', delay: reduceMotion ? 0 : delay }}
    >
      {children}
    </motion.div>
  )
}

function ContactMilestone() {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } } }}
    >
      {CONTACT_ITEMS.map((item) => (
        <motion.div
          key={item.text}
          variants={{
            hidden: { opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.85, y: reduceMotion ? 0 : 10 },
            visible: { opacity: 1, scale: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' } },
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            marginBottom: '0.6rem',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
          }}
        >
          <span style={{ color: 'var(--accent-base)', display: 'flex' }}>{item.icon}</span>
          {item.text}
        </motion.div>
      ))}
    </motion.div>
  )
}

function ProjectsMilestone() {
  return (
    <div>
      <SlideIn>
        <h2 style={SECTION_HEADING_STYLE}>Projects</h2>
      </SlideIn>
      <SlideIn delay={0.1}>
        <p style={{
          fontFamily: 'var(--font-header)',
          fontWeight: 800,
          fontSize: 'clamp(3rem, 2rem + 4vw, 4.5rem)',
          color: 'var(--ink)',
          margin: '0 0 0.4rem',
          lineHeight: 1,
        }}>
          7
        </p>
      </SlideIn>
      <SlideIn delay={0.18}>
        <p style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
          completed cloud infrastructure projects (3 individual + 4 team)
        </p>
      </SlideIn>
    </div>
  )
}

function SkillGroup({ label, items }) {
  return (
    <SlideIn>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={CATEGORY_LABEL_STYLE}>
          <Highlight>{label}</Highlight>
        </p>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', margin: '0.6rem 0 0', lineHeight: 1.7 }}>
          {items.join(' · ')}
        </p>
      </div>
    </SlideIn>
  )
}

function SkillsMilestone() {
  return (
    <div>
      <SlideIn>
        <h2 style={SECTION_HEADING_STYLE}>Skills</h2>
      </SlideIn>

      <SlideIn delay={0.1}>
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={CATEGORY_LABEL_STYLE}>
            <Highlight>Cloud (AWS)</Highlight>
          </p>
          <div style={{ marginTop: '1rem' }}>
            <AwsOrbit />
          </div>
        </div>
      </SlideIn>

      {OTHER_SKILL_GROUPS.map((g) => (
        <SkillGroup key={g.label} label={g.label} items={g.items} />
      ))}
    </div>
  )
}

function CertificationsMilestone() {
  return (
    <div>
      <SlideIn>
        <h2 style={SECTION_HEADING_STYLE}>Certifications</h2>
      </SlideIn>
      <SlideIn delay={0.1}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--accent-base)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="9" r="6" />
            <path d="M8.5 14.5L7 22l5-2.5L17 22l-1.5-7.5" />
          </svg>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
            AWS Certified Solutions Architect – Associate
          </p>
        </div>
      </SlideIn>
    </div>
  )
}

export default function Timeline() {
  return (
    <section style={{ marginBottom: '1rem' }}>
      <Milestone>
        <ContactMilestone />
      </Milestone>
      <Milestone>
        <ProjectsMilestone />
      </Milestone>
      <Milestone>
        <SkillsMilestone />
      </Milestone>
      <Milestone showConnector={false}>
        <CertificationsMilestone />
      </Milestone>
    </section>
  )
}
