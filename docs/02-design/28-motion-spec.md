# 28 Motion Spec

## Purpose
Define the animation and transition system for DARCHIE so motion improves clarity and polish without distracting from technical workflows.

## Decisions This Document Owns
- Motion principles
- Animation token set
- Component animation behavior
- Page and overlay transitions
- Builder-specific interaction motion

## Inputs / Dependencies
- `docs/02-design/07-frontend-ux-strategy.md`
- `docs/02-design/26-visual-direction-spec.md`
- `docs/02-design/27-component-style-spec.md`

## Required Sections
- Motion principles
- timing tokens
- component motion
- page motion
- builder motion

## Output Format
Implementation-ready motion design specification.

## Completion Criteria
- Engineers can implement all standard animations without inventing motion behavior.

## Motion Principles
- Motion should explain hierarchy and state, not entertain
- Fast actions should feel responsive, not floaty
- Workspace views should remain grounded and stable
- Marketing pages may use slightly richer reveal choreography than app pages

## Motion Token Set
### Durations
- `instant`: `80ms`
- `fast`: `140ms`
- `base`: `180ms`
- `moderate`: `220ms`
- `slow`: `280ms`

### Easing
- `ease.standard`: `cubic-bezier(0.2, 0.8, 0.2, 1)`
- `ease.exit`: `cubic-bezier(0.4, 0, 1, 1)`
- `ease.emphasis`: `cubic-bezier(0.18, 0.9, 0.24, 1)`

## Page Motion
### Marketing pages
- initial hero reveal: fade + rise `24px` over `280ms`
- section reveals on scroll: staggered, max `60ms` between siblings
- no parallax-heavy behavior

### App pages
- page transition: fade + `12px` rise over `180ms`
- route changes should not animate large layout shifts
- dashboard cards may stagger lightly on first load only

## Component Motion
### Button
- hover: translateY `-1px`, subtle shadow increase, `140ms`
- active: translateY `0`, shadow reduce, `80ms`
- disabled: no hover/press motion

### Tabs
- active indicator slides with `180ms` standard easing

### Modal
- backdrop fades over `140ms`
- modal panel fades and rises `16px` over `220ms`

### Drawer
- slide from edge with `220ms`
- backdrop fade matches modal

### Toast
- enter from lower-right or lower-center depending on viewport
- fade + rise `12px` over `180ms`

## Workspace Motion
### Prompt and result panels
- panel content switches should fade quickly, not slide large distances

### Loading overlays
- use dimmed overlay with subtle progress indicator
- avoid full-screen spinners when a localized wait state is possible

## Builder Motion
### Node interactions
- drag should feel direct and immediate
- selection adds highlight glow over `140ms`
- validation changes animate border/status indicator, not the whole card

### Edge interactions
- edge highlight on hover over `140ms`
- invalid edge state should snap to error styling quickly

### Simulation
- active node glow pulse `180ms`
- transition from node to node should emphasize sequence clearly
- failure state pauses on the failed node and surfaces explanation immediately

## Reduced Motion
- Respect user reduced-motion preferences
- Replace reveal/stagger motion with simple fades or no motion
- Keep essential feedback changes visible without relying on animation
