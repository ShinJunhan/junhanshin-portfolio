const ArrowIcon = () => (
  <svg className="cta-button__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

export default function CTAButtons() {
  const buttonStyle = {
    textAlign: 'center',
    padding: '1.1rem 1.5rem',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-base)',
    color: 'white',
    fontWeight: 700,
    fontFamily: 'var(--font-label)',
    fontSize: 'clamp(1rem, 0.9rem + 0.3vw, 1.15rem)',
    textDecoration: 'none',
    marginBottom: '14px',
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* TODO: replace with real devops.junhanshin.com link once live */}
      <a href="https://devops.junhanshin.com" className="cta-button" style={buttonStyle}>
        View Cloud/DevOps Portfolio <ArrowIcon />
      </a>
      {/* TODO: replace with real 2nd subdomain link once built + named */}
      <a href="#" className="cta-button" style={{ ...buttonStyle, background: 'transparent', color: 'var(--accent-base)', border: '1px solid var(--accent-base)' }}>
        Program Leadership Background <ArrowIcon />
      </a>
    </div>
  )
}
