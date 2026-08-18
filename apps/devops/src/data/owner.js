// Whose site this is. Named in one place so the "this colour is his" rule has
// a single source of truth rather than a name string repeated across
// components.
//
// --name-pop is reserved for him site-wide: the welcome line, his avatar on
// every project, and the sidebar wordmark. Nothing else on the site may use
// it — see AVATAR_TINTS in components/Avatars.jsx, which deliberately holds no
// blue at all so a teammate's circle can never be mistaken for his.
export const OWNER = {
  name: 'Junhan Shin',
}

export function isOwner(member) {
  return member?.name === OWNER.name
}
