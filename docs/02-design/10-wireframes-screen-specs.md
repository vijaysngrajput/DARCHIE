# 10 Wireframes And Screen Specs

## Purpose
Define the key screens and layout expectations for DARCHIE v1 across public and authenticated experiences.

## Decisions This Document Owns
- Screen inventory
- page-level layout behavior
- critical desktop and mobile adaptations

## Inputs / Dependencies
- `docs/01-product/06-information-architecture.md`
- `docs/02-design/07-frontend-ux-strategy.md`
- `docs/02-design/08-design-system-ui-foundations.md`
- `docs/02-design/09-component-finalization.md`

## Required Sections
- Screen list
- desktop layouts
- mobile layouts
- state requirements

## Output Format
Low-fidelity wireframe spec in text form.

## Completion Criteria
- Engineers can implement key screens without missing layout decisions.
- Responsive expectations are explicit.

## Key Screens
1. Home page
2. Modules overview page
3. Pricing page
4. Sign-up / sign-in pages
5. Onboarding flow
6. Dashboard
7. Practice listing page
8. SQL exercise workspace
9. Python exercise workspace
10. Data modeling workspace
11. Pipeline builder workspace
12. Mock interview session page
13. Progress page
14. Settings and billing pages

## Desktop Layout Specs
### Home Page
- Hero with left-aligned message and right-side product visual
- Module comparison strip
- How-it-works section with 3-step flow
- Testimonial/trust area
- Final CTA section

### Dashboard
- Top summary row with readiness cards
- Recommended exercises panel
- Recent attempts feed
- Module progress grid

### SQL / Python Workspace
- Left: prompt panel
- Center: code editor
- Right: result and feedback panel
- Sticky top bar with timer, save state, actions

### Data Modeling Workspace
- Left: prompt and constraints
- Center: ERD canvas
- Right: entity configuration and validation summary

### Pipeline Builder Workspace
- Full-width prompt and scratchpad above the workspace
- Center: builder canvas
- Right: searchable branded node palette
- Bottom: validation, simulation, and review surface

## Mobile Layout Specs
- Marketing pages stack vertically with reduced visual density
- Dashboard collapses summary cards into swipeable or stacked cards
- Practice listing remains fully usable
- SQL and Python workspaces become tabbed:
  - Prompt
  - Editor
  - Results
- Data modeling and pipeline builder support review-first mode with simplified editing and horizontal canvas panning

## Required States
- first-time empty state
- saved draft state
- timed mode state
- validation failure state
- execution loading state
- premium lock state
