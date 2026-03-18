# D-ARCHIE Frontend Design Spec

## 1. Purpose
This document defines the canonical UI architecture for the shared D-ARCHIE web application.

It sits between the frontend HLD/LLD and actual implementation. It freezes:
- route and page inventory,
- shell variants,
- layout grammar by area,
- design-system foundations,
- candidate-first detailed screen design,
- shell-level layout direction for recruiting, admin, and reviewer areas,
- component ownership and visual hierarchy rules.

Parent documents:
- [`Frontend-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-HLD.md)
- [`Frontend-LLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-LLD.md)
- [`Frontend-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-CDS.md)

Reference direction used for structure and workflow patterns only:
- LeetCode workspace framing,
- HackerRank assessment workspace framing,
- Codility candidate interface framing,
- Greenhouse candidate and scorecard structure,
- MyGreenhouse candidate continuity patterns,
- Workday low-friction application-entry patterns.

Frozen design direction:
- stable product shell,
- enterprise calm tone,
- assessment-workspace + hiring-platform blend,
- candidate flow detailed first,
- subtle motion only,
- no text-heavy standalone pages,
- palette locked to `#293B5F`, `#47597E`, `#DBE6FD`, `#B2AB8C`.

## 2. Canonical App Shell

### 2.1 Shared Shell Principles
All protected role areas must feel like one application, not separate microsites.

Shared shell rules:
- fixed top header across protected areas,
- persistent left navigation on desktop,
- collapsible left nav on tablet,
- drawer navigation on mobile,
- slim utility footer across all areas,
- shell chrome stays stable during route changes,
- page actions remain local to pages and workspaces, not global footer actions.

### 2.2 Global Header
Header regions:
- brand area,
- current role context,
- global search placeholder,
- utility actions: notifications/help,
- user menu / session controls.

Header rules:
- fixed height,
- visible across candidate, recruiting, admin, reviewer areas,
- simplified form for public area,
- must not resize between routes.

### 2.3 Left Navigation
Desktop:
- persistent vertical sidebar.

Tablet:
- collapsible rail.

Mobile:
- hidden by default, opened as drawer.

Role-specific nav sets:
- candidate: only current session flow, progress, support/help, exit/return entry,
- recruiting: candidates, comparisons, reports,
- admin: assessments, versions, library, publish/review,
- reviewer: queue, active reviews, completed reviews.

### 2.4 Utility Footer
Global utility footer rules:
- slim height,
- never primary workflow control surface,
- contains environment label, support/help link, system status, lightweight legal/support copy,
- visually quieter than main content.

### 2.5 Shell Variants
#### Public Shell
- light top header,
- no persistent left navigation,
- utility footer present,
- centered content region.

#### Candidate Shell
- top header + compact left nav,
- session landing and completion use centered content layout inside shell,
- task route uses specialized assessment workspace inside shell.

#### Recruiting Shell
- top header + full left nav,
- page header + filter/action region,
- list/detail workspace model.

#### Admin Shell
- top header + full left nav,
- command bar under page header,
- central editor canvas,
- optional inspector or publish rail.

#### Reviewer Shell
- top header + full left nav,
- queue page and split review workspace,
- evidence pane + decision/comments pane.

## 3. Canonical Route and Page Inventory

### 3.1 Public Area
- `/`
  - redirect only
- `/login`
  - candidate-first entry page
- shared access-denied and recoverable error states render inside route shells, not as standalone products.

### 3.2 Candidate Area
- `/candidate/sessions/[sessionId]`
  - session landing page
- `/candidate/sessions/[sessionId]/task`
  - assessment workspace page
- `/candidate/sessions/[sessionId]/complete`
  - completion page

### 3.3 Recruiting Area
- `/recruiting/candidates`
  - candidate list / search / pipeline page
- `/recruiting/candidates/[candidateId]`
  - candidate scorecard summary page
- `/recruiting/candidates/[candidateId]/components/[componentId]`
  - component-level evidence and insight page
- `/recruiting/comparisons`
  - candidate comparison workspace

### 3.4 Admin Area
- `/admin/assessments`
  - assessment index page
- `/admin/assessments/[assessmentId]`
  - assessment overview page
- `/admin/assessments/[assessmentId]/versions/[versionId]/editor`
  - draft editor shell
- `/admin/assessments/[assessmentId]/versions/[versionId]/review`
  - review shell
- `/admin/assessments/[assessmentId]/versions/[versionId]/publish`
  - publish confirmation page
- `/admin/library`
  - reusable content library shell

### 3.5 Reviewer Area
- `/reviewer/queue`
  - review queue page
- `/reviewer/reviews/[reviewId]`
  - review detail workspace
- `/reviewer/reviews/[reviewId]/complete`
  - review submission confirmation page

## 4. Layout Grammar by Area

### 4.1 Public Layout
- two-panel entry layout,
- left: concise trust/context panel,
- right: focused sign-in/session-entry form,
- fixed desktop width,
- vertically calm presentation,
- stacked on tablet/mobile,
- no oversized marketing hero.

### 4.2 Candidate Layouts
#### Session Landing
- centered operational page inside candidate shell,
- header block,
- session summary grid,
- progress snapshot,
- primary CTA band,
- no giant display titles,
- critical information visible above the fold.

#### Task Workspace
- left sticky rail + right primary editor panel,
- left rail contains:
  - progress summary,
  - task context,
  - session context / metadata,
- right panel contains:
  - editor,
  - autosave/status strip,
  - save/finalize actions,
- aligned top baseline,
- editor is the dominant visual surface,
- shell chrome remains visible so the page feels like a workspace, not a standalone page.

#### Completion
- centered narrow acknowledgment page,
- success summary,
- session reference,
- next action,
- no oversized empty presentation.

### 4.3 Recruiting Layout
- shell header + left nav,
- page header,
- filter/action region,
- summary metrics row,
- list/detail composition,
- comparison view uses a two- or three-column comparison canvas.

### 4.4 Admin Layout
- shell header + left nav,
- page header + command bar,
- main editor canvas,
- optional right inspector rail,
- publish/review pages use more controlled centered layouts than the editor page.

### 4.5 Reviewer Layout
- shell header + left nav,
- queue page uses list and filter structure,
- review page uses split-pane evidence/scoring layout,
- completion page is narrow and centered.

## 5. Design System Foundations

### 5.1 Color System
#### Core palette
- primary: `#293B5F`
- secondary: `#47597E`
- surface: `#DBE6FD`
- accent: `#B2AB8C`

#### Role mapping
- `#293B5F`
  - primary actions,
  - major headings,
  - active nav states,
  - strong emphasis
- `#47597E`
  - support hierarchy,
  - labels,
  - helper copy,
  - inactive nav and icon color,
  - neutral badges
- `#DBE6FD`
  - page atmosphere,
  - soft shell backgrounds,
  - subtle rail and panel surfaces
- `#B2AB8C`
  - restrained accent chips,
  - warm secondary emphasis,
  - low-volume highlights only

### 5.2 Typography Rules
- serif only for page-level and section-level titles,
- sans-serif for navigation, labels, buttons, metadata, tables, helper text, and status copy,
- maximum of 3 title levels:
  - page title,
  - section title,
  - card title,
- titles must have width caps so they do not break layout rhythm,
- operational screens must prefer concise titles over editorial display copy.

### 5.3 Layout Tokens
Freeze:
- shell max widths,
- content max widths by page type,
- spacing scale,
- border-radius scale,
- elevation/shadow scale,
- desktop/tablet/mobile breakpoints,
- reserved status/error regions that do not push controls or primary layout blocks.

### 5.4 Surface Hierarchy
Differentiate visually between:
- application background,
- shell chrome,
- elevated content card,
- dense information tile,
- active workspace/editor surface,
- footer/utility strip.

### 5.5 Motion Rules
- subtle only,
- no button lift,
- no label-switch animations,
- no immediate flash overlays for fast actions,
- use delayed progress indication for slower actions,
- page transitions may fade or reveal gently,
- route and layout structure must remain stable during async work.

### 5.6 Shared Primitives
Formalize:
- `AppHeader`
- `SideNav`
- `UtilityFooter`
- `PageSection`
- `SurfaceCard`
- `InfoTile`
- `ActionBar`
- `StatusBadge`
- `LoadingSkeleton`
- `ErrorState`
- `EmptyState`

## 6. Route-to-Layout Mapping

### 6.1 Public
- `/login`
  - public shell + two-panel entry layout

### 6.2 Candidate
- `/candidate/sessions/[sessionId]`
  - candidate shell + centered operational page
- `/candidate/sessions/[sessionId]/task`
  - candidate shell + specialized assessment workspace
- `/candidate/sessions/[sessionId]/complete`
  - candidate shell + narrow acknowledgment layout

### 6.3 Recruiting
- `/recruiting/candidates`
  - recruiting shell + list/filter layout
- `/recruiting/candidates/[candidateId]`
  - recruiting shell + overview/detail layout
- `/recruiting/candidates/[candidateId]/components/[componentId]`
  - recruiting shell + evidence detail workspace
- `/recruiting/comparisons`
  - recruiting shell + comparison canvas

### 6.4 Admin
- all admin routes use admin shell,
- editor uses canvas + inspector pattern,
- publish/review use narrower confirmation/review layouts when appropriate.

### 6.5 Reviewer
- reviewer queue uses list layout,
- review detail uses split evidence/scoring workspace,
- completion uses centered acknowledgment layout.

## 7. Candidate-First Detailed Screen Spec

### 7.1 Login Page
Purpose:
- get the candidate into the platform with minimal friction,
- establish trust and clarity before entering the session flow.

Data required:
- no backend data on initial render,
- optional seeded local credential hints in dev mode.

Layout regions:
- top header,
- left trust/context panel,
- right sign-in/session-entry panel,
- reserved status/error region inside the form,
- utility footer.

Primary CTA:
- login and create session.

Secondary actions:
- retry session creation when auth already succeeded but session creation failed.

Failure handling:
- auth failure remains inline inside reserved error region,
- session creation failure keeps user context and offers retry,
- feedback must not push controls or change form height suddenly.

Responsive behavior:
- split layout on desktop,
- stacked on tablet/mobile.

Owning components:
- `AppHeader`
- `UtilityFooter`
- public shell layout
- login page route
- shared field and status primitives.

### 7.2 Candidate Session Landing
Purpose:
- orient the candidate before beginning or resuming work,
- present the next action clearly.

Data required:
- session summary,
- current unit,
- progress snapshot.

Layout regions:
- top shell header,
- compact session intro block,
- summary facts grid,
- CTA band,
- utility footer.

Primary CTA:
- start session or continue task.

Failure handling:
- unavailable state inside candidate shell,
- safe navigation path back to login.

Responsive behavior:
- single-column content layout,
- summary grid collapses at smaller widths.

Owning components:
- `AppHeader`
- candidate `SideNav`
- `SessionLandingCard`
- `InfoTile`
- `ActionBar`
- `CandidateErrorBanner`
- `UtilityFooter`.

### 7.3 Candidate Task Workspace
Purpose:
- provide a focused, low-friction work surface.

Data required:
- current unit,
- progress state,
- latest draft if present,
- response summary if available.

Layout regions:
- shell header,
- compact candidate nav,
- left sticky rail,
- right editor workspace,
- local action row,
- utility footer.

Primary CTA:
- finalize response.

Secondary actions:
- save now.

Failure handling:
- autosave failure is non-destructive,
- missing task/session stays inside guarded candidate shell,
- loading uses workspace-shaped skeletons rather than unrelated full-page cards.

Responsive behavior:
- two-zone workspace on desktop,
- stacked workspace on tablet/mobile,
- progress/context move above editor on narrow screens.

Owning components:
- `AppHeader`
- candidate `SideNav`
- `TaskShell`
- `ProgressHeader`
- `ResponseEditorShell`
- `AutosaveStatusBadge`
- `ActionBar`
- `LoadingSkeleton`
- `CandidateErrorBanner`
- `UtilityFooter`.

### 7.4 Candidate Completion
Purpose:
- confirm successful flow completion,
- provide a stable stopping point and next action.

Data required:
- session id,
- optional session summary later.

Layout regions:
- shell header,
- centered acknowledgment card,
- next-action region,
- utility footer.

Primary CTA:
- start another session.

Failure handling:
- no special failure view beyond shared route error handling.

Responsive behavior:
- narrow centered layout across breakpoints.

Owning components:
- `AppHeader`
- candidate `SideNav`
- completion page route,
- `ActionBar`
- `UtilityFooter`.

## 8. Recruiting/Admin/Reviewer Shell Guidance
These areas are planned now so future implementation does not improvise shell design.

### 8.1 Recruiting
- emphasis on list/detail navigation,
- higher information density than candidate area,
- persistent filter and comparison affordances,
- scorecard and evidence surfaces use tiles and tabs, not editorial cards.

### 8.2 Admin
- emphasis on structured editing and publishing,
- left nav + central canvas + optional inspector,
- low-motion, tool-like experience,
- clear distinction between overview pages and active editing pages.

### 8.3 Reviewer
- emphasis on evidence review and decision submission,
- split workspace,
- strong comment/rubric visibility,
- queue and completion pages simpler than active review workspace.

## 9. Responsive Rules
- desktop: full shell with persistent left nav,
- tablet: collapsible or icon-first left rail,
- mobile: drawer navigation and stacked content,
- utility footer remains visible but simplified on narrow screens,
- workspace layouts stack in reading order without losing context.

## 10. Acceptance of This Spec
A future implementer must be able to answer from this document alone:
- how many pages and subpages exist,
- which shell each route uses,
- where header, sidebar, footer, and page-local action bars appear,
- which components own each major region,
- how candidate-first screens should look structurally,
- how later recruiting/admin/reviewer areas should be framed before detailed implementation.
