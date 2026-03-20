# 01 Master Document Index

## Purpose
Provide the source of truth for the full planning pack for the Data Engineering Practice Platform, a production-grade web product for job seekers preparing for data engineering interviews.

This document owns:
- The document inventory
- Standard document template rules
- Folder and naming conventions
- Dependency order
- Completion and review criteria

## Product Context
- Working product name: `DARCHIE`
- Primary audience for v1: job-seeking data engineers
- Initial product shape: full marketing website plus authenticated practice application
- Core practice areas: SQL, Python, data modeling, ETL/pipeline design, visual data processing
- Delivery goal: produce an implementation-ready planning pack that a code engine can use to build the product end to end

## Standard Template For Every Document
Every document in this pack must contain the following sections, in this order unless the document naturally requires a more specialized layout:

1. `Purpose`
2. `Decisions This Document Owns`
3. `Inputs / Dependencies`
4. `Required Sections`
5. `Output Format`
6. `Completion Criteria`
7. Core content

## Folder Structure
- `docs/00-governance`
- `docs/01-product`
- `docs/02-design`
- `docs/03-architecture`
- `docs/04-delivery`

## Naming Convention
Use numbered markdown documents so the pack can be consumed in sequence by both humans and code agents.

- `01-master-index.md`
- `02-product-vision.md`
- `03-business-review.md`
- `04-prd.md`
- `05-user-personas-journey-maps.md`
- `06-information-architecture.md`
- `07-frontend-ux-strategy.md`
- `08-design-system-ui-foundations.md`
- `09-component-finalization.md`
- `10-wireframes-screen-specs.md`
- `11-high-level-design.md`
- `12-low-level-design.md`
- `13-domain-model-data-model-spec.md`
- `14-api-contract-specification.md`
- `15-practice-engine-specification.md`
- `16-visual-builder-interaction-spec.md`
- `17-content-curriculum-specification.md`
- `18-security-privacy-compliance-baseline.md`
- `19-non-functional-requirements.md`
- `20-testing-strategy.md`
- `21-devops-environment-strategy.md`
- `22-implementation-plan.md`
- `23-prompt-pack-for-code-engine.md`
- `24-launch-readiness-checklist.md`
- `25-tech-stack-decision.md`

