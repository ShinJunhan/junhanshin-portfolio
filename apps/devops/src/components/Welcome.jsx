// The default state: nothing selected in the sidebar yet, so the content area
// holds the greeting and a line telling the reader where to go next.
export default function Welcome() {
  return (
    <div className="welcome">
      <div>
        <p className="welcome__message">Welcome to Junhan&rsquo;s Workspace.</p>
        <p className="welcome__hint">
          Select a project from the left to explore it in full detail.
        </p>
      </div>
    </div>
  )
}
