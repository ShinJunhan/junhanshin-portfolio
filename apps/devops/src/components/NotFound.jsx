// A slug that matches no project — a bookmark to something since renamed or
// removed. Says so plainly and points back to the welcome state.
export default function NotFound({ slug }) {
  return (
    <div className="welcome">
      <div>
        <p className="welcome__message">No project called “{slug}”.</p>
        <p className="welcome__hint">
          <a href="#/">Back to the workspace</a>
        </p>
      </div>
    </div>
  )
}
