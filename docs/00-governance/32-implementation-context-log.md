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
Frontend foundation, premium UI, practice layout, a functional SQL module slice, mirrored focus-mode Python exercise UX, and a redesigned canvas-first Data Modeling builder are implemented. The light theme has also been retuned away from brighter parchment surfaces toward a calmer slate-neutral system. The next major product slice is hardening the SQL runtime and deciding how Python moves from mocked execution into a real runtime contract.

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
- Implemented the first functional SQL module path with a Monaco editor, schema browser, draft save, run preview, submit feedback, a new FastAPI backend slice, and backend tests for the starter SQL sandbox
- Reworked SQL exercise pages into a focus-mode editor layout with top app header chrome, sticky prompt/review rails, aligned action row placement, and improved sidebar reopen behavior on non-focus routes
- Mirrored the same focus-mode exercise layout for Python so SQL and Python now share one coherent premium workspace UX, even though Python run/submit behavior remains mocked
- Implemented Data Modeling as a dedicated focus-mode React Flow builder with a full-width prompt section, curated right-side palette, hybrid ERD/support-shape canvas, real frontend ERD validation, and mocked submit/review output in a full-width review surface beneath the canvas
- Refined Data Modeling into a more canvas-first interaction model: removed the left inspector and duplicate below-canvas action strip, moved rename/add-field/type-editing into the nodes themselves, made the builder palette span the page-height workspace column, removed the visible `Starter hint` block for the module, and loosened the minimum zoom for larger diagrams
- Expanded Data Modeling into a more premium builder: compacted the prompt into a cleaner editorial header, added a brainstorming scratchpad, added toolbar/minimap/navigation affordances, made validation issues jump back to the relevant canvas objects, and deepened inline entity editing with nullable/remove/reorder controls plus contextual relationship label editing
- Retuned the light theme tokens so cards, panels, and backgrounds feel calmer and less white-heavy, using a slate-neutral family for surfaces, text, accents, borders, and focus treatment while keeping dark mode unchanged

## In Progress
- Governance layer for documentation sync is active and should continue after each implementation slice

## Known Placeholders / Mocked Areas
- All current page content is mocked; there is no live backend data integration yet
- Auth pages are layout-complete but not connected to real authentication flows
- Progress and settings pages are still shell-level placeholders
- SQL now has a first functional preview path, but draft storage is still in-memory and the backend sandbox is still a starter implementation rather than the final isolated MySQL worker shape
- Python now has a dedicated Monaco-based focus-mode workspace and mocked review flow, but it is still frontend-only and not backed by a Python execution service
- Data Modeling now has an interactive frontend builder, but it is still local-only with no backend persistence or scoring engine behind it
- Data Modeling support shapes currently improve architectural expression on the canvas, but they are intentionally non-blocking and do not yet participate in structured scoring
- Pipeline-builder workspace still uses the older generic mocked shell
- True visual builders, cross-session persistence, and full exercise catalog loading are not implemented yet
- Pricing page is visual only; billing is not wired
- Public homepage traffic can now enter the practice hub directly, but preview-vs-restricted feature boundaries are still a product decision to be defined

## Open Issues / Risks
- There is a non-blocking Next.js dev warning during Playwright runs about `allowedDevOrigins`
- Playwright web-server startup clears stale `.next` output to avoid intermittent runtime chunk-resolution errors
- Future implementation slices still need disciplined doc sync to prevent drift from returning
- Responsive practice workspace markup can duplicate visible text between mobile and desktop sections, so tests should prefer semantic queries or plural match assertions where needed
- The first SQL runtime slice is intentionally narrow: one exercise, one local sandbox runner, and in-memory draft state rather than the final isolated MySQL worker/persistence design
- Python now visually implies a richer editor flow than the backend actually supports, so docs and future implementation must keep the distinction between mirrored UX and real runtime behavior explicit
- Data Modeling now feels materially more complete than its backend support; future work must preserve the frontend draft schema, brainstorming state, and ERD validation semantics when persistence/scoring are added
- The redesigned Data Modeling experience no longer uses the generic exercise header, left-side inspector, or right-rail config pattern, so future work should not reintroduce those older UX assumptions by accident

## Next Recommended Task
Harden the SQL module further, choose the real Python runtime path, and then add persistence plus backend-backed validation/scoring to the Data Modeling builder while bringing Pipeline Builder onto the same dedicated builder pattern.

## Verification Status
- Root README exists with website run instructions and key developer commands
- Root scripts now include `pnpm dev:api` and `pnpm test:api` for the SQL preview backend
- `pnpm --filter darchie-web build` passes
- `pnpm --filter darchie-web test -- --run` passes
- `cd services/api && uv run pytest` should pass for the first SQL backend slice
- `pnpm --filter darchie-web exec playwright test tests/smoke.spec.ts` passes
- Verified routes include the marketing pages, auth pages, app shell pages, `/app/practice`, module landing pages for all four practice modules, a FastAPI-backed SQL workspace at `/app/practice/sql/session-retention-breakdown`, a focus-mode Python workspace at `/app/practice/python/events-normalization-job`, and a redesigned Data Modeling builder at `/app/practice/data-modeling/marketplace-core-entities`

## Doc Sync Needed
- Next sync work should happen when Python gets a real execution backend, when Data Modeling gains persistence/backend scoring, when Pipeline Builder adopts a dedicated focus-mode layout, and when the starter SQL sandbox is upgraded toward the fuller runtime architecture
