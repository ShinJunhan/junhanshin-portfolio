// Every skill icon's artwork. Categories with a real vendor logo set point
// at one via `basePath`; the rest fall back to the inline glyph named by
// the service's `glyph`.
import { useState } from 'react'

function Glyph({ type }) {
  const common = {
    width: '100%',
    height: '100%',
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
    case 'gear':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
        </svg>
      )
    case 'box':
      return (
        <svg {...common}>
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
          <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
        </svg>
      )
    case 'hexagon':
      return (
        <svg {...common}>
          <path d="M12 2l8 4.6v10.8L12 22l-8-4.6V6.6L12 2z" />
          <circle cx="12" cy="12" r="2.4" />
        </svg>
      )
    case 'wheel':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="2" />
          <path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8" />
        </svg>
      )
    case 'arrows-updown':
      return (
        <svg {...common}>
          <path d="M7 14l5 5 5-5M7 10l5-5 5 5" />
        </svg>
      )
    case 'play':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'wrench':
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8z" />
        </svg>
      )
    case 'sync':
      return (
        <svg {...common}>
          <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8" />
          <path d="M20 4v4h-4" />
          <path d="M20 12a8 8 0 0 1-13.7 5.7L4 16" />
          <path d="M4 20v-4h4" />
        </svg>
      )
    case 'git-branch':
      return (
        <svg {...common}>
          <circle cx="6" cy="5" r="2" />
          <circle cx="6" cy="19" r="2" />
          <circle cx="18" cy="12" r="2" />
          <path d="M6 7v10" />
          <path d="M6 15c0-4 4-6 10-6" />
        </svg>
      )
    case 'flame':
      return (
        <svg {...common}>
          <path d="M12 21c-4 0-6-2.5-6-6 0-3 2-5 3-8 1 2 1 3 2 3 .5-2-.5-4 0-6 3 2 5 5 5 8a4 4 0 0 1-4 4c1-2 0-3-1-3-.5 1.5.5 2.5 1 3z" />
        </svg>
      )
    case 'chart-bar':
      return (
        <svg {...common}>
          <line x1="5" y1="19" x2="5" y2="11" />
          <line x1="10" y1="19" x2="10" y2="5" />
          <line x1="15" y1="19" x2="15" y2="13" />
          <line x1="19" y1="19" x2="19" y2="9" />
        </svg>
      )
    case 'bell':
      return (
        <svg {...common}>
          <path d="M12 3a5 5 0 0 0-5 5v3c0 1-1 2-2 3h14c-1-1-2-2-2-3V8a5 5 0 0 0-5-5z" />
          <path d="M9.5 20a2.5 2.5 0 0 0 5 0" />
        </svg>
      )
    case 'broadcast':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2" />
          <path d="M8.5 15.5a5 5 0 0 1 0-7M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M5.5 18.5a9 9 0 0 1 0-13M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      )
    case 'console':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 9l3 3-3 3M13 15h4" />
        </svg>
      )
    case 'lock':
      return (
        <svg {...common}>
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          <circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'anchor':
      return (
        <svg {...common}>
          <circle cx="12" cy="5" r="2.5" />
          <path d="M12 7.5V21" />
          <path d="M5 13a7 7 0 0 0 14 0" />
          <path d="M8.5 10.5h7" />
        </svg>
      )
    case 'swap':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="11" height="9" rx="2" />
          <rect x="10" y="11" width="11" height="9" rx="2" />
        </svg>
      )
    case 'coin':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10M14.6 9.6a2.8 2.8 0 0 0-2.6-1.4c-1.6 0-2.6.8-2.6 2s1 1.8 2.6 2 2.8.6 2.8 2-1.2 2-2.8 2a3 3 0 0 1-2.7-1.4" />
        </svg>
      )
    case 'cloud':
      return (
        <svg {...common}>
          <path d="M6.5 19a4.5 4.5 0 0 1 0-9 6 6 0 0 1 11.6-1.8A4 4 0 0 1 17.5 16" />
          <path d="M6.5 19h11" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5.5c0 4.3-2.9 7.7-7 9.5-4.1-1.8-7-5.2-7-9.5V6l7-3z" />
        </svg>
      )
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M15.8 15.8L21 21" />
        </svg>
      )
    case 'code':
      return (
        <svg {...common}>
          <path d="M8.5 8L4 12l4.5 4M15.5 8l4.5 4-4.5 4M13.5 5l-3 14" />
        </svg>
      )
    case 'braces':
      return (
        <svg {...common}>
          <path d="M9 4c-2 0-2.5 1-2.5 3S6 10.5 4.5 10.5C6 10.5 6.5 12 6.5 14S7 20 9 20" />
          <path d="M15 4c2 0 2.5 1 2.5 3s.5 3.5 2 3.5c-1.5 0-2 1.5-2 3.5s-.5 6-2.5 6" />
        </svg>
      )
    case 'file-code':
      return (
        <svg {...common}>
          <path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4z" />
          <path d="M14 3v4h4" />
          <path d="M10.5 12L9 14l1.5 2M13.5 12L15 14l-1.5 2" />
        </svg>
      )
    case 'route':
      return (
        <svg {...common}>
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <path d="M8.5 18h5a4 4 0 0 0 0-8h-3a4 4 0 0 1 0-8" />
        </svg>
      )
    case 'check-list':
      return (
        <svg {...common}>
          <path d="M3.5 7l2 2 3.5-3.5M3.5 17l2 2 3.5-3.5" />
          <path d="M12 7h9M12 17h9" />
        </svg>
      )
    default:
      return null
  }
}

// Categories without a real vendor logo set pass no `basePath` — they draw
// the inline glyph directly rather than requesting an SVG that isn't there.
function ServiceIcon({ slug, glyph, basePath }) {
  const [imgFailed, setImgFailed] = useState(false)
  if (!basePath || imgFailed) return <Glyph type={glyph} />
  return (
    <img
      src={`${basePath}/${slug}.svg`}
      alt=""
      draggable={false}
      onError={() => setImgFailed(true)}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}

export default ServiceIcon
