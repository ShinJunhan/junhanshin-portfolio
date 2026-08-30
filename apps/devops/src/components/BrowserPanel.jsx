import { useState } from 'react'

// The browser-window chrome, on its own so every panel that uses it stays
// identical by construction rather than by four components agreeing to look
// the same. A tab strip, an address bar naming what is on show, then the
// panel's body.
//
//   tabs   [{ id, label, address, render() }]
//          `label` is what the tab shows and should be short — the address bar
//          below carries the long form. `address` is either a path, which is
//          split at the last slash so the directory reads quiet and the file
//          reads in ink, or a plain phrase, which renders whole.
//   label  accessible name for the tab strip
//   mark   optional glyph for the address bar; the folder is the default
//
// The active tab is this component's own state: a panel that remembers which
// view you were on is the point of the pattern.
//
// ── Nested tabs ────────────────────────────────────────────────────────────
// A tab may carry `subTabs` instead of its own `address`/`render`/`footer`:
//
//   { id, label, subTabs: [{ id, label, address, render(), footer, aside }] }
//
// When such a tab is selected, a second strip appears between the tab strip
// and the address bar, and everything below — the address bar, the body, the
// footer — comes from the selected sub-tab rather than from the parent.
//
// This exists because a panel holding two documents and six source files was
// eight tabs wrapping onto two rows, where the eight were not peers: two are
// prose to read and six are the code underneath it. One level of nesting says
// that, and gets the strip back to one row.
//
// The two levels are deliberately not the same shape. The top row keeps the
// browser-tab silhouette with its shoulders; the nested row is a flat strip of
// chips on the address bar's own surface, so it reads as *belonging to* the
// selected tab rather than competing with it — the relationship a bookmarks
// bar has to a browser tab.
//
// A sub-selection is remembered per parent, so leaving the group and coming
// back finds the file you were on, for the same reason the top level does.

// `recovery/controller/config/recovery_map.yml` ->
//   { dir: 'recovery/controller/config/', base: 'recovery_map.yml' }
// A phrase with no slash in it comes back as all base, which is what we want:
// it renders in ink rather than as a greyed-out path.
export function splitPath(path = '') {
  const cut = path.lastIndexOf('/')
  if (cut === -1) return { dir: '', base: path }
  return { dir: path.slice(0, cut + 1), base: path.slice(cut + 1) }
}

// Drawn, not a glyph: the site has no emoji-as-icon anywhere.
function FolderMark() {
  return (
    <svg
      className="code__omnibox-mark"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.5h7A1.5 1.5 0 0 1 19 10v7a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 3 17z" />
    </svg>
  )
}

export default function BrowserPanel({ tabs = [], label, mark, onTabChange, children }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id)
  // Parent tab id -> the sub-tab selected inside it. Keyed by parent so two
  // groups never share a selection, and so returning to one restores it.
  const [subIds, setSubIds] = useState({})

  if (tabs.length === 0) return null

  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0]
  const subs = active.subTabs ?? []
  const activeSub = subs.length
    ? subs.find((sub) => sub.id === subIds[active.id]) ?? subs[0]
    : null

  // Everything below the tab strip reads from whichever of the two is
  // actually on show. A tab with sub-tabs carries no address or body of its
  // own — the group is a container, and its selected member is the view.
  const view = activeSub ?? active
  const { dir, base } = splitPath(view.address ?? '')

  const select = (id) => {
    setActiveId(id)
    onTabChange?.(id)
  }

  const selectSub = (subId) => setSubIds((current) => ({ ...current, [active.id]: subId }))

  return (
    <div className="code">
      <div className="code__browser">
        <div
          className="code__tabs"
          role={tabs.length > 1 ? 'tablist' : undefined}
          aria-label={tabs.length > 1 ? label : undefined}
        >
          {tabs.map((tab) =>
            tabs.length > 1 ? (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={tab.id === active.id}
                className={`code__tab${tab.id === active.id ? ' code__tab--on' : ''}`}
                onClick={() => select(tab.id)}
                title={tab.address ?? tab.label}
              >
                {tab.label}
              </button>
            ) : (
              /* One tab is a label, not a control — there is nothing to
                 switch to. */
              <span
                key={tab.id}
                className="code__tab code__tab--on code__tab--static"
                title={tab.address ?? tab.label}
              >
                {tab.label}
              </span>
            )
          )}
        </div>

        {/* The nested strip, on the address bar's own surface so the two read
            as one band hanging off the selected tab. Skipped entirely at one
            sub-tab: the address bar directly below already names it, and a
            strip of one is a label pretending to be a control. */}
        {subs.length > 1 && (
          <div className="code__subtabs" role="tablist" aria-label={`${active.label} files`}>
            {subs.map((sub) => (
              <button
                key={sub.id}
                type="button"
                role="tab"
                aria-selected={sub.id === view.id}
                className={`code__subtab${sub.id === view.id ? ' code__subtab--on' : ''}`}
                onClick={() => selectSub(sub.id)}
                title={sub.address ?? sub.label}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* Two elements, not one. The outer keeps the tinted fill the sub-tab
            strip above it has, so the band carries on past the baseline; the
            inner is the white bar, and the outer's padding is what leaves the
            tint showing all the way around it. */}
        {view.address && (
          <div className="code__omnibar">
            <div className="code__omnibox">
              {mark ?? <FolderMark />}
              <span className="code__omnibox-path">
                <span className="code__omnibox-dir">{dir}</span>
                <span className="code__omnibox-file">{base}</span>
              </span>
              {view.aside && <span className="code__omnibox-aside">{view.aside}</span>}
            </div>
          </div>
        )}

        {/* Every panel body is inset by the same pane, so a diagram, a code
            frame, a tree and a screenshot pair all sit the same distance from
            the chrome and each keeps its own border. */}
        <div className="code__pane">{view.render()}</div>
      </div>

      {/* Controls that belong to the active tab — an expand toggle, say — go
          below the window rather than inside it: inside, the rounded corner
          clipped them. */}
      {view.footer && <div className="code__foot">{view.footer}</div>}

      {children}
    </div>
  )
}
