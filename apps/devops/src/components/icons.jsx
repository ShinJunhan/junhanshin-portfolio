// All icons are 24-box line art at 1em, coloured by `currentColor`, so they
// inherit whatever the surrounding text or accent is set to.
const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
}

export const GithubIcon = () => (
  <svg {...base} fill="currentColor" stroke="none">
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
  </svg>
)

// The Notion mark, simplified to the same line weight as the rest of the set.
export const NotionIcon = () => (
  <svg {...base}>
    <path d="M4 5.2 14.6 4.3a2 2 0 0 1 1.5.45l3.2 2.4a1 1 0 0 1 .4.8v10.6a1.4 1.4 0 0 1-1.3 1.4L6.1 20.9a1.6 1.6 0 0 1-1.7-1.6V5.2z" />
    <path d="M8 9.1v6.3M8 9.1l5 6.1M13 8.7v6.5" />
  </svg>
)

// Gauge — "live dashboard".
export const DashboardIcon = () => (
  <svg {...base}>
    <path d="M3.5 17a9 9 0 1 1 17 0" />
    <path d="M12 17l4.2-4.6" />
    <circle cx="12" cy="17" r="1.4" />
  </svg>
)

// Angle brackets — "browse the code".
export const CodeIcon = () => (
  <svg {...base}>
    <polyline points="8 7 3 12 8 17" />
    <polyline points="16 7 21 12 16 17" />
  </svg>
)

export const ExternalIcon = () => (
  <svg {...base}>
    <path d="M14 4h6v6" />
    <path d="M20 4l-8.5 8.5" />
    <path d="M19 14.5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V6.5A1.5 1.5 0 0 1 5 5h4.5" />
  </svg>
)

// Globe — the EN/KO README toggle.
export const LanguageIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.8 2.7 2.8 15.3 0 18M12 3c-2.8 2.7-2.8 15.3 0 18" />
  </svg>
)

export const MenuIcon = () => (
  <svg {...base}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const CloseIcon = () => (
  <svg {...base}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
