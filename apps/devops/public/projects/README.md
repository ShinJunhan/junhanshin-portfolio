# Project assets

Screenshots and demo videos, one folder per project slug:

```
public/projects/<slug>/screenshot-*.png
public/projects/<slug>/demo.mp4
```

Anything under `public/` is served from the site root, so the path in
`src/data/projects.js` is `/projects/<slug>/screenshot-1.png` — no `public`
segment.

Architecture diagrams are **not** files any more; see below.

## Architecture diagrams do not live here

**Draw a diagram in the data file instead of exporting one.** A project's
`architecture` entry carries a `diagram` — zones, nodes and edges — which
`src/components/sections/ArchDiagram.jsx` renders in the page's own type and
palette and the project's accent:

```js
architecture: [
  {
    tab: 'Overall architecture',
    caption: 'Line under the drawing',
    alt: 'Describe what it shows, not that it is a diagram',
    diagram: {
      width: 1000,
      height: 560,
      zones: [{ id: 'vpc', label: 'VPC', x: 176, y: 120, w: 640, h: 390, tone: 'region' }],
      nodes: [{ id: 'alb', label: 'ALB ingress', glyph: 'balancer', x: 490, y: 185 }],
      edges: [{ from: 'igw', to: 'alb', label: 'HTTPS' }],
    },
  },
]
```

The draw.io exports this replaced were raster images inside an SVG wrapper: up
to 1.7MB each, blurry at page width, permanently light-mode on a page that has
a dark theme, invisible to search and to a screen reader, and impossible to
edit without leaving the repo. Read the header of `ArchDiagram.jsx` for the
full vocabulary and `archGlyphs.jsx` for the marks.

An image is still supported for a view that genuinely is one — a photo of a
whiteboard, say — and a project may mix the two:

```js
{ src: '/projects/<slug>/architecture-01.jpg', alt: '…', tab: '…', caption: '…' }
```

Leave `architecture: null` and the slot shows its "not added yet" state.

### hailcast: both forms, one tab each

`hailcast` keeps **both** forms of every architecture view, paired under a
single tab with a Clean / Detailed toggle in the panel's address bar. Clean is
the drawn diagram; Detailed is the original draw.io export of the same view.
They are two levels of detail on one subject, not two diagrams, so they share
one tab and one name.

```
public/projects/hailcast/architecture-01-overall.svg   … -08-pod-architecture.svg
```

The pairing lives on the architecture entry itself:

```js
{
  tab: 'Overall architecture',
  caption: '…',            // the address bar in Clean
  alt: '…',
  diagram: { … },          // Clean
  detailed: {              // Detailed
    src: '/projects/hailcast/architecture-01-overall.svg',
    caption: '…',          // the address bar in Detailed
    alt: '…',
  },
}
```

An entry with only `diagram`, or only `src`, renders exactly as before and
grows no toggle — the pairing is opt-in per view.

Four more files sit in the same folder and are not diagrams — three Grafana
captures from the demo and the chart the cost section is built on, all lifted
from the team's final-report deck:

```
public/projects/hailcast/demo-01-predictive-scaling.png
                         demo-02-keda-queue.png
                         demo-03-worker-runtime.png
                         pod-hour-savings.png
```

The dashboards are in Korean and stay that way. Retitling someone else's
console inside a screenshot would turn evidence into a mock-up of evidence, so
the reading each panel shows is named in the scenario's `state` line and spelled
out again in its `alt`, and the capture itself is left untouched.

**Only the selected form is mounted.** `ArchitectureSection` renders one branch
or the other rather than hiding one with CSS, so a reader who never leaves
Clean never downloads the export — 567KB for the overall view alone. The
toggle's state is per tab, so switching one view to Detailed does not switch
the rest, and a tab remembers where you left it.

The drawn views were corrected against these exports — the single 2a NAT
gateway, the VPC gateway endpoint, the HPA that KEDA creates, the ClusterIP
service layer and the GitOps approval gates all came from them.

How the two compare, measured rather than assumed:

| | Clean (drawn) | Detailed (export) |
|---|---|---|
| Bytes on the wire | 0 (inline SVG) | 1.7MB across the eight, fetched on demand |
| Follows the page theme | yes | yes — `light-dark()` works |
| Readable at column width | yes | no, the dense ones need full size |
| Searchable / screen-reader text | yes | no (`alt` only) |
| Editable in-repo | yes | no |

