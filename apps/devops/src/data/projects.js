// The single source of truth for every project page on this app. Nothing in
// the page components is per-project — a new project is one entry here plus a
// folder under src/content/<slug>/ for its README files.
//
// TODO: every string marked with a `placeholder` comment below is scaffolding.
// Swap in the real periods, teammates, metrics, links, and copy as each
// project's material is ready. Sections read from a key that is empty or
// missing simply don't render, so a half-filled entry still produces a clean
// page — see src/data/sections.jsx for the per-section presence rules.

// Accent names map to the `--c-*` custom properties in styles/global.css,
// which are the DESIGN.md accent palette. Keep one accent per project.
export const ACCENTS = {
  coral: 'var(--c-coral)',
  orange: 'var(--c-orange)',
  emerald: 'var(--c-emerald)',
  steel: 'var(--c-steel)',
  forest: 'var(--c-forest)',
  indigo: 'var(--c-indigo)',
}

// The sidebar buckets, in the order they appear. Adding another one is an
// entry here plus a matching `group` on the projects that belong to it — the
// sidebar renders whatever this list says, and skips any bucket that has no
// projects in it.
export const GROUPS = [
  { id: 'team', label: 'Team Projects' },
  { id: 'fellowship', label: 'KT Cloud TECH UP Enterprise Fellowship Project' },
  { id: 'individual', label: 'Individual Projects' },
]

