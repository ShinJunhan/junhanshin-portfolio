// A trade-off is only legible next to the thing that lost, so each decision
// states both sides before the reasoning — where there is a competing option
// to name. Some choices are a way of working rather than a fork, and those
// leave `over` unset and simply state what was chosen.
import RichText from '../../lib/richText.jsx'

export default function DecisionsSection({ project }) {
  return (
    <ol className="decisions">
      {project.decisions.map((decision) => (
        <li className="decision" key={decision.title}>
          <h3 className="decision__title">
            <RichText>{decision.title}</RichText>
          </h3>
          <p className="decision__choice">
            <span className="decision__chose">
              <RichText>{decision.chose}</RichText>
            </span>
            {decision.over && <span className="decision__over">
                {' over '}
                <RichText>{decision.over}</RichText>
              </span>}
          </p>
          <p className="decision__why">
            <RichText>{decision.why}</RichText>
          </p>
        </li>
      ))}
    </ol>
  )
}
