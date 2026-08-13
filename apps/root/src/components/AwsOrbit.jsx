import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Drop real AWS Architecture Icons here to replace these placeholders —
// no code changes needed. Save each as public/icons/aws/<slug>.svg
// (e.g. public/icons/aws/ec2.svg) and it's picked up automatically; the
// hand-drawn glyph below only shows while that file is missing.
const SERVICES = [
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

function Glyph({ type }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  switch (type) {
    case 'server':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="6" rx="1.5" />
          <rect x="3" y="14" width="18" height="6" rx="1.5" />
          <circle cx="7" cy="7" r="0.6" fill="currentColor" />
          <circle cx="7" cy="17" r="0.6" fill="currentColor" />
        </svg>
      )
    case 'archive':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="4" rx="1" />
          <path d="M4 8v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8" />
          <path d="M10 12h4" />
        </svg>
      )
    case 'network':
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="2.2" />
          <circle cx="18" cy="6" r="2.2" />
          <circle cx="12" cy="18" r="2.2" />
          <path d="M8 7l7.2-.6M7.5 8l3.7 8M16.5 8l-3.7 8" />
        </svg>
      )
    case 'globe':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.8 2.7 2.8 15.3 0 18M12 3c-2.8 2.7-2.8 15.3 0 18" />
        </svg>
      )
    case 'shuffle':
      return (
        <svg {...common}>
          <path d="M4 6h4l8 12h4M4 18h4l3-4.5" />
          <path d="M16 6h4M18 4l2 2-2 2M18 20l2-2-2-2" />
        </svg>
      )
    case 'database':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
          <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
        </svg>
      )
    case 'key':
      return (
        <svg {...common}>
          <circle cx="8" cy="15" r="4" />
          <path d="M11 12l9-9M16 5l3 3M18 3l3 3" />
        </svg>
      )
    case 'pulse':
      return (
        <svg {...common}>
          <path d="M3 12h4l2-7 4 14 2-7h6" />
        </svg>
      )
    case 'layers':
      return (
        <svg {...common}>
          <path d="M12 3l9 5-9 5-9-5 9-5z" />
          <path d="M3 13.5l9 5 9-5" />
        </svg>
      )
    case 'bolt':
      return (
        <svg {...common}>
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
        </svg>
      )
    default:
      return null
  }
}

function ServiceIcon({ slug, glyph }) {
  const [imgFailed, setImgFailed] = useState(false)
  if (imgFailed) return <Glyph type={glyph} />
  return (
    <img
      src={`/icons/aws/${slug}.svg`}
      alt=""
      draggable={false}
      onError={() => setImgFailed(true)}
      style={{ width: 24, height: 24, pointerEvents: 'none' }}
    />
  )
}

function OrbitIcon({ service }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      animate={{ scale: hovered ? 1.2 : 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 20 }}
      tabIndex={0}
      role="img"
      aria-label={service.label}
      style={{
        position: 'relative',
        width: 60,
        height: 60,
        // A squircle (rounded square) rather than a full circle or a
        // sharp-cornered rectangle — the iOS/watchOS app-icon shape.
        borderRadius: '30%',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        color: 'var(--accent-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        flexShrink: 0,
      }}
    >
      <ServiceIcon slug={service.slug} glyph={service.glyph} />
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              bottom: '120%',
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              background: 'var(--ink)',
              color: 'var(--bg)',
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '3px 9px',
              borderRadius: '999px',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            {service.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AwsOrbit() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        padding: '1.25rem',
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
      }}
    >
      {SERVICES.map((s) => (
        <OrbitIcon key={s.slug} service={s} />
      ))}
    </div>
  )
}
