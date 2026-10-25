import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

// The workspace as the four places the team worked, beside At a Glance.
// `workspace` is `workspaceApps` in src/data/projects.js.
//
// The column is held to At a Glance's height: its contents sit in an
// absolutely placed layer, so nothing in here can stretch the row. Three
// states share that height.
//
//   none  every card closed, each showing one figure, a sentence and a foot
//         line, and the four cards share the column between them
//   one   one card open and filling the column, the others down to their
//         header row; the open body scrolls if a narrow window runs it long
//   all   Expand all: every card open, and the column scrolls on its own
//
// Height changes glide rather than jump: each card's height is measured
// before and after a change and animated between the two. Only height moves.
// Header padding is the same in every state, "Expand" and "Open" crossfade
// in one slot, hover effects pause while cards move (`is-moving`), and the
// content a card is losing fades out over a copy of itself instead of
// vanishing. Below the 940px page container the row stacks and the lock is
// released (see global.css).

const GLIDE = { duration: 460, easing: 'cubic-bezier(.22,1,.36,1)' }
const MOVING_MS = 560

// A card's own content, never a fading copy left by the last glide.
const contentOf = (el) =>
  el.querySelector(':scope > .wa-app__bd:not(.wa-ghost), :scope > .wa-app__pv:not(.wa-ghost)')

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Soft fades at the edges of a scroll area, shown only where there is more
// to scroll to, so the last line is never left under a fade.
function useScrollFade(ref, active) {
  useEffect(() => {
    const el = ref.current
    if (!el || !active) return undefined
    const update = () => {
      el.classList.toggle('is-more', el.scrollTop + el.clientHeight < el.scrollHeight - 4)
      el.classList.toggle('is-less', el.scrollTop > 4)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      observer.disconnect()
      el.classList.remove('is-more', 'is-less')
    }
  }, [ref, active])
}

function Foot({ item }) {
  if (typeof item === 'string') return <span>{item}</span>
  return (
    <span>
      {item.label} <b className="wa-person">{item.person}</b>
    </span>
  )
}

// How many rows a block takes, so the open card can share its height between
// blocks in proportion (`--rows` in global.css) instead of leaving one gap.
function rowsOf(block) {
  if (block.type !== 'list') return 1
  return block.two ? Math.ceil(block.items.length / 2) : block.items.length
}

