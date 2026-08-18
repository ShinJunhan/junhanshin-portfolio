import { useContext, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import SkillField from './SkillField.jsx'
import { BandReveal } from './bandReveal.js'

// Every category's skills, drawn as one ambient field until a tab is
// picked — at which point that category's icons converge into a honeycomb
// that owns the whole section.
//
// `basePath` points at a real vendor-logo set; categories without one omit
// it and fall back to the inline glyph named by `glyph`.
const GROUPS = [
  {
    id: 'cloud',
    label: 'Cloud (AWS)',
    accent: 'var(--cat-cloud)',
    basePath: '/icons/aws',
    services: [
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
      { slug: 'cloudfront', label: 'CloudFront', glyph: 'broadcast' },
      { slug: 'session-manager', label: 'Session Manager', glyph: 'console' },
      { slug: 'secrets-manager', label: 'Secret Manager', glyph: 'lock' },
    ],
  },
  {
    id: 'iac',
    label: 'IaC',
    accent: 'var(--cat-iac)',
    basePath: '/icons/tools',
    services: [
      { slug: 'terraform', label: 'Terraform', glyph: 'layers' },
      { slug: 'ansible', label: 'Ansible', glyph: 'gear' },
    ],
  },
  {
    id: 'containers',
    label: 'Containers / Orchestration',
    accent: 'var(--cat-containers)',
    basePath: '/icons/tools',
    services: [
      { slug: 'docker', label: 'Docker', glyph: 'box' },
      { slug: 'kubernetes', label: 'Kubernetes', glyph: 'hexagon' },
      { slug: 'helm', label: 'Helm', glyph: 'wheel' },
      { slug: 'keda', label: 'KEDA', glyph: 'arrows-updown' },
      { slug: 'karpenter', label: 'Karpenter', glyph: 'network' },
      { slug: 'eks', label: 'EKS', glyph: 'cloud' },
      { slug: 'harbor', label: 'Harbor', glyph: 'anchor' },
    ],
  },
  {
    id: 'cicd',
    label: 'CI/CD & GitOps',
    accent: 'var(--cat-cicd)',
    basePath: '/icons/tools',
    services: [
      { slug: 'github-actions', label: 'GitHub Actions', glyph: 'play' },
      { slug: 'jenkins', label: 'Jenkins', glyph: 'wrench' },
      { slug: 'argocd', label: 'ArgoCD', glyph: 'sync' },
      { slug: 'gitea', label: 'Gitea', glyph: 'git-branch' },
      { slug: 'blue-green', label: 'Blue/Green', glyph: 'swap' },
    ],
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    accent: 'var(--cat-monitoring)',
    basePath: '/icons/tools',
    services: [
      { slug: 'prometheus', label: 'Prometheus', glyph: 'flame' },
      { slug: 'grafana', label: 'Grafana', glyph: 'chart-bar' },
      { slug: 'alertmanager', label: 'AlertManager', glyph: 'bell' },
      { slug: 'opencost', label: 'OpenCost', glyph: 'coin' },
    ],
  },
  {
    id: 'networking',
    label: 'Networking',
    accent: 'var(--cat-networking)',
    services: [
      { slug: 'nginx', label: 'Nginx', glyph: 'route' },
      { slug: 'dns', label: 'DNS', glyph: 'globe' },
      { slug: 'tls', label: 'TLS / SSL', glyph: 'lock' },
      { slug: 'subnetting', label: 'Subnetting / CIDR', glyph: 'network' },
      { slug: 'load-balancing', label: 'Load Balancing', glyph: 'shuffle' },
      { slug: 'iptables', label: 'iptables', glyph: 'shield' },
      { slug: 'vpn', label: 'VPN', glyph: 'key' },
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    accent: 'var(--cat-databases)',
    services: [
      { slug: 'mysql', label: 'MySQL', glyph: 'database' },
      { slug: 'postgresql', label: 'PostgreSQL', glyph: 'database' },
      { slug: 'db-dynamodb', label: 'DynamoDB', glyph: 'layers' },
      { slug: 'redis', label: 'Redis', glyph: 'bolt' },
    ],
  },
  {
    id: 'scripting',
    label: 'Scripting / Languages',
    accent: 'var(--cat-scripting)',
    services: [
      { slug: 'bash', label: 'Bash', glyph: 'console' },
      { slug: 'python', label: 'Python', glyph: 'code' },
      { slug: 'yaml', label: 'YAML', glyph: 'file-code' },
      { slug: 'hcl', label: 'HCL', glyph: 'braces' },
      { slug: 'sql', label: 'SQL', glyph: 'database' },
    ],
  },
  {
    id: 'security',
    label: 'Security tooling',
    accent: 'var(--cat-security)',
    services: [
      { slug: 'trivy', label: 'Trivy', glyph: 'search' },
      { slug: 'sonarqube', label: 'SonarQube', glyph: 'chart-bar' },
      { slug: 'owasp-zap', label: 'OWASP ZAP', glyph: 'shield' },
      { slug: 'vault', label: 'Vault', glyph: 'lock' },
      { slug: 'checkov', label: 'Checkov', glyph: 'check-list' },
    ],
  },
  {
    id: 'other',
    label: 'Other tools',
    accent: 'var(--cat-other)',
    services: [
      { slug: 'git', label: 'Git', glyph: 'git-branch' },
      { slug: 'linux', label: 'Linux', glyph: 'console' },
      { slug: 'vscode', label: 'VS Code', glyph: 'code' },
      { slug: 'notion', label: 'Notion', glyph: 'archive' },
      { slug: 'jira', label: 'Jira', glyph: 'check-list' },
    ],
  },
]

// One icon in the converged honeycomb holds the spotlight at a time, rather
// than every icon lighting itself simultaneously.
const SPOTLIGHT_MS = 1900
// Roughly how long the icons take to fly in and settle — see SkillField.
const CONVERGE_MS = 1100

export default function SkillsHoneycomb({ baseDelay = 0 }) {
  const reduceMotion = useReducedMotion()
  // Shares the band's single trigger so the panel never starts filling in
  // while the "Skills" heading is still sliding across it.
  const inView = useContext(BandReveal)

  // Starts on nothing: the panel opens as the ambient field of every icon,
  // and a category is pulled together only once the reader asks for one.
  const [activeId, setActiveId] = useState(null)
  const active = GROUPS.find((g) => g.id === activeId) ?? null

  // Index of the single spotlit icon within the converged honeycomb.
  const [spot, setSpot] = useState(null)
  // Held in a ref so the next pick can read the previous one without the
  // updater itself being random — StrictMode double-invokes updaters, and an
  // impure one would roll the dice twice per tick.
  const spotRef = useRef(null)

  useEffect(() => {
    // Nothing selected means nothing converged, so there's no cluster for a
    // spotlight to walk around.
    if (reduceMotion || !inView || !active) {
      setSpot(null)
      return
    }
    const count = active.services.length
    function next() {
      const prev = spotRef.current
      let i
      do {
        i = Math.floor(Math.random() * count)
      } while (prev !== null && i === prev && count > 1)
      spotRef.current = i
      setSpot(i)
    }
    spotRef.current = null
    // Holds off until the cluster has actually assembled, so the first
    // label doesn't appear over an icon still in flight.
    let interval
    const lead = setTimeout(() => {
      next()
      interval = setInterval(next, SPOTLIGHT_MS)
    }, CONVERGE_MS)
    return () => {
      clearTimeout(lead)
      clearInterval(interval)
    }
  }, [reduceMotion, inView, active])

  return (
    <motion.div
      className="honeycomb"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: reduceMotion ? 0 : baseDelay,
            staggerChildren: reduceMotion ? 0 : 0.12,
          },
        },
      }}
    >
      {/* Toggles, not tabs: with nothing selected the panel belongs to no
          category, and picking the selected one again returns it there. */}
      <motion.div
        className="cat-tabs"
        role="group"
        aria-label="Skill categories"
        variants={{
          hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 14 },
          visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.4, ease: 'easeOut' } },
        }}
      >
        {GROUPS.map((g) => {
          const selected = g.id === activeId
          return (
            <button
              key={g.id}
              type="button"
              aria-pressed={selected}
              className={`cat-tab${selected ? ' cat-tab--on' : ''}`}
              style={{ '--tab-accent': g.accent }}
              onClick={() => setActiveId((cur) => (cur === g.id ? null : g.id))}
            >
              {g.label}
              <span className="cat-tab__bar" aria-hidden="true" />
            </button>
          )
        })}
      </motion.div>

      <motion.div
        className="honeycomb__panel"
        variants={{
          hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.97 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: reduceMotion ? 0 : 0.5, ease: 'easeOut' },
          },
        }}
      >
        <SkillField groups={GROUPS} activeId={activeId} spotIndex={spot} />
      </motion.div>
    </motion.div>
  )
}