export const PROJECTS = [
  {
    slug: 'echochallengers',
    group: 'team',
    title: 'EchoChallengers',
    accent: 'emerald',
    // placeholder
    period: 'Period TBD',
    team: [
      { name: 'Junhan Shin' },
      { name: 'Teammate Two' }, // placeholder
      { name: 'Teammate Three' }, // placeholder
    ],
    // placeholder
    role: 'Wrote the detection and recovery loop — the health signals that fire, and the automation that repairs the node without a human in the path.',
    // placeholder
    context:
      'Self-healing infrastructure: the cluster detects a degraded node or a failing workload and repairs itself before the on-call phone rings. The goal was to move the common failures out of the runbook and into code.',
    metrics: [
      { label: 'Incidents auto-recovered', value: '00' }, // placeholder
      { label: 'MTTR', value: '0 min' }, // placeholder
      { label: 'Manual interventions removed', value: '00' }, // placeholder
    ],
    stack: ['Kubernetes', 'Prometheus', 'Alertmanager', 'Ansible', 'ArgoCD', 'Terraform'],
    architecture: null,
    media: null,
    decisions: [
      {
        // placeholder
        title: 'Decision title',
        chose: 'The option that shipped',
        over: 'The option that did not',
        why: 'One or two sentences on the trade-off actually being made, and what it cost.',
      },
    ],
    links: {
      github: null, // placeholder
      notion: null, // placeholder
      dashboard: null,
      terraform: null,
    },
    reflection: {
      // placeholder
      learned: 'What the project taught me.',
      differently: "What I'd do differently with the same brief again.",
    },
  },

  {
    slug: 'lock-n-lock',
    group: 'team',
    title: 'Lock-N-Lock',
    accent: 'coral',
    // placeholder
    period: 'Period TBD',
    team: [
      { name: 'Junhan Shin' },
      { name: 'Teammate Two' }, // placeholder
      { name: 'Teammate Three' }, // placeholder
    ],
    // placeholder
    role: 'Owned the security tooling in the delivery pipeline — scanning, policy gates, and the secrets path from CI into the cluster.',
    // placeholder
    context:
      'A DevSecOps pipeline built to catch insecure infrastructure and container images before they ever reach a running environment. The team wanted security checks to be a build step rather than a review meeting, so every gate had to run unattended and fail loudly.',
    metrics: [
      { label: 'Findings caught pre-merge', value: '00' }, // placeholder
      { label: 'Mean time to remediate', value: '00 h' }, // placeholder
      { label: 'Pipeline stages gated', value: '0' }, // placeholder
    ],
    stack: ['Terraform', 'AWS', 'GitHub Actions', 'Docker', 'Kubernetes', 'Trivy'],
    architecture: null,
    media: null,
    decisions: [
      {
        // placeholder
        title: 'Decision title',
        chose: 'The option that shipped',
        over: 'The option that did not',
        why: 'One or two sentences on the trade-off actually being made, and what it cost.',
      },
    ],
    links: {
      github: null, // placeholder
      notion: null, // placeholder
      dashboard: null,
      terraform: null,
    },
    reflection: {
      // placeholder
      learned: 'What the project taught me.',
      differently: "What I'd do differently with the same brief again.",
    },
  },

  {
    slug: 'hailcast',
    group: 'team',
    title: 'hailcast',
    accent: 'orange',
    // placeholder
    period: 'Period TBD',
    team: [
      { name: 'Junhan Shin' },
      { name: 'Teammate Two' }, // placeholder
      { name: 'Teammate Three' }, // placeholder
      { name: 'Teammate Four' }, // placeholder
    ],
    // placeholder
    role: 'Built the forecasting-to-scaling path: turning predicted load into scheduled capacity, and reporting the cost delta against reactive scaling.',
    // placeholder
    context:
      'Reactive autoscaling always pays for the lag — capacity arrives after the traffic does. hailcast predicts the next window of demand and pre-warms for it, so the cluster is already the right size when load lands, and shrinks again when it does not.',
    metrics: [
      { label: 'Compute cost reduction', value: '0 %' }, // placeholder
      { label: 'Scale-out lag removed', value: '00 s' }, // placeholder
      { label: 'Forecast accuracy', value: '0 %' }, // placeholder
    ],
    stack: ['AWS', 'EKS', 'KEDA', 'Karpenter', 'Prometheus', 'Grafana', 'Terraform'],
    architecture: null,
    media: null,
    decisions: [
      {
        // placeholder
        title: 'Decision title',
        chose: 'The option that shipped',
        over: 'The option that did not',
        why: 'One or two sentences on the trade-off actually being made, and what it cost.',
      },
    ],
    links: {
      github: null, // placeholder
      notion: null, // placeholder
      dashboard: null,
      terraform: null,
    },
    reflection: {
      // placeholder
      learned: 'What the project taught me.',
      differently: "What I'd do differently with the same brief again.",
    },
  },

  {
    slug: 'kt-fellowship-project',
    group: 'fellowship',
    // placeholder — this project is still in progress and unnamed. The
    // title below is a working label, not the real project name.
    title: 'KT Cloud TECH UP Fellowship Project',
    accent: 'steel',
    // placeholder
    period: 'Period TBD',
    team: [
      { name: 'Junhan Shin' },
      { name: 'Teammate Two' }, // placeholder
      { name: 'Teammate Three' }, // placeholder
    ],
    // placeholder
    role: 'Placeholder for the contribution line — one or two sentences on the part of this build that was mine.',
    // placeholder
    context:
      'Placeholder for the problem this project set out to solve, and why it was worth solving. Two or three sentences, written for someone who has not seen the repo. Replace once the scope settles.',
    metrics: [
      { label: 'Metric one', value: '00' }, // placeholder
      { label: 'Metric two', value: '0 %' }, // placeholder
      { label: 'Metric three', value: '0 min' }, // placeholder
    ],
    stack: ['AWS', 'Terraform', 'Kubernetes'],
    architecture: null,
    media: null,
    decisions: [
      {
        // placeholder
        title: 'Decision title',
        chose: 'The option that shipped',
        over: 'The option that did not',
        why: 'One or two sentences on the trade-off actually being made, and what it cost.',
      },
    ],
    links: {
      github: null, // placeholder
      notion: null, // placeholder
      dashboard: null,
      terraform: null,
    },
    reflection: {
      // placeholder
      learned: 'What the project taught me.',
      differently: "What I'd do differently with the same brief again.",
    },
  },

  {
    slug: 'individual-project-one',
    group: 'individual',
    // placeholder
    // No `team` key: this is solo work, so the Members section and the Notion
    // link never render. That is the whole opt-out — nothing else to switch off.
    title: 'Individual project one',
    accent: 'forest',
    // placeholder
    period: 'Period TBD',
    // placeholder
    role: 'Placeholder for the contribution line. Solo build, so this is the whole scope rather than a slice of it.',
    // placeholder
    context:
      'Placeholder for what this project is and why it exists. Two or three sentences, written for someone who has not seen the repo. Replace with the real brief.',
    metrics: [
      { label: 'Metric one', value: '00' }, // placeholder
      { label: 'Metric two', value: '0 %' }, // placeholder
      { label: 'Metric three', value: '0 min' }, // placeholder
    ],
    stack: ['AWS', 'Terraform', 'Docker'],
    architecture: null,
    media: null,
    decisions: [
      {
        // placeholder
        title: 'Decision title',
        chose: 'The option that shipped',
        over: 'The option that did not',
        why: 'One or two sentences on the trade-off actually being made, and what it cost.',
      },
    ],
    links: {
      github: null, // placeholder
      dashboard: null,
      terraform: null,
    },
    reflection: {
      // placeholder
      learned: 'What the project taught me.',
      differently: "What I'd do differently with the same brief again.",
    },
  },

  {
    slug: 'individual-project-two',
    group: 'individual',
    // placeholder
    title: 'Individual project two',
    accent: 'indigo',
    // placeholder
    period: 'Period TBD',
    // placeholder
    role: 'Placeholder for the contribution line. Solo build, so this is the whole scope rather than a slice of it.',
    // placeholder
    context:
      'Placeholder for what this project is and why it exists. Two or three sentences, written for someone who has not seen the repo. Replace with the real brief.',
    metrics: [
      { label: 'Metric one', value: '00' }, // placeholder
      { label: 'Metric two', value: '0 %' }, // placeholder
      { label: 'Metric three', value: '0 min' }, // placeholder
    ],
    stack: ['AWS', 'Kubernetes', 'GitHub Actions'],
    architecture: null,
    media: null,
    decisions: [
      {
        // placeholder
        title: 'Decision title',
        chose: 'The option that shipped',
        over: 'The option that did not',
        why: 'One or two sentences on the trade-off actually being made, and what it cost.',
      },
    ],
    links: {
      github: null, // placeholder
      dashboard: null,
      terraform: null,
    },
    reflection: {
      // placeholder
      learned: 'What the project taught me.',
      differently: "What I'd do differently with the same brief again.",
    },
  },

  {
    slug: 'cloud-resume-challenge',
    group: 'individual',
    title: 'Cloud Resume Challenge',
    accent: 'indigo',
    // placeholder
    period: 'Period TBD',
    // placeholder
    role: 'Solo build, end to end: the static site, the visitor-counter API behind it, the Terraform that stands it all up, and the pipeline that ships it.',
    // placeholder
    context:
      'The Cloud Resume Challenge, done as infrastructure rather than as a web page — every piece defined in Terraform and deployed by CI, with no console clicking anywhere in the path. The point was to prove the whole loop, not just the front end.',
    metrics: [
      { label: 'AWS resources in Terraform', value: '00' }, // placeholder
      { label: 'Deploy time', value: '0 min' }, // placeholder
      { label: 'Monthly run cost', value: '$0.00' }, // placeholder
    ],
    stack: ['AWS', 'S3', 'CloudFront', 'Route 53', 'Lambda', 'DynamoDB', 'Terraform', 'GitHub Actions'],
    architecture: null,
    media: null,
    decisions: [
      {
        // placeholder
        title: 'Decision title',
        chose: 'The option that shipped',
        over: 'The option that did not',
        why: 'One or two sentences on the trade-off actually being made, and what it cost.',
      },
    ],
    links: {
      github: null, // placeholder
      dashboard: null,
      terraform: null,
    },
    reflection: {
      // placeholder
      learned: 'What the project taught me.',
      differently: "What I'd do differently with the same brief again.",
    },
  },

  {
    slug: 'kubernetes-challenge',
    group: 'individual',
    title: 'Kubernetes Challenge',
    accent: 'forest',
    // placeholder
    period: 'Period TBD',
    // placeholder
    role: 'Solo build: cluster provisioning, the app workloads on top of it, autoscaling, and the GitOps flow that keeps the cluster matching the repo.',
    // placeholder
    context:
      'The Kubernetes Resume Challenge — an e-commerce workload taken from a container image to a running, autoscaling, self-updating cluster. Deliberately kept separate from the team autoscaling work so the solo end-to-end path stands on its own.',
    metrics: [
      { label: 'Workloads managed', value: '00' }, // placeholder
      { label: 'Scale-out response', value: '00 s' }, // placeholder
      { label: 'Rollout time', value: '0 min' }, // placeholder
    ],
    stack: ['Kubernetes', 'EKS', 'Helm', 'Docker', 'ArgoCD', 'Terraform', 'GitHub Actions'],
    architecture: null,
    media: null,
    decisions: [
      {
        // placeholder
        title: 'Decision title',
        chose: 'The option that shipped',
        over: 'The option that did not',
        why: 'One or two sentences on the trade-off actually being made, and what it cost.',
      },
    ],
    links: {
      github: null, // placeholder
      dashboard: null,
      terraform: null,
    },
    reflection: {
      // placeholder
      learned: 'What the project taught me.',
      differently: "What I'd do differently with the same brief again.",
    },
  },
]

export function findProject(slug) {
  return PROJECTS.find((project) => project.slug === slug) ?? null
}

export function projectsInGroup(groupId) {
  return PROJECTS.filter((project) => project.group === groupId)
}

export function accentFor(project) {
  return ACCENTS[project.accent] ?? 'var(--accent-base)'
}
