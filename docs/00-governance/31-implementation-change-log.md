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

