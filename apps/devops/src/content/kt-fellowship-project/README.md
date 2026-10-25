<!--
Version A: a translation of the repository's own README (Jangingmall/infra,
README.md at main), kept to its structure. The empty "Structure" block in the
original is filled with the top-level layout. An alternative written from the
whole project sits in drafts/README.mine.md and is not rendered.
-->

# Jangingmall: Infra

The infrastructure repository for the Jangin Mall project, later renamed Midam.

## Team

The infrastructure members of the integrated team:

- Cloud infrastructure: Yunju Kang (lead), Junhan Shin (vice lead), Dajeong Park, and Changwon Lee
- Cloud native: Myungsoo Park

## Technologies and tools

- Stack
    - Infrastructure as code (IaC): Terraform
    - Cloud platform: AWS
        - EC2, EKS, ALB, and VPC

- Tools
    - CI/CD automation: GitHub Actions and Argo CD
    - Version control: Git and GitHub
    - IDE and terminal: VS Code
    - Architecture diagrams: draw.io
    - Documentation and collaboration: Notion and Google Drive

## Conventions

Commit and pull request conventions are in [CONVENTION.md](https://github.com/Jangingmall/infra/blob/main/CONVENTION.md).

## Structure

```
infra/
├── terraform/      # modules/ and environments/ (staging, prod)
├── k8s/            # base, components, and overlays per environment
├── platform/       # Helm values for the cluster platform
├── argocd/         # Argo CD applications per environment
├── ci-cd/          # build and promotion workflow templates
├── config/         # example settings for the database backup
├── scripts/        # validation, bootstrap, and drill scripts
└── tests/
```

## Kubernetes configuration checks

The same script validates the Kubernetes configuration locally and in GitHub Actions.

```bash
bash scripts/validate-k8s.sh
```

- Required tools: Bash, kubectl, and Helm. CI uses kubectl `v1.36.1` (Kustomize `v5.8.1`) and Helm `v3.21.4`. The same versions are recommended locally.
- The script needs an internet connection to reach the public Helm repositories. It needs no AWS credentials and no kubeconfig.
- Usage: `bash scripts/validate-k8s.sh --help`

| Target | Check | Pinned chart version |
| --- | --- | --- |
| `k8s/base` | `kubectl kustomize` renders the resources and their references | None |
| `k8s/overlays/stage` | Renders the shared settings with the staging changes | None |
| `k8s/overlays/prod` | Renders the shared settings with the production changes | None |
| `platform/cloudnative-pg` | `helm lint --strict` and `helm template --include-crds` | `0.29.0` |
| `platform/argo-rollouts` | `helm lint --strict` and `helm template --include-crds` | `2.43.1` |
| `platform/secrets-store-csi` | Validates and renders the AWS provider and the bundled CSI driver chart | `3.1.3` |
| `platform/aws-load-balancer-controller` | Renders stage and prod, and checks the TGB CRD, the IRSA wiring, and the webhook certificate | `1.14.0` |
| `platform/nvidia-device-plugin` | Checks the GPU DaemonSet, taints, and device registration | `0.20.0` |
| `platform/metrics-server` | Checks the Metrics API, resources, TLS, and AppProject permissions | `3.14.0` |

Each chart is downloaded at its pinned version into a temporary directory. The download and the rendered output are deleted when the check ends. A chart version change updates the platform's documents, its values, and this script together.

### When GitHub Actions runs it

The `Kubernetes validation` workflow runs on pull requests to `main` that change `k8s/`, `platform/`, the validation script, or the workflow file. After it reaches the default branch, it can also run by hand from the Actions page.

- It runs as a single job on a standard `ubuntu-24.04` runner.
- A new run on the same pull request cancels the previous one. The time limit is 10 minutes.
- It uses only the `contents: read` permission and uploads no artifacts or caches.
- A failure shows on the pull request. With the current path filter, making it a required check on every pull request would leave it pending on pull requests that touch none of these paths. The trigger must change along with any move to a required check.

### What it covers

The check covers YAML generation, resource references, Helm chart structure, and the checks each chart provides. Full Kubernetes API and CRD schema validation, real EKS version compatibility, pod placement, networking, IRSA authentication, and image execution are verified separately. The kubectl version in CI is the version of the validation tool. It does not set the EKS version.

The targets include the shared base, the stage and prod overlays, and the platform, observability, and backup configuration above. A new environment or platform also needs a new target in the script. The per-environment layout and rendering steps are in the [Kubernetes guide](https://github.com/Jangingmall/infra/blob/main/k8s/README.md).

The install order of the ALB Controller and Metrics Server, the values handed over from the infrastructure, and the acceptance tests follow the [cluster add-on operations guide](https://github.com/Jangingmall/infra/blob/main/platform/cluster-addons.md). The install code is ready, and its presence alone does not mean the add-ons are installed on a real EKS cluster.
