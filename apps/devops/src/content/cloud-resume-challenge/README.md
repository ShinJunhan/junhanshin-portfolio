# Cloud Resume Challenge

The Cloud Resume Challenge, rebuilt around a site that already existed.

The canonical version ends with a résumé page on S3, served through CloudFront,
with a visitor counter behind API Gateway. Two things about this domain made
that the wrong build. The landing page at `junhanshin.com` is already a résumé,
so a second one would have left two surfaces doing one job. And DNS here is
already on Cloudflare, already serving another project, so moving the domain to
Route 53 would have broken that project and added a monthly charge for a zone
that duplicates one I have.

So the challenge was split into the half this repository was missing and the
half that makes it the challenge. The first is delivery, which neither app had:
both built to a local `dist/` directory and stopped there. The second is the
counter, which now answers the `visitors` command in the landing page's
terminal.

## What changed, and why

| Canonical | Here | Reason |
|---|---|---|
| S3 + CloudFront + ACM | Cloudflare Pages | DNS is already on Cloudflare and serving another project |
| Route 53 hosted zone | No zone at all | Repointing nameservers would break that project, and a zone bills monthly |
| A new résumé page | The existing landing page | A second résumé surface would compete with the first |
| API Gateway | Lambda function URL | Fewer resources, and no free-tier expiry after twelve months |
| DynamoDB lock table | S3-native state locking | Terraform 1.11 deprecated the DynamoDB argument |

The first row is the one requirement I dropped rather than adapted, and it is
worth being plain about that. Building the CloudFront stack is a large part of
what the challenge is usually understood to teach.

## Delivery

One push to `main` runs two workflows.

`pages.yml` builds each app in a matrix job and deploys it to its own
Cloudflare Pages project. `npm ci` rather than `npm install`, so the lock file
decides the versions and a transitive release cannot change what ships.

`infra.yml` runs `fmt`, `validate` and `plan` on every pull request that
touches the backend, and applies only on a push to `main`. The plan is written
to the job summary, so the diff is readable without opening the log.

Neither workflow stores a credential. Cloudflare takes an API token scoped to
Pages. AWS takes a role assumed through an OIDC provider, and the trust policy
names `refs/heads/main` and `pull_request` rather than the repository as a
whole. A fork cannot reach either subject, because GitHub withholds
`id-token: write` from workflows it triggers.

## The counter

The terminal's `visitors` command calls a Lambda function URL. The function
runs one `UpdateItem` with an `ADD` expression, which is atomic, so two
requests arriving together produce two increments rather than one lost update.
Nothing seeds the item: `ADD` against a missing item creates it, so the first
request ever made returns 1.

The answer is held for the life of the page. The endpoint increments on every
request, so without that cache, running the command five times would report
five more visitors and each answer would be a number the command had just
invented.

What the number measures is narrower than a page view. It counts people who
opened the terminal and typed the command, which is a smaller and more
interesting group.

## Where the limits actually are

The function URL is public. Browser JavaScript cannot sign a request, and
there is no CloudFront distribution to hold an origin access control, so IAM
authorisation would have meant no caller at all.

CORS is not what protects it. An allow-list stops another site's script reading
the response and does nothing about `curl`. **Reserved concurrency on the
function is the control that actually holds**, and its cost is a 429 to a real
visitor during a burst.

The execution role carries one data-plane action, `dynamodb:UpdateItem`, on one
table. The function cannot read that table, scan it, or delete from it. It also
lacks `logs:CreateLogGroup` on purpose, because a function that can create its
own log group can create one outside the retention policy, which is how logs
quietly become permanent.

The deploy role's policy is written out statement by statement rather than
reached for as a managed policy. `iam:PassRole` is the dangerous entry in it,
and naming a single role is what stops CI handing any identity in the account
to a Lambda. The cost is real: adding a resource means adding its actions
first, and the failure mode is an apply that dies on `AccessDenied` against a
policy that looks entirely correct.

## Cost

Zero by arithmetic rather than by rounding.

DynamoDB is provisioned at 5 read and 5 write units against an Always Free
allowance of 25, with no autoscaling attached, because autoscaling is the one
thing that would carry it past that line under load. Lambda sits inside the
perpetual free tier. Logs expire at 14 days against 5 GB of free ingestion.
The Terraform state bucket holds a few kilobytes and expires non-current
versions at 30 days.

On-demand DynamoDB billing would have cost fractions of a cent at this volume,
which is a different claim from costing nothing.

## What is not done

The infrastructure is written, formatted and validated. **It has not been
applied.** There is no deploy time on this page, no measured cost, and no
visitor number, because none of those exist yet and an estimate would not be
one of them.
