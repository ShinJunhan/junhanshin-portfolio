export default function CTAButtons() {
  const buttonStyle = {
    display: 'block',
    textAlign: 'center',
    padding: '0.8rem',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-base)',
    color: 'white',
    fontWeight: 700,
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    textDecoration: 'none',
    marginBottom: '10px',
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* TODO: replace with real devops.junhanshin.com link once live */}
      <a href="https://devops.junhanshin.com" style={buttonStyle}>
        View Cloud/DevOps Portfolio →
      </a>
      {/* TODO: replace with real 2nd subdomain link once built + named */}
      <a href="#" style={{ ...buttonStyle, background: 'transparent', color: 'var(--accent-base)', border: '1px solid var(--accent-base)' }}>
        Program Leadership Background →
      </a>
    </div>
  )
}
