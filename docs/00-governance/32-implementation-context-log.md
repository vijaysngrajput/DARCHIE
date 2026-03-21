# 32 Implementation Context Log

## Purpose
Keep the current implementation state short, operational, and handoff-ready so future sessions do not depend on memory or chat history.

## Decisions This Document Owns
- What the team should treat as the current true implementation state
- What remains mocked, partial, risky, or intentionally deferred
- What should be picked up next

## Inputs / Dependencies
- `01-master-index.md`
- Active implementation state
- Latest build and test verification status

## Required Sections
- Current Focus
- Completed Recently
- In Progress
- Known Placeholders / Mocked Areas
- Open Issues / Risks
- Next Recommended Task
- Verification Status
- Doc Sync Needed

## Output Format
Short operational markdown updated in place after each meaningful implementation slice.

## Completion Criteria
- A new engineer or agent can read this file and know exactly what is implemented, what is still mocked, what is risky, and what to do next
- This file reflects the latest verified state of the repo

## Current Focus
Frontend foundation, premium UI, and the practice playground layout foundation are implemented. The next major product slice is turning the mocked practice workspaces into functional module experiences.

## Completed Recently
- Bootstrapped `apps/web` with Next.js App Router, theme provider, font setup, dark/light token system, and marketing/auth/app route shells
- Implemented core UI primitives currently needed by the foundation: button, input, badge, skeleton, panel, theme toggle
- Added placeholder but functioning routes for `/`, `/modules`, `/pricing`, `/about`, `/signin`, `/signup`, `/onboarding`, `/app/dashboard`, `/app/practice`, `/app/progress`, and `/app/settings`
- Added baseline Vitest component tests and Playwright smoke tests
- Completed a premium UI redesign of the marketing shell, app shell, sidebar, mobile nav, homepage, pricing page, and dashboard page
- Refined the hero CTA, improved light-mode surface contrast, corrected the modules page card fit and spacing, and upgraded the header branding/menu treatment
- Synchronized the key design docs to the implemented premium UI system
- Built the practice playground layout slice: module-first `/app/practice` hub, landing pages for SQL/Python/Data Modeling/Pipeline Builder, shared workspace shell, mocked per-module work surfaces, and route/component tests for the new slice
- Routed homepage `Start practicing` entry points directly into `/app/practice` and framed the hub as an open preview where deeper feature restrictions can be added later

## In Progress
- Governance layer for documentation sync is active and should continue after each implementation slice

## Known Placeholders / Mocked Areas
- All current page content is mocked; there is no live backend data integration yet
- Auth pages are layout-complete but not connected to real authentication flows
- Progress and settings pages are still shell-level placeholders
- Practice module pages and exercise workspaces are layout-complete but still mocked; there is no real execution, persistence, scoring, or backend-driven catalog yet
- Monaco workspaces, schema tooling, true visual builders, and persistence are not implemented yet
- Pricing page is visual only; billing is not wired
- Public homepage traffic can now enter the practice hub directly, but preview-vs-restricted feature boundaries are still a product decision to be defined

## Open Issues / Risks
- There is a non-blocking Next.js dev warning during Playwright runs about `allowedDevOrigins`
- Playwright web-server startup clears stale `.next` output to avoid intermittent runtime chunk-resolution errors
- Future implementation slices still need disciplined doc sync to prevent drift from returning
- Responsive practice workspace markup can duplicate visible text between mobile and desktop sections, so tests should prefer semantic queries or plural match assertions where needed

## Next Recommended Task
Choose the first functional practice upgrade: wire a real SQL/Python editor experience or begin the actual data-modeling/pipeline builder interactions, while preserving the shared workspace shell already in place.

## Verification Status
- Root README exists with website run instructions and key developer commands
- `pnpm --filter darchie-web build` passes
- `pnpm --filter darchie-web test -- --run` passes
- `pnpm --filter darchie-web exec playwright test tests/smoke.spec.ts` passes
- Verified routes include the marketing pages, auth pages, app shell pages, `/app/practice`, module landing pages for all four practice modules, and dynamic workspace routes for the mocked exercise entries

## Doc Sync Needed
- No immediate sync gap remains for the implemented practice layout in `09`, `29`, or `30`
- Next sync work should happen when the mocked practice surfaces become real interactive module experiences
