export default function Bio() {
  return (
    <h2
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: 'var(--font-header)',
        fontSize: '1.15rem',
        fontWeight: 800,
        color: 'var(--accent-base)',
        marginBottom: '1.25rem',
      }}
    >
      <svg
        width="22"
        height="22"
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
    </h2>
  )
}
