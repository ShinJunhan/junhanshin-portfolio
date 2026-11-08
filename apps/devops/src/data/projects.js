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

// Midam's (the KT fellowship project), on the same terms as hailcast: comments
// and the messages a person reads are translated, and every identifier, flag,
// value, and line of logic is byte-for-byte what Jangingmall/infra holds. Five
// files from Junhan's own track; see the entry's `terraform` key for the order.
import ktNatTf from '../content/kt-fellowship-project/code/terraform/modules/nat/main.tf?raw'
import ktEksTf from '../content/kt-fellowship-project/code/terraform/modules/eks/main.tf?raw'
import ktEksNodesTf from '../content/kt-fellowship-project/code/terraform/modules/eks_nodes/main.tf?raw'
import ktEksAddonsTf from '../content/kt-fellowship-project/code/terraform/modules/eks_addons/main.tf?raw'
import ktHaDrill from '../content/kt-fellowship-project/code/scripts/ha_failover_drill.py?raw'

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
//                 `layout: 'collage'` with exactly six notes swaps the even
//                 grid for a collage: the `hero` note sits in the middle of
//                 the top row, and each note's `tone` (why | what | limit)
//                 picks its paper colour.
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
  // Unassigned as a page accent since the fellowship page moved to berry.
  // Kept mapped: a grey reads as an unthemed page, and DESIGN.md says not to
  // reach for it again. The token itself stays for the avatars and the wheel.
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
  // The fellowship page's (Midam), replacing steel. See the token in
  // global.css for why it is a berry.
  berry: 'var(--c-berry)',
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