## Document Inventory
| ID | Path | Owner | Status | Depends On | Consumed By | Completion Criteria |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | `docs/00-governance/01-master-index.md` | Product lead | Complete | None | All docs | Inventory, template, naming, dependencies, review criteria defined |
| 02 | `docs/01-product/02-product-vision.md` | Product lead | Complete | 01 | 03, 04, 05, 06, 11 | Problem, thesis, user, differentiation, v1 boundaries locked |
| 03 | `docs/01-product/03-business-review.md` | Founder | Complete | 01, 02 | 04, 22, 24 | Market, competitors, pricing, risks, goals defined |
| 04 | `docs/01-product/04-prd.md` | Product lead | Complete | 02, 03 | 06, 07, 09, 10, 11, 12, 22 | Scope, epics, requirements, non-goals, acceptance criteria finalized |
| 05 | `docs/01-product/05-user-personas-journey-maps.md` | Product/design | Complete | 02, 04 | 06, 07, 10, 17 | Core personas and journey stages defined |
| 06 | `docs/01-product/06-information-architecture.md` | Product/design | Complete | 04, 05 | 07, 10, 11, 14 | Public and app routes, navigation, route groups finalized |
| 07 | `docs/02-design/07-frontend-ux-strategy.md` | Design lead | Complete | 04, 05, 06 | 08, 09, 10, 19, 20 | UX principles, responsive behavior, states, accessibility set |
| 08 | `docs/02-design/08-design-system-ui-foundations.md` | Design lead | Complete | 07 | 09, 10, implementation | Tokens and visual rules are implementation-ready |
| 09 | `docs/02-design/09-component-finalization.md` | Design/FE lead | Complete | 07, 08, 04 | 10, implementation | Components, variants, states, validation behavior documented |
| 10 | `docs/02-design/10-wireframes-screen-specs.md` | Design lead | Complete | 06, 07, 08, 09 | implementation | Key screens and states documented for desktop and mobile |
| 11 | `docs/03-architecture/11-high-level-design.md` | Tech lead | Complete | 04, 06 | 12, 14, 18, 19, 21, 22 | System boundaries and major subsystems locked |
| 12 | `docs/03-architecture/12-low-level-design.md` | Tech lead | Complete | 11, 04 | 13, 14, 15, 16, 20, 22 | Module behavior and internal contracts detailed |
| 13 | `docs/03-architecture/13-domain-model-data-model-spec.md` | Backend lead | Complete | 12 | 14, implementation | Entities, relations, lifecycle, data constraints defined |
| 14 | `docs/03-architecture/14-api-contract-specification.md` | Backend lead | Complete | 11, 12, 13 | FE/BE implementation, tests | External and internal contracts specified |
| 15 | `docs/03-architecture/15-practice-engine-specification.md` | Product/tech | Complete | 12, 13 | 14, 16, implementation | Exercise model, run, validation, scoring defined |
| 16 | `docs/03-architecture/16-visual-builder-interaction-spec.md` | FE/UX lead | Complete | 09, 10, 12, 15 | implementation, tests | Canvas behaviors and simulation rules explicit |
| 17 | `docs/01-product/17-content-curriculum-specification.md` | Content lead | Complete | 04, 05, 15 | implementation, launch | Launch curriculum and authoring standards defined |
| 18 | `docs/03-architecture/18-security-privacy-compliance-baseline.md` | Security/tech lead | Complete | 11, 12, 14 | 21, 24, implementation | Security posture and policy inputs captured |
| 19 | `docs/03-architecture/19-non-functional-requirements.md` | Tech lead | Complete | 11, 18 | 20, 21, 24 | Reliability, performance, accessibility targets fixed |
| 20 | `docs/04-delivery/20-testing-strategy.md` | QA/tech lead | Complete | 04, 12, 14, 16, 19 | 22, implementation | Test layers, gates, ownership, coverage criteria set |
| 21 | `docs/04-delivery/21-devops-environment-strategy.md` | Platform lead | Complete | 11, 18, 19 | 22, implementation, launch | Environments, CI/CD, monitoring, backups defined |
| 22 | `docs/04-delivery/22-implementation-plan.md` | Tech/product lead | Complete | 04, 11, 12, 20, 21 | 23 | Milestones, streams, dependencies, release slices defined |
| 23 | `docs/04-delivery/23-prompt-pack-for-code-engine.md` | Product/tech lead | Complete | 22 plus all design and architecture docs | Build execution | Prompt set can be handed to a code engine directly |
| 24 | `docs/04-delivery/24-launch-readiness-checklist.md` | Founder/ops | Complete | 03, 18, 19, 20, 21, 22 | Launch | Go-live checks and rollback readiness documented |
| 25 | `docs/00-governance/25-tech-stack-decision.md` | Tech/product lead | Complete | 02, 04, 07, 11, 22 | Build execution, bootstrap | Final frontend and backend stack explicitly approved |

## Review Rules
The pack is valid only if all of the following are true:
- Every build-critical decision has exactly one owning document.
- No document leaves product, design, architecture, or delivery decisions as `TBD`.
- Public website and authenticated app are both covered.
- Visual builder logic is specified separately from general frontend docs.
- The pack can be executed incrementally by a code engine without missing dependencies.

## Final Review Checklist
- Product strategy is coherent from vision through pricing and launch assumptions.
- UX and UI docs are detailed enough for implementation without a designer in the loop.
- Architecture docs define a realistic production path for v1.
- Security, testing, and operations expectations are present before implementation starts.
- Prompt pack aligns exactly with the implementation plan.
