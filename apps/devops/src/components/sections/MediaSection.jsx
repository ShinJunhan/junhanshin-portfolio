import EmptySlot from './EmptySlot.jsx'

// Screenshots and the demo video. The video is either a file served from
// `public/` (`kind: 'file'`) or an embed URL from a host (`kind: 'embed'`) —
// both render into the same 16:9 frame, so which one a project uses is a data
// decision rather than a layout one.
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

export default function MediaSection({ project }) {
  const { screenshots = [], video = null } = project.media ?? {}

  if (screenshots.length === 0 && !video) {
    return <EmptySlot>No screenshots or demo video added yet.</EmptySlot>
  }

  return (
    <div className="media">
      {screenshots.length > 0 && (
        <ul className="shots">
          {screenshots.map((shot) => (
            <li key={shot.src}>
              <figure className="figure">
                <a className="figure__frame" href={shot.src} target="_blank" rel="noreferrer">
                  <img src={shot.src} alt={shot.alt} loading="lazy" />
                </a>
                {shot.caption && <figcaption className="figure__caption">{shot.caption}</figcaption>}
              </figure>
            </li>
          ))}
        </ul>
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
