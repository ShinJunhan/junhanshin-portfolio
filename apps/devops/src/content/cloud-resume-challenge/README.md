# Cloud Resume Challenge

<!-- TODO: placeholder content. Replace with the real write-up. -->

A static résumé site on AWS with a visitor counter behind it, defined entirely
in Terraform and deployed by CI.

## What's in here

- **Front end** — static site in S3, served through CloudFront with a custom
  domain in Route 53.
- **API** — a Lambda function behind API Gateway, backed by a DynamoDB counter.
- **Infrastructure** — Terraform for all of the above, with remote state.
- **Pipeline** — GitHub Actions: plan on pull request, apply on merge.

## Running it

```bash
terraform init
terraform plan
terraform apply
```

## Notes

- Placeholder section. Add the parts worth explaining: the state backend
  choice, the cache-invalidation step, the CORS setup.
