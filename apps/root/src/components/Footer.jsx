function IconBadge({ children }) {
  return (
    <span
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '30%',
        border: '1px solid var(--border)',
        background: 'var(--card-bg)',
        color: 'var(--accent-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8rem',
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  )
}

const ICON_PROPS = {
  width: 19,
  height: 19,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

// TODO: fill in real LinkedIn / GitHub / Notion URLs and resume PDF path
const LINKS = [
  {
    label: 'Email',
    href: 'mailto:junhanshin17@gmail.com',
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M4 6.5l8 6.5 8-6.5" />
      </svg>
    ),
  },
  { label: 'LinkedIn', href: '#', icon: 'in' },
  { label: 'GitHub', href: '#', icon: 'GH' },
  { label: 'Notion (Study Notes)', href: '#', icon: 'N' },
  {
    label: 'Resume (PDF)',
    href: '#',
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M6 2h9l5 5v15H6z" />
        <path d="M15 2v5h5" />
        <path d="M9 13h6M9 17h6" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.5rem',
        borderTop: '1px solid var(--border)',
        paddingTop: '1.5rem',
        marginTop: '2rem',
      }}
    >
      {LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-label)',
            fontWeight: 600,
            fontSize: 'clamp(0.95rem, 0.9rem + 0.15vw, 1.05rem)',
            textDecoration: 'none',
          }}
        >
          <IconBadge>{link.icon}</IconBadge>
          {link.label}
        </a>
      ))}
    </footer>
  )
}
