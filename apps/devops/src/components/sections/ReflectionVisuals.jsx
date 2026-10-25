import { useId } from 'react'
import { techIcon, techTone } from '../../data/tech.js'

// The diagram beside each paragraph in the `story` Reflection (Midam). Each
// one draws its own paragraph's facts in a different shape, so the eight rows
// do not read as eight copies of one box. Every figure comes from the
// paragraph beside it, except the 147-of-184 bar, which is the Metrics
// section's number. The autoscaler and cost-alert charts show the idea rather
// than measured data and say so in their keys.

// The wrapper carries the dark-theme tone, so a black mark like Redis turns
// white on the dark card.
function Logo({ label }) {
  const src = techIcon(label)
  if (!src) return null
  return (
    <span className="rfv-logo" data-tone={techTone(label)}>
      <img src={src} alt="" />
    </span>
  )
}

function Glyph({ children }) {
  return (
    <svg className="rfv-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

const Arrow = () => (
  <Glyph>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Glyph>
)

const Check = () => (
  <Glyph>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Glyph>
)

function Label({ on, children }) {
  return <span className={'rfv-label' + (on ? ' rfv-label--on' : '')}>{children}</span>
}

function Figure({ value, children }) {
  return (
    <div className="rfv-figure">
      <span className="rfv-figure__value">{value}</span>
      <span className="rfv-figure__label">{children}</span>
    </div>
  )
}

// Three late requests landing on a plan that did not include them, then what
// changed within the week.
function BackendRequests() {
  return (
    <div className="rfv rfv-be" role="img" aria-label="Redis, 3 GB of heap per pod, and long connections arrived after the resource plan. Within a week each backend pod got its own node, Redis joined the cluster, and the ALB idle timeout rose from 60 to 300 seconds.">
      <Label on>Arrived after the plan</Label>
      <div className="rfv-be__drops">
        <span className="rfv-be__drop">
          <Logo label="Redis" />
          Redis
        </span>
        <span className="rfv-be__drop">3 GB heap per pod</span>
        <span className="rfv-be__drop">Long connections</span>
      </div>
      <div className="rfv-be__plan">Our resource plan and cost estimate</div>
      <Label on>Changed within a week</Label>
      <div className="rfv-be__after">
        <div className="rfv-be__nodes">
          <span className="rfv-be__node">
            <b>node 1</b>
            <span className="rfv-pod">backend</span>
          </span>
          <span className="rfv-be__node">
            <b>node 2</b>
            <span className="rfv-pod">backend</span>
          </span>
          <span className="rfv-be__node">
            <b>cluster</b>
            <span className="rfv-pod rfv-pod--alert">Redis</span>
          </span>
        </div>
        <div className="rfv-meter">
          <span>ALB idle</span>
          <span />
          <span>60 s</span>
          <i style={{ width: '20%' }} />
          <span>300 s</span>
          <i style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  )
}

function AiMove() {
  return (
    <div className="rfv rfv-ai" role="img" aria-label="The models moved from an outside GPU service to our EKS cluster, where two GPU node groups waited at zero nodes while the AI team compared nine candidate models.">
      <div className="rfv-ai__path">
        <span className="rfv-ai__out">Outside GPU service</span>
        <span className="rfv-ai__line" />
        <div className="rfv-ai__eks">
          <span className="rfv-ai__title">
            <Logo label="EKS" />
            Our EKS cluster
          </span>
          <div className="rfv-ai__groups">
            <span>
              GPU group 1<br />0 nodes
            </span>
            <span>
              GPU group 2<br />0 nodes
            </span>
          </div>
        </div>
      </div>
      <div className="rfv-ai__facts">
        <div className="rfv-ai__models">
          <span className="rfv-ai__dots" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <i key={i} />
            ))}
          </span>
          <span className="rfv-figure__label">9 candidate models</span>
        </div>
        <Figure value="10 GB+">model image disks</Figure>
        <Figure value="$0">until the images arrived</Figure>
      </div>
    </div>
  )
}

