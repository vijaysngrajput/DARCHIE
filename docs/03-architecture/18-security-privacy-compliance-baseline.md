# 18 Security, Privacy, And Compliance Baseline

## Purpose
Define the baseline security and privacy posture for DARCHIE v1.

## Decisions This Document Owns
- Auth and session baseline
- secrets policy
- runtime isolation rules
- data protection and audit rules

## Inputs / Dependencies
- `docs/03-architecture/11-high-level-design.md`
- `docs/03-architecture/12-low-level-design.md`
- `docs/03-architecture/14-api-contract-specification.md`

## Required Sections
- Authentication
- data protection
- execution safety
- logging
- compliance baseline

## Output Format
Security baseline document.

## Completion Criteria
- Security-sensitive implementation choices are explicit before code is written.

## Authentication And Sessions
- Use Supabase Auth with secure HTTP-only cookies.
- Support email/password and Google OAuth.
- Enforce server-side session validation on protected routes.
- Sensitive actions require CSRF protection where applicable.

## Secrets Handling
- All secrets live in environment variables managed by deployment platform.
- No secrets committed to the repository.
- Internal service tokens are rotated and scoped to the evaluation worker only.

## Data Protection
- Store only essential user profile data for v1.
- Encrypt data in transit via HTTPS everywhere.
- Rely on managed Postgres encryption at rest.
- Limit PII in logs and analytics payloads.

## Safe Code Execution Constraints
- User code runs only in isolated containers.
- No outbound network access.
- Strict CPU, memory, and wall-clock limits.
- File system access is ephemeral and scoped to runtime container.
- Unsupported imports and shell execution are blocked.

## Audit And Logging
- Log sign-in, failed auth, submission lifecycle changes, billing events, and admin-sensitive actions.
- Store structured application logs and error traces.
- Redact user code payloads from error logs by default; store only short excerpts when necessary for debugging.

## Compliance Baseline
- Target a privacy-first startup baseline, not full enterprise compliance in v1.
- Prepare legal page inputs for Terms, Privacy Policy, and Cookie Notice.
- Do not claim SOC 2 or enterprise-grade certifications until achieved.