The earlier claim in this file that exports are "permanently light-mode" was
true of the **raster** exports that were dropped; it is not true of these.

Exported images are held to the panel by `.figure__frame img`, which is
`width: 100%; height: auto`. These files are up to 1802px across and would push
the page sideways at their intrinsic size, so that rule is load-bearing — don't
give the frame an intrinsic width.

### lock-n-lock: settled

`lock-n-lock` is no longer part of that comparison. Its drawn view stays — now
tabbed **Overall architecture**, because the drawing is the whole system and
security is the lens on it, not the subset it draws — and the single
1.1MB stacked-panel export that sat beside it is gone. In its place are five
authored diagrams, one flow each:

```
public/projects/lock-n-lock/architecture-01-system-overview.svg
                            architecture-02-alerting-automation-flow.svg
                            architecture-03-user-request-flow.svg
                            architecture-04-operations-backup-flow.svg
                            architecture-05-blue-green-deployment.svg
```

These are ~2564px screenshots in an SVG wrapper, so they carry the usual export
costs — no searchable text, not editable in-repo — but ~600KB for all five
against 1.1MB for the one they replace, and one diagram per flow instead of
five panels sharing a canvas. They are kept as files because a flow drawn by
the team is theirs, not something to paraphrase into nodes and edges.

They are declared from a table in `src/data/projects.js`, not as five entries:
the folder is named once, and each row's title is the string the SVG already
carries in its own `<title>`, which becomes the tab, the address bar line and
the `alt` together. An `<img>` never exposes the title inside its SVG, so the
`alt` is the only route a screen reader has to that text.

### shimon-vault: the folder is named after the product, not the slug

`individual-project-two` is **ShimonVault**, and its assets sit under
`public/projects/shimon-vault/` rather than under the slug. The slug is a
position in the individual series and says nothing to anyone reading a URL or
an `ls`; the repository, the domain and the product all say `shimon-vault`.
`echochallengers` already broke the slug rule for the same kind of reason.

That folder has no architecture files, because every ShimonVault view is drawn
from data in `src/data/projects.js`. What it holds is five clips with their
posters and thirteen stills:

```
public/projects/shimon-vault/clip-01-console.mp4        + .jpg poster
                             clip-02-credential-stuffing.mp4
                             clip-03-access-control.mp4
                             clip-04-exfiltration.mp4
                             clip-05-provision.mp4
                             demo-01-securedocs.png … demo-13-cd-run.png
```

**`demo-NN` numbering follows tab order**, so inserting a tab renumbers the
files after it. That is cheap while the folder is young and it keeps an `ls`
readable against the page, but it does mean the numbers are not stable
identifiers: change the order and change the filenames with it.

Seven tabs and five clips, because **the two monitoring tabs have no clip**.
Neither recording covers the Prometheus side, so their four stills are the only
evidence on the page for the four Prometheus rules the metrics tile counts and
for the Grafana dashboards the stack list names. Those tabs exist for the stills
rather than the other way round, and `MediaSection` keeps the Screenshots
heading on them anyway, since the other five tabs have clips.

They are two tabs rather than one because a scenario carries a `before` and an
`after` and nothing else, and these are two claims: **the monitoring stack**
shows Prometheus scraping both sides and Grafana plotting both machines on one
axis, while **an alert, firing and clearing** shows the four rules inactive and
then `NodeDown` going off and resolving itself in Slack. Four stills, two
statements, so two tabs.

Clips 1 to 4 come from one screen recording of the live environment, 4660kbps
at 3024x1964, cropped only to drop the macOS menu bar and scaled to 1280. Four
of them show four browser windows at once — the console, Grafana, Telegram and
Slack — and they are deliberately **not** cropped to a single pane. A crop would
sharpen the console and throw away the point, which is that one button press
lands in all four places within seconds. The stills carry the detail instead.

`clip-05-provision.mp4` is a different source: a terminal recording at 3248x2122
and 1747kbps, cropped to the terminal panel and kept at **1440** rather than
1280, because monospace output at 0.6x is where a downscale starts to cost you
characters. It runs at 25x, which is the only way 6m32s of `deploy.sh` fits in a
loop, and the `speed` badge says so.

Its poster is taken from the middle of the run rather than from the first frame:
the first frame is an empty prompt, and the poster is the whole of what a reader
with reduced motion sees.

