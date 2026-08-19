import BrowserPanel from '../BrowserPanel.jsx'
import EmptySlot from './EmptySlot.jsx'

// Screenshots and the demo video.
//
// The screenshots are a tab per scenario, and each tab shows that scenario's
// before and after **stacked**, not side by side. Stacking is what makes the
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

export default function MediaSection({ project }) {
  const { scenarios = [], video = null } = project.media ?? {}

  if (scenarios.length === 0 && !video) {
    return <EmptySlot>No screenshots or demo video added yet.</EmptySlot>
  }

  return (
    <div className="media">
      {scenarios.length > 0 && (
        <BrowserPanel
          label="Scenarios"
          tabs={scenarios.map((scenario, i) => ({
            id: scenario.id ?? `scenario-${i}`,
            label: scenario.tab ?? scenario.label ?? `Scenario ${i + 1}`,
            address: scenario.label ?? scenario.tab ?? `Scenario ${i + 1}`,
            render: () => (
              <div className="shots">
                <Shot shot={scenario.before} state="Before" />
                <Shot shot={scenario.after} state="After" />
              </div>
            ),
          }))}
        />
      )}
      {video ? (
        <Video video={video} />
      ) : (
        /* Screenshots without a video: say the video is still pending rather
           than letting a half-filled section look finished. */
        <EmptySlot>No demo video added yet.</EmptySlot>
      )}
    </div>
  )
}
