// A trade-off is only legible next to the thing that lost, so each decision
// states both sides before the reasoning.
export default function DecisionsSection({ project }) {
  return (
    <ol className="decisions">
      {project.decisions.map((decision) => (
        <li className="decision" key={decision.title}>
          <h3 className="decision__title">{decision.title}</h3>
          <p className="decision__choice">
            <span className="decision__chose">{decision.chose}</span>
            <span className="decision__over"> over {decision.over}</span>
          </p>
          <p className="decision__why">{decision.why}</p>
        </li>
      ))}
    </ol>
  )
}
