# 31 Implementation Change Log

## Purpose
Maintain an append-only record of meaningful implementation changes that affect product, design, architecture, or delivery documents.

## Decisions This Document Owns
- What implementation deltas have occurred relative to the planning pack
- Which formal docs were updated to stay aligned
- Which follow-up doc sync items are still pending

## Inputs / Dependencies
- `01-master-index.md`
- Active implementation state
- Relevant product, design, architecture, and delivery docs

## Required Sections
- Logging rules
- Append-only entries

## Output Format
Chronological markdown log. New entries are appended at the bottom. Each entry includes date, area changed, code change summary, docs updated, and follow-up required.

## Completion Criteria
- Every meaningful implementation slice that changes intended behavior has an entry
- Each entry makes doc-sync status clear
- Follow-up doc work is explicit when not completed in the same slice

## Logging Rules
- Record only meaningful implementation changes with product, UX, architecture, testing, or delivery significance
- Do not log tiny internal refactors that do not affect the documented plan
- If doc sync is intentionally deferred, say so explicitly in `Follow-up required`

## Entries

### 2026-03-20 — Frontend foundation bootstrap
- Area changed: frontend foundation, route shells, testing baseline
- What changed in code: bootstrapped the Next.js app in `apps/web` with theme provider, token system, marketing/auth/app shells, base UI primitives, placeholder routes, Vitest coverage, and Playwright smoke coverage
- Docs updated: none at implementation time
- Follow-up required: align design docs with the actual implemented shell behavior and page composition where they diverge from the original planning pack

### 2026-03-20 — Premium UI redesign
- Area changed: visual tokens, chrome, homepage, pricing, dashboard
- What changed in code: replaced the initial palette with a more premium neutral-led system, redesigned panels/buttons/badges/inputs, refined header/footer/sidebar/mobile nav, and reworked homepage, pricing, and dashboard composition for a calmer enterprise-premium feel
- Docs updated: none yet in the design set
- Follow-up required: sync `08-design-system-ui-foundations.md`, `26-visual-direction-spec.md`, `27-component-style-spec.md`, `29-screen-content-spec.md`, and `30-high-fidelity-screen-specs.md` to the implemented redesign

### 2026-03-20 — Documentation governance layer added
- Area changed: implementation documentation process
- What changed in code: added tracked governance docs for implementation change history and current execution memory; updated the master index with sync rules and new document ownership
- Docs updated: `01-master-index.md`, `31-implementation-change-log.md`, `32-implementation-context-log.md`
- Follow-up required: keep both governance docs updated after every meaningful implementation slice

### 2026-03-20 — Premium UI refinement pass
- Area changed: hero CTA styling, light-mode balance, modules page card fit
- What changed in code: changed the homepage primary CTA to a premium badge-like treatment, added more warmth and surface separation to light mode, and fixed module cards so they have proper padding, height, and readability
- Docs updated: `31-implementation-change-log.md`, `32-implementation-context-log.md`
- Follow-up required: fold these refinements into the upcoming design-doc synchronization pass

### 2026-03-20 — Header premium refinement
- Area changed: marketing header and brand treatment
- What changed in code: redesigned the header nav links into premium pill-style menu items, upgraded the DARCHIE logo treatment with an icon mark and subtitle, and aligned the header `Start practicing` CTA with the premium badge-like styling used in the hero
- Docs updated: `31-implementation-change-log.md`, `32-implementation-context-log.md`
- Follow-up required: include the refined header/brand system in the design-doc synchronization pass

### 2026-03-20 — Playwright web server stabilization
- Area changed: frontend verification workflow
- What changed in code: updated the Playwright web-server command to clear stale `.next` artifacts before starting the Next dev server so smoke runs do not fail with runtime chunk resolution errors
- Docs updated: `31-implementation-change-log.md`, `32-implementation-context-log.md`
- Follow-up required: document the stable verification workflow in the testing/doc sync pass if this remains the long-term approach

### 2026-03-20 — Root README added
- Area changed: developer onboarding documentation
- What changed in code: added a root README with devcontainer usage, website run instructions, key routes, test/build commands, and pointers to the governance docs
- Docs updated: `README.md`, `31-implementation-change-log.md`, `32-implementation-context-log.md`
- Follow-up required: expand the README later when backend startup and full-stack flows are implemented

### 2026-03-21 — Premium UI docs synchronized
- Area changed: design documentation alignment
- What changed in code/docs: synchronized the main design docs to the implemented premium UI system, including the current token set, visual direction, component behavior, and homepage/modules/pricing/dashboard composition
- Docs updated: `08-design-system-ui-foundations.md`, `26-visual-direction-spec.md`, `27-component-style-spec.md`, `29-screen-content-spec.md`, `30-high-fidelity-screen-specs.md`, `31-implementation-change-log.md`, `32-implementation-context-log.md`
- Follow-up required: keep future design refinements synced as implementation continues into practice workspaces

