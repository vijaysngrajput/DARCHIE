# 08 Design System And UI Foundations

## Purpose
Define the visual system and foundational UI rules for DARCHIE so a code engine can generate a cohesive frontend without ad hoc styling.

## Decisions This Document Owns
- Brand direction
- design tokens
- layout rules
- typography
- motion
- component visual defaults

## Inputs / Dependencies
- `docs/02-design/07-frontend-ux-strategy.md`

## Required Sections
- Brand direction
- tokens
- layout
- visual patterns

## Output Format
Design-system foundation document.

## Completion Criteria
- Frontend implementation can use these as binding design rules.
- Visual choices feel distinct from default template UI.

## Brand Direction
DARCHIE should feel technical, modern, and focused, with a studio-like interface rather than a corporate dashboard. The tone should communicate precision and calm confidence.

## Visual Language
- Primary mood: deep navy, ink blue, soft ice, and muted sand accents
- Surface treatment: layered panels with subtle gradients and low-noise texture
- Shapes: rounded but not playful, using 12px and 16px radii
- Illustration style: simple line diagrams, data-flow motifs, node-link visuals

## Typography
- Headings: `Space Grotesk`
- Body/UI text: `Manrope`
- Code/editor text: `JetBrains Mono`

## Color Tokens
### Core brand palette
- `brand.deep-navy`: `#293B5F`
- `brand.steel-blue`: `#47597E`
- `brand.soft-ice`: `#DBE6FD`
- `brand.warm-sand`: `#B2AB8C`
- `brand.ink`: `#2C2E43`

### Default dark-theme tokens
- `bg.base`: `#2C2E43`
- `bg.surface`: `#293B5F`
- `bg.panel`: `#33486E`
- `bg.elevated`: `#47597E`
- `text.primary`: `#DBE6FD`
- `text.secondary`: `#C9D5EE`
- `text.muted`: `#9EABC2`
- `accent.primary`: `#B2AB8C`
- `accent.secondary`: `#DBE6FD`
- `accent.warning`: `#D9A441`
- `accent.error`: `#D46A6A`
- `accent.success`: `#5BB98C`
- `border.soft`: `rgba(219, 230, 253, 0.14)`
- `border.strong`: `rgba(219, 230, 253, 0.24)`

## Spacing Scale
- `4, 8, 12, 16, 24, 32, 40, 48, 64`

## Layout Rules
- Max content width for marketing pages: `1200px`
- App shell uses fixed sidebar on desktop and bottom/overlay navigation on small screens
- Practice workspaces use a 3-zone layout on desktop:
  - context column
  - main workspace
  - feedback/output panel

## Breakpoints
- `sm: 640`
- `md: 768`
- `lg: 1024`
- `xl: 1280`
- `2xl: 1536`

## Motion Rules
- Page load uses subtle fade-and-rise transitions under 250ms
- Sidebar and modal transitions under 200ms
- Canvas node interactions use snap and highlight motion, not bouncy animations
- Motion should reinforce structure, never distract from work

## Visual Component Defaults
- Cards: elevated panel with soft border and shadow blur
- Buttons: solid primary, ghost secondary, outline tertiary, danger variant
- Forms: high-contrast labels, helper text beneath fields, inline validation
- Tables: dense but readable, sticky headers where needed
- Modals: centered for confirmation flows, side panels for editing/configuration
