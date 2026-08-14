import { useContext } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import SkillCluster from './SkillCluster.jsx'
import { BandReveal } from './bandReveal.js'

const GROUPS = [
  {
    label: 'Cloud (AWS)',
    accent: 'var(--c-indigo)',
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
    label: 'IaC',
    accent: 'var(--c-orange)',
    basePath: '/icons/tools',
    services: [
      { slug: 'terraform', label: 'Terraform', glyph: 'layers' },
      { slug: 'ansible', label: 'Ansible', glyph: 'gear' },
    ],
  },
  {
    label: 'Containers / Orchestration',
    accent: 'var(--c-emerald)',
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
    label: 'CI/CD & GitOps',
    accent: 'var(--c-coral)',
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
    label: 'Monitoring',
    accent: 'var(--c-steel)',
    basePath: '/icons/tools',
    services: [
      { slug: 'prometheus', label: 'Prometheus', glyph: 'flame' },
      { slug: 'grafana', label: 'Grafana', glyph: 'chart-bar' },
      { slug: 'alertmanager', label: 'AlertManager', glyph: 'bell' },
      { slug: 'opencost', label: 'OpenCost', glyph: 'coin' },
    ],
  },
]

export default function SkillsCarousel({ baseDelay = 0, className = '' }) {
  const reduceMotion = useReducedMotion()
  // Shares the band's single trigger so the cards never start filling in
  // while the "Skills" heading is still sliding across them.
  const inView = useContext(BandReveal)

  return (
    <motion.div
      className={`carousel ${className}`.trim()}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: reduceMotion ? 0 : baseDelay,
            staggerChildren: reduceMotion ? 0 : 0.11,
          },
        },
      }}
    >
      {GROUPS.map((g) => (
        <motion.article
          key={g.label}
          className="skill-card"
          variants={{
            hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 26, scale: reduceMotion ? 1 : 0.94 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: reduceMotion ? 0 : 0.5, ease: 'easeOut' },
            },
          }}
        >
          <SkillCluster services={g.services} basePath={g.basePath} />
          <h3 className="skill-card__title" style={{ color: g.accent }}>
            {g.label}
          </h3>
        </motion.article>
      ))}
    </motion.div>
  )
}
