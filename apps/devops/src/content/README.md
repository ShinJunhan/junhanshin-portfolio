# Project README sources

One folder per project, named exactly as that project's `slug` in
`src/data/projects.js`:

```
src/content/<slug>/README.md      # English (required for the section to show)
src/content/<slug>/README.ko.md   # Korean (optional)
```

`src/data/readmes.js` discovers these with a glob — there is nothing to import
or register. The rules that follow from that:

- No `README.md` for a slug → the README section and its entry in the sticky
  nav both disappear for that project.
- `README.md` only → the section renders with no EN/KO toggle, because there
  is nothing to toggle to.
- Both files → the toggle appears.

To add a third language, add an entry to `LANGUAGES` in
`src/data/readmes.js` (`{ id: 'ja', label: 'JA', suffix: '.ja' }`) and drop
`README.ja.md` in the project's folder.

Raw HTML in these files is not rendered. HTML comments are stripped before
rendering, so `<!-- … -->` works as an ordinary comment; any other HTML tag
would reach the page as literal text, so use markdown instead.

These files are the rendered page content, so they can differ from the README
in the project's own GitHub repo — keep them focused on what a reader of the
portfolio needs rather than on build instructions.
