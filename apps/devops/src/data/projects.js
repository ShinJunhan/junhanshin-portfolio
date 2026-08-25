// A translated copy, not the repo's file: the comments are in English so the
// portfolio reads to an English-speaking visitor, while every line of actual
// Terraform is byte-for-byte what the repo holds. The upstream file in
// EchoChallengers/project1-aws is untouched.
import echoMainTf from '../content/echochallengers/code/terraform/main.tf?raw'
import echoRecoveryMap from '../content/echochallengers/code/recovery/recovery_map.yml?raw'
import echoAlertRules from '../content/echochallengers/code/monitoring/alert.rules.yml?raw'

// Lock-N-Lock's, on the same terms: comments translated, every line of actual
// code byte-for-byte what the repo holds. Its Terraform is split across
// thirteen per-concern files rather than one main.tf, so the four here are the
// ones that carry Track A's own story — the network, the per-tier groups, the
// compute that hangs off them, and the outputs the other four tracks consumed.
import lnlNetworkTf from '../content/lock-n-lock/code/terraform/network.tf?raw'
import lnlSecurityGroupsTf from '../content/lock-n-lock/code/terraform/security_groups.tf?raw'
import lnlComputeTf from '../content/lock-n-lock/code/terraform/compute.tf?raw'
import lnlOutputsTf from '../content/lock-n-lock/code/terraform/outputs.tf?raw'
import lnlRecoveryMap from '../content/lock-n-lock/code/recovery/recovery_map.yaml?raw'
import lnlAlertRules from '../content/lock-n-lock/code/monitoring/alert_rules.yaml?raw'

// hailcast's, on the same terms, with one difference worth stating precisely
// because this project's code is not all Terraform.
//
// Translated: comments, and the prose a human is meant to read — the `echo`
// text in the two shell scripts and the `description` strings on the IAM
// policies. Untouched: everything that is behaviour. Control flow, identifiers,
// variable names, flags, numbers, ARNs, IAM actions and resources, resource
// names and ServiceAccount names are byte-for-byte what the repositories hold.
// One thing deliberately left in Korean: `teardown_체크리스트.md`, because it is
// a filename in the repo and not a sentence.
//
// The six span all four repositories, so this is not one track's source the way
// the other two projects' sections are. Two are mine, two are the mechanism the
// page is about, and two are the infrastructure — which is Miseon Lee's work
// and is captioned as hers.
import hcLib from '../content/hailcast/code/ops/_lib.sh?raw'
import hcTeardown from '../content/hailcast/code/ops/teardown.sh?raw'
import hcDecisionEngine from '../content/hailcast/code/predict/scaling_decision_engine.py?raw'
import hcScaledObject from '../content/hailcast/code/manifests/scaledobject.yaml?raw'
import hcSchedule from '../content/hailcast/code/terraform/schedule/main.tf?raw'
import hcIrsa from '../content/hailcast/code/terraform/eks/irsa.tf?raw'

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
//                   span:   { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }
//                             | [{ from, to }, …],
//                   phases: [{ id, title, range, from, to, text }] }
//                 The calendar lights `span` until a phase is opened and that
//                 phase's range after. Dates are strings and are compared as
//                 strings — deliberately not Date objects, which would shift
//                 by a day west of Greenwich.
//                 `span` may be a list, for a project that genuinely stopped
//                 and restarted: one range would shade the gap as project time,
//                 and a week nobody worked should read as a week nobody worked.
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

// Lock-N-Lock's exported diagram set, built from a table rather than written
// out as five near-identical entries. Two things are said once here instead of
// five times: the folder the files sit in, and each view's name.
//
// That name is the string the SVG already carries in its own `<title>`, so the
// tab, the address bar and the image's accessible name all agree with what the
// file says it is. It has to be repeated as `alt` because an `<img>` renders
// its SVG as a replaced element and never exposes the title inside it — a
// screen reader reaching that text any other way is not a thing that happens.
//
// No caption: these are the authors' own exports and the diagram names them.
// Inventing a line of description under each would be writing copy about a
// picture rather than letting the picture carry it.
const LOCK_N_LOCK_DIAGRAM_DIR = '/projects/lock-n-lock/'

