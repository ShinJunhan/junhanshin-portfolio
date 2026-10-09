import { useEffect, useRef, useState } from 'react'
import {
  ArchiveIcon,
  CloseIcon,
  GithubIcon,
  HybridIcon,
  NotionIcon,
  PageIcon,
  PeopleIcon,
  SlidesIcon,
  TableIcon,
} from '../icons.jsx'

// The workspace as four tiles in a 2x2 grid. Pointing at a tile stretches the
// grid around it: that tile becomes the large cell and shows its panel, and
// the other three shrink but keep their own corners, so nothing is ever
// reordered and the reader always knows which one they are on. Moving off the
// grid relaxes it back to four equal tiles.
//
// On a touch screen there is no hover, so a tap opens a tile, a tap on another
// switches, and the close button or a tap outside relaxes it. The grid shape
// for each open tile lives in the CSS, keyed on `data-open`.

const TILE_ICONS = {
  github: GithubIcon,
  notion: NotionIcon,
  infrastructure: HybridIcon,
  presentation: SlidesIcon,
}

const ROW_ICONS = { page: PageIcon, table: TableIcon, people: PeopleIcon, archive: ArchiveIcon }

// Tiles slide under a still cursor while the page scrolls, and the browser
// reports that as the pointer moving onto them. Hover is ignored for this
// long after a scroll, so a reader skimming past never opens anything.
const SCROLL_QUIET_MS = 400

function GitPanel({ body }) {
  return (
    <div className="ws-git">
      <div className="ws-git__lanes">
        {body.lanes.map((lane, i) => (
          <div key={lane.who}>
            {i > 0 && (
              <div className="ws-git__pr">
                <span aria-hidden="true">▲ PR</span>
                <i>{body.lanes[i - 1].note}</i>
              </div>
            )}
            <div className={'ws-git__lane' + (lane.mine ? ' ws-git__lane--mine' : '')}>
              <span className="ws-git__branch">
                {lane.branch.map((b) => (
                  <span key={b}>{b}</span>
                ))}
              </span>
              <span className="ws-git__who">
                <b>{lane.who}</b>
                {lane.text}
              </span>
            </div>
          </div>
        ))}
      </div>
      <ul className="ws-git__stats">
        {body.stats.map((stat) => (
          <li key={stat.label}>
            <b>{stat.value}</b>
            {stat.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

function DocsPanel({ body }) {
  return (
    <ul className="ws-docs">
      {body.rows.map((row) => {
        const Icon = ROW_ICONS[row.icon]
        return (
          <li key={row.title}>
            <Icon />
            <span>
              <b>{row.title}</b>
              <small>{row.text}</small>
            </span>
            {row.count != null && <span className="ws-docs__count">{row.count}</span>}
          </li>
        )
      })}
    </ul>
  )
}

function NetworkPanel({ body }) {
  const [left, right] = body.zones
  const zone = (z) => (
    <div className="ws-net__zone">
      <p className="ws-net__zone-name">
        {z.name}
        <em>{z.range}</em>
      </p>
      <ul>
        {z.hosts.map((host) => (
          <li key={host.name} className={host.router ? 'ws-net__router' : undefined}>
            <b>
              {host.name}
              {host.subnet && <span>{host.subnet}</span>}
            </b>
            <span className="ws-net__role">{host.role}</span>
            {host.router && (
              <>
                <span className="ws-net__routes">Routes {z.range.split(' ')[0]}</span>
                <span className="ws-net__tag">
                  {body.link}: {host.router}
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="ws-net">
      <div className="ws-net__map">
        {zone(left)}
        <div className="ws-net__link" aria-hidden="true">
          <i />
          <span>{body.link}</span>
          <i />
        </div>
        {zone(right)}
      </div>
      <p className="ws-net__note">{body.note}</p>
    </div>
  )
}

function SlidesPanel({ body }) {
  return (
    <div className="ws-slides">
      {body.slides.map((slide) => (
        <figure key={slide.number}>
          <img src={slide.src} alt={`Slide ${slide.number}: ${slide.caption}`} loading="lazy" />
          <figcaption>
            <b>{slide.number}</b>
            {slide.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

const PANELS = { git: GitPanel, docs: DocsPanel, network: NetworkPanel, slides: SlidesPanel }

export default function WorkspaceTiles({ tiles, links }) {
  const [open, setOpen] = useState(null)
  const rootRef = useRef(null)
  const lastScroll = useRef(0)
  // After the close button, the tile left under the cursor must not reopen at
  // once. Hover stays off until the pointer reaches a different tile.
  const hold = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      lastScroll.current = Date.now()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null)
    }
    // A tap outside the grid closes it; with a mouse, leaving the grid already
    // has, so this only matters on touch.
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(null)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [])

  const hover = (id) => (e) => {
    if (e.pointerType !== 'mouse') return
    if (Date.now() - lastScroll.current < SCROLL_QUIET_MS) return
    if (hold.current) {
      if (hold.current.first === undefined) hold.current.first = id
      if (hold.current.first === id) return
      hold.current = null
    }
    if (open !== id) setOpen(id)
  }

  const close = (e) => {
    e.stopPropagation()
    hold.current = {}
    setOpen(null)
  }

  return (
    <div
      ref={rootRef}
      className={'ws-tiles' + (open ? ' ws-tiles--open' : '')}
      data-open={open ? tiles.findIndex((t) => t.id === open) : undefined}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse') return
        hold.current = null
        setOpen(null)
      }}
    >
      {tiles.map((tile) => {
        const Icon = TILE_ICONS[tile.id]
        const Panel = PANELS[tile.body.type]
        const isOpen = open === tile.id
        const href = links?.[tile.link]
        return (
          <div
            key={tile.id}
            className={'ws-tile' + (isOpen ? ' ws-tile--open' : '')}
            onPointerMove={hover(tile.id)}
          >
            <button
              type="button"
              className="ws-tile__face"
              aria-expanded={isOpen}
              aria-controls={`ws-panel-${tile.id}`}
              onClick={() => setOpen(tile.id)}
            >
              <span className="ws-tile__mark" aria-hidden="true">
                <Icon />
              </span>
              <span className="ws-tile__name">
                <b>{tile.name}</b>
                <span className="ws-tile__headline">{tile.headline}</span>
                <small>
                  <span>{tile.figure.value}</span> {tile.figure.label}
                </small>
              </span>
              <span className="ws-tile__watermark" aria-hidden="true">
                <Icon />
              </span>
            </button>

            {isOpen && (
              <>
                <button type="button" className="ws-tile__close" aria-label="Close" onClick={close}>
                  <CloseIcon />
                </button>
                <div className="ws-tile__panel" id={`ws-panel-${tile.id}`}>
                  <Panel body={tile.body} />
                  <p className="ws-tile__foot">
                    <span>{tile.footnote}</span>
                    {href && (
                      <a href={href} target="_blank" rel="noreferrer">
                        {tile.linkLabel} ↗
                      </a>
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
