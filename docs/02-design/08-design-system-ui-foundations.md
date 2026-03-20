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
- Primary mood: deep slate, warm off-white, steel blue, muted teal accents
- Surface treatment: layered panels with subtle gradients and low-noise texture
- Shapes: rounded but not playful, using 12px and 16px radii
- Illustration style: simple line diagrams, data-flow motifs, node-link visuals

## Typography
- Headings: `Space Grotesk`
- Body/UI text: `Manrope`
- Code/editor text: `JetBrains Mono`

## Color Tokens
- `bg.base`: `#0F1722`
- `bg.surface`: `#162131`
- `bg.panel`: `#1B2A3D`
- `bg.elevated`: `#22334A`
- `text.primary`: `#F4F7FB`
- `text.secondary`: `#B6C2D2`
- `text.muted`: `#7F93AA`
- `accent.primary`: `#4FB3D9`
- `accent.secondary`: `#60D5B0`
- `accent.warning`: `#F6C177`
- `accent.error`: `#F17C7C`
- `border.soft`: `rgba(182, 194, 210, 0.18)`
- `border.strong`: `rgba(182, 194, 210, 0.35)`

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