### 2026-03-21 — Practice playground layout foundation
- Area changed: practice hub, module landing pages, shared workspace shell
- What changed in code: turned `/app/practice` into a module-first hub, added module landing pages for SQL, Python, Data Modeling, and Pipeline Builder, introduced a shared mocked workspace shell with prompt/work/review regions and module-specific center surfaces, and added route coverage plus component tests for the new layout slice
- Docs updated: `09-component-finalization.md`, `29-screen-content-spec.md`, `30-high-fidelity-screen-specs.md`, `31-implementation-change-log.md`, `32-implementation-context-log.md`
- Follow-up required: wire real editors/builders, execution flows, persistence, and richer module catalogs in later slices; keep practice docs synced as mocked surfaces become functional

### 2026-03-21 — Homepage entry routed into practice preview
- Area changed: homepage-to-app entry flow
- What changed in code: updated the public `Start practicing` CTAs to land in `/app/practice` instead of `/signup`, and added preview-state messaging in the practice hub so the module experience is openly accessible while deeper features remain intentionally restrictable later
- Docs updated: `31-implementation-change-log.md`, `32-implementation-context-log.md`
- Follow-up required: decide which practice capabilities stay open in preview mode versus which actions should later require sign-in, persistence, or paid access

### 2026-03-21 — First functional SQL module slice
- Area changed: SQL workspace, FastAPI preview backend, SQL runtime documentation
- What changed in code: replaced the mocked SQL center surface with a Monaco-based SQL workspace that loads exercise details, saves drafts, runs preview queries, and submits for structured feedback through a new FastAPI backend slice; added the first SQL exercise fixture, starter sandbox runner, and backend tests
- Docs updated: `README.md`, `11-high-level-design.md`, `14-api-contract-specification.md`, `15-practice-engine-specification.md`, `31-implementation-change-log.md`, `32-implementation-context-log.md`
- Follow-up required: evolve the starter SQL sandbox toward the planned dedicated MySQL-backed execution path, add real persistence/auth/entitlements, and bring Python onto the same functional contract

### 2026-03-21 — SQL and Python exercise UX refinement
- Area changed: SQL workspace layout, Python exercise workspace, app-shell focus mode, design doc alignment
- What changed in code: reworked SQL exercise pages into a focus-mode layout with top header chrome, sticky prompt and review rails, aligned editor actions, and schema beneath the editor; mirrored the same UX structure for Python with a dedicated Monaco-based mocked workspace; improved collapsed sidebar reopen behavior for non-focus routes
- Docs updated: `README.md`, `08-design-system-ui-foundations.md`, `09-component-finalization.md`, `29-screen-content-spec.md`, `30-high-fidelity-screen-specs.md`, `31-implementation-change-log.md`, `32-implementation-context-log.md`
- Follow-up required: keep Data Modeling and Pipeline Builder in sync when they move from the generic shell to dedicated focus-mode workspaces, and document Python runtime architecture separately once it stops being mocked

### 2026-03-21 — Data Modeling interactive builder v1
- Area changed: Data Modeling workspace, React Flow ERD builder, focus-mode shell expansion, builder documentation
- What changed in code: replaced the placeholder Data Modeling surface with a dedicated focus-mode ERD builder using React Flow, draggable entity creation, relationship editing with cardinality, right-rail entity/relationship configuration, real frontend validation, local draft-save messaging, and mocked submit/review output
- Docs updated: `README.md`, `08-design-system-ui-foundations.md`, `09-component-finalization.md`, `29-screen-content-spec.md`, `30-high-fidelity-screen-specs.md`, `31-implementation-change-log.md`, `32-implementation-context-log.md`
- Follow-up required: add persistence, backend-backed validation/scoring, and bring Pipeline Builder onto the same dedicated focus-mode builder pattern

### 2026-03-21 — Data Modeling UX redesign
- Area changed: Data Modeling workspace layout, palette system, builder review flow, documentation
- What changed in code: removed the route-level exercise header from the Data Modeling exercise page, kept the sticky prompt rail on the left, replaced the right-side configuration rail with a curated builder palette, added hybrid ERD plus support-shape creation on the React Flow canvas, moved validation/review into a full-width surface beneath the canvas, and kept validation blocking scoped to ERD entities and relationships only
- Docs updated: `README.md`, `08-design-system-ui-foundations.md`, `09-component-finalization.md`, `29-screen-content-spec.md`, `30-high-fidelity-screen-specs.md`, `31-implementation-change-log.md`, `32-implementation-context-log.md`
- Follow-up required: add persistence and backend-backed scoring for ERD objects, decide whether support shapes should gain richer inline editing later, and bring Pipeline Builder onto a similarly premium builder-first layout
