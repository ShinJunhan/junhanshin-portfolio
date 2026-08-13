import { createContext } from 'react'

// One trigger per band drives both its heading and its detail, so the
// detail's delay is always measured from the moment the heading started
// rather than from its own independent in-view crossing. Lives in its own
// module so Timeline and SkillsCarousel don't import each other in a cycle.
export const BandReveal = createContext(false)