function FrontendUploads() {
  return (
    <div className="rfv rfv-fe" role="img" aria-label="Each browser photo became three WebP sizes uploaded to an S3 bucket limited to one CORS upload method with encryption by default. The domains were split between Vercel and the ALB, and the front-end upload code never changed.">
      <div className="rfv-fe__flow">
        <span className="rfv-fe__step">
          <Glyph>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="10" r="2" />
            <path d="M21 16l-5-5-9 9" />
          </Glyph>
          Browser photo
        </span>
        <Arrow />
        <span className="rfv-fe__step">
          <span className="rfv-fe__sizes" aria-hidden="true">
            <i style={{ width: 22, height: 22 }} />
            <i style={{ width: 16, height: 16 }} />
            <i style={{ width: 10, height: 10 }} />
          </span>
          3 WebP sizes
        </span>
        <Arrow />
        <div className="rfv-fe__bucket">
          <span className="rfv-fe__title">
            <Logo label="S3" />
            S3 bucket
          </span>
          <span className="rfv-fe__rule">
            <Check />
            CORS: one upload method
          </span>
          <span className="rfv-fe__rule">
            <Check />
            Encryption by default
          </span>
        </div>
      </div>
      <div className="rfv-fe__fork">
        <span className="rfv-label">Domains</span>
        <span className="rfv-fe__target">Vercel site</span>
        <span className="rfv-fe__target">
          <Logo label="ALB" /> ALB
        </span>
      </div>
      <Figure value="0">changes to the front-end upload code</Figure>
    </div>
  )
}

function SecurityEvidence() {
  return (
    <div className="rfv rfv-sc" role="img" aria-label="One critical finding was shown to be a false positive with three pieces of evidence: the code defaults, a plan-time guardrail, and a live cluster query. 147 of 184 findings targeted Kubernetes manifests outside our Terraform code.">
      <div className="rfv-sc__row">
        <span className="rfv-sc__finding">
          Critical
          <br />
          finding
        </span>
        <Arrow />
        <div className="rfv-sc__evidence">
          {['Code defaults', 'Plan‑time guardrail', 'Live cluster query'].map((item, i) => (
            <span key={item}>
              <b>{i + 1}</b>
              {item}
            </span>
          ))}
        </div>
        <Arrow />
        <span className="rfv-sc__stamp">
          False
          <br />
          positive
        </span>
      </div>
      <Label>Where most findings pointed</Label>
      <span className="rfv-sc__split" aria-hidden="true">
        <i style={{ flexGrow: 147 }} />
        <i style={{ flexGrow: 37 }} />
      </span>
      <p className="rfv-key">
        <span>
          <i />
          147 of 184 findings: Kubernetes manifests outside our Terraform&nbsp;code
        </span>
      </p>
    </div>
  )
}

function Stage({ tone, children }) {
  return <span className={'rfv-ci__stage' + (tone ? ` rfv-ci__stage--${tone}` : '')}>{children}</span>
}

function Chain({ stages }) {
  return (
    <div className="rfv-ci__chain">
      {stages.map(([tone, text], i) => (
        <span className="rfv-ci__link" key={text}>
          {i > 0 && <span className="rfv-ci__joint" />}
          <Stage tone={tone}>{text}</Stage>
        </span>
      ))}
    </div>
  )
}

function TerraformPipeline() {
  return (
    <div className="rfv rfv-ci" role="img" aria-label="Kubernetes changes were rendered and linted before merge, while Terraform plans were read by hand and scanned after the build. Next time every pull request would format, validate, test, post the plan, and run the IaC scan.">
      <div className="rfv-ci__lane">
        <span className="rfv-ci__tool">
          <Logo label="Kubernetes" />
          Kubernetes
        </span>
        <Chain stages={[['ok', 'render'], ['ok', 'lint'], ['ok', 'merge']]} />
      </div>
      <div className="rfv-ci__lane">
        <span className="rfv-ci__tool">
          <Logo label="Terraform" />
          Terraform
        </span>
        <Chain stages={[['hand', 'plan read by hand'], ['ok', 'merge'], ['hand', 'scan after the build']]} />
      </div>
      <span className="rfv-ci__rule" />
      <Label on>Next time, on every pull request</Label>
      <Chain stages={[['ok', 'format'], ['ok', 'validate'], ['ok', 'test'], ['ok', 'plan on the PR'], ['scan', 'IaC scan']]} />
    </div>
  )
}

// Demand is the same stepped line in both charts. With a fixed count the
// capacity stays flat and the gap above it is Pending; with Karpenter the
// capacity follows demand.
const DEMAND = 'M0,70 L30,70 L45,30 L75,30 L90,55 L120,55 L135,20 L165,20 L180,70 L220,70'
const FOLLOW = 'M0,64 L30,64 L45,24 L75,24 L90,49 L120,49 L135,14 L165,14 L180,64 L220,64'

