import { useEffect, useRef, useState } from 'react'
import BrowserPanel from '../BrowserPanel.jsx'
import RichText from '../../lib/richText.jsx'
import useMediaQuery from '../../lib/useMediaQuery.js'
import EmptySlot from './EmptySlot.jsx'

// Screenshots and the demo video.
//
// A scenario is one tab, and one tab is one read down the page: what happened,
// then the clip of it happening, then the stills for looking closer. There is
// deliberately no control switching between the last two. A reader who finds
// the clip unclear should find the sharper evidence by scrolling, not by
// discovering a toggle.
//
// The `lead` is the scenario's explanation and comes first, at reading size in
// the body face. It used to sit under the clip as a caption, where it read as
// a label on a picture and was easy to skip. Above the clip it is read before
// the loop starts, which is also the order that helps: you know what to watch
// for before it happens.
//
// A scenario may carry a clip, stills, or both. Where a section has clips at
// all, each part goes under its own heading — Demo and Screenshots — built
// from the same `Register`, so the two read as two views of one event.
// Labelling only the stills was worse than labelling neither: it made the clip
// look like preamble to the part that had a name.
//
// The headings are a property of the section, not of the scenario: hailcast
// has two scenarios with no clip to show (one is a simulation chart, the other
// a board that exists in the report deck and in neither recording), and they
// keep their Screenshots heading so the labels do not come and go along the
// tab strip. A section with no clips anywhere renders stills the way it always
// did, with no headings at all.
//
// A shot may override its own caption with `state`. Not every scenario is a
// before-and-after: a baseline has nothing to compare against, and an attack
// run is better labelled by what the shot proves — "99% of requests blocked"
// says more than "After" does. The default stays Before/After, so a project
// that pairs its shots the ordinary way writes nothing extra. Stacking is what makes the
// pair readable: at half the column width each shot was too small to see what
// had changed, which is the entire reason both are here. One tab per scenario
// also means the section no longer runs to eight full-width images.
//
// The video is either a file served from `public/` (`kind: 'file'`) or an
// embed URL from a host (`kind: 'embed'`) — both render into the same 16:9
// frame, so which one a project uses is a data decision rather than a layout
// one. It sits below the tabs rather than inside them: it is not a scenario.
function Video({ video }) {
  return (
    <figure className="figure">
      <div className="figure__frame figure__frame--video">
        {video.kind === 'embed' ? (
          <iframe
            src={video.src}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <video src={video.src} poster={video.poster} controls preload="metadata" />
        )}
      </div>
      {video.caption && <figcaption className="figure__caption">{video.caption}</figcaption>}
    </figure>
  )
}

