# 20 Testing Strategy

## Purpose
Define the testing approach, ownership, and release gates for DARCHIE v1.

## Decisions This Document Owns
- Test pyramid
- critical coverage areas
- release gates
- ownership by subsystem

## Inputs / Dependencies
- `docs/01-product/04-prd.md`
- `docs/03-architecture/12-low-level-design.md`
- `docs/03-architecture/14-api-contract-specification.md`
- `docs/03-architecture/16-visual-builder-interaction-spec.md`
- `docs/03-architecture/19-non-functional-requirements.md`

## Required Sections
- Test layers
- coverage priorities
- release gates
- ownership

## Output Format
Testing strategy document.

## Completion Criteria
- Engineering can define CI gates and launch checks from this document.

## Test Layers
- Unit tests for utility functions, validation schemas, scoring logic
- Integration tests for API routes, database interactions, entitlement checks
- Component tests for major interactive UI states
- End-to-end tests for auth, onboarding, dashboard, and one flow per module
- Visual regression tests for marketing pages and core app layouts
- Worker tests for execution payload validation and result parsing

## Highest Priority Scenarios
- Sign-up and onboarding
- Browse and launch an exercise
- Save a draft
- Submit SQL and Python attempts
- Validate and submit data modeling work
- Validate, simulate, and submit pipeline builder work
- Upgrade entitlement checks
- Dashboard progress rendering

## Release Gates
- All critical path end-to-end tests pass
- No blocker or critical severity bugs open
- Lighthouse and accessibility checks pass threshold
- API contract tests pass for protected and public endpoints
- Builder interaction tests cover connection, validation, save, and simulate

## Tooling Recommendation
- `Vitest` for unit and integration
- `React Testing Library` for components
- `Playwright` for end-to-end
- `Chromatic` or screenshot diff tooling for visual regression

## Ownership
- Frontend team owns component and e2e flows
- Backend team owns API and data integrity tests
- Platform team owns deployment smoke and environment checks
