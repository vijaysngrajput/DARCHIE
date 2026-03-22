# 30 High-Fidelity Screen Specs

## Purpose
Define implementation-ready high-fidelity screen specifications for the currently implemented first DARCHIE pages across desktop and mobile.

## Decisions This Document Owns
- Final screen composition
- Grid behavior
- Responsive layout adaptations
- Content emphasis placement
- Page-specific state handling

## Inputs / Dependencies
- `docs/02-design/10-wireframes-screen-specs.md`
- `docs/02-design/26-visual-direction-spec.md`
- `docs/02-design/27-component-style-spec.md`
- `docs/02-design/28-motion-spec.md`
- `docs/02-design/29-screen-content-spec.md`
- implemented frontend in `apps/web`

## Required Sections
- Desktop screen specs
- mobile adaptations
- state behavior
- implementation notes

## Output Format
High-fidelity text specification for primary screens.

## Completion Criteria
- The current first pages can be implemented or reviewed without guessing composition, hierarchy, or responsive behavior.

## Grid System
- Marketing pages: 12-column grid, max width `1280px`
- Auth pages: centered constrained card layout, form card around `500px` max width
- App pages: fixed sidebar + wide content canvas with spacious page header composition

## Home Page
### Desktop
- Hero uses an editorial split layout
- Left side contains eyebrow badge, headline, supporting text, premium primary CTA, secondary CTA, and compact proof statements
- Right side contains one dominant product preview composition inside an elevated panel
- Product preview combines readiness stats, pipeline builder preview, and one recommendation callout without awkward overlap
- Follow-up content uses one larger asymmetrical explanation block plus two supporting panels

### Mobile
- Hero stacks vertically
- Editorial preview sits below the CTA cluster
- Proof statements become vertically stacked blocks
- Supporting panels stack without overlap

## Modules Page
### Desktop
- Intro header followed by a 2x2 summary grid
- Module cards use stronger padding and minimum height so content feels balanced and visible
- No detailed alternating feature sections are currently present

### Mobile
- Summary grid becomes a single-column stack
- Cards preserve spacing and readable line height

## Pricing Page
### Desktop
- Three-card pricing layout centered in the content frame
- Middle card is featured with stronger elevation and slightly more emphasis
- No comparison table or FAQ section is currently implemented

### Mobile
- Pricing cards stack vertically
- Featured plan remains visually stronger without requiring extra sections below

## About Page
### Desktop
- Simple marketing-shell content flow with premium spacing and restrained panel usage

### Mobile
- Single-column flow throughout

## Auth Screens
### Desktop
- Split layout with left-side brand/message region and right-side elevated form card
- Form card uses warm premium surface treatment rather than bright white

### Mobile
- Full-width content with comfortable outer padding
- No split layout

## Onboarding
### Desktop
- Current onboarding remains shell-level and layout-first rather than a complete multi-step interaction

### Mobile
- Simple stacked layout

## Dashboard
### Desktop
- Spacious page header spans the top
- Three readiness cards in a row
- Content below uses a split layout with momentum on the left and one featured recommendation on the right
- No recent attempts feed or module progress grid is currently implemented

### Mobile
- Summary cards stack
- Recommendation panel appears after the main summary flow

## State Behavior
### Dashboard loading
- Existing component and page structure should be preserved during future loading states
- Skeletons should mirror the summary cards and recommendation panel layout

## Practice Hub
### Desktop
- Page header sits above a four-card module grid
- Grid should read as one cohesive module selection surface, with balanced card heights and enough room for skill summary, task shape, difficulty range, and tags
- Cards should feel actionable but not overloaded with secondary metadata

### Mobile
- Module cards stack in a single column
- CTA placement stays visible without pushing tags or summaries into cramped wrapping

## Practice Module Landing Pages
### Desktop
- Header sits above a two-column row with module overview on the left and a highlighted recommended exercise on the right
- Exercise cards render below in a three-column grid with equal visual weight and clear call-to-action placement
- The featured recommended exercise can reuse the same title as a card below, so tests and accessibility hooks should target semantics precisely

### Mobile
- Overview and recommendation panels stack before the exercise list
- Exercise cards become a single-column feed with preserved spacing and tap targets

## Practice Workspaces
### Desktop
- Focused SQL, Python, Data Modeling, and Pipeline Builder exercise routes use a slimmer top app header rather than the heavier desktop sidebar
- Exercise header sits above a three-column grid: sticky prompt rail, central module surface, and sticky result panel
- Primary actions such as `Reset`, `Run`, and `Submit` sit directly beneath the editor in one aligned row
- Status messaging stays grouped with the editor action area rather than floating elsewhere on the page
- SQL keeps schema/reference material beneath the editor, Python keeps input/review reference material beneath the editor, and Data Modeling plus Pipeline Builder are the builder-first exceptions: no route-level exercise header card, compact full-width prompt plus brainstorming scratchpad above the workspace, dominant React Flow canvas with a subtle dot-grid drafting texture in the center, full-height builder palette on the right, and validation/review moved into a full-width bottom surface

### Mobile
- Workspace collapses into segmented tabs for prompt, workspace, and review
- Shared shell content remains the same, but only one section is visible at a time to preserve readability
- Duplicate surface text may appear across responsive regions in the DOM, so validation and test coverage should account for responsive duplication instead of assuming unique text nodes

### Empty dashboard
- When implemented later, empty state should preserve the current spacious composition and one strong CTA

### Auth error
- Inline field error plus optional top-level summary banner for global failure

## Implementation Notes
- Page specs should continue using reusable section primitives rather than custom wrappers per screen
- Marketing pages should preserve the editorial, calmer hierarchy introduced in the premium redesign
- Dashboard and app pages should continue reusing `PageHeader`, `Panel`, and shell primitives rather than inventing dashboard-specific chrome
- Practice pages should keep using shared workspace primitives, but SQL, Python, and Data Modeling now justify dedicated focus-mode exercise layouts because they rely on sticky context and a dominant central work surface
- Pipeline Builder should now follow that same dedicated focus-mode builder pattern rather than the old generic shell
- Data Modeling should continue using a curated hybrid shape set for architectural expression, while blocking validation remains scoped to ERD entities and relationships
- Pipeline Builder should use a searchable curated branded infrastructure shape set for architecture storytelling, while blocking validation remains scoped to graph logic rather than shape presence
- Data Modeling should prefer inline node editing for entity names, field names, field types, PK/nullable/FK state, and field ordering rather than relying on persistent side inspectors or duplicated action bars
- Data Modeling should expose lightweight canvas tooling that feels closer to a diagram product: zoom percentage, direct zoom in/out controls, shortcut guidance, larger connector handles, relaxed connection flow, and a drafting-style canvas background without reintroducing heavy floating utility bars
- Featured marketing previews and high-value workspace shells may use the shared metallic panel treatment, but routine panels should stay neutral
