# 07 Frontend UX Strategy

## Purpose
Define the UX principles and interaction standards for DARCHIE so the product feels credible, approachable, and implementable without a dedicated design team.

## Decisions This Document Owns
- UX principles
- Core interaction philosophy
- Responsive behavior rules
- Accessibility expectations
- Feedback and state patterns

## Inputs / Dependencies
- `docs/01-product/04-prd.md`
- `docs/01-product/05-user-personas-journey-maps.md`
- `docs/01-product/06-information-architecture.md`

## Required Sections
- UX principles
- responsive rules
- state handling
- accessibility standards

## Output Format
Frontend experience strategy document.

## Completion Criteria
- Engineers can implement interfaces with consistent UX behavior.
- Key interactive states are defined, not improvised.

## UX Principles
- Guide before you judge.
- Keep complex workflows visually structured.
- Show progress and momentum everywhere.
- Make practice feel purposeful, not game-like or toy-like.
- Use visual hierarchy to reduce fear for first-time users.

## Interaction Philosophy
- Onboarding should ask for only enough information to personalize recommendations.
- Every practice page should keep the problem statement, action controls, and feedback panel visible.
- Feedback should separate `what happened`, `why it matters`, and `what to try next`.
- Timed modes should create focus, not panic.

## Responsive Behavior
- Desktop first for workspaces and visual builders.
- Tablet support must preserve core workflows.
- Mobile should support browsing, review, dashboard, and limited exercise interaction.
- Data modeling and visual pipeline builders on mobile should default to review mode with constrained edit interactions rather than full authoring parity.

## State Patterns
### Loading
- Use skeletons for dashboard cards, exercise metadata, and list views.
- Use explicit loading overlay for long-running execution tasks.

### Empty
- Empty states must recommend a next action.
- Empty progress views should point users to their first exercise.

### Success
- Use clear score/result panels with celebratory restraint.
- Show saved state confirmation without blocking the workspace.

### Error
- Differentiate validation errors, execution errors, and system errors.
- Recovery steps must be actionable.

## Accessibility Standards
- Target WCAG 2.2 AA for all public and authenticated surfaces.
- Keyboard access is required for all major actions.
- Canvas-based interactions require keyboard alternatives for node selection and connection management.
- Color cannot be the only carrier of meaning for statuses.
- Focus states must be highly visible and consistent.
