# 09 Component Finalization

## Purpose
Define the reusable components and app-specific components required to build DARCHIE v1 consistently.

## Decisions This Document Owns
- Component inventory
- Variant definitions
- critical states
- validation and interaction expectations

## Inputs / Dependencies
- `docs/02-design/07-frontend-ux-strategy.md`
- `docs/02-design/08-design-system-ui-foundations.md`
- `docs/01-product/04-prd.md`

## Required Sections
- Shared components
- practice workspace components
- visual builder components
- state rules

## Output Format
Component specification document.

## Completion Criteria
- Frontend implementation can build from a stable component set.
- Critical components have clear props and state behavior.

## Shared Components
| Component | Purpose | Key Variants / States |
| --- | --- | --- |
| `AppShell` | Global authenticated layout | desktop sidebar, mobile nav, collapsed sidebar |
| `MarketingHeader` | Public navigation | default, scrolled, mobile menu |
| `SectionHero` | Landing page sections | home, module, pricing |
| `Button` | Primary action control | primary, secondary, ghost, danger, loading, disabled |
| `Input` | Text input fields | default, error, success, with helper text |
| `Select` | Controlled selection | searchable, simple, error |
| `Modal` | Focused overlays | confirm, form, detail |
| `Toast` | Feedback messages | success, info, warning, error |
| `StatCard` | Metrics and highlights | dashboard, pricing, progress |
| `EmptyState` | No-content guidance | onboarding, no attempts, no results |

## Practice Workspace Components
| Component | Purpose | Key Props / Behavior |
| --- | --- | --- |
| `ExerciseHeader` | Context strip for exercise metadata | title, difficulty, timer, tags, save state |
| `PromptPanel` | Problem statement and hints | sections, collapsible hints, sticky on desktop |
| `MonacoEditorShell` | SQL/Python editor container | language, run, submit, reset, loading |
| `SchemaBrowser` | SQL table reference | expandable sections, searchable |
| `ResultPanel` | Execution or evaluation output | tabs for output, tests, explanation |
| `FeedbackSummary` | Scored result summary | score, strengths, issues, next steps |
| `ProgressWidget` | Module progress visualization | compact, full, dashboard variant |

## Visual Builder Components
| Component | Purpose | Key Props / Behavior |
| --- | --- | --- |
| `BuilderCanvas` | Main drag-and-drop area | mode, zoom, read-only, selection state |
| `NodePalette` | Node library | filterable by type and category |
| `PipelineNodeCard` | ETL step on canvas | type, status, validation state, selected |
| `DataModelEntityCard` | ERD entity representation | columns, keys, selected, invalid |
| `EdgeRenderer` | Relationship or dependency line | valid, invalid, warning |
| `ConfigDrawer` | Node/entity configuration | open state, validation, save/cancel |
| `SimulationTimeline` | Step playback | idle, running, paused, failed, completed |
| `CanvasToolbar` | Zoom, validate, simulate, reset | availability tied to current mode |

## Validation Rules
- Form components must surface inline validation before submission.
- Builder nodes show validation state at both node and global canvas level.
- Disabled actions must explain why they are unavailable.

## State Rules
- Loading states preserve context rather than blanking the workspace.
- Partial-save states are non-blocking and autosave-aware.
- Error banners should anchor near the relevant workspace section.
