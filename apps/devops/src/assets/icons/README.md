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

## Currently missing

These appear in project stacks with no logo on disk yet:

| Label | Expected file |
|---|---|
| AWS | `aws/aws.svg` |
| CloudFront | `aws/cloudfront.svg` |
| Trivy | `tools/trivy.svg` |

AWS publishes a free "AWS Architecture Icons" pack under its icon usage
guidelines; the rest are on each project's own brand/press page. Square,
transparent-background SVGs work best — they render at 22×22.

These files were copied from `apps/root/public/icons/`, which uses the same
naming. Keep the two in sync by hand; they are deliberately separate apps.
