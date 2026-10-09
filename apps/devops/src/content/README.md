# Project document sources

One folder per project, named exactly as that project's `slug` in
`src/data/projects.js`:

```
src/content/<slug>/README.md      # English
src/content/<slug>/README.ko.md   # Korean (optional)
src/content/<slug>/RUNBOOK.md     # English (optional)
src/content/<slug>/RUNBOOK.ko.md  # Korean (optional)
```

`src/data/docs.js` discovers these with a glob — there is nothing to import or
register. The rules that follow from that:

- No file for a slug → that document's tab simply doesn't appear.
- One language only → the tab renders with no EN/KO toggle, because there is
  nothing to toggle to.
- Both files → the toggle appears, and it is **per document**: a project can
  have a translated README and an English-only runbook.

The tabs render in the order set by `DOCUMENTS` in
`src/components/sections/SourceSection.jsx` — README, then RUNBOOK, then the
Terraform files. That order is deliberate: what the system is, how it is
operated, what it is made of.

To add a third language, add an entry to `LANGUAGES` in `src/data/docs.js`
(`{ id: 'ja', label: 'JA', suffix: '.ja' }`) and drop `README.ja.md` in the
project's folder.

## Source files

The document tabs above are discovered. The source tabs beside them are not —
each one is an explicit `?raw` import in `src/data/projects.js`, listed in that
project's `terraform` key against the path the file has in its own repository:

```js
import echoMainTf from '../content/echochallengers/code/terraform/main.tf?raw'
// …
terraform: [{ path: 'terraform/main.tf', content: echoMainTf }],
```

Those files live under `src/content/<slug>/code/` and are chosen to carry the
page's argument rather than to inventory the repository. They are **copies**,
because each of those projects is a separate GitHub repository that Vite cannot
see. The copy doubles as the editorial gate: comments are translated where the
original wrote them in Korean, and a file carrying a live credential is left out
rather than redacted.

What a copy costs is that it can go stale in silence. Nothing throws, no test
fails, and the page keeps showing a file the repository no longer has.

### The one exception: cloud-resume-challenge

That project's infrastructure is in **this** repository, under `infra/` and
`backend/`, because it is what deploys this site. Its six source files are
therefore imported from where they actually live:

```js
import crcLambdaTf from '../../../../infra/lambda.tf?raw'
```

The reason is the page's own claim. It says *this is the infrastructure this
site runs on*, and a copy that drifts makes that claim quietly false. Reading
the real file means the page cannot be wrong about it, and a renamed file fails
the build instead of rotting the page.

Three consequences, all accepted on purpose:

- `vite.config.js` carries a `server.fs.allow` entry so the dev server can read
  outside its own root. The production build never needed one, because Rollup
  follows the import like any other.
- Those files have no editorial gate. Every comment written in `infra/` is
  published the moment it is pushed, so nothing private belongs in them.
- The devops build now depends on `infra/` being present. That is a loud
  failure rather than a silent one, which is the whole trade.

Do not generalise this. A project whose code is in another repository has no
such option, and the copy is correct for every one of them.

## Writing a runbook

Different job from the README, so a different voice. A runbook is read by
someone who is already in trouble: direct, action-oriented, no analogies. Each
section says what to check, what command to run, and what the correct output
looks like — and, where it matters, what to do when the output is wrong.
Prefer a table of the actual policy over a paragraph describing it.

Links inside these files:

- **In-page anchors work.** Headings get the same ids GitHub would generate
  (`rehype-slug`), so a README's own table of contents resolves here. The click
  is intercepted rather than left to the browser — this app routes on the URL
  hash, so letting a fragment reach the address bar would read as "not a
  project route" and bounce the reader to the welcome screen.
- **Relative links to sibling repo files do not.** `./setup_manual.md` and the
  like resolve on GitHub but 404 here, because those companion docs are not
  part of this app. Either drop the link and leave the filename as plain text,
  or point it at the full GitHub URL.
- **Absolute links open in a new tab**, so the reader's place in a long README
  survives.

Raw HTML in these files is not rendered. HTML comments are stripped before
rendering, so `<!-- … -->` works as an ordinary comment; any other HTML tag
would reach the page as literal text, so use markdown instead.

These files are the rendered page content, so they can differ from the README
in the project's own GitHub repo — keep them focused on what a reader of the
portfolio needs rather than on build instructions.
