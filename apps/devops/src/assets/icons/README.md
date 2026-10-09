# Tech-stack logos

The Tech Stack section renders a real vendor logo beside each entry. Icons are
found by slugifying the label in `src/data/projects.js`:

```
'GitHub Actions'  ->  github-actions.svg
'Route 53'        ->  route53.svg   (via OVERRIDES in src/data/tech.js)
'Terraform'       ->  terraform.svg
```

`tools/` is searched first, then `aws/`. A label with no matching file renders
a monogram tile instead — no broken image, no gap in the row — so adding a
logo later is a drop-in with no code change.

If a label can't be slugified to its filename, add an entry to `OVERRIDES` in
[`src/data/tech.js`](../../data/tech.js) rather than renaming the file.

These live under `src/assets/` rather than `public/` on purpose: `src/data/tech.js`
discovers them with `import.meta.glob`, and Vite copies `public/` verbatim
without resolving imports into it — globbing there produces URLs that work in
dev and 404 in a production build. Project screenshots and diagrams, which are
referenced by literal path and never imported, do belong in `public/`.

## Adding a logo

Every label in a project stack has a logo on disk as of October 2026. When a
new tool goes into a stack, add its SVG here under the slug above and copy it
to `apps/root/public/icons/` as well.

AWS publishes a free "AWS Architecture Icons" pack under its icon usage
guidelines; the rest are on each project's own brand/press page, or in
Simple Icons and Devicon. Square, transparent-background SVGs work best. They
render at 22×22 in the stack notes, so crop out wordmarks where the logo has a
symbol of its own.

`apps/root/public/icons/` uses the same naming and holds the same files. Keep
the two in sync by hand; they are deliberately separate apps.