const LOCK_N_LOCK_DIAGRAMS = [
  ['architecture-01-system-overview.svg', 'System Overview'],
  ['architecture-02-alerting-automation-flow.svg', 'Alerting & Automation Flow'],
  ['architecture-03-user-request-flow.svg', 'User Request Flow'],
  ['architecture-04-operations-backup-flow.svg', 'Operations & Backup Flow'],
  ['architecture-05-blue-green-deployment.svg', 'Blue-Green Deployment'],
].map(([file, title]) => ({
  src: `${LOCK_N_LOCK_DIAGRAM_DIR}${file}`,
  tab: title,
  alt: title,
}))

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
    // Drawn from data rather than exported, in the same vocabulary as the
    // Lock-N-Lock and HailCast diagrams below: zones underneath, nodes placed
    // by their centres, edges routed orthogonally, one accent — the project's
    // own emerald — carried by the glyphs and nothing else. See
    // ArchDiagram.jsx for the spec and public/projects/README.md for why a
    // diagram is data here and not a file.
    //
    // These replace two draw.io JPGs, which are still in public/ but no longer
    // referenced: raster, Korean-labelled, permanently light-mode, and opaque
    // to search and to a screen reader.
    //
    // Every label traces to the repo rather than to those exports. The subnet
    // CIDRs and the instance placement come from terraform/main.tf — which is
    // also where the NAT instance is corrected to public AZ 1, beside
    // aws-mgmt, rather than the AZ 2 the JPG drew it in. The scrape and alert
    // timings come from ansible/roles/monitoring, and the four scenarios with
    // their retry counts and cooldowns from recovery/controller/config/recovery_map.yml.
    architecture: [
      {
        tab: 'Hybrid infrastructure',
        caption:
          'Hybrid infrastructure — the VMware on-premises host and the AWS VPC joined into one addressable network over Tailscale',
        alt: 'The on-premises VMware host proj-mgmt, running Terraform and Ansible, joined over a Tailscale VPN to an AWS VPC in ap-northeast-2: an internet-facing load balancer on HTTP 80 spread across two availability zones; aws-web1 and the NAT instance with aws-mgmt in the 10.0.1.0/24 public subnet in AZ 1; aws-web2 in the 10.0.2.0/24 public subnet in AZ 2; aws-db running PostgreSQL 16 in the 10.0.11.0/24 private subnet, reaching the internet through the NAT instance and the internet gateway; and aws-mgmt carrying Prometheus, Grafana, Alertmanager and the Flask recovery controller',
        diagram: {
          width: 1000,
          height: 680,
          zones: [
            // Dashed and outside the provider, the convention the other two
            // diagrams already use for anything that is not AWS.
            { id: 'onprem', label: 'On-premises · VMware', x: 16, y: 266, w: 206, h: 164, tone: 'onprem' },
            { id: 'aws', label: 'AWS · ap-northeast-2', x: 258, y: 20, w: 728, h: 588, tone: 'cloud' },
            { id: 'vpc', label: 'VPC', note: '10.0.0.0/16', x: 272, y: 90, w: 692, h: 482, tone: 'region' },
            { id: 'pubaz1', label: 'Public subnet · AZ 1', note: '10.0.1.0/24', x: 302, y: 182, w: 400, h: 232, tone: 'region' },
            { id: 'pubaz2', label: 'Public · AZ 2', note: '10.0.2.0/24', x: 736, y: 182, w: 220, h: 232, tone: 'region' },
            { id: 'privaz1', label: 'Private subnet · AZ 1', note: '10.0.11.0/24', x: 302, y: 440, w: 400, h: 100, tone: 'region' },
          ],
          nodes: [
            { id: 'internet', label: 'Internet users', glyph: 'user', x: 96, y: 56, w: 152, h: 50 },
            // On the VPC's own top edge, where a gateway attached to the VPC
            // rather than to a subnet belongs.
            { id: 'igw', label: 'Internet gateway', glyph: 'cloud', x: 604, y: 90, w: 190, h: 44 },
            { id: 'alb', label: 'ALB', sub: 'HTTP 80 · AZ 1 + AZ 2', glyph: 'balancer', x: 470, y: 150, w: 200, h: 48 },
            { id: 'web1', label: 'aws-web1', sub: 'Nginx · exporters', glyph: 'server', x: 410, y: 242, w: 176, h: 56 },
            // A NAT instance rather than a managed gateway, and in AZ 1 with the
            // management host — both are what main.tf actually declares.
            { id: 'nat', label: 'NAT instance', sub: 't3.micro', glyph: 'cloud', x: 604, y: 242, w: 168, h: 56 },
            // The whole control plane is one box because it is one machine: the
            // monitoring stack and the recovery controller share aws-mgmt.
            { id: 'mgmt', label: 'aws-mgmt', sub: 'Prometheus · Grafana · Alertmanager · Flask', glyph: 'monitor', x: 530, y: 348, w: 336, h: 60 },
            { id: 'web2', label: 'aws-web2', sub: 'Nginx · exporters', glyph: 'server', x: 854, y: 242, w: 176, h: 56 },
            { id: 'db', label: 'aws-db', sub: 'PostgreSQL 16 · node exporter', glyph: 'database', x: 520, y: 496, w: 300, h: 52 },
            { id: 'projmgmt', label: 'proj-mgmt', sub: 'Terraform · Ansible', glyph: 'wrench', x: 118, y: 348, w: 184, h: 56 },
          ],
          // Two lanes carry most of the routing: the alley between the VPC wall
          // and the subnets on the left, and the gap between the two availability
          // zones on the right. Both exist because a zone's label owns the strip
          // along its own top edge, and a line drawn through a label is a line
          // that has to be read twice.
          edges: [
            // Into the load balancer's top edge rather than its left, so the
            // arrow arrives pointing the way the traffic is going. The label is
            // placed by hand outside the provider boundary: at the path's own
            // midpoint it lands between two zone labels and reads as a third.
            { from: 'internet', to: 'alb', label: 'HTTP 80', labelAt: [212, 48], via: [[470, 56]] },
            // Around the outside of the public subnet and in through aws-web1's
            // left edge: straight down would cross the subnet's own label.
            { from: 'alb', to: 'web1', via: [[287, 150], [287, 242]] },
            // Down the gap between the two zones and in through the left edge,
            // for the same reason as aws-web1: dropping onto aws-web2's top edge
            // would put the line through the AZ 2 label.
            { from: 'alb', to: 'web2', via: [[710, 150], [710, 242]] },
            // Down the same alley to the private subnet. It leaves the boxed area
            // rather than threading between aws-mgmt and the subnet wall, which
            // is the only other line the geometry allows.
            { from: 'web1', to: 'db', label: 'SQL', labelAt: [296, 400], labelAnchor: 'start', via: [[410, 300], [287, 300], [287, 496]] },
            // AZ 2 reaches the same database around the bottom of the VPC, for
            // the same reason: everything between the two is already occupied.
            { from: 'web2', to: 'db', via: [[854, 558], [520, 558]] },
            // The private subnet's default route: out through the NAT instance
            // and the gateway above it.
            { from: 'db', to: 'nat', label: 'egress', labelAt: [734, 470], labelAnchor: 'start', dash: true, via: [[728, 496], [728, 242]] },
            { from: 'nat', to: 'igw', dash: true },
            // One line for the hybrid half of the project. It points both ways
            // because both directions are real: Ansible runs from on-premises
            // into the VPC, and aws-mgmt advertises the VPC routes back. The
            // label sits left of the alley it crosses.
            { from: 'projmgmt', to: 'mgmt', label: 'Tailscale', labelAt: [248, 341], dash: true, dir: 'both' },
          ],
          captions: [
            {
              x: 16,
              y: 636,
              tone: 'accent',
              text: 'Terraform provisions all 41 resources; Ansible configures every server from proj-mgmt, over the Tailscale mesh.',
            },
            {
              x: 16,
              y: 660,
              text: 'aws-mgmt advertises the VPC subnet routes into the tailnet and the VPC routes 172.16.1.0/24 back, so both networks address each other directly.',
            },
          ],
        },
      },
      {
        tab: 'Self-healing flow',
        caption:
          'Self-healing flow — detection, the webhook decision, the four recovery scenarios, and the result posted back',
        alt: 'The self-healing pipeline in four phases: detect, where node and nginx exporters are scraped every five seconds by Prometheus and a rule firing for five seconds reaches Alertmanager; decide, where Alertmanager notifies Slack and posts a webhook to the Flask recovery controller on port 5001, which looks the alertname up in recovery_map.yml; recover, where one of four scripts runs over Ansible — restart nginx, restart the nginx exporter, or pkill the CPU and memory load — and is then verified and retried up to its limit; and report, where the outcome is posted to Slack as SUCCESS, FAILED or NO_MAP',
        diagram: {
          width: 1000,
          height: 680,
          // The four phases the original export labelled down its left margin,
          // drawn as bands instead: a phase is a horizontal slice of the flow,
          // and a band says so without spending a column on chips.
          zones: [
            { id: 'detect', label: 'Detect', note: 'MTTD 5–10s', x: 20, y: 30, w: 960, h: 120, tone: 'region' },
            { id: 'decide', label: 'Decide', note: 'alertname → script', x: 20, y: 176, w: 960, h: 120, tone: 'region' },
            // The band the project is actually about.
            { id: 'recover', label: 'Recover', x: 20, y: 322, w: 960, h: 176, tone: 'focus' },
            { id: 'report', label: 'Report', note: 'MTTR 30–60s', x: 20, y: 524, w: 960, h: 96, tone: 'region' },
          ],
          nodes: [
            { id: 'exporters', label: 'Exporters', sub: 'node :9100 · nginx :9113', glyph: 'service', x: 175, y: 108, w: 250, h: 56 },
            { id: 'prometheus', label: 'Prometheus', sub: 'scrape 5s · rule eval', glyph: 'monitor', x: 500, y: 108, w: 230, h: 56 },
            { id: 'alertmanager', label: 'Alertmanager', sub: 'group_wait 5s', glyph: 'alert', x: 830, y: 108, w: 240, h: 56 },
            { id: 'controller', label: 'Recovery Controller', sub: 'Flask · :5001 · recovery_map.yml', glyph: 'pipeline', x: 300, y: 254, w: 340, h: 60 },
            { id: 'slackmon', label: 'Slack #monitoring', sub: 'failure detected', glyph: 'chat', x: 830, y: 254, w: 240, h: 60 },
            // The four scenarios, in the order recovery_map.yml lists them. The
            // sub-line is the fix and its retry limit, which is the part of the
            // policy a reader cannot infer from the name.
            { id: 'nginx', label: 'Nginx down', sub: 'restart nginx · ×3', glyph: 'wrench', x: 145, y: 386, w: 210, h: 52 },
            { id: 'exporter', label: 'Exporter down', sub: 'restart exporter · ×3', glyph: 'wrench', x: 385, y: 386, w: 210, h: 52 },
            { id: 'cpu', label: 'High CPU', sub: 'pkill -x stress-ng · ×2', glyph: 'wrench', x: 625, y: 386, w: 210, h: 52 },
            { id: 'memory', label: 'High memory', sub: 'pkill -x stress-ng · ×2', glyph: 'wrench', x: 865, y: 386, w: 210, h: 52 },
            { id: 'verify', label: 'Verify + retry', sub: 'is-active · cooldown 60–120s', glyph: 'shield', x: 505, y: 462, w: 300, h: 52 },
            { id: 'slackrec', label: 'Slack #recovery', sub: 'SUCCESS · FAILED · NO_MAP', glyph: 'chat', x: 505, y: 574, w: 420, h: 56 },
          ],
          edges: [
            { from: 'exporters', to: 'prometheus', label: 'scrape 5s' },
            { from: 'prometheus', to: 'alertmanager', label: 'for: 5s' },
            // Both leave Alertmanager on the same stem and split in the gutter
            // between the bands — one alert, two destinations, which is what the
            // routing config actually does.
            { from: 'alertmanager', to: 'controller', label: 'webhook :5001', labelAt: [565, 154], via: [[830, 162], [300, 162]] },
            { from: 'alertmanager', to: 'slackmon', label: 'notify' },
            // One bus out of the controller. Four separate L-routes would each
            // leave the same point anyway; drawn as a bus they read as one
            // lookup with four outcomes.
            { from: 'controller', to: 'nginx', via: [[300, 309], [145, 309]] },
            { from: 'controller', to: 'exporter', via: [[300, 309], [385, 309]] },
            { from: 'controller', to: 'cpu', via: [[300, 309], [625, 309]] },
            { from: 'controller', to: 'memory', via: [[300, 309], [865, 309]] },
            // And back into one: whichever script ran, the same verify step
            // decides whether it worked.
            { from: 'nginx', to: 'verify', via: [[145, 424], [505, 424]] },
            { from: 'exporter', to: 'verify', via: [[385, 424], [505, 424]] },
            { from: 'cpu', to: 'verify', via: [[625, 424], [505, 424]] },
            { from: 'memory', to: 'verify', via: [[865, 424], [505, 424]] },
            { from: 'verify', to: 'slackrec', label: 'result' },
          ],
          captions: [
            {
              x: 20,
              y: 646,
              tone: 'accent',
              text: 'Detection to recovery runs unattended — 5–10s to detect, 30–60s to recover, validated across all four scenarios.',
            },
            {
              x: 20,
              y: 668,
              text: 'Each alertname maps to one recover_*.sh in recovery_map.yml; a failed verify retries to its limit, then reports FAILED.',
            },
          ],
        },
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
    // The descriptive page heading. `title` above stays the short name the
    // sidebar shows and the eyebrow repeats. The app inside is called
    // LockBank; the project keeps the team's name, and Problem & Context
    // introduces the app once so "the app" reads unambiguously further down.
    fullTitle:
      'Real-Time Security Detection and Self-Healing Infrastructure for a Financial Service Platform',
    accent: 'coral',
    // From the deck's schedule slide, which gives the four weeks as 5/27\u20136/2,
    // 6/3\u20136/9, 6/10\u20136/17 and 6/18\u20136/24. The year is fixed by the recovery
    // log in the demo screenshots, which is stamped 2026-06-24 \u2014 the last day
    // of week four.
    period: 'May 27 \u2013 June 24, 2026',
    // Every track is the deck's own team table, not an inference. `initials` is
    // explicit for the same reason it is on EchoChallengers: Korean given names
    // romanize as two syllables.
    team: [
      { name: 'Junhan Shin', initials: 'JS', title: 'Team Lead \u00b7 Infrastructure' },
      { name: 'Jeongeun Park', initials: 'JE', title: 'Security Scenario' },
      { name: 'Sangwoo Choi', initials: 'SW', title: 'Application & DB' },
      { name: 'Jongwon Lim', initials: 'JW', title: 'CI/CD & Deployment' },
      { name: 'Jiyoon Lee', initials: 'JY', title: 'Monitoring & Recovery' },
    ],
    // The three sentences a reader who never scrolls should still come away
    // with, drawn from the sections below rather than written separately.
    glance: {
      why: 'A financial service cannot bolt security on at the end — a brute-force login run or a flood of API calls costs money the moment it lands, in fraud, in downtime, and in regulatory exposure. This platform makes every layer of defense a build step that runs unattended.',
      how: 'Terraform defines a two-AZ AWS stack joined to an on-premise Rocky Linux server over a Tailscale tunnel, GitHub Actions runs Bandit, Trivy, and OWASP ZAP on every push, and a Recovery Controller restarts and re-verifies any container Prometheus reports as failed.',
      result: 'Four independent security layers over **~60 Terraform-defined AWS resources** and **19 running containers**, with **5 attack and failure scenarios** demonstrated live against real attack traffic rather than described.',
    },
    // My Role as a bento of duties sized by how much of the project each one
    // was — same three tiers and same six-tile fill as EchoChallengers: one
    // lead (3x2), two medium (3x1) and three small (2x1) tile the six-column
    // grid exactly over three rows.
    //
    // `label` is the tile's key and is deliberately not rendered; the emphasis
    // lives inside the sentence instead. One or two marks per tile.
    //
    // Scoped to Track A. An earlier draft of this section claimed CI/CD &
    // DevSecOps as a second track, which the deck contradicts: its team table
    // and its section header both put Track C under Jongwon Lim. What the deck
    // does put here is the lead role (slide 1's opening line) and final
    // approval on `main` (slide 11), so those are what the lead tile carries.
    // Every other tile traces to slide 22 or slide 23 — the two slides that
    // list this track's own deliverables.
    role: {
      title: 'Team Lead and Infrastructure Track Owner',
      tiles: [
        {
          size: 'lead',
          label: 'Team Lead',
          stat: { value: '~60', unit: 'AWS resources' },
          text: 'Held **final approval on every merge** to `main` — the last check before anything reached the running platform, on a five-person team working five parallel tracks.',
        },
        {
          size: 'medium',
          label: 'Infrastructure',
          text: 'Designed the **VPC, multi-AZ subnets, five security groups, and the Blue/Green Auto Scaling Group** in Terraform, with a NAT instance and Bastion in place of managed equivalents.',
        },
        {
          size: 'medium',
          label: 'Remote State',
          text: 'Put the Terraform state on an **S3 backend with DynamoDB locking**, so five people could run `apply` against one infrastructure without overwriting each other.',
        },
        {
          size: 'small',
          label: 'Hybrid Networking',
          text: 'Joined the on-premise Rocky Linux server to the AWS VPC over a **Tailscale L3 tunnel**, with `accept-routes=false` to stop it breaking Remote-SSH.',
        },
        {
          size: 'small',
          label: 'Branch Strategy',
          text: 'Set the `feature` → `dev` → `main` flow with **no direct pushes and mandatory review**, and a Gemini review bot passing over each PR before a human did.',
        },
        {
          size: 'small',
          label: 'Shared Interface',
          text: 'Kept `outputs.tf` as the **single contract** the other four tracks consumed — ALB DNS, target-group ARNs, security-group IDs, DB addresses.',
        },
      ],
    },
    // An idea board rather than a paragraph. Seven notes: one lead spanning
    // two of the four columns plus two supports fills the first row, and four
    // supports fill the second — the board comes out square rather than
    // ragged. Every note is a complete sentence that stands on its own.
    context: {
      notes: [
        {
          size: 'lead',
          label: 'Business Problem',
          text: 'A financial service cannot treat security as something added at the end: **credential stuffing drains real accounts**, an API flood takes the service down during business hours, and a single container failure at 3am becomes an outage nobody is awake to fix — each of them costing money, customer trust, and regulatory standing the moment it lands.',
        },
        {
          size: 'support',
          label: 'What We Built',
          text: 'We built **LockBank**, a demo banking app with login, balance, and transfers, and wrapped it in a security-first cloud platform designed around **three incidents we expected to actually face** — brute-force login attempts, API request flooding, and container failure.',
        },
        {
          size: 'support',
          label: 'Proved, Not Claimed',
          text: 'We did not stop at building the defenses — we attacked our own platform with **Locust**-generated traffic and read back what the dashboards said, so every control on this page was demonstrated live rather than configured and assumed.',
        },
        {
          size: 'support',
          label: 'Hybrid by Design',
          text: 'AWS runs the app tier — **ALB, Auto Scaling Group, Bastion, and the Main DB** — across two Availability Zones, while an on-premise Rocky Linux server holds the Replica DB and the monitoring stack, the two halves meeting over a **Tailscale Layer-3 tunnel with no public port open on either side**.',
        },
        {
          size: 'support',
          label: 'The 4-Layer Lock',
          text: 'Security runs on four independent layers — **static code analysis, container image scanning, dynamic application testing, and runtime defense** — what we called the **"4-layer lock,"** a deliberate nod to the team name: a vulnerability has to get past four different kinds of scrutiny before it reaches a user.',
        },
        {
          size: 'support',
          label: 'A Real Attacker, Uninvited',
          text: 'Minutes after the EC2 went public, **automated scans for WordPress and PHP webshell paths** started arriving on their own — unsolicited internet background noise, not our Locust script — and were turned away at Nginx before a request ever reached the application.',
        },
        {
          size: 'support',
          label: 'Self-Healing',
          text: 'When something fails, a **Recovery Controller** detects it through Prometheus, checks a YAML-defined policy, restarts the affected container, re-verifies health, then logs and reports the outcome to **Telegram** — so the 3am failure resolves itself before anyone is paged for it.',
        },
      ],
    },
    // `size` drives the bento layout. On the 5-column grid these six tile it
    // exactly: row 1 is the big tile (2 wide) plus three squares, row 2 is the
    // big tile's second row plus the wide tile (2) and the last square.
    //
    // The big tile is the four-layer lock because that is the project's whole
    // thesis, not because four is the largest number here. The recovery figure
    // is labelled as a design target rather than a measurement — it was not
    // independently timed across every failure type, and stating it as an
    // achieved MTTR would be a claim the project cannot back.
    metrics: [
      {
        size: 'big',
        value: '4',
        label: 'Independent Security Layers',
        detail: 'SAST → image scan → DAST → runtime block',
      },
      {
        size: 'square',
        value: '~60',
        label: 'AWS Resources',
        hint: 'VPC, subnets, ALB, Auto Scaling Group, EC2, S3, IAM, CloudWatch — all defined in Terraform',
      },
      {
        size: 'square',
        value: '19',
        label: 'Running Containers',
        hint: 'App (4) + DB (4) + monitoring and security (11)',
      },
      {
        size: 'square',
        value: '6',
        label: 'Layers Verified E2E',
        hint: 'Infra → network → app → DB → security path → monitoring, each live-verified rather than just configured',
      },
      {
        size: 'wide',
        value: '5',
        label: 'Scenarios Demonstrated Live',
        detail: 'Normal operation, login brute-force, API flooding, container failure, and a secure-deploy gate — each triggered and resolved on camera',
      },
      {
        size: 'square',
        value: '23.24s',
        label: 'Measured Recovery',
        hint: 'One timed run: the recovery log reads verify success at 23.24s on the first attempt, against a ≤5 min RTO/RPO design target — not a mean across every failure type',
      },
    ],
    // Grouped by what each tool is for, with no `tint` overrides — the
    // tech-stack row is accent-free (DESIGN.md). Labels are the vendors' own
    // names; a label with no SVG under src/assets/icons/ renders a monogram
    // tile rather than a gap, so the missing logos are a drop-in later and
    // never a reason to rename a tool.
    stack: [
      { category: 'Dev & Collaboration', items: ['VS Code', 'GitHub', 'GitHub Actions', 'Notion'] },
      { category: 'Infrastructure', items: ['Terraform', 'Ansible', 'AWS', 'Tailscale', 'Docker'] },
      { category: 'Application & Data', items: ['FastAPI', 'PostgreSQL', 'Nginx'] },
      {
        category: 'Monitoring & Alerting',
        items: ['Prometheus', 'Grafana', 'Loki', 'Promtail', 'Alertmanager', 'Telegram'],
      },
      { category: 'Security', items: ['Bandit', 'Trivy', 'OWASP ZAP', 'fail2ban', 'Locust'] },
    ],
    // Why the load-bearing tools, at the level of the tool rather than the
    // line of code — the same scope EchoChallengers uses, and deliberately
    // different from `decisions` below: this answers "why Locust at all", that
    // one answers "why a 401 instead of a 302". Five, not twenty: the wheel
    // already lists every tool and a note against each would be a second
    // inventory rather than an argument.
    stackNotes: [
      {
        tool: 'Why Terraform?',
        icon: 'Terraform',
        text: 'The whole **~60-resource** footprint had to be reproducible by any of five people — and with the state on an **S3 backend behind a DynamoDB lock**, two of them running `apply` at once is a queue rather than a corruption.',
      },
      {
        tool: 'Why Tailscale?',
        icon: 'Tailscale',
        text: 'The on-premise server had to reach into the VPC with **no public port open on either side**. A mesh VPN gave that for almost no network configuration, where a site-to-site tunnel would have meant static addressing on a machine behind NAT.',
      },
      {
        tool: 'Why Prometheus, Grafana and Loki?',
        icon: 'Prometheus',
        text: 'Metrics alone could not answer the questions this project asks. Loki and Promtail put the **Nginx access log beside the metrics** in one console, which is what lets a 401 spike and the request that caused it be read together.',
      },
      {
        tool: 'Why Locust?',
        icon: 'Locust',
        text: 'A defense nobody has attacked is a configuration, not a control. Three scripted profiles — **normal traffic, credential brute-force, and API flooding** — made every claim on this page something we could trigger on demand and watch fail or hold.',
      },
      {
        tool: 'Why Telegram?',
        icon: 'Telegram',
        text: 'Alerts had to reach a phone without standing up an on-call platform for a four-week project. Two independent paths end there — **Alertmanager** for anything Prometheus sees, and **CloudWatch → SNS → Lambda** for anything that happens to the instances themselves.',
      },
    ],
    // Drawn from this description rather than pasted in as an export \u2014 see
    // components/sections/ArchDiagram.jsx. Checked against the original
    // draw.io export, which is the last tab in this list: the subnet CIDRs,
    // the auto scaling group, the internet gateway, CloudWatch, the S3 backup
    // path with its Lambda and SNS, and the on-premises replica all come from
    // it, and the NAT is an EC2 instance rather than a managed gateway.
    //
    // One thing the export does not settle: it labels the on-premises box
    // 'Monitoring' without naming what runs in it. Prometheus and Grafana are
    // kept here from the earlier reconstruction and are the only unverified
    // labels left in this diagram.
    architecture: [
      {
        alt: 'AWS and on-premises joined over Tailscale: Route 53 and an ACM-terminated HTTPS listener on the load balancer, blue and green application instances under an auto scaling group in the 10.0.11.0/24 and 10.0.12.0/24 private subnets, a bastion and a NAT instance in the 10.0.1.0/24 public subnet, a PostgreSQL host in the 10.0.21.0/24 private subnet backing up to S3 with Lambda and SNS beside it, CloudWatch driving the scaling alarms, and an on-premises monitoring host and database replica reached over Tailscale',
        // "Security architecture" undersold it: the drawing is the whole
        // system \u2014 network, compute, data, backups and the on-premises side \u2014
        // and security is the lens the project looks at it through, not the
        // subset it draws. "Overall architecture" is what hailcast already
        // calls the same view of itself, and it leaves "System Overview" free
        // for the export tab that carries that name inside its own file.
        tab: 'Overall architecture',
        caption: 'Overall architecture \u2014 AWS, blue/green under one auto scaling group, and the on-premises hosts over Tailscale',
        diagram: {
          width: 1000,
          height: 760,
          zones: [
            { id: 'aws', label: 'AWS \u00b7 ap-northeast-2', x: 150, y: 20, w: 836, h: 500, tone: 'cloud' },
            { id: 'vpc', label: 'VPC', note: '10.0.0.0/16', x: 176, y: 130, w: 520, h: 372, tone: 'region' },
            { id: 'public', label: 'Public subnet', note: '10.0.1.0/24', x: 196, y: 192, w: 480, h: 92, tone: 'region' },
            { id: 'asg', label: 'Auto Scaling group \u00b7 blue / green', x: 196, y: 296, w: 480, h: 100, tone: 'focus' },
            { id: 'dbsub', label: 'Private subnet', note: '10.0.21.0/24', x: 196, y: 402, w: 480, h: 88, tone: 'region' },
            { id: 'onprem', label: 'On-premises \u00b7 reached over Tailscale', x: 150, y: 552, w: 836, h: 186, tone: 'onprem' },
          ],
          nodes: [
            { id: 'visitor', label: 'Client', glyph: 'user', x: 76, y: 248, w: 132, h: 52 },
            { id: 'route53', label: 'Route 53', glyph: 'dns', x: 580, y: 64, w: 170, h: 46 },
            // On the VPC's top edge, which is where an internet gateway
            // actually sits \u2014 attached to the VPC rather than inside a subnet.
            { id: 'igw', label: 'Internet gateway', glyph: 'cloud', x: 580, y: 130, w: 190, h: 44 },
            { id: 'alb', label: 'ALB', sub: 'ACM \u00b7 HTTPS 443', glyph: 'balancer', x: 282, y: 248, w: 150, h: 54 },
            { id: 'bastion', label: 'Bastion', sub: 'EC2', glyph: 'server', x: 440, y: 248, w: 130, h: 54 },
            // A NAT instance, not a managed NAT gateway \u2014 the export is
            // explicit about it, and it is the cheaper of the two.
            { id: 'nat', label: 'NAT', sub: 'EC2 instance', glyph: 'cloud', x: 596, y: 248, w: 150, h: 54 },
            { id: 'blue', label: 'App \u2014 blue', sub: 'live \u00b7 AZ 2a \u00b7 10.0.11.0/24', glyph: 'container', x: 310, y: 352, w: 210, h: 58 },
            { id: 'green', label: 'App \u2014 green', sub: 'standby \u00b7 AZ 2c \u00b7 10.0.12.0/24', glyph: 'container', x: 550, y: 352, w: 210, h: 58 },
            { id: 'db', label: 'PostgreSQL', sub: 'EC2', glyph: 'database', x: 430, y: 456, w: 190, h: 50 },
            { id: 'cw', label: 'CloudWatch', sub: 'alarms drive the ASG', glyph: 'monitor', x: 850, y: 248, w: 190, h: 54 },
            { id: 'lambda', label: 'Lambda', glyph: 'service', x: 770, y: 352, w: 120, h: 46 },
            { id: 'sns', label: 'SNS', glyph: 'alert', x: 920, y: 352, w: 120, h: 46 },
            { id: 's3', label: 'S3', sub: 'pg_dump backups', glyph: 'bucket', x: 850, y: 456, w: 190, h: 52 },
            { id: 'monitor', label: 'Monitoring', sub: 'Prometheus \u00b7 Grafana', glyph: 'monitor', x: 300, y: 614, w: 210, h: 54 },
            { id: 'mgmt', label: 'proj-mgmt', glyph: 'server', x: 560, y: 614, w: 150, h: 54 },
            { id: 'replica', label: 'DB replica', glyph: 'database', x: 820, y: 614, w: 160, h: 54 },
          ],
          edges: [
            { from: 'visitor', to: 'alb', label: 'HTTPS 443' },
            { from: 'route53', to: 'igw' },
            // Down into the corridor above the public subnet rather than
            // along the VPC's own top border, which the direct route traces.
            { from: 'igw', to: 'alb', via: [[485, 168], [282, 168]] },
            { from: 'alb', to: 'blue', label: '100%' },
            {
              from: 'alb',
              to: 'green',
              label: '0% \u00b7 standby',
              labelAt: [420, 286],
              dash: true,
              via: [
                [282, 290],
                [550, 290],
              ],
            },
            // Into green's left edge, down the gap between the two apps: the
            // automatic route arrives on the top edge, where the load
            // balancer's own arrow already lands.
            {
              from: 'bastion',
              to: 'green',
              label: 'SSH',
              labelAt: [430, 340],
              dash: true,
              via: [[440, 352]],
            },
            { from: 'blue', to: 'db', label: 'SQL', bend: 'v' },
            { from: 'green', to: 'db', dash: true, bend: 'v' },
            // Egress runs out through the NAT instance and the gateway. Routed
            // by hand down the strip between the apps and the VPC wall, which
            // is the only lane that clears both.
            {
              from: 'green',
              to: 'nat',
              label: 'egress',
              labelAt: [692, 316],
              labelAnchor: 'start',
              dash: true,
              via: [
                [684, 352],
                [684, 290],
                [596, 290],
              ],
            },
            { from: 'nat', to: 'igw', dash: true },
            { from: 'db', to: 's3', label: 'pg_dump nightly', dash: true },
            { from: 's3', to: 'lambda', dash: true },
            { from: 'lambda', to: 'sns', dash: true },
            // The two Tailscale paths the export's legend names. Both leave
            // the diagram's boxed area entirely rather than threading between
            // the subnets \u2014 which is what a VPN into the VPC looks like.
            {
              from: 'monitor',
              to: 'blue',
              label: 'Tailscale \u00b7 scrape',
              labelAt: [70, 430],
              dash: true,
              via: [
                [300, 528],
                [70, 528],
                [70, 352],
              ],
            },
            {
              from: 'db',
              to: 'replica',
              label: 'streaming replication',
              labelAt: [625, 536],
              dash: true,
              via: [
                [430, 542],
                [820, 542],
              ],
            },
          ],
        },
      },
      // The five exported views, spread from the table above the PROJECTS
      // list. They replace the single stacked-panel export that used to sit
      // here: the same system, but split one flow to a diagram instead of five
      // panels crammed into one canvas that only read at full size.
      // ---------------------------------------------------------------------
      ...LOCK_N_LOCK_DIAGRAMS,
    ],
    // The infrastructure track's own tree, as the deck lists it. Only the part
    // that was mine: the four other tracks have trees of their own on their
    // own slides, and reproducing all five here would be an inventory of the
    // repository rather than of the work this page is about.
    folderStructure: `
project2-security/
├── setup.sh                      # Rocky 8 toolchain — AWS CLI v2, Terraform, Ansible, Docker
├── check.sh                      # preflight: credentials, Docker, Tailscale reachability
├── bootstrap_tailscale.sh        # joins proj-mgmt and advertises 172.16.1.0/24
├── Makefile                      # init/plan/apply · deploy-db · build-push · service · destroy
└── infra/terraform/
    ├── provider.tf               # aws · tls · local · cloudflare · tailscale + S3 backend
    ├── variables.tf              # instance types, CIDRs, DB credentials, ASG sizing, DNS toggle
    ├── network.tf                # VPC · multi-AZ subnets (public/app/db) · route tables · IGW
    ├── security_groups.tf        # five groups — alb, app, db, bastion, nat
    ├── compute.tf                # NAT instance · Bastion · App ASG (blue/green) · DB EC2
    ├── user_data_app.sh          # ASG boot: pull image, run, join the tailnet
    ├── alb.tf                    # ALB + blue/green target groups + /health listener
    ├── tailscale.tf              # auth keys, Bastion subnet-route approval, DB node
    ├── dns.tf                    # Route 53 / Cloudflare / none
    ├── iam.tf                    # DB → S3 backup, Grafana → CloudWatch read
    ├── cloudwatch.tf             # ALB · ASG · target-group alarms + SNS topic
    ├── storage.tf                # S3 — pg_dump backups and log retention
    ├── outputs.tf                # the interface: ALB DNS · TG ARNs · SG IDs · DB IP · bucket
    ├── ansible.tf                # writes the Ansible inventory after apply
    ├── .terraform.lock.hcl       # provider versions pinned, so five machines agree
    └── init/                     # run once, before everything else
        ├── S3_bucket.tf          # remote state
        └── Dynamodb.tf           # state lock
`,
    // The calendar pair and the phase list both read from here. Straight from
    // the deck's schedule slide \u2014 including that week three runs eight days
    // (6/10\u20136/17) where the other three run seven, which is what the slide
    // says rather than something smoothed over here.
    implementation: {
      months: ['2026-05', '2026-06'],
      span: { from: '2026-05-27', to: '2026-06-24' },
      phases: [
        {
          id: 'design',
          title: 'Topic & Architecture Design',
          range: 'May 27 \u2013 Jun 2',
          from: '2026-05-27',
          to: '2026-06-02',
          text: 'The team picked the topic, defined the three incident scenarios it would defend against, split the work into the five tracks, and designed the architecture.',
        },
        {
          id: 'build',
          title: 'Infrastructure, App & DB',
          range: 'Jun 3\u20139',
          from: '2026-06-03',
          to: '2026-06-09',
          text: 'Mentor feedback was folded back into the design, the CI/CD collaboration setup went in, and the AWS infrastructure went up alongside the FastAPI app and its PostgreSQL pair.',
        },
        {
          id: 'secure',
          title: 'Monitoring & Security Scenarios',
          range: 'Jun 10\u201317',
          from: '2026-06-10',
          to: '2026-06-17',
          text: 'With the app service running, the observability stack and the security scenarios were built on top of it \u2014 the layer where detection, blocking, and automated recovery actually became demonstrable.',
        },
        {
          id: 'verify',
          title: 'Verification & Delivery',
          range: 'Jun 18\u201324',
          from: '2026-06-18',
          to: '2026-06-24',
          text: 'Final code review, an end-to-end run of the demo flow, recording the demo footage, and writing the report.',
        },
      ],
    },
    // The deck's five demo scenarios, one tab each, with the screenshots pulled
    // from the presentation rather than restaged. Three of them are single
    // captures and say so through `state` — an attack run has no meaningful
    // "before" beyond the baseline in tab one, and labelling one anyway would
    // be a pair invented for the layout's sake.
    //
    // The Locust capture is edited in one respect: the live host in its header
    // is masked and the browser's own bookmarks bar cropped off. Nothing inside
    // the run — request counts, failure rate, timings — is touched. The private
    // 10.0.x and Tailscale 100.x addresses in the logs are left as they are:
    // neither range routes off the network it belongs to, and blanking them
    // would take the evidence out of a screenshot that exists to be evidence.
    // Track A's Terraform, in the order the infrastructure is actually built:
    // the network first, the groups that police it, the instances that sit
    // inside it, and last the outputs that publish all of it to everyone else.
    //
    // Four files rather than one because this repo has no main.tf — the work is
    // split per concern across thirteen files, and picking one would have meant
    // showing a quarter of the tier and calling it the whole.
    terraform: [
      { path: 'infra/terraform/network.tf', content: lnlNetworkTf },
      { path: 'infra/terraform/security_groups.tf', content: lnlSecurityGroupsTf },
      { path: 'infra/terraform/compute.tf', content: lnlComputeTf },
      { path: 'infra/terraform/outputs.tf', content: lnlOutputsTf },
    ],
    // What happens when an alert fires, and what has to fire before anything
    // happens at all. The policy file is the more interesting half: it carries
    // the three categories, the notify-only mode, and the team's own open
    // questions — PostgresDown undecided, and a controller that cannot recover
    // itself — left in the file rather than tidied away for the portfolio.
    recoveryPolicy: [
      {
        path: 'monitoring/recovery/config/recovery_map.yaml',
        content: lnlRecoveryMap,
      },
      {
        path: 'monitoring/prometheus/rules/alert_rules.yaml',
        content: lnlAlertRules,
      },
    ],
    media: {
      scenarios: [
        {
          id: 'normal',
          tab: 'Normal operation',
          label: 'Scenario 1 — Normal operation',
          before: {
            src: '/projects/lock-n-lock/normal-operation-console.png',
            state: 'Baseline — every panel green',
            alt: 'The Security Center console on its Normal Operation tab: App Health UP, DB Status UP, zero active alerts, ALB target health HEALTHY, one ASG instance, and CPU and network charts tracking a quiet service',
          },
        },
        {
          id: 'login-bruteforce',
          tab: 'Login brute-force',
          label: 'Scenario 2 — Credential brute-force',
          before: {
            src: '/projects/lock-n-lock/login-bruteforce-401-log.png',
            state: 'Under attack — a 401 logged per failed attempt',
            alt: 'Application logs during a Locust brute-force run: repeated SECURITY LOGIN_FAILURE warnings naming the source IP and attempted username, each paired with a POST /login returning 401 Unauthorized, interleaved with health checks still returning 200',
          },
        },
        {
          id: 'api-flood',
          tab: 'API flooding',
          label: 'Scenario 3 — API request flooding',
          before: {
            src: '/projects/lock-n-lock/api-flood-locust.png',
            state: 'Under attack — 99% of requests refused at the rate limit',
            alt: 'The Locust statistics table mid-run: 112 aggregated requests against 111 failures, a 99% failure rate reported in the header, with the GET /transfer row showing 108 requests and 108 failures as the rate limit refuses them',
          },
        },
        {
          id: 'container-recovery',
          tab: 'Container failure',
          label: 'Scenario 4 — Container failure and self-healing',
          before: {
            src: '/projects/lock-n-lock/container-failure-before.png',
            state: 'Before the failure',
            alt: 'The Security Center console before the container is killed, showing the service healthy on its Normal Operation tab',
          },
          after: {
            src: '/projects/lock-n-lock/container-recovery-after.png',
            state: 'Recovered unattended in 23.24s',
            alt: 'The console on its Container Recovery tab after the failure: App Health back to UP, two recovery attempts, a 100% recovery success rate, and a recovery log reading verify success for BankAppDown at 23.24 seconds on the first attempt, above a critical log entry showing the failed health check that triggered it',
          },
        },
        {
          id: 'secure-deploy',
          tab: 'Secure deploy',
          label: 'Scenario 5 — The security gate on a deploy',
          before: {
            src: '/projects/lock-n-lock/secure-deploy-bandit-sast.png',
            state: 'Stage 1 — Bandit, static analysis',
            alt: 'Bandit output in the pipeline listing B310 blacklist findings at medium severity and high confidence, each mapped to CWE-22 and pinned to a file and line number in the application source',
          },
          after: {
            src: '/projects/lock-n-lock/secure-deploy-trivy-blocked.png',
            state: 'Stage 2 — Trivy, and the build stops',
            alt: 'Trivy image-scan output listing three HIGH severity CVEs in Python packages with their installed and fixed versions, followed by the job ending on Error: Process completed with exit code 1',
          },
        },
      ],
      // TODO: the deck links five demo recordings, which are not in the file.
      video: null,
    },
    // `glyph` names a mark from components/sections/decisionGlyphs.jsx. It is
    // a presentation hint, not a claim — omit it and the card shows the
    // neutral default rather than pretending to illustrate the decision.
    //
    // Two of these are not forks in the road. The Blue-Green card records
    // something designed and deliberately not shipped, and the `outputs.tf`
    // card records a way of working — both carry `over` where there was a real
    // alternative and leave the rest to the sentence.
    decisions: [
      {
        title: 'HTTP 401 over a silent redirect for failed logins',
        glyph: 'process',
        chose: 'A real **401** on login failure, read by both the Nginx log and the app’s own metrics',
        over: 'a **302** redirect the detection pipeline could not see',
        why:
          'Login failures were returning a 302, so no 401 ever reached the Nginx access log and the detection pipeline read **zero failed logins during a live brute-force run**. Switching the failure response to a real 401, and pointing both the log and the metrics at it, made the attempts visible to `fail2ban` and to the dashboard at the same moment.',
      },
      {
        title: 'Blackbox Exporter over container-status health checks',
        glyph: 'process',
        chose: '**Blackbox Exporter**, probing the path a real user takes through Nginx',
        over: 'a container-level health check, blind to the proxy in front of it',
        why:
          'After the Nginx reverse proxy went in, Prometheus could see that a container was running but not whether the app was reachable through it. Probing end to end defines a failure by **what a user experiences**, not by whether a process is alive.',
      },
      {
        title: 'Repo-isolated Docker credentials over the host’s global login',
        glyph: 'note',
        chose: '`DOCKER_CONFIG` pinned to a repo-local folder in the Makefile',
        over: 'the host’s global Docker login',
        why:
          'Docker Hub credentials collided with whatever was already logged in on the host, so a build that worked on one machine **failed silently on another**. Pinning the config to the repo, and parsing the login ID out of it, made the build reproducible on any machine.',
      },
      {
        title: 'Tailscale node-to-node L3 over a VXLAN overlay',
        glyph: 'channels',
        chose: 'A pure **Tailscale Layer-3** tunnel with `accept-routes=false`, brought up by originating traffic from inside the network',
        over: 'a **VXLAN** L2 overlay, and an inbound firewall rule to go with it',
        why:
          'Connecting the on-premise server to AWS needed a tunnel that would not fight the rest of our remote-access tooling: the L3 route avoided the routing conflicts that kept breaking **VS Code Remote-SSH**, at the cost of the flat L2 segment VXLAN would have given. Getting it up was its own problem — behind NAT the tunnel never initialised, and the login page rendered while logins hung. Pinging out from the replica host **created the state the firewall needed** to pass the return path, so the peers connected directly with nothing opened inbound.',
      },
      {
        title: 'ZAP as an observation stage, not a merge gate',
        glyph: 'note',
        chose: '**OWASP ZAP** scanning the live app after deployment and filing a GitHub issue with what it finds',
        over: 'blocking every deploy on any ZAP finding',
        why:
          'Bandit and Trivy both block the pipeline on Critical and High findings **before an image ships**. ZAP runs after deployment instead, closer to a standing report than a hard gate — promoting it to a blocking check is the next step, once it is reliable enough not to fail a demo app that is meant to look attackable.',
      },
      {
        title: 'A single `outputs.tf` as the interface between tracks',
        glyph: 'branch',
        chose: '`outputs.tf` as the **one contract** the other four tracks consumed',
        over: 'each track reading and editing the infrastructure code directly',
        why:
          'Five people working five tracks against one Terraform state is where a project usually starts breaking, because a small edit inside someone else’s module quietly moves the resource everyone depends on. Publishing IDs and endpoints through `outputs.tf` gave every other track a **stable name to build against** and left exactly one person answerable for what those names pointed at.',
      },
      {
        title: 'Recovery that checks its dependencies, not just its own container',
        glyph: 'process',
        chose: 'Verifying **Main and Replica DB connectivity and the network path** before declaring a recovery successful',
        over: 'restarting the app container and calling it done',
        why:
          'The first version of the controller restarted the failed container and stopped there, so the service came back **still broken** — the app was alive but its database dependencies were not. Adding connectivity checks, replica correction, and a closing health check turned “the container is running again” into “a user can log in again,” which are not the same claim.',
        },
    ],
    // EVERY NUMBER BELOW IS AN ESTIMATE, not billing data — same basis as
    // EchoChallengers. They model the decisions this project actually made (a
    // NAT instance instead of a managed gateway, PostgreSQL on EC2, the replica
    // and the whole observability stack on hardware the team already had)
    // against what the same architecture costs built the ordinary way in
    // ap-northeast-2.
    //
    // Rows are ordered by the size of the gap, largest first — except the last
    // two, which are the rows that do not close. A cost table where every line
    // saves money is a sales sheet.
    cost: {
      unit: 'USD / month',
      series: [
        { id: 'typical', label: 'Typical unoptimized build' },
        { id: 'actual', label: 'This project' },
      ],
      items: [
        {
          label: 'Database',
          note: 'PostgreSQL on EC2 + on-premise replica vs. managed RDS with a read replica',
          typical: 50.0,
          actual: 0.0,
        },
        {
          label: 'Monitoring & logging',
          note: '11 self-hosted containers vs. managed Prometheus, Grafana and log ingestion',
          typical: 45.0,
          actual: 0.0,
        },
        {
          label: 'Outbound routing',
          note: 'NAT instance vs. managed NAT Gateway',
          typical: 38.0,
          actual: 0.0,
        },
        {
          label: 'Compute — app tier',
          note: 'Auto Scaling Group, Bastion, NAT — free-tier instances vs. on-demand',
          typical: 34.0,
          actual: 0.0,
        },
        {
          label: 'Storage, state & alerting',
          note: 'S3 backups and logs, DynamoDB state lock, CloudWatch alarms, SNS, Lambda',
          typical: 12.0,
          actual: 2.5,
        },
        {
          label: 'Load balancer',
          note: 'ALB with ACM termination and two target groups — no cheaper equivalent',
          typical: 18.0,
          actual: 18.0,
        },
      ],
      total: { typical: 197.0, actual: 20.5 },
      notes: [
        'The two largest savings are the same decision made twice: **the replica database and the entire observability stack run on an on-premise machine the team already owned**, which removes two managed line items outright. That is a real trade and not a free one — no managed backups, no failover, patching becomes somebody’s job, and a **Tailscale tunnel becomes a thing that has to stay up** for either of them to be reachable.',
        'The **NAT instance** is the single clearest cloud saving. A managed NAT Gateway bills by the hour whether or not anything routes through it, and at this volume of outbound traffic a `t3.micro` doing the same job costs nothing inside the free tier — at the price of an instance the team patches and a single point of failure that **a second NAT instance is the stated fix for**.',
        'Compute reaches zero because the whole fleet fits inside the **750-hour free tier**. The honest number for anyone rebuilding this outside a free-tier account is roughly **$34 a month**, and that figure is what the comparison column prices.',
        'The **load balancer is the row that does not move**, and it is here for that reason. The ALB terminates HTTPS, health-checks two target groups, and is the entry point every demo scenario runs through; there is no cheaper equivalent that does those three things. A table where every line saved money would be less believable, not more.',
      ],
      caveat:
        'Estimated figures for `ap-northeast-2` over the four-week project period, on a free-tier account — not production billing data. The comparison column prices the same architecture built with managed equivalents at on-demand rates.',
    },
    links: {
      github: null, // placeholder
      notion: null, // placeholder
      terraform: null,
      presentation: null,
    },
    reflection: {
      learned:
        'Building LockBank moved security from something I added at the end to the **default from the first Terraform file** — public and private subnets split before a single EC2 instance exists, a security group scoped per tier before the app is written, a CI pipeline that scans before it builds. The four-layer lock was never really about Bandit, Trivy, ZAP, and `fail2ban` individually; it was about forcing a vulnerability past **four different kinds of scrutiny** before it could reach a real user. The most useful lesson came from a bug rather than a feature: our login-failure detection reported zero attacks during a live brute-force run because the app returned a redirect instead of a 401. Nothing in the dashboards was wrong — the pipeline was watching the wrong thing. I check for that pattern by default now: **"configured" and "actually working" are two different claims**, and the only way to close the gap is to attack your own system and read what the monitoring says back.',
      differently:
        'I would promote **OWASP ZAP** from an observation stage to a blocking gate once its findings are tuned against a demo app built to look attackable, and finish the **Blue-Green** stabilization testing that ran out of runway inside four weeks. Three more sit behind those: failure and recovery scenarios for the **database** rather than only the app tier, a **second NAT instance** so the cheap outbound path stops being the single point of failure I made it, and **L7/WAF filtering** in front of the rate limit. I would also start reading across the other tracks earlier. Holding final approval on every merge to `main` for a five-person, five-track project meant being the last check before anything shipped, which meant learning enough of **every track** to know what I was approving rather than only my own — a job I grew into partway through instead of starting there.',
    },
  },

  {
    slug: 'hailcast',
    group: 'team',
    title: 'hailcast',
    // The descriptive page heading. `title` above stays the short name the
    // sidebar shows and the eyebrow repeats. The name is a portmanteau the
    // team made themselves — *hail* a taxi, *fore-cast* the weather — which
    // Problem & Context says once so the lower-case `hailcast` everywhere
    // else reads as a product name rather than a typo.
    fullTitle:
      'AI Demand-Forecast Autoscaling and FinOps Cloud Infrastructure',
    accent: 'orange',
    // Two spans, not one. Build ran to the first presentation in early
    // August; the refinement stretch that follows ran in parallel with the
    // fourth project and ended at the re-presentation on August 27, which is
    // the date the final report deck is dated to.
    period: 'June 29 – August 27, 2026',
    // Six, and the split is the deck's own team slide read off its layout
    // rather than off its reading order — the bullet blocks sit in a
    // two-column grid, so the block beside a name is that person's, not the
    // next one in the list. `initials` is explicit for the same reason it is
    // on the other two team projects: Korean given names romanize as two
    // syllables and a naive initialiser takes three letters out of them.
    team: [
      { name: 'Junhan Shin', initials: 'JS', title: 'Team Lead · Operations & FinOps' },
      { name: 'Miseon Lee', initials: 'MS', title: 'Deputy Lead · Infrastructure' },
      { name: 'Changwon Lee', initials: 'CW', title: 'ML Model & Frontend' },
      { name: 'Jaehyuk Yang', initials: 'JH', title: 'Backend & CI' },
      { name: 'Jiyoon Lee', initials: 'JY', title: 'Autoscaling & Monitoring' },
      { name: 'Yongbin Cho', initials: 'YB', title: 'ArgoCD & Manifests' },
    ],
    // The three sentences a reader who never scrolls should still come away
    // with, drawn from the sections below rather than written separately. The
    // result sentence carries the honesty declaration inside it on purpose:
    // the number is the headline, and a headline number that quietly turns
    // out to be a simulation two screens later is the thing this project
    // spent a whole slide refusing to do.
    glance: {
      why: 'A taxi platform sized for its own peak pays for that peak around the clock — the service never falls over, and the bill never falls either. Reactive autoscaling only narrows the gap, because capacity still arrives after the traffic that called for it.',
      how: 'A LightGBM model trained on New York taxi calls and Open-Meteo weather forecasts the next four hours of demand; the predict pod turns that into a floor and patches it onto a KEDA `ScaledObject` every 60 seconds, so pods exist before the load does and Karpenter supplies Spot nodes underneath them. When the forecast is wrong, KEDA’s own queue-length trigger catches it.',
      result: 'A **26.5% reduction in worker pod-hours** against a peak-sized fixed fleet — **216 pod-hours a day down to 158.8** — across **4 repositories**, **16 ArgoCD applications** and **10 IRSA roles**. Simulated from eight days of recorded scaling decisions, not read off an AWS bill.',
    },
    // My Role as a bento of duties sized by how much of the project each one
    // was. Eight tiles rather than the six the other two projects use: one
    // lead (3x2), four medium (3x1) and three small (2x1) tile the six-column
    // grid exactly over four rows.
    //
    // `label` is the tile's key and is deliberately not rendered; the emphasis
    // lives inside the sentence instead.
    //
    // Scoped to what the deck's team slide puts against this name and what the
    // ops repo's own README documents — the lead role, the four-repo console,
    // the account guard, and teardown. The Terraform, the IRSA design, the
    // naming convention and the verifier's internals belong to the deputy lead
    // and are credited to her in Problem & Context rather than absorbed here.
    role: {
      title: 'Team Lead and Operations Track Owner',
      tiles: [
        {
          size: 'lead',
          label: 'Team Lead',
          stat: { value: '4', unit: 'repos, one console' },
          text: 'Led **six people across four repositories** that deploy four different ways — `terraform apply`, `docker build`, an ArgoCD pull, and local `make`. The fourth repo is mine: an operations layer that gives the other three **one command surface** and the guardrails that surface is worth having.',
        },
        {
          size: 'medium',
          label: 'Account Guard',
          text: 'Every credentialed command compares `sts get-caller-identity` against `PROJECT_ACCOUNT_ID` and **stops dead on a mismatch**. The earlier script printed the account and compared nothing, so a session sitting in the wrong account went **green on every check** — we finished with zero wrong-account incidents.',
        },
        {
          size: 'medium',
          label: 'Teardown Orchestration',
          text: 'Ordered destruction **manifests → infra → app**, because a live ALB or a leftover ENI blocks a VPC from being destroyed for hours. The measured run cleared **140 resources in 21 minutes 40 seconds with zero errors**, and stops between stages rather than carrying a failure forward.',
        },
        {
          size: 'small',
          label: 'Command Delegation',
          text: 'One `Makefile` that delegates outward to each sibling repository, so `clone-all`, `setup`, `check`, plan, apply and deploy all start **in the same place**.',
        },
        {
          size: 'small',
          label: 'Contract Checking',
          text: 'Hosted the naming-contract verifier as `make check-contract`, run **daily rather than the night before a demo** — static against the Terraform source, runtime against `aws describe`.',
        },
        {
          size: 'small',
          label: 'Credential Isolation',
          text: 'A `cd` hook swaps `DOCKER_CONFIG` to a repo-local store inside the ops folder, so logging into the team registry **does not overwrite anyone’s personal login**.',
        },
        {
          size: 'medium',
          label: 'Runbooks as Deliverables',
          text: 'Wrote and revised the **teardown and rebuild checklists seven times**, folding measured numbers back in each pass — CloudFront’s teardown was estimated at "over ten minutes" and measured at **3 minutes 14 seconds**, and an estimate left standing next to a measurement is the thing a runbook exists to prevent.',
        },
        {
          size: 'medium',
          label: 'Blast-Radius Discipline',
          text: '`CONFIRM=yes` is injected by the orchestrator so a real destroy is deliberate; `FORCE=yes` is **never injected** and has to be typed by a person. Review is gated by `CODEOWNERS` on the teardown files alone — the whole repo behind approval would have cost more speed than it bought safety.',
        },
      ],
    },
    // An idea board rather than a paragraph. Ten notes over three rows of the
    // four-column grid: two leads spanning two columns each and eight
    // supports. Every note is a complete sentence that stands on its own —
    // the format invites fragments, and a fragment only works for someone who
    // already knows the project.
    context: {
      notes: [
        {
          size: 'lead',
          label: 'The Bill Nobody Notices',
          text: 'A taxi app almost never falls over, and that is precisely the problem: the infrastructure behind it is **sized for its busiest hour and runs at that size all twenty-four**, so at four in the morning the platform is paying peak prices to serve almost nobody. Nothing shows up as an incident, and nothing shows up in a dashboard — it shows up as a bill that is quietly larger than the service it bought.',
        },
        {
          size: 'support',
          label: 'The Problem, Redefined',
          text: 'Our first framing was **"stop the service slowing down under a traffic surge,"** and looking at how taxi hailing actually works killed it: the bottleneck is the number of drivers, not the number of servers. So we redefined the problem as **the cost of idle peak-sized capacity**, which is the one the infrastructure could genuinely answer.',
        },
        {
          size: 'support',
          label: 'Where the Name Comes From',
          text: 'The team named it **hailcast** — “hail,” as in hailing a taxi, joined to the “cast” of “forecast” — because the whole system is one sentence: **use the weather forecast to decide how many taxi calls are coming**, and have the capacity waiting when they arrive.',
        },
        {
          size: 'support',
          label: 'Prediction Sets the Floor',
          text: 'A LightGBM model trained on New York taxi trips and Open-Meteo weather learns patterns like “a rainy Friday evening spikes,” and every four hours it writes a demand figure for the next four hours; a scheduler turns that into a pod count — **demand ÷ 500, plus one for headroom** — and patches it onto KEDA as a minimum.',
        },
        {
          size: 'support',
          label: 'The Queue Is the Safety Net',
          text: 'Prediction alone is a single point of failure, so **KEDA also reads the SQS call queue directly**: if the forecast is wrong and the queue passes 500 messages, reactive scaling catches the overflow, and Karpenter supplies Spot nodes underneath whatever the two layers between them ask for.',
        },
        {
          size: 'lead',
          label: 'Four Repos, One Contract',
          text: 'Six people split across **four repositories that deploy four different ways**, and the seams between them are all strings: a role name, a ServiceAccount name, a metric key, an image tag. One character out of place in any of them fails **silently** — no error, just "permission denied" against a policy that is perfectly correct — so a single naming document became the source of truth, revised **before** the code rather than after it, with a verifier checking the code against it daily.',
        },
        {
          size: 'support',
          label: 'Honesty Declaration',
          text: 'The deck opens on a slide the team wrote before any of the numbers existed: **this is not a live service, and every figure here is a simulated expected effect rather than measured billing**. Keeping that line at the front is what let us report a 26.5% figure without it becoming a claim the project cannot back.',
        },
        {
          size: 'support',
          label: 'Cost as a Design Constraint',
          text: 'FinOps was a build rule rather than a review step: **unnecessary resources were not created at all**, S3 and DynamoDB traffic skips the NAT through a free gateway endpoint, and an EventBridge schedule takes the whole dev cluster down between 02:00 and 10:00 KST so a learning budget is not spent on an empty night.',
        },
        {
          size: 'support',
          label: 'The Expensive Failure Is the Silent One',
          text: 'Every incident worth remembering left **no error at all**: a missing security-group tag meant nodes booted, accepted SSM sessions, and never joined the cluster; a doubled `/api` prefix made the demo stop scaling with the app still perfectly healthy; a probe using `pgrep` on an image without `procps` would have restarted every pod forever.',
        },
        {
          size: 'support',
          label: 'Whose Idea It Was',
          text: 'The topic was **Miseon Lee’s**, and the team chose it over the alternatives on the strength of the pitch; she went on to build the entire Terraform estate, the ten IRSA roles, the naming convention, and the verifier that enforces it — the foundation the rest of this page is standing on.',
        },
      ],
    },
    // `size` drives the bento layout. On the 5-column grid these nine tile it
    // exactly over three rows: the big tile (2x2) plus three squares fills the
    // first, the big tile's second row plus a wide (2) and a square fills the
    // second, and two wides with a square between them fills the third.
    //
    // The big tile is the pod-hour saving because it is the number the whole
    // project was built to produce. It is labelled as a simulation in its own
    // detail line rather than only in the cost caveat further down — a
    // headline figure has to carry its own qualification, because it is the
    // one thing a reader takes away without scrolling.
    metrics: [
      {
        size: 'big',
        value: '26.5%',
        label: 'Worker Pod-Hours Saved',
        detail: '216 pod-hours a day down to 158.8, against a fleet held at peak size — simulated from eight days of recorded scaling decisions, not measured billing',
      },
      {
        size: 'square',
        value: '10',
        label: 'IRSA Roles',
        hint: 'One per ServiceAccount, mapped 1:1 — with S3 permissions split by prefix so the model path is read-only',
      },
      {
        size: 'square',
        value: '16',
        label: 'ArgoCD Applications',
        hint: 'app-of-apps: every application and add-on declared in Git, with selfHeal reverting anything changed by hand in the cluster',
      },
      {
        size: 'square',
        value: '6',
        label: 'Always-On Pods',
        hint: 'call-api, worker, predict, weather-cron, simulator, frontend — worker is the only one KEDA scales',
      },
      {
        size: 'wide',
        value: '4',
        label: 'Repos, One Console',
        detail: 'infra, app, manifests and ops — four deployment methods reached through a single delegating Makefile',
      },
      {
        size: 'square',
        value: '0',
        label: 'Wrong-Account Runs',
        hint: 'Every credentialed command checks the caller identity against the project account before it starts; nothing ever ran against the wrong one',
      },
      {
        size: 'wide',
        value: '140',
        label: 'Resources Torn Down',
        detail: '21 minutes 40 seconds, zero errors and zero warnings — the measured run the teardown runbook was rewritten around',
      },
      {
        size: 'square',
        value: '4',
        label: 'Schedulers',
        hint: 'Forecast every 4h, scaling every 60s, traffic every 2s, backup hourly — all four inside the predict pod',
      },
      {
        size: 'wide',
        value: '1',
        label: 'NAT Gateway, Not Two',
        detail: 'One in 2a rather than one per AZ: roughly $43 a month against $86 at Seoul list price, traded against 2a becoming a single point of failure',
      },
    ],
    // Grouped by what each tool is for, with no `tint` overrides — the
    // tech-stack row is accent-free (DESIGN.md). Labels are the vendors' own
    // names; a label with no SVG under src/assets/icons/ renders a monogram
    // tile rather than a gap, so the missing logos are a drop-in later and
    // never a reason to rename a tool.
    stack: [
      // AWS is split in two rather than left as one thirteen-item category.
      // The wheel sizes each wedge by how many items are in it, and a single
      // AWS group took two-fifths of the pie and stacked its labels on top of
      // one another. The split is not cosmetic either: the first group is what
      // the application runs on and stores state in, the second is what sits
      // in front of it and what operates it.
      { category: 'AWS — Platform & Data', items: ['EKS', 'EC2', 'VPC', 'RDS', 'S3', 'DynamoDB', 'SQS', 'ECR'] },
      {
        category: 'AWS — Edge & Operations',
        items: ['CloudFront', 'Route 53', 'CloudWatch', 'EventBridge', 'Secrets Manager'],
      },
      { category: 'IaC & GitOps', items: ['Terraform', 'ArgoCD', 'Helm', 'GitHub Actions', 'Docker', 'Git'] },
      { category: 'Kubernetes & Autoscaling', items: ['Kubernetes', 'KEDA', 'Karpenter'] },
      { category: 'Observability & FinOps', items: ['Prometheus', 'Grafana', 'OpenCost', 'Telegram'] },
      { category: 'Application & ML', items: ['Python', 'FastAPI', 'LightGBM', 'React', 'PostgreSQL', 'k6'] },
    ],
    // Why the load-bearing tools, at the level of the tool rather than the
    // line of code — the same scope the other two team projects use, and
    // deliberately different from `decisions` below: this answers "why KEDA at
    // all", that one answers "why one NAT gateway instead of two". Five, not
    // twenty: the wheel already lists every tool and a note against each would
    // be a second inventory rather than an argument.
    stackNotes: [
      {
        tool: 'Why KEDA and Karpenter, both?',
        icon: 'KEDA',
        text: 'They scale different things and neither substitutes for the other. **KEDA decides how many pods** — taking a predicted floor from the predict pod and a reactive ceiling from the SQS queue depth — and **Karpenter decides whether there is anywhere to put them**, supplying Spot nodes for pods that would otherwise sit `Pending` and reclaiming them when they do not.',
      },
      {
        tool: 'Why LightGBM?',
        icon: 'Python',
        text: 'The features are **hour, weekday, weekend flag, humidity, temperature and rainfall** — small, tabular, and exactly what gradient boosting is best at. A model that trains in seconds and loads out of an S3 pickle inside a pod was worth more here than accuracy we could not have used: the output is a pod count, and a pod count is an integer.',
      },
      {
        tool: 'Why ArgoCD over Terraform?',
        icon: 'ArgoCD',
        text: 'Installing KEDA, Karpenter or the ALB controller with `helm_release` inside the infrastructure Terraform would have given **two owners to one object**, and two owners means drift that neither one reports. The boundary is ownership, not convenience: Terraform builds AWS, ArgoCD builds what runs inside the cluster, and `selfHeal` makes Git the answer to what the cluster should look like.',
      },
      {
        tool: 'Why OpenCost?',
        icon: 'Prometheus',
        text: 'AWS bills by resource and Kubernetes spends by workload, and neither view answers **"what did the worker deployment cost?"** on its own. OpenCost reads node pricing through Prometheus and splits it by namespace and pod — which is what makes worker-only cost separable from cluster cost, and is also where the honest limit sits: it prices from the **list price**, because the CUR integration never got wired up.',
      },
      {
        tool: 'Why Telegram?',
        icon: 'Telegram',
        text: 'Eight alert rules had to reach a phone without standing up an on-call platform for a summer project. The thresholds are deliberately offset from the scaling ones — **a queue alert at 1,000 is twice the KEDA trigger at 500**, so the page fires when scaling has failed to absorb the load, not every time it starts working.',
      },
    ],
    // Eight views of the same system, a tab each: the whole AWS layout, then
    // the four runtime flows, the GitOps path, the cluster, and the pods.
    //
    // Drawn from these descriptions rather than pasted in as exports — see
    // components/sections/ArchDiagram.jsx. Each one has been checked against
    // the original draw.io export, which now sits beside it as its own tab.
    //
    // Where the two differ, the export won: the single 2a NAT gateway, the VPC
    // gateway endpoint that bypasses it, the HPA that KEDA creates as a
    // reactive safety net, the ClusterIP service layer in front of every pod,
    // and the approval gates in the GitOps path were all missing here.
    //
    // Where the two differ in *density*, the drawn version wins on purpose.
    // The overall export names some forty boxes and needs 1802px to do it; a
    // drawing that fits the page column cannot, and should not, repeat that.
    // Detail that belongs to one view is left to that view — the pods are the
    // Pod architecture tab's job, not the overall diagram's.
    architecture: [
      {
        tab: 'Overall architecture',
        caption: 'Overall architecture — VPC, EKS, and the managed services around them',
        alt: 'Full AWS layout in ap-northeast-2: a passenger app and the external Open-Meteo API reaching a 10.0.0.0/16 VPC through Route 53, CloudFront and an internet gateway; an EKS cluster spanning availability zones 2a and 2c behind an ALB ingress, with a fixed system node group and Karpenter nodes that scale from zero; a single NAT gateway in 2a and a VPC gateway endpoint that carries S3 and DynamoDB traffic past it; and RDS, SQS, S3, DynamoDB and the management services alongside',
        // The draw.io export of this same view, shown by the panel's
        // Clean / Detailed toggle. Only the chosen one is rendered.
        detailed: {
          src: '/projects/hailcast/architecture-01-overall.svg',
          caption: 'Overall architecture, original export \u2014 every managed service, add-on and pod named',
          alt: 'Original draw.io export of the full hailcast layout in the Seoul region: a passenger app and the external Open-Meteo API outside AWS; a 10.0.0.0/16 VPC with public and private subnets in availability zones 2a and 2c, a single NAT gateway in 2a, and a VPC gateway endpoint that bypasses it for S3 and DynamoDB; an EKS cluster running the call-api, worker, predict, weather-cron, simulator and frontend pods on Karpenter-provisioned nodes beside a fixed system node group; RDS single-AZ, SQS, S3, ECR, CloudWatch, Secrets Manager and SSM Session Manager alongside; and the GitHub infra, app and manifest repositories feeding GitHub Actions and a Terraform S3 backend',
        },
        diagram: {
          width: 1000,
          height: 620,
          zones: [
            { id: 'aws', label: 'AWS · ap-northeast-2', x: 150, y: 20, w: 836, h: 512, tone: 'cloud' },
            { id: 'vpc', label: 'VPC', note: '10.0.0.0/16', x: 176, y: 118, w: 560, h: 392, tone: 'region' },
            { id: 'eks', label: 'EKS cluster', x: 198, y: 250, w: 516, h: 152, tone: 'focus' },
          ],
          nodes: [
            { id: 'rider', label: 'Passenger app', glyph: 'user', x: 72, y: 176, w: 128, h: 52 },
            { id: 'meteo', label: 'Open-Meteo API', sub: 'external', glyph: 'cloud', x: 72, y: 330, w: 128, h: 52 },
            { id: 'dns', label: 'Route 53', glyph: 'dns', x: 300, y: 68, w: 160, h: 44 },
            { id: 'cdn', label: 'CloudFront', glyph: 'cdn', x: 500, y: 68, w: 160, h: 44 },
            { id: 'igw', label: 'Internet gateway', glyph: 'cloud', x: 456, y: 118, w: 190, h: 44 },
            { id: 'alb', label: 'ALB ingress', glyph: 'balancer', x: 300, y: 190, w: 170, h: 50 },
            // The single NAT is the project's own FinOps call, and the gateway
            // endpoint is what keeps S3 and DynamoDB traffic off it.
            { id: 'nat', label: 'NAT gateway', sub: 'single · AZ 2a only', glyph: 'cloud', x: 552, y: 190, w: 190, h: 52 },
            { id: 'sysnodes', label: 'System node group', sub: 'managed · fixed', glyph: 'server', x: 300, y: 300, w: 190, h: 54 },
            { id: 'karpnodes', label: 'Karpenter nodes', sub: 'dynamic · from zero', glyph: 'cluster', x: 570, y: 300, w: 190, h: 54 },
            { id: 'gwep', label: 'VPC gateway endpoint', sub: 'S3 · DynamoDB', glyph: 'service', x: 500, y: 452, w: 200, h: 54 },
            { id: 'rds', label: 'RDS PostgreSQL', sub: 'single-AZ · 2a', glyph: 'database', x: 290, y: 452, w: 170, h: 54 },
            { id: 'sqs', label: 'SQS', sub: 'call queue', glyph: 'queue', x: 870, y: 190, w: 180, h: 52 },
            { id: 's3', label: 'S3', sub: 'model · weather · traffic', glyph: 'bucket', x: 870, y: 274, w: 180, h: 54 },
            { id: 'ddb', label: 'DynamoDB', sub: 'prediction miss log', glyph: 'database', x: 870, y: 358, w: 180, h: 54 },
            { id: 'mgmt', label: 'ECR · Secrets Manager · CloudWatch · SSM', x: 870, y: 452, w: 180, h: 66 },
          ],
          edges: [
            { from: 'rider', to: 'dns', via: [[72, 68]] },
            { from: 'dns', to: 'cdn' },
            { from: 'cdn', to: 'igw' },
            { from: 'igw', to: 'alb' },
            { from: 'alb', to: 'sysnodes' },
            { from: 'alb', to: 'karpnodes', via: [[300, 262], [570, 262]] },
            { from: 'karpnodes', to: 'sqs', label: 'enqueue', labelAt: [750, 262], labelAnchor: 'end', via: [[758, 300], [758, 190]] },
            { from: 'sysnodes', to: 'rds' },
            // Out through the one NAT, and past it for the two services the
            // gateway endpoint covers.
            { from: 'karpnodes', to: 'nat', label: 'egress', dash: true },
            // Down the lane between the two node groups, not through the
            // Karpenter box: dropping from the NAT's own x buried the line —
            // and its label's worth of dashes — under the node group it
            // crossed on the way past.
            {
              from: 'nat',
              to: 'meteo',
              label: 'weather fetch',
              labelAt: [270, 412],
              dash: true,
              via: [[440, 190], [440, 418], [72, 418]],
            },
            { from: 'karpnodes', to: 'gwep', dash: true, bend: 'v' },
            // One edge for both: the endpoint's own sub-line names the two
            // services it covers, and the managed column has no second lane
            // that clears the boxes already stacked in it.
            { from: 'gwep', to: 's3', label: 'bypasses the NAT', labelAt: [712, 446], dash: true, via: [[600, 452], [724, 452], [724, 274]] },
          ],
          captions: [
            {
              x: 150,
              y: 566,
              tone: 'accent',
              text: 'AZ placement here is logical: the scheduler decides where pods actually land, and Karpenter provisions the nodes they land on.',
            },
            {
              x: 150,
              y: 590,
              text: 'Only the call API is spread across both zones. RDS and the NAT gateway are fixed to 2a — a cost choice, not a resilience one.',
            },
          ],
        },
      },
      {
        tab: 'Request flow',
        caption: 'Flow 1 — a ride request, from the app to the queue',
        alt: 'A ride request travelling from the passenger app through Route 53, CloudFront and the load balancer to the call API pod, which queues the job on SQS and answers the passenger immediately; below the line, a worker pod consumes the job from the queue and records the call to RDS while the passenger waits for none of it',
        // The draw.io export of this same view, shown by the panel's
        // Clean / Detailed toggle. Only the chosen one is rendered.
        detailed: {
          src: '/projects/hailcast/architecture-02-request-flow.svg',
          caption: 'Flow 1, original export \u2014 the synchronous half above the divider, the asynchronous half below',
          alt: 'Original draw.io export of flow 1, a taxi call: the passenger enters origin and destination, Route 53 resolves the domain, CloudFront accelerates the HTTPS transfer, and the ALB distributes to healthy pods, where the call-processing API pod accepts the call, enqueues it to SQS and immediately answers "received"; below a divider marking the boundary, the worker pod consumes the call from SQS and records it to RDS asynchronously, with the passenger waiting for none of it',
        },
        diagram: {
          width: 1000,
          height: 400,
          nodes: [
            { id: 'app', label: 'Passenger app', glyph: 'user', x: 110, y: 70, w: 150 },
            { id: 'dns', label: 'Route 53', glyph: 'dns', x: 330, y: 70 },
            { id: 'cdn', label: 'CloudFront', glyph: 'cdn', x: 550, y: 70 },
            { id: 'alb', label: 'ALB', glyph: 'balancer', x: 770, y: 70 },
            { id: 'api', label: 'call-api pod', sub: 'accepts the call', glyph: 'container', x: 770, y: 200, w: 180 },
            { id: 'sqs', label: 'SQS', sub: 'call queue', glyph: 'queue', x: 500, y: 200, w: 170 },
            { id: 'worker', label: 'worker pod', glyph: 'container', x: 230, y: 200, w: 170 },
            { id: 'rds', label: 'RDS', sub: 'call recorded', glyph: 'database', x: 230, y: 330, w: 170 },
          ],
          edges: [
            { from: 'app', to: 'dns' },
            { from: 'dns', to: 'cdn' },
            { from: 'cdn', to: 'alb' },
            { from: 'alb', to: 'api' },
            { from: 'api', to: 'sqs', label: 'enqueue' },
            { from: 'sqs', to: 'worker', label: 'consume' },
            { from: 'worker', to: 'rds', label: 'record' },
            {
              from: 'api',
              to: 'app',
              label: '202 accepted — returned immediately',
              labelAt: [440, 268],
              dash: true,
              via: [[770, 274], [110, 274]],
            },
          ],
          captions: [
            {
              x: 500,
              y: 146,
              anchor: 'middle',
              tone: 'accent',
              text: 'Everything below this line happens after the passenger has already been answered.',
            },
          ],
        },
      },
      {
        tab: 'Weather ingest',
        caption: 'Flow 2 — scheduled weather collection into S3',
        alt: 'The weather-cron CronJob calling the Open-Meteo forecast API for New York out through the NAT gateway, checking the response is valid, logging the error and waiting for the next cycle if it is not, and otherwise overwriting the forecast CSV in S3 for the prediction pods to read',
        // The draw.io export of this same view, shown by the panel's
        // Clean / Detailed toggle. Only the chosen one is rendered.
        detailed: {
          src: '/projects/hailcast/architecture-04-weather-ingest.svg',
          caption: 'Flow 2, original export \u2014 the collection job and its failure branch',
          alt: 'Original draw.io export of flow 2, weather collection: at the scheduled time the weather CronJob starts and calls Open-Meteo through the NAT gateway for the New York forecast, then branches on the response \u2014 logging the error and waiting for the next cycle if it failed, or overwriting weather/nyc-forecast.csv in S3 if it succeeded, ready for the prediction pod to read',
        },
        diagram: {
          width: 1000,
          height: 340,
          nodes: [
            { id: 'job', label: 'weather-cron', sub: 'CronJob · scheduled', glyph: 'pipeline', x: 120, y: 85, w: 190 },
            { id: 'nat', label: 'NAT gateway', glyph: 'cloud', x: 350, y: 85 },
            { id: 'api', label: 'Open-Meteo API', sub: 'New York forecast', glyph: 'cloud', x: 580, y: 85, w: 190 },
            { id: 'check', label: 'Response valid?', glyph: 'scan', x: 810, y: 85, w: 170 },
            { id: 's3', label: 'S3', sub: 'weather/nyc-forecast.csv', glyph: 'bucket', x: 810, y: 220, w: 220 },
            { id: 'retry', label: 'Log it, wait for the next run', glyph: 'pipeline', x: 350, y: 220, w: 220 },
          ],
          edges: [
            { from: 'job', to: 'nat' },
            { from: 'nat', to: 'api', label: 'egress' },
            { from: 'api', to: 'check' },
            { from: 'check', to: 's3', label: 'yes — overwrite' },
            {
              from: 'check',
              to: 'retry',
              label: 'no',
              labelAt: [600, 286],
              dash: true,
              via: [[935, 85], [935, 292], [350, 292]],
            },
            { from: 'retry', to: 'job', dash: true, via: [[120, 220]] },
          ],
        },
      },
      {
        tab: 'Prediction pipeline',
        caption: 'Flow 3 — the collection loop that feeds the four-hourly forecast',
        alt: 'Two phases side by side: the continuous collection loop, where the simulator generates calls that the call API enqueues to SQS and a worker records to RDS, and the four-hourly prediction phase, where the forecast scheduler in the predict pod loads its model from S3, reads the stored weather and traffic data, computes demand with LightGBM and writes the result to the prediction table',
        // The draw.io export of this same view, shown by the panel's
        // Clean / Detailed toggle. Only the chosen one is rendered.
        detailed: {
          src: '/projects/hailcast/architecture-03-prediction-pipeline.svg',
          caption: 'Flow 3, original export \u2014 the call-collection loop and the four-hourly prediction phase side by side',
          alt: 'Original draw.io export of flow 3, call collection and prediction: the simulator generates virtual taxi calls that the API pod enqueues to SQS and a worker pod records to RDS, while every four hours the predict pod ForecastScheduler loads its model from S3 over the gateway endpoint, prepares the latest weather CSV and the summed traffic shards, computes demand with LightGBM, and writes to the RDS prediction table, which the sixty-second ScalingScheduler then reads to patch the KEDA scaled object',
        },
        diagram: {
          width: 1000,
          height: 440,
          zones: [
            { id: 'forecast', label: 'Prediction · every four hours', x: 60, y: 30, w: 880, h: 186, tone: 'focus' },
            { id: 'collect', label: 'Call collection · continuous', x: 60, y: 244, w: 880, h: 150, tone: 'region' },
          ],
          nodes: [
            { id: 'sched', label: 'ForecastScheduler', sub: 'in the predict pod', glyph: 'pipeline', x: 170, y: 112, w: 200, h: 58 },
            { id: 'predict', label: 'LightGBM inference', glyph: 'forecast', x: 470, y: 112, w: 200, h: 58 },
            { id: 'out', label: 'RDS', sub: 'prediction table', glyph: 'database', x: 790, y: 112, w: 200, h: 58 },
            { id: 's3in', label: 'S3', sub: 'model · weather CSV · traffic shards', glyph: 'bucket', x: 470, y: 186, w: 330, h: 48 },
            { id: 'sim', label: 'simulator pod', glyph: 'container', x: 140, y: 330, w: 140, h: 52 },
            { id: 'callapi', label: 'call-api pod', glyph: 'container', x: 410, y: 330, w: 170, h: 52 },
            { id: 'sqs', label: 'SQS', glyph: 'queue', x: 640, y: 330, w: 140, h: 52 },
            { id: 'worker', label: 'worker pod', glyph: 'container', x: 855, y: 330, w: 160, h: 52 },
          ],
          edges: [
            { from: 'sched', to: 'predict', label: 'runs' },
            { from: 'predict', to: 'out', label: 'writes the forecast' },
            { from: 's3in', to: 'predict', label: 'load' },
            { from: 'sim', to: 'callapi', label: 'generates calls' },
            { from: 'callapi', to: 'sqs', label: 'enqueue' },
            { from: 'sqs', to: 'worker', label: 'consume' },
            // Up out of the collection band into the prediction table: the two
            // phases share one database, which is the whole point of the loop.
            { from: 'worker', to: 'out', label: 'records the call', labelAt: [824, 226], labelAnchor: 'end', via: [[855, 230], [790, 230]] },
          ],
          captions: [
            {
              x: 60,
              y: 424,
              tone: 'accent',
              text: 'A separate sixty-second scheduler reads the prediction table and patches KEDA — see the Predictive scaling tab.',
            },
          ],
        },
      },
      {
        tab: 'Predictive scaling',
        caption: 'Flow 4 — the forecast ahead of the traffic, and the safety net behind it',
        alt: 'Predicted demand becoming capacity: the forecast scheduler writing to the prediction table every four hours, a scaling scheduler patching the KEDA scaled object minimum replica count every sixty seconds, KEDA also reacting to SQS queue length, Karpenter provisioning a node when the existing ones have no room, and the HPA that KEDA creates catching whatever the forecast missed',
        // The draw.io export of this same view, shown by the panel's
        // Clean / Detailed toggle. Only the chosen one is rendered.
        detailed: {
          src: '/projects/hailcast/architecture-05-predictive-scaling.svg',
          caption: 'Flow 4, original export \u2014 the proactive path and the reactive safety net',
          alt: 'Original draw.io export of flow 4, prediction-based proactive scaling: the ForecastScheduler writes predictions to RDS every four hours and the ScalingScheduler patches the KEDA scaled object minimum replica count every sixty seconds; where predicted demand clears the threshold KEDA scales pods up ahead of the traffic and Karpenter creates an EC2 node when no existing one has room, and where the prediction missed, the HPA that KEDA created as a safety net catches the SQS queue spike and scales reactively before KEDA scales back down once things settle',
        },
        diagram: {
          width: 1000,
          height: 420,
          nodes: [
            { id: 'forecast', label: 'ForecastScheduler', sub: 'every four hours', glyph: 'pipeline', x: 130, y: 80, w: 210, h: 56 },
            { id: 'pred', label: 'RDS', sub: 'prediction table', glyph: 'database', x: 390, y: 80, w: 170, h: 56 },
            { id: 'patch', label: 'ScalingScheduler', sub: 'every sixty seconds', glyph: 'wrench', x: 690, y: 80, w: 200, h: 56 },
            { id: 'sqs', label: 'SQS queue depth', glyph: 'queue', x: 390, y: 210, w: 170, h: 52 },
            { id: 'keda', label: 'KEDA ScaledObject', sub: 'minReplicaCount', glyph: 'forecast', x: 690, y: 210, w: 200, h: 56 },
            // The reactive half. KEDA creates the HPA itself; it is not a
            // second, competing autoscaler someone configured by hand.
            { id: 'hpa', label: 'HPA', sub: 'created by KEDA', glyph: 'service', x: 900, y: 330, w: 160, h: 56 },
            { id: 'pods', label: 'Worker pods', glyph: 'container', x: 650, y: 330, w: 180, h: 52 },
            { id: 'karpenter', label: 'Karpenter', sub: 'a new node when none has room', glyph: 'cluster', x: 350, y: 330, w: 250, h: 56 },
          ],
          edges: [
            { from: 'forecast', to: 'pred', label: 'writes' },
            { from: 'pred', to: 'patch', label: 'read every 60s' },
            { from: 'patch', to: 'keda', label: 'sets minReplicas' },
            { from: 'sqs', to: 'keda', label: 'reactive trigger' },
            { from: 'keda', to: 'pods', label: 'scale ahead of the traffic' },
            { from: 'keda', to: 'hpa', label: 'creates', dash: true, via: [[790, 210], [900, 210]] },
            { from: 'hpa', to: 'pods', label: 'queue spike', dash: true },
            { from: 'pods', to: 'karpenter', label: 'pending pod ↔ new node', labelAt: [512, 288], dir: 'both' },
          ],
          captions: [
            {
              x: 60,
              y: 404,
              tone: 'accent',
              text: 'The forecast buys the head start; the HPA catches what the forecast got wrong.',
            },
          ],
        },
      },
      {
        tab: 'GitOps flow',
        caption: 'GitOps — three repositories, from pull request to cluster sync',
        alt: 'The three-repository GitOps path: a feature branch reaching dev through a pull request approved by one peer, then splitting to the infra repo, which plans on every pull request and applies only after the infra-apply environment is approved, the app repo, which builds an image tagged with the commit SHA and writes that tag into the manifests repo, and ArgoCD, which watches the manifests repo, syncs to the cluster and reverts any drift back to Git',
        // The draw.io export of this same view, shown by the panel's
        // Clean / Detailed toggle. Only the chosen one is rendered.
        detailed: {
          src: '/projects/hailcast/architecture-06-gitops-flow.svg',
          caption: 'GitOps, original export \u2014 the approval gates and the drift check in full',
          alt: 'Original draw.io export of the three-repository GitOps flow: a feature branch becomes a pull request approved by one peer and merges to dev, then branches by repository \u2014 the infra repo plans on every pull request and applies only after an infra-apply environment approval, creating the EKS, RDS, S3, ECR and SQS infrastructure; the app repo builds a Docker image, pushes it to ECR tagged with the commit SHA, and updates that tag in the manifests repo; and ArgoCD watches the manifests repo, syncs to EKS, and self-heals any cluster that has drifted from Git',
        },
        diagram: {
          width: 1000,
          height: 420,
          nodes: [
            { id: 'feature', label: 'feature/*', glyph: 'git', x: 110, y: 70 },
            { id: 'pr', label: 'Pull request', sub: 'one peer approval', glyph: 'git', x: 330, y: 70, w: 180, h: 58 },
            { id: 'dev', label: 'dev branch', glyph: 'git', x: 560, y: 70 },
            { id: 'infra', label: 'Infra repo', sub: 'plan on PR · apply on approval', glyph: 'wrench', x: 200, y: 210, w: 200, h: 58 },
            { id: 'appRepo', label: 'App repo', sub: 'image tagged commit SHA', glyph: 'container', x: 480, y: 210, w: 190, h: 58 },
            { id: 'manifests', label: 'Manifests repo', sub: 'apps · addons · argocd', glyph: 'git', x: 770, y: 210, w: 190, h: 58 },
            { id: 'cluster', label: 'EKS cluster', glyph: 'cluster', x: 450, y: 340, w: 180, h: 52 },
            { id: 'argocd', label: 'ArgoCD', sub: 'watch · sync · self-heal', glyph: 'pipeline', x: 790, y: 340, w: 190, h: 58 },
          ],
          edges: [
            { from: 'feature', to: 'pr' },
            { from: 'pr', to: 'dev', label: 'merge' },
            { from: 'dev', to: 'infra', via: [[560, 145], [200, 145]] },
            { from: 'dev', to: 'appRepo', via: [[560, 145], [480, 145]] },
            { from: 'dev', to: 'manifests', via: [[560, 145], [770, 145]] },
            { from: 'appRepo', to: 'manifests', label: 'image tag' },
            { from: 'manifests', to: 'argocd', label: 'watched' },
            // One edge, both directions: ArgoCD syncs Git to the cluster and
            // pulls the cluster back when it has drifted from Git.
            { from: 'argocd', to: 'cluster', label: 'sync · reverts drift', dir: 'both' },
            { from: 'infra', to: 'cluster', label: 'provisions', labelAt: [325, 300], via: [[200, 306], [450, 306]] },
          ],
          captions: [
            {
              x: 60,
              y: 404,
              tone: 'accent',
              text: 'Terraform applies only once the infra-apply environment has been approved — the plan runs unattended, the apply does not.',
            },
          ],
        },
      },
      {
        tab: 'Cluster topology',
        caption: 'Cluster topology — control plane, node groups, and the networking around them',
        alt: 'Cluster topology: the AWS-managed EKS control plane outside the user VPC, system node groups and Karpenter-managed EC2 nodes in availability zones 2a and 2c, an ALB with a network interface in each public subnet, one NAT gateway in 2a that the 2c private subnet shares by routing, and a VPC gateway endpoint carrying S3 and DynamoDB traffic past it',
        // The draw.io export of this same view, shown by the panel's
        // Clean / Detailed toggle. Only the chosen one is rendered.
        detailed: {
          src: '/projects/hailcast/architecture-07-cluster-topology.svg',
          caption: 'Cluster configuration, original export \u2014 node groups, subnets, and the FinOps notes underneath',
          alt: 'Original draw.io export of the cluster node configuration: the AWS-managed EKS control plane sitting outside the user VPC, a 10.0.0.0/16 VPC across availability zones 2a and 2c, an ALB with a network interface in each public subnet targeting all zones, a single NAT gateway in 2a that the 2c private subnet shares by routing, a VPC gateway endpoint carrying S3 and DynamoDB traffic past that NAT, managed system node groups in both zones running CoreDNS, Karpenter, KEDA, ArgoCD, Prometheus, Grafana, OpenCost, the ALB controller and the External Secrets Operator, and Karpenter app nodes provisioned dynamically from zero',
        },
        diagram: {
          width: 1000,
          height: 580,
          zones: [
            { id: 'vpc', label: 'VPC', note: '10.0.0.0/16', x: 150, y: 56, w: 800, h: 434, tone: 'cloud' },
            { id: 'az-a', label: 'Availability zone 2a', x: 180, y: 226, w: 370, h: 240, tone: 'region' },
            { id: 'az-c', label: 'Availability zone 2c', x: 570, y: 226, w: 370, h: 240, tone: 'region' },
          ],
          nodes: [
            { id: 'control', label: 'EKS control plane · AWS managed, outside the VPC', x: 550, y: 22, w: 380, h: 44 },
            { id: 'alb', label: 'ALB ingress', sub: 'an ENI in each public subnet', glyph: 'balancer', x: 520, y: 130, w: 200, h: 58 },
            // The NAT is single and lives in 2a. An earlier version of this
            // drawing put it on the 2c side, which read as one per zone —
            // exactly the redundancy the project chose not to pay for.
            { id: 'nat', label: 'NAT gateway', sub: 'single · AZ 2a only', glyph: 'cloud', x: 250, y: 130, w: 180, h: 58 },
            { id: 'gwep', label: 'VPC gateway endpoint', sub: 'S3 · DynamoDB', glyph: 'service', x: 830, y: 130, w: 200, h: 58 },
            { id: 'sysA', label: 'System node group', sub: 'EKS managed', glyph: 'server', x: 365, y: 300, w: 190, h: 54 },
            { id: 'karpA', label: 'Karpenter nodes', sub: 'EC2, on demand', glyph: 'cluster', x: 365, y: 410, w: 190, h: 54 },
            { id: 'sysC', label: 'System node group', sub: 'EKS managed', glyph: 'server', x: 755, y: 300, w: 190, h: 54 },
            { id: 'karpC', label: 'Karpenter nodes', sub: 'EC2, on demand', glyph: 'cluster', x: 755, y: 410, w: 190, h: 54 },
          ],
          edges: [
            { from: 'control', to: 'alb', dash: true, via: [[550, 88], [520, 88]] },
            { from: 'alb', to: 'sysA', via: [[520, 208], [365, 208]] },
            { from: 'alb', to: 'sysC', via: [[520, 208], [755, 208]] },
            // The 2c private subnet has no NAT of its own; it routes to the
            // one in 2a.
            { from: 'karpC', to: 'nat', label: 'routed to 2a', labelAt: [140, 300], dash: true, via: [[660, 410], [660, 500], [140, 500], [140, 130]] },
            // Out through the left face and up the alley: straight up from
            // the top face is straight up through the system node group,
            // which swallowed the line whole.
            { from: 'karpA', to: 'nat', dash: true, via: [[250, 410]] },
            // The last waypoint sits below the endpoint's bottom edge rather
            // than level with it, so the arrow turns in and meets the box
            // instead of ending up underneath it.
            {
              from: 'karpC',
              to: 'gwep',
              label: 'past the NAT',
              labelAt: [900, 300],
              dash: true,
              via: [[880, 410], [880, 190], [830, 190]],
            },
          ],
          captions: [
            {
              x: 150,
              y: 528,
              tone: 'accent',
              text: 'Karpenter adds and drains EC2 nodes in either zone to fit whatever the scheduler cannot place.',
            },
            {
              x: 150,
              y: 552,
              text: 'One NAT gateway, in 2a, shared by both private subnets. S3 and DynamoDB skip it entirely through the gateway endpoint.',
            },
          ],
        },
      },
      {
        tab: 'Pod architecture',
        caption: 'Pod architecture — the service layer, the workers, and what they scale on',
        alt: 'Pod-level view: Route 53 and the ALB forwarding into ClusterIP services in front of the call API, worker, predict and simulator pods; the call API publishing to SQS and a KEDA-scaled worker deployment consuming from it and writing to RDS; Karpenter provisioning a node for a pending worker pod; the weather-cron pod fetching from the external Open-Meteo API into S3; and Prometheus, Grafana and Alertmanager watching the cluster with alerts leaving for Telegram',
        // The draw.io export of this same view, shown by the panel's
        // Clean / Detailed toggle. Only the chosen one is rendered.
        detailed: {
          src: '/projects/hailcast/architecture-08-pod-architecture.svg',
          caption: 'Pod architecture, original export \u2014 the ClusterIP service layer and the monitoring stack',
          alt: 'Original draw.io export of the pod-level view: Route 53 and the ALB forwarding into the call-api, simulator and predict ClusterIP services and the pods behind each; the call-api publishing to the SQS call queue and a KEDA-scaled worker deployment consuming from it and saving results to RDS PostgreSQL; a pending worker pod triggering Karpenter to provision a new EC2 worker node; the weather pod collecting from the external Open-Meteo API into S3; and Prometheus, Alertmanager, Grafana and OpenCost watching the cluster with alerts leaving for Telegram',
        },
        diagram: {
          width: 1000,
          height: 660,
          zones: [{ id: 'cluster', label: 'EKS cluster', x: 150, y: 100, w: 620, h: 480, tone: 'focus' }],
          nodes: [
            { id: 'user', label: 'User', glyph: 'user', x: 90, y: 52, w: 110, h: 44 },
            { id: 'r53', label: 'Route 53', glyph: 'dns', x: 250, y: 52, w: 140, h: 44 },
            { id: 'alb', label: 'ALB', glyph: 'balancer', x: 430, y: 52, w: 140, h: 44 },
            // The ClusterIP layer the drawn version used to skip entirely:
            // nothing reaches a pod here without going through a service.
            { id: 'svcCall', label: 'call-api svc', sub: 'ClusterIP', glyph: 'service', x: 250, y: 150, w: 170, h: 50 },
            { id: 'podCall', label: 'call-api pod', glyph: 'container', x: 490, y: 150, w: 170, h: 50 },
            { id: 'worker', label: 'worker deployment', sub: 'KEDA · scales on SQS depth', glyph: 'service', x: 250, y: 230, w: 190, h: 58 },
            { id: 'podWorker', label: 'worker pods', glyph: 'container', x: 490, y: 230, w: 170, h: 50 },
            { id: 'svcPred', label: 'predict svc', sub: 'ClusterIP', glyph: 'service', x: 250, y: 310, w: 170, h: 50 },
            { id: 'podPred', label: 'predict pod', glyph: 'container', x: 490, y: 310, w: 170, h: 50 },
            { id: 'svcSim', label: 'simulator svc', sub: 'ClusterIP', glyph: 'service', x: 250, y: 390, w: 170, h: 50 },
            { id: 'podSim', label: 'simulator pod', glyph: 'container', x: 485, y: 390, w: 160, h: 50 },
            { id: 'karpenter', label: 'Karpenter', sub: 'a node for a pending pod', glyph: 'cluster', x: 675, y: 390, w: 180, h: 58 },
            { id: 'weather', label: 'weather-cron pod', glyph: 'container', x: 660, y: 465, w: 200, h: 50 },
            { id: 'prom', label: 'Prometheus', glyph: 'monitor', x: 240, y: 540, w: 160, h: 48 },
            { id: 'graf', label: 'Grafana', glyph: 'forecast', x: 470, y: 540, w: 150, h: 48 },
            { id: 'am', label: 'Alertmanager', glyph: 'alert', x: 670, y: 540, w: 180, h: 48 },
            { id: 'sqs', label: 'SQS', sub: 'call queue', glyph: 'queue', x: 890, y: 150, w: 180, h: 50 },
            { id: 'rds', label: 'RDS', glyph: 'database', x: 890, y: 230, w: 180, h: 50 },
            { id: 's3', label: 'S3', sub: 'model · weather', glyph: 'bucket', x: 890, y: 310, w: 180, h: 50 },
            { id: 'meteo', label: 'Open-Meteo API', sub: 'external', glyph: 'cloud', x: 890, y: 465, w: 180, h: 50 },
            { id: 'telegram', label: 'Telegram', glyph: 'chat', x: 890, y: 600, w: 180, h: 48 },
          ],
          edges: [
            { from: 'user', to: 'r53' },
            { from: 'r53', to: 'alb' },
            { from: 'alb', to: 'svcCall', via: [[430, 112], [250, 112]] },
            { from: 'alb', to: 'svcSim', via: [[430, 112], [370, 112], [370, 390]] },
            { from: 'svcCall', to: 'podCall' },
            { from: 'worker', to: 'podWorker' },
            { from: 'svcPred', to: 'podPred' },
            { from: 'svcSim', to: 'podSim' },
            { from: 'podCall', to: 'sqs', label: 'publish' },
            { from: 'sqs', to: 'podWorker', label: 'consume', labelAt: [700, 198], via: [[890, 190], [490, 190]] },
            { from: 'podWorker', to: 'rds', label: 'save the call' },
            { from: 'podPred', to: 's3', label: 'model · weather' },
            // Routed by hand rather than left to the automatic bend: the jog
            // an automatic route takes halfway up lands square on the predict
            // pod, and the lane 20 below the worker pods clears both boxes.
            {
              from: 'karpenter',
              to: 'podWorker',
              label: 'pending pod ↔ new node',
              labelAt: [648, 268],
              labelAnchor: 'end',
              dir: 'both',
              via: [[675, 275], [490, 275]],
            },
            { from: 'weather', to: 'meteo', label: 'fetch' },
            // Up into the bucket's bottom edge. Coming back along the far
            // side put the last leg, arrowhead and all, under the box.
            {
              from: 'weather',
              to: 's3',
              label: 'nyc-forecast.csv',
              labelAt: [850, 424],
              dash: true,
              via: [[660, 430], [890, 430]],
            },
            { from: 'prom', to: 'graf', label: 'metrics' },
            { from: 'prom', to: 'am', label: 'fires', labelAt: [455, 496], via: [[240, 502], [670, 502]] },
            { from: 'am', to: 'telegram', label: 'alerts', labelAt: [735, 594], via: [[670, 600]] },
          ],
        },
      },
    ],
    // The local basket, not one repository. On the other two projects this
    // slot holds the tree of the repo the work lived in; here the work *is*
    // the arrangement of four of them, so the tree shows the layout every
    // teammate had to clone into and the ops repo's own contents inside it.
    //
    // The layout is a hard requirement rather than a preference: `make -C
    // ../project3-hailcast-infra` and the `cd`-triggered Docker credential
    // swap both resolve by relative path, so a repo cloned somewhere else or
    // under another name silently takes the delegation with it.
    folderStructure: `
~/project3-hailcast/                  # the basket — not a git repo, deliberately
├── project3-hailcast-infra           # terraform apply · the AWS foundation
│   └── docs/네이밍규약서.md            ★ the naming contract — every repo's SSOT
├── project3-hailcast-app             # docker build → ECR · six pod images + LightGBM
├── project3-hailcast-manifests       # ArgoCD pulls · 16 Applications, apps and add-ons
└── project3-hailcast-ops             ★ this repo — operations, mine
    ├── Makefile                      # the console: every command delegates via make -C
    ├── .env.example                  # PROJECT_ACCOUNT_ID only — the real .env is gitignored
    ├── .github/CODEOWNERS            # review requested on the teardown files, nothing else
    ├── docs/
    │   ├── teardown_체크리스트.md      # destroy order, gates, and the measured 21m40s run
    │   └── 재구축_체크리스트.md         # rebuild from zero — split out once the two diverged
    └── scripts/
        ├── _lib.sh                   # the guard function and the account constant, once
        ├── guard_account.sh          # sts get-caller-identity vs PROJECT_ACCOUNT_ID
        ├── setup.sh                  # toolchain, credentials, kubeconfig, Docker isolation
        ├── check.sh                  # environment and EKS reachability preflight
        ├── check_contract.sh         # naming contract — static on source, runtime on AWS
        └── teardown.sh               # conducts manifests → infra → app, y/N per stage
`,
    // The calendar pair and the phase list both read from here. Four phases
    // over three months: the build ran to the first presentation in early
    // August, and the last phase is the refinement stretch that ran in
    // parallel with the fourth project and ended at the re-presentation.
    //
    // Phase boundaries come from dated entries in the repositories themselves
    // — the account-guard decision of 07-14, the cost-allocation tags switched
    // on 07-25, the checklist's major revision of 07-28, the measured destroy
    // of 08-03, the rebuild measurements of 08-18 — rather than from a
    // schedule slide, because the deck does not carry one.
    implementation: {
      months: ['2026-06', '2026-07', '2026-08'],
      // Two stretches with a real gap between them, not one run of two months.
      // August 5–12 belonged entirely to the fourth project; hailcast picked
      // back up on the 13th and the two ran together from there. Written as a
      // single span the calendar would have shaded that week as project time,
      // which is the one week of the whole period nobody spent on this.
      span: [
        { from: '2026-06-29', to: '2026-08-04' },
        { from: '2026-08-13', to: '2026-08-27' },
      ],
      phases: [
        {
          id: 'planning',
          title: 'Retrospective & Design',
          range: 'Jun 29 – Jul 12',
          from: '2026-06-29',
          to: '2026-07-12',
          text: 'The team started by looking back at the previous two projects rather than forward at this one, and three decisions came out of it: verify by simulation and say so, split six people across four repositories, and treat a naming document as the single source of truth for every seam between them. The original goal — stopping latency under a traffic surge — was dropped here, once looking at how taxi hailing actually works showed the bottleneck was drivers rather than servers.',
        },
        {
          id: 'foundation',
          title: 'Foundation',
          range: 'Jul 13 – Jul 27',
          from: '2026-07-13',
          to: '2026-07-27',
          text: 'The AWS estate went up: VPC and EKS, the ten IRSA roles that everything else waited on, the data tier, and the CI roles. Terraform state locking moved to S3’s native lock rather than a DynamoDB table, IRSA was folded into the EKS module to settle the OIDC ordering problem, and the account guard went in before the first `apply` did — the safety rail arriving ahead of the thing it guards was the point, not an accident of ordering.',
        },
        {
          id: 'rails',
          title: 'Safety Rails & Teardown Control',
          range: 'Jul 28 – Aug 4',
          from: '2026-07-28',
          to: '2026-08-04',
          text: 'The naming verifier started running daily, cost-allocation tags were switched on, and the teardown checklist was rewritten around real runbooks instead of a practice incident. On August 3 the whole estate was destroyed for real: **140 resources, 21 minutes 40 seconds, no errors** — with one S3 bucket accounting for 20 of those 21 minutes. The first presentation followed the next day.',
        },
        {
          id: 'refine',
          title: 'Refinement & Re-presentation',
          range: 'Aug 13 – Aug 27',
          from: '2026-08-13',
          to: '2026-08-27',
          text: 'The fourth project started on August 5 and had the week to itself; from the 13th the two ran **side by side**. The estate was rebuilt from zero to prove the runbook worked, which is where its real gaps surfaced — a secret that synced with one key empty, an ECR repository left without an image, a CUR bucket that had to be migrated. The teardown document was split in two, the pod-hour simulation was worked up from eight days of recorded scaling decisions, and the project was presented again on August 27.',
        },
      ],
    },
    // Six files, in the order the page argues them rather than the order the
    // system runs them: the two that are mine, then the two that make the
    // prediction move a pod, then the two underneath both.
    //
    // The key is called `terraform` for historical reasons and no longer means
    // only Terraform — SourceSection labels each tab by the file's own basename
    // and picks a Prism grammar off its extension, so bash, Python and YAML sit
    // beside HCL without anything here knowing the difference.
    //
    // Kept out on purpose: `check_contract.sh` is the best story in the repo but
    // it is 553 lines of HCL-parsing machinery and it was Miseon Lee's design,
    // and the ops `Makefile` spends a third of itself printing a help banner the
    // folder-structure tab already covers.
    terraform: [
      {
        path: 'ops/scripts/_lib.sh',
        content: hcLib,
      },
      {
        path: 'ops/scripts/teardown.sh',
        content: hcTeardown,
      },
      {
        path: 'app/backend/predict/services/scaling_decision_engine.py',
        content: hcDecisionEngine,
      },
      {
        path: 'manifests/apps/worker/scaledobject.yaml',
        content: hcScaledObject,
      },
      {
        path: 'infra/modules/schedule/main.tf',
        content: hcSchedule,
      },
      {
        path: 'infra/modules/eks/irsa.tf',
        content: hcIrsa,
      },
    ],
    // No recovery controller on this project, and none intended: hailcast's
    // answer to a failed pod is Kubernetes restarting it and KEDA re-reading
    // the queue, not a policy file mapping alerts to scripts. `null` rather
    // than a missing key so the section disappears instead of standing empty
    // forever waiting for a file that is never going to arrive.
    recoveryPolicy: null,
    // Three Grafana captures from the demo and the simulation chart the whole
    // cost claim rests on, taken from the deck rather than restaged.
    //
    // The dashboards are in Korean and are left that way. Retitling someone
    // else's console in a screenshot would make it a mock-up of evidence
    // rather than evidence, so the `state` line and the alt text carry the
    // translation instead and the capture stays what it was. Each panel's
    // reading is named in the state line for exactly that reason: a reader who
    // cannot read the labels can still read the number being pointed at.
    //
    // Tab four is not a screenshot and says so — it is the chart, and it is
    // here rather than only in the cost section because the cost section is
    // this chart rearranged into rows.
    media: {
      scenarios: [
        {
          id: 'predictive-scaling',
          tab: 'Predictive scaling',
          label: 'Demo 1 — The forecast raising the floor',
          before: {
            src: '/projects/hailcast/demo-01-predictive-scaling.png',
            state: 'Runtime summary — a scaling floor of 3 applied, 10 workers Ready, headroom satisfied',
            alt: 'The hailcast Grafana dashboard "01 예측 기반 스케일링" showing a runtime summary row: prediction collection available, one predict pod Ready, an applied scaling threshold of 3, ten worker pods Ready, and a Ready-versus-threshold panel reading satisfied, above a five-minute chart of predict container restarts holding flat at zero',
          },
        },
        {
          id: 'keda-queue',
          tab: 'KEDA queue trigger',
          label: 'Demo 2 — The reactive layer catching the overflow',
          before: {
            src: '/projects/hailcast/demo-02-keda-queue.png',
            state: 'Queue at 107 messages, HPA ceiling 20, KEDA operator available — replicas already lifted 5 → 6',
            alt: 'The hailcast Grafana dashboard "02 처리 대기열 및 KEDA" showing a visible queue depth of 107, a maximum HPA replica count of 20, and the KEDA operator reported available; a timeline panel plots queue depth against the applied threshold and the HPA target and current replicas, all converging on 6, beside a second panel showing zero Pending worker pods against 3 Ready nodes',
          },
        },
        {
          id: 'worker-runtime',
          tab: 'Worker runtime',
          label: 'Demo 3 — What the scaled workers were actually doing',
          before: {
            src: '/projects/hailcast/demo-03-worker-runtime.png',
            state: 'Six workers running, none Pending, 100% Ready, CPU at 32.3% of request',
            alt: 'The hailcast Grafana dashboard "03 Worker 및 Kubernetes" showing six running worker pods, zero Pending, a flat zero container-restart rate over five minutes, and a Worker Ready gauge at 100 percent; a resource row below plots worker CPU rising to roughly 0.5 cores and memory to about 400 MiB, with CPU usage against request shown on a gauge at 32.3 percent',
          },
        },
        {
          id: 'pod-hour-saving',
          tab: 'Pod-hour simulation',
          label: 'The 26.5% figure, and what it is made of',
          before: {
            src: '/projects/hailcast/pod-hour-savings.png',
            state: 'Not a screenshot — the simulation chart itself, 216 pod-hours against 158.8',
            alt: 'A chart titled "예측형 스케일링 절감 시뮬레이션 — 하루 워커 파드시간": a dashed horizontal line at nine worker pods marks peak-sized fixed capacity, and a solid line traces the predicted replica count by New York hour, dropping to a minimum of two pods at 5am and climbing back to nine by early afternoon; the area between the two lines is shaded as the saving, a grey band from 14:00 to 20:00 is annotated as unobserved and filled with the peak value, and the subtitle reads 216 pod-hours against 158.8, a 26.5 percent difference',
          },
        },
      ],
      // The team recorded a demo video, shown at the presentation. It is not
      // in the material this page was built from.
      video: null,
    },
    // `glyph` names a mark from components/sections/decisionGlyphs.jsx. It is
    // a presentation hint, not a claim — omit it and the card shows the
    // neutral default rather than pretending to illustrate the decision.
    //
    // Two of these have no `over`. Splitting IRSA from RBAC was not a fork in
    // the road — the two systems govern different things and there was never a
    // version where one did both — and the naming contract is a way of working
    // rather than a choice between tools. Both keep the card because both cost
    // something, which is what this section is for.
    decisions: [
      {
        title: 'One NAT gateway, in one availability zone',
        glyph: 'route',
        chose: 'A **single NAT gateway in 2a**, with a free VPC gateway endpoint carrying S3 and DynamoDB traffic past it',
        over: 'one NAT gateway per AZ, the configuration a production account would use',
        why:
          'A NAT gateway bills by the hour whether or not anything routes through it, so the second one doubles a fixed cost to buy redundancy a four-week dev environment will probably never call on — roughly **$86 a month against $43** at Seoul list price. The trade is real and we wrote it down as such: **an outage in 2a takes outbound connectivity away from the entire private tier**, and the same architecture built for production gets a NAT per zone and a Multi-AZ database with it.',
      },
      {
        title: 'Add-ons installed by ArgoCD, never by Terraform',
        glyph: 'branch',
        chose: 'KEDA, Karpenter, the ALB controller and the monitoring stack **declared in the manifests repo** and pulled by ArgoCD',
        over: 'installing them with `helm_release` from the infrastructure Terraform, which is one less repository',
        why:
          'A `helm_release` in Terraform gives the same Kubernetes object **two owners**: Terraform reconciles it toward the state file, ArgoCD reconciles it toward Git, and each reports success while undoing the other. The boundary we drew is by **who creates the thing** rather than by convenience — **Terraform owns AWS, ArgoCD owns the cluster** — and it is what makes `selfHeal` a safe thing to turn on rather than a fight.',
      },
      {
        title: 'Guard on the account identity, not the profile name',
        glyph: 'inject',
        chose: 'Comparing `sts get-caller-identity` against `PROJECT_ACCOUNT_ID`, leaving the credential chain alone',
        over: 'forcing `AWS_PROFILE=hailcast`, which is how the script started',
        why:
          'Forcing a profile name protected a personal `[default]` back when the project account and the owner’s personal account were different, and once they were the same it protected nothing while **breaking both a server that uses the default profile and CI**, which authenticates through OIDC environment variables. The safety net is **which account you are standing in**, not what the profile is called — so the guard reads the identity and the chain stays untouched.',
      },
      {
        title: 'The .env file is read as one value, never sourced',
        glyph: 'stroke',
        chose: 'Parsing exactly one line, `PROJECT_ACCOUNT_ID`, out of the file',
        over: '`source .env`, which is what a shell script normally does and would let the file carry anything',
        why:
          'Sourcing it opens two holes we demonstrated rather than argued. A single `export AWS_PROFILE=…` line **splits the credentials the guard inspects from the ones Terraform then uses** — `make infra-destroy` runs the guard and the delegation in different shells, so the guard clears account A while Terraform destroys account B. And sourcing is arbitrary code execution: a redefined `aws()` function defeats the guard entirely. Anyone who wants a profile exports it **in their shell**, where both halves see the same thing.',
      },
      {
        title: 'Teardown ordered by who created the resource',
        glyph: 'pipeline',
        chose: '**manifests → infra → app**, with a y/N gate between stages and no automatic continue on failure',
        over: 'running `terraform destroy` first, which is the command that sounds like it removes everything',
        why:
          '`terraform destroy` only removes what is **in the state file**, and the ALBs, ENIs and Karpenter nodes that Kubernetes created are not — they survive, they keep billing, and they block the VPC from being deleted for hours. Deleting the Kubernetes objects first lets the finalizers clean up their own AWS resources while the cluster is still alive to run them. The measured run was **140 resources in 21 minutes 40 seconds with zero errors**; before the ordering existed, a practice teardown failed after 20 minutes on orphans.',
      },
      {
        title: 'IRSA and RBAC kept as two separate systems',
        glyph: 'channels',
        chose: 'IRSA for anything outside the cluster, Kubernetes RBAC for anything inside it, with **no attempt to bridge them**',
        over: null,
        why:
          'The predict pod needs S3 and RDS, which are AWS resources reached through an IAM role assumed by its ServiceAccount; it also needs to patch a KEDA `ScaledObject`, which is a Kubernetes API object no IAM policy can reach. **Neither system can substitute for the other**, and treating them as one is how a team spends an afternoon in IAM debugging an RBAC failure. Both fail the same way when a ServiceAccount name is one character off: a plain "access denied" against a policy that is entirely correct.',
      },
      {
        title: 'Controllers pinned to fixed nodes, workloads on Spot',
        glyph: 'depth',
        chose: 'A **managed node group of two fixed instances** for CoreDNS, Karpenter, KEDA, ArgoCD, Prometheus and the ALB controller, with application pods on Karpenter Spot nodes that scale to zero',
        over: 'running everything on Spot, which is cheaper by exactly the amount that matters least',
        why:
          'If Karpenter and KEDA sit on Spot capacity, a reclamation event removes **the thing that responds to reclamation events**. The controllers go on stable ground and the workloads take the cheap, interruptible capacity — which is where the saving actually is, because application nodes drop to zero on a quiet night and the two system nodes were going to run either way.',
      },
      {
        title: 'A night shutdown built without a Lambda',
        glyph: 'process',
        chose: '**EventBridge Scheduler calling the AWS API directly** to stop the node group and the database at 02:00 KST and start them again at 10:00',
        over: 'a Lambda function triggered on a schedule, the usual shape of this pattern',
        why:
          'A Lambda here would be a function, a role, a package and a deployment path to maintain in order to make **two API calls a day**. The scheduler makes them itself, against a role scoped to that one node group and that one database instance. What it cost us was a lesson: **a schedule does not fail when you create it, it fails at 02:00 when it runs** — ours retried twice and dropped the event with no DLQ, so the failure was invisible until someone checked the node count the next morning. We added that check to the routine.',
      },
      {
        title: 'The naming document is corrected before the code is',
        glyph: 'note',
        chose: 'One naming convention as the source of truth, revised **first**, with a verifier checking the code against it daily',
        over: null,
        why:
          'Four repositories reference each other entirely through strings — role names, ServiceAccount names, a metric key, an image tag — and a one-character mismatch fails **without an error**. So the document leads and the code follows, and when reality is right and the document is wrong we amend the document with the evidence attached rather than bending the code to a stale line. The cost is honest: **the verifier checks names, not values**, and a collection interval documented as 2 hours and coded as 4 sat there unnoticed the whole project.',
      },
    ],
    // NOT DOLLARS. Every other cost table on this site prices resources; this
    // one measures **worker pod-hours a day**, which is the unit the project's
    // own claim is made in and the only one it can support — OpenCost was
    // pricing from the AWS list price with the CUR integration unfinished, so
    // converting to money here would have dressed an estimate as a bill.
    //
    // The rows are the same twenty-four hours the simulation chart plots,
    // banded and summed. Ordered by the size of the gap, largest first, except
    // the last row — which is the one that does not close, and the reason it
    // does not is the most important thing in the section.
    cost: {
      unit: 'worker pod-hours / day',
      series: [
        { id: 'fixed', label: 'Peak-sized fixed capacity' },
        { id: 'actual', label: 'hailcast — predicted floor' },
      ],
      items: [
        {
          label: '00:00 – 05:59',
          note: 'The quiet half of the night — the floor falls to two pods at 5am, its lowest point in the day',
          fixed: 54.0,
          actual: 23.05,
        },
        {
          label: '06:00 – 11:59',
          note: 'Morning ramp — the floor climbs from two back through six as demand returns',
          fixed: 54.0,
          actual: 29.55,
        },
        {
          label: '12:00 – 13:59',
          note: 'Midday — within one pod of peak, and correctly so',
          fixed: 18.0,
          actual: 16.65,
        },
        {
          label: '21:00 – 23:59',
          note: 'Late evening — at peak until the last hour of the day',
          fixed: 27.0,
          actual: 26.5,
        },
        {
          label: '14:00 – 20:59',
          note: 'Seven hours with no observation at all — filled with the peak value rather than estimated',
          fixed: 63.0,
          actual: 63.0,
        },
      ],
      total: { fixed: 216.0, actual: 158.75 },
      notes: [
        'The entire saving is **the quiet hours**, and that is the whole thesis rather than a footnote: between midnight and noon a peak-sized fleet spends 108 pod-hours where the forecast asks for 52.6. Around the middle of the day the two lines sit **within one pod of each other**, which is the result you want — a predictor that undercut peak demand at 1pm would be saving money by dropping calls.',
        'The **14:00–20:59 row does not move, because there is nothing in it**. Those seven New York hours are 03:00–10:00 KST, exactly when the night shutdown had the cluster switched off, so no scaling decision was ever recorded for them. They are filled with the **peak value of nine pods** — the most pessimistic choice available — rather than interpolated from the hours either side, which would have invented a saving out of a gap in the data.',
        'The basis is **107 hourly snapshots** written to `dashboard/pod-history.json` in S3 between 2026-07-21 and 07-28, with `predicted_replicas` averaged by New York hour. The comparison column is a **fixed fleet held at the observed peak of nine pods**, which is what "size it for the busy hour and leave it" actually costs over a day.',
        'Pod-hours are a proxy for money, not money. Converting them would need OpenCost reading real billing through the **CUR integration, which was scoped and never finished** — so the figure that reached the presentation is the one the data supports, and the conversion is stated as the next task rather than performed on the slide.',
      ],
      caveat:
        'Simulated expected effect for a development environment in `ap-northeast-2` — not production billing data, and not a live service. Both columns are pod-hours derived from recorded scaling decisions over eight days; the fixed-capacity column is a modelled baseline that was never actually run.',
    },
    // Pending, not absent. The four repositories are public under the
    // `ThisPod-ThatPod` org and the deck exists; which of them this page
    // should point at is the author's call, and a link section is the one
    // place a guess is worse than a gap.
    links: {
      github: null,
      notion: null,
      terraform: null,
      presentation: null,
    },
    reflection: {
      learned:
        'This was the first project where I owned **nothing that runs in production and everything that stops it going wrong**, and that turned out to be a real job rather than a consolation prize. The lesson underneath all of it: **a safety check that reports without comparing is worse than no check at all**. Our setup script printed the AWS account ID and compared it to nothing, so a session sitting in the wrong account went green on every single check — the output looked like verification and was decoration. Fixing it taught me to ask of any guard **what input would make this fail?** — and if I cannot answer, it is not a guard. The same pattern kept surfacing everywhere: a schedule that fails at 02:00 rather than at `apply`, a verifier that reads names and never reads values, a 200 OK from a path that does not exist. **Every expensive failure on this project was silent**, and the work that mattered was making failure loud.',
      differently:
        'I would put **resource policy into the naming contract on day one**. We got names right and left CPU limits to each team, which is how a load test ended up restarting pods and how the verifier passed a collection interval documented as 2 hours and coded as 4 — it checks names, not values, and extending it to parameters is a smaller job than the day we spent finding that out. I would also **rebuild from zero much earlier**: doing it in the last stretch is what exposed the empty secret key, the imageless ECR repository and the CUR bucket migration, and every one of those was a gap in a runbook I believed was finished. Two more sit behind those — **wiring OpenCost to the CUR** so the cost figure stops being an estimate, and **parallelising around the IRSA bottleneck** I could see coming and scheduled around anyway, leaving three tracks waiting on one. Leading six people across four repositories meant the fastest thing I could do for the project was usually not to write anything, which took me longer to accept than it should have.',
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
