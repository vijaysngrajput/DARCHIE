# 24 Launch Readiness Checklist

## Purpose
Define the final go-live checklist for DARCHIE v1.

## Decisions This Document Owns
- Go-live gates
- operational checks
- legal and content checks
- rollback expectations

## Inputs / Dependencies
- `docs/01-product/03-business-review.md`
- `docs/03-architecture/18-security-privacy-compliance-baseline.md`
- `docs/03-architecture/19-non-functional-requirements.md`
- `docs/04-delivery/20-testing-strategy.md`
- `docs/04-delivery/21-devops-environment-strategy.md`
- `docs/04-delivery/22-implementation-plan.md`

## Required Sections
- Product checks
- technical checks
- legal checks
- rollback plan

## Output Format
Launch checklist.

## Completion Criteria
- The team can decide whether the product is launch-ready from this document alone.

## Product Checks
- Public website copy reviewed
- Pricing and plan gating confirmed
- At least one complete exercise path live for each core module
- Onboarding recommendations reviewed for clarity
- Empty and error states reviewed

## Technical Checks
- CI green on release branch
- Staging smoke tests passed
- Production environment variables validated
- Monitoring, alerts, and uptime checks enabled
- Database backups confirmed
- Error rates acceptable after final dry run

## Security And Legal Checks
- Terms, Privacy Policy, and Cookie Notice published
- OAuth redirect URLs correct
- Secrets verified and rotated where needed
- No debug endpoints or test credentials exposed

## Analytics And Support Checks
- Key analytics events firing
- Contact/support links active
- Founder/support inbox monitored

## Rollback Readiness
- Previous stable deployment can be restored
- Database rollback and migration safety reviewed
- Incident response owner identified for launch day
