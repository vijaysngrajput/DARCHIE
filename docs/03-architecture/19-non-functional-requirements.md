# 19 Non-Functional Requirements

## Purpose
Define the required quality attributes for DARCHIE v1.

## Decisions This Document Owns
- Performance targets
- reliability expectations
- accessibility targets
- browser/device support
- observability expectations

## Inputs / Dependencies
- `docs/03-architecture/11-high-level-design.md`
- `docs/03-architecture/18-security-privacy-compliance-baseline.md`

## Required Sections
- Performance
- reliability
- accessibility
- support matrix
- observability

## Output Format
Quality-attribute specification.

## Completion Criteria
- Delivery and testing teams can define release gates from this document.

## Performance Targets
- Public pages should achieve Core Web Vitals in the good range on modern mobile and desktop.
- Time to interactive for major marketing pages under `3s` on standard mobile network profiles.
- Authenticated dashboard initial load under `2.5s` on warm cache.
- Draft save responses under `500ms` median.
- Submission result polling or updates should surface completion within `5s` median for lightweight evaluations and `20s` p95 for executed code tasks.

## Reliability Targets
- Monthly uptime target: `99.5%` for the web app
- Graceful degradation if analytics or billing services fail
- No single client action should cause data loss of saved drafts

## Accessibility Targets
- WCAG 2.2 AA compliance target
- Full keyboard support for non-canvas controls
- Partial but meaningful keyboard support for canvas interactions
- Screen reader labels for all primary actions and status changes

## Browser And Device Support
- Latest 2 versions of Chrome, Edge, Firefox, Safari
- Responsive support for desktop, tablet, and mobile
- Builders optimized for desktop and tablet; mobile editing limited but usable

## Observability
- Sentry for exceptions and performance traces
- Product analytics for onboarding, attempts, submissions, upgrades
- Structured server logs for API and worker flows
