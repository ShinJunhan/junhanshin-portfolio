import { useEffect, useState } from 'react'

// Hash routing rather than history routing: this app ships as static files
// behind a CDN, and a hash needs no rewrite rule to survive a hard refresh or
// a shared deep link.
//
//   #/                     welcome state
//   #/projects/<slug>      one project page

const PROJECT_PREFIX = '#/projects/'

export function projectHref(slug) {
  return `${PROJECT_PREFIX}${slug}`
}

function readSlug() {
  const hash = window.location.hash
  return hash.startsWith(PROJECT_PREFIX) ? decodeURIComponent(hash.slice(PROJECT_PREFIX.length)) : null
}

export function useHashRoute() {
  const [slug, setSlug] = useState(readSlug)

  useEffect(() => {
    const onChange = () => setSlug(readSlug())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return slug
}
