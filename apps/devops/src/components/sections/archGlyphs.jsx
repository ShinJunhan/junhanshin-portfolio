// The mark vocabulary an architecture diagram draws from. Same discipline as
// decisionGlyphs.jsx: drawn at one stroke weight in one 24x24 box, never an
// emoji and never a vendor logo — a diagram that mixes brand colours with the
// page's single accent reads as two colour systems fighting.
//
// A node names its mark with `glyph` in the diagram data, so this file holds
// no per-project knowledge. An unknown name falls back to `service`.
//
// These are fragments, not components: ArchDiagram drops them straight into a
// transformed `<g>`, which is what lets one scale factor size every mark.

/* eslint-disable react/jsx-key */
export const GLYPH_PATHS = {
  // A generic running thing. The default, and the honest answer whenever a
  // more specific mark would be a guess.
  service: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <circle cx="6.5" cy="7.5" r="0.9" />
      <circle cx="6.5" cy="16.5" r="0.9" />
    </>
  ),

  // One machine.
  server: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M4 9h16M4 15h16" />
      <circle cx="7.5" cy="6" r="0.9" />
    </>
  ),

  // Persistent storage with a shape everyone already reads as a database.
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
      <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
    </>
  ),

  // Object storage: a bucket, not a disk.
  bucket: (
    <>
      <path d="M4 6h16l-1.6 14a1.5 1.5 0 0 1-1.5 1.3H7.1a1.5 1.5 0 0 1-1.5-1.3z" />
      <path d="M3 6h18" />
      <path d="M9.5 10.5v6M14.5 10.5v6" />
    </>
  ),

  // Traffic split across several backends.
  balancer: (
    <>
      <rect x="8.5" y="2.5" width="7" height="5.5" rx="1.2" />
      <path d="M12 8v3.5M5 21v-3.5M12 21v-3.5M19 21v-3.5" />
      <path d="M5 14.5h14M12 11.5v3" />
      <path d="M5 14.5v3M19 14.5v3" />
    </>
  ),

  // The provider edge — a cloud outline, used for anything that is "outside".
  cloud: (
    <path d="M7.2 19.5A4.2 4.2 0 0 1 7 11.1a5.6 5.6 0 0 1 10.7-1.4 3.9 3.9 0 0 1-.5 9.8z" />
  ),

  // A dial: metrics being collected and read.
  monitor: (
    <>
      <path d="M3.5 16a9 9 0 1 1 17 0" />
      <path d="M12 16l4.2-4.6" />
      <circle cx="12" cy="16" r="1.4" />
      <path d="M3.5 16h2M18.5 16h2" />
    </>
  ),

  // Something has fired.
  alert: (
    <>
      <path d="M12 3.5 21.2 19.5H2.8z" />
      <path d="M12 9.5v4.5" />
      <circle cx="12" cy="16.8" r="0.9" />
    </>
  ),

  // A commit graph: version control, or a branch strategy.
  git: (
    <>
      <circle cx="6.5" cy="6" r="2.5" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="12" r="2.5" />
      <path d="M6.5 8.5v7" />
      <path d="M6.5 12h4a4 4 0 0 0 4 0" />
    </>
  ),

  // A pipeline stage running.
  pipeline: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10 8.5 16 12l-6 3.5z" />
    </>
  ),

  // A gate that can refuse: the security check in a delivery path.
  shield: (
    <>
      <path d="M12 2.8 20 6v6.3c0 4.6-3.3 7.7-8 8.9-4.7-1.2-8-4.3-8-8.9V6z" />
      <path d="m8.8 12 2.3 2.4 4.1-4.6" />
    </>
  ),

  // Looking for something that should not be there.
  scan: (
    <>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m15.4 15.4 5 5" />
      <path d="M8 10.8h5.6" />
    </>
  ),

  // A secret.
  key: (
    <>
      <circle cx="8" cy="12" r="4.2" />
      <path d="M12.2 12H21" />
      <path d="M17.5 12v3.4M20 12v2.4" />
    </>
  ),

  // A container.
  container: (
    <>
      <rect x="3" y="9" width="18" height="11" rx="1.5" />
      <path d="M7.5 9V5.5h9V9" />
      <path d="M8 13h3.5M8 16.5h8" />
    </>
  ),

  // An orchestrated group of them.
  cluster: (
    <>
      <rect x="2.5" y="3" width="8" height="8" rx="1.4" />
      <rect x="13.5" y="3" width="8" height="8" rx="1.4" />
      <rect x="2.5" y="13" width="8" height="8" rx="1.4" />
      <rect x="13.5" y="13" width="8" height="8" rx="1.4" />
    </>
  ),

  // Work waiting to be picked up.
  queue: (
    <>
      <rect x="2.5" y="7" width="5" height="10" rx="1.2" />
      <rect x="9.5" y="7" width="5" height="10" rx="1.2" />
      <rect x="16.5" y="7" width="5" height="10" rx="1.2" />
    </>
  ),

  // A prediction, a trend, a forecast.
  forecast: (
    <>
      <path d="M3 20h18" />
      <path d="M3 20V4" />
      <path d="m5.5 15.5 4-4.5 3.5 3 5.5-7" />
      <path d="M15 7h3.5v3.5" />
    </>
  ),

  // Automation applied to a fleet.
  wrench: (
    <>
      <path d="M15.6 3.2a5.6 5.6 0 0 0-6.4 7.2L3 16.6 7.4 21l6.2-6.2a5.6 5.6 0 0 0 7.2-6.4L17.6 12h-2.9l-1.4-1.4V7.7z" />
    </>
  ),

  // A person, at the far end of the system.
  user: (
    <>
      <circle cx="12" cy="7.5" r="3.8" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </>
  ),

  // Name resolution / the front door.
  dns: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.2 12h17.6" />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
    </>
  ),

  // Edge cache.
  cdn: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v5.8M12 15.2V21M3 12h5.8M15.2 12H21" />
      <circle cx="12" cy="3" r="1.4" />
      <circle cx="12" cy="21" r="1.4" />
      <circle cx="3" cy="12" r="1.4" />
      <circle cx="21" cy="12" r="1.4" />
    </>
  ),

  // A private tunnel between two networks.
  vpn: (
    <>
      <rect x="2.5" y="9.5" width="7" height="9" rx="1.4" />
      <rect x="14.5" y="9.5" width="7" height="9" rx="1.4" />
      <path d="M9.5 14h5" />
      <path d="M6 9.5V7a6 6 0 0 1 12 0v2.5" />
    </>
  ),

  // A message going out to people.
  chat: (
    <>
      <path d="M3 5.5h18v11H9.5L5 20.5V16.5H3z" />
      <path d="M7 9h10M7 12.5h6" />
    </>
  ),

  // Something being broken on purpose.
  chaos: (
    <>
      <path d="M13.5 2.5 5 13.5h5.5L9.5 21.5 18.5 10h-5.5z" />
    </>
  ),
}
/* eslint-enable react/jsx-key */
