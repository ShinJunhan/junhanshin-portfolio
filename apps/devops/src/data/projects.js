// A translated copy, not the repo's file: the comments are in English so the
// portfolio reads to an English-speaking visitor, while every line of actual
// Terraform is byte-for-byte what the repo holds. The upstream file in
// EchoChallengers/project1-aws is untouched.
import echoMainTf from '../content/echochallengers/code/terraform/main.tf?raw'
import echoRecoveryMap from '../content/echochallengers/code/recovery/recovery_map.yml?raw'
import echoAlertRules from '../content/echochallengers/code/monitoring/alert.rules.yml?raw'

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
    fullTitle: 'Self-Healing AWS Infrastructure',
    accent: 'emerald',
    period: 'April 20 \u2013 May 22, 2026',
    // `initials` is set explicitly rather than derived: these romanize from
    // the Korean given name, so HJ rather than the HC the surname would give.
    team: [
      { name: 'Hwijeong Cho', initials: 'HJ', role: 'Team Lead' },
      {
        name: 'Junhan Shin',
        initials: 'JS',
        // Short form of the role stated in full under My Role — the avatar
        // column is ~90px wide and a longer string wraps to three lines.
        title: 'Infra Build Lead',
      },
      // `title` here is a neutral placeholder, not a real role: the actual
      // responsibilities of these three are not recorded anywhere in this
      // repo. Replace each with what the person actually owned — do not
      // invent one. See PRODUCT.md: teammate details are never fabricated.
      { name: 'Jiyoon Lee', initials: 'JY', title: 'Team Member' },
      { name: 'Mingyu Kim', initials: 'MK', title: 'Team Member' },
      { name: 'Jiwoo Han', initials: 'JW', title: 'Team Member' },
    ],
    role:
      'I was **Infrastructure Build Lead and PR Owner**. I owned the Terraform infrastructure code (**41 AWS resources**), the Ansible `common` and `chaos` roles, and the Tailscale hybrid-networking bootstrap script. I reviewed and merged all **27 pull requests** into the development branch \u2014 including **3 merge conflicts** I resolved safely and **2 security issues** I caught and fixed before merge. I took the initiative to build the on-premises foundation early in the timeline after the assigned team lead was largely unavailable during the first week and a half, getting the team unblocked and the codebase moving.',
    context:
      'Most self-healing infrastructure projects stop at detection and alerting. The goal here was to **close the loop**: build AWS infrastructure that detects a failure and recovers from it automatically, without an operator getting paged. The team worked through **three phases** \u2014 replicating the target architecture on-premises with **VMware**, migrating it to **AWS** with full infrastructure-as-code automation, then integrating both environments into a single hybrid system connected over a **Tailscale VPN**.',
    // `size` drives the bento layout: one `big` headline stat, `wide` where a
    // number needs a qualifying phrase, `square` for the rest.
    //
    // The order matters. On the 5-column grid these six tile it exactly:
    // row 1 is the big tile (2 wide) plus three squares; row 2 is the big
    // tile's second row plus the wide tile (2) and the last square.
    metrics: [
      {
        size: 'big',
        value: '30\u201360s',
        label: 'Mean Time to Recover',
      },
      { size: 'square', value: '5\u201310s', label: 'MTTD', hint: 'Mean Time to Detect' },
      {
        size: 'square',
        value: '27',
        label: 'PRs Merged',
        hint: 'Pull requests reviewed and merged',
      },
      { size: 'square', value: '12', label: 'Cases Resolved', hint: 'Troubleshooting cases documented and resolved' },
      {
        size: 'wide',
        value: '~10 min',
        label: 'Deployment Time',
        detail: 'for 41 AWS resources',
      },
      { size: 'square', value: '4', label: 'Scenarios Validated', hint: 'Failure-and-recovery scenarios validated end to end' },
    ],
    // Grouped by what each tool is for. Every project's Tech Stack renders
    // through the same TechStackWheel, which sizes each wedge by how many
    // items the category holds — so the categories and their counts are the
    // only thing that differs page to page. A group may also set `tint` to
    // override the wheel's default palette. A flat array of strings still
    // works and falls back to the card list, since a wheel needs categories
    // to divide the centre into.
    stack: [
      { category: 'Cloud/Infrastructure', items: ['AWS', 'VMware', 'Tailscale'] },
      { category: 'IaC/Automation', items: ['Terraform', 'Ansible', 'Makefile', 'Bash'] },
      { category: 'OS/Runtime', items: ['Amazon Linux', 'Rocky Linux', 'Python'] },
      { category: 'Application', items: ['Nginx', 'FastAPI', 'PostgreSQL'] },
      {
        category: 'Monitoring',
        items: ['Prometheus', 'Grafana', 'Alertmanager', 'Node Exporter'],
      },
      { category: 'Recovery', items: ['Flask'] },
      { category: 'Collaboration', items: ['Git', 'GitHub', 'Notion', 'Discord'] },
    ],
    // Only the main.tf — variables.tf and outputs.tf are supporting files,
    // and the GitHub link under the viewer covers them.
    terraform: [{ path: 'terraform/main.tf', content: echoMainTf }],
    // What happens when an alert fires: which script runs, how many retries,
    // how long the cooldown. Deliberately just these two — role task files and
    // group_vars are setup mechanics, not decisions worth reading inline.
    recoveryPolicy: [
      {
        path: 'recovery/controller/config/recovery_map.yml',
        content: echoRecoveryMap,
      },
      {
        path: 'ansible/roles/monitoring/files/alert.rules.yml',
        content: echoAlertRules,
      },
    ],
    architecture: [
      {
        src: '/projects/project1_echochallengers/architecture-01-hybrid-infra.jpg',
        alt: 'Hybrid infrastructure: the on-premises VMware environment and the AWS VPC joined over a Tailscale VPN',
        tab: 'Hybrid infrastructure',
        caption: 'Hybrid infrastructure \u2014 VMware \u2194 AWS over Tailscale',
      },
      {
        src: '/projects/project1_echochallengers/architecture-02-self-healing-flow.jpg',
        alt: 'Self-healing flow from failure detection through alerting to automated recovery',
        tab: 'Self-healing flow',
        caption: 'Self-healing flow \u2014 detection through automated recovery',
      },
    ],
    media: {
      // One tab per chaos scenario, each holding that scenario's before and
      // after. They used to be a flat list of eight screenshots laid out two
      // across, which made the pair small and the section long.
      scenarios: [
        {
          id: 'scenario-1',
          tab: 'Nginx down',
          label: 'Scenario 1 \u2014 Nginx down',
          before: {
            src: '/projects/project1_echochallengers/screenshot-scenario1-nginxdown-before.jpg',
            alt: 'Scenario 1, Nginx down: dashboard and alerts in the failed state',
          },
          after: {
            src: '/projects/project1_echochallengers/screenshot-scenario1-nginxdown-after.jpg',
            alt: 'Scenario 1, Nginx down: dashboard and alerts after automated recovery',
          },
        },
        {
          id: 'scenario-2',
          tab: 'Exporter down',
          label: 'Scenario 2 \u2014 Exporter down',
          before: {
            src: '/projects/project1_echochallengers/screenshot-scenario2-exporterdown-before.jpg',
            alt: 'Scenario 2, exporter down: dashboard and alerts in the failed state',
          },
          after: {
            src: '/projects/project1_echochallengers/screenshot-scenario2-exporterdown-after.jpg',
            alt: 'Scenario 2, exporter down: dashboard and alerts after automated recovery',
          },
        },
        {
          id: 'scenario-3',
          tab: 'High CPU',
          label: 'Scenario 3 \u2014 High CPU',
          before: {
            src: '/projects/project1_echochallengers/screenshot-scenario3-highcpu-before.jpg',
            alt: 'Scenario 3, high CPU: dashboard and alerts in the failed state',
          },
          after: {
            src: '/projects/project1_echochallengers/screenshot-scenario3-highcpu-after.jpg',
            alt: 'Scenario 3, high CPU: dashboard and alerts after automated recovery',
          },
        },
        {
          id: 'scenario-4',
          tab: 'High memory',
          label: 'Scenario 4 \u2014 High memory',
          before: {
            src: '/projects/project1_echochallengers/screenshot-scenario4-highmemory-before.jpg',
            alt: 'Scenario 4, high memory: dashboard and alerts in the failed state',
          },
          after: {
            src: '/projects/project1_echochallengers/screenshot-scenario4-highmemory-after.jpg',
            alt: 'Scenario 4, high memory: dashboard and alerts after automated recovery',
          },
        },
      ],
      video: null,
    },
    folderStructure: `
project1-aws/
\u251c\u2500\u2500 terraform/
\u2502   \u251c\u2500\u2500 main.tf
\u2502   \u251c\u2500\u2500 variables.tf
\u2502   \u251c\u2500\u2500 terraform.tfvars        # gitignored
\u2502   \u2514\u2500\u2500 outputs.tf
\u251c\u2500\u2500 ansible/
\u2502   \u251c\u2500\u2500 site.yml
\u2502   \u251c\u2500\u2500 playbooks/
\u2502   \u2502   \u251c\u2500\u2500 mgmt.yml
\u2502   \u2502   \u251c\u2500\u2500 web.yml
\u2502   \u2502   \u2514\u2500\u2500 db.yml
\u2502   \u251c\u2500\u2500 roles/
\u2502   \u2502   \u251c\u2500\u2500 common/
\u2502   \u2502   \u251c\u2500\u2500 nginx/
\u2502   \u2502   \u251c\u2500\u2500 fastapi/
\u2502   \u2502   \u251c\u2500\u2500 postgresql/
\u2502   \u2502   \u251c\u2500\u2500 monitoring/
\u2502   \u2502   \u251c\u2500\u2500 node_exporter/
\u2502   \u2502   \u251c\u2500\u2500 nginx_exporter/
\u2502   \u2502   \u2514\u2500\u2500 chaos/
\u2502   \u2514\u2500\u2500 group_vars/
\u2502       \u251c\u2500\u2500 all.yml
\u2502       \u251c\u2500\u2500 secrets.yml         # gitignored
\u2502       \u2514\u2500\u2500 secrets.yml.example
\u251c\u2500\u2500 chaos/
\u2502   \u2514\u2500\u2500 inject.sh
\u251c\u2500\u2500 recovery/
\u2502   \u2514\u2500\u2500 controller/
\u2502       \u251c\u2500\u2500 app.py
\u2502       \u251c\u2500\u2500 recovery_map.yml
\u2502       \u2514\u2500\u2500 scripts/
\u2502           \u251c\u2500\u2500 recover_nginx.sh
\u2502           \u251c\u2500\u2500 recover_nginx_exporter.sh
\u2502           \u251c\u2500\u2500 recover_cpu.sh
\u2502           \u251c\u2500\u2500 recover_memory.sh
\u2502           \u251c\u2500\u2500 recover_db.sh
\u2502           \u251c\u2500\u2500 recover_service.sh
\u2502           \u2514\u2500\u2500 recover_fail_test.sh
\u251c\u2500\u2500 Makefile
\u251c\u2500\u2500 setup.sh
\u251c\u2500\u2500 bootstrap_tailscale.sh
\u2514\u2500\u2500 check.sh
`,
    // `glyph` names a mark from components/sections/decisionGlyphs.jsx. It is
    // a presentation hint, not a claim — omit it and the card shows the
    // neutral default rather than pretending to illustrate the decision.
    decisions: [
      {
        title: 'NAT Instance over NAT Gateway',
        glyph: 'route',
        chose: 'A **NAT instance** for outbound routing',
        over: "AWS's managed NAT Gateway",
        why: '**Lower cost** and **better response time** for this scale of workload.',
      },
      {
        title: '`pkill -x` over `pkill -f` in recovery scripts',
        glyph: 'process',
        chose: '`pkill -x`, exact process-name matching only',
        over: '`pkill -f`',
        why:
          'The memory-recovery script went through **4 iterations** before we landed on a safe approach. Early versions used `pkill -f stress-ng`, which also matched the Ansible shell command line running the recovery script itself \u2014 causing the recovery process to terminate itself mid-run. Switching to `pkill -x` fixed it. A small shell command difference with a **real operational consequence**.',
      },
      {
        title: 'Slack channel separation (`#monitoring` vs. `#recovery`)',
        glyph: 'channels',
        chose: 'Two channels, splitting detection alerts from recovery-result alerts',
        over: 'one combined feed',
        why: "So on-call readability doesn't degrade as alert volume grows.",
      },
      {
        title: 'Three-tier Git branch strategy with a dedicated PR Owner role',
        glyph: 'branch',
        chose: '`main \u2190 dev \u2190 feature/*`, with a named **PR Owner**',
        // No competing option to name: this was a way of working, not a fork.
        over: null,
        why:
          'With me responsible for pre-merge security review and conflict resolution \u2014 I caught a **hardcoded Slack webhook URL** before it reached the public repo.',
      },
    ],
    links: {
      github: 'https://github.com/EchoChallengers/project1-aws',
      notion: null, // TODO: not finalized
      readme: null, // TODO: not finalized
      dashboard: null, // TODO: not finalized — Grafana may no longer be live
      presentation: null, // TODO: not finalized
      // Rendered as the link under the Terraform Code viewer rather than as a
      // resource tile. TODO: assumes the default branch is `main`.
      terraform: 'https://github.com/EchoChallengers/project1-aws/tree/main/terraform',
    },
    reflection: {
      learned:
        'Building for **operations** \u2014 not just deployment \u2014 meant designing for **idempotency** and human-error prevention from the start, not bolting it on afterward. The `pkill -x` vs. `pkill -f` issue in particular taught me that small shell-command differences can have outsized operational consequences, and that some failure modes only show up under real infrastructure conditions \u2014 I couldn\u2019t have predicted the **AWS OOM killer** behavior without testing on actual AWS.',
      differently:
        'We didn\u2019t build a **CI/CD pipeline** for this iteration \u2014 we prioritized demo stability over pipeline setup given the timeline. I\u2019d also want to add containerization, auto-scaling/multi-AZ high availability, and fully automated Grafana dashboard provisioning. My near-term next steps would be finishing Grafana auto-provisioning, adding GitHub Actions CI/CD, and automating HTTPS renewal; longer-term, containerizing with ECR/ECS and eventually expanding to EKS.',
    },
  },

  {
    slug: 'lock-n-lock',
    group: 'team',
    title: 'Lock-N-Lock',
    // placeholder — the descriptive page heading. `title` above stays the
    // short name the sidebar shows and the eyebrow repeats.
    fullTitle:
      'DevSecOps Delivery Pipeline with Automated Security Gates',
    accent: 'coral',
    // placeholder
    period: 'TBD', // placeholder
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
      { size: 'wide', value: '00', label: 'Findings', hint: 'Findings caught pre-merge' }, // placeholder
      { size: 'square', value: '00 h', label: 'MTTR', hint: 'Mean time to remediate' }, // placeholder
      { size: 'square', value: '0', label: 'Gated stages', hint: 'Pipeline stages gated' }, // placeholder
    ],
    stack: [
      { category: 'Cloud/Infrastructure', items: ['AWS'] },
      { category: 'IaC/Automation', items: ['Terraform'] },
      { category: 'Containers', items: ['Docker', 'Kubernetes'] },
      { category: 'CI/CD', items: ['GitHub Actions'] },
      { category: 'Security', items: ['Trivy'] },
    ],
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
      readme: null,
      dashboard: null,
      terraform: null,
      presentation: null,
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
    // placeholder — the descriptive page heading. `title` above stays the
    // short name the sidebar shows and the eyebrow repeats.
    fullTitle:
      'Predictive Autoscaling for Cost-Optimized EKS Workloads',
    accent: 'orange',
    // placeholder
    period: 'TBD', // placeholder
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
      { size: 'wide', value: '0 %', label: 'Cost saved', hint: 'Compute cost reduction' }, // placeholder
      { size: 'square', value: '00 s', label: 'Lag removed', hint: 'Scale-out lag removed' }, // placeholder
      { size: 'square', value: '0 %', label: 'Accuracy', hint: 'Forecast accuracy' }, // placeholder
    ],
    stack: [
      { category: 'Cloud/Infrastructure', items: ['AWS', 'EKS'] },
      { category: 'Autoscaling', items: ['KEDA', 'Karpenter'] },
      { category: 'Monitoring', items: ['Prometheus', 'Grafana'] },
      { category: 'IaC/Automation', items: ['Terraform'] },
    ],
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
      readme: null,
      dashboard: null,
      terraform: null,
      presentation: null,
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
    // placeholder — the descriptive page heading. `title` above stays the
    // short name the sidebar shows and the eyebrow repeats.
    fullTitle:
      'KT Cloud TECH UP Enterprise Fellowship Project',
    accent: 'steel',
    // placeholder
    period: 'TBD', // placeholder
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
      { size: 'wide', value: '00', label: 'Metric one' }, // placeholder
      { size: 'square', value: '0 %', label: 'Metric two' }, // placeholder
      { size: 'square', value: '0 min', label: 'Metric three' }, // placeholder
    ],
    stack: [
      { category: 'Cloud/Infrastructure', items: ['AWS'] },
      { category: 'IaC/Automation', items: ['Terraform'] },
      { category: 'Containers', items: ['Kubernetes'] },
    ],
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
      readme: null,
      dashboard: null,
      terraform: null,
      presentation: null,
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
    // placeholder — the descriptive page heading. `title` above stays the
    // short name the sidebar shows and the eyebrow repeats.
    fullTitle:
      'Individual project one — full descriptive title TBD',
    accent: 'forest',
    // placeholder
    period: 'TBD', // placeholder
    // placeholder
    role: 'Placeholder for the contribution line. Solo build, so this is the whole scope rather than a slice of it.',
    // placeholder
    context:
      'Placeholder for what this project is and why it exists. Two or three sentences, written for someone who has not seen the repo. Replace with the real brief.',
    metrics: [
      { size: 'wide', value: '00', label: 'Metric one' }, // placeholder
      { size: 'square', value: '0 %', label: 'Metric two' }, // placeholder
      { size: 'square', value: '0 min', label: 'Metric three' }, // placeholder
    ],
    stack: [
      { category: 'Cloud/Infrastructure', items: ['AWS'] },
      { category: 'IaC/Automation', items: ['Terraform'] },
      { category: 'Containers', items: ['Docker'] },
    ],
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
      readme: null,
      dashboard: null,
      terraform: null,
      presentation: null,
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
    // placeholder — the descriptive page heading. `title` above stays the
    // short name the sidebar shows and the eyebrow repeats.
    fullTitle:
      'Individual project two — full descriptive title TBD',
    accent: 'indigo',
    // placeholder
    period: 'TBD', // placeholder
    // placeholder
    role: 'Placeholder for the contribution line. Solo build, so this is the whole scope rather than a slice of it.',
    // placeholder
    context:
      'Placeholder for what this project is and why it exists. Two or three sentences, written for someone who has not seen the repo. Replace with the real brief.',
    metrics: [
      { size: 'wide', value: '00', label: 'Metric one' }, // placeholder
      { size: 'square', value: '0 %', label: 'Metric two' }, // placeholder
      { size: 'square', value: '0 min', label: 'Metric three' }, // placeholder
    ],
    stack: [
      { category: 'Cloud/Infrastructure', items: ['AWS'] },
      { category: 'Containers', items: ['Kubernetes'] },
      { category: 'CI/CD', items: ['GitHub Actions'] },
    ],
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
      readme: null,
      dashboard: null,
      terraform: null,
      presentation: null,
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
    // placeholder — the descriptive page heading. `title` above stays the
    // short name the sidebar shows and the eyebrow repeats.
    fullTitle:
      'Serverless Resume Site on AWS, Provisioned End to End with Terraform',
    accent: 'indigo',
    // placeholder
    period: 'TBD', // placeholder
    // placeholder
    role: 'Solo build, end to end: the static site, the visitor-counter API behind it, the Terraform that stands it all up, and the pipeline that ships it.',
    // placeholder
    context:
      'The Cloud Resume Challenge, done as infrastructure rather than as a web page — every piece defined in Terraform and deployed by CI, with no console clicking anywhere in the path. The point was to prove the whole loop, not just the front end.',
    metrics: [
      { size: 'wide', value: '00', label: 'AWS resources', hint: 'AWS resources in Terraform' }, // placeholder
      { size: 'square', value: '0 min', label: 'Deploy time' }, // placeholder
      { size: 'square', value: '$0.00', label: 'Run cost', hint: 'Monthly run cost' }, // placeholder
    ],
    stack: [
      { category: 'Cloud/Infrastructure', items: ['AWS', 'S3', 'CloudFront', 'Route 53'] },
      { category: 'Compute/Data', items: ['Lambda', 'DynamoDB'] },
      { category: 'IaC/Automation', items: ['Terraform'] },
      { category: 'CI/CD', items: ['GitHub Actions'] },
    ],
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
      readme: null,
      dashboard: null,
      terraform: null,
      presentation: null,
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
    // placeholder — the descriptive page heading. `title` above stays the
    // short name the sidebar shows and the eyebrow repeats.
    fullTitle:
      'Containerized E-Commerce Workload on EKS with GitOps Delivery',
    accent: 'forest',
    // placeholder
    period: 'TBD', // placeholder
    // placeholder
    role: 'Solo build: cluster provisioning, the app workloads on top of it, autoscaling, and the GitOps flow that keeps the cluster matching the repo.',
    // placeholder
    context:
      'The Kubernetes Resume Challenge — an e-commerce workload taken from a container image to a running, autoscaling, self-updating cluster. Deliberately kept separate from the team autoscaling work so the solo end-to-end path stands on its own.',
    metrics: [
      { size: 'wide', value: '00', label: 'Workloads', hint: 'Workloads managed' }, // placeholder
      { size: 'square', value: '00 s', label: 'Scale-out', hint: 'Scale-out response time' }, // placeholder
      { size: 'square', value: '0 min', label: 'Rollout time' }, // placeholder
    ],
    stack: [
      { category: 'Containers', items: ['Kubernetes', 'EKS', 'Docker'] },
      { category: 'Packaging', items: ['Helm'] },
      { category: 'GitOps/CD', items: ['ArgoCD', 'GitHub Actions'] },
      { category: 'IaC/Automation', items: ['Terraform'] },
    ],
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
      readme: null,
      dashboard: null,
      terraform: null,
      presentation: null,
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
