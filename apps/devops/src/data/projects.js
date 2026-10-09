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
// The eight span all four repositories, so this is not one track's source the
// way the other two projects' sections are. Two are mine, two are the mechanism
// the page is about, and four are infrastructure and deployment — which are
// Miseon Lee's and Yongbin Cho's work and are captioned as theirs.
import hcLib from '../content/hailcast/code/ops/_lib.sh?raw'
import hcTeardown from '../content/hailcast/code/ops/teardown.sh?raw'
import hcDecisionEngine from '../content/hailcast/code/predict/scaling_decision_engine.py?raw'
import hcScaledObject from '../content/hailcast/code/manifests/scaledobject.yaml?raw'
import hcSchedule from '../content/hailcast/code/terraform/schedule/main.tf?raw'
import hcIrsa from '../content/hailcast/code/terraform/eks/irsa.tf?raw'
// The two the refinement added. `glue.tf` is the CUR chain that turned the cost
// figure from a list-price estimate into a billed one; `replace_rebuild_values.sh`
// is the rebuild runbook's §8-1 table executed instead of read.
import hcGlue from '../content/hailcast/code/terraform/storage/glue.tf?raw'
import hcReplaceValues from '../content/hailcast/code/manifests/replace_rebuild_values.sh?raw'

// ShimonVault's, and the one set here that needed no translation pass at all:
// it is a solo repository and its comments were already written in English, so
// these eight are byte-for-byte copies with nothing changed, comments included.
//
// Chosen to be evidence for the decisions the page argues rather than to
// inventory the repository. Three Python, four Terraform, one workflow, in the
// order the section reads them: what detects, what responds, what wires the
// response up, what the network permits, and how a release reaches it.
//
// `terraform/main.tf` is deliberately absent. It holds a provider block, the
// S3 backend and three data sources, and declares no resources at all, so on a
// project whose 89 resources are spread across 27 per-concern files it is the
// one Terraform file with none of the story in it. Lock-N-Lock omits its own
// for the same reason. It also hardcodes the account id, which `scripts/
// destroy.sh` does too, and which is why that script is not here either.
import svAuditMiddleware from '../content/individual-project-two/code/app/audit_middleware.py?raw'
import svRateLimit from '../content/individual-project-two/code/app/rate_limit.py?raw'
import svBlockIp from '../content/individual-project-two/code/lambda/block_ip_handler.py?raw'
import svLambdaTf from '../content/individual-project-two/code/terraform/lambda.tf?raw'
import svVpcTf from '../content/individual-project-two/code/terraform/vpc.tf?raw'
import svSecurityGroupsTf from '../content/individual-project-two/code/terraform/security_groups.tf?raw'
import svAlbTf from '../content/individual-project-two/code/terraform/alb.tf?raw'
import svAcmTf from '../content/individual-project-two/code/terraform/acm.tf?raw'
import svCdWorkflow from '../content/individual-project-two/code/workflows/cd.yml?raw'

// Project1-Self-Build's, on the same terms as the three above: comments and
// the prose a human is meant to read are translated, everything that is
// behaviour is byte-for-byte what the repository holds. Two of the seven had
// Korean in them. `webhook_server.py` carried it in its comments and in the
// Slack and log messages an operator reads, and `nginx_selfheal.yml` in its
// comments and `debug` output; every module argument, identifier and flag in
// both is untouched.
//
// Five carry the page's argument rather than inventorying the repository. The
// Terraform and the workflow are the two halves of "one push builds it and
// then destroys it"; the webhook is the mechanism the Alert-to-restart diagram
// draws; the bootstrap script is the Tailscale subnet router with the comment
// explaining why it must not accept routes; and the self-heal role is the one
// decision on this page that systemd makes instead of the alert pipeline.
//
// Two are deliberately absent and the omission is not an oversight.
// `chaos/inject.sh` and `roles/prometheus_bot/tasks/main.yml` both embed a
// working Telegram bot token. No file under any project's `code/` directory
// carries a redaction, and neither story is load bearing enough to be the
// first one that does.
import ipoMainTf from '../content/individual-project-one/code/terraform/main.tf?raw'
import ipoMgmtBootstrap from '../content/individual-project-one/code/terraform/mgmt_bootstrap.sh?raw'
import ipoWorkflow from '../content/individual-project-one/code/workflows/deploy.yml?raw'
import ipoWebhook from '../content/individual-project-one/code/recovery/webhook_server.py?raw'
import ipoSelfheal from '../content/individual-project-one/code/roles/nginx_selfheal.yml?raw'
import ipoAlertRules from '../content/individual-project-one/code/monitoring/alert.rules.yml?raw'
import ipoAlertmanager from '../content/individual-project-one/code/monitoring/alertmanager.yml?raw'