// Midam's eight tracks, in the deck's order. Each member of that page's team
// points at one, and Avatars groups the header row by it: the code sits under
// each cluster, and the name is the cluster's accessible label.
const MIDAM_TRACKS = {
  PM: { code: 'PM', name: 'Product Management' },
  PD: { code: 'PD', name: 'Product Design' },
  AI: { code: 'AI', name: 'Generative AI' },
  FE: { code: 'FE', name: 'Front-End' },
  BE: { code: 'BE', name: 'Back-End' },
  CI: { code: 'CI', name: 'Cloud Infrastructure' },
  CN: { code: 'CN', name: 'Cloud Native' },
  SEC: { code: 'SEC', name: 'Cloud Security' },
}

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
      // The build role under the monogram, with the PR role in the pill
      // beneath it. Kept in full even though it wraps to two lines in the
      // avatar column: "Infra" is how the Members row shortens it, not this.
      title: 'Infrastructure Build Lead',
      subtitle: 'PR Owner',
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
      // The lead role under the monogram, with the track in the pill beneath
      // it. "Infra" rather than "Infrastructure" so the pill stays one line in
      // the avatar column, where the full word wrapped it to two.
      title: 'Team Lead',
      subtitle: 'Infra Track Owner',
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
    // The three answers a reader who never scrolls should still come away
    // with. Hyphenated terms use the non-breaking hyphen (‑) so a line
    // never ends on half a word.
    glance: {
      why: 'This project was the capstone of our cloud infrastructure course, and it was our most ambitious build yet. As the lead of a six‑member team, I set a goal for us to put core skills such as **Kubernetes**, **GitOps**, and **FinOps** into real practice. Working from the project guidelines, we decided to design cloud infrastructure that would solve a problem most always‑on services face: **over‑provisioning**. We built hailcast, a taxi platform on Amazon EKS whose capacity follows demand through predictive autoscaling. It pays for the capacity it needs instead of peak prices all day.',
      // `loop` draws an illustrative day (taxi calls as an area, the forecast
      // floor as a step line, one queue spike) above the deck's four-stage
      // control loop (slide 10). The curves are drawn to show the two
      // scaling layers, not recorded data, and the note under the chart says
      // so. Values are fractions of the chart height, one per hour, 0 to 24.
      how: {
        loop: {
          calls: [0.1, 0.07, 0.05, 0.05, 0.06, 0.12, 0.3, 0.55, 0.62, 0.45, 0.38, 0.4, 0.44, 0.42, 0.45, 0.52, 0.62, 0.78, 0.95, 0.7, 0.55, 0.42, 0.28, 0.16, 0.1],
          floor: [0.15, 0.12, 0.1, 0.1, 0.12, 0.2, 0.45, 0.68, 0.68, 0.55, 0.48, 0.48, 0.52, 0.52, 0.55, 0.62, 0.72, 0.8, 0.8, 0.8, 0.65, 0.52, 0.38, 0.25, 0.15],
          // Every 4 hours: weather-cron and the ForecastScheduler (slide 30).
          forecastEvery: 4,
          labels: {
            forecast: 'forecast every 4 h',
            floor: 'floor rises first',
            // The KEDA queue trigger, 500 messages (slide 26).
            spike: 'queue > 500',
            scaleIn: 'scale in',
          },
          stages: [
            { key: '01 Observe', tool: 'Prometheus' },
            { key: '02 Forecast', tool: 'LightGBM' },
            { key: '03 Execute', tool: 'KEDA + Karpenter' },
            { key: '04 Verify', tool: 'OpenCost' },
          ],
          // Slide 10's own wording for the return arrow.
          back: 'verification results feed the next forecast',
          note: 'Illustrative day, drawn to show the two layers.',
        },
      },
      // Simulated and measured side by side, each under its own label.
      // `pods`: 216 pod-hours a day is 9 pods all day (the observed peak);
      // 158.75 is 6.61. The saving is the 2.39 pods between them, 26.5%.
      // `measured`: the refinement's AWS net cost for the last fully settled
      // day (OpenCost reading the CUR, captured 2026-08-25), for the whole
      // dev environment rather than the cluster alone.
      result: {
        pods: {
          peak: 9,
          forecast: 6.61,
          saving: '−26.5%',
          forecastLabel: '6.6 with the forecast',
          peakLabel: '9 at peak',
          caption:
            'Each block represents one worker pod running for 24 hours. The figures come from eight days of recorded scaling decisions. The hatched blocks show the simulated saving.',
        },
        measured: {
          value: '$8.71',
          text: 'This is the project’s AWS bill for one day.',
        },
      },
    },
    // My Role as a bento of six duties, each with a small visual that restates
    // its sentence. Every claim here traces to a PR he authored or to a figure
    // from the GitHub API (reviews), the teardown results doc (140 / 0), or the
    // course schedule (Aug 4 and Aug 27). The Terraform, the IRSA design, the
    // naming convention, the contract checker and the rebuild document are the
    // deputy lead's and the rebuild team's, and are not claimed here.
    role: {
      title: 'Team Lead',
      subtitle: 'Operations Track Owner',
      // `areas` — the lead takes the left half over two rows, the teardown
      // result and the silent-failure fix stack beside it, and three small
      // tiles share the bottom row.
      layout: 'areas',
      areas: [
        'L L L L L L T T T T T T',
        'L L L L L L G G G G G G',
        'E E E E R R R R P P P P',
      ],
      tiles: [
        {
          area: 'L',
          size: 'lead',
          label: 'Team Lead',
          visual: {
            type: 'hub',
            from: { name: 'ops', cmd: 'make' },
            to: [
              { name: 'infra', cmd: 'terraform apply' },
              { name: 'app', cmd: 'docker build' },
              { name: 'manifests', cmd: 'Argo CD pull' },
            ],
          },
          text: 'Coordinated **six people across four repositories** and owned the ops repo that runs the other three from one console.',
          footer: {
            type: 'reviews',
            value: '177 of 248',
            unit: 'teammate PRs reviewed',
            bars: [
              { name: 'infra', count: 80 },
              { name: 'manifests', count: 65 },
              { name: 'ops', count: 19 },
              { name: 'app', count: 13 },
            ],
          },
        },
        {
          area: 'T',
          size: 'medium',
          tone: 'accent',
          label: 'Teardown Orchestration',
          visual: {
            type: 'result',
            items: [
              { value: '140', unit: 'resources removed' },
              { value: '0', unit: 'errors' },
            ],
          },
          text: 'Built the teardown orchestrator and its scripts for **infra, app, and manifests**, which removed **140 resources with zero errors** on August 3.',
        },
        {
          area: 'G',
          size: 'medium',
          label: 'Silent Teardown Fix',
          visual: {
            type: 'beforeAfter',
            rows: [
              { cmd: 'make destroy-all-yes', stage: 'preview only', outcome: '“done”, 0 deleted', ok: false },
              { cmd: 'CONFIRM=yes', stage: 'infra stage', outcome: 'real destroy', ok: true },
            ],
          },
          text: 'Fixed a silent failure where the one-command teardown reported success **without deleting anything**. Added an **account guard** before the real destroy.',
        },
        {
          area: 'E',
          size: 'small',
          label: 'Edge Module',
          visual: {
            type: 'chips',
            items: [
              { text: 'Route53' },
              { text: 'CloudFront' },
              { text: 'ACM us-east-1', accent: true },
              { text: 'ACM ap-northeast-2', accent: true },
            ],
          },
          text: 'Built the **Route53, CloudFront, and ACM** edge module with certificates in two regions behind an `enable_edge` switch.',
        },
        {
          area: 'R',
          size: 'small',
          label: 'Profile Isolation',
          visual: {
            type: 'routes',
            rows: [
              { when: 'in the project', profile: '[hailcast]', active: true },
              { when: 'anywhere else', profile: '[default]' },
            ],
          },
          text: 'Kept every teammate’s personal AWS login separate by having `setup` create and switch to a **hailcast profile** automatically.',
        },
        {
          area: 'P',
          size: 'small',
          label: 'Presenter',
          visual: {
            type: 'calendar',
            dates: [
              { month: 'AUG', day: '4', label: 'First presentation' },
              { month: 'AUG', day: '27', label: 'Refinement presentation', active: true },
            ],
          },
          text: 'Presented the **original build** and the **refined build** to the course.',
        },
      ],
    },
    // The collage board: one hero note in the middle of the top row, the
    // other two "why" notes either side of it, and three notes below. Each
    // label is the question the note answers, and each lede is the short
    // answer. `tone` picks the paper: why (accent), what (indigo), and limit
    // (ink). At a Glance already covers the capstone, the team, the stack, and
    // the 26.5% and $8.71 figures, so none of that repeats here.
    //
    // Sources: slide 4 (the opening question), slide 8 (riders wait on
    // drivers), slide 4 (reactive versus forecast-led scaling), slides 5 and
    // 32 (New York taxi and weather data), slide 12 (other services), and
    // slide 44 (the three fixed costs).
    context: {
      layout: 'collage',
      notes: [
        {
          hero: true,
          tone: 'why',
          label: 'What Does a Server That Never Fails Cost?',
          lede: 'We suspected that taxi apps rarely go down because their servers run at **peak capacity** all day.',
          text: 'If that is true, the platform pays the same price in the early morning as it does during the evening rush.',
        },
        {
          tone: 'why',
          label: 'What Makes Riders Wait?',
          lede: 'Riders wait when there are not enough **drivers**.',
          text: 'Our first goal was to prevent server delays during traffic spikes. After this finding, we changed our goal to cutting the fixed cost of **idle capacity**.',
        },
        {
          tone: 'why',
          label: 'Can Infrastructure Move First?',
          lede: 'We wanted to add capacity before the calls arrive.',
          text: 'Most infrastructure adds capacity only after the load arrives. We used a demand **forecast** to start scaling earlier.',
        },
        {
          tone: 'what',
          label: 'Why Taxis and Weather?',
          lede: 'Taxi demand changes with the time of day and the weather.',
          text: 'We trained our model on public **New York City** taxi data matched with hourly **weather** data. The model learns patterns such as more calls on a rainy Friday evening.',
        },
        {
          tone: 'what',
          label: 'Where Else Does It Fit?',
          lede: 'Other services with hourly demand swings can use it.',
          text: 'Examples include **delivery platforms**, **ticketing systems**, and high-traffic APIs.',
        },
        {
          tone: 'limit',
          label: 'What Can Pod Scaling Not Save?',
          lede: 'Some costs stay the same at any traffic level.',
          text: 'The **EKS control plane**, the **NAT gateway**, and **RDS** run all day. We tracked these three costs separately from pod scaling.',
        },
      ],
    },
    // `size` drives the bento layout. On the 5-column grid these nine tile it
    // exactly over three rows: the big tile (2x2) plus three squares, the big
    // tile's second row plus a wide (2) and a square, then a wide, a square,
    // and a wide.
    //
    // The big tile is the pod-hour saving because it is the number the whole
    // project was built to produce, and its detail says it is a simulation.
    // Every hint and detail is written as complete sentences. "0 Wrong-Account
    // Runs" was dropped because nothing counts those runs; 259 merged PRs is
    // the team's total from GitHub. The NAT, CUR-rows, and runbook tiles were
    // dropped because Decisions and Implementation Steps already say them.
    //
    // `metricsLarge` makes the square tiles' numbers bigger to fill their
    // space, and justifies the detail lines under the wide and big tiles.
    metricsLarge: true,
    metrics: [
      {
        size: 'big',
        value: '26.5%',
        label: 'Worker Pod-Hours Saved',
        detail: 'The simulation cut worker pod-hours from 216 to 158.8 a day. It replayed eight days of recorded scaling decisions against a fleet held at peak size.',
      },
      {
        size: 'square',
        value: '12',
        label: 'IRSA Roles',
        hint: 'Each ServiceAccount has its own AWS role. The first presentation had ten, and the refinement added two.',
      },
      {
        size: 'square',
        value: '16',
        label: 'ArgoCD Applications',
        hint: 'ArgoCD deploys every app and add-on from Git. It reverts any change made by hand in the cluster.',
      },
      {
        size: 'square',
        value: '6',
        label: 'Always-On Pods',
        hint: 'Six pods run at all times. KEDA scales only the worker pod.',
      },
      {
        size: 'wide',
        value: '4',
        label: 'Repos, One Console',
        detail: 'The infra, app, manifests, and ops repositories each deploy a different way. One Makefile in the ops repository runs all four.',
      },
      {
        size: 'square',
        value: '259',
        label: 'PRs Merged',
        hint: 'The team merged 259 pull requests across four repositories.',
      },
      {
        size: 'wide',
        value: '140',
        label: 'Resources Torn Down',
        detail: 'The August 3 teardown took 21 minutes 40 seconds. It finished with zero errors and zero warnings.',
      },
      {
        size: 'square',
        value: '5',
        label: 'Schedulers',
        hint: 'The predict pod runs five schedulers. They handle forecasts, scaling, traffic, backups, and accuracy checks.',
      },
      {
        size: 'wide',
        value: '$8.71',
        label: 'Measured AWS Cost / Day',
        detail: 'The development environment cost this much on its last fully billed day. OpenCost read the figure from the AWS Cost and Usage Report.',
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
    // deliberately different from `decisions` below. Five, not twenty: the
    // wheel already lists every tool.
    //
    // Written in EchoChallengers' "We chose X because…" voice, with one
    // concrete number each. "We" throughout: the team's merged PRs show every
    // one of these tools came in through another track (KEDA, Karpenter,
    // OpenCost and the Telegram alerts through the autoscaling and monitoring
    // track, ArgoCD through the deployment track, LightGBM through the app
    // repo), so none of them is "I chose".
    //
    // Sources: slide 26 (500 messages a pod, 16 applications, selfHeal), slide
    // 32 (the six inputs, four hours), RUNBOOK.md (eight alert rules, the
    // 1,000-message queue alert), and the refinement's CUR pipeline.
    stackNotes: [
      {
        tool: 'Why KEDA and Karpenter?',
        icon: 'KEDA',
        text: 'We chose **KEDA** and **Karpenter** because pods and nodes needed different scalers. KEDA sets the pod count from the forecast floor and adds one worker pod for every **500** messages in the **SQS queue**. Karpenter adds **Spot nodes** when new pods have nowhere to run and removes them when the pods are gone.',
      },
      {
        tool: 'Why LightGBM?',
        icon: 'Python',
        text: 'We chose **LightGBM** because our training data was small and tabular. The model learns from **six** inputs: the hour, the day of the week, a weekend flag, humidity, temperature, and precipitation. It predicts the calls for each of the next **four hours**.',
      },
      {
        tool: 'Why ArgoCD?',
        icon: 'ArgoCD',
        text: 'We chose **ArgoCD** because we wanted Git to decide what runs in the cluster. Terraform builds the AWS resources, and ArgoCD manages **16** applications inside the cluster. Its **selfHeal** option reverts any manual change to match Git.',
      },
      {
        tool: 'Why OpenCost?',
        icon: 'Prometheus',
        text: 'We chose **OpenCost** because the AWS bill does not show what each workload costs. OpenCost splits cluster cost by namespace and pod, and we used it to track the worker pods on their own. After the refinement, it priced the cluster from the real bill in the **Cost and Usage Report**.',
      },
      {
        tool: 'Why Telegram?',
        icon: 'Telegram',
        text: 'We chose **Telegram** to send alerts straight to our phones. **Eight** alert rules reach it through **Alertmanager**. The queue alert fires at **1,000** messages, twice the KEDA trigger of 500, and only fires when scaling cannot keep up.',
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
              text: 'The call API was planned to run in both zones for high availability. RDS and the NAT gateway are fixed to 2a, which is a cost choice.',
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
        alt: 'The weather-cron pod, a Deployment with its own four-hour timer, calling the Open-Meteo forecast API for New York out through the NAT gateway, checking the response is valid, logging the error and waiting for the next cycle if it is not, and otherwise overwriting the forecast CSV in S3 for the prediction pods to read',
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
            // A Deployment with its own four-hour timer, not a Kubernetes CronJob
            // (apps/weather-cron/deployment.yaml, deck slide 31). The draw.io
            // export behind the Detailed toggle still says CronJob: it was drawn
            // before the build settled.
            { id: 'job', label: 'weather-cron', sub: 'Deployment · own timer', glyph: 'pipeline', x: 125, y: 85, w: 220 },
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
        alt: 'Cluster topology: the AWS-managed EKS control plane outside the user VPC, one managed system node group with a node in each of availability zones 2a and 2c, Karpenter Spot nodes in both zones, an ALB with a network interface in each public subnet, one NAT gateway in 2a that the 2c private subnet shares by routing, and a VPC gateway endpoint carrying S3 and DynamoDB traffic past it',
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
            // One managed node group with two nodes (modules/eks/nodegroup.tf: min 2,
            // desired 2), drawn once per zone the nodes land in.
            { id: 'sysA', label: 'System node group', sub: 'node 1 of 2', glyph: 'server', x: 365, y: 300, w: 190, h: 54 },
            // The NodePool allows Spot only (addons/karpenter/nodepool.yaml).
            { id: 'karpA', label: 'Karpenter nodes', sub: 'EC2 Spot · from zero', glyph: 'cluster', x: 365, y: 410, w: 190, h: 54 },
            { id: 'sysC', label: 'System node group', sub: 'node 2 of 2', glyph: 'server', x: 755, y: 300, w: 190, h: 54 },
            { id: 'karpC', label: 'Karpenter nodes', sub: 'EC2 Spot · from zero', glyph: 'cluster', x: 755, y: 410, w: 190, h: 54 },
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
        alt: 'Pod-level view: Route 53 and the ALB forwarding into ClusterIP services in front of the call API, predict, simulator and frontend pods, with a KEDA-scaled worker deployment; the call API publishing to SQS and a KEDA-scaled worker deployment consuming from it and writing to RDS; Karpenter provisioning a node for a pending worker pod; the weather-cron pod fetching from the external Open-Meteo API into S3; and Prometheus, Grafana and Alertmanager watching the cluster with alerts leaving for Telegram',
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
            // The dashboard. The ALB sends `/` here (apps/frontend/ingress.yaml);
            // the draw.io export behind the Detailed toggle leaves it out.
            { id: 'svcFront', label: 'frontend svc', sub: 'ClusterIP', glyph: 'service', x: 250, y: 465, w: 170, h: 50 },
            { id: 'podFront', label: 'frontend pod', sub: 'dashboard', glyph: 'container', x: 455, y: 465, w: 150, h: 50 },
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
            // The ingress rules: `/api/dashboard`, `/api/scaling` and `/api/prediction`
            // go to predict, and `/` goes to the frontend down the left lane.
            { from: 'alb', to: 'svcPred', via: [[430, 112], [370, 112], [370, 310]] },
            { from: 'alb', to: 'svcFront', via: [[430, 112], [155, 112], [155, 465]] },
            { from: 'svcFront', to: 'podFront' },
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
├── project3-hailcast-app         	# builds the six pod images for ECR and trains the LightGBM model for S3.
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
    // Written as the whole team's flow in "we", with only two lines about my
    // own part (the destroy-all-yes catch and the August 3 orchestrator run).
    // Marks follow one rule: every technology named, plus the two
    // presentation dates.
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
          text: 'We reviewed our first two team projects and set three rules: one measurable goal, one naming document, and no resource the system does not need. We redefined the problem from server delays to the cost of idle capacity, split six people across four repositories, and started the **VPC** and **EKS** cluster. We also trained the first **LightGBM** model on public New York City taxi and weather data.',
        },
        {
          id: 'foundation',
          title: 'Foundation',
          range: 'Jul 13 – Jul 27',
          from: '2026-07-13',
          to: '2026-07-27',
          text: 'We built the AWS foundation with **Terraform**, including **EKS**, ten **IRSA** roles, **SQS**, **RDS**, and **S3**. We deployed **KEDA**, **Karpenter**, **ArgoCD**, and the monitoring stack through **GitOps** and shipped the six application pods with image tags set by CI. The predict pod started running the model every four hours and setting the KEDA floor from its forecast. I caught a silent failure where `make destroy-all-yes` printed "done" without deleting anything.',
        },
        {
          id: 'rails',
          title: 'Safety Rails & Teardown Control',
          range: 'Jul 28 – Aug 4',
          from: '2026-07-28',
          to: '2026-08-04',
          text: 'We tuned the scaling thresholds, finished the alert rules, and scripted the **ArgoCD** install. On August 3, the teardown orchestrator I built destroyed the whole environment: 140 resources in 21 minutes 40 seconds with zero errors. We presented the first version on **August 4**.',
        },
        {
          id: 'refine',
          title: 'Refinement & Re-presentation',
          range: 'Aug 13 – Aug 27',
          from: '2026-08-13',
          to: '2026-08-27',
          text: 'Our integrated fellowship project started on August 5, and from August 13 we refined hailcast alongside it. We rebuilt the environment from scratch and turned the runbook\'s three stalls into one `make bootstrap-all`. We also connected the real AWS bill to **OpenCost**, removed the CPU limits, and limited the load balancer to **CloudFront**. The model started logging the hours it under-predicted and retraining on them every night at 03:00. We presented the refined build on **August 27**.',
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
        "This clip comes from the first presentation. The Korean captions are the team's own. It has no sound and plays on a loop.",
      stillsNote:
        "These captures come from the team's report deck. Click one to open it at full size.",
      scenarios: [
        {
          id: 'predictive-scaling',
          tab: 'Predictive scaling',
          label: 'Demo 1: The forecast raising the floor',
          lead:
            'We set the 10:00 forecast in RDS to **5,000** calls by hand. The predict pod raised the worker floor, and **10** pods were Ready before any traffic arrived.',
          clip: {
            src: '/projects/hailcast/clip-01-predict.mp4',
            width: 1280,
            height: 720,
            poster: '/projects/hailcast/clip-01-predict.jpg',
            speed: '3.6x',
            alt: 'A forecast run writing predicted demand into RDS, followed by the worker pod count rising to ten ahead of the traffic',
          },
          stillsNote:
            "The first two frames come from the clip above. The last capture comes from the team's report deck. Click one to open it at full size.",
          shots: [
            {
              src: '/projects/hailcast/demo-01-forecast-set.png',
              state: 'Forecast set to 5,000 for 10:00',
              alt: 'A terminal reading the latest forecast from RDS in New York time: the 10:00 row on July 30 shows a predicted demand of 5000.0, and the 11:00 to 13:00 rows show 3361.64, 3611.01, and 3842.85',
            },
            {
              src: '/projects/hailcast/demo-01-pods-ready.png',
              state: 'Ten pods Ready, as forecast',
              alt: 'The hailcast simulator dashboard reading 10 pods, 0 traffic and 1 node, with a pod chart by New York hour whose tooltip shows 10 actual pods against 10 predicted pods',
            },
            {
              src: '/projects/hailcast/demo-01-predictive-scaling.png',
              state: 'Ten workers Ready',
              alt: 'The hailcast Grafana dashboard "01 예측 기반 스케일링" showing a runtime summary row: prediction collection available, one predict pod Ready, an applied scaling threshold of 3, ten worker pods Ready, and a Ready-versus-threshold panel reading satisfied, above a five-minute chart of predict container restarts holding flat at zero',
            },
          ],
        },
        {
          id: 'keda-queue',
          tab: 'KEDA queue trigger',
          label: 'Demo 2: The reactive layer catching the overflow',
          lead:
            'With the forecast too low for the hour, we sent **10,000** calls through the simulator. KEDA added workers from the queue while the cluster held at **3** Ready nodes.',
          clip: {
            src: '/projects/hailcast/clip-02-keda.mp4',
            width: 1280,
            height: 720,
            poster: '/projects/hailcast/clip-02-keda.jpg',
            speed: '2x',
            alt: 'The simulator sending 10,000 calls against a low forecast, with the worker dashboard showing three Ready nodes and workers at 22.7 percent of their CPU request',
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
            'KEDA scaled the workers from **3** to **11** pods under load. After five minutes with no new traffic, the extra pods began to terminate.',
          clip: {
            src: '/projects/hailcast/clip-03-worker.mp4',
            width: 1280,
            height: 720,
            poster: '/projects/hailcast/clip-03-worker.jpg',
            speed: '1.5x',
            alt: 'The simulator dashboard counting worker pods up from three to eleven under load, then pods terminating after five minutes without new traffic',
          },
          stillsNote:
            "The first two frames come from the clip above. The last capture comes from the team's report deck. Click one to open it at full size.",
          shots: [
            {
              src: '/projects/hailcast/demo-03-workers-eleven.jpg',
              state: 'Eleven workers under load',
              alt: 'The hailcast simulator dashboard reading 11 pods beside a terminal listing eleven running worker pods, a KEDA ScaledObject with a minimum of 3 and a maximum of 20, and three Ready nodes',
            },
            {
              src: '/projects/hailcast/demo-03-workers-terminating.jpg',
              state: 'Workers terminating after five minutes',
              alt: 'The same view a few minutes later: the simulator dashboard reads 7 pods and the terminal shows two worker pods in the Terminating state',
            },
            {
              src: '/projects/hailcast/demo-03-worker-runtime.png',
              state: 'Six workers at 32.3 percent',
              alt: 'The hailcast Grafana dashboard "03 Worker 및 Kubernetes" showing six running worker pods, zero Pending, a flat zero container-restart rate over five minutes, and a Worker Ready gauge at 100 percent; a resource row below plots worker CPU rising to roughly 0.5 cores and memory to about 400 MiB, with CPU usage against request shown on a gauge at 32.3 percent',
            },
          ],
        },
        {
          id: 'pod-hour-saving',
          tab: 'Pod-hour simulation',
          label: 'The 26.5% figure, and what it is made of',
          lead:
            'The saving is a simulation. Fixed peak capacity uses **216** pod-hours a day, and the forecast floor uses **158.8**.',
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
          label: 'The refinement: cost read from the AWS bill',
          lead:
            'OpenCost had been pricing the cluster from AWS list prices. Its query of the Cost and Usage Report was denied for a missing S3 permission. The refinement fixed the permission, and the board now reads **$8.71** for the most recent day in the report.',
          clip: {
            src: '/projects/hailcast/clip-05-finops.mp4',
            width: 1280,
            height: 720,
            poster: '/projects/hailcast/clip-05-finops.jpg',
            speed: '3.2x',
            alt: 'An OpenCost query failing on a denied S3 permission, then the same cost board reading a billed net cost of 8.71 dollars from the real Cost and Usage Report',
          },
          clipNote:
            "This clip comes from the refinement presentation. The Korean captions are the team's own. It has no sound and plays on a loop.",
          stillsNote:
            "The first two frames come from the clip above. The last capture comes from the team's report deck. Click one to open it at full size.",
          shots: [
            {
              src: '/projects/hailcast/demo-04-athena-denied.png',
              state: 's3:ListBucket denied',
              alt: 'An Athena query on the hailcast_dev_cur table failing with PERMISSION_DENIED because the OpenCost IRSA role is not authorized to perform s3:ListBucket on the CUR bucket',
            },
            {
              src: '/projects/hailcast/demo-04-athena-passing.png',
              state: 'The same query passing',
              alt: 'The same Athena query completing after the IAM fix, returning one result row from the hailcast_dev_cur table',
            },
            {
              src: '/projects/hailcast/demo-04-finops-cost.png',
              state: '$8.71 for the most recent day',
              alt: 'The hailcast Grafana dashboard "04 Hailcast 비용 / FinOps", split into an AWS section reading from the Cost and Usage Report and a Kubernetes section reading from OpenCost: a headline of $8.71 as the net cost of the most recent day in the report, a daily trend line holding near $16 from August 19 to 23 and falling away on the 24th, a per-service bar chart led by EC2 with EKS, S3, RDS, ELB and smaller services beneath it, and a category doughnut at 58.64 percent compute; below, three seven-day totals of $70.12 for nodes, $26.44 for the hailcast namespace and $9.28 for worker, then per-node and per-namespace breakdowns and a chart plotting worker cost against worker Ready count across five daily cycles',
            },
          ],
        },
        {
          id: 'retraining',
          tab: 'Retraining loop',
          label: 'The refinement: a training job that can fail out loud',
          lead:
            'Forecasts that fell short of real demand are logged in DynamoDB. Retraining continues the model from **8,000** trees to **8,026**. A run that added no trees used to finish as a success. Now it fails and raises **KubeJobFailed** in Telegram.',
          clip: {
            src: '/projects/hailcast/clip-06-retraining.mp4',
            width: 1280,
            height: 720,
            poster: '/projects/hailcast/clip-06-retraining.jpg',
            speed: '3.8x',
            alt: 'The DynamoDB prediction log holding predicted against actual demand, a continued-training run uploading a new model to S3, and a KubeJobFailed alert arriving in Telegram',
          },
          clipNote:
            "This clip comes from the refinement presentation. The Korean captions are the team's own. It has no sound and plays on a loop.",
          // The only scenario whose stills are not from the report deck. That
          // deck has no capture of this material, so these are frames out of
          // the recording, and the note below says so rather than letting them
          // pass as deck images like the other six.
          stillsNote:
            'This scenario is not in the report deck. These frames come from the refinement recording. Click one to open it at full size.',
          // Two shots rather than one, because the point of this scenario is
          // that the job reports either outcome. One still could only show it
          // succeeding, which is the half that was never the problem.
          before: {
            src: '/projects/hailcast/demo-06-retraining-run.jpg',
            state: '8,000 trees to 8,026',
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
            'The rebuilt board shows the prediction service available and the HPA asking for **8** workers. All **8** are Ready, the queue is empty, and no pods are Pending or restarting.',
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
    // Card values are justified here; each one was checked for gaps.
    decisionsJustify: true,
    decisions: [
      {
        keyword: 'Single NAT gateway',
        title: 'Outbound traffic from the private subnets uses one NAT gateway in zone 2a.',
        glyph: 'route',
        chose: 'One **NAT gateway** in zone 2a',
        over: 'one NAT gateway per availability zone',
        why: 'A second NAT gateway would have raised the cost from about **$43** to **$86 a month**. We kept one gateway in zone 2a and accepted that an outage there would stop outbound traffic.',
      },
      {
        keyword: 'Add-ons via ArgoCD',
        title: 'ArgoCD installs every cluster add-on, and Terraform builds only the AWS resources.',
        glyph: 'branch',
        chose: 'Add-ons that ArgoCD syncs from the **manifests** repository',
        over: 'installing each add-on from Terraform',
        why: 'If Terraform and ArgoCD both managed an add-on, each tool would undo the changes of the other. We let Terraform build the AWS resources and ArgoCD install everything inside the cluster.',
      },
      {
        keyword: 'Account ID guard',
        title: 'The safety guard checks which AWS account the credentials belong to.',
        glyph: 'inject',
        chose: 'Checking the caller\'s **account ID**',
        over: 'forcing one fixed profile name',
        why: 'Forcing one profile name broke a server using the default profile and CI signing in through **OIDC**. The guard now compares the **account ID** directly and works for both.',
      },
      {
        keyword: 'Single-value .env',
        title: 'The scripts read only one value from the `.env` file.',
        glyph: 'note',
        chose: 'Reading a single line of `.env`',
        over: '`source .env`, which runs the whole file',
        why: 'Sourcing `.env` could point the guard and Terraform at different accounts and run any code in the file. The scripts now read only the `PROJECT_ACCOUNT_ID` line.',
      },
      {
        keyword: 'Ordered teardown',
        title: 'Teardown runs in three stages: manifests, infrastructure, and app.',
        glyph: 'pipeline',
        chose: 'Manifests, infrastructure, and app, with a **y/N** gate before each stage',
        over: 'running `terraform destroy` first',
        why: '`terraform destroy` misses the load balancers and nodes that Kubernetes created, and those resources keep billing. Deleting the Kubernetes objects first removed **140 resources** with **zero errors** on August 3.',
      },
      {
        keyword: 'Separate IRSA and RBAC',
        title: 'IRSA and Kubernetes RBAC are managed as two separate systems.',
        glyph: 'channels',
        chose: '**IRSA** for AWS access and **RBAC** for the Kubernetes API',
        over: null,
        why: 'The predict pod reads S3 through an IAM role and patches a KEDA `ScaledObject` through Kubernetes RBAC. Neither system can grant the permissions of the other, and a one-character ServiceAccount typo breaks both with a plain access denied.',
      },
      {
        keyword: 'Controllers off Spot',
        title: 'Controllers run on fixed nodes, and application pods run on Spot.',
        glyph: 'depth',
        chose: 'Two fixed **system nodes** for the controllers',
        over: 'running everything on Spot',
        why: 'If Karpenter and KEDA ran on Spot, a reclaim could remove the tools that respond to reclaims. The application nodes still drop to **zero** on a quiet night, and that is where the savings come from.',
      },
      {
        keyword: 'Scheduler without Lambda',
        title: 'EventBridge Scheduler stops the nodes and the database every night.',
        glyph: 'process',
        chose: '**EventBridge Scheduler** calling the AWS API on its own',
        over: 'a scheduled Lambda function',
        why: 'The scheduler stops the node group and RDS at 02:00 KST and starts them at 10:00 without a function to maintain. A failed run retried twice and then dropped silently, and we now check the node count every morning.',
      },
      {
        keyword: 'No CPU limits',
        title: 'CPU limits were removed from every service, and CPU requests stayed.',
        glyph: 'process',
        chose: 'CPU requests only, on all **six** services',
        over: 'raising each CPU limit',
        why: 'A CPU limit slowed busy pods until they missed health checks and restarted with their in-memory state lost. Memory keeps its limit, and the risk we accepted is that one runaway pod can use the CPU of a whole node.',
      },
      {
        keyword: 'Separate retraining role',
        title: 'The retraining job runs under its own ServiceAccount.',
        glyph: 'channels',
        chose: 'A separate IAM role that writes only the **latest model**',
        over: 'reusing the predict role',
        why: 'Every predict replica shares one role, and KEDA adds more replicas under load. Only the nightly retraining job writes the model, and its own role keeps every predict pod read-only.',
      },
      {
        keyword: 'Independent runbook test',
        title: 'A teammate who did not write the rebuild runbook tested it.',
        glyph: 'note',
        chose: 'A teammate from another track following the runbook alone',
        over: 'the author testing their own runbook',
        why: 'The rebuild stopped **three times**, and all three fixes now run in one `make bootstrap-all`. The tester was still on our team, and a rebuild by an outside reader remains untested.',
      },
      {
        keyword: 'Naming doc first',
        title: 'The naming document is corrected before the code.',
        glyph: 'note',
        chose: 'One **naming document** that all four repositories follow',
        over: null,
        why: 'The four repositories connect through names, and a one-character mismatch fails without an error. Our verifier checks names only, and an interval documented as two hours and coded as four went unnoticed.',
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
          note: 'The forecast floor falls to two pods at 5 a.m. This is the lowest point of the day.',
          fixed: 54.0,
          actual: 23.05,
        },
        {
          label: '06:00 – 11:59',
          note: 'The floor climbs from two pods back to about six as calls return.',
          fixed: 54.0,
          actual: 29.55,
        },
        {
          label: '12:00 – 13:59',
          note: 'The floor stays within one pod of the peak at midday.',
          fixed: 18.0,
          actual: 16.65,
        },
        {
          label: '21:00 – 23:59',
          note: 'The floor stays at the peak until the last hour of the day.',
          fixed: 27.0,
          actual: 26.5,
        },
        {
          label: '14:00 – 20:59',
          note: 'No scaling data exists for these seven hours. We filled them with the peak of nine pods.',
          fixed: 63.0,
          actual: 63.0,
        },
      ],
      total: { fixed: 216.0, actual: 158.75 },
      notes: [
        'The saving comes from the **quiet hours**. Between midnight and noon, a fleet sized for the peak runs 108 pod-hours, and the forecast needs only 52.6. Around midday, the two lines stay within one pod of each other.',
        'The 14:00–20:59 row does not change because it has no data. Those New York hours fall between 03:00 and 09:59 KST, when the nightly shutdown had the cluster off. We filled them with the **peak of nine pods** instead of guessing a lower value.',
        'The chart uses **107 hourly snapshots** saved in S3 from July 21 to July 28, averaged by New York hour. The comparison column is a fleet held at the observed peak of **nine pods** all day.',
        'Pod-hours stand in for money in this chart. The comparison fleet never ran, and no bill exists for it. The real AWS cost appears in the measured figures below.',
      ],
      caveat:
        'The chart is a simulated expected effect. The cluster ran in the AWS Seoul region, and the chart shows New York hours because the model forecast New York taxi demand. The comparison fleet was never run.',
      // The refinement's own numbers, and the only real money on this page.
      // From the OpenCost FinOps dashboard in Grafana (deck slide 69,
      // demo-04-finops-cost.png), captured 2026-08-25. $88.90 and $8.71 are the
      // AWS bill read through CUR; $70.12, $26.44 and $9.28 are the OpenCost
      // Kubernetes cost model, which the dashboard keeps separate from the bill.
      // $8.71 is the most recent day in the report, which may be a partial day.
      measured: {
        label: 'Measured: what AWS billed',
        lede: 'In the refinement, we connected the real AWS bill to OpenCost. The **Cost and Usage Report** lands in S3, a **Glue crawler** catalogs it every day at 03:00 UTC, and **Athena** queries it for OpenCost and Grafana. These figures come from a development environment that was shut down every night.',
        figures: [
          {
            value: '$88.90',
            label: 'AWS cost / 6 days',
            note: 'This was the AWS bill from August 19 to August 24.',
          },
          {
            value: '$8.71',
            label: 'AWS net cost / day',
            note: 'This was the most recent day in the report.',
          },
          {
            value: '$70.12',
            label: 'Node cost / 7 days',
            note: 'This is the cost of all nodes in the OpenCost model.',
          },
          {
            value: '$26.44',
            label: 'hailcast / 7 days',
            note: 'This is about 38% of the node cost.',
          },
          {
            value: '$9.28',
            label: 'Workers / 7 days',
            note: 'This is the one workload KEDA scales.',
          },
        ],
        source: 'The figures come from the OpenCost dashboard in Grafana, captured on August 25, 2026. Three missing permissions had to be fixed first: `s3:ListBucket` on August 18, `glue:BatchGetPartition` on August 19, and Spot price access with a wider S3 condition on August 21.',
      },
    },
    // The workspace as the four tools the team worked in, rendered by
    // WorkspaceApps.jsx beside At a Glance. Closed, each card shows one
    // figure, one action line and a quiet foot line; open, it shows names and
    // dates only, with no sentences. The team Google Doc (it carries the AWS
    // account ID and ARNs) stays unlinked, and only Notion and GitHub carry an
    // `href`. Copy rules for this section: lines start with the action or a
    // concrete tool, never "I", "my", or "The team", and no "·" separators.
    //
    // Every count was read off the source: the Notion hub and its documents,
    // the Google Doc's tab list (97 tabs, 11 integrated roundups out of 16
    // improvement tabs), the four repos' branch rules, workflows and
    // CODEOWNERS, and the notebook's 11 tabs. Body blocks are `list` (icon,
    // name, end), `lead` and `tabs`, whose panes hold the same blocks plus
    // `terminal`. `sentence` is optional; My notes has none.
    workspaceApps: {
      label: 'Team tools',
      apps: [
        {
          id: 'notion',
          logo: 'N',
          title: 'Notion',
          subtitle: 'Team hub for docs, rules, and decisions',
          href: 'https://app.notion.com/p/Pod-Pod-38e9e3e335cc80e3bfbacd1cedef9d43',
          figure: { value: '9', label: 'documents' },
          sentence: 'Keeps every plan, rule, and decision in one place.',
          foot: [{ label: 'Team lead', person: 'Junhan Shin' }],
          body: [
            { type: 'lead', icon: '👤', label: 'Team lead', person: 'Junhan Shin' },
            {
              type: 'list',
              label: 'Document hub',
              items: [
                { icon: '📂', name: 'Project plan archive' },
                { icon: '👥', name: 'WBS work guide' },
                { icon: '📘', name: 'AWS resource dictionary' },
                { icon: '🧠', name: 'Git commit convention' },
                { icon: '✒️', name: 'Interface contract' },
                { icon: '🖌️', name: 'Teardown checklist' },
                { icon: '⛓️', name: 'Naming convention' },
                { icon: '💵', name: 'Cost runbook' },
                { icon: '🔗', name: 'Repo dependencies' },
              ],
            },
            {
              type: 'list',
              label: 'Databases',
              two: true,
              items: [
                { icon: '📝', name: 'Meeting notes' },
                { icon: '📓', name: 'Dev journals' },
                { icon: '🗂️', name: 'Kanban board' },
                { icon: '📅', name: 'Daily work log' },
              ],
            },
          ],
        },
        {
          id: 'docs',
          logo: '≡',
          title: 'Google Docs',
          subtitle: 'Meeting and task log',
          meta: '97 private tabs',
          figure: { value: '97', label: 'tabs' },
          sentence: 'Logs every meeting and task.',
          foot: ['Jun 29 to Aug 27', 'Private'],
          body: [
            {
              type: 'list',
              label: 'Phases',
              items: [
                { icon: '🧭', name: 'Plan', end: 'Jun 29' },
                { icon: '🛠️', name: 'Build', end: 'Jul 6' },
                { icon: '🎤', name: 'Present', end: 'Aug 4' },
                { icon: '🔁', name: 'Refine', end: 'Aug 13' },
                { icon: '🎬', name: 'Wrap', end: 'Aug 24' },
              ],
            },
            {
              type: 'list',
              label: 'Tab types',
              two: true,
              items: [
                { icon: '🗓️', name: 'Meetings and mentoring', end: '9' },
                { icon: '📣', name: 'Notices and handoffs', end: '4' },
                { icon: '🔁', name: 'Improvement roundups', end: '11' },
                { icon: '📈', name: 'Progress shares', end: '15' },
              ],
            },
            {
              type: 'list',
              label: 'Sample tabs',
              two: true,
              items: [
                { icon: '🎥', name: 'Jul 27 demo' },
                { icon: '🧑‍🏫', name: 'Jul 29 mentoring' },
                { icon: '💥', name: 'Aug 3 destroy' },
                { icon: '📘', name: 'Rebuild runbook' },
                { icon: '🛡️', name: 'ALB inbound limit' },
                { icon: '⚙️', name: 'CPU limit decision' },
              ],
            },
          ],
        },
        {
          id: 'github',
          logo: 'TP',
          title: 'GitHub',
          subtitle: 'Four repos in the ThisPod-ThatPod org',
          href: 'https://github.com/ThisPod-ThatPod',
          figure: { value: '4', label: 'repositories' },
          sentence: 'Ships every feature through dev.',
          foot: ['infra, app, manifests, and ops'],
          body: [
            {
              type: 'list',
              label: 'Repositories',
              items: [
                { icon: '🏗️', name: 'infra' },
                { icon: '🐳', name: 'app' },
                { icon: '☸️', name: 'manifests' },
                { icon: '🧰', name: 'ops' },
              ],
            },
            {
              type: 'list',
              label: 'Automation',
              items: [
                { icon: '⚙️', name: 'terraform.yml' },
                { icon: '📦', name: 'build.yml' },
                { icon: '🔄', name: 'Argo CD' },
              ],
            },
            {
              type: 'list',
              label: 'Review routing',
              items: [
                { icon: '👀', name: 'manifests' },
                { icon: '👀', name: 'ops' },
              ],
            },
          ],
        },
        {
          id: 'notes',
          logo: 'JS',
          mine: true,
          title: 'My notes',
          subtitle: 'Junhan Shin’s lead notebook',
          meta: '11 tabs',
          figure: { value: '11', label: 'tabs' },
          foot: ['Jul 19 to Aug 20'],
          body: [
            {
              type: 'tabs',
              tabs: [
                {
                  label: '11 tabs',
                  blocks: [
                    {
                      type: 'list',
                      items: [
                        { icon: '✅', name: 'IRSA check', end: 'Jul 19' },
                        { icon: '🎓', name: 'Code-flow check', end: 'Jul 20' },
                        { icon: '📋', name: 'Repo freshness', end: 'Jul 20' },
                        { icon: '🗳️', name: 'Agenda decisions', end: 'Jul 20' },
                        { icon: '🌐', name: 'Pre-apply check', end: 'Jul 20' },
                        { icon: '🔍', name: 'Demo analysis', end: 'Jul 27' },
                        { icon: '📥', name: 'PR list export', end: 'Jul 28' },
                        { icon: '🧭', name: 'Learning roadmap', end: 'Jul 29' },
                        { icon: '🔄', name: 'Branch refresh', end: 'Aug 20' },
                        { icon: '🛠️', name: 'repo_ops.sh' },
                        { icon: '🕷️', name: 'PR crawler' },
                      ],
                    },
                  ],
                },
                {
                  label: 'Tools and rules',
                  tools: true,
                  blocks: [
                    {
                      type: 'terminal',
                      label: 'repo_ops.sh runs one command across all four repos',
                      lines: [
                        { cmd: './repo_ops.sh morning', note: 'doctor + sync + prs' },
                        { cmd: './repo_ops.sh sync   ', note: 'update all four' },
                        { cmd: './repo_ops.sh prs    ', note: 'my review queue' },
                        { cmd: './repo_ops.sh trial  ', note: 'trial merge' },
                        { cmd: './repo_ops.sh stale  ', note: 'gone-remote branches' },
                      ],
                    },
                    {
                      type: 'list',
                      label: 'Safety rules',
                      items: [
                        { icon: '🧱', name: 'Keeps the other three repos running when one fails.' },
                        { icon: '🧪', name: 'Runs destructive commands only with --force.' },
                        { icon: '🚫', name: 'Keeps trial-merge branches on the local machine.' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
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
      // One string per paragraph; ReflectionSection renders an array as
      // separate paragraphs.
      learned: [
        'hailcast was the capstone of our course and the largest build I took part in. I led a team of six people across four repositories, and the project asked us to combine Kubernetes, GitOps, machine learning, and FinOps in one system. At the start, I worried about how much of it I understood. None of us knew every part. I learned that a lead’s first job is to **keep the parts connected** while each person learns their own track.',
        'My own track was the ops repository. I wrote the scripts that set up each teammate’s environment and the scripts that tear the system down. On **July 7**, a practice teardown on EKS failed for 20 minutes on resources that nobody tracked. That failure changed how I saw the job. Every hour that a cluster stays up costs real money, and a teardown that fails quietly keeps billing in the background. From then on, I tested each script against a live run before I trusted it. I also learned to **write the stop conditions first**.',
        'Review became the other half of my work. Most of the team’s pull requests passed through me, and I read Terraform, Kubernetes manifests, and application code in the same project. At first, I reviewed each change line by line. As the pull requests grew in number, I could not stay the expert on every line in four repositories. That pressure taught me to decide where my attention mattered most. I trusted each track owner’s depth in their own area and put my own depth in **how one change would reach the other repositories**. The prediction service, for example, patched a KEDA object that the scaling track owned. A review there needed the RBAC permission and the object name to match across two repositories. A one-character mismatch in either place would leave the forecast unable to raise the floor, and nothing would report the failure. Checking those two names together became a standard step in my reviews.',
      ],
      differently: [
        'Next time, I would **share the review load** from the first week. Most changes passed through one reviewer. A second reviewer on each repository would spread the knowledge across the team. I would also pair with a teammate on the ops scripts. Two people who know the teardown would keep the team safe when one of them is busy.',
        'I would also **plan for the end of the project** from the start. The integrated fellowship project began on **August 5**, and I refined hailcast alongside it until the presentation on **August 27**. Splitting my time showed me how much the team relied on written state. With more planning, each track would name a backup owner early. The refinement goals would be set before the overlap began, and new features would be finished before it.',
      ],
    },
  },

  {
    slug: 'kt-fellowship-project',
    group: 'fellowship',
    // The product's name. The team called itself 삼성가고싶어요 in Notion and
    // "Integrated Team 3" on the deck; neither reads as a project name to a
    // visitor, and the deck's own cover leads with 미담 (Midam). The repo and
    // the Notion workspace call the same service 장인몰 (Jangin Mall), which
    // was its working name before the team renamed it.
    title: 'Midam',
    // The descriptive page heading, in the same register as the other team
    // projects' headings: what was built, for what. Chosen 2026-10-16 from
    // live samples; "AI artisan marketplace" endings were rejected.
    // "E‑Commerce" uses U+2011, the non-breaking hyphen, so a narrow
    // screen never splits the word at the hyphen.
    fullTitle: 'Secure Cloud Infrastructure and GitOps Delivery for an E‑Commerce Platform',
    // Berry, the newest accent. Steel was the placeholder while this page was
    // unnamed, and a grey read as a page that had not picked a colour.
    accent: 'berry',
    // From the day the team came together. The deck's cover gives Aug 10, the
    // start of the integrated project proper; Aug 5 to 9 was the onboarding
    // week (team formation, working rules, and a short ideathon), which is the
    // first phase of the timeline below.
    period: 'August 5 – October 6, 2026',
    // All 20 members of Integrated Team 3, from the deck's team slides (3, 9,
    // 16, 25, 31, 37, and 42), grouped by track in the deck's order. Avatars
    // renders a team whose members carry a `track` as one cluster per track
    // with the code underneath. The Aug 5 kickoff roster in Notion has 21
    // names: Juyeon Kim (PM) moved to another team after the ideathon and is
    // not listed here. The Notion retrospective lists 19 and leaves out
    // Youngwon Jeon.
    //
    // Cloud Infrastructure and Cloud Native are separate tracks in the
    // Notion workspace (eight tracks) and one CI/CN section in the deck.
    // Roles inside CI come from the infra README and CLAUDE.md: Junhan is
    // 부팀장 (vice lead) and owned network and security. `initials` is explicit
    // because Korean given names romanize as two syllables.
    team: [
      { name: 'Youngwon Jeon', initials: 'YW', track: MIDAM_TRACKS.PM },
      { name: 'Jungwoon Yoon', initials: 'JW', track: MIDAM_TRACKS.PM },
      { name: 'Jihyun Kim', initials: 'JH', track: MIDAM_TRACKS.PD },
      { name: 'Taekyung Kim', initials: 'TK', track: MIDAM_TRACKS.PD },
      { name: 'Jungmin Kim', initials: 'JM', track: MIDAM_TRACKS.AI },
      { name: 'Hoyoung Lee', initials: 'HY', track: MIDAM_TRACKS.AI },
      { name: 'Juwon Nam', initials: 'JW', track: MIDAM_TRACKS.AI },
      { name: 'Jooyoung Lee', initials: 'JY', track: MIDAM_TRACKS.FE },
      { name: 'Mingyo Kim', initials: 'MG', track: MIDAM_TRACKS.FE },
      { name: 'Junghoon Kang', initials: 'JH', track: MIDAM_TRACKS.BE },
      { name: 'Changmin Yoo', initials: 'CM', track: MIDAM_TRACKS.BE },
      { name: 'Yunju Kang', initials: 'YJ', title: 'Team Lead · Edge & Monitoring', track: MIDAM_TRACKS.CI },
      { name: 'Junhan Shin', initials: 'JS', title: 'Vice Lead · Network & Security', track: MIDAM_TRACKS.CI },
      { name: 'Dajeong Park', initials: 'DJ', title: 'Accounts, IAM & Cost', track: MIDAM_TRACKS.CI },
      { name: 'Changwon Lee', initials: 'CW', title: 'Database & Recovery', track: MIDAM_TRACKS.CI },
      { name: 'Myungsoo Park', initials: 'MS', title: 'Kubernetes & Argo CD', track: MIDAM_TRACKS.CN },
      { name: 'Youngrong Ko', initials: 'YR', track: MIDAM_TRACKS.SEC },
      { name: 'Jaeheon Kim', initials: 'JH', track: MIDAM_TRACKS.SEC },
      { name: 'Seojin Kim', initials: 'SJ', track: MIDAM_TRACKS.SEC },
      { name: 'Yunjae Lee', initials: 'YJ', track: MIDAM_TRACKS.SEC },
    ],
    // The opening block above the workspace, approved 2026-10-17 from live
    // samples. It replaces At a Glance on this page only: LinksSection renders
    // `overview` above the workspace row and drops the Glance card when both
    // exist. `glance` below is kept but no longer rendered here.
    //
    // Order is by what a hiring manager needs first: the mission and its nine
    // weeks, the product and Junhan's part in it, what the team delivered, and
    // the reporting chart last. The phases are the program guide's four
    // (Analyze, Design, Build, Integrate & Present), drawn at equal widths
    // because the guide gives no dates for the boundaries.
    overview: {
      // The row under "Midam Workspace", approved 2026-10-17 (G2 + V1). It
      // replaces the four workspace cards. Every public repository in the
      // Jangingmall organization is listed (checked against the GitHub API);
      // the security team has no public repository. infra is the one tinted:
      // it is Junhan's team's code. The deck has no public link, so its card
      // scrolls to the Resources section, where the slides tab lives.
      links: {
        org: {
          label: 'GitHub organization',
          note: 'Four public repositories',
          href: 'https://github.com/Jangingmall',
          repos: [
            { name: 'infra', href: 'https://github.com/Jangingmall/infra', mine: true },
            { name: 'backend', href: 'https://github.com/Jangingmall/backend' },
            { name: 'frontend', href: 'https://github.com/Jangingmall/frontend' },
            { name: 'GenAI', href: 'https://github.com/Jangingmall/GenAI' },
          ],
        },
        items: [
          {
            icon: 'notion',
            label: 'Notion workspace',
            note: 'Project home and notes',
            href: 'https://plain-dill-f1d.notion.site/04-3-3f7b20762b63811eb9b2c8d9dd4ec032',
          },
          {
            icon: 'security',
            label: 'Security module',
            note: 'Network and security code',
            href: 'https://github.com/Jangingmall/infra/tree/main/terraform/modules/security',
          },
          { icon: 'slides', label: 'Final deck', note: '54 slides, under Resources', section: 'source' },
        ],
      },
      program: 'KT Cloud TECH UP Enterprise Fellowship',
      mission: 'Deliver a production‑ready e‑commerce platform as one cross‑functional team.',
      timeline: {
        weeks: '9',
        start: 'Aug 5, 2026',
        end: 'Oct 6, 2026',
        phases: ['Analyze', 'Design', 'Build', 'Integrate & present'],
      },
      answer: {
        logo: '/projects/kt-fellowship-project/midam-logo-mask.png',
        caption: '미담 (Midam), “capturing beauty”',
        // The four colours from the deck's brand slide (11).
        swatches: [
          { hex: '#121B29', name: 'Nameplate navy' },
          { hex: '#D3E1E3', name: 'Celadon gray' },
          { hex: '#E84610', name: 'Seal vermilion' },
          { hex: '#FFC14C', name: 'Nameplate gold' },
        ],
        text: 'South Korea certifies its master artisans through a **national certification program**. Our team built **Midam**, a marketplace made specifically for these certified artisans to sell their work. AI writes each product page, and an AI chatbot helps shoppers find gifts.',
      },
      role: {
        // The cloud infrastructure team's six areas, from the infra README's
        // team table. `mine` marks the two Junhan owned.
        layers: [
          { name: 'Edge & Monitoring', owner: 'YJ' },
          { name: 'Network', owner: 'Junhan Shin', mine: true },
          { name: 'Security', owner: 'Junhan Shin', mine: true },
          { name: 'Accounts, IAM & Cost', owner: 'DJ' },
          { name: 'Database & Recovery', owner: 'CW' },
          { name: 'Kubernetes & Argo CD', owner: 'MS' },
        ],
        text: 'I was vice lead of the cloud infrastructure team. I owned the **network** and **security** layers. Before the design began, I met with every discipline lead to learn what the infrastructure needed to support.',
      },
      // `3` is the three demo clips (listing, gift chat, checkout). `$266` is
      // CLAUDE.md's running total on Oct 2 against the $330 AWS Budgets
      // limit. `143` is `git log --merges` on Jangingmall/infra. `10/10` is the
      // Sep 30 SSM check of the sshd settings on every node.
      delivered: [
        { value: '3', label: 'end-to-end user flows', text: 'The demo walks through listing, gift search, and checkout.' },
        { value: '$266', label: 'AWS spend', text: 'The full platform ran on AWS within the $330 budget.' },
        { value: '143', label: 'merged pull requests', text: 'The cloud team built the platform on AWS as code.' },
        { value: '10/10', label: 'servers secured', text: 'Remote login was locked down on all 10 servers.' },
      ],
      // The reporting line from the program guide: one team lead, a lead for
      // each group, and Cloud & Security split into its two teams. Cloud
      // Native sat under the cloud infrastructure lead, so MS reports there.
      chart: {
        lead: { name: 'Team Lead', sub: 'YW, Product Management' },
        groups: [
          { name: 'Planning & Design', sub: 'Product Management, Product Design' },
          { name: 'Development', sub: 'Front‑End, Back‑End' },
          { name: 'Cloud & Security', sub: 'Cloud Infrastructure, Cloud Security', open: true },
          { name: 'AI', sub: 'Generative AI' },
        ],
        teams: [
          { name: 'Cloud Infrastructure', sub: 'YJ, Lead', mine: true },
          { name: 'Cloud Security', sub: 'YR, Lead' },
        ],
        me: { name: 'Junhan Shin', sub: 'Vice Lead, Network & Security' },
        liaison: 'security liaison',
        members: [
          { name: 'DJ', sub: 'Cloud Infrastructure' },
          { name: 'CW', sub: 'Cloud Infrastructure' },
          { name: 'MS', sub: 'Cloud Native' },
        ],
      },
    },
    // Hyphenated terms use the non-breaking hyphen (‑) as on the other pages.
    glance: {
      why: 'The integrated fellowship project brought **20** fellows from eight disciplines into one team for nine weeks. Together we built Midam, a marketplace where only **nationally certified** master artisans can sell. Artisans upload photos and AI writes their product pages, and shoppers find gifts through an AI chatbot. Our cloud infrastructure team of five built and ran the AWS environment behind it. As vice lead, I owned the **network** and **security** layers and answered the cloud security team’s findings for our team.',
      // Build, Ship, Run, the same rail Lock-N-Lock uses. Every entry traces to
      // the deck's CI/CN slides (38–41) or to the infra repository.
      how: {
        rail: {
          hops: ['after each merge to main', 'on one manual Promote'],
          phases: [
            {
              key: 'Build',
              tools: 'Terraform',
              summary: 'Terraform builds two isolated VPCs, one EKS cluster, and the guardrails around both.',
              pair: [
                {
                  name: 'Private network',
                  text: 'Nodes and the database sit in private subnets behind one ALB and one NAT Gateway, with no bastion.',
                },
                {
                  name: 'EKS 1.35',
                  text: 'Six managed node groups keep system, app, database, and GPU work apart with labels and taints.',
                },
              ],
            },
            {
              key: 'Ship',
              tools: 'GitHub Actions + Argo CD',
              summary: 'Images build without long‑lived keys, and each release waits for a manual promote.',
              pair: [
                {
                  name: 'Actions + CodeBuild',
                  text: 'GitHub Actions builds the backend, and CodeBuild builds the large GPU images. Both push to ECR through OIDC.',
                },
                {
                  name: 'Argo Rollouts',
                  text: 'Each version runs as a blue/green preview first and switches only after a person promotes it.',
                },
              ],
            },
            {
              key: 'Run',
              tools: 'EKS + observability',
              summary: 'The cluster serves the store and two AI models and alerts the team when something breaks.',
              pair: [
                {
                  name: 'GPUs on request',
                  text: 'The L40S and T4 nodes start at zero and run only while the AI track needs them.',
                },
                {
                  name: 'Prometheus + Discord',
                  text: 'Prometheus, Loki, and Tempo watch the cluster, and Alertmanager posts each alert to Discord.',
                },
              ],
            },
          ],
        },
      },
      // `0` is the full-stop test in the HA report (9/30 23:48 → 10/1 09:19,
      // PV Retain, last WAL archived 14 s before the DB pod stopped). `10/10`
      // is the 9/30 SSM check of the sshd settings. `$266` is CLAUDE.md's
      // "10/2 기준 누적 약 $266" against the $330 AWS Budgets limit.
      result: {
        figures: [
          { value: '0', label: 'data lost after a full shutdown' },
          { value: '10/10', label: 'nodes passing the SSH audit' },
          { value: '$266', label: 'AWS spend against a $330 budget' },
        ],
      },
    },
    // Four cards beside At a Glance, Lock-N-Lock's layout. Copy rules for this
    // section: verb-first lines, no "I", "my", or "The team", and no "·".
    //
    // GitHub figures from `git log --merges` on Jangingmall/infra: 143 merged
    // PRs from Sep 9 to Oct 6, 24 of them from branches Junhan authored. Most
    // merges were the team lead's; Junhan merged four, including #83 and #145.
    workspaceCards: {
      github: {
        title: 'GitHub',
        subtitle: 'One infra repository, every change through a PR',
        lanes: [
          {
            branch: 'main',
            who: 'Yunju Kang, Team Lead',
            text: 'Merges most pull requests and runs the applies.',
          },
          {
            branch: 'feat/eks-*',
            who: 'Junhan Shin, Vice Lead',
            text: 'Builds the network, NAT, EKS, and node group modules.',
            mine: true,
          },
          { branch: 'category/task', who: 'Every member', text: 'Works on one task per branch and pull request.' },
        ],
        stats: [
          { value: '143', label: 'merged PRs' },
          { value: '24', label: 'authored by me' },
          { value: '19', label: 'Terraform modules' },
        ],
        foot: 'Jangingmall / infra',
        link: 'github',
        linkLabel: 'Open in GitHub',
      },
      // Counts from the team Notion workspace: four phase deliverable pages,
      // 37 dated meeting notes from 8/11 to 10/6, and the department pages.
      // Junhan published his copy of the workspace on 2026-10-16; the two
      // linked rows are the home page and the Phase 4 deliverables.
      notion: {
        title: 'Notion',
        subtitle: 'Team workspace',
        figure: { value: '4', label: 'phases' },
        rows: [
          { label: 'Project home', href: 'https://plain-dill-f1d.notion.site/04-3-3f7b20762b63811eb9b2c8d9dd4ec032' },
          { label: 'Phase 4 deliverables', href: 'https://plain-dill-f1d.notion.site/3f7b20762b63813aafdaf60d7ee0be21' },
          { label: 'Meeting notes', count: '37' },
          { label: 'Department pages', count: '7' },
          { label: 'Ideathon pages', count: '3' },
        ],
        foot: 'Team Notion.',
        link: 'notion',
        linkLabel: 'Open Notion',
      },
      // The inbound request path through the security groups, from the
      // network design doc and modules/security, and the two side doors.
      network: {
        title: 'Network',
        subtitle: 'My design',
        figure: { value: '4', label: 'groups' },
        path: [
          { name: 'Internet', edge: true },
          { name: 'sg-alb', port: ':443' },
          { name: 'sg-eks-node', port: ':8080' },
          { name: 'sg-db', port: ':5432' },
        ],
        sideDoors: [
          { key: 'SSM', text: 'Admin access, SSH closed' },
          { key: 'NAT', text: 'Outbound only' },
        ],
        foot: 'modules/security',
        href: 'https://github.com/Jangingmall/infra/tree/main/terraform/modules/security',
        linkLabel: 'View module',
      },
      // The CI/CN section of the deck: principles, network, and delivery.
      presentation: {
        title: 'Presentation',
        subtitle: '3 slides from my track',
        figure: { value: '3', label: 'of 54' },
        slides: [
          { number: 38, caption: 'Principles' },
          { number: 39, caption: 'Network' },
          { number: 41, caption: 'CI/CD' },
        ].map((slide) => ({
          ...slide,
          src: `/projects/kt-fellowship-project/slides/slide-${String(slide.number).padStart(2, '0')}.webp`,
        })),
        foot: 'Final presentation with 54 slides.',
        link: 'presentation',
        linkLabel: 'Open slides',
      },
    },
    // Six tiles on hailcast's `areas` grid. Every claim traces to a PR he
    // authored (#3–#6, #18, #19, #22, #35–#37, #48, #80, #84, #85, #146, #150)
    // or to CLAUDE.md, which he maintained. The SG egress PR (#83) is Yunju's,
    // the user-data encoding fixes (#94, #110) are Dajeong's, and the restore
    // tests are Changwon's; none of them is claimed here.
    // The `stats` bento, approved 2026-10-17 from live samples. Every figure
    // was checked against Jangingmall/infra's git history:
    //   43 files    `git log --author --diff-filter=A` (47 still exist; 43 .tf),
    //               including 14 of the 31 files in environments/prod and four
    //               modules he created (eks_nodes, eks_addons, nat, endpoints)
    //   82 images   PR #84's prod plan (5 ECR repositories, 82 images)
    //   28 groups   the security liaison triage of 184 Trivy findings
    //   3 checks    preconditions and validations in nat, eks, and the
    //               endpoint variable (PRs #19, #35, #85)
    //   7 days      PRs #3–#6, #18, #19, #22, #35–#37 merged Sep 14 to 20
    //   2 groups    both GPU node groups start at desired_size 0 (PR #36);
    //               48.5% is the team's cost analysis GPU share
    // Copy rules for this section: justified by word spacing only (no
    // hyphenation), and no tile ends on a single word.
    role: {
      title: 'Vice Lead',
      subtitle: 'Network & Security Owner',
      layout: 'stats',
      areas: [
        'B B B A A A A A A C C C',
        'D D D A A A A A A E E E',
        'F F F F F F F H H H H H',
      ],
      hero: {
        title: 'Built the network and the cluster',
        value: '43',
        unit: 'files',
        bars: [
          { name: 'environments/prod', count: 14, strong: true },
          { name: 'modules/endpoints', count: 5 },
          { name: 'modules/eks_nodes', count: 5 },
          { name: 'modules/eks_addons', count: 5 },
          { name: 'modules/nat', count: 4 },
          { name: 'modules/network', count: 3 },
          { name: 'environments/staging', count: 3 },
          { name: 'modules/security', count: 2 },
          { name: 'modules/eks', count: 2 },
        ],
        text: 'Created four modules from scratch and **14 of the 31** production files.',
      },
      tiles: [
        {
          area: 'B',
          value: '82',
          unit: 'images saved',
          text: 'A single commented line put **5 ECR repositories** on a prod deletion plan. Found it and fixed it before apply.',
        },
        {
          area: 'C',
          size: 'large',
          value: '0',
          unit: 'public nodes',
          text: 'Every node sits in a private subnet. **SSM** is the only way in, and port 22 stays closed.',
        },
        {
          area: 'D',
          size: 'large',
          value: '28',
          unit: 'fix groups',
          text: 'Sorted the security team’s 184 **Trivy** findings into 28 fix groups and proved one critical finding false.',
        },
        {
          area: 'E',
          value: '3',
          unit: 'checks',
          text: 'An empty IP allowlist, a mistyped zone, or a missing endpoint setting now stops `terraform` `plan` before apply.',
        },
        {
          area: 'F',
          value: '7',
          unit: 'days',
          timeline: [
            { date: 'Sep 14', text: 'VPC, subnets, security groups' },
            { date: 'Sep 16', text: 'NAT Gateway, EKS cluster' },
            { date: 'Sep 18', text: 'Six node groups, add‑ons' },
            { date: 'Sep 20', text: 'EBS CSI driver' },
          ],
          text: 'Stood up two isolated VPCs, the NAT Gateway, and EKS with **six node groups** from September 14 to 20.',
        },
        {
          area: 'H',
          size: 'large',
          prose: true,
          value: '2',
          unit: 'GPU groups at zero',
          text: 'Built both GPU node groups to start empty. GPUs were the largest cost, at **48.5%** of the bill.',
        },
      ],
    },
    // The `pinned` board, approved 2026-10-18 from live samples. Five pinned
    // notes: the fellowship across the top, the artisan and shopper problems
    // side by side, then the cloud team's problem and the cost, each across
    // the full width. Every note is a list of complete sentences, most of them
    // Junhan's own wording (grammar fixes only). Sources: deck slides 4–6 (TV
    // program, the Korea Craft & Design Foundation survey's 87.3%, JTBD
    // interviews, the shopper survey on certification, materials, and
    // technique), and the team's cost analysis (§6-5, $786) and AWS Budgets
    // ($330). Two cost lines (the $786 estimate and the comparison to the
    // budget) were drafted for him and approved.
    context: {
      layout: 'pinned',
      notes: [
        {
          area: 'f',
          visual: 'disciplines',
          title: 'What Did the Fellowship Ask of Us?',
          items: [
            'KT Cloud’s TECH UP Enterprise Fellowship challenged twenty fellows to act as an emerging **startup** company and deliver a profitable service.',
            'As a team, we decided to build an e‑commerce platform for certified **master artisans** of Korean crafts.',
            'With a growing interest in Korean culture, we believed the platform could appeal to domestic and international shoppers who love handmade work.',
          ],
        },
        {
          area: 'a',
          visual: 'workshopShare',
          title: 'Why Do Artisans Struggle to Sell Online?',
          items: [
            'A master artisan spends years honing a craft, but many artisans sell the work for far less than it is worth.',
            'In a national survey, **87.3%** of craft makers sold mainly at their own workshops, which were hard to find with no online presence.',
            'When we researched why artisans do not sell through online marketplaces, we discovered that many struggled with **product pages** and online marketing.',
          ],
        },
        {
          area: 's',
          visual: 'proof',
          title: 'Handmade Work Is Hard to Value',
          items: [
            'Every handmade piece is one of a kind, but shoppers rarely see the work or value behind it.',
            'Our survey found that shoppers judge quality by proof of **certification**, use of materials, and the craftsman’s technique.',
            'Existing marketplaces list handmade pieces like any other product with no place to display their legitimacy. Without it, a fair price can look too high.',
          ],
        },
        {
          area: 'e',
          tone: 'team',
          visual: 'hub',
          title: 'Balancing Design and Infrastructure',
          items: [
            'Early planning primarily focused on product design and front‑end work without considering the cost of running the platform.',
            'The back end, cloud infrastructure, and security were treated as concerns for later.',
            'However, every other department was planned to be built on one shared cloud environment. Their needs often pulled in different directions, and each one added to the cost.',
          ],
          needs: {
            intro: 'Each department needed something different from that environment:',
            tiles: [
              { label: 'AI', text: 'The AI models needed costly **GPUs**.' },
              { label: 'Back end', text: 'The back end needed a resilient database.' },
              { label: 'Security', text: 'The security team needed a live environment to scan.' },
              { label: 'Front end', text: 'The front end needed fast image delivery.' },
            ],
          },
          after: [
            'The cloud infrastructure team needed to plan ahead even if infrastructure was not yet part of the platform design.',
          ],
        },
        {
          area: 'b',
          tone: 'team',
          visual: 'budget',
          title: 'Consideration of Cost',
          items: [
            'The whole team shared one AWS budget of **$330**.',
            'GPUs were the most expensive part of the platform, and they had to fit inside that budget.',
            'Our estimate showed that running the full production environment would cost about **$786** a month, even with the GPUs off.',
            'That monthly cost was more than twice the budget for the entire project.',
          ],
        },
      ],
    },
    // Six tiles on Lock-N-Lock's `hero` grid, approved as K2 on 2026-10-19:
    // outcomes a hiring manager can read without hovering, so every tile
    // carries a visible `detail`. Sources: the HA report (full stop, 10 and 17
    // minutes), the restore report (3 min 5 s, 37 tables, PR #122), CLAUDE.md's
    // Ansible row (FAIL 28 -> 10/10 nodes PASS on 9/30) and security table
    // (184 / 28 / 147), the team cost model ($2,623 -> $522 a month), and the
    // portfolio export's [Team] staging count (10 nodes, 110 pods). 143 PRs and
    // the IRSA count were dropped: the first repeats At a Glance and the second
    // is a config count rather than an outcome.
    metricsStyle: 'hero',
    metricsEven: true,
    metrics: [
      {
        size: 'big',
        value: '0',
        label: 'Data Lost in a Full Stop',
        detail: 'We stopped all six node groups overnight and started them again. The database recovered in about 10 minutes and the backend in about 17.',
      },
      {
        size: 'square',
        value: '3m 5s',
        label: 'Isolated DB Restore',
        detail: 'A copy restored from S3 backups and WAL files matched all 37 tables by row count.',
      },
      {
        size: 'square',
        value: '28 → 0',
        label: 'Failed SSH Checks',
        detail: 'The node audit went from 28 failures to a pass on all 10 nodes.',
      },
      {
        size: 'square',
        value: '80%',
        label: 'Lower Run Cost',
        detail: 'Our operating plan cut the monthly estimate from $2,623 to $522.',
      },
      {
        size: 'wide',
        value: '184 → 28',
        label: 'Findings Into Fix Groups',
        detail: 'Trivy’s IaC findings fell into 28 groups. 147 of them targeted Kubernetes manifests.',
        // 37 is 184 minus 147; CLAUDE.md does not break it down further.
        split: [
          { label: 'Kubernetes manifests', value: 147, strong: true },
          { label: 'other', value: 37 },
        ],
      },
      {
        size: 'square',
        value: '110',
        label: 'Pods in Staging',
        detail: 'Ten nodes ran the back end, both AI models, the monitoring stack, and the detection rules.',
      },
    ],
    stack: [
      { category: 'AWS: Network & Edge', items: ['VPC', 'Route 53', 'CloudFront', 'WAF', 'ALB', 'ACM'] },
      { category: 'AWS: Compute & Data', items: ['EKS', 'EC2', 'S3', 'ECR', 'KMS', 'Parameter Store'] },
      { category: 'IaC & Delivery', items: ['Terraform', 'GitHub Actions', 'CodeBuild', 'ArgoCD', 'Argo Rollouts', 'Helm'] },
      { category: 'Kubernetes Platform', items: ['Kubernetes', 'CloudNativePG', 'Redis', 'Secrets Store CSI'] },
      {
        category: 'Observability & Security',
        items: ['Prometheus', 'Grafana', 'Loki', 'Tempo', 'Alertmanager', 'Discord', 'GuardDuty', 'SSM'],
      },
    ],
    // "We" throughout: none of these was Junhan's call alone. Terraform came
    // from the Phase 1 tool comparison, EKS and IRSA from the team design,
    // Argo Rollouts from the cloud native track (deck slide 41), GitHub OIDC
    // from the no-long-lived-keys rule (infra, backend, GenAI roles in
    // github_oidc.tf), and SSM from the network design's no-bastion rule.
    // IRSA counts the eight roles in prod irsa.tf.
    stackNotes: [
      {
        tool: 'Why Terraform?',
        icon: 'Terraform',
        text: 'We chose **Terraform** after comparing it with CloudFormation and Pulumi for portability, team experience, and Kubernetes support. Our team wrote **19** modules, and each environment calls them from one folder with one `terraform.tfvars`.',
      },
      {
        tool: 'Why EKS?',
        icon: 'EKS',
        text: 'We chose **EKS** because the AI models needed GPU nodes beside the store, and one cluster could schedule both. **Six** managed node groups keep system, app, database, and GPU work apart with labels and taints.',
      },
      {
        tool: 'Why IRSA?',
        icon: 'IAM',
        text: 'We chose **IRSA** to keep AWS keys off every node. **Eight** ServiceAccounts each assume their own role through STS, and each role reaches only the resources its workload needs.',
      },
      {
        tool: 'Why Argo Rollouts?',
        icon: 'Argo Rollouts',
        text: 'We chose **Argo Rollouts** for a blue/green release with a person in the loop. Each version runs as a preview first, and **one** manual Promote switches the traffic.',
      },
      {
        tool: 'Why GitHub OIDC?',
        icon: 'GitHub OIDC',
        text: 'We chose **GitHub OIDC** to keep long-lived AWS keys out of CI. **Three** repositories that build images each assume a short-lived role, and each role pushes only to its own ECR repositories.',
      },
      {
        tool: 'Why SSM?',
        icon: 'SSM',
        text: 'We chose **SSM Session Manager** as the only admin path. There is no bastion, port **22** stays closed, and every node carries the SSM policy in its IAM role.',
      },
    ],
    // Junhan's v4 exports, the versions he checked against the Terraform and
    // Kubernetes code. Translated in the draw.io XML (labels only; layout,
    // colours and icons untouched) and exported with draw.io's CLI. The Drive
    // copies and the deck's PNGs are older revisions.
    architecture: [
      {
        src: '/projects/kt-fellowship-project/architecture-01-network-traffic.svg',
        tab: 'Network & Traffic',
        alt: 'The Midam AWS network: users reach CloudFront and WAF for images and the ALB for the API, a production VPC in ap-northeast-2 with public, app, and reserved data subnets across AZ-a and AZ-c, one NAT Gateway, an S3 Gateway Endpoint, an EKS cluster with app, system, GPU, and database nodes in AZ-a, SSM for admin access with no bastion, a staging VPC with the same layout and no peering, and tables of the security groups and route tables',
        address: 'kt-fellowship-project/architecture/01-network-traffic',
        caption: 'Traffic from users to pods, outbound through one NAT Gateway, and the security group and route tables',
      },
      {
        src: '/projects/kt-fellowship-project/architecture-02-cluster.svg',
        tab: 'EKS Cluster',
        alt: 'The EKS cluster: two system node groups running monitoring, Argo CD, the CNPG operator, and cluster add-ons, two app nodes with the backend pods, three database nodes with a CNPG primary and two replicas, and two GPU nodes running SGLang on an L40S and Ollama on a T4, with IRSA roles, the S3 Gateway Endpoint, and the blocked paths marked',
        address: 'kt-fellowship-project/architecture/02-cluster',
        caption: 'Six node groups, the pods on each, their IRSA roles, and the paths NetworkPolicy blocks',
      },
    ],
    // Two trees behind one toggle, as on Lock-N-Lock: the files Junhan built,
    // and the whole repository as delivered (`git ls-files`, 450 files).
    folderStructure: [
      {
        id: 'mine',
        label: 'My track',
        root: 'infra/terraform/',
        address: 'kt-fellowship-project/folder-structure/my-track',
        tree: `
infra/
├── CLAUDE.md                     # the track's decision log: 34 working rules, review checklist
├── scripts/
│   ├── bootstrap-tfstate.sh      # S3 + DynamoDB state backend, KMS-encrypted
│   └── ha_failover_drill.py      # terminates a node or the DB primary and times recovery
└── terraform/
    ├── environments/prod/        # calls each module; one terraform.tfvars per environment
    │   ├── vpc.tf · security.tf · endpoints.tf · nat.tf
    │   └── eks.tf · nodegroups.tf · addons.tf
    └── modules/
        ├── network/              # VPC, six subnets in three tiers, IGW, route tables
        ├── security/             # four security groups, referenced by group, never by CIDR
        ├── endpoints/            # S3 Gateway Endpoint on the app and data route tables
        ├── nat/                  # NAT Gateway, fixed EIP, two CloudWatch alarms
        ├── eks/                  # cluster, OIDC provider, endpoint allowlist precondition
        ├── eks_nodes/            # six node groups, node role, DB and size preconditions
        │   ├── templates/node_user_data.mime   # boot-time SSH hardening
        │   └── tests/operations.tftest.hcl
        └── eks_addons/           # VPC CNI with NetworkPolicy, CoreDNS, kube-proxy, EBS CSI
`,
      },
      {
        id: 'all',
        label: 'Whole repository',
        root: 'infra/',
        address: 'kt-fellowship-project/folder-structure/whole-repository',
        tree: `
infra/
├── .claude/
│   └── settings.json
├── .github/
│   ├── workflows/
│   │   ├── ai-image-mirror.yml
│   │   └── k8s-validate.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── argocd/
│   ├── applications/
│   │   ├── prod/
│   │   │   ├── backup-project.yaml
│   │   │   ├── backup.yaml
│   │   │   ├── cluster-addons.yaml
│   │   │   ├── kustomization.yaml
│   │   │   ├── networking.yaml
│   │   │   ├── observability-project.yaml
│   │   │   ├── observability.yaml
│   │   │   ├── platform.yaml
│   │   │   ├── projects.yaml
│   │   │   ├── tempo.yaml
│   │   │   └── workloads.yaml
│   │   └── stage/
│   │       ├── backup-project.yaml
│   │       ├── backup.yaml
│   │       ├── cluster-addons.yaml
│   │       ├── kustomization.yaml
│   │       ├── networking.yaml
│   │       ├── observability-project.yaml
│   │       ├── observability.yaml
│   │       ├── platform.yaml
│   │       ├── projects.yaml
│   │       ├── tempo.yaml
│   │       └── workloads.yaml
│   ├── components/
│   │   └── observability-discord/
│   │       ├── prod/
│   │       │   └── kustomization.yaml
│   │       └── stage/
│   │           └── kustomization.yaml
│   └── README.md
├── ci-cd/
│   ├── build-deploy.yml
│   └── promote.yml
├── config/
│   ├── db-backup.prod.json.example
│   └── db-backup.staging.json.example
├── k8s/
│   ├── base/
│   │   ├── ai/
│   │   │   ├── vector-db/
│   │   │   │   ├── 00-load-password.sh
│   │   │   │   ├── init.sql
│   │   │   │   ├── kustomization.yaml
│   │   │   │   ├── networkpolicy.yaml
│   │   │   │   ├── service.yaml
│   │   │   │   ├── statefulset.yaml
│   │   │   │   └── storageclass.yaml
│   │   │   ├── deployment.yaml
│   │   │   ├── kustomization.yaml
│   │   │   ├── ollama-deployment.yaml
│   │   │   ├── ollama-service.yaml
│   │   │   ├── service.yaml
│   │   │   └── serviceaccount.yaml
│   │   ├── backend/
│   │   │   ├── hpa.yaml
│   │   │   ├── kustomization.yaml
│   │   │   ├── README.md
│   │   │   ├── rollout.yaml
│   │   │   ├── service-active.yaml
│   │   │   ├── service-preview.yaml
│   │   │   └── serviceaccount.yaml
│   │   ├── database/
│   │   │   ├── cluster.yaml
│   │   │   ├── kustomization.yaml
│   │   │   └── serviceaccount.yaml
│   │   ├── namespaces/
│   │   │   ├── kustomization.yaml
│   │   │   └── namespaces.yaml
│   │   ├── network-policies/
│   │   │   ├── ai/
│   │   │   │   ├── ingress/
│   │   │   │   │   ├── allow-backend-ingress.yaml
│   │   │   │   │   ├── default-deny-ingress.yaml
│   │   │   │   │   └── kustomization.yaml
│   │   │   │   ├── allow-ai-dns-egress.yaml
│   │   │   │   ├── allow-ai-traces-egress.yaml
│   │   │   │   ├── allow-sglang-callback-egress.yaml
│   │   │   │   ├── allow-vector-db-egress.yaml
│   │   │   │   ├── default-deny.yaml
│   │   │   │   └── kustomization.yaml
│   │   │   ├── backend/
│   │   │   │   ├── allow-backend-internal-egress.yaml
│   │   │   │   ├── default-deny.yaml
│   │   │   │   └── kustomization.yaml
│   │   │   └── database/
│   │   │       ├── egress/
│   │   │       │   ├── allow-cnpg-internal-egress.yaml
│   │   │       │   ├── default-deny-egress.yaml
│   │   │       │   └── kustomization.yaml
│   │   │       ├── allow-cnpg-ingress.yaml
│   │   │       ├── default-deny-ingress.yaml
│   │   │       └── kustomization.yaml
│   │   ├── redis/
│   │   │   ├── health.sh
│   │   │   ├── kustomization.yaml
│   │   │   ├── README.md
│   │   │   ├── redis.conf
│   │   │   ├── resources.yaml
│   │   │   └── start.sh
│   │   ├── storage/
│   │   │   ├── gp3-cnpg-storageclass.yaml
│   │   │   └── kustomization.yaml
│   │   └── kustomization.yaml
│   ├── components/
│   │   ├── ai-model-storage/
│   │   │   ├── deployment-patch.yaml
│   │   │   ├── kustomization.yaml
│   │   │   ├── prepare-models.sh
│   │   │   ├── README.md
│   │   │   └── storage.yaml
│   │   ├── ai-sglang-secrets/
│   │   │   ├── deployment-patch.yaml
│   │   │   ├── kustomization.yaml
│   │   │   └── start.sh
│   │   ├── ai-vector-db-secrets/
│   │   │   ├── ai-deployment-patch.yaml
│   │   │   ├── kustomization.yaml
│   │   │   ├── README.md
│   │   │   ├── serviceaccount.yaml
│   │   │   └── statefulset-patch.yaml
│   │   ├── backend-configtree/
│   │   │   ├── kustomization.yaml
│   │   │   ├── README.md
│   │   │   └── rollout-patch.yaml
│   │   ├── cnpg-backup/
│   │   │   └── kustomization.yaml
│   │   └── gitops-protection/
│   │       └── kustomization.yaml
│   ├── overlays/
│   │   ├── prod/
│   │   │   ├── ai-chatbot-secret-provider.yaml
│   │   │   ├── ai-sglang-secret-provider.yaml
│   │   │   ├── ai-vector-db-secret-provider.yaml
│   │   │   ├── backend-secret-provider.yaml
│   │   │   ├── kustomization.yaml
│   │   │   └── redis-secret-provider.yaml
│   │   └── stage/
│   │       ├── ai-chatbot-secret-provider.yaml
│   │       ├── ai-sglang-secret-provider.yaml
│   │       ├── ai-vector-db-secret-provider.yaml
│   │       ├── backend-secret-provider.yaml
│   │       ├── kustomization.yaml
│   │       └── redis-secret-provider.yaml
│   └── README.md
├── platform/
│   ├── argo-rollouts/
│   │   ├── README.md
│   │   └── values.yaml
│   ├── argocd/
│   │   ├── README.md
│   │   └── values.yaml
│   ├── aws-load-balancer-controller/
│   │   ├── runtime/
│   │   │   ├── prod.yaml
│   │   │   └── stage.yaml
│   │   └── values.yaml
│   ├── cloudnative-pg/
│   │   ├── README.md
│   │   └── values.yaml
│   ├── cnpg-backup/
│   │   ├── templates/
│   │   │   ├── backup.yaml
│   │   │   ├── objectstore-rbac.yaml
│   │   │   └── plugin-networkpolicy.yaml
│   │   ├── backup-on-demand.yaml
│   │   ├── cert-manager-values.yaml
│   │   ├── Chart.yaml
│   │   ├── plugin-values.yaml
│   │   ├── prod.yaml
│   │   ├── README.md
│   │   ├── stage.yaml
│   │   └── values.yaml
│   ├── cnpg-restore/
│   │   ├── templates/
│   │   │   └── restore.yaml
│   │   ├── Chart.yaml
│   │   └── values.yaml
│   ├── ebs-snapshot-restore-test/
│   │   ├── config.example.json
│   │   └── README.md
│   ├── metrics-server/
│   │   └── values.yaml
│   ├── networking/
│   │   ├── templates/
│   │   │   └── backend.yaml
│   │   ├── Chart.yaml
│   │   ├── prod.yaml
│   │   ├── README.md
│   │   ├── stage.yaml
│   │   └── values.yaml
│   ├── nvidia-device-plugin/
│   │   └── values.yaml
│   ├── observability/
│   │   ├── ai-metrics/
│   │   │   ├── kustomization.yaml
│   │   │   ├── network-policy.yaml
│   │   │   └── podmonitor.yaml
│   │   ├── alerts/
│   │   │   ├── backup-stage/
│   │   │   │   ├── kustomization.yaml
│   │   │   │   └── prometheus-rules.yaml
│   │   │   ├── discord/
│   │   │   │   ├── prod/
│   │   │   │   │   ├── kustomization.yaml
│   │   │   │   │   ├── secret-provider.yaml
│   │   │   │   │   └── values.yaml
│   │   │   │   ├── stage/
│   │   │   │   │   ├── kustomization.yaml
│   │   │   │   │   ├── secret-provider.yaml
│   │   │   │   │   └── values.yaml
│   │   │   │   └── values.yaml
│   │   │   ├── rules/
│   │   │   │   ├── kustomization.yaml
│   │   │   │   └── prometheus-rules.yaml
│   │   │   ├── tests/
│   │   │   │   └── rules.test.yaml
│   │   │   └── README.md
│   │   ├── backend/
│   │   │   ├── dashboard.json
│   │   │   ├── kustomization.yaml
│   │   │   ├── network-policy.yaml
│   │   │   ├── podmonitor.yaml
│   │   │   └── README.md
│   │   ├── collectors/
│   │   │   ├── kustomization.yaml
│   │   │   ├── log-buffer.alloy
│   │   │   ├── trace-buffer.yaml
│   │   │   ├── trace-deployment.yaml
│   │   │   ├── trace-monitor.yaml
│   │   │   └── trace-network-policy.yaml
│   │   ├── gpu/
│   │   │   ├── policies/
│   │   │   │   ├── kustomization.yaml
│   │   │   │   └── network-policy.yaml
│   │   │   ├── dashboard.json
│   │   │   ├── README.md
│   │   │   └── values.yaml
│   │   ├── logs/
│   │   │   ├── policies/
│   │   │   │   ├── ingress.yaml
│   │   │   │   ├── kustomization.yaml
│   │   │   │   └── monitors.yaml
│   │   │   ├── alloy-events.yaml
│   │   │   ├── alloy-pods.yaml
│   │   │   ├── events.alloy
│   │   │   ├── loki.yaml
│   │   │   ├── pods.alloy
│   │   │   ├── prod.yaml
│   │   │   ├── README.md
│   │   │   └── stage.yaml
│   │   ├── metrics/
│   │   │   ├── kustomization.yaml
│   │   │   ├── prod.yaml
│   │   │   ├── README.md
│   │   │   ├── stage.yaml
│   │   │   ├── storage-class.yaml
│   │   │   └── values.yaml
│   │   ├── platform/
│   │   │   ├── argo-dashboard.json
│   │   │   ├── cnpg-dashboard.json
│   │   │   ├── kustomization.yaml
│   │   │   ├── monitors.yaml
│   │   │   ├── network-policies.yaml
│   │   │   └── README.md
│   │   ├── runtime/
│   │   │   ├── prod.yaml
│   │   │   └── stage.yaml
│   │   ├── sizing/
│   │   │   ├── alloy.yaml
│   │   │   ├── charts.yaml
│   │   │   ├── controller-requests.yaml
│   │   │   ├── loki.yaml
│   │   │   ├── otel.yaml
│   │   │   ├── prometheus.yaml
│   │   │   ├── README.md
│   │   │   ├── rendered-containers.csv
│   │   │   └── tempo.yaml
│   │   ├── targets/
│   │   │   ├── stage/
│   │   │   │   └── kustomization.yaml
│   │   │   └── kustomization.yaml
│   │   ├── templates/
│   │   │   ├── assets.yaml
│   │   │   └── tempo.yaml
│   │   ├── tempo/
│   │   │   ├── runtime/
│   │   │   │   ├── prod.yaml
│   │   │   │   └── stage.yaml
│   │   │   ├── prod.yaml
│   │   │   ├── README.md
│   │   │   ├── stage.yaml
│   │   │   └── values.yaml
│   │   ├── traces/
│   │   │   ├── application-egress/
│   │   │   │   ├── kustomization.yaml
│   │   │   │   └── network-policy.yaml
│   │   │   ├── prod/
│   │   │   │   └── kustomization.yaml
│   │   │   ├── stage/
│   │   │   │   └── kustomization.yaml
│   │   │   └── README.md
│   │   ├── capacity.md
│   │   ├── Chart.yaml
│   │   ├── README.md
│   │   └── values.yaml
│   ├── secrets-store-csi/
│   │   └── values.yaml
│   ├── cluster-addons.md
│   └── README.md
├── scripts/
│   ├── tests/
│   │   ├── test_backup_plan.py
│   │   └── test_node_user_data.py
│   ├── bootstrap-github-oidc.sh
│   ├── bootstrap-tfstate.sh
│   ├── check_backup_plan.py
│   ├── check_node_user_data.py
│   ├── ebs_snapshot_restore_test.py
│   ├── ha_failover_drill.py
│   ├── mirror-ai-image.sh
│   ├── render-logs.sh
│   ├── render-observability.rb
│   ├── Test-Ecr.ps1
│   ├── validate-ai-observability.rb
│   ├── validate-ai-observability.sh
│   ├── validate-ai-runtime.rb
│   ├── validate-alerting.rb
│   ├── validate-alerting.sh
│   ├── validate-cluster-addons.rb
│   ├── validate-data-services.rb
│   ├── validate-detection.sh
│   ├── validate-gitops.rb
│   ├── validate-k8s.sh
│   ├── validate-logs.rb
│   ├── validate-networking.rb
│   ├── validate-observability-gitops.sh
│   ├── validate-observability.rb
│   ├── validate-observability.sh
│   ├── validate-platform-monitoring.rb
│   ├── validate-tempo.rb
│   ├── validate-workload-secrets.rb
│   └── verify-redis.sh
├── terraform/
│   ├── environments/
│   │   ├── dev/
│   │   │   └── README.md
│   │   ├── prod/
│   │   │   ├── policies/
│   │   │   │   └── alb-controller-policy.json
│   │   │   ├── tests/
│   │   │   │   └── edge.tftest.hcl
│   │   │   ├── .terraform.lock.hcl
│   │   │   ├── account_security.tf
│   │   │   ├── addons.tf
│   │   │   ├── backend.tf
│   │   │   ├── codebuild_runner.tf
│   │   │   ├── ecr.tf
│   │   │   ├── edge.tf
│   │   │   ├── eks.tf
│   │   │   ├── eks_access.tf
│   │   │   ├── endpoints.tf
│   │   │   ├── github_oidc.tf
│   │   │   ├── irsa.tf
│   │   │   ├── kms.tf
│   │   │   ├── locals.tf
│   │   │   ├── nat.tf
│   │   │   ├── nodegroups.tf
│   │   │   ├── outputs.tf
│   │   │   ├── providers.tf
│   │   │   ├── README.md
│   │   │   ├── s3_access.tf
│   │   │   ├── s3_backup.tf
│   │   │   ├── s3_cf_logs.tf
│   │   │   ├── s3_images.tf
│   │   │   ├── s3_logs.tf
│   │   │   ├── s3_models.tf
│   │   │   ├── s3_returns.tf
│   │   │   ├── s3_waf_logs.tf
│   │   │   ├── security.tf
│   │   │   ├── ssm.tf
│   │   │   ├── terraform.tfvars.example
│   │   │   ├── threat_detection.tf
│   │   │   ├── variables.tf
│   │   │   ├── versions.tf
│   │   │   └── vpc.tf
│   │   └── staging/
│   │       ├── detection/
│   │       │   ├── patterns/
│   │       │   │   ├── cloudtrail-tampering.json
│   │       │   │   ├── eks-cluster-destructive.json
│   │       │   │   ├── iam-user-and-key.json
│   │       │   │   ├── root-activity.json
│   │       │   │   └── threat-detection-disable.json
│   │       │   └── tests/
│   │       │       ├── cloudtrail-tampering.match.json
│   │       │       ├── cloudtrail-tampering.nomatch.json
│   │       │       ├── eks-cluster-destructive.match.json
│   │       │       ├── eks-cluster-destructive.nomatch.json
│   │       │       ├── iam-user-and-key.match.json
│   │       │       ├── iam-user-and-key.nomatch.json
│   │       │       ├── root-activity.match-apne2.json
│   │       │       ├── root-activity.match.json
│   │       │       ├── root-activity.nomatch.json
│   │       │       ├── threat-detection-disable.match.json
│   │       │       └── threat-detection-disable.nomatch.json
│   │       ├── policies/
│   │       │   └── alb-controller-policy.json
│   │       ├── tests/
│   │       │   └── edge.tftest.hcl
│   │       ├── .terraform.lock.hcl
│   │       ├── addons.tf
│   │       ├── backend.tf
│   │       ├── cnpg_restore.tf
│   │       ├── detection.tf
│   │       ├── ecr.tf
│   │       ├── edge.tf
│   │       ├── eks.tf
│   │       ├── eks_access.tf
│   │       ├── endpoints.tf
│   │       ├── github_oidc.tf
│   │       ├── irsa.tf
│   │       ├── kms.tf
│   │       ├── locals.tf
│   │       ├── nat.tf
│   │       ├── nodegroups.tf
│   │       ├── outputs.tf
│   │       ├── providers.tf
│   │       ├── README.md
│   │       ├── s3_access.tf
│   │       ├── s3_backup.tf
│   │       ├── s3_cf_logs.tf
│   │       ├── s3_images.tf
│   │       ├── s3_logs.tf
│   │       ├── s3_models.tf
│   │       ├── s3_returns.tf
│   │       ├── s3_waf_logs.tf
│   │       ├── security.tf
│   │       ├── ssm.tf
│   │       ├── terraform.tfvars.example
│   │       ├── variables.tf
│   │       ├── versions.tf
│   │       └── vpc.tf
│   ├── modules/
│   │   ├── acm_alb/
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── acm_cloudfront/
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   └── variables.tf
│   │   ├── alb/
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── cloudfront/
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── codebuild/
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── detection/
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── ecr/
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── eks/
│   │   │   ├── locals.tf
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── eks_addons/
│   │   │   ├── locals.tf
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── eks_nodes/
│   │   │   ├── templates/
│   │   │   │   └── node_user_data.mime
│   │   │   ├── tests/
│   │   │   │   └── operations.tftest.hcl
│   │   │   ├── .terraform.lock.hcl
│   │   │   ├── locals.tf
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── endpoints/
│   │   │   ├── locals.tf
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── github_oidc/
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── irsa/
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── kms/
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── nat/
│   │   │   ├── locals.tf
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── network/
│   │   │   ├── locals.tf
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── s3/
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   ├── security/
│   │   │   ├── locals.tf
│   │   │   ├── main.tf
│   │   │   ├── outputs.tf
│   │   │   ├── variables.tf
│   │   │   └── versions.tf
│   │   └── waf/
│   │       ├── main.tf
│   │       ├── outputs.tf
│   │       ├── variables.tf
│   │       └── versions.tf
│   └── workload-secrets.md
├── tests/
│   └── ecr/
│       ├── .terraform.lock.hcl
│       ├── environment.tftest.hcl
│       ├── inputs.tftest.hcl
│       └── versions.tf
├── .gitignore
├── CLAUDE.md
├── CONVENTION.md
└── README.md
`,
      },
    ],
    // Phase one is the onboarding week (Aug 5 to 9), worded with Junhan on
    // 2026-10-16: "fellows", "disciplines", and "PM team" in place of
    // trainee and track vocabulary. The rest follow the course's four
    // deliverable deadlines in the Notion ground rules (8/21, 9/4, 9/18,
    // 10/1), then submission and the final presentation. Team flow in "we", with two lines about Junhan,
    // and each phase from Discovery to Integration opens with one sourced line
    // about another discipline (deck), approved as I2 on 2026-10-19. The
    // highlight rule: every technology named, plus the presentation date.
    implementation: {
      months: ['2026-08', '2026-09', '2026-10'],
      span: { from: '2026-08-05', to: '2026-10-06' },
      phases: [
        {
          id: 'onboard',
          title: 'Onboarding & Requirements',
          range: 'Aug 5 – Aug 9',
          from: '2026-08-05',
          to: '2026-08-09',
          text: 'The program assigned 20 fellows from eight disciplines to form one integrated team. The PM team led the project and managed how the team worked. Together, we agreed to track every task in a shared WBS and to meet at a daily stand‑up. We logged blockers in one issue list and tested these rules during a short ideathon. During this period, I took the initiative to meet with the lead of each discipline to hear how they planned to use the budget allocated to our project. Those conversations became the first inputs to our infrastructure design.',
        },
        {
          id: 'discover',
          title: 'Discovery & Planning',
          range: 'Aug 10 – Aug 21',
          from: '2026-08-10',
          to: '2026-08-21',
          text: 'The PM and design teams interviewed three master artisans and compared their answers with a national craft survey. We defined Midam’s two AI features and compared cloud designs for cost, availability, and recovery. Our team chose **Terraform** on **AWS** after weighing it against CloudFormation and Pulumi.',
        },
        {
          id: 'design',
          title: 'Design & Interfaces',
          range: 'Aug 22 – Sep 4',
          from: '2026-08-22',
          to: '2026-09-04',
          text: 'The back‑end team documented its API in **OpenAPI**, and the front‑end team built screens against mock API contracts. We designed two isolated VPCs with a three‑tier subnet layout and an **IRSA** role for each workload. We wrote one interface spec to keep the ports, health checks, and secret paths the same across every discipline.',
        },
        {
          id: 'build',
          title: 'Infrastructure as Code',
          range: 'Sep 5 – Sep 18',
          from: '2026-09-05',
          to: '2026-09-18',
          text: 'The AI team compared nine models and selected **gemma4:12b** for the chatbot. We wrote the infrastructure as **Terraform** modules and held every paid resource at `plan` until one shared apply on September 18. I built the network, the **NAT Gateway**, the **EKS** cluster, and its six node groups. My preconditions stop an unsafe plan before it reaches AWS.',
        },
        {
          id: 'integrate',
          title: 'Integration & Security',
          range: 'Sep 19 – Oct 1',
          from: '2026-09-19',
          to: '2026-10-01',
          text: 'The security team scanned our infrastructure on September 23 and the application on September 30. The staging cluster went live on September 21. The back end, both AI models, **CloudNativePG**, and the monitoring stack deployed through **Argo CD** within two days. We answered the security team’s scans and tested the backups with isolated restores. I traced a prod plan that would have deleted all five shared **ECR** repositories and fixed it before apply.',
        },
        {
          id: 'deliver',
          title: 'Delivery & Teardown',
          range: 'Oct 2 – Oct 6',
          from: '2026-10-02',
          to: '2026-10-06',
          text: 'We submitted our deliverables on October 2 and scaled every node to zero to stop the spending. We presented Midam on **October 6** and destroyed the environment the same day.',
        },
      ],
    },
    // Junhan's files, in the order the page argues them: the NAT that every
    // outbound call leaves through, the cluster and its endpoint guard, the
    // node groups and their preconditions, the add-on that makes NetworkPolicy
    // real, and the drill that would have timed a failover. Comments and
    // human-readable messages are translated; every identifier, flag, value,
    // and line of logic is byte-for-byte what the repository holds. The drill's
    // timing labels are dictionary keys and were translated identically at
    // every use. `eks_nodes/main.tf` also carries Dajeong's user-data notes
    // and Changwon's tag change.
    terraform: [
      // `note` is the line under each sub-tab: four of the five are main.tf.
      { path: 'terraform/modules/nat/main.tf', note: 'NAT Gateway', content: ktNatTf },
      { path: 'terraform/modules/eks/main.tf', note: 'EKS cluster', content: ktEksTf },
      { path: 'terraform/modules/eks_nodes/main.tf', note: 'Node groups', content: ktEksNodesTf },
      { path: 'terraform/modules/eks_addons/main.tf', note: 'EKS add-ons', content: ktEksAddonsTf },
      { path: 'scripts/ha_failover_drill.py', note: 'Failover drill', content: ktHaDrill },
    ],
    recoveryPolicy: null,
    // Cut from the team's demo recording (1930x1080, 4 min 44 s). The app is
    // the work of the AI, FE, and BE tracks; this section shows what the
    // infrastructure served. Clips: 0:00–2:00 at 8x, 2:00–2:52 at 4x, and
    // 2:52–4:44 at 8x. Stills are full-resolution frames from the same video.
    media: {
      clipNote: "Cut from the team's demo recording of the staging service. It has no sound and plays on a loop.",
      stillsNote: 'These frames come from the same recording. Click one to open it at full size.',
      scenarios: [
        {
          id: 'ai-studio',
          tab: 'AI product page',
          label: 'Demo 1: An artisan builds a product page with AI',
          lead: 'An artisan enters a product name, the making process, and photos. **Qwen3.8 27B** drafts the page, **FLUX.2** adds staged shots, and the artisan edits each section before publishing.',
          clip: {
            src: '/projects/kt-fellowship-project/clip-01-ai-studio.mp4',
            width: 1280,
            height: 716,
            poster: '/projects/kt-fellowship-project/clip-01-ai-studio.jpg',
            speed: '8x',
            alt: 'The seller studio: product details and photos entered, an AI-generated detail page with eight sections, the sections edited and reordered, and the shopper view previewed on desktop and mobile',
          },
          shots: [
            {
              src: '/projects/kt-fellowship-project/demo-01-studio-sections.jpg',
              state: 'AI sections ready to edit',
              alt: 'The seller studio with a list of eight AI-generated sections on the left and the first section open in an inline text editor',
            },
            {
              src: '/projects/kt-fellowship-project/demo-01-studio-preview.jpg',
              state: 'Shopper view before publishing',
              alt: 'The desktop preview of the generated page for a celadon teacup, with staged product photos beside the price and the buy buttons',
            },
          ],
        },
        {
          id: 'chatbot',
          tab: 'AI chatbot',
          label: 'Demo 2: A shopper asks the chatbot for a gift',
          lead: 'A shopper types a short request, and the chatbot on **Ollama** reads the intent and the budget. It answers with up to three picks and a reason for each.',
          clip: {
            src: '/projects/kt-fellowship-project/clip-02-chatbot.mp4',
            width: 1280,
            height: 716,
            poster: '/projects/kt-fellowship-project/clip-02-chatbot.jpg',
            speed: '4x',
            alt: 'The Midam home page, the chatbot panel opening with suggested questions, a gift request typed in, and three product picks returned with reasons',
          },
          shots: [
            {
              src: '/projects/kt-fellowship-project/demo-02-chatbot-picks.jpg',
              state: 'Picks with reasons',
              alt: 'The chatbot panel beside the home page, explaining its recommendation above three product cards with prices',
            },
            {
              src: '/projects/kt-fellowship-project/demo-02-product-story.jpg',
              state: 'The product page',
              alt: 'A product page showing the product information, the making process, and the care guide, with option selectors and the buy button on the right',
            },
          ],
        },
        {
          id: 'checkout',
          tab: 'Checkout',
          label: 'Demo 3: From the product page to a finished order',
          lead: 'The shopper picks options, fills in the checkout, and pays through **Toss Payments** in a demo mode that creates no real charge. The last page confirms the order number.',
          clip: {
            src: '/projects/kt-fellowship-project/clip-03-checkout.mp4',
            width: 1280,
            height: 716,
            poster: '/projects/kt-fellowship-project/clip-03-checkout.jpg',
            speed: '8x',
            alt: 'A product page with options chosen, the checkout form with delivery details, points, and coupons, the Toss Pay window, and the order confirmation page',
          },
          shots: [
            {
              src: '/projects/kt-fellowship-project/demo-03-checkout-form.jpg',
              state: 'Checkout with points and coupons',
              alt: 'The checkout page showing the ordered item, discount code, points, and coupon fields above the payment methods',
            },
            {
              src: '/projects/kt-fellowship-project/demo-03-order-complete.jpg',
              state: 'Order confirmed',
              alt: 'The order complete page with the order number and buttons to view the order or keep browsing',
            },
          ],
        },
      ],
      video: null,
    },
    // `I` only where the call was Junhan's (preconditions, the endpoint
    // review, root EBS for the GPUs, explicit variables). The rest were team
    // decisions recorded in CLAUDE.md and the deck's principles slide.
    decisions: [
      {
        keyword: 'Single NAT Gateway',
        title: 'Outbound internet traffic from the app subnets leaves through one NAT Gateway in AZ-a.',
        glyph: 'route',
        chose: 'One **NAT Gateway** with a fixed EIP',
        over: 'a NAT Gateway in each AZ',
        why: 'A second NAT Gateway would add about **$43** a month to a $330 budget. We placed the nodes in the same AZ to avoid cross-AZ charges and accepted that outbound traffic stops if AZ-a fails. The EIP stays fixed because the courier API allowlists it.',
      },
      {
        keyword: 'No bastion host',
        title: 'Admins reach the nodes only through SSM, and port 22 stays closed.',
        glyph: 'channels',
        chose: '**SSM Session Manager** only',
        over: 'a bastion host with SSH',
        why: 'A bastion is one more server to patch and one more door to watch. Every node carries the SSM policy in its IAM role. With every node at zero, the cluster API stays reachable through an IP allowlist.',
      },
      {
        keyword: 'Plan-time preconditions',
        title: 'The node and endpoint rules fail `terraform plan` before a bad value reaches AWS.',
        glyph: 'process',
        chose: '`precondition` blocks in the modules',
        over: 'rules written as comments',
        why: 'A comment protects a rule only for the person who reads it. I moved the database rules (three nodes, On-Demand only) and the endpoint allowlist into **preconditions**. Lowering the database node count to save money now stops at `plan`.',
      },
      {
        keyword: 'Public endpoint, IP-limited',
        title: 'The EKS API stays public during the build and accepts only teammates’ IP addresses.',
        glyph: 'channels',
        chose: 'A public endpoint limited to **team IPs**',
        over: 'a private-only endpoint',
        why: 'With no bastion and no VPN, a private-only endpoint would block the first Helm installs and every kubectl session once the nodes went to zero. I raised this with the team lead, and we kept the allowlist and recorded it as a time-limited exception for the security team.',
      },
      {
        keyword: 'Root EBS for GPUs',
        title: 'The GPU nodes keep model files on a larger root EBS volume.',
        glyph: 'depth',
        chose: 'A **200 GB** and **120 GB** root EBS volume',
        over: 'the instances’ local NVMe disks',
        why: 'Using local NVMe needed custom boot scripts that only a running cluster could test. The cluster did not exist yet. I chose root EBS for about **$6** more, and the decision stayed reversible once the build was stable.',
      },
      {
        keyword: 'No ECR endpoint',
        title: 'Image pulls go through the NAT Gateway, and S3 traffic uses the free Gateway Endpoint.',
        glyph: 'route',
        chose: 'NAT for ECR and an **S3 Gateway Endpoint**',
        over: 'ECR interface endpoints',
        why: 'The interface endpoints would cost about **$10.28** for the project, and pulling the same images through the NAT would cost about **$2.95**. Model weights, backups, and logs travel through the free S3 Gateway Endpoint instead of the NAT.',
      },
      {
        keyword: 'GPUs start at zero',
        title: 'Both GPU node groups start with zero nodes and scale up only when the AI team asks.',
        glyph: 'pipeline',
        chose: '`desired_size = 0` for both GPU groups',
        over: 'GPU nodes running all day',
        why: 'The two GPUs cost about **$70** a day together and took 48.5% of the measured bill. Starting them at zero kept the AI features testable while the rest of the cluster stayed within budget.',
      },
      {
        keyword: 'Explicit risky variables',
        title: 'Variables that are hard to undo have no default and must be set on purpose.',
        glyph: 'note',
        chose: 'No default plus a `validation` check',
        over: 'defaults that apply silently',
        why: 'A commented line in an example file once set a value to its default and planned the deletion of all five shared ECR repositories. I removed the defaults from variables like the endpoint setting in **PR #85**. A missing value now stops `plan` with a clear message.',
      },
    ],
    // The detailed cost report (`layout: 'report'`), approved 2026-10-19.
    // Every figure is real. Sources: Dajeong's cost analysis (Notion, written
    // from Cost Explorer on 10/1: daily, per-service, and per-instance cost,
    // the unit-price check, the savings levers, and the production forecast),
    // CLAUDE.md (budget, $7 a day with zero nodes, the 10/1 GPU restart and
    // rule 33, the lost credits, Spot kept off for the demo), and Junhan's
    // portfolio export for "My Part" (three pricing errors, the teardown
    // checklist's seven reasons). Levers are marked saved or not saved only
    // where a source says so; two unsourced levers (CodeBuild frequency, EBS
    // and ECR cleanup) were left out on purpose.
    cost: {
      layout: 'report',
      headline: [
        {
          value: '$266',
          suffix: 'of $330',
          label: 'Spent Sep 7 – Oct 1',
          bar: [{ share: 266, tone: 'accent' }, { share: 64, tone: 'track' }],
          keys: ['**81%** used', '$64 left'],
        },
        {
          value: '48.5%',
          label: 'GPU share of the bill',
          note: 'Two GPUs cost 4.2 times all eight other nodes.',
          bar: [{ share: 48.5, tone: 'accent' }, { share: 51.5, tone: 'muted' }],
          keys: ['**GPUs**', 'Other nodes and services'],
        },
        {
          value: '1.6%',
          label: 'Bill from user traffic',
          note: 'Only $3.23 of $207.35 moved with traffic. The rest billed by the hour.',
          bar: [{ share: 1.6, tone: 'accent' }, { share: 98.4, tone: 'muted' }],
          keys: ['**Traffic**', 'Hourly infrastructure'],
        },
        {
          value: '$7',
          suffix: '/ day',
          label: 'Cost with zero nodes',
          note: 'The control plane, NAT Gateway, EBS, and ALB kept billing.',
          bar: [
            { share: 2.4, tone: 'ink-4' },
            { share: 1.4, tone: 'ink-3' },
            { share: 0.8, tone: 'ink-2' },
            { share: 2.4, tone: 'ink-1' },
          ],
          keys: ['EKS', 'NAT', 'EBS', 'Other'],
        },
      ],
      daily: {
        title: 'Daily Cost',
        sub: 'Daily AWS cost, Cost Explorer, read Oct 1',
        // 9/22 to 9/25 are missing from the analysis as single days; it gives
        // only their range, which the legend states.
        days: [
          { label: '9/7–20', total: 0.05 },
          { label: '9/21', total: 6.06 },
          { label: '9/26', total: 7.52 },
          { label: '9/27', total: 11.38, gpu: 2.92 },
          { label: '9/28', total: 42.55, gpu: 26.49 },
          { label: '9/29', total: 46.6, gpu: 29.21 },
          { label: '9/30', total: 55.51, gpu: 35.69 },
        ],
        legend: ['GPU nodes', 'Everything else', '9/22–25 ranged $5.93–15.76'],
        text: 'Spending stayed near $0.05 a day until the cluster went up on September 21. Both GPUs began full testing on September 28. The daily cost jumped to $42.55 that day and peaked at $55.51 on September 30. On those three days, everything except the GPUs cost $16 to $20 a day.',
      },
      budget: {
        title: 'Three Bills Against One Budget',
        sub: 'Monthly estimates and the real bill',
        limit: 330,
        bars: [
          { value: 2623, display: '$2,623', per: '/ mo', label: 'Always On', detail: 'Every node, 24 hours a day', tone: 'muted' },
          { value: 522, display: '$522', per: '/ mo', label: 'Operating Plan', detail: 'GPUs 2 h, nodes 10 h a day', tone: 'soft' },
          { value: 266, display: '$266', label: 'Actual Bill', detail: 'Sep 7 – Oct 1', tone: 'accent' },
        ],
        text: [
          'The plan cut the estimate by **80%** and still sat above the budget. Scaling to zero between tests kept the real bill under it.',
          'The cost model behind both estimates matched the measured bill within **10%** for EKS, the NAT Gateway, the ALB, and EBS.',
        ],
      },
      breakdown: [
        {
          title: 'Cost by Service',
          sub: 'Sep 7 – 30, $207.35 in total',
          rows: [
            { label: 'EC2 compute', value: 124.34, strong: true },
            { label: 'EC2 other (EBS, NAT)', value: 24.96 },
            { label: 'EKS control plane', value: 22.49 },
            { label: 'CodeBuild', value: 12.12 },
            { label: 'CloudWatch logs', value: 6.47 },
            { label: 'ALB', value: 5.07 },
            { label: 'VPC', value: 3.38 },
            { label: 'WAF', value: 2.66 },
            { label: 'ECR, KMS, R53, S3', value: 5.86 },
            { label: 'CloudFront', value: 0 },
          ],
          text: 'Compute made up 60% of the bill. CloudFront cost nothing because no shopper traffic reached it yet.',
        },
        {
          title: 'Cost by Node Type',
          sub: 'EC2 compute, Sep 7 – 30',
          rows: [
            { label: 'L40S (g6e)', value: 81.16, strong: true },
            { label: 'T4 (g4dn)', value: 19.45, strong: true },
            { label: 't3.medium ×4', value: 12.12 },
            { label: 't3.large ×1', value: 6.65 },
            { label: 't3.small ×3', value: 4.97 },
          ],
          text: 'The two GPUs took 80.9% of compute. The L40S for page generation alone cost more than every other node together.',
        },
      ],
      levers: {
        title: 'Savings Options',
        sub: 'Estimated monthly saving for each option',
        head: ['Option and trade-off', 'Monthly saving'],
        items: [
          { action: 'Run the GPUs 2 hours a day instead of 24', tradeoff: 'AI features work only during set test windows.', amount: '$1,937', saved: true },
          { action: 'Stop every node at night and on weekends', tradeoff: 'The service is down during those hours.', amount: '$164', saved: true },
          { action: 'Move the GPUs to Spot', tradeoff: 'AWS can reclaim a Spot GPU with 2 minutes’ notice, and a reclaim during the demo would stop it.', amount: '$1,300', saved: false },
          { action: 'Turn the NAT Gateway off', tradeoff: 'Payments, sign-in, mail, and image pulls would all stop.', amount: '$48', saved: false },
          { action: 'Drop audit logs from the control plane', tradeoff: 'The team would lose its audit trail.', amount: '$15', saved: false },
        ],
        text: 'We took the two largest savings that were safe to take. We kept the GPUs on demand because a Spot reclaim during the October 6 demo would have stopped the AI features.',
      },
      misses: {
        title: 'Mistakes and Fixes',
        sub: 'Honest misses and what we changed',
        items: [
          { amount: '$15', text: '**A plain apply restarted both GPUs.** On October 1, a `terraform` `apply` reset the node groups to their defaults, and both GPUs ran for about five hours. We added a rule to change node counts only through the CLI.' },
          { amount: '$19/mo', text: '**The estimate missed the control plane logs.** Five log types cost $6.47 in ten days, and the first estimate left them out.' },
          { amount: '$1,601', text: '**The full-testing pace broke the budget.** AWS Budgets forecast $1,600.67 a month at the September 28 to 30 pace, 4.6 times the budget.' },
          { amount: '2 days', text: '**The bill arrived late.** The September 30 total rose from $43 to $55.51 across three reads on October 1. The analysis records the time of every read.' },
          { amount: '$0', text: '**We started with no credits.** Turning on IAM Identity Center as an organization instance removed the account’s credits. Every dollar came from the budget.' },
        ],
      },
      production: {
        title: 'Production Estimate',
        sub: 'Monthly estimate for a production launch, no GPUs',
        segments: [
          { value: 510, label: '$510 base', tone: 'ink-4' },
          { value: 52, label: '$52', tone: 'ink-2' },
          { value: 99, label: '+$99', tone: 'accent' },
          { value: 125, label: '+$125', tone: 'soft' },
        ],
        ticks: ['Fixed services, 8 nodes, and CI', 'Traffic · Required · Advised', '$786'],
        text: [
          'Even with the GPUs off, a production launch would cost about **$786** a month. The required changes were a node autoscaler, larger database nodes, and a second NAT Gateway. Two GPU hours a day would bring it to $962, and GPUs on all day to $2,899. With a $330 budget, we kept production as code and ran staging only.',
          'A traffic spike would add only $26 a month, but without a node autoscaler, it would return 503 errors first. For an event, the team planned to add capacity ahead of time.',
        ],
      },
      mine: {
        title: 'My Part',
        text: [
          'I priced the node sizes and found three errors in the first estimate: a regional price that does not exist, a NAT rate at half its real value, and a missing EBS cost. I checked the cost analysis against the code and corrected it before submission.',
          'I wrote the teardown checklist. It lists seven reasons one `terraform` `destroy` would not finish cleanly. One reason was three database volumes that Terraform does not own. Those volumes would keep billing after the destroy.',
        ],
      },
    },
    // The other teams' repositories, linked under the README rather than shown:
    // their READMEs describe other teams' work, in Korean.
    relatedRepos: {
      label: 'Other team repositories',
      repos: [
        { name: 'backend', url: 'https://github.com/Jangingmall/backend' },
        { name: 'frontend', url: 'https://github.com/Jangingmall/frontend' },
        { name: 'GenAI', url: 'https://github.com/Jangingmall/GenAI' },
      ],
    },
    links: {
      github: 'https://github.com/Jangingmall/infra',
      notion: 'https://plain-dill-f1d.notion.site/04-3-3f7b20762b63811eb9b2c8d9dd4ec032',
      terraform: null,
      presentation: null,
    },
    // Approved 2026-10-20 after a long review round: his arc (infrastructure
    // first, then the product led, then adapting), the technical lessons, one
    // paragraph per team request, and a technical 'differently' list. Every
    // fact is sourced in CLAUDE.md, the runbook, the deck, or the repo. The last
    // two words of each paragraph are joined by a no-break space.
    //
    // Laid out as a story (approved 2026-10-21): the first two chapters run
    // down a timeline as text, and each team and next-time paragraph sits
    // beside its own diagram. `paragraph` indexes the arrays below, and
    // `split` is where a next-time paragraph turns from what happened to the
    // plan.
    reflection: {
      layout: 'story',
      story: {
        chapters: [
          {
            label: 'What I expected',
            kind: 'timeline',
            items: [
              { title: 'Expectation', mark: '1', paragraph: 0 },
              { title: 'Reality', mark: '2', paragraph: 1 },
            ],
          },
          {
            label: 'What I learned to do',
            kind: 'timeline',
            items: [
              { title: 'Cost and Change Control', icon: 'Terraform', paragraph: 2 },
              { title: 'Scheduling on EKS', icon: 'EKS', paragraph: 3 },
            ],
          },
          {
            label: 'Working with each team',
            kind: 'paired',
            source: 'learned',
            items: [
              { eyebrow: 'Back‑End Team', title: 'Keep a design open enough to absorb late requirements.', paragraph: 4, visual: 'backendRequests' },
              { eyebrow: 'AI Team', title: 'Build for requirements that are still moving.', paragraph: 5, visual: 'aiMove' },
              { eyebrow: 'Front‑End Team', title: 'Carry the complexity on the infrastructure side.', paragraph: 6, visual: 'frontendUploads' },
              { eyebrow: 'Security Team', title: 'Support every answer with evidence from the code and the live account.', paragraph: 7, visual: 'securityEvidence' },
            ],
          },
          {
            label: 'What I would do differently',
            kind: 'paired',
            source: 'differently',
            items: [
              { title: 'Terraform CI Pipeline', paragraph: 0, split: 'To close that gap,', visual: 'terraformPipeline' },
              { title: 'Node Autoscaler', paragraph: 1, split: 'On the cluster side,', visual: 'nodeAutoscaler' },
              { title: 'Zone Failure', paragraph: 2, split: 'For resilience,', visual: 'zoneFailure' },
              { title: 'Cost Alerts', paragraph: 3, split: '**I would set cost alerts', visual: 'costAlerts' },
            ],
          },
        ],
      },
      learned: [
        '**I joined the fellowship believing that cloud infrastructure came first in building a platform like Midam**. After months of studying how everything begins with a **network**, a **cluster**, and a **security plan**, I expected our team to set the pace and lead the rest of the build.',
        'In practice, **the project worked very differently**. **The team lead set the team’s priorities around the user‑facing features of the product**. The PM team shaped the plan from the shopper’s point of view, and infrastructure design often came last on the agenda. When I raised concerns about the project’s cloud infrastructure, they were usually set aside for a later phase. This was difficult for me, and I struggled with it at first. Over time, I learned to follow the PM team’s direction and to build the platform around the product’s schedule.',
        'Building around the product changed how I approached the technical work. I began treating cost as a design input. I priced each change before I proposed it, and I wrote down the risk we accepted whenever we chose the cheaper option. I also learned that a shared environment needs **change control**. Paid resources stayed at the `plan` stage until one shared apply, and every change went through a reviewed **pull request**.',
        'Working with EKS showed me how much reliability depends on scheduling. **Labels** and **taints** kept the GPU workloads and the database pods on their own node groups. A required **anti‑affinity rule** placed each database replica on a separate node. The same rules also limited where pods could run. With no node autoscaler, a pod that did not fit stayed Pending until someone added a node. I learned to read the Pending reason first and to treat node capacity as part of every deploy.',
        'Each team’s requests then tested how quickly the platform could adapt. The back‑end team taught me to keep a design open enough to absorb late requirements. Our schedule called for both teams to build in parallel, and we stayed in close contact as their service took shape. Three days into the infrastructure code, the back‑end team shared new needs. First, their service now needed **Redis**. On top of that, their Java service would reserve up to three gigabytes of heap per pod. Their AI responses would also stream over long connections. None of that was in our resource plan or our cost estimate. Within a week, we needed to resize the node groups, give each backend pod its own node, and add Redis to the cluster. We also raised the **ALB idle timeout** from 60 to 300 seconds.',
        'The AI team, in contrast, taught me to build for requirements that are still moving. Their first plan ran the models on an outside GPU service. To keep shopper data on servers we controlled, the AI team later chose to run the models on our own **EKS cluster**. That move put two **GPU node groups** on our side. The AI team was still comparing nine candidate chatbot models for accuracy and safety when we started building. The first manifests used placeholder image addresses in the meantime. To keep both teams on schedule, we built both GPU node groups in parallel and kept them at zero nodes. We also sized their disks for model images larger than ten gigabytes. When the AI team delivered the real images, the pods could start right away. Until then, the empty node groups cost nothing.',
        'Meanwhile, the front‑end team showed me that adapting to another team often means carrying the complexity on the infrastructure side. The front‑end team chose **Vercel** to host their site. Vercel ran outside our AWS account. The browser code converted each photo into three WebP sizes and uploaded them straight to S3. The team’s build could not ship until the domain names and the upload rules were settled. We split the domains between Vercel and the ALB, limited the bucket’s **CORS rule** to that one upload method, and kept encryption as the bucket default. The front‑end team never needed to change their upload code. Keeping the rules on the bucket also helped our own team. We could tighten a rule without waiting for a front‑end release, and every upload followed the same encryption and origin rules.',
        'Finally, as our team’s contact for the cloud security team, I reviewed their scan reports and wrote our responses. That work taught me to separate a scanner’s report from the real configuration. Most of the infrastructure findings targeted Kubernetes manifests outside our Terraform code. One critical finding was a **false positive**. Showing that took three separate pieces of evidence: **the code defaults**, **a plan‑time guardrail**, and **a query against the live cluster**. I learned to support every security answer with evidence from both the code and the live account.',
      ],
      differently: [
        'Our **Kubernetes changes** already passed through a **GitHub Actions** workflow on every pull request. It rendered each manifest and linted each Helm chart before anyone merged. **Terraform changes**, however, still depended on reviewers reading each plan by hand. We planned a **Terraform pipeline** as a deliverable, but the two‑week infrastructure‑as‑code phase from September 5 to 18 left no time to finish it. To close that gap, **I would run every Terraform change through a CI pipeline**. That pipeline would **format**, **validate**, and **test** every change. It would also post the plan to the pull request for review. Additionally, adding the **IaC security scan** to that pipeline would change how security reviews worked. The security team ran its scans after the build ended, and its findings arrived as one large batch. By then, many changes were days or weeks old, and each fix started with relearning the code. With a pipeline, a scan on every pull request would flag a problem while its author was still working on that change. Fixing it would take minutes, and the security review would confirm a short list in place of a long backlog.',
        'We chose a fixed node count on purpose. **A fixed count kept the monthly cost ceiling predictable on a small budget**. In practice, a person changed that count by hand. When the backend scaled out or a GPU test began, the new pods waited in Pending until someone added a node. On the cluster side, **I would add a node autoscaler**. With **Karpenter**, that wait would disappear. Karpenter would watch for Pending pods and launch a node that fits them. For an AI pod, it would choose a GPU instance. Once the pods finished and a node sat empty, Karpenter would remove it. As a result, GPU capacity would exist only during real use. The bill would follow actual demand, and nobody would need to scale the GPUs by hand.',
        'To save cost, we kept every node and volume in one Availability Zone. A second NAT Gateway for another zone would add about $43 a month, and traffic between zones would add more. For resilience, **I would plan for a zone failure earlier**. **Topology spread constraints** would place the database replicas in two separate zones. Even though that layout would raise the bill slightly, **it would remove the largest single‑zone risk**. A failover drill on that layout would then give the HA report measured recovery times.',
        'The **AWS Budgets** limit for the whole project was our only alert. The program gave us one fixed budget for the entire fellowship, and we set that limit once at $330. The alert compared total spending against that limit and could not show a sudden daily rise. **Cost Explorer** also showed our real spending pace only two days later. **I would set cost alerts before the first apply**. A **daily budget alert** would catch a spike on the day it starts. **Cost anomaly detection** would then trace that spike to its node group through the tags we already used.',
      ],
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
    // Approved 2026-10-22 from live samples. How follows deploy.yml's jobs:
    // code checks, the Docker Hub image, then Ansible on both sides, with the
    // AWS side destroyed at the end of each run. ~6s is the nginx self-heal
    // capture (active again at t=6.0). `oneLine` keeps each figure label on a
    // single line while the row sits beside the workspace tiles.
    glance: {
      why: 'In this project, I wanted to rebuild our first team project’s infrastructure entirely on my own. As the infra build lead on EchoChallengers, I wrote the **Terraform** and **Ansible** foundation that the rest of the team built on. This time, I started from an empty repository and also wrote the monitoring and recovery layers myself. I finished it with a **GitHub Actions** pipeline that deploys both environments.',
      how: {
        flow: {
          steps: [
            { key: 'Check', tools: 'Python + YAML', caption: 'syntax on every push' },
            { key: 'Image', tools: 'Docker Hub', caption: 'builds the FastAPI image' },
            { key: 'Deploy', tools: 'On‑prem + AWS', caption: 'runs Ansible on both sides' },
          ],
          base: { name: 'Terraform destroy', text: 'removes the AWS side at the end of every run' },
        },
      },
      result: {
        oneLine: true,
        figures: [
          { value: '1 push', label: 'deploys both environments' },
          { value: '15', label: 'Ansible roles reused on AWS' },
          { value: '~6s', label: 'Nginx restart after a kill' },
        ],
      },
    },
    // The workspace as four tiles beside At a Glance, each led by one figure,
    // rendered by WorkspaceFaces.jsx. Counted from the public repository:
    // commits per day across its whole history (the Sep commits removed
    // secrets and published it), the four jobs in deploy.yml, and the four
    // hosts in inventory/hosts.ini. `hot` marks the May build days.
    workspaceFaces: [
      {
        icon: 'github',
        title: 'GitHub',
        subtitle: 'Solo repository',
        value: '75',
        label: 'commits on main',
        bars: {
          days: [
            { day: 'Apr 27', commits: 1 },
            { day: 'May 13', commits: 8, hot: true },
            { day: 'May 14', commits: 9, hot: true },
            { day: 'May 15', commits: 10, hot: true },
            { day: 'May 16', commits: 42, hot: true },
            { day: 'Sep 9', commits: 1 },
            { day: 'Sep 10', commits: 3 },
            { day: 'Sep 12', commits: 1 },
          ],
        },
      },
      {
        icon: 'workflow',
        title: 'GitHub Actions',
        subtitle: 'deploy.yml',
        value: '4',
        label: 'jobs per push',
        chips: [{ text: 'checks' }, { text: 'image' }, { text: 'on-prem', on: true }, { text: 'AWS', on: true }],
      },
      {
        icon: 'server',
        title: 'VMware lab',
        subtitle: 'On-premise hosts',
        value: '4',
        label: 'virtual machines',
        chips: [{ text: 'proj-mgmt', on: true }, { text: 'rocky1' }, { text: 'rocky2' }, { text: 'ubuntu1' }],
      },
      {
        icon: 'people',
        title: 'EchoChallengers',
        subtitle: 'Team counterpart',
        value: '5',
        label: 'weeks side by side',
        link: { label: 'View EchoChallengers', href: '#/projects/echochallengers' },
      },
    ],
    // Approved 2026-10-22 from live samples. The team pages' avatar template
    // with a figures band and an areas bento. Every figure and visual is
    // counted from the repository: 33 resource blocks in terraform/*.tf, the
    // 15 directories under roles/, the four jobs and the notify steps in
    // deploy.yml, the two alert names in recovery/webhook_server.py, the
    // seven cases in chaos/inject.sh, and the Tailscale action on the runner.
    // The role chips are ordered to fill four rows at desktop width.
    role: {
      title: 'Solo Engineer',
      subtitle: 'Infra and CI/CD',
      layout: 'areas',
      areas: ['L L L L L L P P P P P P', 'W W W W C C C C N N N N'],
      figuresInline: true,
      figures: [
        { value: '33', unit: 'Terraform resources' },
        { value: '15', unit: 'Ansible roles' },
        { value: '4', unit: 'jobs per push' },
      ],
      tiles: [
        {
          size: 'lead',
          area: 'L',
          label: 'Solo Build',
          text: 'Wrote the **Terraform** for the AWS side and all **15 Ansible roles** that configure the four VMware hosts and the four AWS instances.',
          footer: {
            type: 'chipRows',
            rows: [
              [{ text: 'haproxy' }, { text: 'nginx' }, { text: 'docker' }, { text: 'fastapi' }, { text: 'certbot' }],
              [{ text: 'nginx_selfheal' }, { text: 'postgresql' }, { text: 'recovery_service', accent: true }],
              [{ text: 'node_exporter' }, { text: 'prometheus_bot', accent: true }, { text: 'docker_fastapi' }],
              [{ text: 'tailscale' }, { text: 'monitoring', accent: true }, { text: 'telegram' }, { text: 'cloudflared' }],
            ],
          },
        },
        {
          size: 'medium',
          area: 'P',
          tone: 'accent',
          label: 'Pipeline',
          text: 'Built one **GitHub Actions** workflow that deploys both environments on every push and **destroys the AWS side** at the end of each run.',
          visual: {
            type: 'flow',
            steps: ['checks', 'image', 'deploy'],
            rows: [
              { name: 'On-prem', text: 'self-hosted runner' },
              { name: 'AWS', text: 'apply, configure, check, destroy', active: true },
              { name: 'Notify', text: 'Slack and Telegram' },
            ],
          },
        },
        {
          size: 'small',
          area: 'W',
          label: 'Recovery webhook',
          text: 'Wrote a **FastAPI webhook** that matches each critical alert to its fix and runs it over SSH.',
          visual: {
            type: 'routes',
            rows: [
              { when: 'FastAPIDown', profile: 'docker restart', active: true },
              { when: 'NodeDown', profile: 'systemctl restart' },
            ],
          },
        },
        {
          size: 'small',
          area: 'C',
          label: 'Chaos script',
          text: 'Built a **chaos script** to trigger seven different failures on demand in both environments.',
          visual: {
            type: 'chips',
            grid: true,
            items: [
              { text: 'fastapi1' }, { text: 'fastapi2' }, { text: 'nginx1' }, { text: 'nginx2' },
              { text: 'db' }, { text: 'cpu1' }, { text: 'haproxy' }, { text: '--aws', accent: true },
            ],
          },
        },
        {
          size: 'small',
          area: 'N',
          label: 'Tailscale runner',
          text: 'Joined the CI runner to the **Tailscale** network to reach the private instances directly.',
          visual: {
            type: 'routes',
            rows: [
              { when: 'GitHub runner', profile: 'tailnet', active: true },
              { when: 'tailnet', profile: 'private EC2' },
            ],
          },
        },
      ],
    },
    // Approved 2026-10-22 from live samples. A self-study told as a confidence
    // story: one wide note for why the project exists, then a track of four
    // stages with one note under each. The bold ledes were reworded so each
    // justifies cleanly in a narrow card with no word alone on a line.
    context: {
      layout: 'track',
      notes: [
        {
          label: 'Why This Project Exists',
          text: 'By the time the first team project began, the course was moving faster than my confidence in each tool. Delivering a working build with my team showed me how a hybrid system comes together across VMware and AWS. **Terraform** creates the cloud servers, **Ansible** configures every host, and **monitoring** watches over them all. The same build also showed me how much more practice I wanted with each tool. Rebuilding the same infrastructure on my own became a way to strengthen that foundation one layer at a time.',
        },
        {
          stage: 'Uncertain',
          label: 'What Felt Uncertain',
          lede: 'Writing **Terraform** and **Ansible** from a blank file still felt uncertain at first.',
          text: 'A worked example felt easy to follow. Starting from an empty file felt like a different skill.',
        },
        {
          stage: 'Practicing',
          label: 'How It Was Practiced',
          lede: 'Each step of the same design was repeated until it felt routine.',
          text: 'Each part was also broken on purpose and brought back to see how it recovers.',
        },
        {
          stage: 'Learning',
          label: 'Where Answers Came From',
          lede: 'Most of the learning came from **official guides** and **error logs**.',
          text: 'A failed step meant reading until the cause was clear.',
        },
        {
          stage: 'Confident',
          label: 'What Changed',
          lede: 'Over time, errors started to read as clues.',
          text: 'Each clean run made the next layer less intimidating. By the end, the whole hybrid build ran from one repository.',
        },
      ],
    },
    // Every figure is counted from the repository tree rather than estimated:
    // 33 `resource` blocks across terraform/*.tf, 15 directories under roles/,
    // 17 playbooks, 7 failure cases in chaos/inject.sh besides `all` and
    // `status`, and 4 rules in monitoring/alert.rules.yml plus 6 alarms in
    // terraform/cloudwatch.tf. Each detail line says what the number makes
    // possible. "Under 40 seconds" is the end-to-end test in commit aef4c22:
    // the alert fired at about 38s and the container restarted in 0.9s.
    // `metricsStyle: 'tiles'` gives this page its own grid, placed by `area`.
    metricsStyle: 'tiles',
    metrics: [
      {
        area: 'tf',
        art: 'stack',
        accent: true,
        value: '33',
        label: 'Terraform Resource Blocks',
        detail: 'Builds the full AWS environment on demand and removes it after testing',
      },
      {
        area: 'roles',
        art: 'modules',
        value: '15',
        label: 'Ansible Roles',
        detail: 'Configures all eight servers from one change',
      },
      {
        area: 'pb',
        art: 'book',
        value: '17',
        label: 'Playbooks',
        detail: 'Restores a single broken service without touching the rest',
      },
      {
        area: 'chaos',
        art: 'bolt',
        value: '7',
        label: 'Failure Injections',
        detail: 'Triggers seven real failures to test the recovery paths',
      },
      {
        area: 'alerts',
        art: 'bell',
        value: '10',
        label: 'Alerts Configured',
        detail: 'Catches a stopped application and brings it back in under 40 seconds',
      },
      {
        area: 'env',
        art: 'hybrid',
        value: '2',
        label: 'Environments',
        detail: 'Verifies both sites with health checks before calling a deploy done',
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
        text: 'When working on EchoChallengers, I used **Tailscale** to join our VMware lab to AWS without opening a public port. In this build, I took it a step further by adding the GitHub Actions runner to the same private network. Each AWS instance joins from its own startup script, and Ansible reaches every private server at its **100.x** address.',
      },
      {
        tool: 'Why GitHub Actions?',
        icon: 'GitHub Actions',
        text: 'During the course of the first team project, **GitHub Actions** was still new to most of us because our class was only beginning to cover it. The team kept to a Makefile everyone could run by hand, and I used this project to take on the challenge myself. The result is one workflow with **four jobs** that checks the code, builds the image, and deploys both environments on every push.',
      },
      {
        tool: 'Why Docker for FastAPI?',
        icon: 'Docker',
        text: 'The first version of this build ran FastAPI directly on each web server, and every server needed its own compilers to install the Python packages. I moved the app into **Docker** to make both servers run the same code in the same way. The pipeline now builds **one image**, both web servers pull it, and **Nginx** stays on the host as the reverse proxy.',
      },
      {
        tool: 'Why keep HAProxy?',
        icon: 'HAProxy',
        text: 'EchoChallengers used **HAProxy** on the mgmt server because a VMware lab has no cloud load balancer. I kept the same approach to stay close to the team’s design on the on‑premise side. It spreads traffic across the two web servers and shows their health on a **stats page at :8404**, and the same role also runs on AWS.',
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
    // The recovery map first, the order the team pages use, then the two
    // halves of the question the Alert-to-restart diagram answers: what has
    // to be true before anything fires, and where it goes once it does. The
    // webhook also stays under Resources with the rest of the source.
    // `alertmanager.yml` carries the `continue: true` on both severity routes,
    // which is why one alert reaches Slack and Telegram and the webhook
    // without being three alerts.
    recoveryPolicy: [
      { path: 'recovery/webhook_server.py', content: ipoWebhook },
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
            { id: 'tailnet', label: 'Tailscale mesh', sub: 'mgmt, AWS hosts, and the runner', glyph: 'vpn', x: 560, y: 252, w: 320, h: 56 },

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
              text: 'One set of roles serves both sites. The AWS playbook connects Tailscale first and moves monitoring into Docker.',
            },
            {
              x: 20,
              y: 682,
              text: 'All four instances use t4g.small, an Arm type built on AWS Graviton chips. It costs less per hour than the matching x86 type.',
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
            // The four rules wait 30s (FastAPIDown), 1m (NodeDown, HighCPU) or
            // 3m (HighMemory) before firing. The label sits above the boxes:
            // the 70-unit gap between them is no wider than the text.
            { from: 'prometheus', to: 'alertmanager', label: 'for: 30s–3m', labelAt: [645, 72] },
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
              text: 'A restart runs only when the alert name and job both match the webhook’s maps. Any unmatched alert stays in the log for a manual check.',
            },
            {
              x: 20,
              y: 662,
              text: 'Every alert reaches Slack and Telegram. Recovery results reach Slack only because the webhook posts them there itself.',
            },
            {
              x: 20,
              y: 684,
              text: 'A Restart=always drop-in lets systemd restart Nginx on its own. Nginx comes back in about 5 seconds with no alert raised.',
            },
          ],
        },
      },
      {
        tab: 'One workflow',
        caption:
          'Automated deployment and teardown',
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
              text: 'The on-prem and AWS jobs wait for the image and then run side by side. A single push updates both environments from one commit.',
            },
            {
              x: 20,
              y: 682,
              text: 'Each outcome posts to Slack. Successes and failures also post to Telegram, and the destroy notice stays in Slack.',
            },
          ],
        },
      },
    ],
    // Dated from the public repository's history. The first commit (Apr 27)
    // already holds the hosts, monitoring, the webhook and chaos/inject.sh;
    // Docker, the self-heal drop-in and Terraform all land in one commit on
    // May 13; the workflow fixes and Tailscale run May 13 to 16. The Apr 20
    // start is the course start, earlier than any commit. The September
    // commits were demo prep for this page and are left out.
    implementation: {
      months: ['2026-04', '2026-05'],
      span: { from: '2026-04-20', to: '2026-05-16' },
      phases: [
        {
          id: 'onprem',
          title: 'On-Premises Base & Monitoring',
          range: 'Apr 20 – Apr 27',
          from: '2026-04-20',
          to: '2026-04-27',
          text: 'I set up four VMware machines with one management server, two web servers, and one database server. I practiced writing **Ansible** roles for PostgreSQL, Nginx, FastAPI, and HAProxy to set each one up the same way every time. **Prometheus** collected metrics from every machine, and **Alertmanager** sent alerts to Slack. A small webhook restarted a service over SSH when a critical alert fired. A short chaos script let me break things on purpose and watch the recovery happen.',
        },
        {
          id: 'build',
          title: 'Docker, Self-Healing & AWS',
          range: 'Apr 28 – May 12',
          from: '2026-04-28',
          to: '2026-05-12',
          text: 'Next, I moved the app into **Docker** to run the same image on both web servers. I tried writing the AWS side with **Terraform**, including a VPC, public and private subnets, a load balancer, and four servers. Because the AWS servers used Arm processors, the monitoring downloads needed Arm versions, and the Telegram bot needed to be built from source.',
        },
        {
          id: 'pipeline',
          title: 'Pipeline & Tailscale',
          range: 'May 13 – May 16',
          from: '2026-05-13',
          to: '2026-05-16',
          text: 'Connecting everything with **GitHub Actions** took many small fixes over four days. The workflow checks the code, builds the image, and deploys to both environments. A self-hosted runner handles the VMware side, and **Tailscale** lets the hosted runner reach the private servers on AWS. The AWS servers are deleted at the end of every run to keep the cost down.',
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
        'Clips come from one silent screen recording of the on-premises run and loop continuously. Each one is 1440 pixels wide to keep four panes of console text readable.',
      // Said once, because a reader who compares two stills will notice the
      // clocks before the page gets a chance to explain them.
      stillsNote:
        'Captures come from several runs across two days, and their clocks do not match each other or the clips. Click one to open it at full size.',
      scenarios: [
        {
          id: 'baseline',
          tab: 'Baseline',
          label: 'Scenario 1: Baseline monitoring across both environments',
          lead:
            'Prometheus monitors seven jobs in the VMware lab and the same seven on AWS. VMware hosts answer at `192.168.61.x`. AWS application and database hosts answer at **100.x** through Tailscale, and the mgmt host answers on its VPC address.',
          before: {
            src: '/projects/project1-self-build/demo-01-onprem-targets.png',
            state: 'Prometheus has all seven jobs up on the VMware hosts',
            alt: 'The Prometheus targets page for the VMware environment, listing fastapi-rocky1 and fastapi-rocky2 on port 8000, node-mgmt, node-rocky1, node-rocky2 and node-ubuntu1 on port 9100, and Prometheus scraping itself, every one of them 1/1 up and labelled environment="onprem"',
          },
          after: {
            src: '/projects/project1-self-build/demo-02-aws-targets.png',
            state: 'Every AWS job reports up through Tailscale and the VPC',
            alt: 'The Prometheus targets page for the AWS environment, listing the same seven jobs all 1/1 up and labelled environment="aws", with the application and database endpoints on 100.x Tailscale addresses, node-mgmt on its VPC address 10.0.1.206, and Prometheus scraping itself on localhost',
          },
        },
        {
          id: 'terraform',
          tab: 'Terraform',
          label: 'Scenario 2: The AWS environment under Terraform',
          lead:
            '**Terraform** builds four `t4g.small` instances across two availability zones. The application answers through the ALB, and the whole environment is removed once testing ends.',
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
            'Stopping rocky1 turns its HAProxy row **DOWN** on the next L4 check. Traffic shifts to rocky2, and the site keeps serving on one web server.',
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
            '`chaos/inject.sh cpu1` drives rocky1 to **100%** CPU. HighCPU fires after its one-minute window and posts to Slack. The webhook leaves it alone because a busy CPU is a warning, and only critical alerts trigger a restart.',
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
            'FastAPIDown on aws-rocky1 triggers an automatic restart, and each step arrives in Slack as a notification. A **HighCPU** alert fires and resolves below it.',
          before: {
            src: '/projects/project1-self-build/demo-12-aws-slack-thread.png',
            state:
              'The AWS thread runs from the first alert to recovery',
            alt: 'The Slack channel all-mindmug holding the AWS recovery sequence in order: several [AWS][CRITICAL] FastAPIDown alerts naming aws-rocky1 in ap-northeast-2, a line saying automatic recovery has started against 100.83.68.94, a line reporting the recovery failed and needs manual intervention, a second recovery start, a line reporting recovery complete, and below them an [AWS][FIRING] HighCPU at 100 percent followed by its [AWS][RESOLVED] at 67.6 percent',
          },
          after: {
            src: '/projects/project1-self-build/demo-13-aws-selfheal-board.png',
            state: 'The self-healing board marks FastAPI Down events on both AWS web servers',
            alt: 'The self-healing demo dashboard pointed at the AWS environment, its CPU chart flat near zero across all four hosts, its mean response time dropping from about two minutes to zero, and its threshold event timeline marking the FastAPI Down rows for aws-rocky1 and aws-rocky2 as events against an otherwise normal band, while the four CPU rows stay normal throughout',
          },
        },
      ],
    },
    folderStructure: `
project1-on-premise-self-build/
├── terraform/
│   ├── main.tf                  # VPC, subnets, 4 instances, ALB
│   ├── variables.tf
│   ├── outputs.tf               # prints an Ansible inventory
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
│   ├── web.yml                  # the systemd version, no longer imported
│   ├── nginx_selfheal.yml
│   ├── monitoring.yml
│   ├── monitoring-docker.yml    # the AWS monitoring stack
│   ├── prometheus_bot.yml
│   ├── prometheus_connect.yml   # promtool check, then restart
│   ├── prometheus_connect_docker.yml
│   ├── recovery_service.yml
│   ├── cloudflared.yml
│   ├── certbot.yml
│   └── notify.yml
├── roles/                       # 15 roles
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
│   ├── prometheus-docker.yml
│   ├── prometheus_aws.yml.j2
│   ├── alert.rules.yml          # 4 rules
│   ├── test_alert.yml
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
├── deploy_aws.sh                # an earlier manual deploy through mgmt
└── README.md
`,
    // Checked against the public repo. The compilers on the systemd version
    // were for the Python packages (gcc-c++ for greenlet), not psycopg2, which
    // is installed as psycopg2-binary. Kept plain and practice-sized on purpose.
    decisions: [
      {
        keyword: 'Delete AWS each run',
        title: 'The AWS servers are deleted at the end of every pipeline run.',
        glyph: 'pipeline',
        chose: 'A `terraform destroy` step on every run',
        over: 'leaving the AWS servers up between runs',
        why: 'Automatic teardown was my safeguard for this practice environment because an idle NAT gateway still bills by the hour. Destroy runs after every run, including failed ones, and no resources remain to accrue cost between tests.',
      },
      {
        keyword: 'Tailscale over ProxyJump',
        title: 'The pipeline reaches the private AWS servers over Tailscale.',
        glyph: 'route',
        chose: 'The servers and runner on **Tailscale**',
        over: '`ProxyJump` through mgmt for every task',
        why: 'The first version routed every Ansible task through mgmt with `ProxyJump`. Replacing it with **Tailscale** gave me hands-on practice with subnet routing. The mgmt server shares the VPC routes, and the runner reaches each private server directly.',
      },
      {
        keyword: 'Arm instances',
        title: 'All four AWS servers run on Arm processors.',
        glyph: 'depth',
        chose: '**Arm** `t4g.small` for all four servers',
        over: 'x86 instances with ready-made downloads',
        why: 'I chose Arm instances for their lower hourly price, and the choice showed me how much depends on the platforms a tool supports. Several downloads needed Arm builds, and the Telegram bot was published only as an x86 image. I compiled the bot from source with **Go** to run it on Arm.',
      },
      {
        keyword: 'systemd for Nginx',
        title: 'Nginx restarts through systemd and stays out of the alert pipeline.',
        glyph: 'process',
        chose: 'A systemd `Restart=always` drop-in',
        over: 'an Nginx alert routed to the webhook',
        why: 'This decision taught me to rely on the operating system before adding automation. The systemd drop-in restarts Nginx on its own in about **five seconds**. Routing it through Prometheus, Alertmanager, and the webhook would add delay and more points of failure. The webhook covers `FastAPIDown` and `NodeDown`.',
      },
      {
        keyword: 'Only the app in Docker',
        title: 'Only FastAPI runs in a container, and Nginx and PostgreSQL stay on the host.',
        glyph: 'branch',
        chose: '**FastAPI** in one image built in CI',
        over: 'containers for the whole stack',
        why: 'The first version installed FastAPI directly on each web server, and every server needed compilers to install the Python packages. Containerizing it with **Docker** removed that requirement and gave me practice building one image in CI and running it on every web server. Nginx and PostgreSQL stayed on the host to keep the setup simple.',
      },
      {
        keyword: 'One chaos script',
        title: 'One script breaks and restores services in both environments.',
        glyph: 'inject',
        chose: 'One `chaos/inject.sh` for both sides',
        over: 'a separate script for each environment',
        why: 'Injecting failures on purpose was the most direct way to test the recovery path. One script stops services like FastAPI, Nginx, or PostgreSQL, and `all` restores them. An `--aws` flag extends the same tests to the cloud environment.',
      },
    ],
    links: {
      github: 'https://github.com/ShinJunhan/project1-on-premise-self-build',
      terraform: 'https://github.com/ShinJunhan/project1-on-premise-self-build/tree/main/terraform',
      presentation: null,
    },
    reflection: {
      learned: [
        'Project1-Self-Build started as a self-study of EchoChallengers. EchoChallengers was my first team project, and I understood only my own part of its hybrid cloud. Rebuilding the whole system alone seemed like a quick and stress-free way to learn the rest.',
        'Working alone quickly proved more difficult. Every failed deployment stopped my progress, and no one was there to help me find the cause. Many pipeline runs failed before the first one succeeded. Those failures made me question how I approached learning.',
        'My habits in class were part of the problem. I relied on my professor whenever code needed debugging. Error logs felt too daunting to read, and his experience seemed like the only way to solve them. This passive attitude limited my understanding of how the system worked. The rebuild gave me steady practice in the **discipline** and **diligence** to **actually read error logs**.',
        '**Security was another lesson I learned the hard way**. Hard-coding the Slack webhook URL into the Ansible variables was an early mistake. Correcting it taught me how GitHub Secrets pass values into a workflow and why an incoming webhook URL must stay private. When teammates later faced the same error, I was able to **explain the fix**.',
        'Documentation also became part of my routine. The **Terraform AWS provider documentation became the first place to troubleshoot** any resource that behaved unexpectedly. Each argument there explained a line I once copied without thinking.',
        'Looking back, the project was an honest test of what I retained from class. Despite keeping up with every lecture, I barely understood the system. Debugging every layer alone taught me how to find solutions on my own. Today, whenever I meet an unfamiliar tool, **my first step is to read its documentation and its logs**. That habit is what I want to bring to my next team.',
      ],
    },
  },

  {
    slug: 'individual-project-two',
    group: 'individual',
    // No `team` key: solo work, so the Members section and the Notion link
    // never render, the same opt-out individual-project-one uses.
    title: 'ShimonVault',
    // The descriptive page heading. `title` above stays the short name the
    // sidebar shows and the eyebrow repeats. Chosen 2026-10-25 from live
    // samples: a personal register to sit beside individual-project-one's
    // "Self-Directed Study…", with Cloud Security first because it is the
    // strongest part of the build. Hybrid is the AWS platform plus the
    // monitoring stack on the on-premises server. The old title's "Automated
    // Response" was dropped because block_ip is deployed with no live trigger.
    // The hyphen is U+2011. The spaces in "Cloud Security" and "Hybrid
    // Infrastructure" are U+00A0: without them, desktop split "Cloud" from
    // "Security" and a phone left "Infrastructure" alone on the last line.
    fullTitle: 'Self‑Directed Practice in Cloud Security on Hybrid Infrastructure',
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
    // Approved 2026-10-29 from live samples. How is the build by week, each
    // week's components read off the files its commits added in the public
    // repository (the commit titles name the weeks). No dates: the commit
    // dates do not line up with the project period above. `icon` is a
    // techIcon label; slowapi has no logo and renders as text alone. Result
    // is the three thresholds the app enforces (auth_router.py: alert at 5,
    // incident at 8; audit_middleware.py: suspend at 5; slowapi: 10 downloads
    // per 60s), drawn on one shared 11-step scale.
    glance: {
      why: 'Leading Lock‑N‑Lock showed me how a secure hybrid platform comes together as a team. As team lead, I owned the infrastructure track. Four teammates owned the application, security, CI/CD, and monitoring tracks. In this project, I wanted to take on the network, the application, and the detection rules by myself. The goal was to find out whether I could build one alone and to gain hands‑on experience beyond the infrastructure track. Each job in the same brief went to an AWS service built for it. My plan was to learn how **Lambda**, **DynamoDB**, and **EventBridge** handle security work and to test each defense with real attacks.',
      how: {
        weeks: [
          {
            week: 'Week 1',
            title: 'Foundation',
            tools: [
              { label: 'Terraform', icon: 'Terraform' },
              { label: 'shell scripts', icon: 'Bash' },
              { label: 'PostgreSQL', icon: 'PostgreSQL' },
              { label: 'Docker Compose', icon: 'Docker' },
            ],
          },
          {
            week: 'Week 2',
            title: 'Core build',
            tools: [
              { label: 'Terraform', icon: 'Terraform' },
              { label: 'FastAPI', icon: 'FastAPI' },
              { label: 'Lambda', icon: 'Lambda' },
              { label: 'Ansible', icon: 'Ansible' },
              { label: 'GitHub Actions', icon: 'GitHub Actions' },
              { label: 'attack scripts', icon: 'Bash' },
            ],
          },
          {
            week: 'Week 3',
            title: 'Demo check',
            tools: [
              { label: 'Prometheus rules', icon: 'Prometheus' },
              { label: 'PostgreSQL replication', icon: 'PostgreSQL' },
              { label: 'audit middleware', icon: 'FastAPI' },
            ],
          },
          {
            week: 'Week 4',
            title: 'Demo and corrections',
            tools: [
              { label: 'React console', icon: 'React' },
              { label: 'Prometheus targets', icon: 'Prometheus' },
              { label: 'slowapi' },
            ],
          },
        ],
      },
      result: {
        meters: {
          scale: 11,
          rows: [
            { label: 'Failed logins', count: 8, marks: { 5: 'alert', 8: 'incident' } },
            { label: 'Denied requests', count: 5, marks: { 5: 'suspend' } },
            { label: 'Downloads in 60s', count: 11, marks: { 11: 'blocked' }, blockFrom: 11 },
          ],
        },
      },
    },
    // The workspace column: an event map across the top, Console and Network
    // side by side beneath it, rendered by WorkspaceStack.jsx. Approved
    // 2026-10-29. Event sources are terraform/lambda.tf (S3 notification, the
    // two SNS subscriptions, the EventBridge permissions); block_ip is drawn
    // idle because nothing in app/ publishes to its topic yet. The attacks and
    // their endpoints are app/routers/demo_router.py, and alerts go to both
    // channels through notify_service.notify_all. Routes are
    // terraform/security_groups.tf; 9100 is node_exporter, reached over
    // Tailscale.
    workspaceStack: {
      eventMap: {
        title: 'Event map',
        subtitle: 'What triggers each Lambda function',
        figure: { value: '5', label: 'functions' },
        rows: [
          {
            source: 'S3 upload',
            event: 'ObjectCreated',
            icon: 'S3',
            functions: [{ name: 'validate_file' }],
            text: 'Reads the first bytes and deletes executables and archives.',
          },
          {
            source: 'EventBridge',
            event: 'schedule',
            icon: 'EventBridge',
            functions: [{ name: 'meeting_notify' }, { name: 'meeting_expire' }],
            text: 'Sends the meeting reminder and archives attendance afterward.',
          },
          {
            source: 'SNS',
            event: 'alert topics',
            icon: 'SNS',
            functions: [{ name: 'log_incident' }, { name: 'block_ip', idle: true }],
            text: 'Logs each alert. The IP block is subscribed but not yet triggered.',
          },
        ],
        foot: 'lambda.tf',
        href: 'https://github.com/ShinJunhan/shimon-vault/blob/main/terraform/lambda.tf',
        linkLabel: 'View file',
      },
      console: {
        title: 'Console',
        subtitle: 'Demo controls',
        figure: { value: '4', label: 'attacks' },
        attacks: [
          { name: 'Credential stuffing', target: 'POST /auth/login' },
          { name: 'Broken access control', target: 'GET /docs/download' },
          { name: 'Bulk exfiltration', target: 'GET /docs/download' },
          { name: 'Traffic flood', target: 'GET /docs/list' },
        ],
        alerts: { label: 'Alerts go to', channels: ['Slack', 'Telegram'] },
        foot: 'Console.jsx',
        href: 'https://github.com/ShinJunhan/shimon-vault/blob/main/frontend/src/Console.jsx',
        linkLabel: 'View code',
      },
      network: {
        title: 'Network',
        subtitle: 'Security groups',
        figure: { value: '5', label: 'groups' },
        routes: [
          { from: 'Internet', to: 'ALB', port: '80/443', service: 'HTTP/HTTPS' },
          { from: 'ALB', to: 'App', port: '8000', service: 'FastAPI' },
          { from: 'App', to: 'RDS', port: '5432', service: 'PostgreSQL' },
          { from: 'Admin', to: 'Bastion', port: '22', service: 'SSH' },
          { from: 'Tailnet', to: 'App', port: '9100', service: 'Metrics' },
        ],
        foot: 'security_groups.tf',
        href: 'https://github.com/ShinJunhan/shimon-vault/blob/main/terraform/security_groups.tf',
        linkLabel: 'View file',
      },
    },
    // The team pages' My Role template: monogram column, a band across the
    // top, and an areas bento. The band is a track strip instead of figures,
    // set against Lock‑N‑Lock where the same five tracks were split five ways.
    // Nothing here repeats Workspace (the Lambda map, the attacks, the
    // security groups) or Key Impact Metrics (resource and file counts).
    role: {
      title: 'Solo Engineer',
      subtitle: 'Infra and Security',
      tracks: {
        items: ['Infrastructure', 'Application', 'Security', 'CI/CD', 'Monitoring'],
        // Labels for a phone, where five segments cannot fit the full words.
        short: ['Infra', 'App', 'Security', 'CI/CD', 'Monitor'],
        rows: [
          { name: 'Lock‑N‑Lock', caption: 'my track', owned: ['Infrastructure'] },
          { name: 'ShimonVault', caption: 'my tracks', owned: 'all' },
        ],
      },
      layout: 'areas',
      areas: [
        'L L L L L L P P P P P P',
        'L L L L L L Q Q Q Q Q Q',
        'A A A A B B B B C C C C',
      ],
      tiles: [
        {
          area: 'L',
          size: 'lead',
          label: 'Solo Build',
          text: 'Covered the app, security, CI/CD, and monitoring tracks that teammates owned on Lock‑N‑Lock. None of that work was familiar at the start. The folders below show how the practice spread across the platform.',
          // Lines in code files per top-level folder, counted from the
          // repository export. Tests are left out: two of the test files are
          // copies of their router source.
          footer: {
            type: 'reviews',
            value: '~14,000',
            unit: 'lines written',
            wide: true,
            bars: [
              { name: 'app', count: 3242 },
              { name: 'terraform', count: 2870 },
              { name: 'scripts', count: 2164 },
              { name: 'frontend', count: 1774 },
              { name: 'ansible', count: 1237 },
              { name: 'monitoring', count: 1170 },
              { name: 'lambda', count: 772 },
              { name: 'db', count: 428 },
              { name: 'workflows', count: 295 },
            ],
          },
        },
        // scripts/setup_replica.sh: a publication on RDS and a subscription on
        // proj-ubuntu01, reached through a socat relay on the app EC2's
        // Tailscale address.
        {
          area: 'P',
          size: 'medium',
          tone: 'accent',
          even: true,
          label: 'Hybrid replication',
          visual: {
            type: 'span',
            from: { icon: 'RDS', name: 'RDS', note: 'primary on AWS' },
            via: { icon: 'Tailscale', text: 'in sync over Tailscale' },
            to: { icon: 'PostgreSQL', name: 'proj‑ubuntu01', note: 'replica on‑prem' },
          },
          text: 'Set up logical replication from the AWS **RDS** primary to an on‑prem **PostgreSQL** replica over **Tailscale**.',
        },
        // cd.yml: Actions builds and pushes the :green image, Terraform starts
        // app_green, the job waits for the ALB health check on /health, and a
        // second Terraform apply sets active_color=green. Only Terraform
        // touches the listener, which is why it is the ringed tool.
        {
          area: 'Q',
          size: 'medium',
          even: true,
          label: 'Blue/green release',
          visual: {
            type: 'span',
            from: { icon: 'ALB', name: 'ALB', note: 'listener' },
            tools: [{ icon: 'GitHub Actions' }, { icon: 'Docker' }, { icon: 'Terraform', hot: true }],
            toggle: { options: ['blue', 'green'], active: 'green' },
            note: 'after /health returns 200',
            to: { icon: 'EC2', name: 'app_green', note: 'new instance' },
          },
          text: 'Built a manual **blue/green** release in **GitHub Actions**. The ALB switched to green only after the new version passed its health check.',
        },
        // scripts/deploy.sh records each degraded step and exits non-zero.
        {
          area: 'A',
          size: 'small',
          label: 'Deploy script',
          text: 'Wrote one **deploy script** for the start of each session. It exits with an error when any step fails.',
        },
        // _OBSERVER_PATHS in the audit middleware: the console polls four
        // endpoints every four seconds. Failed polls are still audited.
        {
          area: 'B',
          size: 'small',
          label: 'Audit trail',
          text: 'Removed the console’s successful polls from the **audit trail**. They added about 40 rows a minute.',
        },
        // 15 tests across test_auth.py and test_audit.py; ci.yml runs flake8
        // and pytest on a push to any branch.
        {
          area: 'C',
          size: 'small',
          label: 'Tests',
          text: 'Wrote **15 tests** for sign‑in and the audit trail. CI runs them with **flake8** on every push.',
        },
      ],
    },
    // What each Lock‑N‑Lock track did, what that setup lacked, and what this
    // build set out to practice. Facts are from the Lock‑N‑Lock source
    // (docker/app/main.py, docker/fail2ban, security/, .github/workflows,
    // docs/guides/c-cicd.md, monitoring/) and this repository. The blue/green
    // switch script was removed there to focus the pipeline on its four-layer
    // security gate; the blue and green target groups stayed in alb.tf.
    // Monitoring keeps "My Involvement": that track was a teammate's, and his
    // part was reading its alerts.
    context: {
      layout: 'compare',
      notes: [
        {
          label: 'Application',
          parts: [
            { caption: 'Team Approach', text: 'We ran the LockBank banking demo from one **FastAPI** file of about 300 lines, and a teammate on the app track owned that code.' },
            { caption: 'Existing Setup', text: 'The app covered sign‑in, a dashboard, and money transfers. It relied on one session cookie and used no user roles or file uploads.' },
            { caption: 'Practice Focus', text: 'The demo never needed more than a sign‑in page and a transfer form. I wanted to design a **FastAPI** app with separate routers for documents, meetings, and audit records.' },
          ],
        },
        {
          label: 'Security',
          parts: [
            { caption: 'Team Approach', text: 'Our security track tested the platform by attacking it with **Locust** scripts. The defenses they checked all lived outside the application code.' },
            { caption: 'Existing Setup', text: '**fail2ban** read the **Nginx** logs and banned an address after five failed sign‑ins in five minutes. Scanners and rate‑limit abuse earned their own bans.' },
            { caption: 'Practice Focus', text: '**fail2ban** only knew IP addresses from the **Nginx** log. It could ban an address, and it could never tell which account was behind a request. I wanted to design detection inside **FastAPI** that follows each signed‑in user through an audit log in **DynamoDB** and suspends an account after repeated access denials.' },
          ],
        },
        {
          label: 'CI/CD',
          parts: [
            { caption: 'Team Approach', text: 'Our pipeline ran **Terraform** plans, scanned the code and images with **Bandit** and **Trivy**, and pushed images to **Docker Hub**. An **OWASP ZAP** scan checked the site after each deploy.' },
            { caption: 'Existing Setup', text: 'The pipeline scanned code and images with **Bandit** and **Trivy** but ran no unit tests. The team removed the blue/green switch script to focus on scanning.' },
            { caption: 'Practice Focus', text: 'The pipeline never tested whether the app still worked after a change. I wanted to add **pytest** to CI and finish the blue/green switch that moves traffic only after a health check.' },
          ],
        },
        {
          label: 'Monitoring',
          parts: [
            { caption: 'Team Approach', text: 'A teammate set up **Prometheus** for metrics, **Loki** for logs, and a recovery service that restarted failed containers.' },
            { caption: 'My Involvement', text: 'Its alerts reached our team chat, and I read them like everyone else.' },
            { caption: 'Practice Focus', text: 'I never wrote the rules behind them, and I did not know how a rule decides when to fire. I wanted to write those rules myself and follow an alert from the metric to a message on my phone.' },
          ],
        },
      ],
    },
    // Approved 2026-11-04 from live samples (X3). Each figure is read from the
    // repository: security_groups.tf opens only the ALB to 0.0.0.0/0, the
    // bastion takes SSH from the operator /32, and rds.tf sets
    // publicly_accessible = false; the three roles and the admin-only demo
    // routes come from auth.py and demo_router.py; Console.jsx polls the
    // audit feed with POLL_MS = 4000; Docs.jsx, Meetings.jsx and Console.jsx
    // are the three apps; AuditMiddleware writes both apps' requests to the
    // DynamoDB audit table that audit_router reads. The captions are worded to
    // justify cleanly at 1440, so a rewording needs a fresh check there.
    metricsStyle: 'rows',
    metricsRows: ['1.6fr 1fr 1.25fr', '1.9fr 1.25fr'],
    metrics: [
      {
        accent: true,
        value: '1',
        label: 'Public Entry Point',
        detail: 'Only the load balancer accepts internet traffic. The bastion answers one operator address, and the database sits in a private subnet with no public endpoint.',
      },
      {
        value: '3',
        label: 'Access Roles',
        detail: 'Each account signs in as an admin, an editor, or a viewer. Only the admin can run the attack demos.',
      },
      {
        value: '4s',
        label: 'Live Attack Feed',
        detail: 'The security console pulls the newest audit events every four seconds. Each attack shows up while it is still running.',
      },
      {
        value: '3',
        label: 'Apps on One Platform',
        cards: [
          { title: 'SecureDocs', text: 'Encrypted, versioned documents' },
          { title: 'ShimonMeet', text: 'Meetings with join tokens' },
          { title: 'Security Console', text: 'Live attack feed and demos' },
        ],
      },
      {
        value: '1',
        label: 'Shared Audit Trail',
        detail: 'Requests from SecureDocs and ShimonMeet pass through one middleware that writes each of them to the same DynamoDB table.',
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
    // Checked against both repositories. Lock‑N‑Lock's recovery service
    // (monitoring/recovery/main.py) is FastAPI. lambda.tf wires the five
    // functions to S3, EventBridge, and SNS. dynamodb.tf indexes events by id
    // and time with a second index on type (its TTL attribute is configured
    // but the app never writes it, so no expiry is claimed). The NAT figure is
    // the Seoul list price, about $0.059 an hour; nat_instance.tf's comment
    // quotes the US price. Replication is left out: My Role already shows it.
    stackNotes: [
      {
        tool: 'Why Lambda and SNS?',
        icon: 'Lambda',
        text: 'On Lock‑N‑Lock, a **FastAPI** recovery service on our monitoring server restarted failed containers. In ShimonVault, I moved those reactions into **five** Lambda functions that S3 uploads, EventBridge schedules, and SNS alerts trigger. None of them depend on a server that must stay up.',
      },
      {
        tool: 'Why DynamoDB next to PostgreSQL?',
        icon: 'DynamoDB',
        text: 'Every request writes an audit row, and I wanted those writes kept away from the RDS database the app depends on. **DynamoDB** runs on demand with no capacity to plan. Each event is stored by its id and time, and a second index finds events by type.',
      },
      {
        tool: 'Why EventBridge?',
        icon: 'EventBridge',
        text: 'A meeting reminder must fire **ten minutes** before the meeting, even if the server that created it is gone by then. The app creates a one‑time EventBridge rule for each meeting, and the rule keeps working through a deploy or a crash.',
      },
      {
        tool: 'Why a NAT instance?',
        // EC2 rather than AWS: the point of the note is that the NAT *is* an
        // EC2 instance.
        icon: 'EC2',
        text: 'Lock‑N‑Lock used a NAT instance to keep costs down, and I kept that choice. A managed NAT gateway costs about **$43 a month** in Seoul even when no traffic passes through it. A `t3.micro` with one iptables rule does the same job.',
      },
      {
        tool: 'Why Cloudflare for DNS only?',
        icon: 'Cloudflare',
        text: 'My domain already lived on **Cloudflare**, and the ShimonVault record stays DNS only. Browsers connect straight to the ALB, which serves HTTPS with its own **ACM** certificate. The deploy script points the record at the new ALB every session.',
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
    // from app/middleware/audit_middleware.py and app/routers/auth_router.py,
    // and the job order in the third view from .github/workflows/cd.yml.
    architecture: [
      {
        tab: 'Platform',
        caption:
          'Hybrid Platform',
        alt: 'An AWS VPC in ap-northeast-2 on 10.0.0.0/16. Traffic arrives at shimonvault.junhanshin.com, a DNS-only Cloudflare record, so the load balancer terminates TLS itself with an ACM certificate. Public subnets across two availability zones hold that application load balancer, serving port 80 and port 443 with a health check on /health every 30 seconds, a bastion reachable only from the operator IP, and a NAT instance running iptables masquerade on a t3.micro. Private subnets hold the blue application instance, the green instance created only during a deploy, and an RDS PostgreSQL 16 instance on db.t3.micro with logical replication enabled. Below the VPC, a serverless band holds the S3 docs and reports buckets, five Lambda functions, the SNS topics with EventBridge, and three DynamoDB tables. Below AWS, a Tailscale mesh on 100.64.0.0/10 joins two on-premises hosts: proj-mgmt running Prometheus, Grafana, and Alertmanager, and proj-ubuntu01 running the PostgreSQL read replica on port 5433. RDS gets no public address. The replica subscribes through a socat relay on the blue instance, and the relay forwards port 5432 to RDS over Tailscale.',
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

            { id: 'blue', label: 'App EC2 blue', sub: 'Docker · uvicorn :8000 · socat :5432', glyph: 'server', x: 180, y: 360, w: 210, h: 52 },
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
            // The mesh reaches the private instance directly, so Prometheus
            // scrapes it with no jump host in the path.
            // Labelled below the AWS box: higher up, the label sat on top of
            // the "Managed services" zone label.
            { from: 'tailnet', to: 'blue', label: 'scrape :9100 · :8000', labelAt: [44, 606], labelAnchor: 'start', dash: true, dir: 'both', via: [[280, 616], [34, 616], [34, 360]] },
            { from: 'mgmt', to: 'tailnet', dash: true, dir: 'both' },
            // Replication rides the mesh. RDS is private, so the replica's
            // subscription reaches it through a socat relay on the blue
            // instance (app_user_data.sh.tpl), never on a direct line.
            { from: 'replica', to: 'tailnet', label: 'replication', labelAt: [730, 690], labelAnchor: 'start', dash: true, dir: 'both' },
          ],
          // One caption per line. The renderer splits anything over about
          // 148 characters into two balanced lines, which reads as an early
          // wrap, so every caption is written to fit one line.
          captions: [
            {
              x: 20,
              y: 808,
              tone: 'accent',
              text: 'The app security group accepts port 8000 from the ALB. The RDS security group accepts port 5432 from the app and the bastion.',
            },
            {
              x: 20,
              y: 830,
              text: 'Private instances reach the internet through a NAT instance. A t3.micro with one iptables rule replaces a managed NAT gateway.',
            },
            {
              x: 20,
              y: 852,
              text: 'Ports 9100, 2376, 2049, and 5432 on the app instance accept traffic from the Tailscale range only.',
            },
            {
              x: 20,
              y: 874,
              text: 'RDS gets no public address. The replica connects to a socat relay on the blue instance, and the relay forwards port 5432 to RDS.',
            },
          ],
        },
      },
      {
        tab: 'Attack to response',
        caption:
          'Attack Response Flow',
        alt: 'A four-band flow. Detect: every request except /health and /metrics passes through AuditMiddleware, which maps the status code to an event type and writes one row to the DynamoDB audit log. Decide: three counters, 5 login failures per address counted in the login route with an incident at 8, 5 access denials per account, and 10 downloads in 60 seconds per address. Respond: an incident record in the incidents table, the account suspended in the users table, and an incident report written to the reports bucket, all three converging on one notify_all call, with a dashed edge to the SNS security-alert topic marked as still to do, and the block_ip Lambda inserting a network ACL deny rule. Report: Slack and Telegram, and the AuditStream feed in the admin console polled every four seconds.',
        diagram: {
          width: 1000,
          height: 742,
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

            { id: 'chans', label: 'Slack + Telegram', sub: 'at each threshold', glyph: 'chat', x: 230, y: 612, w: 300, h: 48 },
            { id: 'feed', label: 'AuditStream feed', sub: 'admin console · polled every 4s', glyph: 'monitor', x: 660, y: 612, w: 340, h: 48 },
          ],
          edges: [
            { from: 'req', to: 'mw' },
            { from: 'mw', to: 'log' },
            // The login route counts its own failures. The middleware only logs
            // the 401, so the counter is fed from the request, not from it.
            { from: 'req', to: 'f401', label: 'login route', labelAt: [184, 202], labelAnchor: 'start' },
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
              text: 'Security groups only allow traffic. The automatic block uses a network ACL and adds a DENY rule at the lowest free number from 1 to 99.',
            },
            {
              x: 20,
              y: 714,
              text: 'The login route does not publish to SNS yet. block_ip is deployed and subscribed with no live trigger, and its alert still reports a block.',
            },
          ],
        },
      },
      {
        tab: 'Blue/green deploy',
        caption:
          'Blue/Green Deployment',
        // The address bar greys everything up to the last "/" as a folder, so
        // the bar takes a division slash (U+2215) that looks the same and does
        // not split the title.
        address: 'Blue\u2215Green Deployment',
        alt: 'Two workflows run from two different triggers. On the left, every push runs the CI workflow: flake8 over app/ at 120 columns, then pytest against a SQLite file with a 50 percent coverage floor, then a Docker build that verifies the image and is never pushed. On the right, a manual workflow_dispatch runs the CD workflow, which builds and pushes the green image for amd64 and arm64 tagged by commit sha, applies Terraform with deploy_green set to true while the listener stays on blue, polls the green target group health up to 40 times at 15 second intervals, applies again with active_color set to green to move the listener, retags the green image as blue, and posts the result to Slack. A dashed edge runs from the health poll directly to the Slack step for the case where green never becomes healthy.',
        diagram: {
          width: 1000,
          height: 722,
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
            { id: 'test', label: 'pytest', sub: 'SQLite file · 50% floor', glyph: 'shield', x: 250, y: 242, w: 380, h: 44 },
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
              text: 'A Terraform variable moves the listener to green. A CLI switch would drift, and the next apply would send traffic back to blue.',
            },
            {
              x: 20,
              y: 672,
              text: 'The deploy-production group runs one deploy at a time and never cancels one in progress. Blue serves traffic until green is healthy.',
            },
            {
              x: 20,
              y: 694,
              text: 'CD runs only on manual dispatch. The earlier push trigger rebuilt AWS after every commit. One of those rebuilds followed a terraform destroy.',
            },
          ],
        },
      },
    ],
    // The same four weeks as Lock-N-Lock, the period this ran alongside. Each
    // week holds what the public repository's weekly commits added: the network
    // and schema first, then the services and the app, then detection inside
    // the app, then the demo. The commits landed between Jun 1 and Jul 4, so the
    // ranges follow the project period rather than the commit dates. The last
    // week names the IP block as the next step: the login route never publishes
    // to SNS (auth_router.py still carries the TODO), so block_ip never runs.
    implementation: {
      months: ['2026-05', '2026-06'],
      span: { from: '2026-05-27', to: '2026-06-24' },
      phases: [
        {
          id: 'foundation',
          title: 'Infrastructure Layer',
          range: 'May 27 – Jun 2',
          from: '2026-05-27',
          to: '2026-06-02',
          text: 'I aimed to establish a network foundation before any application code existed. Working in **Terraform**, I placed the app servers and the database in private subnets and limited SSH to a single bastion host. A NAT instance replaced the managed gateway to keep the cost of a practice build low. I also designed the **PostgreSQL** schema with random UUID keys to keep record IDs from being guessed.',
        },
        {
          id: 'modules',
          title: 'Application Layer',
          range: 'Jun 3 – Jun 9',
          from: '2026-06-03',
          to: '2026-06-09',
          text: 'This week I worked toward the first complete version of the platform. I prepared blue and green target groups behind the load balancer to support releases without downtime. Inside the **FastAPI** app I introduced role‑based access and an audit middleware that logged every request to **DynamoDB**. Five **Lambda** functions then took over file checks and meeting reminders. Connecting **Ansible** and **GitHub Actions** to this stack required many rounds of fixes.',
        },
        {
          id: 'response',
          title: 'Detection & Alert Rules',
          range: 'Jun 10 – Jun 17',
          from: '2026-06-10',
          to: '2026-06-17',
          text: 'I then brought detection into the application to see the account behind each request. The audit middleware began suspending an account after five denied requests. I also adjusted the access checks to answer viewers with a 403 response that never revealed if a document existed. Four **Prometheus** alert rules and a reworked **PostgreSQL** replication setup completed the work of this week.',
        },
        {
          id: 'pipeline',
          title: 'Live Attack Demo',
          range: 'Jun 18 – Jun 24',
          from: '2026-06-18',
          to: '2026-06-24',
          text: 'In the final week I focused on making each defense visible during the demo. I was able to enforce a **slowapi** download limit and turn the first burst from an address into an S3 incident report and a chat alert. The **React** admin console let me launch each attack against the live system with one button. The login alerts and the account suspension worked as planned. The automatic IP block for repeat attackers is the next step on the roadmap.',
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
        'These clips come from my screen recordings of the live platform. Each four‑window clip follows one button press through the admin console, Grafana, Telegram, and Slack.',
      stillsNote:
        'These full‑resolution captures come from a separate session the following day, and their counters do not match the clips above. Click any image to open it at full size.',
      scenarios: [
        {
          id: 'normal',
          tab: 'Normal operation',
          label: 'Scenario 1: Signing in and using the platform',
          lead:
            'I start by using the platform the way a normal admin would. I sign in, check the security console, and upload a file to **SecureDocs**. Anyone who downloads that file gets a private link that **stops working after 15 minutes**.',
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
            state: 'Uploaded Documents',
            alt: 'The SecureDocs page: a browse and upload row above a Documents card listing act1.txt at 55 bytes and contract_q3.txt at 56 bytes, each text/plain, dated 9 September 2026, at version 1, with a Download and a delete control, under a line reading that downloads use 15-minute pre-signed URLs and every action is audited',
          },
          after: {
            src: '/projects/shimon-vault/demo-02-meetings.png',
            state: 'Scheduled Meetings',
            alt: 'The ShimonMeet page: a new-meeting form with title, description, start and end times and participant ids, above three scheduled meetings named Q3 Security Review, Infra Sync Blue/Green and Vendor Access Renewal, each with a Join control, a Token control and a cancel control',
          },
        },
        {
          id: 'credential-stuffing',
          tab: 'Credential stuffing',
          label: 'Scenario 2: Credential stuffing against /auth/login',
          lead:
            'Here, I play an attacker who tries **30 passwords in a row** against the login page from one address. After five wrong passwords, the platform warns Slack and Telegram, and after eight, it records a security incident. Once the address passes **10 tries in a minute**, the remaining attempts are turned away before they reach the password check.',
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
            'The two images come from different runs of the same act. The Grafana window closes roughly fifteen minutes before the feed capture, and each one shows its own burst.',
          before: {
            src: '/projects/shimon-vault/demo-03-stuffing-grafana.png',
            state: 'Login Failures in Grafana',
            alt: 'The ShimonVault AuditStream dashboard in Grafana over the last 30 minutes: login failures 32.3, access denied 0, rate limited 4xx 32.3, 5xx server errors 0 and 341 total requests, above a login-failure-rate panel spiking to just over 40 a minute, a request-rate-by-endpoint panel whose legend includes /demo/credential-stuffing and /auth/login, and an HTTP status distribution where a 4xx block rises out of an otherwise flat 2xx line',
          },
          after: {
            src: '/projects/shimon-vault/demo-04-stuffing-feed.png',
            state: 'Blocked Attempts in the Feed',
            alt: 'The AuditStream feed filled with rate limit hit rows from 203.0.113.42 against /auth/login, all stamped 12:31:27 PM, under the successful sign-ins that preceded them',
          },
        },
        {
          id: 'access-control',
          tab: 'Broken access control',
          label: 'Scenario 3: Forbidden reads and account suspension',
          lead:
            'Next, I sign in as a **viewer** and try six times to open a document that a viewer is not allowed to see. Each attempt is refused, and on the **fifth refusal, the platform suspends the account** by itself.',
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
            state: 'Refused Request Beside a Scanner',
            alt: 'The AuditStream feed showing a doc access denied row from 203.0.113.42 at 12:32:46, and directly above it an unrelated address, 216.180.246.224, walking a list of login paths including /cgi-bin/login.cgi, /+CSCOE+/logon.html, /manage/account/login and /admin/index.html',
          },
          after: {
            src: '/projects/shimon-vault/demo-06-audit-scanner.png',
            state: 'Scanners Between Demos',
            alt: 'The AuditStream feed with no demo running: an address at 136.118.157.110 requesting /llm_config.json, /config/anthropic.json, /openai.json, /.codex/config.toml, /.claude/mcp.json, /.cursor/settings.json and /.windsurf/mcp.json in the same second, every row labelled login success by the middleware path heuristic',
          },
        },
        {
          id: 'exfiltration',
          tab: 'Bulk exfiltration',
          label: 'Scenario 4: Download rate limiting and incident reporting',
          lead:
            'This time, I sign in as an **editor** and download the same document 15 times in a row to imitate someone stealing files in bulk. The platform allows **10 downloads a minute**, blocks the rest, and files one incident report in S3 with a single alert.',
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
            state: 'Downloads Stopped at Ten',
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
            'The scenarios above show the platform watching itself. For this half, I placed the monitoring tools on `proj-mgmt`, **my own on‑premises machine**, and connected them to AWS through a private Tailscale network.',
          stillsNote: 'Both images come from the September 9 session with the rest of the screenshots.',
          before: {
            src: '/projects/shimon-vault/demo-08-prometheus-targets.png',
            state: 'Data Sources on Both Machines',
            alt: 'The Prometheus target-health page with four scrape pools, each reading 1 of 1 up: ec2-nodes and fastapi-app both scraping 100.85.130.38, the app instance reached over Tailscale and labelled shimonvault-app-blue, and onprem-cadvisor and onprem-node scraping containers on onprem-proj-mgmt, the last of them carrying an environment on-prem label',
          },
          after: {
            src: '/projects/shimon-vault/demo-09-grafana-infra.png',
            state: 'One Chart for Both Machines',
            alt: 'The ShimonVault infra health dashboard in Grafana over the last hour: CPU usage 2.29 percent, memory usage 61.0 percent, 8 running containers and 0.222 requests a second, above a CPU Over Time panel plotting two series on one axis, onprem-proj-mgmt and shimonvault-app-blue, and an HTTP request rate panel split into 2xx, 4xx and 5xx',
          },
        },
        {
          id: 'alerting',
          tab: 'Alert lifecycle',
          label: 'Scenario 6: NodeDown firing and resolving',
          lead:
            'I wrote four alert rules for the failures that matter most, and the screenshots follow one of them. A server went silent, an alert reached Slack and Telegram a minute later, and a **recovery message arrived on the same two channels** when it came back.',
          stillsNote:
            'These two come from different sittings. The rule list is from the September 9 session, and the Slack channel is from the evening of the clips, twenty minutes after the last one.',
          before: {
            src: '/projects/shimon-vault/demo-10-prometheus-rules.png',
            state: 'Loaded Alert Rules',
            alt: 'The Prometheus alerts page showing a single rule group named shimonvault, loaded from /etc/prometheus/rules/shimonvault.yml and badged INACTIVE with a count of 4, listing HighCPU, HighMemory, NodeDown and FastAPIDown',
          },
          after: {
            src: '/projects/shimon-vault/demo-11-infra-alert.png',
            state: 'Alert and Recovery in Slack',
            alt: 'The shimonvault-alerts Slack channel: a red [ALERT] EC2 node down on shimonvault-app-blue posted at 7:53 PM, reading that the node exporter has been unreachable for one minute at critical severity, then a green [RESOLVED] of the same alert at 8:03 PM, and under both a TEST NOTIFICATION triggered by admin reading that if you can read this in Slack and Telegram, alerting works',
          },
        },
        {
          id: 'deploy',
          tab: 'Deploy',
          label: 'Scenario 7: One-command provisioning and blue/green deploy',
          lead:
            'I wrote one script, `scripts/deploy.sh`, that builds the whole platform from nothing and checks every service before it finishes. I ship later updates with a GitHub workflow that runs only when I start it by hand.',
          // These two stills are not from the separate session the section
          // note describes. The outputs shot is a frame of this very clip, and
          // the CD run is a GitHub page, so the section's caveat would be wrong
          // on both of them.
          stillsNote:
            'The first image is a full‑resolution frame of the run above. The second is the GitHub Actions run for a later deploy.',
          clipNote:
            'This is the terminal panel from one full `scripts/deploy.sh` run that took 6 minutes 32 seconds. It stays 1440 pixels wide to keep the output readable.',
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
            state: 'Final Deploy Output',
            alt: 'The tail of a deploy.sh run: Terraform outputs listing the ACM certificate ARN, the ALB DNS name and listener ARN, the blue and green target group ARNs, app_fqdn as shimonvault.junhanshin.com, app_green_private_ip as not deployed, the bastion IP, the Lambda and SNS ARNs and the RDS endpoint, followed by a line reading deployment finished with no degraded steps',
          },
          after: {
            src: '/projects/shimon-vault/demo-13-cd-run.png',
            state: 'GitHub Release Run',
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
│   │   └── demo_router.py        4 attack simulations and a notification test
│   ├── services/                 S3, DynamoDB, EventBridge, Prometheus, notify
│   ├── middleware/
│   │   └── audit_middleware.py   logs every request, counts, suspends, alerts
│   └── Dockerfile                3 stages: Vite build, pip build, slim runtime
├── frontend/                     React SPA, built into the image
│   └── src/                      Login, Docs, Meetings, Console, api.js
├── terraform/                    27 files, 90 resource blocks
│   ├── vpc.tf                    VPC, 3 subnets, IGW, route tables
│   ├── alb.tf                    ALB, second public subnet, target groups, 80 and 443
│   ├── acm.tf                    the cert the 443 listener serves, DNS-validated
│   ├── app_ec2_blue.tf           the live instance
│   ├── app_ec2_green.tf          created only when deploy_green = true
│   ├── asg.tf                    launch template, scale policies, CPU alarms
│   ├── rds.tf                    PostgreSQL 16, logical replication parameters
│   ├── s3.tf                     docs versioned, reports expire in 30 days
│   ├── dynamodb.tf               audit-log, incidents, meetings
│   ├── lambda.tf                 5 functions, zipped at apply time
│   ├── sns.tf                    security-alert, infra-alert, meeting-reminders
│   ├── eventbridge.tf            the static warm-up rule
│   ├── iam.tf                    2 roles, 4 inline policies for 5 Lambdas
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
│   ├── prometheus/targets/       file_sd JSON, rewritten by fetch_docker_certs.sh
│   ├── alertmanager/             Slack receiver plus the Telegram webhook
│   ├── grafana/dashboards/       infra_health, auditstream
│   └── telegram_relay/           the bridge Alertmanager posts to
├── ansible/
│   ├── inventory.aws_ec2.yml     dynamic inventory, grouped by the Role tag
│   ├── playbooks/                setup_app, setup_monitoring, verify_stack
│   └── roles/                    docker_app, monitoring_stack, cloudwatch_agent
├── scripts/
│   ├── deploy.sh                 apply to healthy in one command
│   ├── destroy.sh                teardown, then 7 leftover checks
│   ├── generate_env.sh           app/.env from Terraform outputs
│   ├── setup_replica.sh          RDS to on-premises logical replication
│   ├── fetch_docker_certs.sh     the Docker TLS certs Portainer connects with
│   ├── update_ssh_config.sh      rewrites ~/.ssh/config for the new bastion
│   ├── package_lambdas.sh        zips the five functions with dependencies
│   └── simulate_*.sh|.py         four of the five demos, from a terminal
├── db/                           schema.sql, schema_from_rds.sql, seed.sql
├── tests/                        pytest on a SQLite file, no AWS needed
└── .github/workflows/            ci.yml and cd.yml
`,
    // Eight decisions, each checked against the repository: two Lambdas subscribe
    // to SNS (block_ip, log_incident) and three run on S3 or EventBridge; the console
    // polls four endpoints every 4s; the demo is four attacks plus a test
    // notification. Each Why opens with what the decision taught.
    decisions: [
      {
        keyword: 'Response in Lambda',
        title: 'Lambda functions handle each automated response to keep it off the servers it protects.',
        glyph: 'pipeline',
        chose: 'Five **Lambda** functions on events',
        over: 'A recovery service on a server',
        why: 'This decision gave me practice with event‑driven design on AWS. S3 and EventBridge trigger three functions directly, and two more subscribe to SNS alert topics. Debugging taught me to rely on **CloudWatch Logs** because a Lambda function offers no shell.',
      },
      {
        keyword: 'Network ACL block',
        title: 'A network ACL holds the automatic IP block because it can deny an address.',
        glyph: 'route',
        chose: 'A **DENY** rule in the network ACL',
        over: 'A deny rule in a security group',
        why: 'Writing this handler taught me how security groups and network ACLs differ. A security group only allows traffic. A network ACL evaluates numbered rules in order and can deny an address.',
      },
      {
        keyword: 'One audit middleware',
        title: 'A single middleware logs every request to keep the audit trail consistent.',
        glyph: 'channels',
        chose: 'One **AuditMiddleware** for all routes',
        over: 'A logging call in each route',
        why: 'This choice taught me to put shared logic in one place. The middleware records every request and turns 401, 403, and 429 responses into security events. I later excluded successful console polls because they flooded the feed every four seconds.',
      },
      {
        keyword: 'Health before database',
        title: 'The health check stays green while the database finishes starting up.',
        glyph: 'process',
        chose: '`/health` returns 200 at startup',
        over: 'Waiting for the database first',
        why: 'This problem taught me how startup order affects a deploy. The load balancer gave up on each new instance before RDS answered. A background retry and a `db` field in the health response solved the problem without hiding the real state.',
      },
      {
        keyword: 'Terraform traffic switch',
        title: 'Terraform owns the blue/green switch to keep the listener in state.',
        glyph: 'branch',
        chose: 'The `active_color` variable',
        over: 'An `aws elbv2` CLI call',
        why: 'This decision taught me to treat drift as a real risk. A CLI change to the listener would vanish on the next apply. Moving traffic through a Terraform variable keeps the state and the live setup in agreement.',
      },
      {
        keyword: 'Manual deploys',
        title: 'Releases start by hand to keep every AWS change deliberate.',
        glyph: 'note',
        chose: '`workflow_dispatch` for CD',
        over: 'A deploy on every push to `main`',
        why: 'This change taught me to separate cheap checks from costly actions. Linting and tests still run on every push. A deploy now starts by hand after one commit rebuilt AWS right after a teardown.',
      },
      {
        keyword: 'Demo inside the app',
        title: 'The attack demos live inside the app to prove the audit trail is real.',
        glyph: 'inject',
        chose: 'Admin‑only `/demo` routes',
        over: 'Attack scripts from a laptop',
        why: 'Building the demos into the app taught me to treat a test feature as an attack surface. Every demo route requires the admin role, and one setting turns them all off. The shell versions in `scripts/` remain for runs from a terminal when the app itself is down.',
      },
      {
        keyword: 'Magic‑byte upload check',
        title: 'A Lambda function checks the content of each upload instead of its name.',
        glyph: 'depth',
        chose: 'First **512 bytes** read by a Lambda',
        over: 'Trusting the file extension',
        why: 'This check taught me that a file name proves nothing about its content. The Lambda reads the first 512 bytes of each upload and deletes any file with an executable or archive signature.',
      },
    ],
    links: {
      github: 'https://github.com/ShinJunhan/shimon-vault',
      terraform: 'https://github.com/ShinJunhan/shimon-vault/tree/main/terraform',
      presentation: null,
    },
    reflection: {
      learned: [
        'ShimonVault gave me hands-on practice with tools I had mostly watched others demonstrate. The lessons that stuck came from the moments when something broke and had to be traced back to its cause.',
        "One of the first skills I practiced was **blue/green deployment**. The idea is to keep two identical copies of the app running. Visitors use one copy while the new version goes onto the other, and traffic moves only after the new version is ready. In my first version, two different tools could move that traffic. A small script changed the setting by hand, and Terraform kept its own record of the same setting. Each time Terraform ran, it restored its record and undid the script's change. After tracing the problem to that overlap, I deleted the script and let Terraform make every switch. Releases became predictable, and going back to the old version takes one command.",
        '**Application security** was where I had the least practice. The audit trail saves every request as an event in DynamoDB and shows the newest ones in a live feed. At first, the feed pulled a batch of events and sorted that batch by time. DynamoDB returns an arbitrary batch, and an attack in progress could be missing from it. An index sorted by time now gives the feed the newest events of each type. The admin console caused a second problem by checking for updates every four seconds. Each check was saved as an event, and about 40 rows a minute buried the real attacks. Successful checks are skipped now, and failed ones are still recorded.',
        'Some of the hardest bugs were in my own scripts. `deploy.sh` finished with a success message on runs where the app was down. The monitoring setup script printed the right Tailscale address on screen and wrote a blank one into the Prometheus settings. Every Grafana dashboard went empty while the script reported success. Both scripts now record any step that fails and end with an error when that list is not empty.',
        '**Hybrid networking** carried over from the previous project and grew much larger here. Tailscale links AWS to the on-prem server for both monitoring and database replication. At one point, the firewall rule for the replication link vanished on every Terraform run. Terraform treated the rules written inside the security group as the full list and removed the one defined separately. Moving all the rules into one block fixed it, and a comment now explains why for the next reader.',
        'Each of these problems ended with a fix and a clear reason behind it. This individual project deepened my understanding of blue/green releases and application security. Hybrid networking is where my confidence grew the most.',
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
