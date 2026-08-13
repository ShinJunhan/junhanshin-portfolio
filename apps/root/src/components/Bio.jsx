export default function Bio() {
  return (
    <h1
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontFamily: 'var(--font-header)',
        fontSize: 'clamp(1.9rem, 1.3rem + 2.4vw, 2.75rem)',
        fontWeight: 800,
        color: 'var(--accent-base)',
        marginBottom: '1.75rem',
      }}
    >
      <svg
        width="1.1em"
        height="1.1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
      </svg>
      About Me
    </h1>
  )
}