The stills are a different session from the clips, a day later, so their
counters do not line up. `stillsNote` says that rather than leaving a reader to
notice it.

### project1-self-build: the folder is named after the product too

`individual-project-one` is **Project1-Self-Build**, and its assets sit under
`public/projects/project1-self-build/`, for the same reason `shimon-vault` and
`echochallengers` do. Two clips with their posters and thirteen stills:

```
public/projects/project1-self-build/clip-01-cpu-alert.mp4   + .jpg poster
                                    clip-02-recovery.mp4    + .jpg poster
                                    demo-01-onprem-targets.png … demo-13-aws-selfheal-board.png
```

Seven tabs and two clips, because **five tabs have no clip and none of them is
missing one**. Four of those cover the AWS side and the Terraform run, neither
of which was ever recorded. The other one is on-premises and is the interesting
case, `Nginx self-heal`: the recording does run `chaos/inject.sh nginx1`, at
2:48, but the pane holding the `watch systemctl is-active nginx` loop is never
on screen, so there is no footage anywhere of the unit coming back. Its still is
a purpose-made capture that samples the unit state every half second and prints
the PID either side of the kill, which is better evidence than the footage would
have been: a new main PID is a restart, where a green `active` line is only a
claim.

An eighth tab was cut after it shipped, and the two stills with it,
`demo-14-health-200-db-down.png` and `demo-15-alerts-inactive-db-down.png`. It
showed `/health` returning 200 with PostgreSQL stopped, which is a real defect
in the app and was put on the page as an honest one. On a page of seven
recoveries that work, a tab whose entire content is a thing that does not reads
as a weakness rather than as candour, whatever the intent. **The finding is not
dropped**, only moved: the reflection at the foot of the page still owns it,
which is where a limitation belongs and where a reader expects to find one.

**Both clips are kept at 1440 rather than 1280.** The source is 3016x1894 at
roughly 6.4Mbps, and the frame is four panes at once — Prometheus, Grafana,
Slack and a terminal — so the whole point is that one failure lands in all four
within seconds. Cropping to a pane would throw that away, and 1280 starts
costing characters in the terminal pane. At an 880px column that lands at
0.61x, against the 0.50x these same files rendered at while the frame was
still pinned to one ratio. The stills carry the rest of the detail, as always.

**Both clips are cut around the presenter, not just around the failure.** The
recording is 10m41s, and roughly three of those minutes are the run sheet
full-screen, Mission Control, or the Alertmanager config page. Two of those
stretches sat inside the first pair of cuts. Worse, at 8:41.5 a link in Slack
opened a tab showing Safari's **This Connection Is Not Private** interstitial,
for 1.9 seconds, in the middle of the recovery scenario.

A clip is evidence of the system, so anything in frame that is evidence of the
demo instead has to go. The way to find all of it is to scan the recording a
quadrant at a time rather than to watch it:

```bash
# where does a quadrant stop looking like itself? (the Grafana pane is dark;
# when it goes bright and flat, something is covering it)
ffmpeg -i demo.mov -vf "fps=2,crop=1450:850:1550:60,scale=64:40" \
  -pix_fmt gray -f rawvideo - | # then mean and stddev per frame
```

High mean with low standard deviation is a document, a warning page or an empty
desktop. Run it on each quadrant, take the union of the windows it finds, and
cut outside them. Re-run it on the **rendered** clip afterwards: the first
recovery cut lost the interstitial from the source timings and still carried a
single frame of it, because the trim boundary landed one frame late.

`clip-02-recovery.mp4` is therefore two trims concatenated, with 8:40.9 to
8:43.8 lifted out:

```bash
ffmpeg -i demo.mov -an -filter_complex \
  "[0:v]trim=start=498:end=520.9,setpts=PTS-STARTPTS[a];\
   [0:v]trim=start=523.8:end=544,setpts=PTS-STARTPTS[b];\
   [a][b]concat=n=2:v=1:a=0[c];\
   [c]scale=1440:904,setpts=PTS/3.05[out]" -map "[out]" -r 30 \
  -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart \
  clip-02-recovery.mp4
```

The join is invisible because both sides show the same Slack thread at the same
scroll position and the same alert board. **Pick the join that way.** A splice
between two states that differ reads as a jump and undermines the clip it was
meant to save.

The stills come from several runs across two days and their clocks do not line
up, which `stillsNote` says at the section level. The nginx capture is a day
later than everything else and carries a visible date, so that tab overrides the
note rather than relying on the general one.

