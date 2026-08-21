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

// ---------------------------------------------------------------------------
// The template's keys, and the shape each section reads. Every one of these is
// optional: a section with no data either drops out or shows its own "not
// added yet" slot, so a half-filled project still produces a clean page. None
// of it is specific to any project — the components below read only these
// shapes, so adding a timeline or a cost breakdown to any project is filling
// in the key here and nothing else.
//
//   role          'prose' | { tiles: [{ size, label, text }] }
//                 `size` is big | wide | square, the same bento vocabulary the
//                 metrics use. Tiles carry sentences, not phrases.
//
//   context       'prose' | ['para', …] | { notes: [{ label, text }] }
//                 `notes` is the pinned idea board. Each note must be a
//                 complete sentence that stands alone — the format invites
//                 fragments and a fragment only works for someone who already
//                 knows the project.
//
//   implementation
//                 { months: ['YYYY-MM', …],
//                   span:   { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' },
//                   phases: [{ id, title, range, from, to, text }] }
//                 The calendar lights `span` until a phase is opened and that
//                 phase's range after. Dates are strings and are compared as
//                 strings — deliberately not Date objects, which would shift
//                 by a day west of Greenwich.
//
//   architecture  [{ tab, caption, alt, diagram }] or [{ …, src }]
//                 `diagram` is drawn from data by ArchDiagram.jsx and is the
//                 default for this site; `src` is an image file, for a diagram
//                 that genuinely is one. A project may mix the two.
//
//   cost          { unit, series: [{ id, label }, …], items, total, notes,
//                   caveat }
//                 Two series: the first renders grey, the second in the
//                 project accent. `caveat` is not fine print — a chart of
//                 estimates without it is a chart of claims.
//
//   decisions     [{ title, glyph, chose, over, why }]
//                 Decisions and trade-offs are one deck, not two sections:
//                 every entry is both. `over` may be null where the choice was
//                 a way of working rather than a fork.
//
// Two documents are discovered rather than declared: README.md and RUNBOOK.md
// under src/content/<slug>/, each optionally with a `.ko` translation beside
// it. Dropping the file in is the whole wiring step.
//
// There is deliberately no Live Dashboard key. See DESIGN.md.
// ---------------------------------------------------------------------------

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
      { name: 'Jiyoon Lee', initials: 'JY', title: 'Recovery Lead' },
      { name: 'Mingyu Kim', initials: 'MK', title: 'Monitoring Lead' },
      { name: 'Jiwoo Han', initials: 'JW', title: 'Observability Lead' },
    ],
    // The three sentences a reader who never scrolls should still come away
    // with. Fixed labels on purpose: every project answers the same three
    // questions in the same order, so two of them can be compared without
    // reading two write-ups. Rendered beside the workspace links.
    glance: {
      why: 'Unplanned downtime costs money the moment it happens. This project builds infrastructure that detects a failure and repairs itself automatically, without waiting for a human to respond.',
      how: 'Terraform and Ansible codify the entire stack, Prometheus and AlertManager detect failures, and a custom Recovery Controller runs the fix \u2014 connected across a hybrid VMware/AWS environment over Tailscale.',
      result: 'Recovers from failure in **30\u201360 seconds**, validated across **4 automated failure scenarios**, with the full infrastructure deployable from scratch in about **10 minutes**.',
    },
    // My Role as a bento of duties in three tiers, sized by how much of the
    // project each one was. Full sentences, not bullet phrases — "PR Owner
    // \u2014 27 PRs" is a fact about a number, and what a reader needs is what
    // owning that actually meant.
    //
    // `label` is the tile's key and is deliberately not rendered. A heading
    // over every sentence restated what the sentence already said; the
    // emphasis moved inside it instead, on the term that actually carries the
    // claim. One or two marks per sentence — a sentence with everything
    // emphasised has nothing emphasised.
    //
    // One lead (3x2), two medium (3x1) and three small (2x1) fill the
    // six-column grid exactly over three rows. The lead tile carries the
    // figure that earns it the space: 41 is the number this whole duty comes
    // down to, and without it the tile was a large box with a short sentence
    // in the top of it.
    //
    // Every claim here traces to something in the repo: the Terraform, the
    // Ansible roles, the merged PRs, the bootstrap script, the chaos role, the
    // troubleshooting log.
    role: {
      // Stated once, in full, under the monogram. It used to be split between
      // a short form up here and a "PR Owner" heading down in a tile, which
      // made one job read as two.
      title: 'Infrastructure Build Lead and PR Owner',
      tiles: [
        {
          size: 'lead',
          label: 'Infrastructure Build',
          stat: { value: '41', unit: 'AWS resources' },
          text: 'Codified every one of them in **Terraform**, and wrote the **Ansible roles** that configure each server automatically.',
        },
        {
          size: 'medium',
          label: 'PR Owner',
          text: 'Reviewed and merged all **27 pull requests** into the development branch, catching a **hardcoded secret** before it reached the public repo.',
        },
        {
          size: 'medium',
          label: 'Took Initiative',
          text: 'Stepped up to build the **on-premises foundation** early, after the assigned team lead was unavailable during the **first week and a half**.',
        },
        {
          size: 'small',
          label: 'Hybrid Networking',
          text: 'Wrote the **Tailscale bootstrap script** that joined the on-premises VMware environment and the AWS VPC into one addressable network.',
        },
        {
          size: 'small',
          label: 'Failure Injection',
          text: 'Built the Ansible `chaos` role and `chaos/inject.sh`, which made the recovery system **testable on demand**.',
        },
        {
          size: 'small',
          label: 'Troubleshooting',
          text: 'Worked through and documented **12 cases**, including the four iterations that ended in the `pkill -x` fix.',
        },
      ],
    },
    // An idea board rather than a paragraph. Four separate things worth
    // knowing, each a complete sentence that stands on its own \u2014 a reader
    // should be able to take any one of these without having read the other
    // three, which a single block of prose cannot offer.
    context: {
      notes: [
        {
          size: 'lead',
          label: 'Business Problem',
          text: 'Unplanned downtime costs money the moment it happens, through lost transactions and missed SLAs, and costs more again when an engineer has to be paged at 3am to fix it manually.',
        },
        {
          size: 'lead',
          label: 'Technical Problem',
          text: 'Most monitoring systems stop at telling you something broke; this project builds infrastructure that detects a failure and repairs itself automatically, without waiting for a human to respond.',
        },
        {
          size: 'support',
          label: 'Personal Foundation',
          text: "This was our team's first project applying cloud infrastructure skills to a real, end-to-end build, testing whether what we'd learned in the classroom actually held up under real deployment conditions.",
        },
        {
          size: 'support',
          label: 'Core Design Values',
          text: 'Every part of this system was built to be operated, not just deployed, with each line of code matched to a real operational failure scenario rather than monitoring treated as an afterthought.',
        },
        {
          size: 'support',
          label: 'Goals',
          text: 'The project aimed to cut incident response time low enough that most failures resolve before a human ever notices, while keeping every redeploy safe and repeatable through idempotent infrastructure.',
        },
        {
          size: 'support',
          label: 'Applicability',
          text: 'The same self-healing pattern applies to small and mid-sized ops teams automating routine restarts, to organizations mid-migration from on-premises to cloud, and to anyone building a hands-on infrastructure learning environment.',
        },
      ],
    },
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
    // Why the load-bearing tools were picked, at the level of the tool rather
    // than the line of code. Deliberately a different scope from `decisions`
    // further down: this answers "why Terraform at all", that one answers "why
    // a NAT instance over a NAT gateway". Four entries, not twenty \u2014 the
    // wheel already lists every tool, and a note against each would be a
    // second inventory rather than an argument.
    //
    // The headings are questions because that is what a collapsed row should
    // be: the thing you click is the question and the panel is the answer.
    stackNotes: [
      {
        tool: 'Why Terraform?',
        // Which tech's mark to borrow. The row shows the same graphic the wheel
        // does for that tool, monogram fallback included — the point is that a
        // reader recognises it from the wheel two inches to the left.
        icon: 'Terraform',
        text: 'Chosen as the industry-standard declarative IaC tool, making the entire **41-resource** infrastructure reproducible from a single command.',
      },
      {
        tool: 'Why Prometheus + Grafana?',
        icon: 'Prometheus',
        text: 'The standard open-source monitoring pairing, avoiding **vendor lock-in** while providing both alerting and visualization.',
      },
      {
        tool: 'Why Tailscale?',
        icon: 'Tailscale',
        text: 'Selected over a traditional site-to-site VPN for connecting on-premises to AWS \u2014 a **mesh VPN** needed almost no manual network configuration to bridge the two environments.',
      },
      {
        tool: 'Why Flask?',
        icon: 'Flask',
        text: 'A lightweight framework was enough for a **single-purpose webhook receiver** \u2014 no need for a heavier framework\u2019s overhead.',
      },
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
    // The calendar pair and the phase list read from this one block: `span`
    // is what the calendar lights when nothing is open, and each phase's
    // from/to is what it lights when that phase is. Dates are plain
    // 'YYYY-MM-DD' strings and are compared as strings \u2014 see StepsSection.jsx
    // for why they are deliberately not Date objects.
    implementation: {
      months: ['2026-04', '2026-05'],
      span: { from: '2026-04-20', to: '2026-05-22' },
      phases: [
        {
          id: 'topic',
          title: 'Topic & Prep',
          range: 'Apr 20\u201326',
          from: '2026-04-20',
          to: '2026-04-26',
          text: 'The team formed and selected infrastructure self-healing as the project topic, then practiced individual failure scenarios with instructor feedback.',
        },
        {
          id: 'onprem',
          title: 'On-Premises Build',
          range: 'Apr 27\u2013May 8',
          from: '2026-04-27',
          to: '2026-05-08',
          text: 'Each team member independently built the same four-server architecture on VMware, automated deployment with HAProxy and Ansible, and validated the build at a mid-project checkpoint presentation.',
        },
        {
          id: 'aws',
          title: 'AWS + Hybrid Integration',
          range: 'May 9\u201319',
          from: '2026-05-09',
          to: '2026-05-19',
          text: 'The infrastructure migrated to EC2 with full Terraform and Ansible automation, connected the on-premises and AWS environments over a Tailscale VPN, and merged individual failure scenarios into one team-wide automated recovery system.',
        },
        {
          id: 'polish',
          title: 'Final Polish',
          range: 'May 20\u201322',
          from: '2026-05-20',
          to: '2026-05-22',
          text: 'The team recorded the demo video, finalized the presentation materials, and rehearsed the final delivery.',
        },
      ],
    },
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
      {
        title: 'Demo stability over CI/CD',
        glyph: 'pipeline',
        chose: 'Rehearsing a **reliable demo**',
        over: 'building a CI/CD pipeline',
        why:
          'The team prioritized rehearsing a reliable demo over building a CI/CD pipeline that would only have run a handful of times before the project ended.',
      },
      {
        title: 'Depth over breadth in failure coverage',
        glyph: 'depth',
        chose: '**Four** failure scenarios, each fully self-healing',
        over: 'more failure types covered shallowly',
        why:
          'Four failure scenarios were engineered to be fully self-healing rather than covering more failure types shallowly, leaving production concerns like auto-scaling and multi-AZ as clear next steps rather than overlooked gaps.',
      },
      {
        title: 'Synthetic failure injection over waiting for real failures',
        glyph: 'inject',
        chose: '`chaos/inject.sh`, triggering failures **on demand**',
        over: 'waiting for something to break on its own',
        why:
          '`chaos/inject.sh` was built to trigger failures on demand, allowing the recovery system to be tested repeatedly and safely instead of being validated only when something happened to break on its own.',
      },
    ],
    // placeholder \u2014 EVERY NUMBER BELOW IS AN ESTIMATE, not billing data.
    // They are modelled from the decisions the project actually made (a NAT
    // instance instead of a managed gateway, PostgreSQL and the monitoring
    // stack self-hosted on instances the project was already paying nothing
    // for) against what the same architecture costs built the ordinary way in
    // ap-northeast-2. Replace the figures with the real ones from
    // COST_ANALYSIS.md; the shape of the block does not need to change.
    //
    // Rows are ordered by the size of the gap, largest first \u2014 the chart
    // should lead with the decision that saved the most.
    cost: {
      unit: 'USD / month',
      series: [
        { id: 'typical', label: 'Typical unoptimized build' },
        { id: 'actual', label: 'This project' },
      ],
      items: [
        {
          label: 'Outbound routing',
          note: 'NAT instance vs. managed NAT Gateway',
          typical: 38.0,
          actual: 0.0,
        },
        {
          label: 'Compute',
          note: '4 instances \u2014 mgmt, web x2, db',
          typical: 34.0,
          actual: 0.0,
        },
        {
          label: 'Database',
          note: 'PostgreSQL on EC2 vs. managed RDS',
          typical: 25.0,
          actual: 0.0,
        },
        {
          label: 'Monitoring',
          note: 'self-hosted Prometheus + Grafana vs. managed',
          typical: 22.0,
          actual: 0.0,
        },
        {
          label: 'Storage & transfer',
          note: 'EBS beyond the 30 GB free tier',
          typical: 9.0,
          actual: 1.2,
        },
      ],
      total: { typical: 128.0, actual: 1.2 },
      notes: [
        'The largest single saving is the **NAT instance**: a managed NAT Gateway bills by the hour whether or not anything is routed through it, and at this volume of outbound traffic a `t3.micro` doing the same job costs nothing inside the free tier.',
        'Running **PostgreSQL and the monitoring stack on instances the project already had** removes two managed-service line items. That is a real trade \u2014 no automated backups, no failover, and patching becomes the team\u2019s job \u2014 and it is the right one for a project that is demonstrated rather than operated around the clock.',
        'Compute reaches zero because the whole fleet fits inside the **750-hour free tier** across four `t3.micro` instances. The same architecture on `t3.small` on-demand is roughly **$34 a month**, which is the honest number for anyone rebuilding this outside a free-tier account.',
        'The only figure that is not zero is **EBS**: four root volumes exceed the 30 GB the free tier covers. Nothing was optimized away here, and pretending otherwise would have made every other row less believable.',
      ],
      caveat:
        'Estimated figures, based on free-tier AWS usage in `ap-northeast-2` over the project period \u2014 not production billing data. The comparison column prices the same architecture built with managed equivalents at on-demand rates.',
    },
    links: {
      github: 'https://github.com/EchoChallengers/project1-aws',
      notion: null, // TODO: not finalized
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
    // Drawn from this project's own context and role above; the result line waits on real numbers.
    glance: {
      why: 'Insecure infrastructure and container images are cheapest to stop before they ever reach a running environment. The team wanted security to be a build step that runs unattended and fails loudly, not a review meeting.',
      how: 'Terraform defines the AWS stack, GitHub Actions runs every change through Trivy scanning and policy gates, and the secrets path runs from CI into the Kubernetes cluster without a manual hop.',
      result: 'Placeholder for the outcome — the findings caught pre-merge, the time to remediate, and how much of the pipeline is gated. Replace once the metrics above are real.',
    },
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
    // Drawn from this description rather than pasted in as an export \u2014 see
    // components/sections/ArchDiagram.jsx. placeholder: the layout is
    // reconstructed from the original draw.io diagram and should be checked
    // against the real deployment before this project goes public.
    architecture: [
      {
        alt: 'AWS and on-premises joined over Tailscale: Route 53 and an ACM certificate terminating at the load balancer, blue and green application instances in private subnets across two availability zones, a bastion and NAT in the public subnet, database backups to S3, and an on-premises Prometheus, Grafana and Alertmanager stack alerting to Telegram',
        tab: 'Security architecture',
        caption: 'Security architecture \u2014 AWS, blue/green instances, and the on-premises monitoring stack',
        diagram: {
          width: 1000,
          height: 660,
          zones: [
            { id: 'aws', label: 'AWS \u00b7 ap-northeast-2', x: 186, y: 34, w: 800, h: 390, tone: 'cloud' },
            {
              id: 'vpc',
              label: 'VPC',
              note: '10.0.0.0/16',
              x: 210,
              y: 68,
              w: 560,
              h: 340,
              tone: 'region',
            },
            { id: 'public', label: 'Public subnet', x: 228, y: 100, w: 524, h: 88, tone: 'region' },
            { id: 'az-a', label: 'AZ 2a \u00b7 private', x: 228, y: 212, w: 254, h: 96, tone: 'region' },
            { id: 'az-c', label: 'AZ 2c \u00b7 private', x: 498, y: 212, w: 254, h: 96, tone: 'region' },
            {
              id: 'onprem',
              label: 'On-premises \u00b7 monitoring stack',
              x: 186,
              y: 464,
              w: 800,
              h: 176,
              tone: 'onprem',
            },
          ],
          nodes: [
            { id: 'visitor', label: 'Visitor', glyph: 'user', x: 86, y: 148, w: 140, h: 56 },
            {
              id: 'alb',
              label: 'Load balancer',
              sub: 'Route 53 \u00b7 ACM',
              glyph: 'balancer',
              x: 360,
              y: 148,
            },
            { id: 'bastion', label: 'Bastion + NAT', glyph: 'server', x: 620, y: 148 },
            { id: 'blue', label: 'App \u2014 blue', sub: 'live', glyph: 'container', x: 360, y: 262 },
            { id: 'green', label: 'App \u2014 green', sub: 'candidate', glyph: 'container', x: 620, y: 262 },
            { id: 'db', label: 'PostgreSQL', glyph: 'database', x: 360, y: 358, h: 52 },
            { id: 's3', label: 'S3 \u2014 backups', glyph: 'bucket', x: 880, y: 358, h: 52 },
            { id: 'prom', label: 'Prometheus', glyph: 'monitor', x: 330, y: 522 },
            { id: 'grafana', label: 'Grafana', glyph: 'forecast', x: 330, y: 604, h: 52 },
            { id: 'alertmanager', label: 'Alertmanager', glyph: 'alert', x: 620, y: 522 },
            { id: 'telegram', label: 'Telegram', glyph: 'chat', x: 620, y: 604, h: 52 },
          ],
          edges: [
            { from: 'visitor', to: 'alb', label: 'HTTPS' },
            { from: 'alb', to: 'blue', label: '100%' },
            {
              from: 'alb',
              to: 'green',
              label: '0% \u00b7 candidate',
              labelAt: [500, 196],
              dash: true,
              via: [
                [360, 200],
                [620, 200],
              ],
            },
            { from: 'bastion', to: 'green', label: 'SSH', dash: true },
            { from: 'blue', to: 'db' },
            { from: 'db', to: 's3', label: 'nightly backup', dash: true },
            {
              from: 'prom',
              to: 'bastion',
              label: 'Tailscale VPN \u00b7 scrape',
              labelAt: [790, 300],
              dash: true,
              via: [
                [330, 452],
                [790, 452],
                [790, 148],
              ],
            },
            { from: 'prom', to: 'grafana', label: 'metrics' },
            { from: 'prom', to: 'alertmanager', label: 'fires' },
            { from: 'alertmanager', to: 'telegram', label: 'notify' },
          ],
        },
      },
    ],
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
    glance: {
      why: 'Reactive autoscaling always pays for the lag — capacity arrives after the traffic does, so the bill covers both the waiting and the overshoot.',
      how: 'Prometheus and Grafana feed a forecast of the next window of demand, which KEDA and Karpenter turn into scheduled capacity on EKS — the cluster is pre-warmed before load lands and shrinks again when it does not.',
      result: 'Placeholder for the outcome — the cost delta against reactive scaling is the figure this project turns on. Replace once the metrics above are real.',
    },
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
    // Eight views of the same system, a tab each: the whole AWS layout, then
    // the four runtime flows, the GitOps path, the cluster, and the pods.
    //
    // Drawn from these descriptions rather than pasted in as exports — see
    // components/sections/ArchDiagram.jsx. The originals were draw.io SVGs
    // carrying a raster image and Korean labels, at up to 1.7MB each.
    //
    // placeholder: the layouts are reconstructed from those originals and
    // should be checked against the real deployment before this project goes
    // public.
    architecture: [
      {
        tab: 'Overall architecture',
        caption: 'Overall architecture — VPC, EKS, and the managed services around them',
        alt: 'Full AWS layout in ap-northeast-2: Route 53 and CloudFront into an internet gateway, a 10.0.0.0/16 VPC split across availability zones 2a and 2c, an EKS cluster with Karpenter-managed nodes behind an ALB ingress, RDS, and the management services alongside',
        diagram: {
          width: 1000,
          height: 560,
          zones: [
            { id: 'aws', label: 'AWS · ap-northeast-2', x: 150, y: 26, w: 836, h: 510, tone: 'cloud' },
            { id: 'vpc', label: 'VPC', note: '10.0.0.0/16', x: 176, y: 120, w: 640, h: 390, tone: 'region' },
            { id: 'eks', label: 'EKS cluster', x: 210, y: 250, w: 560, h: 170, tone: 'focus' },
          ],
          nodes: [
            { id: 'rider', label: 'Passenger app', glyph: 'user', x: 70, y: 70, w: 124, h: 54 },
            { id: 'dns', label: 'Route 53', glyph: 'dns', x: 250, y: 70 },
            { id: 'cdn', label: 'CloudFront', glyph: 'cdn', x: 490, y: 70 },
            { id: 'igw', label: 'Internet gateway', glyph: 'cloud', x: 730, y: 70 },
            { id: 'alb', label: 'ALB ingress', glyph: 'balancer', x: 490, y: 185 },
            { id: 'nodeA', label: 'Karpenter nodes', sub: 'AZ 2a', glyph: 'cluster', x: 350, y: 335 },
            { id: 'nodeC', label: 'Karpenter nodes', sub: 'AZ 2c', glyph: 'cluster', x: 630, y: 335 },
            { id: 'rds', label: 'RDS PostgreSQL', glyph: 'database', x: 350, y: 465 },
            { id: 'sqs', label: 'SQS', glyph: 'queue', x: 630, y: 465 },
            { id: 's3', label: 'S3', sub: 'models & forecasts', glyph: 'bucket', x: 900, y: 335 },
          ],
          edges: [
            { from: 'rider', to: 'dns' },
            { from: 'dns', to: 'cdn' },
            { from: 'cdn', to: 'igw' },
            { from: 'igw', to: 'alb' },
            { from: 'alb', to: 'nodeA', via: [[490, 270], [350, 270]] },
            { from: 'alb', to: 'nodeC', via: [[490, 270], [630, 270]] },
            { from: 'nodeA', to: 'rds' },
            { from: 'nodeC', to: 'sqs' },
            { from: 'nodeC', to: 's3', dash: true },
          ],
        },
      },
      {
        tab: 'Request flow',
        caption: 'Flow 1 — a ride request, from the app to the queue',
        alt: 'A ride request travelling from the passenger app through Route 53, CloudFront and the load balancer to the call API pod, which queues the job on SQS and answers immediately before asynchronous processing continues',
        diagram: {
          width: 1000,
          height: 330,
          nodes: [
            { id: 'app', label: 'Passenger app', glyph: 'user', x: 110, y: 80, w: 150 },
            { id: 'dns', label: 'Route 53', glyph: 'dns', x: 330, y: 80 },
            { id: 'cdn', label: 'CloudFront', glyph: 'cdn', x: 550, y: 80 },
            { id: 'alb', label: 'ALB', glyph: 'balancer', x: 770, y: 80 },
            { id: 'api', label: 'call-api pod', glyph: 'container', x: 770, y: 210 },
            { id: 'sqs', label: 'SQS queue', glyph: 'queue', x: 490, y: 210 },
            { id: 'worker', label: 'Worker pods', glyph: 'container', x: 210, y: 210 },
          ],
          edges: [
            { from: 'app', to: 'dns' },
            { from: 'dns', to: 'cdn' },
            { from: 'cdn', to: 'alb' },
            { from: 'alb', to: 'api' },
            { from: 'api', to: 'sqs', label: 'enqueue' },
            { from: 'sqs', to: 'worker', label: 'async pickup' },
            {
              from: 'api',
              to: 'app',
              label: '202 accepted — returned immediately',
              labelAt: [440, 286],
              dash: true,
              via: [[770, 292], [110, 292]],
            },
          ],
        },
      },
      {
        tab: 'Prediction pipeline',
        caption: 'Flow 2 — demand prediction, model load through to the prediction table',
        alt: 'The forecast scheduler running every four hours: loading its model from S3, reading the stored weather and traffic data, computing a demand prediction with LightGBM, and writing the result to the prediction table in RDS',
        diagram: {
          width: 1000,
          height: 330,
          nodes: [
            { id: 'sched', label: 'Forecast scheduler', sub: 'every 4 hours', glyph: 'pipeline', x: 120, y: 85, w: 180 },
            { id: 'predict', label: 'Prediction pod', sub: 'LightGBM', glyph: 'forecast', x: 430, y: 85 },
            { id: 'out', label: 'RDS', sub: 'prediction table', glyph: 'database', x: 760, y: 85 },
            { id: 'model', label: 'S3', sub: 'model artifact', glyph: 'bucket', x: 280, y: 220 },
            { id: 'inputs', label: 'RDS', sub: 'weather & traffic', glyph: 'database', x: 580, y: 220 },
          ],
          edges: [
            { from: 'sched', to: 'predict', label: 'triggers' },
            { from: 'predict', to: 'out', label: 'writes forecast' },
            { from: 'model', to: 'predict', label: 'load', labelAt: [300, 146], via: [[280, 155], [430, 155]] },
            { from: 'inputs', to: 'predict', label: 'read', labelAt: [566, 146], via: [[580, 155], [430, 155]] },
          ],
        },
      },
      {
        tab: 'Weather ingest',
        caption: 'Flow 3 — scheduled weather collection into S3',
        alt: 'A scheduled job calling the Open-Meteo forecast API out through the NAT gateway, checking the response is valid, retrying on the next cycle if not, and otherwise writing the forecast CSV to S3 for the prediction pods to read',
        diagram: {
          width: 1000,
          height: 340,
          nodes: [
            { id: 'job', label: 'Weather job', sub: 'scheduled', glyph: 'pipeline', x: 110, y: 85, w: 150 },
            { id: 'nat', label: 'NAT gateway', glyph: 'cloud', x: 330, y: 85 },
            { id: 'api', label: 'Open-Meteo API', glyph: 'cloud', x: 560, y: 85 },
            { id: 'check', label: 'Response valid?', glyph: 'scan', x: 790, y: 85 },
            { id: 's3', label: 'S3', sub: 'forecast CSV', glyph: 'bucket', x: 790, y: 220 },
            { id: 'retry', label: 'Retry next cycle', glyph: 'pipeline', x: 330, y: 220 },
          ],
          edges: [
            { from: 'job', to: 'nat' },
            { from: 'nat', to: 'api', label: 'egress' },
            { from: 'api', to: 'check' },
            { from: 'check', to: 's3', label: 'yes' },
            {
              from: 'check',
              to: 'retry',
              label: 'no — wait for the next run',
              labelAt: [600, 285],
              dash: true,
              via: [[900, 85], [900, 292], [330, 292]],
            },
            { from: 'retry', to: 'job', dash: true, via: [[110, 220]] },
          ],
        },
      },
      {
        tab: 'Predictive scaling',
        caption: 'Flow 4 — turning a forecast into scheduled capacity',
        alt: 'Predicted demand becoming capacity: a scheduler patching the KEDA scaled object minimum replica count every sixty seconds, KEDA also reacting to SQS queue length, and Karpenter provisioning a node when the existing ones have no room',
        diagram: {
          width: 1000,
          height: 320,
          nodes: [
            { id: 'pred', label: 'RDS', sub: 'prediction table', glyph: 'database', x: 100, y: 90, w: 150 },
            { id: 'patch', label: 'Scaler job', sub: 'every 60s', glyph: 'wrench', x: 350, y: 90, w: 160 },
            { id: 'keda', label: 'KEDA ScaledObject', glyph: 'forecast', x: 640, y: 90, w: 180 },
            { id: 'pods', label: 'Worker pods', glyph: 'container', x: 880, y: 90, w: 150 },
            { id: 'sqs', label: 'SQS queue depth', glyph: 'queue', x: 640, y: 230, w: 180 },
            { id: 'karpenter', label: 'Karpenter', sub: 'provisions a node', glyph: 'cluster', x: 880, y: 230, w: 150 },
          ],
          edges: [
            { from: 'pred', to: 'patch', label: 'read forecast' },
            { from: 'patch', to: 'keda', label: 'sets minReplicas' },
            { from: 'keda', to: 'pods', label: 'scale' },
            { from: 'sqs', to: 'keda', label: 'reactive trigger' },
            { from: 'pods', to: 'karpenter', label: 'pending pod ↔ new node', labelAt: [858, 165], dir: 'both' },
          ],
        },
      },
      {
        tab: 'GitOps flow',
        caption: 'GitOps — three repositories, from pull request to cluster sync',
        alt: 'The three-repository GitOps path: a feature branch reaching dev through a peer-approved pull request, then splitting to the infra repo for Terraform plan and apply, the app repo for image build and push, and the manifests repo that ArgoCD watches and syncs to the cluster',
        diagram: {
          width: 1000,
          height: 400,
          nodes: [
            { id: 'feature', label: 'feature/*', glyph: 'git', x: 110, y: 70 },
            { id: 'pr', label: 'Pull request', sub: 'peer approved', glyph: 'git', x: 330, y: 70 },
            { id: 'dev', label: 'dev branch', glyph: 'git', x: 550, y: 70 },
            { id: 'infra', label: 'Infra repo', sub: 'terraform plan / apply', glyph: 'wrench', x: 200, y: 205, w: 180 },
            { id: 'appRepo', label: 'App repo', sub: 'build & push image', glyph: 'container', x: 480, y: 205 },
            { id: 'manifests', label: 'Manifests repo', glyph: 'git', x: 760, y: 205 },
            { id: 'cluster', label: 'EKS cluster', glyph: 'cluster', x: 480, y: 330 },
            { id: 'argocd', label: 'ArgoCD', glyph: 'pipeline', x: 760, y: 330 },
          ],
          edges: [
            { from: 'feature', to: 'pr' },
            { from: 'pr', to: 'dev', label: 'merge' },
            { from: 'dev', to: 'infra', via: [[550, 140], [200, 140]] },
            { from: 'dev', to: 'appRepo', via: [[550, 140], [480, 140]] },
            { from: 'dev', to: 'manifests', via: [[550, 140], [760, 140]] },
            { from: 'appRepo', to: 'manifests', label: 'image tag' },
            { from: 'manifests', to: 'argocd', label: 'watched' },
            { from: 'argocd', to: 'cluster', label: 'sync' },
            { from: 'infra', to: 'cluster', label: 'provisions', labelAt: [340, 262], via: [[200, 268], [480, 268]] },
          ],
        },
      },
      {
        tab: 'Cluster topology',
        caption: 'Cluster topology — control plane, node groups, and networking',
        alt: 'Cluster topology: the EKS control plane, system node groups and Karpenter-managed EC2 nodes spread across two availability zones, with the ALB ingress, NAT gateway and VPC gateway endpoint that serve them',
        diagram: {
          width: 1000,
          height: 520,
          zones: [
            { id: 'vpc', label: 'VPC', note: '10.0.0.0/16', x: 150, y: 56, w: 800, h: 430, tone: 'cloud' },
            { id: 'az-a', label: 'Availability zone 2a', x: 180, y: 210, w: 370, h: 256, tone: 'region' },
            { id: 'az-c', label: 'Availability zone 2c', x: 570, y: 210, w: 370, h: 256, tone: 'region' },
          ],
          nodes: [
            { id: 'control', label: 'EKS control plane · AWS managed', x: 550, y: 22, w: 300, h: 44 },
            { id: 'alb', label: 'ALB ingress', glyph: 'balancer', x: 365, y: 130 },
            { id: 'nat', label: 'NAT gateway', glyph: 'cloud', x: 755, y: 130 },
            { id: 'sysA', label: 'System node group', sub: 'EKS managed', glyph: 'server', x: 365, y: 285 },
            { id: 'karpA', label: 'Karpenter nodes', sub: 'EC2, on demand', glyph: 'cluster', x: 365, y: 400 },
            { id: 'sysC', label: 'System node group', sub: 'EKS managed', glyph: 'server', x: 755, y: 285 },
            { id: 'karpC', label: 'Karpenter nodes', sub: 'EC2, on demand', glyph: 'cluster', x: 755, y: 400 },
          ],
          edges: [
            { from: 'control', to: 'alb', dash: true, via: [[550, 78], [365, 78]] },
            { from: 'control', to: 'nat', dash: true, via: [[550, 78], [755, 78]] },
            { from: 'alb', to: 'sysA' },
            { from: 'alb', to: 'sysC', via: [[365, 190], [755, 190]] },
          ],
          captions: [
            {
              x: 180,
              y: 505,
              tone: 'accent',
              text: 'Karpenter adds and drains EC2 nodes in either zone to fit whatever the scheduler cannot place.',
            },
          ],
        },
      },
      {
        tab: 'Pod architecture',
        caption: 'Pod architecture — services, workers, and what they scale on',
        alt: 'Pod-level view: the call API, simulator and predict services with their pods, a worker deployment scaled by KEDA on SQS queue depth, Karpenter provisioning a new worker node for a pending pod, and the SQS, RDS and S3 each of them talks to',
        diagram: {
          width: 1000,
          height: 480,
          zones: [{ id: 'cluster', label: 'EKS cluster', x: 150, y: 44, w: 520, h: 410, tone: 'focus' }],
          nodes: [
            { id: 'callapi', label: 'call-api', sub: '2 pods', glyph: 'container', x: 285, y: 110 },
            { id: 'simulator', label: 'simulator', sub: '1 pod', glyph: 'container', x: 285, y: 230 },
            { id: 'predict', label: 'predict', sub: '1 pod', glyph: 'container', x: 285, y: 350 },
            { id: 'worker', label: 'worker', sub: 'KEDA-scaled', glyph: 'container', x: 530, y: 175 },
            { id: 'keda', label: 'KEDA', sub: 'queue-depth trigger', glyph: 'forecast', x: 530, y: 290 },
            { id: 'karpenter', label: 'Karpenter', sub: 'adds a node', glyph: 'cluster', x: 530, y: 400 },
            { id: 'sqs', label: 'SQS', glyph: 'queue', x: 860, y: 110, h: 52 },
            { id: 'rds', label: 'RDS', glyph: 'database', x: 860, y: 230, h: 52 },
            { id: 's3', label: 'S3', glyph: 'bucket', x: 860, y: 350, h: 52 },
          ],
          edges: [
            { from: 'callapi', to: 'sqs', label: 'enqueue' },
            { from: 'simulator', to: 'rds', label: 'writes' },
            { from: 'predict', to: 's3', label: 'model artifacts' },
            { from: 'sqs', to: 'keda', label: 'queue depth', labelAt: [660, 164], via: [[860, 170], [715, 170], [715, 290]] },
            { from: 'keda', to: 'worker', label: 'scales' },
            {
              from: 'worker',
              to: 'karpenter',
              label: 'pending pod ↔ new node',
              // Set from its right edge, so it stops short of the KEDA box
              // instead of running under it. Centred on the line there is no
              // x that clears both the pod column on the left and KEDA on the
              // right.
              labelAt: [438, 292],
              labelAnchor: 'end',
              dir: 'both',
              via: [[440, 175], [440, 400]],
            },
          ],
        },
      },
    ],
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
    // Whole entry is placeholder: this project's context and role are still placeholder too.
    glance: {
      why: 'Placeholder for the problem this project set out to solve, and why it was worth solving. One sentence, for a reader who will not scroll.',
      how: 'Placeholder for what was actually built — the stack and the shape of it, in one sentence.',
      result: 'Placeholder for the outcome, with the figure that proves it. Replace once the metrics above are real.',
    },
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
    glance: {
      why: 'Placeholder for the problem this project set out to solve, and why it was worth solving. One sentence, for a reader who will not scroll.',
      how: 'Placeholder for what was actually built — the stack and the shape of it, in one sentence.',
      result: 'Placeholder for the outcome, with the figure that proves it. Replace once the metrics above are real.',
    },
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
    glance: {
      why: 'Placeholder for the problem this project set out to solve, and why it was worth solving. One sentence, for a reader who will not scroll.',
      how: 'Placeholder for what was actually built — the stack and the shape of it, in one sentence.',
      result: 'Placeholder for the outcome, with the figure that proves it. Replace once the metrics above are real.',
    },
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
    glance: {
      why: 'The Cloud Resume Challenge is usually finished as a web page. Doing it as infrastructure instead — every piece in Terraform, nothing clicked in the console — proves the whole delivery loop rather than just the front end.',
      how: 'A static site on S3 behind CloudFront and Route 53, a visitor-counter API on Lambda and DynamoDB, all defined in Terraform and shipped by GitHub Actions.',
      result: 'Placeholder for the outcome — the deploy time and the running cost are the figures worth stating here. Replace once the metrics above are real.',
    },
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
    glance: {
      why: 'An e-commerce workload is only interesting once it survives on its own. This one goes from a container image to a cluster that scales and updates itself, kept separate from the team autoscaling work so the solo path stands alone.',
      how: 'Terraform provisions EKS, Helm packages the workloads, and ArgoCD with GitHub Actions keeps the running cluster matching what is in the repo.',
      result: 'Placeholder for the outcome, with the figure that proves it. Replace once the metrics above are real.',
    },
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
