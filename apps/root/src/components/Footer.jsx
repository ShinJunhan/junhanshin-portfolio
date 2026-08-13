export default function Footer() {
  const linkStyle = {
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    textDecoration: 'none',
    marginRight: '16px',
  }

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      paddingTop: '1rem',
      marginTop: '2rem',
    }}>
      {/* TODO: fill in real LinkedIn / GitHub / Notion URLs and resume PDF path */}
      <a href="mailto:junhanshin17@gmail.com" style={linkStyle}>Email</a>
      <a href="#" style={linkStyle}>LinkedIn</a>
      <a href="#" style={linkStyle}>GitHub</a>
      <a href="#" style={linkStyle}>Notion (Study Notes)</a>
      <a href="#" style={linkStyle}>Resume (PDF)</a>
    </footer>
  )
}
