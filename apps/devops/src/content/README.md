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
