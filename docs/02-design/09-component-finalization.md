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
| `AppShell` | Global authenticated layout | desktop sidebar, collapsed sidebar, focused top-header mode for editor-heavy exercise routes, mobile nav |
| `AppHeader` | Slimmer authenticated top chrome for focus routes | brand row, app nav pills, focus-mode treatment |
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
| `ModuleCard` | Practice hub module entry | title, interview skill, task shape, difficulty range, tags, CTA |
| `ModuleLandingPage` | Module overview plus starter exercise list | module summary, recommended exercise highlight, exercise grid |
| `WorkspacePage` | Route-level wrapper for a module workspace | module id, exercise id, routes SQL/Python into dedicated exercise workspaces and keeps shared shell for other mocked modules |
| `WorkspaceShell` | Shared practice layout across modules that still use the generic shell | responsive mobile tabs, desktop three-column shell, injected center surface |
| `ExerciseHeader` | Context strip for exercise metadata | title, difficulty, estimated time, tags, save state; sits above the focused exercise grid |
| `PromptPanel` | Problem statement and hints | prompt sections, collapsible support content, starter hint |
| `ResultPanel` | Execution or evaluation output | module-specific tabs, summary state, explanation copy |
| `WorkspaceStatusBar` | Lightweight status and feedback strip | save state, review state, idle/loading-style messaging |
| `SqlWorkspace` | Dedicated SQL exercise workspace | top header route chrome, sticky prompt rail, Monaco editor, action row under editor, schema browser, sticky review rail, FastAPI-backed preview states |
| `PythonWorkspace` | Dedicated Python exercise workspace | same focused exercise layout as SQL, Monaco editor, action row under editor, mocked preview/review states, reference section below editor |
| `WorkSurface` | Mock module-first center surface | ERD canvas placeholder, pipeline canvas placeholder, legacy generic mocked editor surfaces where dedicated workspaces are not used |

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
- SQL now has a functional editor-based preview path and Python now mirrors that editor-focused layout in mocked form; data-modeling and pipeline-builder remain layout-first.