## Presentation slides

A deck is exported once, as one WebP per slide, into its own folder beside the
project's screenshots:

```
public/projects/<slug>/slides/slide-01.webp
```

What the deck *is* — its sections, which slide starts each one, and the speaker
notes — lives with the project's other written content rather than here:

```
src/content/<slug>/slides.json
```

That file's `imageBase` is the path above, so the images and the manifest can
be moved independently and only one line changes. Dropping the two into the
tree is the whole wiring step: `src/data/slides.js` finds the manifest and the
Resources panel grows a "Project Presentation Slides" tab. No entry in
`src/data/projects.js` is involved, and a project with no `slides.json` simply
has no such tab.

The tab is view-only by design — the slides are shown, never offered as a
download — so there is no PDF or PPTX in `public/` to go with them.

## Screenshots and demo video

```js
media: {
  // Said once for the whole project, because the answer is the same for every
  // scenario in it. A scenario may override either.
  clipNote: "Cut from the team's demo recording. Silent, and it loops.",
  stillsNote: 'Captured at 2670x1279, sharper than the loop above. …',
  // One tab per scenario, read straight down: `lead`, then the Demo register,
  // then the Screenshots register. There is no control switching between them.
  scenarios: [
    {
      id: 'scenario-1',
      tab: 'Nginx down',                 // the tab
      label: 'Scenario 1 — Nginx down',  // the address-bar line
      // The explanation, above the clip. RichText: `code` and **accent bold**.
      lead: 'Nginx is stopped on **web1** … verified in **5.69s**.',
      clip: {
        src: '/projects/<slug>/clip-01-nginx.mp4',
        poster: '/projects/<slug>/clip-01-nginx.jpg',
        width: 1280,   // the file's own dimensions: the frame takes its ratio
        height: 608,   // from these, and reserves the height before it loads
        speed: '3x',   // renders beside the Demo heading; omit for real time
        alt: '…',
      },
      before: { src: '/projects/<slug>/s1-before.png', alt: '…' },
      after:  { src: '/projects/<slug>/s1-after.png',  alt: '…' },
    },
  ],
  // Either a file served from public/ …
  video: { kind: 'file', src: '/projects/hailcast/demo.mp4', poster: '…', caption: '…' },
  // … or an embed URL from a host:
  // video: { kind: 'embed', src: 'https://www.youtube.com/embed/…', title: '…', caption: '…' },
},
```

A scenario carrying both a clip and stills renders them as two labelled
registers, **Demo** and **Screenshots**, built from the same component so they
stay identical. Labelling only one of them is worse than labelling neither: it
makes the unnamed half read as preamble to the part that has a name.

**The headings belong to the section, not the scenario.** Once any scenario has
a clip, every scenario uses them, including one with nothing to play. `hailcast`
has two such tabs and they keep their Screenshots heading, so the labels do not
appear and disappear as a reader moves along the strip. Only a project with no
clips at all renders stills bare, as they did before clips existed.

**A tab with no clip still gets a `lead`.** Two hailcast scenarios have no
footage in existence — the pod-hour figure is a simulation, and the closed-loop
board shown is the rebuilt one, which is in the report deck and in neither
recording. Both explain themselves in prose exactly as the clip-bearing tabs
do, so no tab is silent.

**Per-scenario notes override the section's.** `hailcast` draws on two
recordings, so its media-level `clipNote` names the first presentation and the
two refinement scenarios set their own. Its retraining scenario also overrides
`stillsNote`, because its stills are video frames rather than deck captures and
should not pass as the latter.

The "No demo video added yet" slot is suppressed once any scenario has a clip.
That slot is a reminder, and a page already playing demo footage in its tabs
has nothing left to be reminded of.

`media: null`, or an entry with no scenarios and no video, omits the section.

### Cutting a clip

A clip is a short loop of one failure and its recovery. Cut it so it opens and
closes on the healthy state: the loop then closes where it opened, and a reader
who arrives mid-loop still sees the whole arc within one pass.

```bash
ffmpeg -ss 12 -t 48 -i demo.mp4 \
  -vf "setpts=PTS/3,scale=1280:-2" -an \
  -c:v libx264 -crf 24 -preset slow -profile:v high -pix_fmt yuv420p \
  -movflags +faststart clip-01-nginx.mp4

# poster frame, from the same start point
ffmpeg -ss 12 -i demo.mp4 -frames:v 1 -vf scale=1280:-2 -q:v 4 clip-01-nginx.jpg
```

