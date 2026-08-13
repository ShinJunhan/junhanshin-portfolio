import { motion } from 'framer-motion'
import AwsOrbit from './AwsOrbit.jsx'

const LABEL_STYLE = {
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-mono)',
  marginBottom: '0.6rem',
  fontWeight: 500,
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

function Dot() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        background: 'var(--card-bg)',
        border: '3px solid var(--accent-base)',
        marginTop: '4px',
        flexShrink: 0,
      }}
    />
  )
}

// Each milestone's connecting line grows independently as it scrolls into
// view — together they read as one line steadily extending down the page.
function Milestone({ children, showLine = true }) {
  return (
    <div style={{ display: 'flex', gap: '1.25rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', flexShrink: 0 }}>
        <Dot />
        {showLine && (
          <div style={{ flex: 1, width: '2px', background: 'var(--border)', marginTop: '4px', position: 'relative', overflow: 'hidden' }}>
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.15 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--accent-base)' }}
            />
          </div>
        )}
      </div>
      <div style={{ flex: 1, paddingBottom: '3rem', minWidth: 0 }}>{children}</div>
    </div>
  )
}

function ContactMilestone() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
    >
      {CONTACT_ITEMS.map((item) => (
        <motion.div
          key={item.text}
          variants={{
            hidden: { opacity: 0, scale: 0.85, y: 10 },
            visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
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
      <p style={LABEL_STYLE}>PROJECTS</p>
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        style={{
          fontFamily: 'var(--font-header)',
          fontWeight: 800,
          fontSize: 'clamp(3rem, 2rem + 4vw, 4.5rem)',
          color: 'var(--accent-base)',
          margin: '0.1rem 0 0.4rem',
          lineHeight: 1,
        }}
      >
        7
      </motion.p>
      <p style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
        completed cloud infrastructure projects (3 individual + 4 team)
      </p>
    </div>
  )
}

function SkillsMilestone() {
  return (
    <div>
      <p style={LABEL_STYLE}>SKILLS</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-header)',
            fontWeight: 800,
            fontSize: 'clamp(1.5rem, 1.1rem + 1.6vw, 2.1rem)',
            color: 'var(--ink)',
            margin: 0,
          }}>
            Cloud (AWS)
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0' }}>
            AWS Certified Solutions Architect – Associate
          </p>
        </div>
        <div style={{ flex: '1 1 320px' }}>
          <AwsOrbit />
        </div>
      </div>
      {OTHER_SKILL_GROUPS.map((g) => (
        <div key={g.label} style={{ marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, marginRight: '8px' }}>{g.label}:</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{g.items.join(' · ')}</span>
        </div>
      ))}
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
      <Milestone showLine={false}>
        <SkillsMilestone />
      </Milestone>
    </section>
  )
}
