import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import SkillCloud from './SkillCloud.jsx'

const AWS_SERVICES = [
  { slug: 'ec2', label: 'EC2', glyph: 'server' },
  { slug: 's3', label: 'S3', glyph: 'archive' },
  { slug: 'vpc', label: 'VPC', glyph: 'network' },
  { slug: 'route53', label: 'Route 53', glyph: 'globe' },
  { slug: 'alb', label: 'ALB', glyph: 'shuffle' },
  { slug: 'rds', label: 'RDS', glyph: 'database' },
  { slug: 'iam', label: 'IAM', glyph: 'key' },
  { slug: 'cloudwatch', label: 'CloudWatch', glyph: 'pulse' },
  { slug: 'dynamodb', label: 'DynamoDB', glyph: 'layers' },
  { slug: 'lambda', label: 'Lambda', glyph: 'bolt' },
]

const IAC = [
  { slug: 'terraform', label: 'Terraform', glyph: 'layers' },
  { slug: 'ansible', label: 'Ansible', glyph: 'gear' },
]

const CONTAINERS = [
  { slug: 'docker', label: 'Docker', glyph: 'box' },
  { slug: 'kubernetes', label: 'Kubernetes', glyph: 'hexagon' },
  { slug: 'helm', label: 'Helm', glyph: 'wheel' },
  { slug: 'keda', label: 'KEDA', glyph: 'arrows-updown' },
  { slug: 'karpenter', label: 'Karpenter', glyph: 'network' },
  { slug: 'eks', label: 'EKS', glyph: 'cloud' },
]

const CICD = [
  { slug: 'github-actions', label: 'GitHub Actions', glyph: 'play' },
  { slug: 'jenkins', label: 'Jenkins', glyph: 'wrench' },
  { slug: 'argocd', label: 'ArgoCD', glyph: 'sync' },
  { slug: 'gitea', label: 'Gitea', glyph: 'git-branch' },
]

const MONITORING = [
  { slug: 'prometheus', label: 'Prometheus', glyph: 'flame' },
  { slug: 'grafana', label: 'Grafana', glyph: 'chart-bar' },
  { slug: 'alertmanager', label: 'AlertManager', glyph: 'bell' },
]

const CONTACT_ITEMS = [
  {
    text: 'Methuen, MA',
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    // TODO: swap in the real phone number
    text: '999-999-999',
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2C9.5 22 2 14.5 2 6a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    text: 'junhanshin17@gmail.com',
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M4 6.5l8 6.5 8-6.5" />
      </svg>
    ),
  },
]

const PERSON_ICON = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
)

// The rail runs alongside the headings only — the detail column sits to its
// right, so the line reads as threading the section titles together. Its
// fill tracks scroll position directly (useScroll) rather than playing a
// timed tween, so it never advances while the reader is sitting still.
function Rail({ accent, bandBg }) {
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
          top: '50%',
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

// Apple-style feature reveal: slides up and fades in as it enters view.
function SlideIn({ children, delay = 0, style }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      style={style}
      initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, ease: 'easeOut', delay: reduceMotion ? 0 : delay }}
    >
      {children}
    </motion.div>
  )
}

function Band({ heading, icon, accent, alt, compact = false, children }) {
  const bandBg = alt ? 'var(--bg-alt)' : 'var(--bg)'
  return (
    <section className="band snap-section" style={{ background: bandBg }}>
      <div className={`band__inner${compact ? ' band__inner--compact' : ''}`}>
        <div className="section-row">
          <Rail accent={accent} bandBg={bandBg} />
          <div className="section-row__content">
            <div className="section-row__heading">
              <SlideIn>
                <h2
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontFamily: 'var(--font-header)',
                    fontWeight: 800,
                    fontSize: 'var(--h1-size)',
                    lineHeight: 1.15,
                    color: accent,
                    textShadow: 'var(--heading-shadow)',
                    margin: 0,
                  }}
                >
                  {icon}
                  {heading}
                </h2>
              </SlideIn>
            </div>
            <div className="section-row__body">
              <SlideIn delay={0.12}>{children}</SlideIn>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactDetails() {
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
            gap: '0.8rem',
            marginBottom: '0.9rem',
            color: 'var(--text-primary)',
            fontSize: 'var(--body-size)',
          }}
        >
          <span style={{ color: 'var(--c-coral)', display: 'flex', fontSize: '1.3rem' }}>{item.icon}</span>
          {item.text}
        </motion.div>
      ))}
    </motion.div>
  )
}

export default function Timeline() {
  return (
    <>
      <Band heading="About Me" icon={PERSON_ICON} accent="var(--c-coral)" alt={false}>
        <ContactDetails />
      </Band>

      <Band heading="Projects" accent="var(--c-orange)" alt>
        <p style={{
          fontFamily: 'var(--font-header)',
          fontWeight: 800,
          fontSize: 'clamp(2.75rem, 1.8rem + 4vw, 4.5rem)',
          color: 'var(--c-orange)',
          textShadow: 'var(--heading-shadow)',
          margin: '0 0 0.4rem',
          lineHeight: 1,
        }}>
          7
        </p>
        <p style={{ fontSize: 'var(--body-size)', color: 'var(--text-primary)', margin: 0, maxWidth: '34ch' }}>
          completed cloud infrastructure projects (3 individual + 4 team)
        </p>
      </Band>

      <Band heading="Skills" accent="var(--c-emerald)" alt={false}>
        <p style={{ fontSize: 'var(--body-size)', color: 'var(--text-primary)', margin: 0, maxWidth: '36ch' }}>
          Five areas — cloud, infrastructure as code, containers, delivery,
          and observability. Hover any icon for its name.
        </p>
      </Band>

      <Band heading="Cloud (AWS)" accent="var(--c-indigo)" alt compact>
        <SkillCloud services={AWS_SERVICES} basePath="/icons/aws" accent="var(--c-indigo)" />
      </Band>

      <Band heading="IaC" accent="var(--c-orange)" alt={false} compact>
        <SkillCloud services={IAC} basePath="/icons/tools" accent="var(--c-orange)" />
      </Band>

      <Band heading="Containers / Orchestration" accent="var(--c-emerald)" alt compact>
        <SkillCloud services={CONTAINERS} basePath="/icons/tools" accent="var(--c-emerald)" />
      </Band>

      <Band heading="CI/CD & GitOps" accent="var(--c-coral)" alt={false} compact>
        <SkillCloud services={CICD} basePath="/icons/tools" accent="var(--c-coral)" />
      </Band>

      <Band heading="Monitoring" accent="var(--c-steel)" alt compact>
        <SkillCloud services={MONITORING} basePath="/icons/tools" accent="var(--c-steel)" />
      </Band>

      <Band heading="Certifications" accent="var(--c-forest)" alt={false}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--c-forest)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="9" r="6" />
            <path d="M8.5 14.5L7 22l5-2.5L17 22l-1.5-7.5" />
          </svg>
          <p style={{ fontSize: 'var(--body-size)', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
            AWS Certified Solutions Architect – Associate
          </p>
        </div>
      </Band>
    </>
  )
}
