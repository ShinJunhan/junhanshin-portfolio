import { useEffect, useState } from 'react'

// Watches a media query from JS. Needed where a breakpoint changes *what*
// renders rather than how it looks — CSS alone cannot swap one component for
// another, and rendering both and hiding one would leave the hidden one's
// timers and observers running.
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (event) => setMatches(event.matches)

    setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
