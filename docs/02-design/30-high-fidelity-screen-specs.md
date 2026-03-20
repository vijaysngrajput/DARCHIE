# 30 High-Fidelity Screen Specs

## Purpose
Define implementation-ready high-fidelity screen specifications for the first DARCHIE pages across desktop and mobile.

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

## Required Sections
- Desktop screen specs
- mobile adaptations
- state behavior
- implementation notes

## Output Format
High-fidelity text specification for primary screens.

## Completion Criteria
- The first pages can be implemented without guessing layout, density, or visual emphasis.

## Grid System
- Marketing pages: 12-column grid, max width `1200px`
- Auth pages: centered constrained card layout, max content width `480px`
- App pages: fixed sidebar + 12-column content grid

## Home Page
### Desktop
- Hero split 6/6 columns
- Left: eyebrow, headline, supporting text, primary and secondary CTA
- Right: layered product preview with dashboard + builder card overlap
- Product proof strip in 4 equal cards beneath hero
- Alternate light/dark section rhythm not required; keep one coherent theme and vary surfaces instead

### Mobile
- Hero stacks vertically
- Product preview below CTA cluster
- Proof strip becomes stacked cards

## Modules Page
### Desktop
- Header section with title and short explanatory subcopy
- 2x2 module summary grid
- Full-width detailed sections below with illustration and text alternating alignment

### Mobile
- Summary grid becomes stacked cards
- Detailed sections become single-column

## Pricing Page
### Desktop
- Three-card pricing layout centered in content frame
- Middle card highlighted with elevated treatment
- Comparison table below on full width

### Mobile
- Pricing cards stack
- Comparison table becomes grouped feature lists

## About Page
### Desktop
- Intro mission block
- Two-column philosophy section
- Vision section with timeline or principle cards

### Mobile
- Single-column flow throughout

## Auth Screens
### Desktop
- Split background treatment with centered form card
- Left side may show muted product message or trust cue
- Form card uses panel/elevated surface with strong focus on primary action

### Mobile
- Full-width content with comfortable outer padding
- No split layout

## Onboarding
### Desktop
- Centered step card with progress rail above
- Supporting recommendation panel may appear to the right on later steps

### Mobile
- Single-column step flow
- Sticky bottom primary action

## Dashboard
### Desktop
- Welcome header spans full width
- Summary cards in 4-column row
- Recommendations and recent attempts in 8/4 split
- Module progress grid below

### Mobile
- Summary cards become stacked or horizontally scrollable
- Recommendations shown before recent attempts

## State Behavior
### Dashboard loading
- skeletons for summary cards, recommendation card, and attempt list

### Empty dashboard
- prominent onboarding-completion-style empty state with single CTA

### Auth error
- inline field error plus top-level summary banner only for global failure

## Implementation Notes
- Page specs should be implemented with reusable section primitives, not page-specific ad hoc wrappers
- Marketing pages should reuse a single section container pattern
- Dashboard and app pages should reuse page-header and panel primitives