// The Cloud Resume Challenge's, and the one set here that is not a copy at
// all. That project's infrastructure lives in this repository, so these read
// the real files out of infra/ and backend/ rather than a mirror under
// content/. Every other project's source genuinely is in another repo, which
// is what makes a copy the only option there and the wrong one here: this
// page's whole claim is that it describes the infrastructure this site runs
// on, and a mirror can drift from that silently. vite.config.js carries the
// server.fs.allow entry the dev server needs to read outside its own root.
import crcLambdaTf from '../../../../infra/lambda.tf?raw'
import crcIamTf from '../../../../infra/iam.tf?raw'
import crcDynamodbTf from '../../../../infra/dynamodb.tf?raw'
import crcDeployPolicyTf from '../../../../infra/bootstrap/deploy_policy.tf?raw'
import crcHandler from '../../../../backend/functions/counter/handler.py?raw'
import crcInfraWorkflow from '../../../../.github/workflows/infra.yml?raw'

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
//   decisions     [{ keyword, title, glyph, chose, over, why }]
//                 Decisions and trade-offs are one deck, not two sections:
//                 every entry is both. `over` may be null where the choice was
//                 a way of working rather than a fork.
//
//                 `keyword` is the short name the bubble is labelled with and
//                 the name on the card, two to four words, and it must not
//                 wrap: the pill is sized to it. `title` states the same
//                 decision as one full sentence, which is what the bubble
//                 opens to reveal.
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
  // Still mapped, and still a trap worth naming. --c-indigo is the same
  // #3E5C89 as --accent-base in light mode, so a page choosing it is painted
  // in the site's default chrome and reads as unthemed. The Cloud Resume
  // Challenge sat here until teal below replaced it. Reach for it only if the
  // base accent ever moves off that hex.
  indigo: 'var(--c-indigo)',
  teal: 'var(--c-teal)',
  // The eighth, added rather than reusing a seventh page's worth of an
  // existing accent. See the token in global.css for why it is a violet.
  // Was ShimonVault's, then free for one change, now Kubernetes Challenge's.
  // Spending it there is what ended forest's double duty, so every project on
  // the site now has an accent of its own.
  plum: 'var(--c-plum)',
  burgundy: 'var(--c-burgundy)',
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
].map(([file, title], i) => ({
  src: `${LOCK_N_LOCK_DIAGRAM_DIR}${file}`,
  tab: title,
  alt: title,
  // Numbered to match the tab badges: the drawn overall view is 01, so these
  // exports run 02 to 06 rather than the 01 to 05 in their file names.
  address: `lock-n-lock/architecture/${String(i + 2).padStart(2, '0')}-${file.replace(/^architecture-\d+-|\.svg$/g, '')}`,
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
    //
    // Each line takes one of four shapes, and LinksSection picks the renderer
    // from the shape: a string is a paragraph, an array of strings is a dotted
    // list, `{ flow }` is the build-detect-recover diagram, and `{ figures }`
    // is a row of number tiles.
    glance: {
      why: 'Unexpected downtime costs money the moment it happens. We aimed to address this problem by building infrastructure that detects a failure and repairs itself automatically.',
      // Three steps in order, then the loop back from Recover to Detect that
      // makes the system self-healing. Tailscale is the network under all
      // three rather than a fourth step, so it is drawn as a base layer.
      how: {
        flow: {
          steps: [
            { key: 'Build', tools: 'Terraform + Ansible', caption: 'codify the stack' },
            { key: 'Detect', tools: 'Prometheus + AlertManager', caption: 'catch failures' },
            { key: 'Recover', tools: 'Recovery Controller', caption: 'runs the fix' },
          ],
          loop: 'healthy again, back to watching',
          base: { name: 'Tailscale', text: 'connects the hybrid VMware/AWS environment' },
        },
      },
      result: {
        figures: [
          { value: '30\u201360s', label: 'recovery from failure' },
          { value: '4', label: 'automated failure scenarios validated' },
          { value: '~10 min', label: 'full deploy from scratch' },
        ],
      },
    },
    // The workspace as four tiles beside At a Glance: one per place the work
    // lived. Each tile names its tool, leads with one figure, and opens into a
    // panel when the reader points at it. A project with `workspace` set gets
    // the tile grid in place of the plain link icons; LinksSection reads it.
    //
    // `link` names a key in `links` above, so a URL is written once. `body`
    // picks a panel by `type`: git, docs, network or slides.
    workspace: [
      {
        id: 'github',
        name: 'GitHub',
        headline: 'Our Git workflow',
        figure: { value: '27', label: 'pull requests reviewed' },
        link: 'github',
        linkLabel: 'Open repo',
        footnote: 'Merges keep one clean history across branches.',
        body: {
          type: 'git',
          lanes: [
            {
              branch: ['main'],
              who: 'Team Lead',
              text: 'Merges into the release branch once the full stack passes on dev.',
            },
            {
              branch: ['dev'],
              who: 'Junhan Shin, PR Owner',
              text: 'Reviews every pull request and catches conflicts before they merge.',
              mine: true,
              note: 'Each change gets its own branch.',
            },
            {
              branch: ['feature/*', 'fix/*', 'docs/*'],
              who: 'Whole team',
              text: 'Builds features and fixes on individual branches.',
            },
          ],
          stats: [
            { value: '27', label: 'PRs handled' },
            { value: '3', label: 'Merge conflicts resolved' },
            { value: '2', label: 'Security issues caught' },
          ],
        },
      },
      {
        id: 'notion',
        name: 'Notion',
        headline: 'Team documentation',
        figure: { value: '19', label: 'meeting notes' },
        link: 'notion',
        linkLabel: 'Open Notion',
        footnote: 'The team\u2019s shared Notion workspace',
        body: {
          type: 'docs',
          rows: [
            { icon: 'page', title: 'Project plan', text: 'Goals and roles' },
            { icon: 'page', title: 'Overview, tools, and architecture', text: 'Shared reference pages' },
            { icon: 'table', title: 'Meeting notes', text: 'April 21 to May 21', count: 19 },
            { icon: 'people', title: 'Member workspaces', text: 'One build journal per member', count: 5 },
            { icon: 'archive', title: 'Archive', text: 'Lab notes and scratch pages' },
          ],
        },
      },
      {
        id: 'infrastructure',
        name: 'Infrastructure',
        headline: 'Hybrid network',
        figure: { value: '2', label: 'environments on one network' },
        link: 'github',
        linkLabel: 'Open repo',
        footnote: 'Built with Terraform and bootstrap_tailscale.sh',
        body: {
          type: 'network',
          link: 'Tailscale',
          // `router` marks the machine that joins its side to the tailnet;
          // its value is the name it carries on Tailscale.
          zones: [
            {
              name: 'VMware lab',
              range: '172.16.1.0/24',
              hosts: [
                { name: 'proj_mgmt', role: 'HAProxy load balancer', router: 'proj-mgmt' },
                { name: 'proj_rocky1', role: 'Web server' },
                { name: 'proj_rocky2', role: 'Web server' },
                { name: 'proj_ubuntu', role: 'Database' },
              ],
            },
            {
              name: 'AWS VPC',
              range: '10.0.0.0/16 in Seoul',
              hosts: [
                { name: 'aws-mgmt', role: 'Monitoring and recovery', subnet: 'Public', router: 'aws-mgmt' },
                { name: 'aws-web1', role: 'Nginx and FastAPI', subnet: 'Public' },
                { name: 'aws-web2', role: 'Nginx and FastAPI', subnet: 'Public' },
                { name: 'aws-db', role: 'PostgreSQL 16', subnet: 'Private' },
                { name: 'NAT instance', role: 'Internet access for aws-db', subnet: 'Public' },
              ],
            },
          ],
          note: 'Tailscale joins the two sides with no public port open. Terraform creates the join key and approves the routes, and my bootstrap script brings the VMware lab in.',
        },
      },
      {
        id: 'presentation',
        name: 'Presentation',
        headline: 'Presentation highlights',
        figure: { value: '4', label: 'highlight slides' },
        link: 'presentation',
        linkLabel: 'Open slides',
        footnote: '4 of the 70 slides',
        body: {
          type: 'slides',
          slides: [
            { number: 13, caption: 'My role' },
            { number: 20, caption: 'PR Owner workflow' },
            { number: 25, caption: 'Setup and check scripts' },
            { number: 26, caption: 'Terraform structure' },
          ].map((slide) => ({
            ...slide,
            src: `/projects/project1_echochallengers/slides/slide-${String(slide.number).padStart(2, '0')}.webp`,
          })),
        },
      },
    ],
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
      // `mirror` — `columns` reflected, with the lead pinned to the right-hand
      // half. Same cell maths as hailcast's, opposite silhouette, which is the
      // cheapest way to stop two pages reading as one picture.
      layout: 'mirror',
      tiles: [
        {
          size: 'lead',
          label: 'Infrastructure Build',
          // Terraform resources, not AWS resources. The `terraform/` directory
          // holds 41 `resource` blocks and no `count` or `for_each`, so the
          // figure is exact — but ten of them are not AWS: four generated
          // local files, three `terraform_data` blocks, two Tailscale objects
          // and a TLS private key. The deck says it both ways, "41 AWS
          // resources codified" on the overview slides and "41 resources
          // codified in total" on the code-structure slide; this is the one
          // that survives being checked.
          stat: { value: '41', unit: 'Terraform resources' },
          text: 'Defined the network, servers, load balancer, and Tailscale connection as code in **Terraform** and wrote the **Ansible roles** that configure each server automatically.',
        },
        {
          size: 'medium',
          label: 'PR Owner',
          text: 'Reviewed and merged all **27 pull requests** into the `dev` branch, resolving issues such as a **hardcoded secret** before they reached the public repo.',
        },
        {
          size: 'medium',
          label: 'Took Initiative',
          text: 'Took ownership and led the **on-premises foundation** build in the **first week** to give the rest of the team a working base to start from.',
        },
        {
          size: 'small',
          label: 'Hybrid Networking',
          text: 'Wrote the **Tailscale bootstrap script** that joined on-premises VMware and the AWS VPC into one network.',
        },
        {
          size: 'small',
          label: 'Failure Injection',
          text: 'Built the Ansible `chaos` role and `chaos/inject.sh`, which made the recovery system **testable on demand**.',
        },
        {
          size: 'small',
          label: 'Troubleshooting',
          text: 'Documented **12 troubleshooting cases** and the four iterations that led to the `pkill -x` fix.',
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
          text: 'Unplanned downtime costs money the moment it happens through lost transactions and missed service-level agreements (SLAs). The cost grows again when an engineer has to be paged at 3am to fix the problem.',
        },
        {
          size: 'lead',
          label: 'Technical Problem',
          text: 'Most monitoring systems only alert someone when a service breaks. We built infrastructure that detects the failure and repairs itself before anyone has to respond.',
        },
        {
          size: 'support',
          label: 'Personal Foundation',
          text: "This was our team's first chance to apply cloud infrastructure skills to a complete, end-to-end build. We wanted to test whether what we learned in the classroom would hold up under real deployment conditions.",
        },
        {
          size: 'support',
          label: 'Core Design Values',
          text: 'We designed every part of this system for day-to-day operation after launch. Each piece of code maps to a specific failure scenario that the system has to detect and recover from.',
        },
        {
          size: 'support',
          label: 'Goals',
          text: 'We aimed to cut incident response time far enough that most failures resolve before anyone notices. We also made every redeploy safe and repeatable by keeping the infrastructure idempotent.',
        },
        {
          size: 'support',
          label: 'Applicability',
          text: 'Small and mid-sized ops teams can use the same self-healing pattern to automate routine restarts. It also fits organizations moving from on-premises to the cloud and anyone building a hands-on environment to learn infrastructure.',
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
        detail: 'for 41 Terraform resources',
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
        text: 'For our project, we chose Terraform because we needed the whole infrastructure to be rebuilt the same way every time. Terraform let us define all **41 resources** as code and bring the environment up with a single command.',
      },
      {
        tool: 'Why Prometheus + Grafana?',
        icon: 'Prometheus',
        text: "Prometheus scrapes every server's exporters every five seconds, and Grafana turns those metrics into dashboards. We chose Prometheus and Grafana because both tools are open source and kept the project free of **vendor lock-in**.",
      },
      {
        tool: 'Why Tailscale?',
        icon: 'Tailscale',
        text: 'We chose Tailscale after learning about it in class. Its **mesh VPN** joined the on-premises VMware lab to the AWS VPC without opening a public port. Terraform created the join key and approved the routes, which let us skip most of the manual setup a site-to-site VPN would need.',
      },
      {
        tool: 'Why Flask?',
        icon: 'Flask',
        text: 'We chose Flask because the recovery controller only needed to listen on port 5001 for webhooks from Alertmanager and run the matching fix. Flask let us build this **single-purpose webhook receiver** in a small, lightweight framework.',
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
          'Hybrid infrastructure: the VMware on-premises host and the AWS VPC joined into one addressable network over Tailscale',
        alt: 'The on-premises VMware host proj-mgmt, running Terraform and Ansible, joined over a Tailscale VPN to an AWS VPC in ap-northeast-2: an internet-facing load balancer on HTTP 80 spread across two availability zones; aws-web1 and the NAT instance with aws-mgmt in the 10.0.1.0/24 public subnet in AZ 1; aws-web2 in the 10.0.2.0/24 public subnet in AZ 2; aws-db running PostgreSQL 16 in the 10.0.11.0/24 private subnet, reaching the internet through the NAT instance and the internet gateway; and aws-mgmt carrying Prometheus, Grafana, Alertmanager, and the Flask recovery controller',
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
          'Detection and recovery path',
        alt: 'The self-healing pipeline in four phases: detect, where node and nginx exporters are scraped every five seconds by Prometheus and a rule firing for five seconds reaches Alertmanager; decide, where Alertmanager notifies Slack and posts a webhook to the Flask recovery controller on port 5001, which looks the alertname up in recovery_map.yml; recover, where one of four scripts runs over Ansible (restart nginx, restart the nginx exporter, or pkill the CPU and memory load) and is then verified and retried up to its limit; and report, where the outcome is posted to Slack as SUCCESS, FAILED, or NO_MAP',
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
              text: 'Detection to recovery runs unattended: 5–10s to detect, 30–60s to recover, validated across all four scenarios.',
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
          text: 'We chose **infrastructure self-healing** as our topic and practiced individual failure scenarios with feedback from our instructor. I took ownership of the on-premises foundation during this first week to give the team a working base to build on.',
        },
        {
          id: 'onprem',
          title: 'On-Premises Build',
          range: 'Apr 27\u2013May 8',
          from: '2026-04-27',
          to: '2026-05-08',
          text: "Each of us built the same four-server VMware architecture and automated its deployment with HAProxy and Ansible. As PR Owner, I reviewed and merged the team's pull requests and kept the shared repository clean ahead of the mid-project checkpoint.",
        },
        {
          id: 'aws',
          title: 'AWS + Hybrid Integration',
          range: 'May 9\u201319',
          from: '2026-05-09',
          to: '2026-05-19',
          text: 'We moved the infrastructure to EC2 and merged our failure scenarios into one automated recovery system. I wrote the Terraform and Ansible code behind that move and the Tailscale bootstrap script that connected the VMware lab to AWS.',
        },
        {
          id: 'polish',
          title: 'Final Polish',
          range: 'May 20\u201322',
          from: '2026-05-20',
          to: '2026-05-22',
          text: 'We recorded the demo video, finalized the presentation, and rehearsed the final delivery. My `chaos/inject.sh` script let us trigger all four failure scenarios on command during those rehearsals.',
        },
      ],
    },
    media: {
      // One tab per chaos scenario, read straight down: what happened, the
      // clip of it happening, then the stills for looking closer. No control
      // switches between the last two. A reader who finds the clip unclear
      // should get to the sharper evidence by scrolling rather than by
      // discovering a toggle.
      //
      // `lead` carries the explanation and renders above the clip. It sat
      // under it as a caption first, where it read as a label on a picture.
      //
      // The clips are cut from the team's demo recording, which is 198kbps at
      // 1516x720. Its dashboard text is soft before anything here touches it,
      // which is exactly why the 2670x1279 stills stayed: the clip shows the
      // change happening and the stills show what the panels actually said.
      // The two are from different runs, and `stillsNote` says so rather than
      // leaving a reader to notice the addresses do not match.
      //
      // The two load scenarios are sped up because most of their real
      // duration is a slow climb toward a threshold. `speed` renders beside
      // the Demo heading; see public/projects/README.md.
      //
      // Written once here rather than on each of the four scenarios: they
      // describe where this project's footage came from, which is the same
      // answer every time. A scenario can still override either.
      clipNote: "Cut from the team's demo recording. Silent, and it loops.",
      stillsNote:
        'Captured at 2670x1279, sharper than the loop above. They are from a separate run of the same scenarios, so the addresses differ: **10.0.1.46** and **10.0.2.60** here, **10.0.1.95** and **10.0.2.42** in the recording. Click either to open it full size.',
      scenarios: [
        {
          id: 'scenario-1',
          tab: 'Nginx down',
          label: 'Scenario 1: Nginx down',
          lead:
            'Nginx is stopped on **web1**. The service panel turns red, the alert fires, and the controller restarts it. Verified in **5.69s**.',
          clip: {
            src: '/projects/project1_echochallengers/clip-01-nginx.mp4',
            width: 1280,
            height: 608,
            poster: '/projects/project1_echochallengers/clip-01-nginx.jpg',
            speed: '3x',
            alt: 'The Nginx panel for web server one turning red as the firing alert arrives, then returning to online after the controller restarts the service',
          },
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
          label: 'Scenario 2: Exporter down',
          lead:
            'The exporter on **web1** is stopped. Nginx keeps serving, so only the exporter panel turns red. Restarted in **5.49s**.',
          clip: {
            src: '/projects/project1_echochallengers/clip-02-exporter.mp4',
            width: 1280,
            height: 608,
            poster: '/projects/project1_echochallengers/clip-02-exporter.jpg',
            speed: '3x',
            alt: 'The Nginx service panel for web server one staying green while its exporter panel turns red, then the exporter returning to online',
          },
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
          label: 'Scenario 3: High CPU',
          // Kept to the length and register of the other three. The long
          // version of this one carried the `pkill -f` story, which the
          // "Exact-match pkill" decision card further down already tells in
          // full — so the narration was retelling a story the page makes
          // better elsewhere, and reading longer and more explanatory than
          // its three neighbours while doing it. What stays is the part only
          // this scenario has: the failure is load, so the fix ends a process
          // rather than restarting a service.
          lead:
            'A CPU burn pins **web1** at 100%. Nothing has crashed, so the controller ends the load process instead of restarting Nginx. Recovered in **3.65s**.',
          clip: {
            src: '/projects/project1_echochallengers/clip-03-cpu.mp4',
            width: 1280,
            height: 608,
            poster: '/projects/project1_echochallengers/clip-03-cpu.jpg',
            speed: '13x',
            alt: 'The CPU chart for web server one climbing from idle past the eighty percent threshold and pinning at one hundred percent, then falling back to idle after the controller ends the load process',
          },
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
          label: 'Scenario 4: High memory',
          lead:
            '`stress-ng` drives **web1** memory past 70%. The load is ended and the result verified in **3.02s**.',
          clip: {
            src: '/projects/project1_echochallengers/clip-04-memory.mp4',
            width: 1280,
            height: 608,
            poster: '/projects/project1_echochallengers/clip-04-memory.jpg',
            speed: '10x',
            alt: 'The memory chart for web server one rising past the seventy percent threshold, then returning to its baseline near 63 percent after the controller ends the load',
          },
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
        keyword: 'NAT instance',
        title: 'Outbound internet access for the private subnets runs through a low-cost NAT instance.',
        glyph: 'route',
        chose: 'A **NAT instance** for outbound routing',
        over: 'AWS’s managed NAT Gateway',
        why:
          "A NAT instance was cheaper than AWS's managed NAT Gateway and responded faster for our small workload. The NAT Gateway is built for **large production traffic**, which this project did not have.",
      },
      {
        keyword: 'Exact-match pkill',
        title: 'Exact process-name matching with `pkill -x` keeps the recovery script from stopping itself.',
        glyph: 'process',
        chose: '`pkill -x`, exact process-name matching only',
        over: '`pkill -f`, which matches anywhere in the command line',
        why:
          'The first versions of the memory-recovery script used `pkill -f stress-ng`. This command also stopped the Ansible process that was running the script, and the recovery ended before it finished. After **4 iterations**, `pkill -x` fixed the problem by matching only the exact process name.',
      },
      {
        keyword: 'Split alert channels',
        title: 'Detection alerts and recovery results each have their own Slack channel.',
        glyph: 'channels',
        chose: 'Two channels, `#monitoring` for detection and `#recovery` for results',
        over: 'one combined feed',
        why:
          'Detection alerts go to `#monitoring`, and recovery results go to `#recovery`. Keeping them apart makes it easy to see **what failed** and **what the system has already fixed**.',
      },
      {
        keyword: 'PR Owner role',
        title: 'A PR Owner reviews every pull request for security issues and conflicts before it merges.',
        glyph: 'branch',
        chose: '`main ← dev ← feature/*`, with a named **PR Owner**',
        // No competing option to name: this was a way of working, not a fork.
        over: null,
        why:
          'We used a `main ← dev ← feature/*` branch strategy where one PR Owner reviewed every merge for security issues and conflicts. This review found a **hardcoded Slack webhook URL** before it reached the public repository.',
      },
      {
        keyword: 'Demo over CI/CD',
        title: 'A reliable final demonstration came before a CI/CD pipeline.',
        glyph: 'pipeline',
        chose: 'Rehearsing a **reliable demo**',
        over: 'building a CI/CD pipeline',
        why:
          'A CI/CD pipeline would have run only a few times before the project ended. Every reviewer would see the final demonstration, and we used the remaining time to make sure it worked **reliably**.',
      },
      {
        keyword: 'Depth over breadth',
        title: 'Each of the four failure scenarios recovers from start to finish without help.',
        glyph: 'depth',
        chose: '**Four** failure scenarios, each fully self-healing',
        over: 'more failure types covered shallowly',
        why:
          'Each of the four failure scenarios detects the problem, fixes it, and checks the result without anyone stepping in. Finishing four scenarios completely mattered more than adding more failure types, and auto-scaling and multi-AZ are listed as **next steps**.',
      },
      {
        keyword: 'Injected failures',
        title: '`chaos/inject.sh` creates each failure on command for repeatable testing.',
        glyph: 'inject',
        chose: '`chaos/inject.sh`, triggering failures **on demand**',
        over: 'waiting for something to break on its own',
        why:
          '`chaos/inject.sh` causes each failure on command. It let us test the recovery system as many times as we needed and practice all four scenarios before the demonstration.',
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
      unit: 'Estimated USD / month',
      // The comparison column is the same design with managed services, priced
      // from AWS's own price list files for ap-northeast-2 (checked October
      // 2026) over a 730-hour month: NAT Gateway $0.059/h, t3.micro $0.013/h,
      // RDS db.t3.micro PostgreSQL $0.028/h plus 20 GB at $0.131/GB-month, ALB
      // $0.0225/h, public IPv4 $0.005/h, EBS gp3 $0.0912/GB-month. Usage-based
      // charges (data processing, LCUs, transfer) are left out. Every server
      // ran on t3.micro (`var.instance_type`, confirmed by Junhan; its value is
      // not in the repo). Root volumes are assumed to be 8 GB, the AMI
      // default, since the Terraform sets no size. Monitoring stays self-hosted on both sides —
      // managed monitoring bills by usage and has no honest flat figure.
      // The project's own column is $0: it ran on AWS Free Plan credits.
      series: [
        { id: 'typical', label: 'Same design with managed services' },
        { id: 'actual', label: 'This project (AWS Free Plan)' },
      ],
      items: [
        {
          label: 'Outbound routing',
          note: 'managed NAT Gateway, 730 hours',
          typical: 43.07,
          actual: 0.0,
        },
        {
          label: 'Compute',
          note: '3 \u00d7 t3.micro: mgmt, web1, web2',
          typical: 28.47,
          actual: 0.0,
        },
        {
          label: 'Database',
          note: 'RDS db.t3.micro with 20 GB storage',
          typical: 23.06,
          actual: 0.0,
        },
        {
          label: 'Public IPv4',
          note: '5 addresses at $0.005 per hour',
          typical: 18.25,
          actual: 0.0,
        },
        {
          label: 'Load balancer',
          note: 'Application Load Balancer, 730 hours',
          typical: 16.43,
          actual: 0.0,
        },
        {
          label: 'Storage',
          note: 'EBS gp3, 3 \u00d7 8 GB root volumes',
          typical: 2.19,
          actual: 0.0,
        },
      ],
      total: { typical: 131.47, actual: 0.0 },
      totalNote: 'Estimated from AWS on-demand prices for Seoul (`ap-northeast-2`) as of October\u00a02026.',
      notes: [
        "The **NAT instance** made the biggest difference. AWS's managed NAT Gateway charges for every hour it runs, and a `t3.micro` NAT instance handled this project's outbound traffic for a fraction of that cost.",
        'PostgreSQL and the monitoring stack ran on servers the project already had, which removed **two managed services** from the bill. The trade-off is real: there are no automated backups or failover, and the team handled patching.',
        "The project ran on the **AWS Free Plan**, which gives new accounts credits for their first six months. All of the project's usage stayed within those credits, and the final bill was **$0**.",
        'The comparison column shows what the same design would cost with managed services at on-demand prices. Anyone rebuilding this design outside the Free Plan would pay on-demand prices for the same servers, which is still well below that column.',
      ],
      caveat:
        "The comparison column is an estimate for illustration and does not reflect a real bill. Prices assume a 730-hour month before data-processing and traffic charges, and the [AWS Pricing Calculator](https://calculator.aws/) gives current rates. The project's own costs were covered by AWS Free Plan credits.",
    },
    links: {
      github: 'https://github.com/EchoChallengers/project1-aws',
      notion: 'https://app.notion.com/p/Echo-Challenger-3499e3e335cc80c8bea6f4aae0c9c3bd',
      presentation:
        'https://docs.google.com/presentation/d/1yW_hFAQn3GWZqACOejwITO8O59hOU7eMKi8izpSkySs/edit',
      // Rendered as the link under the Terraform Code viewer rather than as a
      // resource tile. TODO: assumes the default branch is `main`.
      terraform: 'https://github.com/EchoChallengers/project1-aws/tree/main/terraform',
    },
    reflection: {
      learned:
        "This project taught me lessons about both systems and teamwork. On the technical side, designing for **idempotency** from the first Terraform file made every redeploy safe to repeat, and a single flag in `pkill` decided whether a recovery script worked. Some problems, such as the Linux **OOM killer** on the 1 GB `t3.micro` instances, appear only when testing on real AWS. On the team side, I learned that having a working environment ready early lets the rest of the team start on their own tasks sooner. I am still new to learning about **cost optimization**, and estimating this project's design showed me that cloud infrastructure decisions are also budget decisions. I learned that every infrastructure choice has a price.",
      differently:
        'With limited time, the team chose a stable demo over a **CI/CD pipeline**. Next, I would finish Grafana auto-provisioning, add GitHub Actions for CI/CD with **automatic secret scanning**, and automate HTTPS renewal. I would also add **scheduled PostgreSQL backups**, since the self-hosted database has none today. After that, I would move the services into containers with ECR and ECS, add auto-scaling and multi-AZ high availability, and eventually run them on EKS.',
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
    // The three answers a reader who never scrolls should still come away with.
    //
    // Hyphenated words are written with U+2011, the non-breaking hyphen, so a
    // justified line never splits "on-prem" or "real-world" at the hyphen.
    // It renders exactly like "-".
    glance: {
      why: 'In this project, our team wanted to practice running cloud infrastructure for a service with real‑world demands. We chose a financial service platform because it is a high‑stakes environment where downtime is costly. We built a demo banking app called LockBank on AWS, connected it to our on‑premise server, and designed the infrastructure to deploy, monitor, recover, and secure the app.',
      // `rail` is the Build, Ship, Run accordion. Each phase shows its
      // one-line summary closed and its detail open. A phase's detail is
      // either `split` (AWS and on-premise columns joined by Tailscale) or
      // `pair` (two entries side by side). `soft` marks an entry that reports
      // without blocking. Every claim traces to the source repository:
      // infra/terraform, infra/ansible, the Makefile, .github/workflows,
      // docker/nginx, docker/fail2ban and monitoring/recovery.
      how: {
        rail: {
          link: 'Tailscale',
          hops: ['on push to dev or main', 'after each deploy'],
          phases: [
            {
              key: 'Build',
              tools: 'Terraform + Ansible',
              summary:
                'Terraform and Ansible build the AWS network, servers, and database, then join them to the on‑prem server.',
              split: {
                aws: [
                  { name: 'Two‑AZ VPC', text: 'Public, app, and database subnets are spread across two availability zones.' },
                  { name: 'ALB + Auto Scaling', text: 'A load balancer spreads traffic across one to three app servers.' },
                  { name: 'PostgreSQL main', text: 'Ansible deploys the primary database on a private AWS server.' },
                  // Each teammate ran their own copy of the stack, so state
                  // was a personal S3 bucket and lock table (README, "개인별
                  // S3 backend"), not one shared state.
                  { name: 'S3 + DynamoDB', text: 'Each teammate keeps a separate, locked copy of the Terraform state.' },
                ],
                onPrem: [
                  { name: 'make full‑service', text: 'One command builds the AWS stack, the database, and monitoring.' },
                  { name: 'Tailscale node', text: 'The on‑premise server joins the AWS VPC over an encrypted tunnel.' },
                  { name: 'PostgreSQL replica', text: 'A replica keeps a copy of the AWS database on this server.' },
                ],
              },
            },
            {
              key: 'Ship',
              tools: 'GitHub Actions',
              summary: 'Every push is scanned before the image ships, and every deploy is scanned live.',
              pair: [
                { name: 'Bandit + Trivy', text: 'Both scan the code and the image. A failed scan stops the push.' },
                // `fail_action: false` in deploy.yml: ZAP reports, it does
                // not block.
                {
                  name: 'OWASP ZAP',
                  text: 'After each deploy, ZAP scans the live site and files its findings as a GitHub issue.',
                  soft: true,
                },
              ],
            },
            {
              key: 'Run',
              tools: 'AWS + on‑prem',
              summary: 'The app and its defenses run on AWS while monitoring and recovery run on‑prem.',
              split: {
                aws: [
                  { name: 'LockBank app', text: 'The FastAPI banking app runs in containers behind the load balancer.' },
                  {
                    name: 'Nginx + fail2ban',
                    text: 'Nginx limits request rates, and fail2ban bans IPs that keep failing or flooding.',
                  },
                ],
                onPrem: [
                  { name: 'Prometheus + Loki', text: 'Both collect metrics and logs from AWS over the tunnel.' },
                  {
                    name: 'Recovery Controller',
                    text: 'When the app goes down, it restarts the container on AWS and checks it again.',
                  },
                ],
              },
            },
          ],
        },
      },
      // Two figures side by side. `lock` draws a padlock with one bar per
      // security layer (the deck's 4중 잠금, slides 28 and 56); `ring` draws
      // a ring with one segment per stack layer verified live (slide 56).
      result: {
        lock: {
          value: '4 layers',
          label: 'independent security layers',
          layers: [
            { name: 'code', tool: 'Bandit' },
            { name: 'image', tool: 'Trivy' },
            { name: 'site', tool: 'ZAP', soft: true },
            { name: 'traffic', tool: 'Nginx, fail2ban' },
          ],
        },
        ring: {
          value: '6 of 6',
          label: 'stack layers verified live',
          layers: [
            { key: 'L1', name: 'infrastructure' },
            { key: 'L2', name: 'network' },
            { key: 'L3', name: 'app' },
            { key: 'L4', name: 'database' },
            { key: 'L5', name: 'security path' },
            { key: 'L6', name: 'monitoring' },
          ],
        },
      },
    },
    // The workspace as four cards beside At a Glance: GitHub across the top,
    // Notion and Network side by side, Presentation across the bottom. Each
    // card ends in a link. `link` names a key in `links` below.
    //
    // The GitHub figures come from the repository's merged pull requests:
    // 38 merged in total, 11 authored and 12 reviewed by ShinJunhan. Of the
    // four merges into main, Junhan approved and merged the release (#62,
    // 190 commits from dev); the other three were early CI/CD chores, which
    // is why the main lane names the release and not every merge.
    workspaceCards: {
      github: {
        title: 'GitHub',
        subtitle: 'Three-tier branch flow, every merge reviewed',
        lanes: [
          {
            branch: 'main',
            who: 'Junhan Shin, Team Lead',
            text: 'Approved and merged the final dev → main release.',
            mine: true,
          },
          { branch: 'dev', who: 'CI/CD Lead', text: 'Integrates every track into dev.' },
          { branch: 'feature/a–e', who: 'Every track', text: 'Works on track-prefixed branches.' },
        ],
        stats: [
          { value: '38', label: 'merged PRs' },
          { value: '11', label: 'authored by me' },
          { value: '12', label: 'reviewed by me' },
        ],
        foot: 'Lock-N-Lock / project2-security',
        link: 'github',
        linkLabel: 'Open in GitHub',
      },
      // Counts from the team Notion workspace: the daily activity calendar
      // runs Sprint 01 to 20, the member section has five workspaces, and the
      // design section holds four architecture diagrams.
      notion: {
        title: 'Notion',
        subtitle: 'Team workspace',
        figure: { value: '20', label: 'sprints' },
        rows: [
          { label: 'Project summary', href: 'https://app.notion.com/p/Lock-Lock-36d19ea7e5d880f7a507fb9c1ca5c952' },
          { label: 'Meeting notes', href: 'https://app.notion.com/p/Lock-Lock-36d19ea7e5d880c7b8bbcb9b31aabcae' },
          { label: 'Daily sprint log', count: '20' },
          { label: 'Member workspaces', count: '5' },
          { label: 'Design documents', count: '4' },
        ],
        foot: 'Team Notion.',
        link: 'notion',
        linkLabel: 'Open Notion',
      },
      // From Junhan's docs/network-design.md, kept in sync with the .tf files:
      // the request path through three security groups, and the two side
      // doors (the Bastion's SSH and the NAT instance's outbound route).
      network: {
        title: 'Network',
        subtitle: 'My design doc',
        figure: { value: '5', label: 'groups' },
        path: [
          { name: 'Internet', edge: true },
          { name: 'lb-alb-sg', port: ':80/443' },
          { name: 'lb-app-sg', port: ':80' },
          { name: 'lb-db-sg', port: ':5432' },
        ],
        sideDoors: [
          { key: ':22', text: 'Bastion, admin IP only' },
          { key: 'NAT', text: 'Outbound only' },
        ],
        foot: 'network-design.md',
        href: 'https://github.com/Lock-N-Lock/project2-security/blob/main/docs/network-design.md',
        linkLabel: 'View doc',
      },
      // The three slides from Junhan's own track: 22 is the Track A
      // deliverables slide that names him, 19 the hybrid infrastructure, and
      // 11 the Git workflow.
      presentation: {
        title: 'Presentation',
        subtitle: '3 slides from my track',
        figure: { value: '3', label: 'of 72' },
        slides: [
          { number: 22, caption: 'Track A' },
          { number: 19, caption: 'Hybrid' },
          { number: 11, caption: 'Git flow' },
        ].map((slide) => ({
          ...slide,
          src: `${LOCK_N_LOCK_DIAGRAM_DIR}slides/slide-${String(slide.number).padStart(2, '0')}.webp`,
        })),
        foot: 'Final presentation with 72 slides.',
        link: 'presentation',
        linkLabel: 'Open slides',
      },
    },
    // My Role as a bento of duties sized by how much of the project each one
    // was: one lead, two medium and four small tiles in the `mosaic` layout
    // (see `layout` below for how they fill the grid).
    //
    // `label` is the tile's key. Only the lead tile renders it, as the small
    // eyebrow above its sentence; on every other tile it stays hidden and the
    // emphasis lives inside the sentence instead. One or two marks per tile.
    //
    // The sentences lead with the outcome and drop the subject ("Let five
    // people deploy…", "Kept the hybrid link private…"), one sentence a tile.
    //
    // Scoped to Track A. An earlier draft of this section claimed CI/CD &
    // DevSecOps as a second track, which the deck contradicts: its team table
    // and its section header both put Track C under Jongwon Lim. What the deck
    // does put here is the lead role (slide 1's opening line) and final
    // approval on `main` (slide 11), so those are what the lead tile carries.
    // Every other tile traces to slide 22 or slide 23, the two slides that
    // list this track's own deliverables, or to the README where the deck is
    // looser than the code (Remote State).
    role: {
      title: 'Team Lead and Infrastructure Track Owner',
      // The three counts this track is measured by, across the top of the
      // section. They were figures inside the lead tile, which is what made
      // that tile ask to be three rows tall and then sit half empty; the band
      // gives them room, and gives every tile below the same job.
      //
      // `~60` is the deck's own rounded figure (slides 22 and 56). The
      // repository has 67 `resource` blocks across 15 `.tf` files, so the
      // rounding is downward and the unit is Terraform resources rather than
      // AWS resources: what is counted is what the code declares.
      //
      // `3` is the public, app and database tiers in `network.tf`, each with
      // its own subnets and security group (see `network-design.md`). The DB
      // tier has one subnet where the other two have two, so this is not a
      // claim about Availability Zones. It replaced "6 commands, whole
      // lifecycle", which neither the deck nor the README backs, and a
      // make-command count would credit Makefile targets teammates wrote.
      // Units stay short enough to hold one line at a ~720px viewport.
      figures: [
        { value: '~60', unit: 'Terraform resources' },
        { value: '5', unit: 'parallel tracks' },
        { value: '3', unit: 'network tiers' },
      ],
      // `mosaic` — the lead takes four columns of the first row and the smalls
      // back-fill around it. It was 4x3 while it carried the figures; with the
      // counting moved to the band above, nothing needs to be three rows tall.
      layout: 'mosaic',
      tiles: [
        {
          size: 'lead',
          label: 'Team Lead',
          // No figure of its own. The sentence used to end "on a five-person
          // team working five parallel tracks", which the band above counts
          // now, and the team size is already in the page header.
          //
          // Not "every merge": `main` took four merges in total. JW merged #5,
          // #17 and #18; Junhan approved and merged #62, the 190-commit
          // dev → main release. Matches the GitHub card in At a Glance.
          text: 'Signed off on the **final dev → main release** of 190 commits as the team\'s designated approver for `main`.',
        },
        {
          size: 'medium',
          label: 'Infrastructure',
          text: 'Cut managed-service costs with a **NAT instance and Bastion host** inside a multi-AZ VPC and Blue/Green Auto Scaling Group defined in Terraform.',
        },
        // State is per person. Each teammate deploys into their own AWS
        // account with their own bucket and lock table (README "개인별 S3
        // backend"). Slide 22's speaker notes imply one shared state; the code
        // does not. Junhan's part was #25, which moved the hard-coded bucket
        // into a gitignored `hcl/backend.hcl`; `init/` and the workflows'
        // per-actor MY_BUCKET wiring are JW's.
        {
          size: 'medium',
          label: 'Remote State',
          text: 'Let five people deploy without touching each other\'s work by giving everyone **their own S3 state bucket and DynamoDB lock**.',
        },
        // The on-premise node runs `accept-routes=false` and reaches the AWS
        // nodes on their 100.x addresses, so it is linked to those nodes and
        // not joined to the VPC's routes. Worded with short words because the
        // tile is narrow and justified: the earlier "replication and
        // monitoring traffic without a single public port" left two-word
        // lines with gaps near 80px on a laptop. Avoid "every port closed":
        // the ALB's 80 and 443 are public. What is encrypted is the link
        // (WireGuard under Tailscale), not the servers at either end.
        {
          size: 'small',
          label: 'Hybrid Networking',
          text: 'Encrypted the on-premise and AWS link with a **Tailscale L3 tunnel** that allowed database and monitoring traffic to stay off the public internet.',
        },
        {
          size: 'small',
          label: 'Branch Strategy',
          text: 'Protected `main` and `dev` with **branch rules that blocked direct pushes** and required a human approval after a Gemini bot review.',
        },
        {
          size: 'small',
          label: 'Shared Interface',
          text: 'Kept `outputs.tf` as **the single contract** that the other four tracks read for the load balancer address, target groups, security groups, and database IPs.',
        },
        // The seventh, and the half of this track the section never said out
        // loud: the deck's team slide calls the role "Infrastructure and
        // documentation" and lists the project-wide guide as a deliverable.
        // `docs/guides/` holds one file per track, a-infra-terraform through
        // e-security, beside the setup guide and the network design. Every
        // commit to `docs/` is Junhan's; b, c, d and e were drafts for their
        // track owners to review.
        {
          size: 'small',
          label: 'Documentation',
          text: 'Got every teammate building from **one set of instructions** with a setup guide, a network design, and a guide for each track.',
        },
      ],
    },
    // An idea board rather than a paragraph, with the same six notes and
    // layout as EchoChallengers: two leads across the top, four supports under them.
    // Goals takes the second lead slot because it is the longest note; in a
    // narrow support slot it ran to thirteen lines and towered over the row.
    // Its last sentence is trimmed to hold five lines on a desktop, where the
    // column runs 459 to 494px wide; the longer wording needed about 520px.
    // Two or three sentences a note in "we" voice. Marks go on keywords only, one list
    // item at a time, never on "and" or the commas between them.
    //
    // Sources: slide 4 (the three incidents and the goal), slide 70 (401 →
    // 429 → fail2ban), slide 10 (four weeks), slide 69 (applicability). The
    // older board's Hybrid note put the main DB in two AZs; the DB tier is
    // one subnet in one AZ, which is why no note here claims it.
    context: {
      notes: [
        {
          size: 'lead',
          label: 'Business Problem',
          text: 'The three most common incidents that hurt a financial service are **stolen logins**, **API floods**, and **crashed containers**. Each one costs money, customer trust, and regulatory standing the moment a defense fails.',
        },
        {
          size: 'lead',
          label: 'Goals',
          text: 'We set three goals: **block the attack**, **heal the failure**, and **prove both under load**. Locust would supply the load, and Grafana would keep the score. A **Recovery Controller** would catch a failed container in **Prometheus**, check a **YAML-defined policy**, restart it, re-verify its health, and report to **Telegram**.',
        },
        {
          size: 'support',
          label: 'Personal Foundation',
          text: 'Five people had **four weeks** to build the platform, and each of us owned one track. We wanted to prove that classroom security skills could hold up against **real attack traffic**.',
        },
        {
          size: 'support',
          label: 'Core Design Values',
          // The board's one lede: the pun is the line worth reading first,
          // and a larger opening breaks the run of four same-sized cards.
          lede: 'We called our defense the **4-layer lock** after our team, Lock & Lock.',
          text: 'A flaw has to get past code analysis, image scanning, dynamic testing, and runtime blocking before it reaches a user.',
        },
        {
          size: 'support',
          label: 'What We Built',
          text: 'We built a demo financial service that **defends itself** against all three incidents. A brute-force login should earn a **401**, then a **429**, then a **fail2ban** ban, with no human in the loop. Each response runs on its own and reports to **Telegram** when it finishes.',
        },
        {
          size: 'support',
          label: 'Applicability',
          text: 'The same pattern can fit any fintech team that cannot afford an **account takeover**. It can also fit companies that keep some servers **in-house** and run the rest in the **cloud**.',
        },
      ],
    },
    // `size` drives the bento layout. On the 5-column grid these six tile it
    // exactly: row 1 is the big tile (2 wide) plus three squares, row 2 is the
    // big tile's second row plus the wide tile (2) and the last square.
    //
    // The big tile is the four-layer lock because that is the project's whole
    // thesis, not because four is the largest number here. Labels and hints are
    // kept short, as on EchoChallengers. "6 Cases Resolved" is deck slide 60's
    // six troubleshooting cases; it replaced "6 Layers Verified E2E", which At
    // a Glance already shows. 23.24s is one timed run from the recovery log,
    // and the hint says so.
    metricsStyle: 'hero',
    metrics: [
      {
        size: 'big',
        value: '4',
        label: 'Security Layers',
        detail: 'SAST, image scan, DAST, and runtime blocking',
      },
      {
        size: 'square',
        value: '~60',
        label: 'Terraform Resources',
        hint: 'Defined in code and provisioned automatically',
      },
      {
        size: 'square',
        value: '19',
        label: 'Running Containers',
        hint: 'App (4), database (4), and monitoring and security (11)',
      },
      {
        size: 'square',
        value: '6',
        label: 'Cases Resolved',
        hint: 'Troubleshooting cases found and fixed during testing',
      },
      {
        size: 'wide',
        value: '5',
        label: 'Live Demo Scenarios',
        detail: 'from normal traffic to a blocked deploy',
      },
      {
        size: 'square',
        value: '23.24s',
        label: 'Measured Recovery',
        hint: 'One timed run, within the 5-minute recovery target',
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
    //
    // Written in EchoChallengers' "We chose X because…" voice, Terraform
    // aside, with "I" where the call was Junhan's (Tailscale, his hybrid
    // track) and "I supported" where it was another track's (monitoring is
    // Track D, Jiyun Lee's). Locust credits the security track (E) with the
    // pick and Junhan with the rule that every defense be attack-tested. The earlier Terraform note said two people running `apply` at
    // once queued behind one shared DynamoDB lock; state was per person, each
    // in their own AWS account. 15 files: 13 in infra/terraform, 2 in init/.
    stackNotes: [
      {
        tool: 'Why Terraform?',
        icon: 'Terraform',
        text: '**Terraform** let five people apply, destroy, and rebuild the same **~60-resource** environment from 15 Terraform files.',
      },
      {
        tool: 'Why Tailscale?',
        icon: 'Tailscale',
        text: 'I chose **Tailscale** after using it in my first project to join two networks without a public port. This time, it carried database replication and monitoring between the on-premise server and AWS over an **encrypted tunnel**.',
      },
      {
        tool: 'Why Prometheus, Grafana, and Loki?',
        icon: 'Prometheus',
        text: 'As team lead, I supported the monitoring track\'s pick of **Prometheus** and **Grafana** because both tools are open source and all my team members had hands-on practice with them in class labs. I also backed adding **Loki**, which puts the Nginx access log beside the metrics and traces a 401 spike back to its requests.',
      },
      {
        tool: 'Why Locust?',
        icon: 'Locust',
        text: 'I set the rule that every defense had to be tested with real attack traffic, and the security track chose **Locust** to run those tests. Three Locust scripts simulate normal users, **brute-force logins**, and **API flooding** on demand.',
      },
      {
        tool: 'Why Telegram?',
        icon: 'Telegram',
        text: 'Our team decided on **Telegram** because its bot API sends an alert to a phone at no cost. Two paths end there, one from **Alertmanager** and one from **CloudWatch** through SNS and Lambda. Alerts arrive from Alertmanager for anything Prometheus sees and from CloudWatch for anything that happens to the instances.',
      },
    ],
    // Drawn from this description rather than pasted in as an export \u2014 see
    // components/sections/ArchDiagram.jsx. Checked against the original
    // draw.io export, which is the last tab in this list: the subnet CIDRs,
    // the auto scaling group, the internet gateway, CloudWatch, the S3 backup
    // path with its Lambda and SNS, and the on-premises replica all come from
    // it, and the NAT is an EC2 instance rather than a managed gateway.
    //
    // Checked against the code as well, which corrected the export in two
    // places. Blue and green are two Auto Scaling Groups that both span both
    // app subnets (compute.tf), and green sits at desired_capacity 0; they are
    // not one AZ each. The alert path is CloudWatch alarms → the lb-alerts SNS
    // topic → the cloudwatch-telegram-notifier Lambda → Telegram; nothing in
    // the repository fires a Lambda from S3. The three on-premise boxes are
    // containers on the one proj-mgmt host (README, Makefile), and the
    // monitoring compose file confirms Prometheus and Grafana.
    architecture: [
      {
        alt: 'AWS and an on-premise host joined over Tailscale: Route 53 and an ACM-terminated HTTPS listener on the load balancer, blue and green Auto Scaling Groups across the 10.0.11.0/24 and 10.0.12.0/24 private subnets with green on standby at zero instances, a bastion and a NAT instance in the 10.0.1.0/24 public subnet, a PostgreSQL host in the 10.0.21.0/24 private subnet backing up to S3 nightly, CloudWatch alarms sent through SNS and Lambda to Telegram, and the proj-mgmt host running monitoring and the database replica over Tailscale',
        // "Security architecture" undersold it: the drawing is the whole
        // system \u2014 network, compute, data, backups and the on-premises side \u2014
        // and security is the lens the project looks at it through, not the
        // subset it draws. "Overall architecture" is what hailcast already
        // calls the same view of itself, and it leaves "System Overview" free
        // for the export tab that carries that name inside its own file.
        tab: 'Overall architecture',
        address: 'lock-n-lock/architecture/01-overall-architecture',
        caption: 'AWS blue/green deployment with an on-premise host over Tailscale',
        diagram: {
          width: 1000,
          height: 760,
          zones: [
            { id: 'aws', label: 'AWS \u00b7 ap-northeast-2', x: 150, y: 20, w: 836, h: 500, tone: 'cloud' },
            { id: 'vpc', label: 'VPC', note: '10.0.0.0/16', x: 176, y: 130, w: 520, h: 372, tone: 'region' },
            { id: 'public', label: 'Public subnet', note: '10.0.1.0/24', x: 196, y: 192, w: 480, h: 92, tone: 'region' },
            { id: 'asg', label: 'Auto Scaling group \u00b7 blue / green', x: 196, y: 296, w: 480, h: 100, tone: 'focus' },
            { id: 'dbsub', label: 'Private subnet', note: '10.0.21.0/24', x: 196, y: 402, w: 480, h: 88, tone: 'region' },
            { id: 'onprem', label: 'On-premise \u00b7 one proj-mgmt host over Tailscale', x: 150, y: 552, w: 836, h: 186, tone: 'onprem' },
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
            { id: 'blue', label: 'App: blue', sub: 'live \u00b7 both app subnets', glyph: 'container', x: 310, y: 352, w: 210, h: 58 },
            { id: 'green', label: 'App: green', sub: 'standby \u00b7 0 instances', glyph: 'container', x: 550, y: 352, w: 210, h: 58 },
            { id: 'db', label: 'PostgreSQL', sub: 'EC2', glyph: 'database', x: 430, y: 456, w: 190, h: 50 },
            { id: 'cw', label: 'CloudWatch', sub: 'alarms drive the ASG', glyph: 'monitor', x: 850, y: 248, w: 190, h: 54 },
            { id: 'lambda', label: 'Lambda', sub: 'to Telegram', glyph: 'service', x: 777, y: 352, w: 134, h: 54 },
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
            // CloudWatch alarms → SNS → Lambda, which posts to Telegram. Down
            // the right-hand column from CloudWatch, then back left into the
            // Lambda that subscribes to the topic.
            { from: 'cw', to: 'sns', label: 'alarms', dash: true },
            { from: 'sns', to: 'lambda', dash: true },
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
    // Two trees behind one toggle. The whole repository answers "what did the
    // team build"; the Track A view answers "which of it was mine", and a
    // 190-line tree buries that answer rather than giving it.
    //
    // The full tree is generated from the repository as delivered, `.gitkeep`
    // placeholders and all — they are load-bearing in `docs/diagrams/`, where
    // the placeholder is the only entry. Nothing is filtered out, and nothing
    // needs to be: every file holding a real credential exists here only as an
    // `.example`.
    folderStructure: [
      {
        id: 'mine',
        label: 'My track',
        root: 'project2-security/infra/',
        // Same path style as the diagram tabs, without their numbers.
        address: 'lock-n-lock/folder-structure/my-track',
        tree: `
project2-security/
├── setup.sh                      # Rocky 8 toolchain: AWS CLI v2, Terraform, Ansible, Docker
├── check.sh                      # preflight: credentials, Docker, Tailscale reachability
├── bootstrap_tailscale.sh        # joins proj-mgmt and advertises 172.16.1.0/24
├── Makefile                      # init/plan/apply · deploy-db · build-push · service · destroy
└── infra/terraform/
    ├── provider.tf               # aws · tls · local · cloudflare · tailscale + S3 backend
    ├── variables.tf              # instance types, CIDRs, DB credentials, ASG sizing, DNS toggle
    ├── network.tf                # VPC · multi-AZ subnets (public/app/db) · route tables · IGW
    ├── security_groups.tf        # five groups: alb, app, db, bastion, nat
    ├── compute.tf                # NAT instance · Bastion · App ASG (blue/green) · DB EC2
    ├── user_data_app.sh          # ASG boot: pull image, run, join the tailnet
    ├── alb.tf                    # ALB + blue/green target groups + /health listener
    ├── tailscale.tf              # auth keys, Bastion subnet-route approval, DB node
    ├── dns.tf                    # Route 53 / Cloudflare / none
    ├── iam.tf                    # DB → S3 backup, Grafana → CloudWatch read
    ├── cloudwatch.tf             # ALB · ASG · target-group alarms + SNS topic
    ├── storage.tf                # S3: pg_dump backups and log retention
    ├── outputs.tf                # the interface: ALB DNS · TG ARNs · SG IDs · DB IP · bucket
    ├── ansible.tf                # writes the Ansible inventory after apply
    ├── .terraform.lock.hcl       # provider versions pinned, so five machines agree
    └── init/                     # run once, before everything else
        ├── S3_bucket.tf          # remote state
        └── Dynamodb.tf           # state lock
`,
      },
      {
        id: 'all',
        label: 'Whole repository',
        root: 'project2-security/',
        address: 'lock-n-lock/folder-structure/whole-repository',
        tree: `
project2-security/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug.md
│   │   ├── chore.md
│   │   ├── feature.md
│   │   └── refactor.md
│   ├── workflows/
│   │   ├── deploy.yml
│   │   ├── destroy.yml
│   │   └── plan.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── docker/
│   ├── app/
│   │   ├── templates/
│   │   │   ├── dashboard.html
│   │   │   ├── login.html
│   │   │   └── transfer.html
│   │   ├── Dockerfile
│   │   ├── main.py
│   │   └── requirements.txt
│   ├── bootstrap/
│   │   └── Dockerfile
│   ├── fail2ban/
│   │   ├── filters.d/
│   │   │   ├── nginx-login.conf
│   │   │   ├── nginx-rate-limit.conf
│   │   │   └── nginx-scan.conf
│   │   ├── Dockerfile
│   │   ├── jail.local
│   │   ├── memo.txt
│   │   └── telegram-alert.sh
│   ├── nginx/
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── log-format.conf
│   │   ├── nginx.conf
│   │   └── rate-limit.conf
│   └── promtail/
│       └── promtail-config.yaml
├── docs/
│   ├── diagrams/
│   │   └── .gitkeep
│   ├── guides/
│   │   ├── _TEMPLATE.md
│   │   ├── a-infra-terraform.md
│   │   ├── b-app.md
│   │   ├── c-cicd.md
│   │   ├── d-monitoring.md
│   │   ├── e-security.md
│   │   └── setup-guide.md
│   └── network-design.md
├── infra/
│   ├── ansible/
│   │   ├── group_vars/
│   │   │   ├── app.yml.example
│   │   │   └── database.yml.example
│   │   ├── tasks/
│   │   │   ├── setup_docker.yml
│   │   │   └── setup_user1.yml
│   │   ├── templates/
│   │   │   └── docker-compose.db.yml.j2
│   │   ├── .gitkeep
│   │   ├── bootstrap.yml
│   │   ├── db-destroy.yml
│   │   ├── db-site.yml
│   │   ├── deploy-monitoring.yml
│   │   ├── docker-compose-postgres-main.yaml
│   │   ├── docker-compose-postgres-replica.yaml.j2
│   │   ├── init-replication.sh
│   │   ├── init.sql
│   │   ├── lb-postgres-main.yml
│   │   ├── lb-postgres-replica.yml
│   │   └── site.yml
│   └── terraform/
│       ├── hcl/
│       │   └── backend.hcl.example
│       ├── init/
│       │   ├── .terraform.lock.hcl
│       │   ├── Dynamodb.tf
│       │   └── S3_bucket.tf
│       ├── .gitkeep
│       ├── .terraform.lock.hcl
│       ├── alb.tf
│       ├── ansible.tf
│       ├── cloudwatch.tf
│       ├── compute.tf
│       ├── dns.tf
│       ├── iam.tf
│       ├── network.tf
│       ├── outputs.tf
│       ├── provider.tf
│       ├── security_groups.tf
│       ├── storage.tf
│       ├── tailscale.tf
│       ├── terraform.tfvars.example
│       ├── user_data_app.sh
│       └── variables.tf
├── monitoring/
│   ├── alertmanager/
│   │   └── alertmanager.yaml
│   ├── grafana/
│   │   ├── dashboards/
│   │   │   ├── lockbank-security-operations-dashboard.json
│   │   │   └── lockbank-security-operations-dashboard.json.template
│   │   └── provisioning/
│   │       ├── dashboards/
│   │       │   └── dashboard.yaml
│   │       └── datasources/
│   │           ├── cloudwatch.yaml
│   │           ├── datasource.yaml
│   │           └── loki.yaml
│   ├── lambda/
│   │   └── cloudwatch-telegram-notifier/
│   │       ├── deploy_cloudwatch_telegram_lambda.sh
│   │       ├── lambda_function.py
│   │       └── teardown_cloudwatch_telegram_lambda.sh
│   ├── loki/
│   │   └── loki-config.yaml
│   ├── nginx/
│   │   └── default.conf
│   ├── prometheus/
│   │   ├── rules/
│   │   │   └── alert_rules.yaml
│   │   └── prometheus.yaml
│   ├── promtail/
│   │   └── promtail-config.yaml
│   ├── recovery/
│   │   ├── actions/
│   │   │   ├── aws_app_restart.sh
│   │   │   ├── docker_restart.sh
│   │   │   └── runner.py
│   │   ├── config/
│   │   │   └── recovery_map.yaml
│   │   ├── logs/
│   │   │   ├── .gitkeep
│   │   │   └── README.md
│   │   ├── policy/
│   │   │   └── loader.py
│   │   ├── utils/
│   │   │   └── logger.py
│   │   ├── verify/
│   │   │   └── http.py
│   │   ├── .dockerignore
│   │   ├── Dockerfile
│   │   ├── main.py
│   │   └── requirements.txt
│   ├── scripts/
│   │   ├── nginx_log_metrics.sh
│   │   ├── security_event_timeline.sh
│   │   └── setup_aws_nginx_log_backup.sh
│   ├── security-center/
│   │   ├── index.html
│   │   └── index.html.template
│   ├── tailscale-sd/
│   │   ├── Dockerfile
│   │   └── tailscale_sd.py
│   ├── telegram-notifier/
│   │   ├── Dockerfile
│   │   ├── main.py
│   │   └── requirements.txt
│   ├── .env.example
│   ├── .gitignore
│   ├── .gitkeep
│   ├── Makefile
│   ├── bootstrap_monitoring.sh
│   └── docker-compose.monitoring.yaml
├── scripts/
│   ├── .gitkeep
│   ├── build-push-image.sh
│   ├── deploy-app.sh
│   └── set-fail2ban.sh
├── security/
│   ├── locust/
│   │   ├── flood_attack.py
│   │   ├── login_attack.py
│   │   └── normal_user.py
│   ├── policies/
│   │   ├── incident-response.md
│   │   ├── rate-limit-policy.md
│   │   └── test-checklist.md
│   ├── scripts/
│   │   ├── README.md
│   │   ├── check-nginx-log.sh
│   │   └── test-rate-limit.sh
│   ├── .gitkeep
│   └── EXPLAIN.md
├── .gitignore
├── Makefile
├── README.md
├── bootstrap_tailscale.sh
├── check.sh
└── setup.sh
`,
      },
    ],
    // The calendar pair and the phase list both read from here. Straight from
    // the deck's schedule slide \u2014 including that week three runs eight days
    // (6/10\u20136/17) where the other three run seven, which is what the slide
    // says rather than something smoothed over here.
    //
    // Each phase pairs the team's work ("We…") with Junhan's ("I…"), as
    // EchoChallengers does. Every "I" sentence is backed by his commits inside
    // that phase's dates: the scaffold and setup scripts (5/30\u20136/1), the
    // Terraform, the VXLAN-to-Tailscale switch and PR #25 (6/3\u20136/7), the NAT
    // egress and DB tailnet fixes (6/10), and the teardown hardening, the
    // guides and PR #62 (6/22\u20136/24).
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
          text: 'We picked a financial service as our topic, defined **three incident scenarios**, and split the work into five tracks. I set up the shared repository and wrote the setup scripts and Tailscale bootstrap that gave every teammate the same starting environment.',
        },
        {
          id: 'build',
          title: 'Infrastructure, App & DB',
          range: 'Jun 3\u20139',
          from: '2026-06-03',
          to: '2026-06-09',
          text: 'We incorporated mentor feedback, set up the CI/CD workflow, and built the FastAPI app with its PostgreSQL pair. I wrote the **Terraform** for the AWS infrastructure, replaced the VXLAN overlay with node-to-node Tailscale, and gave each teammate their own remote state.',
        },
        {
          id: 'secure',
          title: 'Monitoring & Security Scenarios',
          range: 'Jun 10\u201317',
          from: '2026-06-10',
          to: '2026-06-17',
          text: 'We built the monitoring stack and the security scenarios on top of the running app, which made detection, blocking, and automated recovery demonstrable. I fixed the NAT egress and the database\u2019s Tailscale join that the monitoring depended on.',
        },
        {
          id: 'verify',
          title: 'Verification & Delivery',
          range: 'Jun 18\u201324',
          from: '2026-06-18',
          to: '2026-06-24',
          text: 'We reviewed the final code, ran the demo flow end to end, recorded the demo, and wrote the report. I hardened `make destroy`, wrote the guide for each track, and approved the **final dev \u2192 main release**.',
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
    // Checked against the screenshots: Trivy reports HIGH 3, CRITICAL 0 (an
    // earlier lead said CRITICAL); the Locust table's 111 failures include one
    // failed login, so the tag counts the 110 refused transfers; and 23.24s is
    // the controller's detect-to-verified duration, not time since the kill.
    media: {
      // Cut from the team's demo recording, which is 1866kbps at 960x540 and
      // displays at 0.90x in this column, so these clips sit close to their
      // native pixels. That recording carries the team's own Korean captions
      // burned in; they are left alone for the same reason the Korean
      // dashboards are, and `clipNote` says whose they are.
      //
      // The stills are the same runs rather than a separate session: the
      // container capture and the clip both report 23.24s. They are kept
      // because they are full-resolution frames of moments the clip passes
      // through, and because scenarios 1 to 3 have only one each.
      clipNote:
        "Cut from the team's demo recording. The Korean captions are the team's own. Silent, and it loops.",
      stillsNote:
        'Full-resolution captures of the same scenarios. Click one to open it at full size.',
      scenarios: [
        {
          id: 'normal',
          tab: 'Normal operation',
          label: 'Scenario 1: Normal operation',
          lead:
            'A user signs in to **LockBank** and submits a transfer. Every Security Center panel reads green and no alerts are active.',
          clip: {
            src: '/projects/lock-n-lock/clip-01-normal.mp4',
            width: 960,
            height: 540,
            poster: '/projects/lock-n-lock/clip-01-normal.jpg',
            alt: 'The LockBank login page, a successful sign-in, and a transfer submitted against a healthy service',
          },
          before: {
            src: '/projects/lock-n-lock/normal-operation-console.png',
            state: 'Zero alerts at baseline',
            alt: 'The Security Center console on its Normal Operation tab: App Health UP, DB Status UP, zero active alerts, ALB target health HEALTHY, one ASG instance, and CPU and network charts tracking a quiet service',
          },
        },
        {
          id: 'login-bruteforce',
          tab: 'Login brute-force',
          label: 'Scenario 2: Credential brute-force',
          lead:
            'Locust runs a credential brute-force against `/login`. Each failure logs a **401**, the alert fires once the rate crosses its threshold, and **Fail2Ban** bans the source IP.',
          clip: {
            src: '/projects/lock-n-lock/clip-02-login.mp4',
            width: 960,
            height: 540,
            poster: '/projects/lock-n-lock/clip-02-login.jpg',
            speed: '3x',
            alt: 'A Locust brute-force run driving the login failure count up, the dashboard alert turning active, and Fail2Ban reporting the attacking IP banned',
          },
          before: {
            src: '/projects/lock-n-lock/login-bruteforce-401-log.png',
            state: '401 per failed login',
            alt: 'Application logs during a Locust brute-force run: repeated SECURITY LOGIN_FAILURE warnings naming the source IP and attempted username, each paired with a POST /login returning 401 Unauthorized, interleaved with health checks still returning 200',
          },
        },
        {
          id: 'api-flood',
          tab: 'API flooding',
          label: 'Scenario 3: API request flooding',
          lead:
            'A flood of transfer requests hits the API. Nginx refuses them at the rate limit with **429**, the blocked-IP count climbs, and the alert clears once the policy has absorbed the attack.',
          clip: {
            src: '/projects/lock-n-lock/clip-03-flood.mp4',
            width: 960,
            height: 540,
            poster: '/projects/lock-n-lock/clip-03-flood.jpg',
            speed: '3x',
            alt: 'A transfer flood driving the HTTP 429 count up on the API Flooding dashboard, the blocked IP count rising to two, and the active alert returning to zero',
          },
          before: {
            src: '/projects/lock-n-lock/api-flood-locust.png',
            state: '110 of 110 transfers refused',
            alt: 'The Locust statistics table mid-run: 112 aggregated requests against 111 failures, a 99% failure rate reported in the header, with the GET /transfer row showing 108 requests and 108 failures as the rate limit refuses them',
          },
        },
        {
          id: 'container-recovery',
          tab: 'Container failure',
          label: 'Scenario 4: Container failure and self-healing',
          lead:
            'The application container is force-stopped. The health check fails, the recovery runs without anyone touching it, and the service is verified healthy **23.24s** after the failure is detected.',
          clip: {
            src: '/projects/lock-n-lock/clip-04-container.mp4',
            width: 960,
            height: 540,
            poster: '/projects/lock-n-lock/clip-04-container.jpg',
            speed: '2.5x',
            alt: 'The Container Recovery dashboard moving from one recovery attempt to two at a 100 percent success rate, with the recovery log reporting verify success for BankAppDown in 23.24 seconds',
          },
          before: {
            src: '/projects/lock-n-lock/container-failure-before.png',
            state: 'Healthy before the kill',
            alt: 'The Security Center console before the container is killed, showing the service healthy on its Normal Operation tab',
          },
          after: {
            src: '/projects/lock-n-lock/container-recovery-after.png',
            state: 'Recovered in 23.24 seconds',
            alt: 'The console on its Container Recovery tab after the failure: App Health back to UP, two recovery attempts, a 100% recovery success rate, and a recovery log reading verify success for BankAppDown at 23.24 seconds on the first attempt, above a critical log entry showing the failed health check that triggered it',
          },
        },
        {
          id: 'secure-deploy',
          tab: 'Secure deploy',
          label: 'Scenario 5: The security gate on a deploy',
          lead:
            '**Trivy** finds three **HIGH** vulnerabilities in the image, and the job ends on `exit code 1` before the deploy can run. The same pipeline passes only once the dependency is fixed.',
          clip: {
            src: '/projects/lock-n-lock/clip-05-deploy.mp4',
            width: 960,
            height: 540,
            poster: '/projects/lock-n-lock/clip-05-deploy.jpg',
            alt: 'The Trivy scan step failing the GitHub Actions job with exit code 1, then the same steps completing with green checks after the dependency is updated',
          },
          before: {
            src: '/projects/lock-n-lock/secure-deploy-bandit-sast.png',
            state: 'B310 findings flagged',
            alt: 'Bandit output in the pipeline listing B310 blacklist findings at medium severity and high confidence, each mapped to CWE-22 and pinned to a file and line number in the application source',
          },
          after: {
            src: '/projects/lock-n-lock/secure-deploy-trivy-blocked.png',
            state: 'Build blocked on three CVEs',
            alt: 'Trivy image-scan output listing three HIGH severity CVEs in Python packages with their installed and fixed versions, followed by the job ending on Error: Process completed with exit code 1',
          },
        },
      ],
      // No separate demo video: the recording the deck links is what the five
      // clips above are cut from, so the section already carries it.
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
    //
    // Each `why` is two or three plain sentences, matching EchoChallengers,
    // and was checked against the deck's troubleshooting slides (61–66) and
    // the code. Three earlier claims were wrong: outputs.tf assumed one shared
    // Terraform state (state was per person); the Tailscale card blamed VXLAN
    // for the Remote-SSH breakage (that came from accepting VPC routes, and
    // VXLAN went because replication and monitoring only needed TCP); and the
    // ZAP card said Bandit blocks on Critical/High (it runs with `-l` and
    // fails on any finding; only Trivy filters by severity).
    //
    // A mark inside `chose` cannot wrap, so a long one runs off the card.
    // Mark single keywords there.
    //
    // Each `title` is the bubble's open summary. Like EchoChallengers', it
    // states the decision and what it achieves in one sentence; all seven
    // open to two lines at a laptop width.
    //
    // `chose` and `over` are short noun phrases, as in EchoChallengers; the
    // detail they used to carry lives in `why`, which sits right under them.
    decisions: [
      {
        keyword: 'Real 401 on failure',
        title: 'Failed logins return a real HTTP 401 that the dashboard and `fail2ban` can both detect.',
        glyph: 'process',
        chose: 'A real **401** for failed logins',
        over: 'a **302** redirect that hid each failure',
        why:
          'Login failures returned a 302 redirect instead of a 401. As a result, the dashboard showed **zero failed logins** during a live brute-force run, and switching to a real 401 let both `fail2ban` and the dashboard see every attempt.',
      },
      {
        keyword: 'Blackbox probing',
        title: 'A Blackbox probe tests whether a real user can reach the app through Nginx.',
        glyph: 'process',
        chose: '**Blackbox Exporter**, probing through Nginx',
        over: 'a container-only health check',
        why:
          'After we added Nginx as a reverse proxy, Prometheus could see the container running but not whether users could reach the app. A **Blackbox Exporter** probe through Nginx now defines a failure as a request a user cannot complete.',
      },
      {
        keyword: 'Repo-local Docker login',
        title: 'A repository-local Docker config keeps builds working the same on every machine.',
        glyph: 'note',
        chose: '`DOCKER_CONFIG` in a repo-local folder',
        over: 'the host\u2019s global Docker login',
        why:
          'Docker Hub credentials collided with the host\u2019s own login, and a build that worked on one machine **failed on another**. Pinning `DOCKER_CONFIG` to a folder inside the repository made the build behave the same on every machine.',
      },
      {
        keyword: 'Tailscale L3 tunnel',
        title: 'The on-premise server reaches AWS through a Tailscale tunnel with no inbound port open.',
        glyph: 'channels',
        chose: 'A **Tailscale** Layer 3 tunnel',
        over: 'a **VXLAN** Layer 2 overlay',
        why:
          'We dropped the VXLAN overlay because replication and monitoring only needed TCP, and a Layer 3 **Tailscale** tunnel was simpler to run. When NAT kept the tunnel from starting, a ping from the replica host **punched a hole** in the firewall without opening any inbound port.',
      },
      {
        keyword: 'ZAP after deploy',
        title: 'OWASP ZAP scans the live app after each deployment and reports findings in a GitHub issue.',
        glyph: 'note',
        chose: '**OWASP ZAP** after each deploy, reporting to GitHub',
        over: 'blocking every deploy on a ZAP finding',
        why:
          '**Bandit** fails the build on any code finding, and **Trivy** blocks Critical and High image vulnerabilities before an image ships. ZAP scans the live app after each deploy and reports its findings in a GitHub issue. The next step is to let ZAP stop a deploy when it finds a high-risk issue, which would give the running app the same gate the image already has.',
      },
      {
        keyword: 'One outputs.tf contract',
        title: 'A single `outputs.tf` file holds every value the other four tracks depend on.',
        glyph: 'branch',
        chose: '`outputs.tf` as the **one contract**',
        over: 'each track reading the Terraform code directly',
        why:
          'A change in the Terraform code could break another track\u2019s setup without warning. I listed every value the other tracks needed in `outputs.tf`, which kept them in **one place**.',
      },
      {
        keyword: 'Recovery checks dependencies',
        title: 'A recovery counts only after the databases, the network, and the app all respond.',
        glyph: 'process',
        chose: 'Checking the **databases** and **network** before success',
        over: 'restarting the container and calling it done',
        why:
          'There was an incident where a restarted container was in a **broken state** because it could not reach its databases. The controller now checks the databases, the network, and the app\u2019s health before it reports a recovery.',
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
      unit: 'Estimated USD / month',
      // Priced the way EchoChallengers is: AWS on-demand rates for
      // ap-northeast-2 (checked October 2026) over a 730-hour month, with
      // usage-based charges (data processing, LCUs, transfer) left out. RDS
      // db.t3.small PostgreSQL is $0.056/h from the AWS price list file, plus
      // 20 GB at $0.131/GB-month; the read replica prices the on-premise one.
      // NAT Gateway $0.059/h, t3.small $0.026/h, t3.micro $0.013/h, ALB
      // $0.0225/h, public IPv4 $0.005/h (Bastion, NAT, and the ALB in two AZs),
      // EBS gp3 $0.0912/GB-month. Instance sizes are the variables.tf defaults:
      // app and DB t3.small, NAT and Bastion t3.micro. Monitoring is
      // self-hosted on both sides, as on EchoChallengers, because managed
      // monitoring bills by usage and has no honest flat figure. This
      // project's own column is $0: every teammate ran on AWS Free Plan
      // credits. The earlier version used round guesses and priced managed
      // monitoring; both are gone.
      series: [
        { id: 'typical', label: 'Same design with managed services' },
        { id: 'actual', label: 'This project (AWS Free Plan)' },
      ],
      items: [
        {
          label: 'Database',
          note: 'RDS db.t3.small with 20 GB, plus a read replica',
          typical: 87.0,
          actual: 0.0,
        },
        {
          label: 'Outbound routing',
          note: 'managed NAT Gateway, 730 hours',
          typical: 43.07,
          actual: 0.0,
        },
        {
          label: 'Compute',
          note: 'app t3.small and Bastion t3.micro',
          typical: 28.47,
          actual: 0.0,
        },
        {
          label: 'Load balancer',
          note: 'Application Load Balancer, 730 hours',
          typical: 16.43,
          actual: 0.0,
        },
        {
          label: 'Public IPv4',
          note: '4 addresses at $0.005 per hour',
          typical: 14.6,
          actual: 0.0,
        },
        {
          label: 'Storage',
          note: 'EBS gp3 root volumes',
          typical: 1.46,
          actual: 0.0,
        },
      ],
      total: { typical: 191.03, actual: 0.0 },
      notes: [
        'The **on-premise server** made the biggest difference. The replica database ran on hardware the team already had, which removed a managed read replica from the bill. The trade-off is real: there are no automated backups or failover, and the team handled patching.',
        'The **NAT instance** replaced AWS\u2019s managed NAT Gateway, which charges for every hour it runs. A `t3.micro` NAT instance handled this project\u2019s outbound traffic for about a fifth of that cost.',
        'Each teammate deployed into their own account on the **AWS Free Plan**, and the credits covered every account\u2019s usage. The final bill was **$0**.',
        'The comparison column shows the same design with managed services at on-demand prices. Monitoring is self-hosted on both sides because managed monitoring bills by usage and has no honest flat figure.',
      ],
      caveat:
        'The comparison column is an estimate for illustration and does not reflect a real bill. Prices come from AWS on-demand rates for Seoul (`ap-northeast-2`) as of October 2026, over a 730-hour month before data-processing and traffic charges.',
    },
    links: {
      github: 'https://github.com/Lock-N-Lock/project2-security',
      notion: 'https://app.notion.com/p/Lock-Lock-c7d9e3e335cc82f5962301bc134e1782',
      terraform: null,
      // The original Korean deck on Google Drive.
      presentation: 'https://drive.google.com/file/d/1b5Gv5LPWC6y7GiMDyee932mFes6Kgx1M/view',
    },
    reflection: {
      // In EchoChallengers' reflection voice: plain sentences moving from the
      // technical side to the team side. The earlier version claimed final
      // approval on every merge to main; only #62, the final release, was his.
      learned:
        'This project changed how I think about security and cloud infrastructure. On the security side, I learned to make security the **default from the first Terraform file**, with public and private subnets, a security group for each tier, and a scan in the CI pipeline before any build. The most useful lesson came from a bug. Our login-failure detection reported zero attacks during a live brute-force run because the app returned a redirect instead of a 401, and I learned that **\u201cconfigured\u201d and \u201cactually working\u201d are two different claims**. On the infrastructure side, I learned to design for five people running the same code in five AWS accounts. I kept the Terraform state per person and published shared values through `outputs.tf`, which gave every track **one place** to read from. Choosing a NAT instance over a NAT Gateway also showed me how much a single routing decision changes the bill. On the team side, I was chosen as **team lead** when everything I knew about cloud infrastructure came from our class. I often felt unqualified because the project asked for more than what the class covered. I worked through that by learning what the build needed as it came up, such as Terraform remote state, NAT routing, and Blue/Green Auto Scaling. Each problem I solved made the next review easier, and I learned that confidence as a lead comes from **understanding enough of each track** to review it well.',
      differently:
        'With only four weeks to complete the project, the team left some planned work unfinished. Next, I would finish testing the **Blue-Green** deployment and make **OWASP ZAP** a blocking check once its findings are tuned for a demo app built to look attackable. I would also add failure and recovery scenarios for the **database**, a second NAT instance to remove the single point of failure, and L7/WAF filtering in front of the rate limit. As team lead, I would start reading the other tracks\u2019 code earlier. Signing off on the final release meant learning enough of every track to know what I was approving, and I would rather build that understanding from the first week.',
    },
  },

  {
    slug: 'hailcast',
    group: 'team',
    // The team's own name, which is also the GitHub org the four repositories
    // live under, so the sidebar and the eyebrow read the same way they do on
    // the other two team projects. `hailcast` is what the team built, not what
    // the team was called, and it stays the product name everywhere below.
    title: 'ThisPod-ThatPod',
    // The product, which the page header shows above the title instead of
    // repeating the sidebar entry. The other projects have no second name, so
    // they leave this off and the eyebrow falls back to `title`.
    eyebrow: 'hailcast',
    // The descriptive page heading. `title` above stays the short name the
    // sidebar shows and the eyebrow repeats. The product's name is a
    // portmanteau the team made themselves, *hail* a taxi and *fore-cast* the
    // weather, which Problem & Context says once so the lower-case `hailcast`
    // everywhere else reads as a product name rather than a typo.
    fullTitle:
      'Autoscaling and FinOps Cloud Infrastructure Driven by AI Demand Forecasting',
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
      why: 'A taxi platform sized for its own peak pays for that peak around the clock. The service never falls over, and the bill never falls either. Reactive autoscaling only narrows the gap, because capacity still arrives after the traffic that called for it.',
      how: 'A LightGBM model trained on New York taxi calls and Open-Meteo weather forecasts the next four hours of demand; the predict pod turns that into a floor and patches it onto a KEDA `ScaledObject` every 60 seconds, so pods exist before the load does and Karpenter supplies Spot nodes underneath them. When the forecast is wrong, KEDA’s own queue-length trigger catches it.',
      result: 'A **26.5% reduction in worker pod-hours** against a peak-sized fixed fleet, **216 pod-hours a day down to 158.8**, across **4 repositories**, **16 ArgoCD applications** and **12 IRSA roles**. That figure is simulated from eight days of recorded scaling decisions rather than read off a bill; a later refinement wired the **Cost and Usage Report** through Glue and Athena into OpenCost, so what the cluster itself cost is now measured even though what it saved is still modelled.',
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
      // `columns` — lead 3x2 with two mediums stacked beside it. The one of the
      // three arrangements whose lead is closest to its own content height,
      // which is what this project needs: eight tiles, and a lead whose
      // sentence is no longer than the two duties sitting next to it.
      layout: 'columns',
      tiles: [
        {
          size: 'lead',
          label: 'Team Lead',
          stat: { value: '4', unit: 'repos, one console' },
          text: 'Led **six people across four repositories** that deploy four different ways: `terraform apply`, `docker build`, an ArgoCD pull, and local `make`. The fourth repo is mine: an operations layer that gives the other three **one command surface** and the guardrails that surface is worth having.',
        },
        {
          size: 'medium',
          label: 'Account Guard',
          text: 'Every credentialed command compares `sts get-caller-identity` against `PROJECT_ACCOUNT_ID` and **stops dead on a mismatch**. The earlier script printed the account and compared nothing, so a session sitting in the wrong account went **green on every check**. We finished with zero wrong-account incidents.',
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
          text: 'Hosted the naming-contract verifier as `make check-contract`, run **daily rather than the night before a demo**. It checks statically against the Terraform source and at runtime against `aws describe`, and the refinement extended it to compare a **value** across two repositories rather than only a name.',
        },
        {
          size: 'small',
          label: 'Credential Isolation',
          text: 'A `cd` hook swaps `DOCKER_CONFIG` to a repo-local store inside the ops folder, so logging into the team registry **does not overwrite anyone’s personal login**.',
        },
        {
          size: 'medium',
          label: 'Runbooks as Deliverables',
          text: 'Wrote and revised the **teardown and rebuild checklists seven times**, folding measured numbers back in each pass. CloudFront’s teardown was estimated at "over ten minutes" and measured at **3 minutes 14 seconds**. Then had someone who had not written the rebuild document **execute it while I stayed out of it**: it stopped in three places, all of them steps I was doing without noticing.',
        },
        {
          size: 'medium',
          label: 'Blast-Radius Discipline',
          text: '`CONFIRM=yes` is injected by the orchestrator so a real destroy is deliberate; `FORCE=yes` is **never injected** and has to be typed by a person. Review is gated by `CODEOWNERS` on the teardown files alone, because putting the whole repository behind approval would have cost more speed than it bought safety.',
        },
      ],
    },
    // An idea board rather than a paragraph. Thirteen notes over four rows of
    // the four-column grid: three leads spanning two columns each and ten
    // supports. Every note is a complete sentence that stands on its own —
    // the format invites fragments, and a fragment only works for someone who
    // already knows the project.
    //
    // The counts have to divide the rows, which the board's CSS is explicit
    // about — so the refinement's three notes are one lead plus two supports,
    // filling row four exactly rather than leaving a note beside empty columns.
    context: {
      notes: [
        {
          size: 'lead',
          label: 'The Bill Nobody Notices',
          text: 'A taxi app almost never falls over, and that is precisely the problem: the infrastructure behind it is **sized for its busiest hour and runs at that size all twenty-four**, so at four in the morning the platform is paying peak prices to serve almost nobody. Nothing shows up as an incident, and nothing shows up in a dashboard. It shows up as a bill that is quietly larger than the service it bought.',
        },
        {
          size: 'support',
          label: 'The Problem, Redefined',
          text: 'Our first framing was **"stop the service slowing down under a traffic surge,"** and looking at how taxi hailing actually works killed it: the bottleneck is the number of drivers, not the number of servers. So we redefined the problem as **the cost of idle peak-sized capacity**, which is the one the infrastructure could genuinely answer.',
        },
        {
          size: 'support',
          label: 'Where the Name Comes From',
          text: 'The team is **ThisPod-ThatPod**, and it named the app **hailcast**, joining “hail,” as in hailing a taxi, to the “cast” of “forecast,” because the whole system is one sentence: **use the weather forecast to decide how many taxi calls are coming**, and have the capacity waiting when they arrive.',
        },
        {
          size: 'support',
          label: 'Prediction Sets the Floor',
          text: 'A LightGBM model trained on New York taxi trips and Open-Meteo weather learns patterns like “a rainy Friday evening spikes,” and every four hours it writes a demand figure for the next four hours; a scheduler turns that into a pod count of **demand ÷ 500, plus one for headroom**, and patches it onto KEDA as a minimum.',
        },
        {
          size: 'support',
          label: 'The Queue Is the Safety Net',
          text: 'Prediction alone is a single point of failure, so **KEDA also reads the SQS call queue directly**: if the forecast is wrong and the queue passes 500 messages, reactive scaling catches the overflow, and Karpenter supplies Spot nodes underneath whatever the two layers between them ask for.',
        },
        {
          size: 'lead',
          label: 'Four Repos, One Contract',
          text: 'Six people split across **four repositories that deploy four different ways**, and the seams between them are all strings: a role name, a ServiceAccount name, a metric key, an image tag. One character out of place in any of them fails **silently**, producing no error and only a "permission denied" against a policy that is perfectly correct. So a single naming document became the source of truth, revised **before** the code rather than after it, with a verifier checking the code against it daily.',
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
          text: 'The topic was **Miseon Lee’s**, and the team chose it over the alternatives on the strength of the pitch; she went on to build the entire Terraform estate, the IRSA roles, the naming convention, and the verifier that enforces it. That work is the foundation the rest of this page stands on.',
        },
        {
          size: 'lead',
          label: 'The Refinement: Guesswork Into Measurement',
          text: 'The project was presented once in early August and then given a second stretch, and the six tasks that came out of it turn out to be one task: **everything the first version asserted, the second version had to measure**. The cost figure stopped being a list-price estimate and became a bill. The rebuild procedure stopped being a document someone had read and became a command someone had run. The prediction stopped being checked by eye and started recording its own misses. **Every one of them replaced a claim with evidence**, which is the only kind of improvement a system already working can honestly make.',
        },
        {
          size: 'support',
          label: 'The Runbook Someone Else Ran',
          text: 'A runbook checked by its own author is checked against the memory that wrote it, so this one was validated by giving it to a **teammate who had not written a line of it** and watching where they stopped: three places, all of them steps the author did without noticing. They are now one command, and the document was reorganised into a normal path and a manual-recovery path rather than one undifferentiated list.',
        },
        {
          size: 'support',
          label: 'The Limit That Caused the Outage',
          text: 'A CPU **limit** throttles a container that reaches it; a throttled container answers its health check late; a pod that answers late is restarted; and a restarted pod loses the in-memory state it was holding. So the refinement **removed the CPU limits entirely** across all six services and kept the requests. The request is what guarantees the floor, and the limit was only ever guaranteeing the crash.',
        },
      ],
    },
    // `size` drives the bento layout. On the 5-column grid these twelve tile it
    // exactly over four rows: the big tile (2x2) plus three squares fills the
    // first, the big tile's second row plus a wide (2) and a square fills the
    // second, two wides with a square between them fills the third, and the
    // fourth row — the three the refinement produced — repeats that shape.
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
        detail: '216 pod-hours a day down to 158.8, against a fleet held at peak size, simulated from eight days of recorded scaling decisions rather than measured billing',
      },
      {
        size: 'square',
        value: '12',
        label: 'IRSA Roles',
        hint: 'One per ServiceAccount, mapped 1:1, with S3 permissions split by prefix so the model path is read-only. Ten at the first presentation; the refinement added OpenCost and the retraining job',
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
        hint: 'call-api, worker, predict, weather-cron, simulator and frontend, of which worker is the only one KEDA scales',
      },
      {
        size: 'wide',
        value: '4',
        label: 'Repos, One Console',
        detail: 'infra, app, manifests and ops: four deployment methods reached through a single delegating Makefile',
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
        detail: '21 minutes 40 seconds, zero errors and zero warnings, the measured run the teardown runbook was rewritten around',
      },
      {
        size: 'square',
        value: '5',
        label: 'Schedulers',
        hint: 'Forecast every 4h, scaling every 60s, traffic every 2s, backup hourly, and the accuracy check on the hour at :59, all five inside the predict pod',
      },
      {
        size: 'wide',
        value: '1',
        label: 'NAT Gateway, Not Two',
        detail: 'One in 2a rather than one per AZ: roughly $43 a month against $86 at Seoul list price, traded against 2a becoming a single point of failure',
      },
      // The refinement's own row. The first of these is the only figure on the
      // page that is money rather than a proxy for it, which is the whole point
      // of the stretch that produced it.
      {
        size: 'wide',
        value: '$8.71',
        label: 'Measured AWS Cost / Day',
        detail: 'The last fully-billed day of the period, with real Cost and Usage Report data reaching OpenCost through a Glue crawler and Athena rather than a list-price estimate',
      },
      {
        size: 'square',
        value: '19,038',
        label: 'CUR Rows Catalogued',
        hint: 'Up from 8,146 five days earlier. The daily 03:00 UTC crawl growing the Glue table is what proved the billing pipeline was running rather than merely configured',
      },
      {
        size: 'wide',
        value: '3',
        label: 'Runbook Blockers Found',
        detail: 'Found by handing the rebuild runbook to someone who had not written it and watching where they stopped. All three are now absorbed into one `make bootstrap-all`',
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
      { category: 'AWS: Platform & Data', items: ['EKS', 'EC2', 'VPC', 'RDS', 'S3', 'DynamoDB', 'SQS', 'ECR'] },
      {
        category: 'AWS: Edge & Operations',
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
        text: 'They scale different things and neither substitutes for the other. **KEDA decides how many pods**, taking a predicted floor from the predict pod and a reactive ceiling from the SQS queue depth. **Karpenter decides whether there is anywhere to put them**, supplying Spot nodes for pods that would otherwise sit `Pending` and reclaiming them when they do not.',
      },
      {
        tool: 'Why LightGBM?',
        icon: 'Python',
        text: 'The features are **hour, weekday, weekend flag, humidity, temperature and rainfall**, which are small, tabular and exactly what gradient boosting is best at. A model that trains in seconds and loads out of an S3 pickle inside a pod was worth more here than accuracy we could not have used: the output is a pod count, and a pod count is an integer.',
      },
      {
        tool: 'Why ArgoCD over Terraform?',
        icon: 'ArgoCD',
        text: 'Installing KEDA, Karpenter or the ALB controller with `helm_release` inside the infrastructure Terraform would have given **two owners to one object**, and two owners means drift that neither one reports. The boundary is ownership, not convenience: Terraform builds AWS, ArgoCD builds what runs inside the cluster, and `selfHeal` makes Git the answer to what the cluster should look like.',
      },
      {
        tool: 'Why OpenCost?',
        icon: 'Prometheus',
        text: 'AWS bills by resource and Kubernetes spends by workload, and neither view answers **"what did the worker deployment cost?"** on its own. OpenCost reads node pricing through Prometheus and splits it by namespace and pod, which is what makes worker-only cost separable from cluster cost. It priced from the **list price** until the refinement, when the Cost and Usage Report was wired through a **Glue crawler and Athena** into OpenCost’s Cloud Costs, so the same split now reads against the actual bill rather than against a rate card.',
      },
      {
        tool: 'Why Telegram?',
        icon: 'Telegram',
        text: 'Alert rules had to reach a phone without standing up an on-call platform for a summer project. The thresholds are deliberately offset from the scaling ones. **A queue alert at 1,000 is twice the KEDA trigger at 500**, so the page fires when scaling has failed to absorb the load rather than every time it starts working. The refinement took the eight rules to **ten and rewrote what each one says**: every alert now carries what it affects and where to look next, because a notification naming only the symptom leaves the reader to work out the other two on a phone.',
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
        caption: 'VPC and EKS layout',
        alt: 'Full AWS layout in ap-northeast-2: a passenger app and the external Open-Meteo API reaching a 10.0.0.0/16 VPC through Route 53, CloudFront and an internet gateway; an EKS cluster spanning availability zones 2a and 2c behind an ALB ingress, with a fixed system node group and Karpenter nodes that scale from zero; a single NAT gateway in 2a and a VPC gateway endpoint that carries S3 and DynamoDB traffic past it; and RDS, SQS, S3, DynamoDB and the management services alongside',
        // The draw.io export of this same view, shown by the panel's
        // Clean / Detailed toggle. Only the chosen one is rendered.
        detailed: {
          src: '/projects/hailcast/architecture-01-overall.svg',
          caption: 'Overall architecture, original export: every managed service, add-on and pod named',
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
              text: 'Only the call API is spread across both zones. RDS and the NAT gateway are fixed to 2a, which is a cost choice.',
            },
          ],
        },
      },
      {
        tab: 'Request flow',
        caption: 'Flow 1: ride request path from the app to the processing queue',
        alt: 'A ride request travelling from the passenger app through Route 53, CloudFront and the load balancer to the call API pod, which queues the job on SQS and answers the passenger immediately; below the line, a worker pod consumes the job from the queue and records the call to RDS while the passenger waits for none of it',
        // The draw.io export of this same view, shown by the panel's
        // Clean / Detailed toggle. Only the chosen one is rendered.
        detailed: {
          src: '/projects/hailcast/architecture-02-request-flow.svg',
          caption: 'Flow 1, original export: the synchronous half above the divider, the asynchronous half below',
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
              label: '202 accepted, returned immediately',
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
        caption: 'Flow 2: scheduled weather collection into S3',
        alt: 'The weather-cron CronJob calling the Open-Meteo forecast API for New York out through the NAT gateway, checking the response is valid, logging the error and waiting for the next cycle if it is not, and otherwise overwriting the forecast CSV in S3 for the prediction pods to read',
        // The draw.io export of this same view, shown by the panel's
        // Clean / Detailed toggle. Only the chosen one is rendered.
        detailed: {
          src: '/projects/hailcast/architecture-04-weather-ingest.svg',
          caption: 'Flow 2, original export: the collection job and its failure branch',
          alt: 'Original draw.io export of flow 2, weather collection: at the scheduled time the weather CronJob starts and calls Open-Meteo through the NAT gateway for the New York forecast, then branches on the response, logging the error and waiting for the next cycle if it failed, or overwriting weather/nyc-forecast.csv in S3 if it succeeded, ready for the prediction pod to read',
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
            { from: 'check', to: 's3', label: 'yes, overwrite' },
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
        caption: 'Flow 3: the collection loop that feeds the four-hourly forecast',
        alt: 'Two phases side by side: the continuous collection loop, where the simulator generates calls that the call API enqueues to SQS and a worker records to RDS, and the four-hourly prediction phase, where the forecast scheduler in the predict pod loads its model from S3, reads the stored weather and traffic data, computes demand with LightGBM and writes the result to the prediction table',
        // The draw.io export of this same view, shown by the panel's
        // Clean / Detailed toggle. Only the chosen one is rendered.
        detailed: {
          src: '/projects/hailcast/architecture-03-prediction-pipeline.svg',
          caption: 'Flow 3, original export: the call-collection loop and the four-hourly prediction phase side by side',
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
              text: 'A separate sixty-second scheduler reads the prediction table and patches KEDA. See the Predictive scaling tab.',
            },
          ],
        },
      },
      {
        tab: 'Predictive scaling',
        caption: 'Flow 4: predictive scaling with the KEDA queue trigger as fallback',
        alt: 'Predicted demand becoming capacity: the forecast scheduler writing to the prediction table every four hours, a scaling scheduler patching the KEDA scaled object minimum replica count every sixty seconds, KEDA also reacting to SQS queue length, Karpenter provisioning a node when the existing ones have no room, and the HPA that KEDA creates catching whatever the forecast missed',
        // The draw.io export of this same view, shown by the panel's
        // Clean / Detailed toggle. Only the chosen one is rendered.
        detailed: {
          src: '/projects/hailcast/architecture-05-predictive-scaling.svg',
          caption: 'Flow 4, original export: the proactive path and the reactive safety net',
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
        caption: 'GitOps promotion across three repositories from pull request to cluster sync',
        alt: 'The three-repository GitOps path: a feature branch reaching dev through a pull request approved by one peer, then splitting to the infra repo, which plans on every pull request and applies only after the infra-apply environment is approved, the app repo, which builds an image tagged with the commit SHA and writes that tag into the manifests repo, and ArgoCD, which watches the manifests repo, syncs to the cluster and reverts any drift back to Git',
        // The draw.io export of this same view, shown by the panel's
        // Clean / Detailed toggle. Only the chosen one is rendered.
        detailed: {
          src: '/projects/hailcast/architecture-06-gitops-flow.svg',
          caption: 'GitOps, original export: the approval gates and the drift check in full',
          alt: 'Original draw.io export of the three-repository GitOps flow: a feature branch becomes a pull request approved by one peer and merges to dev, then branches by repository: the infra repo plans on every pull request and applies only after an infra-apply environment approval, creating the EKS, RDS, S3, ECR and SQS infrastructure; the app repo builds a Docker image, pushes it to ECR tagged with the commit SHA, and updates that tag in the manifests repo; and ArgoCD watches the manifests repo, syncs to EKS, and self-heals any cluster that has drifted from Git',
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
              text: 'Terraform applies only once the infra-apply environment has been approved. The plan runs unattended, and the apply waits for a person.',
            },
          ],
        },
      },
      {
        tab: 'Cluster topology',
        caption: 'EKS control plane and node group layout with cluster networking',
        alt: 'Cluster topology: the AWS-managed EKS control plane outside the user VPC, system node groups and Karpenter-managed EC2 nodes in availability zones 2a and 2c, an ALB with a network interface in each public subnet, one NAT gateway in 2a that the 2c private subnet shares by routing, and a VPC gateway endpoint carrying S3 and DynamoDB traffic past it',
        // The draw.io export of this same view, shown by the panel's
        // Clean / Detailed toggle. Only the chosen one is rendered.
        detailed: {
          src: '/projects/hailcast/architecture-07-cluster-topology.svg',
          caption: 'Cluster configuration, original export: node groups, subnets, and the FinOps notes underneath',
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
        caption: 'Service and worker pod layout with their scaling metrics',
        alt: 'Pod-level view: Route 53 and the ALB forwarding into ClusterIP services in front of the call API, worker, predict and simulator pods; the call API publishing to SQS and a KEDA-scaled worker deployment consuming from it and writing to RDS; Karpenter provisioning a node for a pending worker pod; the weather-cron pod fetching from the external Open-Meteo API into S3; and Prometheus, Grafana and Alertmanager watching the cluster with alerts leaving for Telegram',
        // The draw.io export of this same view, shown by the panel's
        // Clean / Detailed toggle. Only the chosen one is rendered.
        detailed: {
          src: '/projects/hailcast/architecture-08-pod-architecture.svg',
          caption: 'Pod architecture, original export: the ClusterIP service layer and the monitoring stack',
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
    // One tab per repository, because hailcast is not one repository — it is
    // four, and the work *is* the arrangement of them. A single 441-line tree
    // showed that faithfully and read as a wall; split, each repo is a view
    // you can actually take in, and the four-repo shape becomes the first
    // thing the panel says rather than something buried in its scroll.
    //
    // Ops opens first because it is mine. Its tree is the annotated basket
    // rather than a bare listing: the ops repo is the one that reaches into
    // the other three, and the layout is a hard requirement rather than a
    // preference — `make -C ../project3-hailcast-infra` and the `cd`-triggered
    // Docker credential swap both resolve by relative path, so a repo cloned
    // somewhere else or under another name silently takes the delegation with
    // it. That fact has nowhere to live in a per-repo listing, so it lives here.
    //
    // The other three run in pipeline order after it: infra lays the
    // foundation, app builds the images, manifests deploy them. Alphabetical
    // would have put app first, which reads as though the application came
    // before the cluster it runs on.
    //
    // Credit where the deck puts it: the Terraform estate and its IRSA roles
    // in `infra` are Miseon Lee's, not mine. It is here as the team's work.
    //
    // The comment column in the ops tree is reached by a TAB, not by spaces,
    // and the tab is load-bearing. Three of these paths end in Korean
    // filenames, and in Chivo Mono a Hangul glyph advances 11.68px against the
    // 8.09px space: 1.44 cells, not 2. No whole number of spaces can put those
    // three lines on the same column as the other fourteen, and padding them
    // by eye leaves the drift the reader actually sees. A tab stop is an
    // absolute grid measured from the start of the line, so it ignores what
    // came before it. Each line is space-padded to land inside the last stop's
    // window and one tab snaps it to 36 cells exactly.
    //
    // Two consequences if you edit this tree. Re-padding a line means keeping
    // its width inside that window, so measure the rendered text rather than
    // counting characters. And `tab-size` on `.tree__body` has to stay 2 or 4;
    // 36 cells is a multiple of both, which is why the column sits there.
    folderStructure: [
      {
        id: 'ops',
        label: 'ops/My Track',
        root: '~/project3-hailcast/',
        tree: `
~/project3-hailcast/              	# a plain folder, not a git repo. The four repos sit here as siblings.
├── project3-hailcast-infra       	# builds the AWS foundation with Terraform: VPC, EKS, RDS, IAM roles.
│   └── docs/네이밍규약서.md          	# the naming contract. Every AWS name the other repos use is fixed here.
├── project3-hailcast-app         	# builds the six pod images and the LightGBM model, pushes them to ECR.
├── project3-hailcast-manifests   	# holds what ArgoCD syncs: 16 Applications, the apps and the add-ons.
└── project3-hailcast-ops         	# this repo, my track. It drives the other three from one place.
    ├── Makefile                   	# one command surface. Each target delegates to a repo with make -C.
    ├── .env.example              	# template for the gitignored .env. One value, PROJECT_ACCOUNT_ID.
    ├── .github/CODEOWNERS        	# requests a review when a teardown or account-guard file changes.
    ├── docs/
    │   ├── teardown_체크리스트.md   	# the destroy procedure: delete order, the five gates, measured timings.
    │   └── 재구축_체크리스트.md       	# how to rebuild after a destroy, and which values change when you do.
    └── scripts/
        ├── _lib.sh               	# shared constants and the account check every other script sources.
        ├── guard_account.sh      	# stops a make target when the AWS credentials are the wrong account.
        ├── setup.sh              	# installs the tools, logs in to AWS and Docker Hub, writes kubeconfig.
        ├── check.sh              	# checks the tools, the credentials, and that the EKS cluster answers.
        ├── check_contract.sh     	# compares the naming contract to the Terraform source, then to AWS.
        └── teardown.sh           	# destroys in order: manifests, then infra, then app. Confirms each stage.
`,
      },
      {
        id: 'infra',
        label: 'Infra',
        root: 'project3-hailcast-infra/Terraform',
        tree: `
project3-hailcast-infra/
├── .github/
│   └── workflows/
│       └── terraform.yml
├── docs/
│   ├── images/
│   │   ├── architecture.png
│   │   ├── cluster-topology.png
│   │   ├── pod-architecture.png
│   │   └── scaling-flow.png
│   ├── 네이밍규약서.md
│   └── 비용관리.md
├── envs/
│   └── dev/
│       ├── .terraform.lock.hcl
│       ├── backend.tf
│       ├── main.tf
│       ├── outputs.tf
│       ├── providers.tf
│       ├── terraform.tfvars.example
│       ├── variables.tf
│       └── versions.tf
├── modules/
│   ├── cicd/
│   │   ├── gha_tf.tf
│   │   ├── main.tf
│   │   ├── outputs.tf
│   │   ├── variables.tf
│   │   └── versions.tf
│   ├── data/
│   │   ├── rds/
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── dynamodb.tf
│   │   ├── main.tf
│   │   ├── outputs.tf
│   │   ├── rds_ingress.tf
│   │   ├── sqs.tf
│   │   ├── sqs_karpenter.tf
│   │   ├── variables.tf
│   │   └── versions.tf
│   ├── edge/
│   │   ├── acm.tf
│   │   ├── cloudfront.tf
│   │   ├── main.tf
│   │   ├── outputs.tf
│   │   ├── route53.tf
│   │   ├── variables.tf
│   │   └── versions.tf
│   ├── eks/
│   │   ├── policies/
│   │   │   ├── aws-load-balancer-controller.json
│   │   │   ├── karpenter-eks-integration.json.tftpl
│   │   │   ├── karpenter-iam-integration.json.tftpl
│   │   │   ├── karpenter-interruption.json.tftpl
│   │   │   ├── karpenter-node-lifecycle.json.tftpl
│   │   │   ├── karpenter-resource-discovery.json.tftpl
│   │   │   └── karpenter-zonal-shift.json.tftpl
│   │   ├── access.tf
│   │   ├── cluster.tf
│   │   ├── iam.tf
│   │   ├── irsa.tf
│   │   ├── main.tf
│   │   ├── nodegroup.tf
│   │   ├── outputs.tf
│   │   ├── sg_alb_cloudfront.tf
│   │   ├── variables.tf
│   │   └── versions.tf
│   ├── network/
│   │   ├── endpoints.tf
│   │   ├── main.tf
│   │   ├── nat.tf
│   │   ├── outputs.tf
│   │   ├── variables.tf
│   │   └── versions.tf
│   ├── schedule/
│   │   ├── main.tf
│   │   └── variables.tf
│   └── storage/
│       ├── athena.tf
│       ├── cur.tf
│       ├── glue.tf
│       ├── main.tf
│       ├── outputs.tf
│       ├── s3.tf
│       ├── variables.tf
│       └── versions.tf
├── scripts/
│   └── teardown_infra.sh
├── .gitignore
├── Makefile
└── README.md
`,
      },
      {
        id: 'app',
        label: 'App',
        root: 'project3-hailcast-app/Kubernetes & LightGBM',
        tree: `
project3-hailcast-app/
├── .github/
│   └── workflows/
│       ├── build.yml
│       └── image tag 갱신 자동화.md
├── backend/
│   ├── call-api/
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   └── call_router.py
│   │   ├── schedulers/
│   │   │   ├── __init__.py
│   │   │   └── traffic_flush_scheduler.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── call_service.py
│   │   │   └── traffic_counter.py
│   │   ├── Dockerfile
│   │   ├── app.py
│   │   ├── config.py
│   │   ├── dependencies.py
│   │   └── requirements.txt
│   ├── common/
│   │   ├── aws/
│   │   │   ├── __init__.py
│   │   │   ├── client_factory.py
│   │   │   ├── dynamodb_adapter.py
│   │   │   ├── s3_adapter.py
│   │   │   └── sqs_adapter.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── constants.py
│   │   │   ├── cors.py
│   │   │   ├── exception_handlers.py
│   │   │   ├── exceptions.py
│   │   │   ├── logger.py
│   │   │   ├── metrics.py
│   │   │   ├── scheduler.py
│   │   │   ├── settings.py
│   │   │   └── store.py
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   ├── base_repository.py
│   │   │   ├── call_repository.py
│   │   │   ├── database.py
│   │   │   └── entities.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── call.py
│   │   │   ├── dashboard.py
│   │   │   ├── prediction.py
│   │   │   ├── scaling.py
│   │   │   ├── status.py
│   │   │   └── weather.py
│   │   └── __init__.py
│   ├── frontend-contract/
│   │   └── README.md
│   ├── predict/
│   │   ├── adapters/
│   │   │   ├── __init__.py
│   │   │   ├── inmemory_keda_adapter.py
│   │   │   ├── inmemory_node_adapter.py
│   │   │   ├── keda_adapter.py
│   │   │   ├── kubernetes_keda_adapter.py
│   │   │   ├── kubernetes_node_adapter.py
│   │   │   └── node_adapter.py
│   │   ├── ml_runtime/
│   │   │   ├── __init__.py
│   │   │   └── model_loader.py
│   │   ├── repositories/
│   │   │   ├── __init__.py
│   │   │   ├── call_repository.py
│   │   │   ├── pod_replica_repository.py
│   │   │   ├── prediction_repository.py
│   │   │   └── scaling_repository.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── dashboard_router.py
│   │   │   ├── health_router.py
│   │   │   ├── prediction_router.py
│   │   │   └── scaling_router.py
│   │   ├── schedulers/
│   │   │   ├── __init__.py
│   │   │   ├── accuracy_check_scheduler.py
│   │   │   ├── backup_scheduler.py
│   │   │   ├── forecast_scheduler.py
│   │   │   ├── scaling_scheduler.py
│   │   │   └── traffic_scheduler.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── accuracy_check_service.py
│   │   │   ├── dashboard_service.py
│   │   │   ├── health_service.py
│   │   │   ├── pod_forecast_service.py
│   │   │   ├── prediction_accuracy_logger.py
│   │   │   ├── prediction_reader.py
│   │   │   ├── prediction_service.py
│   │   │   ├── scaler_service.py
│   │   │   ├── scaling_decision_engine.py
│   │   │   └── traffic_aggregator_service.py
│   │   ├── Dockerfile
│   │   ├── app.py
│   │   ├── config.py
│   │   ├── dependencies.py
│   │   └── requirements.txt
│   ├── simulator/
│   │   ├── k6/
│   │   │   └── call_load.js
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   └── simulator_router.py
│   │   ├── schedulers/
│   │   │   ├── __init__.py
│   │   │   └── status_scheduler.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── k6_runner.py
│   │   │   ├── simulator_service.py
│   │   │   └── traffic_state.py
│   │   ├── Dockerfile
│   │   ├── config.py
│   │   ├── dependencies.py
│   │   ├── requirements.txt
│   │   └── simulator.py
│   ├── weather-cron/
│   │   ├── adapters/
│   │   │   ├── __init__.py
│   │   │   ├── open_meteo_adapter.py
│   │   │   └── weather_adapter.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   └── weather_router.py
│   │   ├── schedulers/
│   │   │   ├── __init__.py
│   │   │   └── weather_scheduler.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── weather_service.py
│   │   ├── Dockerfile
│   │   ├── config.py
│   │   ├── dependencies.py
│   │   ├── fetch.py
│   │   └── requirements.txt
│   └── worker/
│       ├── services/
│       │   ├── __init__.py
│       │   ├── state_manager.py
│       │   └── worker_service.py
│       ├── Dockerfile
│       ├── config.py
│       ├── dependencies.py
│       ├── requirements.txt
│       └── worker.py
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── PodForecastChart.tsx
│   │   │   ├── RdsTableViewer.tsx
│   │   │   ├── TrafficHistoryChart.tsx
│   │   │   └── WeatherStrip.tsx
│   │   ├── lib/
│   │   │   └── time.ts
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   └── ServicePage.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .gitignore
│   ├── .oxlintrc.json
│   ├── Dockerfile
│   ├── README.md
│   ├── index.html
│   ├── nginx.conf
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── k8s/
│   ├── 00-namespace.yaml
│   ├── 01-serviceaccounts.yaml
│   ├── 02-configmap.yaml
│   ├── 02b-externalsecret.yaml
│   ├── README.md
│   ├── call-api-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── keda-triggerauthentication.yaml
│   ├── predict-deployment.yaml
│   ├── predict-rbac.yaml
│   ├── simulator-deployment.yaml
│   ├── weather-cron-deployment.yaml
│   ├── worker-deployment.yaml
│   └── worker-scaledobject.yaml
├── ml/
│   ├── __init__.py
│   ├── features.py
│   ├── learning_curve8.png
│   ├── predict_batch.py
│   ├── preprocess.py
│   ├── requirements.txt
│   ├── retrain_trigger.py
│   └── train.py
├── scripts/
│   ├── README.md
│   ├── _lib.sh
│   ├── build_push.sh
│   ├── deploy_infra.sh
│   ├── dev_local.sh
│   ├── teardown_app.sh
│   └── teardown_infra.sh
├── .dockerignore
├── .env.example
├── .gitignore
├── Makefile
├── README.md
└── docker-compose.yml
`,
      },
      {
        id: 'manifests',
        label: 'Manifests',
        root: 'project3-hailcast-manifests/ArgoCD',
        tree: `
project3-hailcast-manifests/
├── .github/
│   └── CODEOWNERS
├── addons/
│   ├── argocd/
│   │   └── values.yaml
│   ├── aws-load-balancer-controller/
│   │   ├── .gitkeep
│   │   └── values.yaml
│   ├── external-secrets/
│   │   └── values.yaml
│   ├── grafana-dashboards/
│   │   ├── 01-predict-scaling.json
│   │   ├── 02-queue-keda.json
│   │   ├── 03-worker-kubernetes.json
│   │   ├── 04-cost-finops.json
│   │   ├── 99-closed-loop-executive.json
│   │   └── kustomization.yaml
│   ├── karpenter/
│   │   ├── .gitkeep
│   │   ├── ec2nodeclass.yaml
│   │   ├── nodepool.yaml
│   │   └── values.yaml
│   ├── keda/
│   │   ├── .gitkeep
│   │   └── values.yaml
│   ├── kube-prometheus-stack/
│   │   ├── .gitkeep
│   │   └── values.yaml
│   ├── metrics-server/
│   │   └── values.yaml
│   ├── opencost/
│   │   ├── .gitkeep
│   │   └── values.yaml
│   └── .gitkeep
├── apps/
│   ├── call-api/
│   │   ├── deployment.yaml
│   │   ├── ingress.yaml
│   │   ├── service.yaml
│   │   ├── serviceaccount.yaml
│   │   └── servicemonitor.yaml
│   ├── frontend/
│   │   ├── deployment.yaml
│   │   ├── ingress.yaml
│   │   └── service.yaml
│   ├── predict/
│   │   ├── .gitkeep
│   │   ├── deployment.yaml
│   │   ├── ingress.yaml
│   │   ├── rbac.yaml
│   │   ├── retraining-cronjob.yaml
│   │   ├── retraining-serviceaccount.yaml
│   │   ├── service.yaml
│   │   ├── serviceaccount.yaml
│   │   └── servicemonitor.yaml
│   ├── simulator/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── serviceaccount.yaml
│   ├── weather-cron/
│   │   ├── .gitkeep
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── serviceaccount.yaml
│   ├── worker/
│   │   ├── .gitkeep
│   │   ├── deployment.yaml
│   │   ├── scaledobject.yaml
│   │   ├── serviceaccount.yaml
│   │   └── triggerauthentication.yaml
│   └── .gitkeep
├── argocd/
│   ├── applications/
│   │   ├── .gitkeep
│   │   ├── aws-load-balancer-controller-app.yaml
│   │   ├── call-api-app.yaml
│   │   ├── external-secrets-app.yaml
│   │   ├── frontend-app.yaml
│   │   ├── grafana-dashboards.yaml
│   │   ├── karpenter.yaml
│   │   ├── keda.yaml
│   │   ├── kube-prometheus-stack.yaml
│   │   ├── metrics-server.yaml
│   │   ├── opencost.yaml
│   │   ├── platform-monitoring.yaml
│   │   ├── platform-secrets-app.yaml
│   │   ├── predict-app.yaml
│   │   ├── simulator-app.yaml
│   │   ├── weather-cron-app.yaml
│   │   └── worker-app.yaml
│   ├── .gitkeep
│   └── app-of-apps.yaml
├── platform/
│   ├── external-secrets/
│   │   ├── externalsecret-rds-credentials.yaml
│   │   ├── externalsecret-rds-endpoint.yaml
│   │   ├── secret-rds-placeholder.yaml
│   │   └── secretstore.yaml
│   └── monitoring/
│       ├── rules/
│       │   └── hailcast-alerts.yaml
│       └── kustomization.yaml
├── scripts/
│   ├── keda/
│   │   ├── _lib.sh
│   │   └── verify.sh
│   ├── morning/
│   │   ├── README.md
│   │   ├── _lib.sh
│   │   └── verify.sh
│   ├── bootstrap_all.sh
│   ├── deploy.sh
│   ├── install_argocd.sh
│   ├── replace_rebuild_values.sh
│   ├── status.sh
│   ├── teardown_manifest.sh
│   └── validate.sh
├── .gitignore
├── Makefile
└── README.md
`,
      },
      {
        id: 'whole',
        label: 'Whole structure',
        root: '~/project3-hailcast/',
        tree: `
~/project3-hailcast/
├── project3-hailcast-infra/
│   ├── .github/
│   │   └── workflows/
│   │       └── terraform.yml
│   ├── docs/
│   │   ├── images/
│   │   │   ├── architecture.png
│   │   │   ├── cluster-topology.png
│   │   │   ├── pod-architecture.png
│   │   │   └── scaling-flow.png
│   │   ├── 네이밍규약서.md
│   │   └── 비용관리.md
│   ├── envs/
│   │   └── dev/
│   │       ├── .terraform.lock.hcl
│   │       ├── backend.tf
│   │       ├── main.tf
│   │       ├── outputs.tf
│   │       ├── providers.tf
│   │       ├── terraform.tfvars.example
│   │       ├── variables.tf
│   │       └── versions.tf
│   ├── modules/
│   │   ├── cicd/
│   │   │   ├── gha_tf.tf
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── data/
│   │   │   ├── rds/
│   │   │   │   ├── main.tf
│   │   │   │   ├── outputs.tf
│   │   │   │   ├── variables.tf
│   │   │   │   └── versions.tf
│   │   │   ├── dynamodb.tf
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── rds_ingress.tf
│   │   │   ├── sqs.tf
│   │   │   ├── sqs_karpenter.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── edge/
│   │   │   ├── acm.tf
│   │   │   ├── cloudfront.tf
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── route53.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── eks/
│   │   │   ├── policies/
│   │   │   │   ├── aws-load-balancer-controller.json
│   │   │   │   ├── karpenter-eks-integration.json.tftpl
│   │   │   │   ├── karpenter-iam-integration.json.tftpl
│   │   │   │   ├── karpenter-interruption.json.tftpl
│   │   │   │   ├── karpenter-node-lifecycle.json.tftpl
│   │   │   │   ├── karpenter-resource-discovery.json.tftpl
│   │   │   │   └── karpenter-zonal-shift.json.tftpl
│   │   │   ├── access.tf
│   │   │   ├── cluster.tf
│   │   │   ├── iam.tf
│   │   │   ├── irsa.tf
│   │   │   ├── main.tf
│   │   │   ├── nodegroup.tf
│   │   │   ├── outputs.tf
│   │   │   ├── sg_alb_cloudfront.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── network/
│   │   │   ├── endpoints.tf
│   │   │   ├── main.tf
│   │   │   ├── nat.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── schedule/
│   │   │   ├── main.tf
│   │   │   └── variables.tf
│   │   └── storage/
│   │       ├── athena.tf
│   │       ├── cur.tf
│   │       ├── glue.tf
│   │       ├── main.tf
│   │       ├── outputs.tf
│   │       ├── s3.tf
│   │       ├── variables.tf
│   │       └── versions.tf
│   ├── scripts/
│   │   └── teardown_infra.sh
│   ├── .gitignore
│   ├── Makefile
│   └── README.md
├── project3-hailcast-app/
│   ├── .github/
│   │   └── workflows/
│   │       ├── build.yml
│   │       └── image tag 갱신 자동화.md
│   ├── backend/
│   │   ├── call-api/
│   │   │   ├── routers/
│   │   │   │   ├── __init__.py
│   │   │   │   └── call_router.py
│   │   │   ├── schedulers/
│   │   │   │   ├── __init__.py
│   │   │   │   └── traffic_flush_scheduler.py
│   │   │   ├── services/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── call_service.py
│   │   │   │   └── traffic_counter.py
│   │   │   ├── Dockerfile
│   │   │   ├── app.py
│   │   │   ├── config.py
│   │   │   ├── dependencies.py
│   │   │   └── requirements.txt
│   │   ├── common/
│   │   │   ├── aws/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── client_factory.py
│   │   │   │   ├── dynamodb_adapter.py
│   │   │   │   ├── s3_adapter.py
│   │   │   │   └── sqs_adapter.py
│   │   │   ├── core/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── constants.py
│   │   │   │   ├── cors.py
│   │   │   │   ├── exception_handlers.py
│   │   │   │   ├── exceptions.py
│   │   │   │   ├── logger.py
│   │   │   │   ├── metrics.py
│   │   │   │   ├── scheduler.py
│   │   │   │   ├── settings.py
│   │   │   │   └── store.py
│   │   │   ├── db/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── base_repository.py
│   │   │   │   ├── call_repository.py
│   │   │   │   ├── database.py
│   │   │   │   └── entities.py
│   │   │   ├── models/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── call.py
│   │   │   │   ├── dashboard.py
│   │   │   │   ├── prediction.py
│   │   │   │   ├── scaling.py
│   │   │   │   ├── status.py
│   │   │   │   └── weather.py
│   │   │   └── __init__.py
│   │   ├── frontend-contract/
│   │   │   └── README.md
│   │   ├── predict/
│   │   │   ├── adapters/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── inmemory_keda_adapter.py
│   │   │   │   ├── inmemory_node_adapter.py
│   │   │   │   ├── keda_adapter.py
│   │   │   │   ├── kubernetes_keda_adapter.py
│   │   │   │   ├── kubernetes_node_adapter.py
│   │   │   │   └── node_adapter.py
│   │   │   ├── ml_runtime/
│   │   │   │   ├── __init__.py
│   │   │   │   └── model_loader.py
│   │   │   ├── repositories/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── call_repository.py
│   │   │   │   ├── pod_replica_repository.py
│   │   │   │   ├── prediction_repository.py
│   │   │   │   └── scaling_repository.py
│   │   │   ├── routers/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── dashboard_router.py
│   │   │   │   ├── health_router.py
│   │   │   │   ├── prediction_router.py
│   │   │   │   └── scaling_router.py
│   │   │   ├── schedulers/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── accuracy_check_scheduler.py
│   │   │   │   ├── backup_scheduler.py
│   │   │   │   ├── forecast_scheduler.py
│   │   │   │   ├── scaling_scheduler.py
│   │   │   │   └── traffic_scheduler.py
│   │   │   ├── services/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── accuracy_check_service.py
│   │   │   │   ├── dashboard_service.py
│   │   │   │   ├── health_service.py
│   │   │   │   ├── pod_forecast_service.py
│   │   │   │   ├── prediction_accuracy_logger.py
│   │   │   │   ├── prediction_reader.py
│   │   │   │   ├── prediction_service.py
│   │   │   │   ├── scaler_service.py
│   │   │   │   ├── scaling_decision_engine.py
│   │   │   │   └── traffic_aggregator_service.py
│   │   │   ├── Dockerfile
│   │   │   ├── app.py
│   │   │   ├── config.py
│   │   │   ├── dependencies.py
│   │   │   └── requirements.txt
│   │   ├── simulator/
│   │   │   ├── k6/
│   │   │   │   └── call_load.js
│   │   │   ├── routers/
│   │   │   │   ├── __init__.py
│   │   │   │   └── simulator_router.py
│   │   │   ├── schedulers/
│   │   │   │   ├── __init__.py
│   │   │   │   └── status_scheduler.py
│   │   │   ├── services/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── k6_runner.py
│   │   │   │   ├── simulator_service.py
│   │   │   │   └── traffic_state.py
│   │   │   ├── Dockerfile
│   │   │   ├── config.py
│   │   │   ├── dependencies.py
│   │   │   ├── requirements.txt
│   │   │   └── simulator.py
│   │   ├── weather-cron/
│   │   │   ├── adapters/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── open_meteo_adapter.py
│   │   │   │   └── weather_adapter.py
│   │   │   ├── routers/
│   │   │   │   ├── __init__.py
│   │   │   │   └── weather_router.py
│   │   │   ├── schedulers/
│   │   │   │   ├── __init__.py
│   │   │   │   └── weather_scheduler.py
│   │   │   ├── services/
│   │   │   │   ├── __init__.py
│   │   │   │   └── weather_service.py
│   │   │   ├── Dockerfile
│   │   │   ├── config.py
│   │   │   ├── dependencies.py
│   │   │   ├── fetch.py
│   │   │   └── requirements.txt
│   │   └── worker/
│   │       ├── services/
│   │       │   ├── __init__.py
│   │       │   ├── state_manager.py
│   │       │   └── worker_service.py
│   │       ├── Dockerfile
│   │       ├── config.py
│   │       ├── dependencies.py
│   │       ├── requirements.txt
│   │       └── worker.py
│   ├── frontend/
│   │   ├── public/
│   │   │   ├── favicon.svg
│   │   │   └── icons.svg
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── PodForecastChart.tsx
│   │   │   │   ├── RdsTableViewer.tsx
│   │   │   │   ├── TrafficHistoryChart.tsx
│   │   │   │   └── WeatherStrip.tsx
│   │   │   ├── lib/
│   │   │   │   └── time.ts
│   │   │   ├── pages/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   └── ServicePage.tsx
│   │   │   ├── App.tsx
│   │   │   ├── index.css
│   │   │   └── main.tsx
│   │   ├── .gitignore
│   │   ├── .oxlintrc.json
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── index.html
│   │   ├── nginx.conf
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.node.json
│   │   └── vite.config.ts
│   ├── k8s/
│   │   ├── 00-namespace.yaml
│   │   ├── 01-serviceaccounts.yaml
│   │   ├── 02-configmap.yaml
│   │   ├── 02b-externalsecret.yaml
│   │   ├── README.md
│   │   ├── call-api-deployment.yaml
│   │   ├── frontend-deployment.yaml
│   │   ├── keda-triggerauthentication.yaml
│   │   ├── predict-deployment.yaml
│   │   ├── predict-rbac.yaml
│   │   ├── simulator-deployment.yaml
│   │   ├── weather-cron-deployment.yaml
│   │   ├── worker-deployment.yaml
│   │   └── worker-scaledobject.yaml
│   ├── ml/
│   │   ├── __init__.py
│   │   ├── features.py
│   │   ├── learning_curve8.png
│   │   ├── predict_batch.py
│   │   ├── preprocess.py
│   │   ├── requirements.txt
│   │   ├── retrain_trigger.py
│   │   └── train.py
│   ├── scripts/
│   │   ├── README.md
│   │   ├── _lib.sh
│   │   ├── build_push.sh
│   │   ├── deploy_infra.sh
│   │   ├── dev_local.sh
│   │   ├── teardown_app.sh
│   │   └── teardown_infra.sh
│   ├── .dockerignore
│   ├── .env.example
│   ├── .gitignore
│   ├── Makefile
│   ├── README.md
│   └── docker-compose.yml
├── project3-hailcast-manifests/
│   ├── .github/
│   │   └── CODEOWNERS
│   ├── addons/
│   │   ├── argocd/
│   │   │   └── values.yaml
│   │   ├── aws-load-balancer-controller/
│   │   │   ├── .gitkeep
│   │   │   └── values.yaml
│   │   ├── external-secrets/
│   │   │   └── values.yaml
│   │   ├── grafana-dashboards/
│   │   │   ├── 01-predict-scaling.json
│   │   │   ├── 02-queue-keda.json
│   │   │   ├── 03-worker-kubernetes.json
│   │   │   ├── 04-cost-finops.json
│   │   │   ├── 99-closed-loop-executive.json
│   │   │   └── kustomization.yaml
│   │   ├── karpenter/
│   │   │   ├── .gitkeep
│   │   │   ├── ec2nodeclass.yaml
│   │   │   ├── nodepool.yaml
│   │   │   └── values.yaml
│   │   ├── keda/
│   │   │   ├── .gitkeep
│   │   │   └── values.yaml
│   │   ├── kube-prometheus-stack/
│   │   │   ├── .gitkeep
│   │   │   └── values.yaml
│   │   ├── metrics-server/
│   │   │   └── values.yaml
│   │   ├── opencost/
│   │   │   ├── .gitkeep
│   │   │   └── values.yaml
│   │   └── .gitkeep
│   ├── apps/
│   │   ├── call-api/
│   │   │   ├── deployment.yaml
│   │   │   ├── ingress.yaml
│   │   │   ├── service.yaml
│   │   │   ├── serviceaccount.yaml
│   │   │   └── servicemonitor.yaml
│   │   ├── frontend/
│   │   │   ├── deployment.yaml
│   │   │   ├── ingress.yaml
│   │   │   └── service.yaml
│   │   ├── predict/
│   │   │   ├── .gitkeep
│   │   │   ├── deployment.yaml
│   │   │   ├── ingress.yaml
│   │   │   ├── rbac.yaml
│   │   │   ├── retraining-cronjob.yaml
│   │   │   ├── retraining-serviceaccount.yaml
│   │   │   ├── service.yaml
│   │   │   ├── serviceaccount.yaml
│   │   │   └── servicemonitor.yaml
│   │   ├── simulator/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── serviceaccount.yaml
│   │   ├── weather-cron/
│   │   │   ├── .gitkeep
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── serviceaccount.yaml
│   │   ├── worker/
│   │   │   ├── .gitkeep
│   │   │   ├── deployment.yaml
│   │   │   ├── scaledobject.yaml
│   │   │   ├── serviceaccount.yaml
│   │   │   └── triggerauthentication.yaml
│   │   └── .gitkeep
│   ├── argocd/
│   │   ├── applications/
│   │   │   ├── .gitkeep
│   │   │   ├── aws-load-balancer-controller-app.yaml
│   │   │   ├── call-api-app.yaml
│   │   │   ├── external-secrets-app.yaml
│   │   │   ├── frontend-app.yaml
│   │   │   ├── grafana-dashboards.yaml
│   │   │   ├── karpenter.yaml
│   │   │   ├── keda.yaml
│   │   │   ├── kube-prometheus-stack.yaml
│   │   │   ├── metrics-server.yaml
│   │   │   ├── opencost.yaml
│   │   │   ├── platform-monitoring.yaml
│   │   │   ├── platform-secrets-app.yaml
│   │   │   ├── predict-app.yaml
│   │   │   ├── simulator-app.yaml
│   │   │   ├── weather-cron-app.yaml
│   │   │   └── worker-app.yaml
│   │   ├── .gitkeep
│   │   └── app-of-apps.yaml
│   ├── platform/
│   │   ├── external-secrets/
│   │   │   ├── externalsecret-rds-credentials.yaml
│   │   │   ├── externalsecret-rds-endpoint.yaml
│   │   │   ├── secret-rds-placeholder.yaml
│   │   │   └── secretstore.yaml
│   │   └── monitoring/
│   │       ├── rules/
│   │       │   └── hailcast-alerts.yaml
│   │       └── kustomization.yaml
│   ├── scripts/
│   │   ├── keda/
│   │   │   ├── _lib.sh
│   │   │   └── verify.sh
│   │   ├── morning/
│   │   │   ├── README.md
│   │   │   ├── _lib.sh
│   │   │   └── verify.sh
│   │   ├── bootstrap_all.sh
│   │   ├── deploy.sh
│   │   ├── install_argocd.sh
│   │   ├── replace_rebuild_values.sh
│   │   ├── status.sh
│   │   ├── teardown_manifest.sh
│   │   └── validate.sh
│   ├── .gitignore
│   ├── Makefile
│   └── README.md
└── project3-hailcast-ops/
    ├── .github/
    │   └── CODEOWNERS
    ├── docs/
    │   ├── teardown_체크리스트.md
    │   └── 재구축_체크리스트.md
    ├── scripts/
    │   ├── _lib.sh
    │   ├── check.sh
    │   ├── check_contract.sh
    │   ├── guard_account.sh
    │   ├── setup.sh
    │   └── teardown.sh
    ├── .env.example
    ├── .gitignore
    ├── Makefile
    └── README.md
`,
      },
    ],
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
          text: 'The team started by looking back at the previous two projects rather than forward at this one, and three decisions came out of it: verify by simulation and say so, split six people across four repositories, and treat a naming document as the single source of truth for every seam between them. The original goal, stopping latency under a traffic surge, was dropped here once looking at how taxi hailing actually works showed the bottleneck was drivers rather than servers.',
        },
        {
          id: 'foundation',
          title: 'Foundation',
          range: 'Jul 13 – Jul 27',
          from: '2026-07-13',
          to: '2026-07-27',
          text: 'The AWS estate went up: VPC and EKS, the ten IRSA roles that everything else waited on, the data tier, and the CI roles. Terraform state locking moved to S3’s native lock rather than a DynamoDB table, IRSA was folded into the EKS module to settle the OIDC ordering problem, and the account guard went in before the first `apply` did. The safety rail arriving ahead of the thing it guards was the point.',
        },
        {
          id: 'rails',
          title: 'Safety Rails & Teardown Control',
          range: 'Jul 28 – Aug 4',
          from: '2026-07-28',
          to: '2026-08-04',
          text: 'The naming verifier started running daily, cost-allocation tags were switched on, and the teardown checklist was rewritten around real runbooks instead of a practice incident. On August 3 the whole estate was destroyed for real: **140 resources, 21 minutes 40 seconds, no errors**, with one S3 bucket accounting for 20 of those 21 minutes. The first presentation followed the next day.',
        },
        {
          id: 'refine',
          title: 'Refinement & Re-presentation',
          range: 'Aug 13 – Aug 27',
          from: '2026-08-13',
          to: '2026-08-27',
          text: 'The fourth project started on August 5 and had the week to itself; from the 13th the two ran **side by side**. The estate was rebuilt from zero to prove the runbook worked, which is where its real gaps surfaced: a secret that synced with one key empty, an ECR repository left without an image, and a CUR bucket that had to be migrated. What that exposed set the agenda for the rest of the stretch. The six tasks it produced are all the same task, **replacing an assertion with a measurement**: CPU limits came out of all six services, the Cost and Usage Report went through Glue and Athena into OpenCost so the cost figure became a bill, the three points where the runbook had stalled were absorbed into one `make bootstrap-all`, the dashboards were rebuilt around a notice–identify–assess–trace read with FinOps split out as a fifth, the prediction started recording its own misses and continuing training on them nightly, and the ALB was closed to everything but CloudFront. The project was presented again on **August 27**.',
        },
      ],
    },
    // Eight files, in the order the page argues them rather than the order the
    // system runs them: the two that are mine, then the two that make the
    // prediction move a pod, then the two underneath both, then the two the
    // refinement added.
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
      {
        path: 'infra/modules/storage/glue.tf',
        content: hcGlue,
      },
      {
        path: 'manifests/scripts/replace_rebuild_values.sh',
        content: hcReplaceValues,
      },
    ],
    // No recovery controller on this project, and none intended: hailcast's
    // answer to a failed pod is Kubernetes restarting it and KEDA re-reading
    // the queue, not a policy file mapping alerts to scripts. `null` rather
    // than a missing key so the section disappears instead of standing empty
    // forever waiting for a file that is never going to arrive.
    recoveryPolicy: null,
    // Five Grafana captures and the simulation chart the pod-hour claim rests
    // on, all taken from the decks rather than restaged. The first three and
    // the chart are the August 4 presentation; the last two are the refinement,
    // and they are the only screens on this page carrying real money.
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
      // Two recordings feed this section: the first presentation covers the
      // three demo scenarios, and the refinement one covers FinOps and the
      // retraining loop. `clipNote` below is the first presentation's, and
      // the two refinement scenarios override it, so a reader is always told
      // which presentation they are watching.
      //
      // Two scenarios carry no clip at all and are not missing one. Pod-hour
      // simulation is a simulation chart, so there is no footage of it in
      // existence. Closed-loop summary shows the board *after* its rebuild,
      // which is in the report deck and in neither recording; the first
      // presentation shows the earlier board, and captioning one board with
      // another board's clip would be worse than showing no clip. Both still
      // carry a `lead`, so every tab explains itself whether or not it moves.
      clipNote:
        "Cut from the first presentation. The Korean captions are the team's own. Silent, and it loops.",
      stillsNote:
        "Full-resolution captures from the team's report deck. Click one to open it at full size.",
      scenarios: [
        {
          id: 'predictive-scaling',
          tab: 'Predictive scaling',
          label: 'Demo 1: The forecast raising the floor',
          lead:
            'A forecast of **5,000** calls for 10:00 is written to RDS. KEDA reads it and the worker floor rises to **10** pods before the load arrives.',
          clip: {
            src: '/projects/hailcast/clip-01-predict.mp4',
            width: 1280,
            height: 720,
            poster: '/projects/hailcast/clip-01-predict.jpg',
            speed: '3.6x',
            alt: 'A forecast run writing predicted demand into RDS, followed by the worker pod count rising to ten ahead of the traffic',
          },
          before: {
            src: '/projects/hailcast/demo-01-predictive-scaling.png',
            state: 'Ten workers Ready',
            alt: 'The hailcast Grafana dashboard "01 예측 기반 스케일링" showing a runtime summary row: prediction collection available, one predict pod Ready, an applied scaling threshold of 3, ten worker pods Ready, and a Ready-versus-threshold panel reading satisfied, above a five-minute chart of predict container restarts holding flat at zero',
          },
        },
        {
          id: 'keda-queue',
          tab: 'KEDA queue trigger',
          label: 'Demo 2: The reactive layer catching the overflow',
          lead:
            'With the forecast deliberately wrong, traffic climbs to **607** calls. The reactive layer picks up what the prediction missed while the cluster holds at **3** Ready nodes.',
          clip: {
            src: '/projects/hailcast/clip-02-keda.mp4',
            width: 1280,
            height: 720,
            poster: '/projects/hailcast/clip-02-keda.jpg',
            speed: '2x',
            alt: 'The simulator driving traffic to 607 calls against a stale forecast, with the worker dashboard showing three Ready nodes',
          },
          before: {
            src: '/projects/hailcast/demo-02-keda-queue.png',
            state: 'Replicas lifted to six',
            alt: 'The hailcast Grafana dashboard "02 처리 대기열 및 KEDA" showing a visible queue depth of 107, a maximum HPA replica count of 20, and the KEDA operator reported available; a timeline panel plots queue depth against the applied threshold and the HPA target and current replicas, all converging on 6, beside a second panel showing zero Pending worker pods against 3 Ready nodes',
          },
        },
        {
          id: 'worker-runtime',
          tab: 'Worker runtime',
          label: 'Demo 3: What the scaled workers were actually doing',
          lead:
            'Under load the workers run at **22.7%** of their CPU request across 12 cores, with **3** nodes Ready and none unschedulable. Once traffic stops they terminate back down.',
          clip: {
            src: '/projects/hailcast/clip-03-worker.mp4',
            width: 1280,
            height: 720,
            poster: '/projects/hailcast/clip-03-worker.jpg',
            speed: '1.5x',
            alt: 'The worker dashboard reading 22.7 percent of CPU request over twelve cores with three Ready nodes, then worker pods terminating as traffic falls away',
          },
          before: {
            src: '/projects/hailcast/demo-03-worker-runtime.png',
            state: 'Six workers at 32.3 percent',
            alt: 'The hailcast Grafana dashboard "03 Worker 및 Kubernetes" showing six running worker pods, zero Pending, a flat zero container-restart rate over five minutes, and a Worker Ready gauge at 100 percent; a resource row below plots worker CPU rising to roughly 0.5 cores and memory to about 400 MiB, with CPU usage against request shown on a gauge at 32.3 percent',
          },
        },
        {
          id: 'pod-hour-saving',
          tab: 'Pod-hour simulation',
          label: 'The 26.5% figure, and what it is made of',
          lead:
            'The saving is a simulation rather than a measurement: **216** pod-hours run flat against **158.8** scaled to the forecast.',
          before: {
            src: '/projects/hailcast/pod-hour-savings.png',
            state: '216 pod-hours against 158.8',
            alt: 'A chart whose Korean title reads "예측형 스케일링 절감 시뮬레이션", subtitled "하루 워커 파드시간": a dashed horizontal line at nine worker pods marks peak-sized fixed capacity, and a solid line traces the predicted replica count by New York hour, dropping to a minimum of two pods at 5am and climbing back to nine by early afternoon; the area between the two lines is shaded as the saving, a grey band from 14:00 to 20:00 is annotated as unobserved and filled with the peak value, and the subtitle reads 216 pod-hours against 158.8, a 26.5 percent difference',
          },
        },
        // The two the refinement produced. The FinOps board is the evidence
        // for the correction this page's cost section now makes — it is the
        // first screen on the project showing money rather than a proxy for
        // it — and the summary board is the closed loop in one frame.
        {
          id: 'finops-cost',
          tab: 'FinOps: real billing',
          label: 'The refinement: cost measured rather than modelled',
          lead:
            'OpenCost had quietly fallen back to list-price estimates after losing its S3 permission. The refinement points it at the real Cost and Usage Report, and the board reads a billed **$8.71** for the last settled day.',
          clip: {
            src: '/projects/hailcast/clip-05-finops.mp4',
            width: 1280,
            height: 720,
            poster: '/projects/hailcast/clip-05-finops.jpg',
            speed: '3.2x',
            alt: 'An OpenCost query failing on a denied S3 permission, then the same cost board reading a billed net cost of 8.71 dollars from the real Cost and Usage Report',
          },
          clipNote:
            "Cut from the refinement presentation. The Korean captions are the team's own. Silent, and it loops.",
          before: {
            src: '/projects/hailcast/demo-04-finops-cost.png',
            state: '$8.71 billed for a day',
            alt: 'The hailcast Grafana dashboard "04 Hailcast 비용 / FinOps", split into an AWS section reading from the Cost and Usage Report and a Kubernetes section reading from OpenCost: a headline of $8.71 as the most recent settled daily net cost, a daily trend line holding near $16 from August 19 to 23 and falling away on the 24th, a per-service bar chart led by EC2 with EKS, S3, RDS, ELB and smaller services beneath it, and a category doughnut at 58.64 percent compute; below, three seven-day totals of $70.12 for nodes, $26.44 for the hailcast namespace and $9.28 for worker, then per-node and per-namespace breakdowns and a chart plotting worker cost against worker Ready count across five daily cycles',
          },
        },
        {
          id: 'retraining',
          tab: 'Retraining loop',
          label: 'The refinement: a training job that can fail out loud',
          lead:
            'Predictions are logged against the demand that actually arrived, and retraining continues the model from **8,000** trees to **8,026**. A failed run now raises **KubeJobFailed** to Telegram, where it used to close quietly as a success.',
          clip: {
            src: '/projects/hailcast/clip-06-retraining.mp4',
            width: 1280,
            height: 720,
            poster: '/projects/hailcast/clip-06-retraining.jpg',
            speed: '3.8x',
            alt: 'The DynamoDB prediction log holding predicted against actual demand, a continued-training run uploading a new model to S3, and a KubeJobFailed alert arriving in Telegram',
          },
          clipNote:
            "Cut from the refinement presentation. The Korean captions are the team's own. Silent, and it loops.",
          // The only scenario whose stills are not from the report deck. That
          // deck has no capture of this material, so these are frames out of
          // the recording, and the note below says so rather than letting them
          // pass as deck images like the other six.
          stillsNote:
            'Frames from the refinement recording at full resolution, since this scenario is not in the report deck. Click one to open it at full size.',
          // Two shots rather than one, because the point of this scenario is
          // that the job reports either outcome. One still could only show it
          // succeeding, which is the half that was never the problem.
          before: {
            src: '/projects/hailcast/demo-06-retraining-run.jpg',
            state: '8000 trees to 8026',
            alt: 'The retraining job log ending on continued training complete from 8000 to 8026 trees, an S3 upload of the new model version, twenty prediction records marked as trained, and an in-sample MAE of 921.15',
          },
          after: {
            src: '/projects/hailcast/demo-06-retraining-alert.jpg',
            state: 'KubeJobFailed in Telegram',
            alt: 'A Telegram message from the Hailcast Alert bot reporting KubeJobFailed at WARNING severity against hailcast / predict-retraining-failtest, saying the job did not complete successfully and that the alert clears once the job is cleaned up',
          },
        },
        {
          id: 'closed-loop',
          tab: 'Closed-loop summary',
          label: 'The rebuilt summary board: the whole loop on one screen',
          lead:
            'The rebuilt board puts the whole loop on one screen: prediction available, HPA asking for **8**, **8** workers Ready, queue at zero, and no Pending pods or restarts.',
          before: {
            src: '/projects/hailcast/demo-05-closed-loop.png',
            state: 'Eight asked and eight Ready',
            alt: 'The hailcast Grafana dashboard "99 Hailcast 전체 운영 상태 요약" after its rebuild: a status row reading prediction available, HPA desired 8, Worker Ready 8, a replica-fulfilment gauge at 100 percent, a current queue of 0 and the KEDA operator available; a scaling-flow chart below traces the applied HPA minimum, HPA desired and Worker Ready as one stepped line falling to two pods in the early afternoon and climbing back past eight overnight, with queue depth flat against it; and a stability row of four panels reading zero Pending workers, zero worker restarts in five minutes, zero not-Ready nodes and predict metrics collectable',
          },
        },
      ],
      // No separate demo video: both recordings are what the clips above are
      // cut from, so the section already carries them.
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
        keyword: 'Single NAT gateway',
        title: 'The environment runs one NAT gateway in a single availability zone.',
        glyph: 'route',
        chose: 'One NAT gateway in zone **2a**, with free VPC gateway endpoints carrying S3 and DynamoDB traffic around it',
        over: 'one NAT gateway per availability zone, the configuration a production account would use',
        why:
          'A NAT gateway bills by the hour whether or not traffic passes through it. A second gateway therefore doubles a fixed cost to buy redundancy that a four-week development environment is unlikely to need, roughly **$86 a month against $43** at Seoul list price. The trade is real and we recorded it as such. An outage in zone 2a removes outbound connectivity from the entire private tier. The same architecture built for production would use one NAT gateway per zone and a Multi-AZ database.',
      },
      {
        keyword: 'Add-ons via ArgoCD',
        title: 'ArgoCD owns every cluster add-on, and Terraform owns the AWS resources underneath.',
        glyph: 'branch',
        chose: 'KEDA, Karpenter, the ALB controller and the monitoring stack **declared in the manifests repository** and pulled by ArgoCD',
        over: 'installing them with `helm_release` from the infrastructure Terraform, which would remove one repository',
        why:
          'A `helm_release` in Terraform gives the same Kubernetes object **two owners**. Terraform reconciles it toward the state file while ArgoCD reconciles it toward Git, and each one reports success while undoing the other. We drew the boundary by who creates the resource, so **Terraform owns AWS and ArgoCD owns the cluster**. That rule is what makes `selfHeal` safe to enable.',
      },
      {
        keyword: 'Account ID guard',
        title: 'The safety guard checks which AWS account the caller is standing in.',
        glyph: 'inject',
        chose: 'A comparison of `sts get-caller-identity` against `PROJECT_ACCOUNT_ID`, leaving the credential chain untouched',
        over: 'forcing `AWS_PROFILE=hailcast`, which is how the script was first written',
        why:
          'Forcing a profile name protected a personal `[default]` profile while the project account and the owner’s personal account were separate. Once they became the same account, the check protected nothing and **broke two valid setups**: a server that uses the default profile, and CI, which authenticates through OIDC environment variables. The question that matters is **which account you are operating in**. The guard reads that identity directly, and the credential chain stays as the caller configured it.',
      },
      {
        keyword: 'Single-value .env',
        title: 'The setup script parses exactly one value out of the .env file.',
        glyph: 'note',
        chose: 'A parser that reads exactly one line, `PROJECT_ACCOUNT_ID`, out of the file',
        over: '`source .env`, the usual shell approach, which would let the file define anything',
        why:
          'We demonstrated both of the holes that sourcing the file opens. A single `export AWS_PROFILE` line **separates the credentials the guard inspects from the credentials Terraform later uses**, because `make infra-destroy` runs the guard and the delegated command in different shells. The guard can then approve account A while Terraform destroys account B. Sourcing is also arbitrary code execution, so a redefined `aws()` function defeats the guard completely. Anyone who needs a specific profile exports it **in their own shell**, where both halves of the command see the same value.',
      },
      {
        keyword: 'Ordered teardown',
        title: 'Teardown runs in the order the resources were created.',
        glyph: 'pipeline',
        chose: '**Manifests, then infrastructure, then application**, with a y/N gate between stages and no automatic continue after a failure',
        over: 'running `terraform destroy` first, the command that sounds like it removes everything',
        why:
          '`terraform destroy` removes only what the **state file** records. The ALBs, ENIs and Karpenter nodes that Kubernetes created are not in that file, so they survive the command, keep billing, and block the VPC from being deleted for hours. Deleting the Kubernetes objects first lets each finalizer clean up its own AWS resources while the cluster is still running. The measured teardown removed **140 resources in 21 minutes and 40 seconds** with no errors. An earlier practice run, before the ordering existed, failed after 20 minutes on orphaned resources.',
      },
      {
        keyword: 'Separate IRSA and RBAC',
        title: 'IRSA and Kubernetes RBAC are treated as two separate systems.',
        glyph: 'channels',
        chose: 'IRSA for access to anything outside the cluster and RBAC for anything inside it, with **no attempt to bridge the two**',
        over: null,
        why:
          'The predict pod needs S3 and RDS, which are AWS resources reached through an IAM role assumed by its ServiceAccount. The same pod also patches a KEDA `ScaledObject`, which is a Kubernetes API object that no IAM policy can reach. **Neither system can substitute for the other**, and treating them as one is how a team spends an afternoon in IAM while debugging an RBAC failure. Both fail identically when a ServiceAccount name is one character wrong, returning a plain access denied against a policy that is entirely correct.',
      },
      {
        keyword: 'Controllers off Spot',
        title: 'Controllers run on fixed nodes while application workloads run on Spot capacity.',
        glyph: 'depth',
        chose: 'A **managed node group of two fixed instances** for the controllers, with application pods on Karpenter Spot nodes that scale to zero',
        over: 'running everything on Spot, which is cheaper by the amount that matters least',
        why:
          'If Karpenter and KEDA run on Spot capacity, a reclamation event can remove **the components that respond to reclamation events**. The controllers therefore sit on stable capacity and the workloads take the cheap interruptible capacity. That is also where the saving actually is, because application nodes drop to zero on a quiet night while the two system nodes would have run either way.',
      },
      {
        keyword: 'Scheduler without Lambda',
        title: 'EventBridge Scheduler drives the nightly shutdown by calling the AWS API directly.',
        glyph: 'process',
        chose: '**EventBridge Scheduler calling the AWS API directly** to stop the node group and the database at 02:00 KST and start them again at 10:00',
        over: 'a Lambda function on a schedule, the usual shape of this pattern',
        why:
          'A Lambda here would add a function, a role, a package and a deployment path to maintain, all to make **two API calls a day**. The scheduler makes those calls itself, using a role scoped to one node group and one database instance. The approach also taught us something. **A schedule does not fail when you create it; it fails at 02:00 when it runs.** Ours retried twice and then dropped the event with no dead letter queue, so the failure stayed invisible until someone checked the node count the next morning. That check is now part of the routine.',
      },
      {
        keyword: 'No CPU limits',
        title: 'CPU limits came out of every service, and CPU requests stayed.',
        glyph: 'process',
        chose: '`limits.cpu` deleted from **all six services** with `requests.cpu` kept, and memory pinned request to limit',
        over: 'raising each limit to a value high enough to avoid throttling, the fix the load test appeared to ask for',
        why:
          'A CPU limit **throttles the container that reaches it**, and a throttled process answers its liveness probe late, gets restarted, and loses its in-memory state. That is the exact failure the load test produced, and raising the number only moves the load at which it happens. **The request is what reserves the floor**, and the scheduler already prevents the node from being oversubscribed, so the limit cost a restart and bought nothing. Memory keeps its limit because memory pressure kills a neighbouring pod. The reverse cost is stated plainly: **a runaway pod can now consume a whole node’s CPU**, and only the scheduler stands in its way.',
      },
      {
        keyword: 'Separate retraining role',
        title: 'The retraining job runs under a ServiceAccount of its own.',
        glyph: 'channels',
        chose: 'A separate `retraining-sa` and IRSA role, scoped to `models/latest/` and to `Scan` and `UpdateItem` on the accuracy table',
        over: 'reusing `predict-sa`, which already reads the model and writes accuracy records',
        why:
          'The inference pod runs at several replicas and **KEDA adds more of them**, so a permission granted to that pod is granted to every copy. One misbehaving copy overwriting `models/latest/model.pkl` would leave every other pod predicting from a corrupted model. **Only the nightly CronJob needs to write a model**, so that permission lives on its own identity, narrowed further than predict’s own read scope of `models/*`. `PutItem` stays with predict, since the retraining job creates no records and only reads them and marks them used.',
      },
      {
        keyword: 'Independent runbook test',
        title: 'The rebuild runbook was validated by someone who did not write it.',
        glyph: 'note',
        chose: 'A **teammate from another track** running the document while we watched where they got stuck, with no author present to explain',
        over: 'the author walking through their own runbook, which is what testing a runbook usually means',
        why:
          'An author reading their own procedure supplies from memory every step they forgot to write down, A self-check therefore confirms the document the author meant to write. Run by someone else, the procedure **stopped three times**: a CRD that had to be rendered from the chart rather than pulled from a tag, a secret whose first reconcile fails and then waits an hour to retry, and an install ordering that nobody had written out. All three are now covered by a single `make bootstrap-all`, and the document was split into a normal path and a manual recovery path so the recovery steps no longer read as required work. One thing the exercise does not prove is the original goal. The reader was on the team, so the claim that a third party can reproduce the build is **still unmeasured**.',
      },
      {
        keyword: 'Naming doc first',
        title: 'The naming document is corrected before the code is.',
        glyph: 'note',
        chose: 'One naming convention as the source of truth, revised **first**, with a verifier checking the code against it daily',
        over: null,
        why:
          'Four repositories reference each other entirely through strings, including role names, ServiceAccount names, a metric key and an image tag. A mismatch of one character **fails without producing an error**. The document therefore leads and the code follows. When reality is correct and the document is wrong, we amend the document and attach the evidence. The cost is stated honestly: **the verifier checks names only**, so a collection interval documented as two hours and coded as four went unnoticed for the whole project.',
      },
    ],
    // NOT DOLLARS — the chart, at least. Every other cost table on this site
    // prices resources; this one measures **worker pod-hours a day**, which is
    // the unit the project's own saving claim is made in and the only one that
    // claim can support: the comparison column is a fleet that was never
    // actually run, so there is no bill for it and never will be.
    //
    // The refinement did finish the CUR integration, and the real billing it
    // produced is in `measured` below rather than in the chart. Keeping them
    // apart is the point. Folding measured dollars into a modelled comparison
    // would produce a saving figure in money that no invoice supports; side by
    // side, the chart says what the design is worth in pods and the strip says
    // what the cluster actually cost, and neither borrows the other's
    // authority.
    //
    // The rows are the same twenty-four hours the simulation chart plots,
    // banded and summed. Ordered by the size of the gap, largest first, except
    // the last row — which is the one that does not close, and the reason it
    // does not is the most important thing in the section.
    cost: {
      unit: 'worker pod-hours / day',
      series: [
        { id: 'fixed', label: 'Peak-sized fixed capacity' },
        { id: 'actual', label: 'hailcast: predicted floor' },
      ],
      items: [
        {
          label: '00:00 – 05:59',
          note: 'The quiet half of the night, where the floor falls to two pods at 5am, its lowest point in the day',
          fixed: 54.0,
          actual: 23.05,
        },
        {
          label: '06:00 – 11:59',
          note: 'Morning ramp, where the floor climbs from two back through six as demand returns',
          fixed: 54.0,
          actual: 29.55,
        },
        {
          label: '12:00 – 13:59',
          note: 'Midday, within one pod of peak and correctly so',
          fixed: 18.0,
          actual: 16.65,
        },
        {
          label: '21:00 – 23:59',
          note: 'Late evening, at peak until the last hour of the day',
          fixed: 27.0,
          actual: 26.5,
        },
        {
          label: '14:00 – 20:59',
          note: 'Seven hours with no observation at all, filled with the peak value rather than estimated',
          fixed: 63.0,
          actual: 63.0,
        },
      ],
      total: { fixed: 216.0, actual: 158.75 },
      notes: [
        'The entire saving is **the quiet hours**, and that is the whole thesis rather than a footnote: between midnight and noon a peak-sized fleet spends 108 pod-hours where the forecast asks for 52.6. Around the middle of the day the two lines sit **within one pod of each other**, which is the result you want. A predictor that undercut peak demand at 1pm would be saving money by dropping calls.',
        'The **14:00–20:59 row does not move, because there is nothing in it**. Those seven New York hours are 03:00–10:00 KST, exactly when the night shutdown had the cluster switched off, so no scaling decision was ever recorded for them. They are filled with the **peak value of nine pods**, the most pessimistic choice available. Interpolating from the hours either side would have invented a saving out of a gap in the data.',
        'The basis is **107 hourly snapshots** written to `dashboard/pod-history.json` in S3 between 2026-07-21 and 07-28, with `predicted_replicas` averaged by New York hour. The comparison column is a **fixed fleet held at the observed peak of nine pods**, which is what "size it for the busy hour and leave it" actually costs over a day.',
        'Pod-hours are a proxy for money. At the first presentation that was the end of it, because OpenCost was pricing from the AWS list price with **the CUR integration scoped and unfinished**. The refinement finished it, and the measured cost is below. It does not convert this chart: the comparison column is a fleet that was never run, so **no invoice exists for the thing being saved against**, and a percentage in dollars would be arithmetic on one real number and one imaginary one.',
      ],
      caveat:
        'Simulated expected effect for a development environment in `ap-northeast-2`. Every figure is modelled, and no invoice underlies any of them. Both columns are pod-hours derived from recorded scaling decisions over eight days; the fixed-capacity column is a modelled baseline that was never actually run.',
      // The refinement's own numbers, and the only real money on this page.
      // A strip rather than a second chart, for the reason the section comment
      // above gives: these do not compare with the bars, and a second set of
      // bars would invite exactly that comparison.
      measured: {
        label: 'Measured: what the cluster actually cost',
        lede:
          'The August 4 version of this page said the CUR integration was never wired up. The refinement wired it: the **Cost and Usage Report** lands in S3, a **Glue crawler** catalogues it every morning at 03:00 UTC, **Athena** queries it, and OpenCost’s Cloud Costs reads the result, so the same namespace-and-pod split that used to run on the list price now runs on the invoice. These are dev-environment figures for a cluster that was deliberately switched off overnight, not a production bill.',
        figures: [
          {
            value: '$8.71',
            label: 'AWS net cost / day',
            note: 'The last fully-settled day; the days before it ran near $16 with the cluster up for longer',
          },
          {
            value: '$70.12',
            label: 'Node cost / 7 days',
            note: 'The whole cluster, priced by OpenCost against the billed rate rather than the rate card',
          },
          {
            value: '$26.44',
            label: 'hailcast namespace / 7 days',
            note: '38% of the cluster; kube-system is $5.84, KEDA $1.90, monitoring $1.29',
          },
          {
            value: '$9.28',
            label: 'Worker deployment / 7 days',
            note: 'The one workload KEDA scales, and the deployment the pod-hour chart above is about',
          },
        ],
        source:
          'OpenCost Cloud Costs (Level 2) reading CUR through Glue and Athena, captured 2026-08-25. Closing this took three permission failures found only by running it: `s3:ListBucket` missing from the crawler role on 8/18, `glue:BatchGetPartition` on 8/19, and on 8/21 an S3 condition too narrow to read the CUR path plus no permission to look up Spot prices at all.',
      },
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
        'This was the first project where I owned **nothing that runs in production and everything that stops it going wrong**, and that turned out to be a real job rather than a consolation prize. The lesson underneath all of it: **a safety check that reports without comparing is worse than no check at all**. Our setup script printed the AWS account ID and compared it to nothing, so a session sitting in the wrong account went green on every single check. The output looked like verification and was decoration. Fixing it taught me to ask of any guard **what input would make this fail?** If I cannot answer, it is not a guard. The same pattern kept surfacing everywhere: a schedule that fails at 02:00 rather than at `apply`, a verifier that reads names and never reads values, a 200 OK from a path that does not exist. **Every expensive failure on this project was silent**, and the work that mattered was making failure loud.',
      differently:
        'I would put **resource policy into the naming contract on day one**. We got names right and left CPU limits to each team, which is how a load test ended up restarting pods and how the verifier passed a collection interval documented as 2 hours and coded as 4, because it checks names rather than values. The refinement closed both ends of that: limits came out of all six services, and the verifier now compares two numbers across repositories as well as two names. I would also **rebuild from zero much earlier**. Doing it in the last stretch is what exposed the empty secret key, the imageless ECR repository and the CUR bucket migration, and every one of those was a gap in a runbook I believed was finished. The fix was to stop being the person who checked it, and the three places a teammate got stuck were all steps I had been doing without noticing I was doing them. **Wiring OpenCost to the CUR** got done too, and it is the one I would most like the time back on: it took three separate permission failures, none of which a plan or a review could have found, because each one only appeared when something actually ran. That is the same lesson as the account guard in a different costume, and I had already learnt it once. What is still open is **parallelising around the IRSA bottleneck** I could see coming and scheduled around anyway, leaving three tracks waiting on one. Leading six people across four repositories meant the fastest thing I could do for the project was usually not to write anything, which took me longer to accept than it should have.',
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
      how: 'Placeholder for what was actually built: the stack and the shape of it, in one sentence.',
      result: 'Placeholder for the outcome, with the figure that proves it. Replace once the metrics above are real.',
    },
    // placeholder
    role: 'Placeholder for the contribution line: one or two sentences on the part of this build that was mine.',
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
        keyword: 'Short keyword',
        title: 'The decision stated in one sentence.',
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
    // No `team` key: this is solo work, so the Members section and the Notion
    // link never render. That is the whole opt-out — nothing else to switch off.
    title: 'Project1-Self-Build',
    // The descriptive page heading. `title` above stays the short name the
    // sidebar shows and the eyebrow repeats.
    fullTitle: 'Self-Directed Study in Hybrid Cloud Infrastructure',
    accent: 'forest',
    // The same window as EchoChallengers above, because this was built
    // alongside it rather than after it: the team project's four servers by
    // day, my own copy of the same four in the evenings.
    period: 'April 20 – May 22, 2026',
    glance: {
      why: 'I owned the infrastructure build on EchoChallengers, which meant there were parts of the system I had reviewed without ever typing them out. So I kept my own repository alongside the team one and built the whole thing again by myself.',
      how: 'Four servers on VMware and four more on AWS, provisioned by Terraform, configured by 15 Ansible roles, joined into one network by Tailscale, and deployed by a single GitHub Actions workflow.',
      result: 'One push to `main` provisions the AWS side, configures every host, checks the load balancer, and destroys the whole environment again, so a full rehearsal costs about an hour of instance time.',
    },
    // Solo, so this is the whole scope rather than a slice of it. Prose rather
    // than the bento the team pages use: a tile grid divides a contribution
    // into parts, and there is nobody here to divide it from.
    role: 'Solo build from an empty repository. I wrote the Terraform, all 15 Ansible roles, the recovery webhook, the chaos script and the GitHub Actions workflow myself. Nothing here was copied across from the team repository.',
    context: {
      notes: [
        {
          size: 'lead',
          label: 'Why do it twice',
          text: 'Owning the infrastructure build on a five-person team meant some parts of the system reached me as a pull request to review rather than as something I had written. Building the whole thing alone was the fastest way to find out which parts those were.',
        },
        {
          size: 'lead',
          label: 'The rule I set',
          text: 'I started from an empty repository and wrote every file again from scratch, so the architecture is familiar and the code is my own. Where I could not remember how something worked, I had to go and read the documentation.',
        },
        {
          size: 'support',
          label: 'What I added',
          text: 'The team chose to spend its last week rehearsing the demo rather than building a pipeline, so this repository is where the CI/CD went. One GitHub Actions workflow runs the checks, builds the image, deploys to both environments and tears the AWS side down.',
        },
        {
          size: 'support',
          label: 'What I kept simple',
          text: 'The recovery service is a small FastAPI webhook that maps an alert name to the command that recovers it and runs that command over SSH. It handles two alerts, one container and one systemd unit, and that was enough to prove the loop closes.',
        },
        {
          size: 'support',
          label: 'Where it stops',
          text: 'This is a study build. Secrets sit in GitHub Actions secrets rather than in a vault, Terraform state is local, and the environment is expected to live for the length of a workflow run.',
        },
      ],
    },
    // Every figure below is counted from the repository tree rather than
    // estimated: 33 `resource` blocks across terraform/*.tf, 15 directories
    // under roles/, 17 playbooks, 7 failure cases in chaos/inject.sh besides
    // `all` and `status`, 4 rules in monitoring/alert.rules.yml and 6 alarms
    // in terraform/cloudwatch.tf.
    metrics: [
      { size: 'big', value: '33', label: 'Terraform Resource Blocks' },
      { size: 'square', value: '15', label: 'Ansible Roles' },
      { size: 'square', value: '17', label: 'Playbooks' },
      {
        size: 'square',
        value: '7',
        label: 'Failure Injections',
        hint: 'Failure cases chaos/inject.sh can trigger on demand',
      },
      {
        size: 'wide',
        value: '2',
        label: 'Environments',
        detail: 'VMware and AWS, from one set of roles',
      },
      {
        size: 'square',
        value: '10',
        label: 'Alerts Wired',
        hint: '4 Prometheus rules and 6 CloudWatch alarms',
      },
    ],
    stack: [
      { category: 'Cloud/Infrastructure', items: ['AWS', 'VMware', 'Tailscale', 'Cloudflare'] },
      { category: 'IaC/Automation', items: ['Terraform', 'Ansible', 'GitHub Actions', 'Bash'] },
      { category: 'OS/Runtime', items: ['Rocky Linux', 'Ubuntu', 'Python', 'Docker'] },
      { category: 'Application', items: ['FastAPI', 'PostgreSQL', 'Nginx', 'HAProxy'] },
      {
        category: 'Monitoring',
        items: ['Prometheus', 'Grafana', 'Alertmanager', 'Node Exporter', 'CloudWatch'],
      },
      { category: 'Notifications', items: ['Slack', 'Telegram'] },
    ],
    stackNotes: [
      {
        tool: 'Why Tailscale?',
        icon: 'Tailscale',
        text: 'Every instance joins the mesh from its own `user_data` script, before Ansible ever runs. The GitHub Actions runner joins the same mesh with an OAuth key, so it addresses a private EC2 instance by a **100.x address** and needs no jump host.',
      },
      {
        tool: 'Why GitHub Actions?',
        icon: 'GitHub Actions',
        text: 'The team project ended without a pipeline, so building one was half the point of this repository. A hosted runner drives AWS and a **self-hosted runner** on the on-premises mgmt node drives VMware, from the same workflow file.',
      },
      {
        tool: 'Why Docker for FastAPI?',
        icon: 'Docker',
        text: 'The first version ran uvicorn under systemd and needed a compiler toolchain on every web server just to build `psycopg2`. Moving the app into an image built once in CI made the two web servers **interchangeable**, and Nginx stayed on the host as a plain reverse proxy.',
      },
      {
        tool: 'Why keep HAProxy?',
        icon: 'HAProxy',
        text: 'On VMware there is no ALB, so HAProxy is the load balancer. On AWS it stays on the mgmt node with its **stats page on :8404**, which is what lets the on-premises and AWS deployments run the same roles.',
      },
    ],
    // Five files, chosen the way the team pages choose theirs: each one has to
    // carry part of the page's argument rather than fill out an inventory. The
    // `path` on each is where the file lives in the repository, which is not
    // always where it sits under `code/` — the workflow is one directory deep
    // here and three there, and the display path is the true one.
    terraform: [
      { path: 'terraform/main.tf', content: ipoMainTf },
      { path: '.github/workflows/deploy.yml', content: ipoWorkflow },
      { path: 'recovery/webhook_server.py', content: ipoWebhook },
      { path: 'terraform/mgmt_bootstrap.sh', content: ipoMgmtBootstrap },
      { path: 'roles/nginx_selfheal/tasks/main.yml', content: ipoSelfheal },
    ],
    // The two halves of the question the Alert-to-restart diagram answers:
    // what has to be true before anything fires, and where it goes once it
    // does. `alertmanager.yml` is the more interesting of the pair, because
    // the `continue: true` on both severity routes is why one alert reaches
    // Slack and Telegram and the webhook without being three alerts.
    recoveryPolicy: [
      { path: 'monitoring/alert.rules.yml', content: ipoAlertRules },
      { path: 'monitoring/alertmanager.yml', content: ipoAlertmanager },
    ],
    // Three views, drawn from data in the same vocabulary as the team pages:
    // zones underneath, nodes placed by their centres, edges routed
    // orthogonally, one accent carried by the glyphs and nothing else.
    //
    // Every label traces to the repository. The CIDRs, instance types and the
    // ALB health check come from terraform/, the ports and intervals from
    // monitoring/ and recovery/webhook_server.py, and the job order in the
    // third view from .github/workflows/deploy.yml.
    architecture: [
      {
        tab: 'Two environments',
        caption:
          'Hybrid four-server topology (on-premise & AWS) joined over Tailscale',
        alt: 'Four VMware hosts on 192.168.61.0/24 across the top: proj-mgmt running HAProxy, Prometheus and Ansible, proj-rocky1 and proj-rocky2 running Nginx and FastAPI, and proj-ubuntu1 running PostgreSQL. Below them a Tailscale mesh that the GitHub Actions runner joins with an OAuth key. Below that an AWS VPC in ap-northeast-2 holding the same four machines: an ALB, aws-mgmt and a NAT gateway in the public subnets across two availability zones, and aws-rocky1, aws-ubuntu1 and aws-rocky2 in the private subnets.',
        diagram: {
          width: 1000,
          height: 700,
          zones: [
            // Dashed and outside the provider, the convention every other
            // diagram on this site already uses for anything that is not AWS.
            { id: 'onprem', label: 'On-premises · VMware', note: '192.168.61.0/24', x: 20, y: 24, w: 960, h: 172, tone: 'onprem' },
            { id: 'aws', label: 'AWS · ap-northeast-2', note: 'VPC 10.0.0.0/16', x: 20, y: 318, w: 960, h: 320, tone: 'cloud' },
            // Short labels on purpose: a zone label owns the strip along its
            // own top edge, and the CIDRs are long enough that spelling them
            // out here would block the lane the ALB descends through.
            { id: 'pub', label: 'Public subnets', note: '2 AZs', x: 38, y: 376, w: 924, h: 110, tone: 'region' },
            { id: 'priv', label: 'Private subnets', note: '2 AZs', x: 38, y: 502, w: 924, h: 118, tone: 'region' },
          ],
          nodes: [
            { id: 'projmgmt', label: 'proj-mgmt', sub: 'HAProxy · Prometheus · Ansible', glyph: 'monitor', x: 160, y: 136, w: 250, h: 56 },
            { id: 'projrocky1', label: 'proj-rocky1', sub: 'Nginx · FastAPI', glyph: 'server', x: 415, y: 136, w: 195, h: 56 },
            { id: 'projrocky2', label: 'proj-rocky2', sub: 'Nginx · FastAPI', glyph: 'server', x: 625, y: 136, w: 195, h: 56 },
            { id: 'projubuntu1', label: 'proj-ubuntu1', sub: 'PostgreSQL', glyph: 'database', x: 845, y: 136, w: 195, h: 56 },

            { id: 'runner', label: 'GitHub Actions runner', sub: 'joins with an OAuth key', glyph: 'pipeline', x: 165, y: 252, w: 250, h: 56 },
            { id: 'tailnet', label: 'Tailscale mesh', sub: 'every host gets a 100.x address', glyph: 'vpn', x: 560, y: 252, w: 320, h: 56 },

            { id: 'alb', label: 'ALB', sub: 'HTTP 80 · /health every 15s', glyph: 'balancer', x: 210, y: 432, w: 240, h: 52 },
            { id: 'awsmgmt', label: 'aws-mgmt', sub: 'HAProxy · Prometheus · Grafana', glyph: 'monitor', x: 560, y: 432, w: 300, h: 52 },
            { id: 'nat', label: 'NAT gateway', sub: 'private egress', glyph: 'cloud', x: 845, y: 432, w: 200, h: 52 },

            { id: 'awsrocky1', label: 'aws-rocky1', sub: 'Nginx · FastAPI in Docker', glyph: 'server', x: 210, y: 574, w: 240, h: 52 },
            { id: 'awsdb', label: 'aws-ubuntu1', sub: 'PostgreSQL · appdb', glyph: 'database', x: 560, y: 574, w: 300, h: 52 },
            { id: 'awsrocky2', label: 'aws-rocky2', sub: 'Nginx · FastAPI in Docker', glyph: 'server', x: 840, y: 574, w: 230, h: 52 },
          ],
          edges: [
            // Both environments and the runner meet on the tailnet. One line
            // each, because every host is on it and drawing all nine would say
            // the same thing nine times.
            { from: 'projmgmt', to: 'tailnet', label: 'ansible', labelAt: [330, 194], dash: true, dir: 'both', via: [[160, 200], [560, 200]] },
            { from: 'runner', to: 'tailnet', label: 'OAuth', dash: true },
            { from: 'tailnet', to: 'awsmgmt', dash: true, dir: 'both' },
            // The ALB fans out along the gap between the two subnet bands,
            // which is the only lane clear of both zone labels.
            { from: 'alb', to: 'awsrocky1' },
            { from: 'alb', to: 'awsrocky2', via: [[210, 494], [840, 494]] },
            { from: 'awsrocky1', to: 'awsdb', label: 'SQL 5432' },
            { from: 'awsrocky2', to: 'awsdb' },
            { from: 'awsdb', to: 'nat', label: 'egress', labelAt: [742, 512], dash: true, via: [[720, 574], [720, 432]] },
          ],
          captions: [
            {
              x: 20,
              y: 660,
              tone: 'accent',
              text: 'One inventory file per environment and one set of 15 roles. The AWS run swaps hosts.ini for hosts_aws_ts.ini and nothing else changes.',
            },
            {
              x: 20,
              y: 682,
              text: 'Public subnets are 10.0.1.0/24 and 10.0.2.0/24, private are 10.0.11.0/24 and 10.0.12.0/24. All four instances are t4g.small on Graviton.',
            },
          ],
        },
      },
      {
        tab: 'Alert to restart',
        caption:
          'Alert routing and automated recovery',
        alt: 'A four-band pipeline. Detect: node exporters on port 9100 and FastAPI metrics on port 8000 are scraped by Prometheus every 15 seconds against four alert rules, which reach Alertmanager. Route: Alertmanager sends every alert to Slack and to a Telegram bridge on port 9087, and critical alerts also to the recovery webhook on port 9080. Recover: the webhook matches the alert name and job against its two maps, then either restarts the fastapi container with docker or the node_exporter unit with systemctl over SSH, or flags the alert for manual checking. Report: the outcome is written to /var/log/recovery.log and posted back to Slack.',
        diagram: {
          width: 1000,
          height: 700,
          // Four bands rather than four columns: a phase is a horizontal slice
          // of the flow, and a band says so without spending a column on it.
          zones: [
            { id: 'detect', label: 'Detect', note: 'scrape 15s', x: 20, y: 20, w: 960, h: 140, tone: 'region' },
            { id: 'route', label: 'Route', note: 'alertmanager.yml', x: 20, y: 184, w: 960, h: 120, tone: 'region' },
            // The band the project is actually about.
            { id: 'recover', label: 'Recover', note: 'webhook_server.py', x: 20, y: 328, w: 960, h: 170, tone: 'focus' },
            { id: 'report', label: 'Report', x: 20, y: 522, w: 960, h: 86, tone: 'region' },
          ],
          nodes: [
            { id: 'exporters', label: 'Node exporter', sub: ':9100 × 4 hosts', glyph: 'service', x: 160, y: 78, w: 250, h: 44 },
            { id: 'appmetrics', label: 'FastAPI /metrics', sub: ':8000 × 2 hosts', glyph: 'service', x: 160, y: 130, w: 250, h: 44 },
            { id: 'prometheus', label: 'Prometheus', sub: '4 rules · 15s eval', glyph: 'monitor', x: 500, y: 104, w: 220, h: 52 },
            { id: 'alertmanager', label: 'Alertmanager', sub: 'group_wait 5s', glyph: 'alert', x: 800, y: 104, w: 240, h: 52 },

            // Three destinations, each labelled by the channel rather than by
            // the process serving it. `prometheus_bot :9087` as the headline
            // read as a service next to a node headlined `Slack`, so the row
            // looked like one notification channel and two other things.
            { id: 'slack', label: 'Slack', sub: '#all-mindmug · every severity', glyph: 'chat', x: 165, y: 258, w: 260, h: 52 },
            { id: 'tgbot', label: 'Telegram', sub: 'prometheus_bot :9087', glyph: 'chat', x: 500, y: 258, w: 260, h: 52 },
            { id: 'webhook', label: 'Recovery webhook', sub: ':9080 · critical only', glyph: 'pipeline', x: 835, y: 258, w: 270, h: 52 },

            { id: 'lookup', label: 'Match alertname and job', sub: 'RECOVERY_MAP · HOST_MAP', glyph: 'wrench', x: 500, y: 386, w: 420, h: 54 },
            // Two commands rather than one, because the two services are not
            // the same kind of thing: FastAPI is a container and node_exporter
            // is a systemd unit. RECOVERY_MAP carries the command beside the
            // name for exactly that reason.
            { id: 'restart', label: 'Restart over SSH', sub: 'docker restart · systemctl restart', glyph: 'server', x: 320, y: 462, w: 300, h: 44 },
            { id: 'unknown', label: 'No mapping found', sub: 'flagged for manual check', glyph: 'alert', x: 720, y: 462, w: 300, h: 44 },

            { id: 'log', label: '/var/log/recovery.log', sub: 'start, result, failure', glyph: 'service', x: 300, y: 574, w: 320, h: 48 },
            { id: 'result', label: 'Slack result message', sub: 'recovered or failed', glyph: 'chat', x: 700, y: 574, w: 320, h: 48 },
          ],
          edges: [
            { from: 'exporters', to: 'prometheus' },
            { from: 'appmetrics', to: 'prometheus' },
            { from: 'prometheus', to: 'alertmanager', label: 'for: 30s' },
            // One alert leaves Alertmanager on a single stem and splits in the
            // gutter between the bands, which is what the routing config does.
            { from: 'alertmanager', to: 'slack', via: [[800, 172], [165, 172]] },
            { from: 'alertmanager', to: 'tgbot', via: [[800, 172], [500, 172]] },
            { from: 'alertmanager', to: 'webhook', label: 'severity: critical', labelAt: [880, 166], via: [[800, 172], [835, 172]] },
            { from: 'webhook', to: 'lookup' },
            { from: 'lookup', to: 'restart' },
            { from: 'lookup', to: 'unknown' },
            { from: 'restart', to: 'log' },
            { from: 'restart', to: 'result', via: [[320, 510], [700, 510]] },
            { from: 'unknown', to: 'result' },
          ],
          captions: [
            {
              x: 20,
              y: 640,
              tone: 'accent',
              text: 'The webhook restarts a service only when both maps match. Anything it does not recognise is logged and passed to a person instead of guessed at.',
            },
            {
              x: 20,
              y: 662,
              text: 'Slack and Telegram both receive every alert. Only Slack receives the recovery result, because that message is posted by the webhook rather than by Alertmanager.',
            },
            {
              x: 20,
              y: 684,
              text: 'Nginx sits outside this flow. It carries a Restart=always systemd drop-in, so systemd brings it back in about 5 seconds and no alert ever fires.',
            },
          ],
        },
      },
      {
        tab: 'One workflow',
        caption:
          'One GitHub workflow that always ends on a terraform destroy',
        alt: 'A pipeline triggered by a push to main. Job 1 parses main.py and every playbook and role YAML file. Job 2 builds the FastAPI image and pushes it tagged latest and by commit sha. Job 3A runs on a self-hosted runner: git pull on proj-mgmt, ansible-playbook site.yml against hosts.ini, and a curl of /health. Job 3B runs on a hosted runner: terraform apply of 33 resource blocks, the runner joining the tailnet, ansible-playbook site_aws.yml, a curl of the ALB /health, and terraform destroy, which runs even when an earlier step fails.',
        diagram: {
          width: 1000,
          height: 700,
          // One band per job, and the two deploy jobs side by side because
          // that is how they run: both wait on the image and then go at once.
          zones: [
            { id: 'j1', label: 'Job 1 · Code checks', x: 20, y: 96, w: 960, h: 96, tone: 'region' },
            { id: 'j2', label: 'Job 2 · Build and push', x: 20, y: 212, w: 960, h: 96, tone: 'region' },
            { id: 'j3a', label: 'Job 3A · On-prem', note: 'self-hosted runner', x: 20, y: 328, w: 466, h: 240, tone: 'region' },
            { id: 'j3b', label: 'Job 3B · AWS', note: 'ubuntu-latest', x: 514, y: 328, w: 466, h: 300, tone: 'focus' },
          ],
          nodes: [
            { id: 'push', label: 'push to main', sub: '.github/workflows/deploy.yml', glyph: 'git', x: 500, y: 60, w: 300, h: 48 },
            { id: 'checks', label: 'ast.parse and yaml.safe_load', sub: 'every playbook and role', glyph: 'shield', x: 500, y: 152, w: 560, h: 44 },
            { id: 'image', label: 'docker build and push', sub: 'tagged latest and commit sha', glyph: 'container', x: 500, y: 268, w: 560, h: 44 },

            { id: 'gitpull', label: 'git pull on proj-mgmt', glyph: 'git', x: 253, y: 390, w: 400, h: 44 },
            { id: 'ansibleop', label: 'ansible-playbook site.yml', sub: 'hosts.ini · 15 roles', glyph: 'wrench', x: 253, y: 458, w: 400, h: 44 },
            { id: 'healthop', label: 'curl /health on proj-mgmt', glyph: 'shield', x: 253, y: 526, w: 400, h: 44 },

            { id: 'tfapply', label: 'terraform apply', sub: '33 resource blocks', glyph: 'cloud', x: 747, y: 386, w: 400, h: 40 },
            { id: 'tsjoin', label: 'runner joins the tailnet', sub: 'reads each 100.x address', glyph: 'vpn', x: 747, y: 442, w: 400, h: 40 },
            { id: 'ansibleaws', label: 'ansible-playbook site_aws.yml', glyph: 'wrench', x: 747, y: 498, w: 400, h: 40 },
            { id: 'albcheck', label: 'curl the ALB /health', glyph: 'balancer', x: 747, y: 554, w: 400, h: 40 },
            { id: 'destroy', label: 'terraform destroy', sub: 'runs even when a step fails', glyph: 'chaos', x: 747, y: 604, w: 400, h: 40 },
          ],
          edges: [
            { from: 'push', to: 'checks' },
            { from: 'checks', to: 'image' },
            { from: 'image', to: 'gitpull', via: [[500, 316], [253, 316]] },
            { from: 'image', to: 'tfapply', via: [[500, 316], [747, 316]] },
            { from: 'gitpull', to: 'ansibleop' },
            { from: 'ansibleop', to: 'healthop' },
            { from: 'tfapply', to: 'tsjoin' },
            { from: 'tsjoin', to: 'ansibleaws' },
            { from: 'ansibleaws', to: 'albcheck' },
            { from: 'albcheck', to: 'destroy', label: 'if: always()', labelAt: [862, 582] },
          ],
          captions: [
            {
              x: 20,
              y: 660,
              tone: 'accent',
              text: 'Both deploy jobs wait on the image build and then run in parallel, so one push updates VMware and AWS from the same commit.',
            },
            {
              x: 20,
              y: 682,
              text: 'Slack and Telegram get a message at every outcome: on-prem success, AWS success, destroy complete, and either failure.',
            },
          ],
        },
      },
    ],
    // The same span as EchoChallengers, split by what this repository was
    // actually built in the order of: hosts first, then the things that watch
    // them, then the cloud copy, then the pipeline over both.
    implementation: {
      months: ['2026-04', '2026-05'],
      span: { from: '2026-04-20', to: '2026-05-22' },
      phases: [
        {
          id: 'onprem',
          title: 'On-Premises Base',
          range: 'Apr 20–May 3',
          from: '2026-04-20',
          to: '2026-05-03',
          text: 'Four VMware machines, then the first roles: PostgreSQL on Ubuntu, Nginx and FastAPI on the two Rocky hosts, and HAProxy on mgmt. This first version ran uvicorn under systemd and needed a compiler toolchain on both web servers.',
        },
        {
          id: 'monitoring',
          title: 'Monitoring and Recovery',
          range: 'May 4–10',
          from: '2026-05-04',
          to: '2026-05-10',
          text: 'Node Exporter on every host, Prometheus and Alertmanager on mgmt, four alert rules, and the FastAPI webhook that restarts a service over SSH when a critical alert fires. Nginx got a Restart=always drop-in instead of a place in that pipeline.',
        },
        {
          id: 'aws',
          title: 'AWS and Tailscale',
          range: 'May 11–17',
          from: '2026-05-11',
          to: '2026-05-17',
          text: 'Terraform for the VPC, the subnets, the four instances, the ALB and the CloudWatch alarms, with Tailscale installed from user_data so every instance is addressable before Ansible runs. Moving to arm64 here is what broke the binary downloads.',
        },
        {
          id: 'pipeline',
          title: 'Pipeline and Chaos',
          range: 'May 18–22',
          from: '2026-05-18',
          to: '2026-05-22',
          text: 'The GitHub Actions workflow that runs the checks, builds the image, deploys both environments and destroys the AWS side, plus chaos/inject.sh so the recovery path can be triggered on demand rather than waited for.',
        },
      ],
    },
    // Seven scenarios read as one argument rather than seven demonstrations:
    // the system at rest, then four failures ordered by how much machinery
    // each recovery needs, then the same loop on the cloud side.
    //
    // An eighth tab covered the health endpoint returning 200 with the
    // database stopped. It was cut deliberately: on a page of recoveries that
    // work, a tab whose whole content is a thing that does not reads as a
    // weakness rather than as the honesty it was meant to be. The gap itself
    // is still owned, in the reflection at the foot of the page, which is
    // where a limitation belongs.
    //
    // Four tabs carry no clip and none of them is missing one. The nginx step
    // is in the recording, but the pane holding its `watch` loop is never on
    // screen, so the capture in that tab is the only proof the unit came back.
    // The AWS side was never recorded at all. Every tab carries a `lead`, so
    // a tab explains itself whether or not it moves.
    media: {
      clipNote:
        'Cut from one screen recording of the on-premises run, at 1440 rather than 1280 because four panes of console text are what there is to read. Silent, and it loops.',
      // Said once, because a reader who compares two stills will notice the
      // clocks before the page gets a chance to explain them.
      stillsNote:
        'Full-resolution captures from several runs of the same environment across two days, so the clocks in them do not line up with each other or with the clips. Click one to open it at full size.',
      scenarios: [
        {
          id: 'baseline',
          tab: 'Baseline',
          label: 'Scenario 1: Baseline monitoring across both environments',
          lead:
            'Seven jobs up on both environments. On VMware Prometheus reaches them at `192.168.61.x`. On AWS it reaches the same seven at **100.x** over the Tailscale mesh, with no jump host in between.',
          before: {
            src: '/projects/project1-self-build/demo-01-onprem-targets.png',
            state: 'Prometheus has all seven jobs up on the VMware hosts',
            alt: 'The Prometheus targets page for the VMware environment, listing fastapi-rocky1 and fastapi-rocky2 on port 8000, node-mgmt, node-rocky1, node-rocky2 and node-ubuntu1 on port 9100, and Prometheus scraping itself, every one of them 1/1 up and labelled environment="onprem"',
          },
          after: {
            src: '/projects/project1-self-build/demo-02-aws-targets.png',
            state: 'The same seven jobs report up over the Tailscale mesh',
            alt: 'The Prometheus targets page for the AWS environment, listing the same seven jobs all 1/1 up and labelled environment="aws", with every endpoint addressed by a 100.x Tailscale address rather than a VPC address, except node-mgmt which Prometheus reaches on 10.0.1.206 because it runs on the same host',
          },
        },
        {
          id: 'terraform',
          tab: 'Terraform',
          label: 'Scenario 2: The AWS environment under Terraform',
          lead:
            'Four `t4g.small` instances across two availability zones, and the application answering through the ALB. Everything here is created and destroyed inside **one workflow run**.',
          before: {
            src: '/projects/project1-self-build/demo-03-ec2-instances.png',
            state: 'Four instances run across two availability zones',
            alt: 'The EC2 console listing four running teamproject01 instances, all t4g.small with 3/3 status checks passed, three in availability zone ap-northeast-2a and one in 2b, with no instance alarms and EC2 service health operating normally',
          },
          after: {
            src: '/projects/project1-self-build/demo-04-app-through-alb.png',
            state: 'The ALB serves the FastAPI landing page',
            alt: 'The application landing page headed "Cloud Infrastructure Project" with a green Live status pill, four API endpoints listed as interactive docs, health check, list items and Prometheus metrics, and a tech stack row reading Docker, FastAPI, PostgreSQL, Nginx and Cloudflare',
          },
        },
        {
          id: 'nginx-selfheal',
          tab: 'Nginx self-heal',
          label: 'Scenario 3: Nginx self-healing through systemd',
          lead:
            '`sudo pkill nginx` on rocky1, sampled every half second. systemd holds the unit in `activating` for five seconds and brings it back on a **new PID**. Nothing else in the stack takes part, and no rule ever fires.',
          // The only tab whose capture is from a different day than everything
          // else here, which the section note already covers in general and
          // this one names, because the reader can read the date off the
          // status output itself.
          stillsNote:
            'Captured the day after the other stills, on the same build. Click it to open at full size.',
          before: {
            src: '/projects/project1-self-build/demo-05-nginx-selfheal.png',
            state:
              'systemd brings nginx back six seconds after the kill',
            alt: 'Two panels of terminal output. The first is headed nginx self-heal for proj-rocky01 at 192.168.61.134, subtitled Restart=always, RestartSec=5s, sampled every 0.5s after sudo pkill nginx, and lists the unit state at half-second intervals: active on main PID 5184 at t=0, activating with no main PID from t=1.0 through t=5.5, and active again on main PID 7149 at t=6.0, closing with the line "healed: new PID 7149 (was 5184)". The second panel is systemctl status nginx taken straight afterwards, showing the drop-in at /etc/systemd/system/nginx.service.d/restart.conf, the unit active and running for 14 seconds, main PID 7149, and a control group holding one master and two worker processes',
          },
        },
        {
          id: 'backend-down',
          tab: 'Backend down',
          label: 'Scenario 4: HAProxy backend failover',
          lead:
            'rocky1 stops answering and HAProxy marks it **DOWN** on the next L4 check. The backend stays up on rocky2, so the site keeps serving while one of the two web servers is gone.',
          before: {
            src: '/projects/project1-self-build/demo-06-haproxy-both-up.png',
            state: 'HAProxy has both app servers up and serving',
            alt: 'The HAProxy statistics report for the app_servers backend, with rocky1 and rocky2 both on a green UP row, each last checked L7OK/200 in around 35 milliseconds, and the backend line reading 2/2 active servers',
          },
          after: {
            src: '/projects/project1-self-build/demo-07-haproxy-backend-down.png',
            state: 'HAProxy drops rocky1 and keeps serving on rocky2',
            alt: 'The same HAProxy statistics report with the rocky1 row turned red and reading DOWN after an L4CON connection failure, 2 minutes 45 seconds of downtime recorded against it, while rocky2 stays green and the backend line reads 1/1 active servers and keeps serving',
          },
        },
        {
          id: 'cpu-overload',
          tab: 'CPU overload',
          label: 'Scenario 5: CPU threshold alerting to Slack',
          lead:
            '`chaos/inject.sh cpu1` pins rocky1 at **100%**. HighCPU waits out its one minute window, fires, and reaches Slack. Nothing restarts, because a busy CPU is a warning rather than something the webhook should act on.',
          clip: {
            src: '/projects/project1-self-build/clip-01-cpu-alert.mp4',
            width: 1440,
            height: 904,
            poster: '/projects/project1-self-build/clip-01-cpu-alert.jpg',
            speed: '6x',
            alt: 'Four panes at once. The CPU gauge on rocky1 sits at 100 percent while the Prometheus alert list is still all green, then HighCPU turns pink and the rule group badge flips to firing, a Slack message arrives reading High CPU on onprem-rocky1 at 100 percent, and once the load falls away the rule returns to inactive and a resolved message follows it at 63.9 percent',
          },
          before: {
            src: '/projects/project1-self-build/demo-08-cpu-node-exporter.png',
            state: 'rocky1 sits at 100 percent CPU under the stress run',
            alt: 'The Node Exporter Full dashboard for proj-rocky01, its CPU Busy gauge at 100 percent in the red band, system load at 81.5 percent, RAM at 19.1 percent and root filesystem at 32.8 percent, with the CPU Basic chart underneath climbing from flat to full in the last two minutes',
          },
          after: {
            src: '/projects/project1-self-build/demo-09-highcpu-firing.png',
            state: 'HighCPU fires while the other three rules stay inactive',
            alt: 'The Prometheus alerts page for project_alerts, showing three inactive rules and one firing: FastAPIDown, NodeDown and HighMemory all on green rows reading 0 active, and HighCPU on a pink row reading 1 active',
          },
        },
        {
          id: 'container-recovery',
          tab: 'Container recovery',
          label: 'Scenario 6: Automated container recovery',
          lead:
            'The container is stopped on rocky1. FastAPIDown fires as **critical**, Alertmanager sends it to Slack and to the webhook at the same time, and the webhook restarts the container over SSH. The alert clears on the next scrape.',
          clip: {
            src: '/projects/project1-self-build/clip-02-recovery.mp4',
            width: 1440,
            height: 904,
            poster: '/projects/project1-self-build/clip-02-recovery.jpg',
            speed: '3x',
            alt: 'The FastAPIDown rule expanded in Prometheus, showing severity critical and a thirty second window, then the rule going active while Slack receives the critical alert, a line saying automatic recovery has started on 192.168.61.134, and a line saying recovery is complete, after which the alert list returns to all four rules inactive',
          },
          before: {
            src: '/projects/project1-self-build/demo-10-fastapidown-firing.png',
            state: 'FastAPIDown goes active and the other three stay quiet',
            alt: 'The Prometheus alerts page for project_alerts with FastAPIDown on a pink row reading 1 active, and NodeDown, HighCPU and HighMemory all on green rows reading 0 active, with the filter bar counting three inactive, none pending and one firing',
          },
          after: {
            src: '/projects/project1-self-build/demo-11-alertmanager-fanout.png',
            state: 'Alertmanager hands the same alert to two receivers',
            alt: 'The Alertmanager alerts page showing the same FastAPIDown alert grouped twice, once under the slack-and-recovery receiver and once under telegram, each reading one alert, which is what the continue flag on the severity routes produces',
          },
        },
        {
          id: 'aws-recovery',
          tab: 'Recovery on AWS',
          label: 'Scenario 7: Automated recovery on AWS',
          lead:
            'The AWS run posts the whole sequence into one channel: the critical alert, the recovery starting, **one attempt that failed** and asked for a person, then the retry that finished. HighCPU fires and resolves underneath it.',
          before: {
            src: '/projects/project1-self-build/demo-12-aws-slack-thread.png',
            state:
              'The AWS thread runs from alert to failed attempt to recovery',
            alt: 'The Slack channel all-mindmug holding the AWS recovery sequence in order: several [AWS][CRITICAL] FastAPIDown alerts naming aws-rocky1 in ap-northeast-2, a line saying automatic recovery has started against 100.83.68.94, a line reporting the recovery failed and needs manual intervention, a second recovery start, a line reporting recovery complete, and below them an [AWS][FIRING] HighCPU at 100 percent followed by its [AWS][RESOLVED] at 67.6 percent',
          },
          after: {
            src: '/projects/project1-self-build/demo-13-aws-selfheal-board.png',
            state: 'The self-healing board shows the same event on AWS',
            alt: 'The self-healing demo dashboard pointed at the AWS environment, its CPU chart flat near zero across all four hosts, its mean response time dropping from about two minutes to zero, and its threshold event timeline marking the FastAPI Down rows for aws-rocky1 and aws-rocky2 as events against an otherwise normal band, while the four CPU rows stay normal throughout',
          },
        },
      ],
    },
    folderStructure: `
teamproject01-hybrid-cloud-infra/
├── terraform/
│   ├── main.tf                  # VPC, subnets, 4 instances, ALB
│   ├── variables.tf
│   ├── outputs.tf               # generates the Ansible inventory
│   ├── locals.tf
│   ├── cloudwatch.tf            # 6 alarms, SNS, dashboard
│   ├── tailscale.tf
│   ├── mgmt_bootstrap.sh        # user_data: subnet router
│   └── app_bootstrap.sh         # user_data: joins the tailnet
├── playbooks/
│   ├── site.yml                 # on-prem, imports 12 in a fixed order
│   ├── site_aws.yml             # AWS, Tailscale first
│   ├── docker_install.yml
│   ├── db.yml
│   ├── mgmt.yml
│   ├── docker_web.yml
│   ├── nginx_selfheal.yml
│   ├── monitoring.yml
│   ├── prometheus_bot.yml
│   ├── prometheus_connect.yml   # promtool check, then restart
│   ├── recovery_service.yml
│   ├── cloudflared.yml
│   ├── certbot.yml
│   └── notify.yml
├── roles/                       # 15 roles, tasks and handlers each
│   ├── docker/
│   ├── docker_fastapi/          # image build, container, app/
│   ├── nginx/
│   ├── nginx_selfheal/          # Restart=always drop-in
│   ├── postgresql/
│   ├── haproxy/
│   ├── node_exporter/
│   ├── monitoring/              # Prometheus, Grafana, Alertmanager
│   ├── prometheus_bot/          # compiled from source for arm64
│   ├── recovery_service/
│   ├── tailscale/
│   ├── cloudflared/
│   ├── certbot/
│   ├── fastapi/                 # the systemd version, kept for reference
│   └── telegram/
├── inventory/
│   ├── hosts.ini                # VMware, 192.168.61.133-136
│   └── hosts_aws_ts.ini         # AWS, rewritten by the workflow
├── monitoring/
│   ├── prometheus.yml
│   ├── prometheus_aws.yml.j2
│   ├── alert.rules.yml          # 4 rules
│   ├── alertmanager.yml         # 3 receivers
│   ├── docker-compose.yml
│   └── grafana/dashboards/
│       └── project1-selfheal.json   # the 3-panel demo board
├── recovery/
│   ├── webhook_server.py        # :9080, alert name to a restart command
│   └── scripts/
│       └── restart_service.sh
├── chaos/
│   └── inject.sh                # 7 failures, plus all and status
├── .github/workflows/
│   └── deploy.yml               # checks, image, on-prem, AWS, destroy
├── ansible.cfg
├── deploy_aws.sh                # the same flow, run by hand
└── README.md
`,
    decisions: [
      {
        keyword: 'Destroy every run',
        title: 'The AWS half of the pipeline tears itself down at the end of every run.',
        glyph: 'pipeline',
        chose: 'A `terraform destroy` step marked `if: always()`',
        over: 'leaving the environment running between runs',
        why: 'This is a study environment, and an idle NAT gateway bills by the hour whether anything routes through it or not. Making destroy unconditional means a **failed run costs the same as a successful one**. The trade is that nothing survives a run, so every debugging session starts from an empty account.',
      },
      {
        keyword: 'Tailscale, no jump host',
        title: 'The CI runner reaches private instances over a Tailscale mesh instead of hopping through mgmt.',
        glyph: 'route',
        chose: 'A **Tailscale mesh** joined from `user_data`, with the runner joining by OAuth',
        over: '`ProxyJump` through the mgmt node on every Ansible task',
        why: 'The first version used ProxyJump, so every task paid for a second SSH hop. That made a full playbook run slow and made one failed hop look like a broken host. Once mgmt advertises the VPC CIDR and the runner accepts routes, the runner talks to a private instance directly. The workflow keeps the ProxyJump path only for reading each Tailscale address on first boot.',
      },
      {
        keyword: 'Graviton everywhere',
        title: 'All four instances are arm64, which changed how several roles install their binaries.',
        glyph: 'depth',
        chose: '`t4g.small` on **Graviton** for all four instances',
        over: 'x86 instances, where every prebuilt binary already works',
        why: 'The instance is cheaper, and the cost of that showed up immediately. Node Exporter and Prometheus needed their download URLs switched on `ansible_architecture`, and `prometheus_bot` had **no arm64 image at all**, so its role installs Go and compiles the binary from source. That is the most useful thing this project taught me about reading somebody else’s install instructions.',
      },
      {
        keyword: 'systemd before webhooks',
        title: 'Nginx recovers through a systemd drop-in rather than through the alert pipeline.',
        glyph: 'process',
        chose: 'A `Restart=always` drop-in with `RestartSec=5s`',
        over: 'routing an Nginx alert through Alertmanager to the recovery webhook',
        why: 'systemd already knows the process died and can act in about **five seconds**. Sending that through Prometheus, Alertmanager and an SSH call would add a minute and three more things that can fail. The webhook is kept for failures systemd cannot see on its own, which is why it handles `FastAPIDown` and `NodeDown` and nothing else.',
      },
      {
        keyword: 'Container the app only',
        title: 'FastAPI runs in a container while Nginx and PostgreSQL stay on the host.',
        glyph: 'branch',
        chose: 'FastAPI in an image built once in CI, **Nginx and PostgreSQL on the host**',
        over: 'containerising the whole stack',
        why: 'The systemd version needed gcc, python3-devel and postgresql-devel on both web servers just to build `psycopg2`, which left room for the two hosts to drift apart. Building the image once in CI removed that. Nginx and PostgreSQL stayed on the host because containerising them would have added volumes, networks and a compose file for no gain at four servers.',
      },
      {
        keyword: 'One chaos script',
        title: 'A single failure-injection script covers both environments through one flag.',
        glyph: 'inject',
        chose: '`chaos/inject.sh --aws`, reading whichever inventory matches',
        over: 'a separate injection script per environment',
        why: 'The script discovers host addresses from the same inventory Ansible uses, so the two can never drift apart. `--aws` swaps the inventory file and adds the SSH key and ProxyJump options. `./inject.sh all` restores every service and `./inject.sh status` prints the state of all ten, which is what made rehearsing a failure cheap enough to do repeatedly.',
      },
    ],
    links: {
      github: null, // TODO: repository URL
      terraform: null, // TODO: <repo>/tree/main/terraform
      presentation: null,
    },
    reflection: {
      learned:
        'Building the same architecture a second time on my own showed me exactly which parts I had understood and which parts I had only reviewed. The **architecture** I could redraw from memory. The **install details** I could not: switching every binary download on `ansible_architecture`, compiling `prometheus_bot` from source because the published image is x86 only, and finding out that `httpd_can_network_connect` is why Nginx returns 502 when it proxies to a container under SELinux. The other lesson was about ordering. `site.yml` imports twelve playbooks and that order is load bearing, because Docker has to exist before the container role runs and Prometheus has to exist before its rules can be validated.',
      differently:
        'Terraform state is local, so a second machine cannot pick up where the first left off. An **S3 backend with a lock table** is the first thing I would add. I would also stop writing Tailscale addresses into an inventory file mid-run and use a **dynamic inventory** instead, since the current workflow spends several minutes polling each instance for its address. The recovery webhook covers two alert names and restarts a service once with no retry and no cooldown, which is enough to show the loop closes and short of something I would trust unattended.',
    },
  },

  {
    slug: 'individual-project-two',
    group: 'individual',
    // No `team` key: solo work, so the Members section and the Notion link
    // never render, the same opt-out individual-project-one uses.
    title: 'ShimonVault',
    // The descriptive page heading. `title` above stays the short name the
    // sidebar shows and the eyebrow repeats. Deliberately parallel to the
    // Lock-N-Lock title above: same brief, and "Event-Driven" against that
    // page's "Self-Healing" is the whole difference between the two builds.
    // Trimmed by one word from "...for a Hybrid Cloud Operations Platform",
    // which is a real constraint rather than a preference: at 93 characters it
    // wrapped to three lines where Lock-N-Lock's title, also 93 characters,
    // packs into two, and DESIGN.md's rule is to fix the type or the text and
    // never to widen a header past the content it heads. "Operations" was the
    // word the sentence could lose without losing a claim.
    fullTitle:
      'Event-Driven Security Detection and Automated Response for a Hybrid Cloud Platform',
    // Plum, the palette's eighth accent. Steel sat here first and was wrong
    // twice: it is a grey, so the eyebrow over the title read as uncoloured
    // where every other project page has a hue there, and it was already the
    // KT fellowship page's accent.
    accent: 'burgundy',
    // The same four weeks as Lock-N-Lock, because this was built alongside it
    // rather than after it: the team platform by day, my own copy of the same
    // brief in the evenings. The week boundaries below match that page's
    // schedule exactly.
    period: 'May 27 – June 24, 2026',
    glance: {
      why: 'I led Lock-N-Lock and owned the infrastructure track, so several parts of that platform reached me as a pull request to approve rather than as code I wrote. I built a second platform against the same brief, on my own, to find out which parts I actually understood.',
      how: 'ShimonVault is an internal operations platform with documents, meetings and a live audit stream, standing on 90 Terraform resource blocks: a two-AZ VPC, RDS, S3, DynamoDB, five Lambda functions, SNS and EventBridge, with the monitoring stack on my own on-premises server over Tailscale.',
      result: 'One dispatch of the CD workflow builds the image, launches a green instance, waits for it to pass the ALB health check and then moves the listener. Every attack this page claims to defend against can be fired from a button inside the admin console and watched land in the audit feed.',
    },
    // Solo, so this is the whole scope. Prose rather than the bento the team
    // pages use: a tile grid divides a contribution into parts, and there is
    // nobody here to divide it from.
    role: 'Solo build from an empty repository. I wrote the 27 Terraform files, the FastAPI application, the React console, the five Lambda handlers, the monitoring stack and both GitHub Actions workflows. The rule I set was that the brief could be the same as the team project and the mechanism had to be different, so nothing here is a copy of the Lock-N-Lock repository. Where the team ran a container and a controller on a VM, I had to pick the AWS service that owns that job and learn it properly.',
    context: {
      notes: [
        {
          size: 'lead',
          label: 'Why do it twice',
          text: 'Being team lead on Lock-N-Lock meant I reviewed more of that platform than I typed. Reviewing a pull request teaches you what a thing is called. Building it alone teaches you what breaks. This repository is where I found out the difference.',
        },
        {
          size: 'lead',
          label: 'The rule I set',
          text: 'Same brief, different mechanism. Lock-N-Lock answered every problem with a container on an EC2 instance. Here every problem had to be answered with the AWS service that owns it, so detection sits in application middleware, response sits in Lambda, scheduling sits in EventBridge and the audit trail sits in DynamoDB.',
        },
        {
          size: 'support',
          label: 'What the app is',
          text: 'Three modules on one FastAPI app. SecureDocs stores files in S3 with role-based access and 15-minute download links. ShimonMeet schedules meetings and hands each one a join token. AuditStream is the live feed of everything the other two did.',
        },
        {
          size: 'support',
          label: 'Where the security lives',
          text: 'One middleware sits outside every route and writes each request to DynamoDB, so no endpoint can forget to log. It also counts. Five access-denied responses from one account suspends the account. The first rate-limited download from an address writes an incident report to S3 and posts to Slack and Telegram.',
        },
        {
          size: 'support',
          label: 'The demo is in the product',
          text: 'The five attack simulations are admin-only endpoints inside the app rather than scripts on my laptop. Each one logs in as a real seeded account and calls real endpoints over HTTP, so the audit trail on screen is the actual application code running. `DEMO_ENABLED=false` turns all of them into 403s.',
        },
        {
          size: 'support',
          label: 'Where it stops',
          text: 'This is a study build. The environment is expected to live for the length of a session and `scripts/destroy.sh` takes it down again. Secrets are GitHub Actions secrets, the auto scaling group sits at `desired_capacity = 0` so it costs nothing while idle, and the test suite covers auth and audit and not much else.',
        },
      ],
    },
    // Every figure below is counted from the repository tree rather than
    // estimated: 90 `resource` blocks across 27 files in terraform/, 5
    // directories under lambda/ with a handler each, 26 `@router` decorators
    // across app/routers/, 13 members of AuditEventType in app/models.py, 5
    // POST routes in demo_router.py, and 4 rules in
    // monitoring/prometheus/rules/shimonvault.yml plus 5 aws_cloudwatch_metric_alarm
    // blocks across cloudwatch.tf and asg.tf.
    metrics: [
      { size: 'big', value: '90', label: 'Terraform Resource Blocks', hint: 'Across 27 .tf files' },
      {
        size: 'square',
        value: '5',
        label: 'Lambda Functions',
        hint: 'block_ip, log_incident, validate_file, meeting_notify, meeting_expire',
      },
      { size: 'square', value: '26', label: 'API Endpoints', hint: 'Across 6 routers' },
      {
        size: 'square',
        value: '9',
        label: 'Alerts Wired',
        hint: '4 Prometheus rules and 5 CloudWatch alarms',
      },
      {
        size: 'wide',
        value: '5',
        label: 'Attack Simulations',
        detail: 'Credential stuffing, access control, exfiltration, request flooding and a notification test, each firing real requests at real endpoints',
      },
      {
        size: 'square',
        value: '13',
        label: 'Audit Event Types',
        hint: 'Every one written to DynamoDB and PostgreSQL both',
      },
    ],
    stack: [
      {
        category: 'Cloud/Infrastructure',
        items: ['AWS', 'EC2', 'RDS', 'S3', 'DynamoDB', 'Lambda', 'SNS', 'EventBridge', 'CloudWatch'],
      },
      { category: 'IaC/Automation', items: ['Terraform', 'Ansible', 'Bash'] },
      { category: 'CI/CD', items: ['GitHub Actions', 'Docker', 'Docker Hub'] },
      { category: 'Application', items: ['FastAPI', 'Python', 'SQLAlchemy', 'React', 'Vite', 'PostgreSQL'] },
      {
        category: 'Monitoring',
        items: ['Prometheus', 'Grafana', 'Alertmanager', 'Node Exporter', 'cAdvisor', 'Portainer'],
      },
      { category: 'Network & Delivery', items: ['Tailscale', 'Cloudflare'] },
      { category: 'Notifications', items: ['Slack', 'Telegram'] },
    ],
    stackNotes: [
      {
        tool: 'Why Lambda and SNS?',
        icon: 'Lambda',
        text: 'Lock-N-Lock answered a failure with a Flask controller running on a machine that also had to stay up. Here the response is five Lambda functions behind two SNS topics, so **the thing that reacts to an outage is not itself part of the outage**. The trade is five cold starts and five inline IAM policies to get right, against one process I could have opened a shell on.',
      },
      {
        tool: 'Why DynamoDB next to PostgreSQL?',
        icon: 'DynamoDB',
        text: 'Every request writes an audit row, and I did not want that write queueing in front of the same RDS instance the application depends on. DynamoDB is **on-demand with no capacity to plan**, the partition key is the event id and the sort key is the timestamp, and a 90-day TTL clears it out on its own.',
      },
      {
        tool: 'Why EventBridge?',
        icon: 'EventBridge',
        text: 'A meeting reminder fires ten minutes before the meeting, and the instance that created the meeting may not exist by then. An `at()` rule created through boto3 **runs outside my application** and survives a deploy, a scale-out and a crash. A background thread dies with the process.',
      },
      {
        tool: 'Why a NAT instance?',
        // EC2 rather than AWS: `ec2.svg` exists and `aws.svg` does not, and
        // the point of the note is that the NAT *is* an EC2 instance.
        icon: 'EC2',
        text: 'A managed NAT gateway bills roughly **$33 a month** whether or not anything routes through it. A `t3.micro` with `source_dest_check = false` and one iptables masquerade rule does the same job inside the free tier. This is the one decision I kept identical to the team project, because it was right there too.',
      },
      {
        tool: 'Why replicate to my own server?',
        icon: 'Tailscale',
        text: 'RDS is the write primary and a PostgreSQL container on my on-premises `proj-ubuntu01` subscribes to it over Tailscale. The application holds **two engines, one write and one read**, so the hybrid half of the brief is a real data path rather than a line on a diagram.',
      },
    ],
    // Nine files, and the section reads them in that order as an argument:
    // the middleware that sees everything, the 22 lines that made its download
    // counter count the right key, the Lambda that answers, the Terraform that
    // wires five of those Lambdas to SNS and S3, the network they run in, the
    // groups that reference each other rather than CIDRs, the listener where
    // blue/green physically switches, the certificate that listener serves, and
    // the workflow that drives the whole thing.
    //
    // `alb.tf` earns its place on one ternary: the listener forwards to
    // whichever target group `var.active_color` names, which is the whole
    // "switch is a variable" decision as a line of code rather than as a claim.
    // `acm.tf` follows it because the 443 listener is meaningless without the
    // certificate, and because the file is where the grey-cloud decision is
    // written down: the record is DNS only, so the ALB has to end TLS itself.
    // `cd.yml` last is the caller, so the three are read together.
    terraform: [
      { path: 'app/middleware/audit_middleware.py', content: svAuditMiddleware },
      { path: 'app/rate_limit.py', content: svRateLimit },
      { path: 'lambda/block_ip/handler.py', content: svBlockIp },
      { path: 'terraform/lambda.tf', content: svLambdaTf },
      { path: 'terraform/vpc.tf', content: svVpcTf },
      { path: 'terraform/security_groups.tf', content: svSecurityGroupsTf },
      { path: 'terraform/alb.tf', content: svAlbTf },
      { path: 'terraform/acm.tf', content: svAcmTf },
      { path: '.github/workflows/cd.yml', content: svCdWorkflow },
    ],
    // Null rather than absent: the alert routing does exist in the repository
    // (four Prometheus rules and an alertmanager.yml with an inhibit rule),
    // but there is no recovery logic to sit beside it — no controller, no
    // alert-to-script map, nothing that restarts anything. The heading claims
    // both, so the section drops out entirely and the alert routing is
    // carried by the second diagram and the README instead.
    recoveryPolicy: null,
    // Three views, drawn from data in the same vocabulary as every other page:
    // zones underneath, nodes placed by their centres, edges routed
    // orthogonally, one accent carried by the glyphs and nothing else.
    //
    // Every label traces to the repository. The CIDRs, instance classes and
    // the ALB health check come from terraform/, the counters and thresholds
    // from app/middleware/audit_middleware.py and app/services/rate_limiter.py,
    // and the job order in the third view from .github/workflows/cd.yml.
    architecture: [
      {
        tab: 'Platform',
        caption:
          'AWS and on-premises joined into one Tailscale network',
        alt: 'An AWS VPC in ap-northeast-2 on 10.0.0.0/16. Traffic arrives at shimonvault.junhanshin.com, a DNS-only Cloudflare record, so the load balancer terminates TLS itself with an ACM certificate. Public subnets across two availability zones hold that application load balancer, serving port 80 and port 443 with a health check on /health every 30 seconds, a bastion reachable only from the operator IP, and a NAT instance running iptables masquerade on a t3.micro. Private subnets hold the blue application instance, the green instance created only during a deploy, and an RDS PostgreSQL 16 instance on db.t3.micro with logical replication enabled. Below the VPC, a serverless band holds the S3 docs and reports buckets, five Lambda functions, the SNS topics with EventBridge, and three DynamoDB tables. Below AWS, a Tailscale mesh on 100.64.0.0/10 joins two on-premises hosts: proj-mgmt running Prometheus, Grafana and Alertmanager, and proj-ubuntu01 running the PostgreSQL read replica on port 5433.',
        diagram: {
          width: 1000,
          // 836 before the captions were broken into four lines instead of two.
          height: 902,
          zones: [
            { id: 'aws', label: 'AWS · ap-northeast-2', x: 20, y: 70, w: 960, h: 520, tone: 'cloud' },
            { id: 'vpc', label: 'VPC', note: '10.0.0.0/16', x: 48, y: 130, w: 904, h: 340, tone: 'region' },
            // Short notes on purpose: a zone label owns the strip along its own
            // top edge, and spelling all four CIDRs out here would block the
            // lane the load balancer descends through.
            { id: 'pub', label: 'Public subnets', note: '2 AZs', x: 64, y: 186, w: 872, h: 96, tone: 'region' },
            { id: 'priv', label: 'Private subnets', note: '2 AZs', x: 64, y: 300, w: 872, h: 150, tone: 'region' },
            { id: 'serverless', label: 'Managed services', x: 48, y: 480, w: 904, h: 90, tone: 'region' },
            // Dashed and outside the provider, the convention every other
            // diagram on this site already uses for anything that is not AWS.
            { id: 'onprem', label: 'On-premises · always on', x: 20, y: 654, w: 960, h: 130, tone: 'onprem' },
          ],
          nodes: [
            // Cloudflare is DNS only here. The record is grey-clouded, so
            // nothing proxies and the ALB is the thing that ends TLS, using the
            // ACM certificate acm.tf issues and validates through the same zone.
            { id: 'client', label: 'Client · Cloudflare DNS', sub: 'shimonvault.junhanshin.com', glyph: 'user', x: 180, y: 32, w: 250, h: 44 },

            { id: 'alb', label: 'ALB', sub: '80 and 443 · ACM cert · /health every 30s', glyph: 'balancer', x: 180, y: 240, w: 220, h: 52 },
            { id: 'bastion', label: 'Bastion', sub: 'SSH from my IP only', glyph: 'key', x: 470, y: 240, w: 220, h: 52 },
            { id: 'nat', label: 'NAT instance', sub: 't3.micro · masquerade', glyph: 'cloud', x: 800, y: 240, w: 230, h: 52 },

            { id: 'blue', label: 'App EC2 blue', sub: 'Docker · uvicorn :8000', glyph: 'server', x: 180, y: 360, w: 210, h: 52 },
            { id: 'green', label: 'App EC2 green', sub: 'created on deploy only', glyph: 'server', x: 440, y: 360, w: 210, h: 52 },
            { id: 'rds', label: 'RDS PostgreSQL 16', sub: 'db.t3.micro · logical replication', glyph: 'database', x: 780, y: 360, w: 290, h: 52 },

            { id: 's3', label: 'S3', sub: 'docs · reports', glyph: 'bucket', x: 180, y: 532, w: 200, h: 48 },
            { id: 'lam', label: 'Lambda × 5', sub: 'response · scheduling', glyph: 'pipeline', x: 400, y: 532, w: 200, h: 48 },
            { id: 'sns', label: 'SNS · EventBridge', sub: '3 topics · at() rules', glyph: 'queue', x: 620, y: 532, w: 200, h: 48 },
            { id: 'ddb', label: 'DynamoDB', sub: '3 tables, on-demand', glyph: 'database', x: 840, y: 532, w: 200, h: 48 },

            { id: 'tailnet', label: 'Tailscale mesh', sub: '100.64.0.0/10 · no public ports', glyph: 'vpn', x: 500, y: 616, w: 420, h: 48 },

            { id: 'mgmt', label: 'proj-mgmt', sub: 'Prometheus · Grafana · Alertmanager', glyph: 'monitor', x: 300, y: 726, w: 400, h: 52 },
            { id: 'replica', label: 'proj-ubuntu01', sub: 'PostgreSQL replica :5433 · NFS', glyph: 'database', x: 720, y: 726, w: 380, h: 52 },
          ],
          edges: [
            { from: 'client', to: 'alb', label: 'HTTPS · TLS ends here' },
            { from: 'alb', to: 'blue', label: ':8000' },
            { from: 'alb', to: 'green', dash: true },
            // Both application instances reach the database, drawn as one lane
            // under the row rather than a line each through the middle of it.
            { from: 'blue', to: 'rds', label: 'SQL 5432', labelAt: [480, 406], via: [[180, 415], [780, 415]] },
            { from: 'green', to: 'rds' },
            { from: 'blue', to: 's3', label: 'documents' },
            { from: 'blue', to: 'ddb', label: 'audit rows', labelAt: [520, 466], via: [[180, 475], [840, 475]] },
            { from: 's3', to: 'lam', label: 'PUT' },
            { from: 'sns', to: 'lam', label: 'invoke' },
            // Down the right-hand gutter, between the VPC boundary and the
            // provider boundary, which is the only lane clear of both rows.
            { from: 'rds', to: 'replica', label: 'logical replication', labelAt: [956, 545], labelAnchor: 'end', via: [[966, 360], [966, 726]] },
            // The mesh reaches the private instance directly, so Prometheus
            // scrapes it with no jump host in the path.
            { from: 'tailnet', to: 'blue', label: 'scrape :9100 · :8000', labelAt: [44, 500], labelAnchor: 'start', dash: true, dir: 'both', via: [[280, 616], [34, 616], [34, 360]] },
            { from: 'mgmt', to: 'tailnet', dash: true, dir: 'both' },
            { from: 'replica', to: 'tailnet', dash: true, dir: 'both' },
          ],
          // A caption is one SVG <text> at a fixed baseline with no wrapping, so
          // anything past the 1000-unit viewBox is clipped and simply never
          // read. Every caption below is therefore hand-broken at roughly 135
          // characters, which is where the 11px monospace runs out of canvas.
          captions: [
            {
              x: 20,
              y: 808,
              tone: 'accent',
              text: 'Security groups reference each other rather than CIDR ranges.',
            },
            {
              x: 20,
              y: 830,
              tone: 'accent',
              text: 'The app group accepts 8000 only from the ALB group, and the RDS group accepts 5432 only from the app group.',
            },
            {
              x: 20,
              y: 852,
              text: 'Outbound traffic from the private subnets leaves through the NAT instance, a t3.micro running one iptables masquerade rule in place of a',
            },
            {
              x: 20,
              y: 874,
              text: 'managed NAT gateway. Ports 9100, 2376 and 2049 are open to the Tailscale range and to nothing else.',
            },
          ],
        },
      },
      {
        tab: 'Attack to response',
        caption:
          'One middleware sees it and three counters decide the response',
        alt: 'A four-band flow. Detect: every request except /health and /metrics passes through AuditMiddleware, which maps the status code to an event type and writes one row to the DynamoDB audit log. Decide: three counters, 5 login failures per address with an incident at 8, 5 access denials per account, and 10 downloads in 60 seconds per address. Respond: an incident record in the incidents table, the account suspended in the users table, and an incident report written to the reports bucket, all three converging on one notify_all call, with a dashed edge to the SNS security-alert topic marked as still to do, and the block_ip Lambda inserting a network ACL deny rule. Report: Slack and Telegram, and the AuditStream feed in the admin console polled every four seconds.',
        diagram: {
          width: 1000,
          // 730 before the captions were broken into four lines instead of two.
          height: 786,
          // Four bands rather than four columns: a phase is a horizontal slice
          // of the flow, and a band says so without spending a column on it.
          zones: [
            { id: 'detect', label: 'Detect', note: 'outside every route', x: 20, y: 24, w: 960, h: 116, tone: 'region' },
            { id: 'decide', label: 'Decide', note: 'three counters, all in process', x: 20, y: 164, w: 960, h: 116, tone: 'region' },
            // The band the project is actually about.
            { id: 'respond', label: 'Respond', x: 20, y: 304, w: 960, h: 220, tone: 'focus' },
            { id: 'report', label: 'Report', x: 20, y: 548, w: 960, h: 110, tone: 'region' },
          ],
          nodes: [
            { id: 'req', label: 'HTTP request', sub: 'every path but /health and /metrics', glyph: 'user', x: 175, y: 102, w: 270, h: 44 },
            { id: 'mw', label: 'AuditMiddleware', sub: 'status code → event type', glyph: 'shield', x: 500, y: 102, w: 280, h: 44 },
            { id: 'log', label: 'DynamoDB audit-log', sub: 'one row per request', glyph: 'database', x: 830, y: 102, w: 270, h: 44 },

            // 5 and 8, from auth_router.py. NOT the 20-and-50 pair in
            // services/rate_limiter.py: nothing imports that module, so its
            // thresholds never run. Read the router, not the service.
            { id: 'f401', label: '5 login failures', sub: 'per address · incident at 8', glyph: 'alert', x: 175, y: 242, w: 250, h: 44 },
            { id: 'f403', label: '5 access denials', sub: 'per account', glyph: 'alert', x: 500, y: 242, w: 250, h: 44 },
            { id: 'f429', label: '10 downloads', sub: '60 seconds, per address', glyph: 'alert', x: 825, y: 242, w: 250, h: 44 },

            { id: 'incident', label: 'Incident record', sub: 'incidents table', glyph: 'database', x: 175, y: 382, w: 270, h: 48 },
            { id: 'suspend', label: 'Account suspended', sub: 'users.suspended = true', glyph: 'key', x: 500, y: 382, w: 270, h: 48 },
            { id: 's3report', label: 'Incident report', sub: 'reports bucket · 30-day expiry', glyph: 'bucket', x: 825, y: 382, w: 270, h: 48 },

            { id: 'notify', label: 'notify_all()', sub: 'one call, two channels', glyph: 'chat', x: 175, y: 464, w: 270, h: 48 },
            { id: 'snstopic', label: 'SNS security-alert', sub: 'two subscribed functions', glyph: 'queue', x: 500, y: 464, w: 270, h: 48 },
            { id: 'block', label: 'block_ip Lambda', sub: 'NACL DENY · rule 1 to 99', glyph: 'pipeline', x: 825, y: 464, w: 270, h: 48 },

            { id: 'chans', label: 'Slack + Telegram', sub: 'every severity', glyph: 'chat', x: 230, y: 612, w: 300, h: 48 },
            { id: 'feed', label: 'AuditStream feed', sub: 'admin console · polled every 4s', glyph: 'monitor', x: 660, y: 612, w: 340, h: 48 },
          ],
          edges: [
            { from: 'req', to: 'mw' },
            { from: 'mw', to: 'log' },
            { from: 'mw', to: 'f401', label: '401' },
            { from: 'mw', to: 'f403', label: '403' },
            { from: 'mw', to: 'f429', label: '429' },
            // Each counter drops straight into the action it triggers, which is
            // why the respond row is ordered to match the decide row above it.
            { from: 'f401', to: 'incident' },
            { from: 'f403', to: 'suspend' },
            { from: 'f429', to: 's3report' },
            // All three converge on one lane and one call. That convergence is
            // the point of the band: three different detections, one notifier.
            { from: 'incident', to: 'notify' },
            { from: 'suspend', to: 'notify', via: [[500, 424], [175, 424]] },
            { from: 's3report', to: 'notify', via: [[825, 424], [175, 424]] },
            // Dashed because it is the one edge that is wiring rather than
            // code: nothing in app/ publishes to this topic yet.
            { from: 'incident', to: 'snstopic', label: 'publish: still a TODO', dash: true },
            { from: 'snstopic', to: 'block', label: 'invoke' },
            { from: 'notify', to: 'chans' },
            { from: 'block', to: 'chans', via: [[825, 508], [230, 508]] },
            { from: 'log', to: 'feed', label: 'read back', labelAt: [958, 350], labelAnchor: 'end', via: [[975, 102], [975, 612]] },
          ],
          captions: [
            {
              x: 20,
              y: 692,
              tone: 'accent',
              text: 'A security group has allow rules only, so the automatic block had to move to a network ACL. block_ip takes the lowest free rule number',
            },
            {
              x: 20,
              y: 714,
              tone: 'accent',
              text: 'between 1 and 99 and inserts a DENY for that address.',
            },
            {
              x: 20,
              y: 736,
              text: 'The dashed edge is honest. The SNS publish that would invoke block_ip from the login path is still a TODO in auth_router.py, so the',
            },
            {
              x: 20,
              y: 758,
              text: 'function is deployed, subscribed and authorised with no live trigger. The alert text it sends still claims the block fired.',
            },
          ],
        },
      },
      {
        tab: 'Blue/green deploy',
        caption:
          'Checks on every push and a deploy that waits for green',
        alt: 'Two workflows run from two different triggers. On the left, every push runs the CI workflow: flake8 over app/ at 120 columns, then pytest against SQLite in memory with a 50 percent coverage floor, then a Docker build that verifies the image and is never pushed. On the right, a manual workflow_dispatch runs the CD workflow, which builds and pushes the green image for amd64 and arm64 tagged by commit sha, applies Terraform with deploy_green set to true while the listener stays on blue, polls the green target group health up to 40 times at 15 second intervals, applies again with active_color set to green to move the listener, retags the green image as blue, and posts the result to Slack. A dashed edge runs from the health poll directly to the Slack step for the case where green never becomes healthy.',
        diagram: {
          width: 1000,
          // 700 before the third caption, and 722 before all three were broken
          // into six lines. Captions are single <text> baselines with no
          // wrapping, so the canvas has to grow under every line added.
          height: 788,
          zones: [
            { id: 'ci', label: 'ci.yml', note: 'every push and pull request', x: 20, y: 110, w: 460, h: 260, tone: 'region' },
            // A zone note is one unwrapped line like a caption, so it is held
            // to about the length of the one it replaced. The trigger's real
            // name is in the caption underneath and in the workflow itself.
            { id: 'cd', label: 'cd.yml', note: 'manual only · concurrency: deploy-production', x: 512, y: 110, w: 468, h: 500, tone: 'focus' },
          ],
          nodes: [
            // One entry node for two triggers, because the two workflows no
            // longer share one. CI still runs on every push; CD is dispatched
            // by hand, and the edge labels below are where that difference is.
            { id: 'push', label: 'git push · gh workflow run', sub: 'two triggers, two workflows', glyph: 'git', x: 500, y: 52, w: 340, h: 44 },

            { id: 'lint', label: 'flake8', sub: 'app/ · 120 columns', glyph: 'scan', x: 250, y: 176, w: 380, h: 44 },
            { id: 'test', label: 'pytest', sub: 'SQLite in memory · 50% floor', glyph: 'shield', x: 250, y: 242, w: 380, h: 44 },
            { id: 'buildcheck', label: 'docker build', sub: 'verify only, never pushed', glyph: 'container', x: 250, y: 308, w: 380, h: 44 },

            { id: 'image', label: 'build and push :green', sub: 'amd64 and arm64 · tagged by sha', glyph: 'container', x: 746, y: 176, w: 400, h: 44 },
            { id: 'applygreen', label: 'terraform apply', sub: 'deploy_green=true · listener on blue', glyph: 'cloud', x: 746, y: 242, w: 400, h: 44 },
            { id: 'poll', label: 'poll target health', sub: '40 attempts at 15s', glyph: 'shield', x: 746, y: 308, w: 400, h: 44 },
            { id: 'switch', label: 'terraform apply', sub: 'active_color=green · the switch', glyph: 'balancer', x: 746, y: 374, w: 400, h: 44 },
            { id: 'retag', label: 'retag :green as :blue', sub: 'green is now the live version', glyph: 'git', x: 746, y: 440, w: 400, h: 44 },
            { id: 'result', label: 'Slack result', sub: 'complete, or failed with blue live', glyph: 'chat', x: 746, y: 506, w: 400, h: 44 },
          ],
          edges: [
            { from: 'push', to: 'lint', label: 'on push' },
            { from: 'push', to: 'image', label: 'on dispatch' },
            { from: 'lint', to: 'test' },
            { from: 'test', to: 'buildcheck' },
            { from: 'image', to: 'applygreen' },
            { from: 'applygreen', to: 'poll' },
            { from: 'poll', to: 'switch', label: 'healthy' },
            { from: 'switch', to: 'retag' },
            { from: 'retag', to: 'result' },
            // The failure path. Blue is still serving the whole time, so a
            // deploy that never goes green costs a Slack message and nothing else.
            { from: 'poll', to: 'result', label: 'never healthy', labelAt: [968, 410], labelAnchor: 'end', dash: true, via: [[962, 308], [962, 506]] },
          ],
          captions: [
            {
              x: 20,
              y: 650,
              tone: 'accent',
              text: 'The switch is a Terraform variable rather than an `aws elbv2 modify-listener` call. A CLI switch is drift, and the next apply would',
            },
            {
              x: 20,
              y: 672,
              tone: 'accent',
              text: 'quietly put traffic back on blue.',
            },
            {
              x: 20,
              y: 694,
              text: 'A concurrency group named deploy-production with cancel-in-progress false means two deploys never run at once and none is ever',
            },
            {
              x: 20,
              y: 716,
              text: 'cancelled mid-flight. Blue keeps serving until the green target group reports healthy on its own health check.',
            },
            {
              x: 20,
              y: 738,
              text: 'CD is `workflow_dispatch` only. It used to run on every push to `main`, which rebuilt live AWS infrastructure after every commit,',
            },
            {
              x: 20,
              y: 760,
              text: 'including the commit right after a `terraform destroy`. That put the billing back on and nobody asked for it.',
            },
          ],
        },
      },
    ],
    // The same four weeks as Lock-N-Lock, split by what this repository was
    // actually built in the order of: the ground first, then the product on
    // top of it, then the things that watch it, then the pipeline over all of it.
    implementation: {
      months: ['2026-05', '2026-06'],
      span: { from: '2026-05-27', to: '2026-06-24' },
      phases: [
        {
          id: 'foundation',
          title: 'Foundation',
          range: 'May 27 – Jun 2',
          from: '2026-05-27',
          to: '2026-06-02',
          text: 'The S3 state backend and its lock table, then the VPC, four subnets, the NAT instance, the bastion, RDS, the two S3 buckets and the five security groups that reference each other rather than CIDR ranges. The FastAPI skeleton went up in the same week, with `/health` answering 200 before the database exists.',
        },
        {
          id: 'modules',
          title: 'The Three Modules',
          range: 'Jun 3 – Jun 9',
          from: '2026-06-03',
          to: '2026-06-09',
          text: 'SecureDocs on S3 with presigned URLs and soft deletes, ShimonMeet with join tokens and the EventBridge rules that fire around each meeting, the audit middleware writing every request to DynamoDB, and the React console on top of all three.',
        },
        {
          id: 'response',
          title: 'Detection and Response',
          range: 'Jun 10 – Jun 17',
          from: '2026-06-10',
          to: '2026-06-17',
          text: 'The three counters, the two SNS topics, the five Lambda functions, and the on-premises Prometheus, Grafana and Alertmanager stack with the Telegram relay beside it. Logical replication from RDS to `proj-ubuntu01` landed at the end of the week, which is what made the read path real.',
        },
        {
          id: 'pipeline',
          title: 'Pipeline and Demo',
          range: 'Jun 18 – Jun 24',
          from: '2026-06-18',
          to: '2026-06-24',
          text: 'The CI workflow, the blue/green CD workflow that owns the listener through a Terraform variable, the five in-product attack simulations, and `deploy.sh` and `destroy.sh` so a whole session is two commands.',
        },
      ],
    },
    // Two of my own screen recordings and one set of captures, all from the
    // live environment at shimonvault.junhanshin.com:
    //
    //   8 Sep, 20:42 local  the demo, four windows on one screen, 4660kbps at
    //                       3024x1964. Scenarios 1 to 4 are cut from this.
    //   9 Sep, 09:37 local  a full `scripts/deploy.sh` run in a terminal,
    //                       1747kbps at 3248x2122. Scenario 5's clip.
    //   9 Sep, midday       the stills, 1600x1200 and 1600x1250.
    //
    // Two tabs have no clip, because neither recording covers the Prometheus
    // side. Their four stills are the only evidence on the page for the four
    // Prometheus rules the metrics tile counts and for the Grafana dashboards
    // the stack list names, so those tabs exist for the stills rather than the
    // other way round.
    //
    // demo-NN numbering follows tab order, so inserting a tab renumbers the
    // files after it. Cheap while the folder is young, and it keeps an `ls`
    // readable against the page.
    //
    // The four-window clips are deliberately not cropped to one pane. Cropping
    // would sharpen the console and throw away the reason the recording exists,
    // which is that one button press lands in the app, in Grafana, in Telegram
    // and in Slack inside a few seconds. The stills carry the detail instead,
    // the same split the EchoChallengers clips settled on.
    //
    // The deploy clip is cropped to the terminal panel because the rest of that
    // frame is a file tree, and it is kept at 1440 rather than 1280 so the
    // monospace output survives the downscale.
    media: {
      clipNote:
        'Cut from my own screen recordings of the live environment, silent and looping. Where a clip shows four windows they are the admin console, the Grafana AuditStream dashboard, Telegram and Slack, so one button press can be watched landing in all four.',
      stillsNote:
        'Full-resolution captures from a separate session the following day, so their counters do not line up with the clips above. Click one to open it at full size.',
      scenarios: [
        {
          id: 'normal',
          tab: 'Normal operation',
          label: 'Scenario 1: Signing in and using the platform',
          lead:
            'An admin signs in, reads the console, and uploads a file to **SecureDocs**. Downloads leave as **15-minute pre-signed S3 URLs**, and every request on the way through is already in the audit trail by the time the page finishes rendering.',
          clip: {
            src: '/projects/shimon-vault/clip-01-console.mp4',
            width: 1280,
            height: 806,
            poster: '/projects/shimon-vault/clip-01-console.jpg',
            speed: '3.4x',
            alt: 'A sign-in to the ShimonVault console, the security dashboard with its six counters and the five demo buttons, then the SecureDocs page with a file uploaded and listed at version 1',
          },
          before: {
            src: '/projects/shimon-vault/demo-01-securedocs.png',
            state: 'SecureDocs holds two documents at version 1',
            alt: 'The SecureDocs page: a browse and upload row above a Documents card listing act1.txt at 55 bytes and contract_q3.txt at 56 bytes, each text/plain, dated 9 September 2026, at version 1, with a Download and a delete control, under a line reading that downloads use 15-minute pre-signed URLs and every action is audited',
          },
          after: {
            src: '/projects/shimon-vault/demo-02-meetings.png',
            state: 'ShimonMeet lists three meetings with join tokens',
            alt: 'The ShimonMeet page: a new-meeting form with title, description, start and end times and participant ids, above three scheduled meetings named Q3 Security Review, Infra Sync Blue/Green and Vendor Access Renewal, each with a Join control, a Token control and a cancel control',
          },
        },
        {
          id: 'credential-stuffing',
          tab: 'Credential stuffing',
          label: 'Scenario 2: Credential stuffing against /auth/login',
          lead:
            'Act 2 fires **30 login attempts** from `203.0.113.42`, the RFC 5737 documentation address the demo defaults to. The fifth failure raises the first alert, the eighth writes an incident, and slowapi refuses the rest of the burst at **10 a minute**. Slack and Telegram both have the message before the run finishes. The alert text reads `Action: IP block Lambda triggered`, and that line is the one thing on screen that is not true: the SNS publish that would invoke `block_ip` is still a `TODO` one line below it in `auth_router.py`.',
          clip: {
            src: '/projects/shimon-vault/clip-02-credential-stuffing.mp4',
            width: 1280,
            height: 806,
            poster: '/projects/shimon-vault/clip-02-credential-stuffing.jpg',
            speed: '3.5x',
            alt: 'Four windows at once during a credential-stuffing run: the admin console, the Grafana AuditStream dashboard with its login-failure and rate-limited panels climbing, and Telegram and Slack both filling with CREDENTIAL STUFFING DETECTED messages naming 203.0.113.42 and a rising failed-attempt count',
          },
          // The console's own counters already play live in the clip above, so
          // the still that earns the slot is the one view the clip cannot show
          // at a readable size: the Grafana dashboard the on-premises stack
          // draws from the same requests.
          stillsNote:
            'Two different runs of the same act. The Grafana window closes about a quarter of an hour before the feed was captured, so the numbers in them are not the same burst.',
          before: {
            src: '/projects/shimon-vault/demo-03-stuffing-grafana.png',
            state: 'Failures and refusals both run at 32.3 a minute',
            alt: 'The ShimonVault AuditStream dashboard in Grafana over the last 30 minutes: login failures 32.3, access denied 0, rate limited 4xx 32.3, 5xx server errors 0 and 341 total requests, above a login-failure-rate panel spiking to just over 40 a minute, a request-rate-by-endpoint panel whose legend includes /demo/credential-stuffing and /auth/login, and an HTTP status distribution where a 4xx block rises out of an otherwise flat 2xx line',
          },
          after: {
            src: '/projects/shimon-vault/demo-04-stuffing-feed.png',
            state: 'The tail of the burst lands as rate limit hits in one second',
            alt: 'The AuditStream feed filled with rate limit hit rows from 203.0.113.42 against /auth/login, all stamped 12:31:27 PM, under the successful sign-ins that preceded them',
          },
        },
        {
          id: 'access-control',
          tab: 'Broken access control',
          label: 'Scenario 3: Forbidden reads and account suspension',
          lead:
            'Act 3 signs in as the seeded **viewer** account and asks six times for a document that account may not read. Every refusal is a 403 counted by the middleware, and the **fifth one suspends the account**. That is also why Act 5 will not start afterwards: the traffic flood signs in as the same viewer account, so the defence that worked is the reason the next demo is refused at the door.',
          clip: {
            src: '/projects/shimon-vault/clip-03-access-control.mp4',
            width: 1280,
            height: 806,
            poster: '/projects/shimon-vault/clip-03-access-control.jpg',
            speed: '3.5x',
            alt: 'The admin console raising a toast that reads Broken access control attack started, six attempts against a named document id, beside the Grafana AuditStream dashboard and the two chat clients still showing the previous scenario',
          },
          before: {
            src: '/projects/shimon-vault/demo-05-access-control-feed.png',
            state: 'The 403 lands directly below a live scanner',
            alt: 'The AuditStream feed showing a doc access denied row from 203.0.113.42 at 12:32:46, and directly above it an unrelated address, 216.180.246.224, walking a list of login paths including /cgi-bin/login.cgi, /+CSCOE+/logon.html, /manage/account/login and /admin/index.html',
          },
          after: {
            src: '/projects/shimon-vault/demo-06-audit-scanner.png',
            state: 'The same feed keeps filling with no demo running',
            alt: 'The AuditStream feed with no demo running: an address at 136.118.157.110 requesting /llm_config.json, /config/anthropic.json, /openai.json, /.codex/config.toml, /.claude/mcp.json, /.cursor/settings.json and /.windsurf/mcp.json in the same second, every row labelled login success by the middleware path heuristic',
          },
        },
        {
          id: 'exfiltration',
          tab: 'Bulk exfiltration',
          label: 'Scenario 4: Download rate limiting and incident reporting',
          lead:
            'Act 4 signs in as the **editor** account and asks for the same document 15 times in a row. The route allows **10 downloads in 60 seconds** and refuses the rest with a 429. The first 429 from an address writes an incident report to S3 and posts it once to Slack and Telegram, report key included, and every 429 after that is logged and stays quiet.',
          clip: {
            src: '/projects/shimon-vault/clip-04-exfiltration.mp4',
            width: 1280,
            height: 806,
            poster: '/projects/shimon-vault/clip-04-exfiltration.jpg',
            speed: '3.5x',
            alt: 'A toast reading Bulk exfiltration attack started, 15 rapid downloads, rate limiter should trip, followed within seconds by an EXFILTRATION ATTEMPT message in both Telegram and Slack naming the S3 report key, while the Grafana rate-limited and access-denied panels come off zero',
          },
          before: {
            src: '/projects/shimon-vault/demo-07-exfiltration-feed.png',
            state: 'Ten downloads pass before the limiter refuses the rest',
            alt: 'The AuditStream feed reading upward from 12:33:20: a run of doc download rows against one document id, then a red suspicious row reading incident:bulk_file_exfiltration from 203.0.113.42 at 12:33:21, then rate limit hit rows against the same document id at 12:33:22',
          },
        },
        {
          // The two tabs with no clip. Neither recording covers the monitoring
          // stack, and inventing a clip for it would be worse than a lead that
          // says what the stills say. MediaSection keeps the Screenshots
          // heading on both anyway, because the other five tabs have clips.
          //
          // Split in two because they are two different claims. This one is
          // "here is the stack, and it reaches both sides"; the next is "here
          // is one of its rules firing and clearing on its own". One tab
          // holding all four stills is not an option: a scenario carries a
          // before and an after and nothing else.
          id: 'monitoring',
          tab: 'Monitoring stack',
          label: 'Scenario 5: Monitoring from outside the platform',
          lead:
            'Everything above is the application catching things about itself. This is the other half. Prometheus, Grafana and Alertmanager run on `proj-mgmt`, **my own machine on-premises**, and scrape across the Tailscale mesh, so the thing watching the platform is not part of it. Four scrape pools cover both sides: the node exporter and the FastAPI `/metrics` endpoint on the AWS instance, and cAdvisor and a node exporter on the on-premises host itself.',
          stillsNote: 'Both from the 9 September session, with the rest of the stills.',
          before: {
            src: '/projects/shimon-vault/demo-08-prometheus-targets.png',
            state: 'Four scrape pools report up across both sides',
            alt: 'The Prometheus target-health page with four scrape pools, each reading 1 of 1 up: ec2-nodes and fastapi-app both scraping 100.85.130.38, the app instance reached over Tailscale and labelled shimonvault-app-blue, and onprem-cadvisor and onprem-node scraping containers on onprem-proj-mgmt, the last of them carrying an environment on-prem label',
          },
          after: {
            src: '/projects/shimon-vault/demo-09-grafana-infra.png',
            state: 'One chart plots both machines on the same axis',
            alt: 'The ShimonVault infra health dashboard in Grafana over the last hour: CPU usage 2.29 percent, memory usage 61.0 percent, 8 running containers and 0.222 requests a second, above a CPU Over Time panel plotting two series on one axis, onprem-proj-mgmt and shimonvault-app-blue, and an HTTP request rate panel split into 2xx, 4xx and 5xx',
          },
        },
        {
          id: 'alerting',
          tab: 'Alert lifecycle',
          label: 'Scenario 6: NodeDown firing and resolving',
          lead:
            'Four rules cover high CPU, high memory, a dead node exporter and a dead FastAPI, and `NodeDown` is `up{job="ec2-nodes"} == 0` held for a minute. One Alertmanager receiver posts to Slack and to the Telegram relay with `send_resolved: true`, so **the recovery arrives on the same two channels as the alarm** rather than leaving somebody to notice it stopped. A `NodeDown` on an instance also inhibits the other three for that instance, because a machine that is gone trips all four and only one of them is the news.',
          stillsNote:
            'These two are from different sittings. The rule list is from the 9 September session, and the Slack channel is from the same evening as the clips, twenty minutes after the last of them.',
          before: {
            src: '/projects/shimon-vault/demo-10-prometheus-rules.png',
            state: 'Four rules are loaded and none of them is active',
            alt: 'The Prometheus alerts page showing a single rule group named shimonvault, loaded from /etc/prometheus/rules/shimonvault.yml and badged INACTIVE with a count of 4, listing HighCPU, HighMemory, NodeDown and FastAPIDown',
          },
          after: {
            src: '/projects/shimon-vault/demo-11-infra-alert.png',
            state: 'NodeDown fires at 7:53 and resolves itself by 8:03',
            alt: 'The shimonvault-alerts Slack channel: a red [ALERT] EC2 node down on shimonvault-app-blue posted at 7:53 PM, reading that the node exporter has been unreachable for one minute at critical severity, then a green [RESOLVED] of the same alert at 8:03 PM, and under both a TEST NOTIFICATION triggered by admin reading that if you can read this in Slack and Telegram, alerting works',
          },
        },
        {
          id: 'deploy',
          tab: 'Deploy',
          label: 'Scenario 7: One-command provisioning and blue/green deploy',
          lead:
            '`scripts/deploy.sh` is one command: Terraform apply, the Cloudflare record, the ALB health gate, the on-premises replica, the seeded accounts, then an Ansible pass that checks the stack from the inside. It ends by printing every Terraform output. Shipping a change afterwards is the CD workflow, which runs on `workflow_dispatch` **and nothing else**, because on `push` it used to rebuild live infrastructure after every commit.',
          // These two stills are not from the separate session the section
          // note describes. The outputs shot is a frame of this very clip, and
          // the CD run is a GitHub page, so the section's caveat would be wrong
          // on both of them.
          stillsNote:
            'The first of these is a full-resolution frame of the run above rather than a separate capture. The second is the GitHub Actions run for a later deploy.',
          clipNote:
            'The terminal panel from one full `scripts/deploy.sh` run, 6 minutes 32 seconds of it. Kept at 1440 wide so the output survives the downscale.',
          clip: {
            src: '/projects/shimon-vault/clip-05-provision.mp4',
            width: 1440,
            height: 746,
            poster: '/projects/shimon-vault/clip-05-provision.jpg',
            speed: '25x',
            alt: 'A deploy.sh run scrolling through Terraform apply, an SSH config rewrite, the Cloudflare DNS update, the bastion and ALB health waits, the demo user seed, node_exporter installation, the PostgreSQL replica and its logical replication subscription, an Ansible verification play, and the Terraform outputs at the end',
          },
          before: {
            src: '/projects/shimon-vault/demo-12-deploy-outputs.jpg',
            state: 'The run ends on the Terraform outputs with nothing degraded',
            alt: 'The tail of a deploy.sh run: Terraform outputs listing the ACM certificate ARN, the ALB DNS name and listener ARN, the blue and green target group ARNs, app_fqdn as shimonvault.junhanshin.com, app_green_private_ip as not deployed, the bastion IP, the Lambda and SNS ARNs and the RDS endpoint, followed by a line reading deployment finished with no degraded steps',
          },
          after: {
            src: '/projects/shimon-vault/demo-13-cd-run.png',
            state: 'The CD run switches the ALB and retags in 12m 28s',
            alt: 'A successful GitHub Actions run of CD Blue/Green Deploy on the ShinJunhan/shimon-vault repository, total duration 12 minutes 28 seconds, with the job named Build, Push, Deploy Green, Switch ALB (terraform), Retag, three deprecation warnings and one build artifact',
          },
        },
      ],
      // No separate demo video: the recordings the clips are cut from are my
      // own working captures rather than a presentation, and the tabs already
      // carry every part of them worth watching.
      video: null,
    },
    folderStructure: `
shimon-vault/
├── app/                          FastAPI application (Docker image root)
│   ├── main.py                   lifespan, routers, SPA fallback, /health
│   ├── config.py                 every setting read from the environment
│   ├── database.py               lazy write and read engines, psycopg2 only
│   ├── models.py                 5 tables, UUID keys, 13 audit event types
│   ├── auth.py                   bcrypt, JWT, require_role() dependency
│   ├── rate_limit.py             the one shared slowapi limiter
│   ├── routers/                  6 routers, 26 endpoints
│   │   ├── auth_router.py        register, login, logout
│   │   ├── docs_router.py        upload, list, download, delete, versions
│   │   ├── meetings_router.py    create, list, update, cancel, join, archive
│   │   ├── audit_router.py       feed, incidents, my-activity
│   │   ├── admin_router.py       dashboard summary, timeseries, infra
│   │   └── demo_router.py        the 5 one-click attack simulations
│   ├── services/                 S3, DynamoDB, EventBridge, Prometheus, notify
│   ├── middleware/
│   │   └── audit_middleware.py   logs every request, counts, suspends, alerts
│   └── Dockerfile                3 stages: Vite build, pip build, slim runtime
├── frontend/                     React SPA, built into the image
│   └── src/                      Login, Docs, Meetings, Console, api.js
├── terraform/                    27 files, 90 resource blocks
│   ├── vpc.tf                    VPC, 4 subnets, IGW, route tables
│   ├── alb.tf                    ALB, blue and green target groups, 80 and 443
│   ├── acm.tf                    the cert the 443 listener serves, DNS-validated
│   ├── app_ec2_blue.tf           the live instance
│   ├── app_ec2_green.tf          created only when deploy_green = true
│   ├── asg.tf                    launch template, scale policies, CPU alarms
│   ├── rds.tf                    PostgreSQL 16, logical replication parameters
│   ├── s3.tf                     docs and reports, encrypted, versioned
│   ├── dynamodb.tf               audit-log, incidents, meetings
│   ├── lambda.tf                 5 functions, zipped at apply time
│   ├── sns.tf                    security-alert, infra-alert, meeting-reminders
│   ├── eventbridge.tf            the static warm-up rule
│   ├── iam.tf                    2 roles, one inline policy per Lambda
│   ├── security_groups.tf        5 groups, referencing each other
│   ├── nat_instance.tf           t3.micro with iptables masquerade
│   ├── bastion.tf                SSH from my IP only
│   ├── cloudwatch.tf             high CPU, status check, ALB 5xx
│   ├── backend.tf                the one-time state bootstrap, documented
│   └── templates/
│       └── app_user_data.sh.tpl  boot: Tailscale, Docker, .env, container
├── lambda/                       5 handlers, python3.12
│   ├── block_ip/                 NACL deny rule, incident record, notify
│   ├── log_incident/             SNS message to the incidents table
│   ├── validate_file/            magic-byte check on S3 upload
│   ├── meeting_notify/           fires 10 minutes before a meeting
│   ├── meeting_expire/           fires at meeting end
│   └── shared/notification.py    the Slack and Telegram helper
├── monitoring/                   on-premises stack, docker compose
│   ├── prometheus/rules/         4 alert rules
│   ├── prometheus/targets/       file_sd JSON, rewritten by deploy.sh
│   ├── alertmanager/             Slack receiver plus the Telegram webhook
│   ├── grafana/dashboards/       infra_health, auditstream
│   └── telegram_relay/           the bridge Alertmanager posts to
├── ansible/
│   ├── inventory.aws_ec2.yml     dynamic inventory, grouped by the Role tag
│   ├── playbooks/                setup_app, setup_monitoring, verify_stack
│   └── roles/                    docker_app, monitoring_stack, cloudwatch_agent
├── scripts/
│   ├── deploy.sh                 apply to healthy in one command
│   ├── destroy.sh                teardown, then verify 9 resource types
│   ├── generate_env.sh           app/.env from Terraform outputs
│   ├── setup_replica.sh          RDS to on-premises logical replication
│   ├── fetch_docker_certs.sh     the Docker TLS certs Portainer connects with
│   ├── update_ssh_config.sh      rewrites ~/.ssh/config for the new bastion
│   ├── package_lambdas.sh        zips the five functions with dependencies
│   └── simulate_*.sh|.py         four of the five demos, from a terminal
├── db/                           schema.sql, schema_from_rds.sql, seed.sql
├── tests/                        pytest, SQLite in memory, no AWS needed
└── .github/workflows/            ci.yml and cd.yml
`,
    decisions: [
      {
        keyword: 'Response in Lambda',
        title: 'The automated response runs in Lambda behind SNS rather than in a service on a machine.',
        glyph: 'pipeline',
        chose: 'Five **Lambda functions** subscribed to two SNS topics',
        over: 'a long-running recovery controller on a VM, the way the team project did it',
        why: 'The thing that responds to a failure should not share a failure domain with the thing that failed. A controller on the monitoring host is one more process that can be down at exactly the moment it is needed. The trade is real: five cold starts, five inline IAM policies, and no shell to open when a handler misbehaves, so **CloudWatch Logs is the only way to see what happened**.',
      },
      {
        keyword: 'Security groups cannot deny',
        title: 'The automatic IP block is a network ACL rule, because a security group has no way to express one.',
        glyph: 'route',
        chose: 'A **DENY entry in a network ACL**, at the lowest free rule number between 1 and 99',
        over: 'adding a deny rule to the application security group',
        why: 'A security group has allow rules only. There is no such thing as a security group deny, which I found out by writing the first version of this handler as though there were. Network ACLs are **stateless and ordered by rule number**, which is exactly what an automatic block needs, and reserving 1 to 99 for auto-blocks keeps them clear of the ordinary allow rules at 100 and above.',
      },
      {
        keyword: 'One writer, one exception',
        title: 'Every request is logged by one middleware, with a named exception for the console watching itself.',
        glyph: 'channels',
        chose: 'An `AuditMiddleware` added last, so it wraps **every route as the outermost layer**',
        over: 'a logging call inside each handler',
        why: 'Routes forget. Middleware cannot. It also gets the status code and the `X-Forwarded-For` address for free, which is what turns 401, 403 and 429 into security events with no extra work anywhere. The exception arrived later and is written down as `_OBSERVER_PATHS`. The console polls four read-only endpoints every four seconds to draw itself, which put **around 40 self-generated rows a minute** into the trail and pushed a real attack burst out of the live feed within a couple of minutes, so a **successful** poll on those four paths is no longer audited. A failed one still is, because a 401 or a 429 against admin telemetry is exactly the event this trail exists to catch. The older cost is unchanged: a successful request has no status code to classify it by, so the middleware **guesses an event type from the path**, which is why a scanner asking for `/openai.json` is filed in the screenshots above as a login success.',
      },
      {
        keyword: 'Green before ready',
        title: 'The health endpoint returns 200 before the database is reachable, and says so in the body.',
        glyph: 'process',
        chose: '`/health` answering **200 immediately**, with `init_db()` retrying in a daemon thread',
        over: 'initialising the schema during application startup',
        why: 'RDS takes 30 to 60 seconds to answer after the instance boots, and the ALB marks a target unhealthy long before that. Blocking startup on the database meant a deploy **never went green**. The retry runs 20 times at 15 seconds and the health body carries a `db` field that reads `initialising`, then `ok`. The load balancer reads the status code and a person reads the body, which keeps the compromise visible instead of hidden.',
      },
      {
        keyword: 'Switch is a variable',
        title: 'Blue/green traffic moves by re-applying Terraform, not by calling the AWS CLI.',
        glyph: 'branch',
        chose: '`terraform apply -var active_color=green`, with the listener target **held in state**',
        over: '`aws elbv2 modify-listener` from the workflow',
        why: 'A CLI switch is drift. The next `terraform apply` puts traffic back on blue and nobody knows why, which is the kind of failure that shows up a week later. Making the listener target a variable means the switch is **recorded where the infrastructure is recorded**, and the pipeline only reaches that step after the green target group has reported healthy on its own health check.',
      },
      {
        keyword: 'Deploy on purpose',
        title: 'The deploy workflow runs only when somebody asks for it, while the checks still run on every push.',
        glyph: 'note',
        chose: '`workflow_dispatch` on `cd.yml`, with `ci.yml` left on **every push to every branch**',
        over: 'the `on: push` to `main` trigger it shipped with',
        why: 'CD runs `terraform apply`, so an automatic push trigger meant every commit to `main` rebuilt live AWS infrastructure. The commit that hurt was the one right after a `terraform destroy`: the environment came back on its own and **started billing again with nobody watching**. Linting and testing cost nothing per push and belong there, and applying infrastructure costs money and belongs behind a decision, so the two triggers were separated rather than the pipeline being slowed down.',
      },
      {
        keyword: 'Demo inside the app',
        title: 'The five attack scenarios are endpoints in the product rather than scripts on my laptop.',
        glyph: 'inject',
        chose: 'Admin-only `/demo/*` routes, master-switched by `DEMO_ENABLED`',
        over: 'load-testing profiles and shell scripts run from outside, the way the team project did it',
        why: 'A button that fires real logins at the real login endpoint proves the audit trail on screen is the application running rather than a fixture. It is also **a vulnerability shaped like a feature**, which is why every route requires the admin role on top of the master switch, and why the attacker address defaults to the RFC 5737 documentation range. The shell versions stay in `scripts/` for when the app itself is the thing that is broken.',
      },
      {
        keyword: 'Read the file, not the name',
        title: 'Uploads are validated by their magic bytes rather than by their extension.',
        glyph: 'depth',
        chose: 'A Lambda reading the **first 512 bytes** on every S3 `ObjectCreated:Put`',
        over: 'trusting the file extension or the Content-Type header',
        why: 'Renaming `malware.exe` to `report.pdf` costs an attacker nothing. A single ranged GET costs me one S3 call and catches **PE headers, ELF headers, shebangs and tar archives** regardless of what the file claims to be. The trade is a gap I left open on purpose: the file is already in the bucket when the check runs, so the Lambda deletes it afterwards where a quarantine bucket would have stopped it landing at all.',
      },
    ],
    links: {
      github: 'https://github.com/ShinJunhan/shimon-vault',
      terraform: 'https://github.com/ShinJunhan/shimon-vault/tree/main/terraform',
      presentation: null,
    },
    reflection: {
      learned: [
        'Building the same brief twice showed me which parts of Lock-N-Lock I understood and which parts I had only approved. The **architecture** I could redraw from memory. The **AWS specifics** I could not. A security group has no deny rule, which is why the automatic block ended up in a network ACL. bcrypt silently stops at 72 bytes, so every password is hashed once before it is hashed. `asyncpg` and the synchronous SQLAlchemy engine fail at runtime rather than at import, with a `MissingGreenlet` error that says nothing about the driver. Alertmanager will not expand an environment variable inside its own config file, so the compose entrypoint writes the Slack URL to a file first. The larger lesson was about **startup order**: the load balancer decides an instance is dead long before RDS is ready to answer, so `/health` had to stop depending on the database and start reporting on it instead. The last one was about **who ends TLS**. A proxied Cloudflare record terminates HTTPS itself and lets the load balancer stay on port 80. A DNS-only record does not, so the ALB has to present a certificate of its own, which is the whole of `acm.tf`: an ACM certificate, a validation record written into the same Cloudflare zone, and a 443 listener that depends on the **validation** resource rather than on the certificate, so it is never created pointing at a certificate AWS has not confirmed.',
        "The other half of it came from my own tooling rather than from AWS. A shell script reports whatever I tell it to report, and for most of this build I told it to report success. `fetch_docker_certs.sh` wrote the Prometheus scrape targets through a heredoc that left the host address out of the JSON and printed it in the green check mark underneath, so every run wrote an empty target and announced the correct one. `deploy.sh` guards most of its steps so that one failure does not abandon the bring-up, and it used to exit `0` on a run where the application was down, seeding had failed and replication had failed. Both are repaired: the certificate script reads the target file back, and a `WARNINGS` array collects every degraded step, names each one and exits non-zero. The script that had it right from the start is `setup_replica.sh`, which runs a **verification query after every statement** and retries ten times before it gives up, which is why a replication failure was visible the day it happened while the monitoring corruption stayed quiet for hours. **A success message is a claim, and it needs evidence**, starting with the messages I wrote myself.",
      ],
      differently: [
        'The download limiter looked correct for days and counted the wrong thing. slowapi keys on the **resolved URL** by default, so `/docs/download/doc-0001` and `/docs/download/doc-0002` are different counters and a bulk download across 50 ids never reaches 2. `key_style="endpoint"` keys on the route function instead, and I only found it because repeating one id tripped the limit instantly. The next thing I would fix is that **all three counters live in module-level dictionaries**, so two application instances count separately and a restart forgets everything. The SNS publish that would invoke `block_ip` from the login path is still a `TODO`, which leaves that function deployed, subscribed and authorised with no live trigger. And two of the four files in `tests/` are copies of router source rather than tests, so the real suite is **15 tests over auth and audit** and the 50 percent coverage floor is doing more work than it should have to. The demo has an ordering bug of its own. Act 3 suspends the seeded **viewer** account on purpose, and Act 5 signs in as that same account, so running the scenarios in order leaves the traffic flood refused at the door and the console reporting `Could not start simulation`. The defence is working. The seed data is what is wrong, and giving each act its own account is a few lines in `db/seed.sql` that I have not written.',
        "The infrastructure gaps that are still open all sit outside the request path. `app_user_data.sh.tpl` opens with `set -euo pipefail` and calls `tailscale up` on **line 25**, so an expired auth key aborts every step below it and leaves the instance with no Docker TLS certificates, no environment file, no Swarm and no container, and the load balancer answering **502**. Tailscale earns a certificate subject alternative name and an optional mount, and the application serves traffic without either, so that line belongs behind a warning rather than a hard stop. `prometheus_url` is the same fault from the other direction: `variables.tf` carries a default address, my tfvars carries the live one, and `cd.yml` passes neither, so a pipeline deploy bakes the default into the image while a local run bakes in the truth. With two instances behind the listener, the console read Prometheus correctly on roughly **half of all page loads**, depending on which one answered. The third is identity: the scrape targets, the Portainer endpoint and the replica lookup are keyed to a mesh address that is reassigned whenever an instance is replaced, and the template joins the mesh as `${project_name}-app-blue` whichever colour renders it, so a blue and green release points monitoring at a terminated machine every time it succeeds.",
        "The console reads its own audit trail two different ways, and only one of them is right. `audit_router._recent_events` asks the `event_type-index` GSI for the newest rows per event type with `ScanIndexForward=False` and merges them, because the base table is keyed on a random uuid and cannot be range-queried by time at all. `admin_router._scan_recent_events` still calls `scan(Limit=500)` and sorts what comes back, which is **the first 500 rows DynamoDB happens to walk** rather than the newest 500. So the live feed is trustworthy, and the six counters above it and the time series beside them are computed from an arbitrary page. Pointing both readers at the same query is the fix, and it is the last piece of making the demo show what actually happened.",
      ],
    },
  },

  {
    slug: 'cloud-resume-challenge',
    group: 'individual',
    title: 'Cloud Resume Challenge',
    // The descriptive page heading. It names both halves, because the split
    // across two providers is the thing that makes this build different from
    // the canonical one.
    fullTitle: 'Static Delivery on Cloudflare Pages, Serverless Counter on AWS',
    accent: 'teal',
    // Start month only. The infrastructure is written and not yet applied, so
    // there is no end date to give and inventing one would be the first
    // fabricated figure on this site.
    period: 'September 2026',
    glance: {
      why: 'The Cloud Resume Challenge is usually finished as a standalone résumé page. This domain already had a landing page doing that job and a workspace doing the other, so the challenge was rebuilt around what was genuinely missing, which was a delivery pipeline and something worth counting.',
      how: 'Both apps build in GitHub Actions and deploy to Cloudflare Pages. The visitor counter is a Lambda function URL over DynamoDB, defined in Terraform and applied by the same pipeline through a role assumed with OIDC.',
      // No `result` key, and its absence is the point. The Glance renders only
      // the lines it finds, so this reads as two lines rather than as a third
      // line making a claim nothing has measured yet.
    },
    role: "Solo build, end to end: the Terraform, the Lambda handler, the IAM policies, the two GitHub Actions workflows, and the terminal command on the landing page that reads the counter back.",
    context: {
      notes: [
        {
          size: 'lead',
          label: 'Why it changed shape',
          text: 'The canonical challenge builds a résumé page on S3 behind CloudFront. This domain already had a landing page that is a résumé, so a third surface would have left two pages doing one job and a recruiter guessing which link was the real one.',
        },
        {
          size: 'lead',
          label: 'What was actually missing',
          text: 'Neither app in this repository had a deployment pipeline at all. Both built to a local `dist/` directory and stopped there, so the delivery half of the challenge had somewhere real to go and became the hosting this site runs on rather than a demo beside it.',
        },
        {
          size: 'support',
          label: 'Why there is no CloudFront',
          text: 'DNS for this domain is already on Cloudflare and already serving another project, so a Route 53 zone would have meant repointing nameservers, breaking that project, and paying monthly for a zone that duplicates one I have.',
        },
        {
          size: 'support',
          label: 'What the number counts',
          text: 'The count goes up when someone opens the terminal on the landing page and runs the `visitors` command, so it measures people who went looking rather than page loads.',
        },
        {
          size: 'support',
          label: 'Where it stops',
          text: 'The infrastructure is written, formatted and validated, and it has not been applied. There is no deploy time, no measured cost and no visitor number on this page because none of them exist yet.',
        },
      ],
    },
    // Every figure here is counted from the repository rather than measured
    // against a running system, because nothing is running yet: 14 `resource`
    // blocks across infra/*.tf and infra/bootstrap/*.tf, one action in the
    // execution role's data-plane statement, five AWS services declared, two
    // workflow files, and no credential of any kind in the repository.
    //
    // The figures a deploy would produce are deliberately absent. Deploy time,
    // billed cost and visitor count go in once they have been observed.
    metrics: [
      {
        size: 'big',
        value: '14',
        label: 'Terraform Resource Blocks',
        detail: '6 in the counter backend, 8 in the bootstrap',
      },
      {
        size: 'square',
        value: '1',
        label: 'Data-Plane Action',
        hint: 'The execution role can call dynamodb:UpdateItem on one table, and nothing else',
      },
      {
        size: 'square',
        value: '0',
        label: 'Stored AWS Keys',
        hint: 'CI assumes a role through GitHub OIDC, so there is no key pair to store or rotate',
      },
      {
        size: 'wide',
        value: '2',
        label: 'Workflows',
        detail: 'One plans and applies, one builds and deploys',
      },
      {
        size: 'square',
        value: '5',
        label: 'AWS Services',
        hint: 'Lambda, DynamoDB, IAM, CloudWatch Logs and S3',
      },
    ],
    stack: [
      { category: 'Hosting/CDN', items: ['Cloudflare Pages'] },
      { category: 'Compute/Data', items: ['Lambda', 'DynamoDB'] },
      { category: 'Identity/Monitoring', items: ['IAM', 'GitHub OIDC', 'CloudWatch'] },
      { category: 'IaC/Automation', items: ['Terraform', 'S3'] },
      { category: 'CI/CD', items: ['GitHub Actions'] },
      { category: 'Application', items: ['Python', 'React', 'Vite'] },
    ],
    architecture: [
      {
        tab: 'Delivery',
        caption:
          'Two-provider delivery pipeline',
        alt: 'A push to the main branch triggers two GitHub Actions workflows. pages.yml runs npm ci and a build, then deploys to two Cloudflare Pages projects serving junhanshin.com and devops.junhanshin.com, which visitors reach over HTTPS. infra.yml runs format, validate, plan and apply, authenticating to AWS in us-east-1 by assuming an OIDC role with sts:AssumeRoleWithWebIdentity, which then applies the counter backend of Lambda, DynamoDB and logs.',
        diagram: {
          width: 1020,
          height: 470,
          zones: [
            { id: 'gh', label: 'GitHub Actions', x: 16, y: 110, w: 300, h: 300, tone: 'onprem' },
            { id: 'cf', label: 'Cloudflare Pages', x: 380, y: 110, w: 300, h: 140, tone: 'cloud' },
            { id: 'aws', label: 'AWS · us-east-1', x: 380, y: 290, w: 620, h: 150, tone: 'cloud' },
          ],
          nodes: [
            { id: 'dev', label: 'Push to main', glyph: 'git', x: 90, y: 60, w: 150, h: 46 },
            { id: 'pages_wf', label: 'pages.yml', sub: 'npm ci · vite build', glyph: 'pipeline', x: 166, y: 175, w: 216, h: 56 },
            { id: 'infra_wf', label: 'infra.yml', sub: 'fmt · validate · plan · apply', glyph: 'pipeline', x: 166, y: 320, w: 250, h: 56 },
            { id: 'root_site', label: 'junhanshin.com', glyph: 'cdn', x: 530, y: 170, w: 224, h: 44 },
            { id: 'devops_site', label: 'devops.junhanshin.com', glyph: 'cdn', x: 530, y: 218, w: 250, h: 44 },
            { id: 'visitor', label: 'Visitors', glyph: 'user', x: 858, y: 170, w: 150, h: 46 },
            { id: 'oidc', label: 'OIDC role', sub: 'AssumeRoleWithWebIdentity', glyph: 'key', x: 520, y: 355, w: 250, h: 56 },
            { id: 'counter_stack', label: 'Counter backend', sub: 'Lambda · DynamoDB · logs', glyph: 'service', x: 838, y: 355, w: 244, h: 56 },
          ],
          edges: [
            { from: 'dev', to: 'pages_wf' },
            // Around the left of the workflow zone rather than through
            // pages.yml, which sits directly between the two.
            { from: 'dev', to: 'infra_wf', via: [[40, 60], [40, 320]] },
            { from: 'pages_wf', to: 'root_site', label: 'wrangler' },
            { from: 'pages_wf', to: 'devops_site' },
            { from: 'infra_wf', to: 'oidc', label: 'OIDC' },
            { from: 'oidc', to: 'counter_stack', label: 'apply', dash: true },
            { from: 'visitor', to: 'root_site', label: 'HTTPS' },
          ],
          captions: [
            {
              x: 16,
              y: 440,
              tone: 'accent',
              text: 'One push to main runs both workflows. A pull request runs only the plan.',
            },
            {
              x: 16,
              y: 462,
              text: 'The two providers share no credential: Cloudflare takes a scoped API token, AWS takes a role that expires with the job.',
            },
          ],
        },
      },
      {
        tab: 'Counter path',
        caption:
          'Visitor counter request path',
        alt: 'The terminal popup in the browser runs the visitors command, issuing a GET to a Lambda function URL with authorisation type NONE and a CORS allow-list. The function URL invokes the counter function, running Python 3.13 on arm64 at 128 MB, which calls UpdateItem with an ADD expression against the crc-counter DynamoDB table and writes to a log group with 14-day retention. An execution role scoped to dynamodb:UpdateItem is what the function assumes.',
        diagram: {
          width: 1000,
          height: 430,
          zones: [
            { id: 'browser', label: 'Browser', x: 16, y: 70, w: 260, h: 200, tone: 'onprem' },
            { id: 'aws', label: 'AWS · us-east-1', x: 330, y: 40, w: 650, h: 345, tone: 'cloud' },
          ],
          nodes: [
            { id: 'terminal', label: 'Terminal popup', sub: 'visitors', glyph: 'wrench', x: 146, y: 175, w: 210, h: 56 },
            { id: 'furl', label: 'Function URL', sub: 'AUTH_TYPE NONE · CORS', glyph: 'cloud', x: 470, y: 130, w: 224, h: 56 },
            { id: 'lambda', label: 'Counter function', sub: 'Python 3.13 · arm64 · 128 MB', glyph: 'service', x: 470, y: 250, w: 254, h: 60 },
            { id: 'ddb', label: 'crc-counter', sub: 'ADD visits :increment', glyph: 'database', x: 812, y: 250, w: 224, h: 60 },
            { id: 'logs', label: 'Log group', sub: '14-day retention', glyph: 'monitor', x: 812, y: 130, w: 204, h: 52 },
            { id: 'role', label: 'Execution role', sub: 'dynamodb:UpdateItem', glyph: 'key', x: 470, y: 350, w: 232, h: 52 },
          ],
          edges: [
            { from: 'terminal', to: 'furl', label: 'GET' },
            { from: 'furl', to: 'lambda' },
            { from: 'lambda', to: 'ddb', label: 'UpdateItem' },
            { from: 'lambda', to: 'logs', dash: true, via: [[694, 250], [694, 130]] },
            { from: 'role', to: 'lambda', dash: true },
          ],
          captions: [
            {
              x: 16,
              y: 400,
              tone: 'accent',
              text: 'The command runs once per page load. The answer is held for the life of the page, because the endpoint increments on every request.',
            },
            {
              x: 16,
              y: 422,
              text: 'The role carries one data-plane action. The function cannot read the table, scan it, or delete from it.',
            },
          ],
        },
      },
    ],
    media: null,
    decisions: [
      {
        keyword: 'Pages over CloudFront',
        title: 'Static delivery runs on Cloudflare Pages rather than S3 behind CloudFront.',
        glyph: 'route',
        chose: '**Cloudflare Pages** for both apps',
        over: 'S3, CloudFront, ACM and a Route 53 hosted zone',
        why: 'DNS for this domain is already on Cloudflare and already serving another project. Moving it to Route 53 would have broken that project and left a hosted zone billing every month for something Cloudflare already does. This is the one requirement I dropped rather than adapted, and building the CloudFront stack is a large part of what the challenge is usually understood to teach.',
      },
      {
        keyword: 'No third surface',
        title: 'The counter went onto the landing page that already existed.',
        glyph: 'branch',
        chose: 'The counter on `junhanshin.com`, read by the terminal',
        over: 'A separate `resume.junhanshin.com`',
        why: 'The landing page is already a résumé, so a second one would have left two surfaces doing one job. The larger gain is that the infrastructure became **what actually serves this site** rather than a demo standing beside it, which is a stronger thing for the page to be able to say.',
      },
      {
        keyword: 'OIDC over keys',
        title: 'CI assumes a role, so no AWS key is stored anywhere in the repository.',
        glyph: 'channels',
        chose: 'A **GitHub OIDC provider** and a role trusting two subjects',
        over: 'An access key pair held in repository secrets',
        why: 'The trust policy names `refs/heads/main` and `pull_request` rather than the repository as a whole, so a push applies and a pull request only plans. A fork reaches neither subject, because GitHub withholds `id-token: write` from workflows it triggers.',
      },
      {
        keyword: 'S3-native locking',
        title: 'State locking uses the S3 lock file instead of a DynamoDB table.',
        glyph: 'process',
        chose: '`use_lockfile = true` on the S3 backend',
        over: 'The `dynamodb_table` lock most write-ups still use',
        why: 'Terraform 1.11 made S3-native locking generally available and deprecated the DynamoDB argument. The lock is now an object written beside the state file, which removes a resource, a line on the bill, and one more thing to forget to delete.',
      },
      {
        keyword: 'Provisioned 5/5',
        title: 'The counter table is provisioned at five units rather than billed on demand.',
        glyph: 'note',
        chose: '**5 read and 5 write units**, with no autoscaling attached',
        over: 'On-demand billing',
        why: 'On-demand would have cost fractions of a cent at this volume, which is a different claim from costing nothing. Five units sit inside the **Always Free allowance of 25**, so the bill is zero by arithmetic. Autoscaling is left off deliberately, because it is the one thing that would quietly carry the table past that line under load.',
      },
      {
        keyword: 'Concurrency cap',
        title: 'Reserved concurrency is the control that bounds abuse of a public endpoint.',
        glyph: 'inject',
        chose: '**Reserved concurrency of 5** on the function',
        over: 'Treating the CORS allow-list as the limit',
        why: 'Browser JavaScript cannot sign a request and there is no CloudFront distribution to hold an origin access control, so the function URL is public. CORS stops another site reading the response and does nothing about `curl`. The concurrency cap is the limit that actually holds, and it costs a **429 to a real visitor** during a burst.',
      },
      {
        keyword: 'Written-out IAM',
        title: 'The deploy role carries a hand-written policy instead of a managed one.',
        glyph: 'depth',
        chose: 'Seven statements, each scoped to one constructed ARN',
        over: '`PowerUserAccess`, or an inline wildcard',
        why: '`iam:PassRole` is the dangerous entry in that list, and naming a single role is what stops CI handing any identity in the account to a Lambda. The cost is real and worth stating: adding a resource means adding its actions first, and the failure mode is an apply that dies on **AccessDenied against a policy that looks entirely correct**.',
      },
    ],
    links: {
      github: 'https://github.com/ShinJunhan/junhanshin-portfolio',
      terraform: 'https://github.com/ShinJunhan/junhanshin-portfolio/tree/main/infra',
      presentation: null,
    },
    // Six files, read out of this repository rather than copied into
    // content/. Three are the counter itself, one is the handler, one is the
    // policy that decides what CI may do, and one is the pipeline that runs
    // it. `versions.tf` and `variables.tf` are absent for the reason the other
    // projects omit their own scaffolding files: they declare no resources and
    // carry none of the argument.
    terraform: [
      { path: 'infra/lambda.tf', content: crcLambdaTf },
      { path: 'infra/dynamodb.tf', content: crcDynamodbTf },
      { path: 'infra/iam.tf', content: crcIamTf },
      { path: 'backend/functions/counter/handler.py', content: crcHandler },
      { path: 'infra/bootstrap/deploy_policy.tf', content: crcDeployPolicyTf },
      { path: '.github/workflows/infra.yml', content: crcInfraWorkflow },
    ],
    // No reflection section until the thing has been applied and run. What a
    // project taught is answered after it exists, and the section drops out on
    // its own when the key is absent.
    reflection: null,
  },

  {
    slug: 'kubernetes-challenge',
    group: 'individual',
    title: 'Kubernetes Challenge',
    // placeholder — the descriptive page heading. `title` above stays the
    // short name the sidebar shows and the eyebrow repeats.
    fullTitle:
      'Containerized E-Commerce Workload on EKS with GitOps Delivery',
    accent: 'plum',
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
      'The Kubernetes Resume Challenge: an e-commerce workload taken from a container image to a running, autoscaling, self-updating cluster. Deliberately kept separate from the team autoscaling work so the solo end-to-end path stands on its own.',
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
        keyword: 'Short keyword',
        title: 'The decision stated in one sentence.',
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