function List({ block }) {
  return (
    <div style={{ '--rows': rowsOf(block) }}>
      {block.label && <p className="wa-lab">{block.label}</p>}
      <ul className={'wa-list' + (block.two ? ' wa-list--two' : '')}>
        {block.items.map((item, i) => (
          <li key={i}>
            <span className="wa-list__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>
              <b>{item.name}</b>
            </span>
            <em>{item.end ?? ''}</em>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Terminal({ block }) {
  return (
    <div style={{ '--rows': rowsOf(block) }}>
      <p className="wa-lab">{block.label}</p>
      <pre className="wa-term">
        {block.lines.map((line, i) => (
          <span key={i}>
            <span className="wa-term__p">$</span> {line.cmd}{' '}
            <span className="wa-term__c"># {line.note}</span>
            {'\n'}
          </span>
        ))}
      </pre>
    </div>
  )
}

function Block({ block }) {
  if (block.type === 'list') return <List block={block} />
  if (block.type === 'terminal') return <Terminal block={block} />
  if (block.type === 'lead') {
    return (
      <p className="wa-kv">
        <span aria-hidden="true">{block.icon}</span>
        <span className="wa-lab">{block.label}</span>
        <b className="wa-person">{block.person}</b>
      </p>
    )
  }
  return null
}

function Tabs({ block }) {
  const [active, setActive] = useState(0)
  const paneRef = useRef(null)

  useEffect(() => {
    if (reducedMotion()) return
    paneRef.current?.animate(
      [
        { opacity: 0, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 260, easing: 'ease-out' }
    )
  }, [active])

  const tab = block.tabs[active]
  return (
    <>
      <div className="wa-pills" role="tablist">
        {block.tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={i === active ? 'is-on' : ''}
            onClick={(e) => {
              e.stopPropagation()
              setActive(i)
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div ref={paneRef} className={'wa-pane' + (tab.tools ? ' wa-pane--tools' : '')} role="tabpanel">
        {tab.blocks.map((b, i) => (
          <Block key={i} block={b} />
        ))}
      </div>
    </>
  )
}

function Body({ blocks }) {
  if (blocks.length === 1 && blocks[0].type === 'tabs') return <Tabs block={blocks[0]} />
  return (
    <div className="wa-blocks">
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </div>
  )
}

function App({ app, open, mode, onToggle, appRef }) {
  const bodyRef = useRef(null)
  const bodyId = `wa-body-${app.id}`
  useScrollFade(bodyRef, open && mode === 'one')

  return (
    <section
      ref={appRef}
      className={
        `wa-app wa-app--${app.id}` + (open ? ' is-open' : '') + (app.mine ? ' wa-app--mine' : '')
      }
      onClick={(e) => {
        if (open || e.target.closest('a, button')) return
        onToggle()
      }}
    >
      <div
        className="wa-app__hd"
        onClick={(e) => {
          if (!open || e.target.closest('a, button')) return
          onToggle()
        }}
      >
        <span className={`wa-logo wa-logo--${app.id}`} aria-hidden="true">
          {app.logo}
        </span>
        <div className="wa-app__name">
          <h3>{app.title}</h3>
          <span>{app.subtitle}</span>
        </div>
        {app.href ? (
          <a className="wa-app__meta wa-app__meta--link" href={app.href} target="_blank" rel="noreferrer">
            Open <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span className="wa-app__meta">{app.meta}</span>
        )}
        <span className="wa-app__hint" aria-hidden="true">
          Expand
        </span>
        <button
          type="button"
          className="wa-app__tog"
          aria-expanded={open}
          aria-controls={bodyId}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${app.title}`}
          onClick={onToggle}
        >
          {open ? '−' : '+'}
        </button>
      </div>

      {!open && mode === 'none' && (
        <div className="wa-app__pv">
          <div className="wa-app__fig">
            <b>{app.figure.value}</b>
            <span>{app.figure.label}</span>
          </div>
          <div className="wa-app__txt">
            {app.sentence && <p>{app.sentence}</p>}
            <p className="wa-app__foot">
              {app.foot.map((item, i) => (
                <Foot key={i} item={item} />
              ))}
            </p>
          </div>
        </div>
      )}

      {open && (
        <div className="wa-app__bd" id={bodyId} ref={bodyRef}>
          <Body blocks={app.body} />
        </div>
      )}
    </section>
  )
}

export default function WorkspaceApps({ workspace }) {
  const apps = workspace.apps
  const [state, setState] = useState({ mode: 'none', open: [] })
  const appRefs = useRef([])
  const stackRef = useRef(null)
  const before = useRef(null)
  const prevOpen = useRef([])
  const ghosts = useRef([])
  const [moving, setMoving] = useState(false)
  const movingTimer = useRef(null)

  useEffect(() => () => clearTimeout(movingTimer.current), [])

  useScrollFade(stackRef, state.mode === 'all')

  // Measure every card before the change; the layout effect below measures
  // again after it and animates the difference.
  const change = useCallback(
    (next) => {
      const els = appRefs.current
      // A click during a glide starts from where the cards are on screen
      // right now, so read the heights while the last glide is still
      // running. Then stop it and drop every size it pinned, so nothing
      // left over skews the new final measurement.
      before.current = els.map((el) => el?.getBoundingClientRect().height ?? 0)
      els.forEach((el) => {
        if (!el) return
        el.getAnimations({ subtree: true }).forEach((a) => a.cancel())
        el.querySelectorAll(':scope > .wa-ghost').forEach((g) => g.remove())
      })
      els.forEach((el) => {
        if (!el) return
        el.style.flex = ''
        el.style.overflow = ''
        const content = contentOf(el)
        if (content) {
          content.style.flex = ''
          content.style.height = ''
        }
      })
      // Copy what each card shows now, so content that unmounts can fade out
      // in place rather than disappear before the card has moved.
      ghosts.current = els.map((el) => {
        const content = el && contentOf(el)
        if (!content) return null
        const copy = content.cloneNode(true)
        copy.removeAttribute('id')
        copy.setAttribute('aria-hidden', 'true')
        copy.classList.add('wa-ghost')
        copy.style.top = `${content.offsetTop}px`
        copy.style.height = `${content.offsetHeight}px`
        return { node: content, copy }
      })
      prevOpen.current = state.open
      clearTimeout(movingTimer.current)
      setMoving(true)
      movingTimer.current = setTimeout(() => setMoving(false), MOVING_MS)
      setState(next)
    },
    [state.open]
  )

  useLayoutEffect(() => {
    const from = before.current
    const copies = ghosts.current
    before.current = null
    ghosts.current = []
    if (!from || reducedMotion()) return
    // Read every final size before touching any card. Pinning one card to its
    // starting height changes the space the others get, so measuring as we
    // go would aim later cards at the wrong height and snap them at the end.
    const finals = appRefs.current.map((el) => {
      if (!el) return null
      const content = contentOf(el)
      return {
        to: el.getBoundingClientRect().height,
        content,
        contentHeight: content?.getBoundingClientRect().height ?? 0,
      }
    })
    appRefs.current.forEach((el, i) => {
      if (!el) return
      const { to, content, contentHeight } = finals[i]
      const resized = Math.abs(to - from[i]) >= 1

      if (resized) {
        // Only the card's height moves. The content is held at its final
        // size for the whole glide and the card's edge reveals or hides it;
        // left to fill the card, the rows would re-space on every frame.
        if (content) {
          content.style.flex = 'none'
          content.style.height = `${contentHeight}px`
        }
        el.style.flex = 'none'
        el.style.overflow = 'hidden'
        el.animate([{ height: `${from[i]}px` }, { height: `${to}px` }], GLIDE)
          .finished.then(() => {
            el.style.flex = ''
            el.style.overflow = ''
            if (content) {
              content.style.flex = ''
              content.style.height = ''
            }
          })
          .catch(() => {})
      }

      // Content the card lost fades out quickly over a copy of itself; new
      // content fades in just behind it, so the two barely overlap.
      const ghost = copies[i]
      if (ghost && !el.contains(ghost.node)) {
        el.appendChild(ghost.copy)
        ghost.copy
          .animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: 'ease-out', fill: 'forwards' })
          .finished.then(() => ghost.copy.remove())
          .catch(() => {})
      }

      const id = apps[i].id
      const opened = state.open.includes(id) !== prevOpen.current.includes(id)
      if (content && (opened || (ghost && !el.contains(ghost.node)))) {
        content.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 280,
          delay: 120,
          easing: 'ease-out',
          fill: 'backwards',
        })
      }
    })
  }, [state, apps])

  const toggle = (id) => {
    const isOpen = state.open.includes(id)
    if (state.mode === 'all') {
      const open = isOpen ? state.open.filter((x) => x !== id) : [...state.open, id]
      change(open.length ? { mode: 'all', open } : { mode: 'none', open: [] })
      return
    }
    change(isOpen ? { mode: 'none', open: [] } : { mode: 'one', open: [id] })
  }

  const all = state.mode === 'all'
  const toggleAll = () => {
    if (stackRef.current) stackRef.current.scrollTop = 0
    change(all ? { mode: 'none', open: [] } : { mode: 'all', open: apps.map((a) => a.id) })
  }

  return (
    <div className={`wa wa--${state.mode}` + (moving ? ' is-moving' : '')}>
      <div className="wa__in">
        <div className="wa__bar">
          <span className="wa-lab">{workspace.label}</span>
          <button type="button" className="wa__all" onClick={toggleAll}>
            <span aria-hidden="true">{all ? '⊟' : '⊞'}</span> {all ? 'Collapse all' : 'Expand all'}
          </button>
        </div>
        <div className="wa__stack" ref={stackRef}>
          {apps.map((app, i) => (
            <App
              key={app.id}
              app={app}
              mode={state.mode}
              open={state.open.includes(app.id)}
              onToggle={() => toggle(app.id)}
              appRef={(el) => (appRefs.current[i] = el)}
            />
          ))}
          {all && (
            <p className="wa__end">
              <button
                type="button"
                onClick={() => stackRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                ↑ Back to top
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
