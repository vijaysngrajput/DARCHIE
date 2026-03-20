# 21 DevOps And Environment Strategy

## Purpose
Define the environments, delivery pipeline, operational tooling, and release process for DARCHIE v1.

## Decisions This Document Owns
- Environment topology
- CI/CD model
- configuration policy
- monitoring and backup expectations

## Inputs / Dependencies
- `docs/03-architecture/11-high-level-design.md`
- `docs/03-architecture/18-security-privacy-compliance-baseline.md`
- `docs/03-architecture/19-non-functional-requirements.md`

## Required Sections
- Environments
- ci/cd
- monitoring
- backups
- release process

## Output Format
Operational strategy document.

## Completion Criteria
- Implementation can provision environments and ship safely.

## Environments
- `local`: developer environment with mocked or shared managed services
- `preview`: branch-based preview deployments for web app
- `staging`: production-like environment for integrated testing
- `production`: live user environment

## Configuration Policy
- Environment variables are managed separately per environment.
- Required values documented in `.env.example` during implementation.
- Feature flags used for mock interview mode and billing gating if rollout needs gradual exposure.

## CI/CD
- GitHub Actions for lint, typecheck, tests, build
- Vercel preview deploys on pull requests
- Staging deploy on merge to `main`
- Production deploy on tagged release or protected manual promotion

## Migrations And Data Safety
- Prisma migrations run in staging before production
- Production migrations require backup checkpoint first
- Backward-compatible migration preference for v1

## Monitoring
- Sentry for errors and traces
- PostHog for product analytics
- Uptime checks for app and execution worker
- Log drain configured for web app and worker environments

## Backups
- Managed Postgres daily backups
- Restore procedure documented before launch
- Object storage lifecycle policy for large artifacts

## Release Process
1. Merge approved changes to `main`
2. Run full CI and deploy to staging
3. Execute smoke checklist
4. Promote to production
5. Monitor logs, errors, and conversion events for 24 hours