// A scenario's clip: silent, looping, and running only while it is on screen.
//
// Three attributes are load-bearing and none of them is optional. Autoplay is
// granted only to a muted video, `playsInline` is what stops iOS taking the
// clip fullscreen the moment it starts, and `loop` is the whole point. Drop
// any one and the clip still works on the machine it was built on while
// failing somewhere else.
//
// Anything that moves on its own for more than five seconds needs a way to
// stop it, so the frame carries its own control (WCAG 2.2.2). A visitor whose
// system asks for reduced motion gets the poster frame and a play button
// instead of motion they did not ask for, and the same control starts it if
// they want it after all.
//
// Playback follows visibility as well as intent. A clip three sections above
// the fold decodes for nobody, so it is paused until it is actually on screen.
//
// It carries no caption. The scenario's `lead` above it is the explanation and
// its register heading names it, so a caption here would be a third place
// competing for the same job.
function Clip({ clip }) {
  const videoRef = useRef(null)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [paused, setPaused] = useState(false)
  // One flag for "should not be moving", whichever of the two reasons applies.
  const held = paused || reduced

  useEffect(() => {
    const el = videoRef.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        // play() rejects when the browser declines autoplay, which is not an
        // error worth surfacing: the control is right there.
        if (entry.isIntersecting && !held) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.2 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [held])

  return (
    // The frame takes the clip's own ratio, so every clip renders at full
    // column width with nothing around it.
    //
    // It used to be a fixed 1280x608, which was not a designed ratio: it was
    // EchoChallengers' encode, set when that was the only project with clips.
    // Everything added since sat letterboxed inside it — hailcast by 16% of
    // the width, ShimonVault and this project by about 25% — and the bars went
    // unnoticed for months because they were black against a black video.
    //
    // `width` and `height` come from the file itself and are here to reserve
    // the right height before the video's metadata arrives. Without them the
    // frame has no height until it loads and the page jumps.
    <div
      className="figure__frame figure__frame--clip"
      style={clip.width && clip.height ? { aspectRatio: `${clip.width} / ${clip.height}` } : undefined}
    >
      <video
        ref={videoRef}
        src={clip.src}
        poster={clip.poster}
        autoPlay={!reduced}
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={clip.alt}
      />
      <button
        type="button"
        className="clip__toggle"
        onClick={() => setPaused((was) => !was)}
        aria-pressed={held}
      >
        {held ? 'Play' : 'Pause'}
      </button>
    </div>
  )
}

function Shot({ shot, state }) {
  if (!shot?.src) return null

  return (
    <figure className="figure shot">
      <figcaption className="shot__state">{state}</figcaption>
      <a className="figure__frame" href={shot.src} target="_blank" rel="noreferrer">
        <img src={shot.src} alt={shot.alt} loading="lazy" />
      </a>
    </figure>
  )
}

function Shots({ scenario }) {
  return (
    <>
      <Shot shot={scenario.before} state={scenario.before?.state ?? 'Before'} />
      <Shot shot={scenario.after} state={scenario.after?.state ?? 'After'} />
    </>
  )
}

// One labelled band inside a scenario. Both registers are built from this, so
// they are identical by construction rather than by two blocks of markup
// agreeing to look alike. That symmetry is the point: with the clip unlabelled
// and only the stills named, the tab read as a video with some pictures after
// it instead of as two views of one failure.
function Register({ title, badge, note, children }) {
  return (
    <div className="scenario__reg">
      <p className="scenario__reg-head">
        <span className="scenario__reg-title">{title}</span>
        {badge && <span className="clip__speed">{badge}</span>}
      </p>
      {note && (
        <p className="scenario__reg-note">
          <RichText>{note}</RichText>
        </p>
      )}
      {children}
    </div>
  )
}

// `labelled` is decided for the whole section rather than per scenario. Once
// any tab carries a clip, every tab uses the register headings, including the
// ones with nothing to play. Deciding it per scenario made the headings appear
// and disappear as a reader moved along the strip, which reads as the layout
// breaking rather than as a scenario having less in it.
//
// A project with no clips anywhere stays unlabelled, which is what a stills-only
// project renders as, unchanged from before clips existed.
function Scenario({ scenario, notes = {}, labelled = false }) {
  const hasClip = Boolean(scenario.clip?.src)
  const hasShots = Boolean(scenario.before?.src || scenario.after?.src)

  return (
    <div className="scenario">
      {scenario.lead && (
        <p className="scenario__lead">
          <RichText>{scenario.lead}</RichText>
        </p>
      )}

      {hasClip && (
        // The speed badge rides here rather than in the address bar: it
        // describes the clip, so it belongs on the clip's own label.
        <Register title="Demo" badge={scenario.clip.speed} note={scenario.clipNote ?? notes.clip}>
          <Clip clip={scenario.clip} />
        </Register>
      )}

      {hasShots &&
        (labelled ? (
          <Register title="Screenshots" note={scenario.stillsNote ?? notes.stills}>
            <Shots scenario={scenario} />
          </Register>
        ) : (
          // Nothing in this section to distinguish the stills from, so no
          // heading. This is the path a project with no clips at all takes.
          <div className="shots">
            <Shots scenario={scenario} />
          </div>
        ))}
    </div>
  )
}

export default function MediaSection({ project }) {
  // `clipNote` and `stillsNote` sit on `media` rather than on each scenario:
  // they describe where this project's footage came from, which is the same
  // answer for every scenario in it. A scenario may still override either.
  const { scenarios = [], video = null, clipNote, stillsNote } = project.media ?? {}

  if (scenarios.length === 0 && !video) {
    return <EmptySlot>No screenshots or demo video added yet.</EmptySlot>
  }

  // The "no demo video yet" slot is a reminder, and a project whose scenarios
  // already play clips has nothing left to be reminded of: the demo footage is
  // on the page, cut into the tabs. Asking for a video underneath it reads as
  // an unfinished section rather than as a note to self.
  //
  // A project still gets the reminder while its scenarios are stills only,
  // which is what keeps it useful for the pages that have not been filled in.
  // Setting `video` at any point renders it as before.
  const hasClips = scenarios.some((scenario) => scenario.clip?.src)

  return (
    <div className="media">
      {scenarios.length > 0 && (
        <BrowserPanel
          label="Scenarios"
          tabs={scenarios.map((scenario, i) => ({
            id: scenario.id ?? `scenario-${i}`,
            label: scenario.tab ?? scenario.label ?? `Scenario ${i + 1}`,
            address: scenario.label ?? scenario.tab ?? `Scenario ${i + 1}`,
            // Only the open tab is mounted, so a reader who never leaves the
            // first scenario never fetches the other three clips. Same rule
            // the architecture panel follows for its detailed exports.
            render: () => (
              <Scenario
                scenario={scenario}
                notes={{ clip: clipNote, stills: stillsNote }}
                labelled={hasClips}
              />
            ),
          }))}
        />
      )}
      {video && <Video video={video} />}
      {!video && !hasClips && <EmptySlot>No demo video added yet.</EmptySlot>}
    </div>
  )
}