`setpts=PTS/N` is the speed-up and `-an` drops the audio, which these have no
use for. `+faststart` is what lets playback begin before the whole file has
arrived. Screen recordings compress extremely well because most of the frame
never changes: the four EchoChallengers clips are 400–580KB each for 13–16
seconds at 1280x608.

**Set `speed` whenever `setpts` was used.** It renders beside the Demo heading. A
scenario whose interesting part is a slow climb toward a threshold has to be
sped up to work as a loop, and replaying a chart at 13x without saying so
would misstate the response times the page is claiming.

**Give every clip its `width` and `height`.** The frame takes each clip's own
ratio from them, so a clip fills the column exactly and nothing is cropped or
letterboxed:

```js
clip: {
  src: '/projects/<slug>/clip-01-nginx.mp4',
  poster: '/projects/<slug>/clip-01-nginx.jpg',
  width: 1280,
  height: 608,
  speed: '3x',
  alt: '…',
},
```

They are there to reserve the right height before the video's metadata
arrives. Leave them out and the frame has no height until the file loads, and
the page jumps under the reader.

That frame used to be pinned to `1280 / 608` in the stylesheet, which was never
a designed ratio: it was EchoChallengers' encode, fixed when that was the only
project with clips. Every clip added afterwards sat letterboxed inside it, and
because the bars were black against a black video nobody saw it for months:

| | Encode | How much of the frame was the clip |
|---|---|---|
| EchoChallengers | 1280x608 | all of it |
| hailcast, Lock-N-Lock | 1280x720, 960x540 | 84% |
| ShimonVault | 1280x806 | 75% |
| Project1-Self-Build | 1440x904 | 76% |

**So do not encode to fit a frame.** Cut at whatever ratio the recording is and
let the page follow it. The only real limit is height: a clip much taller than
`1.5` would run past a screen at column width, and nothing here is, so no cap
is wired up. If one ever is, cap it rather than cropping the picture.

A dimensionless clip still works — `height: auto` lets the video size itself
once metadata lands — so the cost of forgetting is a layout shift rather than a
broken frame.
Cloudflare Pages rejects any single file over 25 MiB, so a full-length
recording belongs on a video host, referenced through `video: { kind: 'embed' }`.
Clips are small enough to serve from `public/` with no third-party embed.

### Why a clip does not replace the stills

**Check the source bitrate before assuming a clip can carry the detail**, and
note that the answer differs per recording. The two here are far apart:

| | EchoChallengers | Lock-N-Lock |
|---|---|---|
| Source | 198kbps at 1516x720 | 1866kbps at 960x540 |
| Scale in an 863px column | 0.57x | 0.90x |
| Text in the clip | soft | close to native |

The EchoChallengers recording is roughly a tenth of what dashboard text needs,
so its panels are soft before any encoding here touches them. Re-encoding at native resolution and CRF 16 was measured against the
shipped CRF 24 encode and the text was indistinguishable, at two and a half
times the bytes. The source is the ceiling.

Most of the remaining softness is not the codec either. A 1516px-wide frame
displayed in an ~863px column is downscaled to 57%, and cropping to one pane so
it renders near 1:1 sharpens it far more than any encoder setting. That crop
was rejected here because it discards the alert channel and the terminal, which
are the reasons a clip beats a still pair at all.

So the clip shows the change happening and the stills show what the panels
actually said. Keep both when the recording is this soft. `stillsNote` is where
you say what the stills add, and where you own anything a reader would
otherwise catch the page out on: the EchoChallengers sets are from different
runs, with different instance addresses, and its note says so.

Lock-N-Lock needs no such caveat. Its stills are the same runs as its clips,
which the matching 23.24s recovery figure confirms, so its note only points at
the full-size versions. Its stills also vary from 801x472 to 2048x1097, so the
note deliberately makes no claim about being sharper than the clip: one of
them is smaller than the clip is.

**Burned-in captions stay.** The Lock-N-Lock recording carries the team's own
Korean subtitles, and they are left in the clips for the same reason the Korean
dashboards are left alone: editing someone's evidence turns it into a mock-up
of evidence. `clipNote` says whose captions they are, so a reader is told
rather than left guessing.
