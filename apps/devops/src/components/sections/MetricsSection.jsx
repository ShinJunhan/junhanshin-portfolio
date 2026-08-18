// Metric callouts per DESIGN.md: a small muted label above a large number.
// The number takes the project accent — one of the three places the accent is
// allowed to appear on a themed page.
export default function MetricsSection({ project }) {
  return (
    <ul className="metrics">
      {project.metrics.map((metric) => (
        <li className="metric" key={metric.label}>
          <span className="metric__label">{metric.label}</span>
          <span className="metric__value">{metric.value}</span>
          {metric.note && <span className="metric__note">{metric.note}</span>}
        </li>
      ))}
    </ul>
  )
}