function NodeAutoscaler() {
  const hatch = useId().replace(/:/g, '')
  const chart = (follow) => (
    <svg className="rfv-chart" viewBox="0 0 220 90" aria-hidden="true">
      <line x1="0" y1="84" x2="220" y2="84" stroke="var(--border)" />
      {!follow && <path d="M45,30 L75,30 L75,45 L45,45Z M135,20 L165,20 L165,45 L135,45Z" fill={`url(#${hatch})`} />}
      <path d={DEMAND} fill="none" stroke="var(--text-secondary)" strokeWidth="1.6" strokeDasharray="4 3" />
      <path d={follow ? FOLLOW : 'M0,45 L220,45'} fill="none" stroke="var(--accent)" strokeWidth="2.4" />
    </svg>
  )
  return (
    <div className="rfv" role="img" aria-label="Illustration: with a fixed node count, pods wait in Pending whenever demand rises above capacity. With Karpenter, capacity follows demand.">
      <svg width="0" height="0" className="rfv-defs" aria-hidden="true">
        <defs>
          <pattern id={hatch} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="2" height="4" className="rfv-hatch" />
          </pattern>
        </defs>
      </svg>
      <div className="rfv-charts">
        <figure>
          <figcaption>Fixed node count</figcaption>
          {chart(false)}
        </figure>
        <figure>
          <figcaption className="rfv-on">With Karpenter</figcaption>
          {chart(true)}
        </figure>
      </div>
      <p className="rfv-key">
        <span>
          <i />
          Node capacity
        </span>
        <span>
          <i className="rfv-key--muted" />
          Pod demand
        </span>
        <span>
          <i className="rfv-key--hatch" />
          Pods in Pending
        </span>
        <span>Illustration, not to scale</span>
      </p>
    </div>
  )
}

function Zone({ name, on, children }) {
  return (
    <div className={'rfv-az__zone' + (on ? ' rfv-az__zone--on' : '')}>
      <b>{name}</b>
      {children}
    </div>
  )
}

function ZoneFailure() {
  return (
    <div className="rfv rfv-az" role="img" aria-label="During the project both database replicas and all nodes sat in Zone A. Next time one replica would sit in each of two zones, at about $43 a month more for a second NAT Gateway.">
      <figure>
        <Label>During the project</Label>
        <div className="rfv-az__pair">
          <Zone name="Zone A" on>
            <span className="rfv-az__app">all nodes</span>
            <span className="rfv-az__db">replica 1</span>
            <span className="rfv-az__db">replica 2</span>
          </Zone>
          <Zone name="Zone B" />
        </div>
      </figure>
      <figure>
        <Label on>Next time</Label>
        <div className="rfv-az__pair">
          <Zone name="Zone A" on>
            <span className="rfv-az__db">replica 1</span>
          </Zone>
          <Zone name="Zone B" on>
            <span className="rfv-az__db">replica 2</span>
          </Zone>
        </div>
      </figure>
      <div className="rfv-az__cost">
        <span className="rfv-figure__value">+$43</span>
        <span className="rfv-figure__label">about $43 a month for a second NAT Gateway, plus traffic between zones</span>
      </div>
    </div>
  )
}

function CostAlerts() {
  const days = [18, 20, 17, 21, 19, 62, 58, 60]
  return (
    <div className="rfv" role="img" aria-label="Illustration: a spike in daily spending sits far below the $330 limit for the whole fellowship. A daily alert would catch it the same day, while Cost Explorer showed it two days later.">
      <svg className="rfv-chart rfv-chart--cost" viewBox="0 0 300 120" aria-hidden="true">
        <line x1="0" y1="14" x2="300" y2="14" stroke="var(--text-secondary)" strokeDasharray="5 4" />
        <text x="0" y="9" className="rfv-chart__text">$330 limit for the whole fellowship</text>
        {days.map((h, i) => (
          <rect key={i} x={i * 36 + 4} y={104 - h} width="24" height={h} rx="2" className={i >= 5 ? 'rfv-bar rfv-bar--on' : 'rfv-bar'} />
        ))}
        <line x1="0" y1="104" x2="300" y2="104" stroke="var(--border)" />
        <text x="184" y="34" className="rfv-chart__text rfv-chart__text--on">daily alert, same day</text>
        <path d="M196,38 L196,40" stroke="var(--accent)" />
        <text x="300" y="117" textAnchor="end" className="rfv-chart__text">Cost Explorer, 2 days later</text>
      </svg>
      <p className="rfv-key">
        <span>
          <i />
          Spike in daily spending
        </span>
        <span>
          <i className="rfv-key--muted" />
          Total budget alert
        </span>
        <span>Illustration, not to scale</span>
      </p>
    </div>
  )
}

const VISUALS = {
  backendRequests: BackendRequests,
  aiMove: AiMove,
  frontendUploads: FrontendUploads,
  securityEvidence: SecurityEvidence,
  terraformPipeline: TerraformPipeline,
  nodeAutoscaler: NodeAutoscaler,
  zoneFailure: ZoneFailure,
  costAlerts: CostAlerts,
}

export default function ReflectionVisual({ name }) {
  const Visual = VISUALS[name]
  return Visual ? <Visual /> : null
}
