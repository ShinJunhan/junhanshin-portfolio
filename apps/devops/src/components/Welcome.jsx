// The default state: nothing selected in the sidebar yet, so the content area
// holds the greeting and a line telling the reader where to go next.
export default function Welcome() {
  return (
    <div className="welcome">
      <div>
        {/* Three flat colours, no gradient. The line sets in body ink and two
            spans step out of it: the name into the indigo the landing page's
            Hero settles it into, and "Workspace" into the palette's steel.
            The apostrophe-s belongs to the ink, which is the whole reason it
            is not inside either span — carried by a gradient it was the one
            fragment on the line whose colour matched neither neighbour, and it
            read as a typo rather than as a sweep. */}
        <p className="welcome__message">
          Welcome to <span className="welcome__name">Junhan</span>&rsquo;s{' '}
          <span className="welcome__where">Workspace.</span>
        </p>
        <p className="welcome__hint">
          Select a project from the left to explore it in full detail.
        </p>
      </div>
    </div>
  )
}
