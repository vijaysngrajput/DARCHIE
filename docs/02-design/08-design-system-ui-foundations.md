# 08 Design System And UI Foundations

## Purpose
Define the implemented visual system and foundational UI rules for DARCHIE so design and engineering share the same source of truth.

## Decisions This Document Owns
- Brand direction
- design tokens
- layout rules
- typography
- motion defaults
- foundational component behavior

## Inputs / Dependencies
- `docs/02-design/07-frontend-ux-strategy.md`
- implemented frontend in `apps/web`

## Required Sections
- Brand direction
- tokens
- layout
- visual patterns

## Output Format
Design-system foundation document.

## Completion Criteria
- The current frontend implementation can be described without ambiguity.
- Future UI work can reuse these rules without inventing a parallel visual system.

## Brand Direction
DARCHIE should feel like a polished enterprise-grade product for technical users: calm, premium, structured, and credible. The visual system should avoid loud startup styling, default SaaS gradients, and over-decorated dashboards.

## Visual Language
- Primary mood: warm parchment light mode, charcoal dark mode, restrained navy and muted gold accents
- Surface treatment: flat premium panels with subtle separation and restrained atmospheric background treatment
- Shapes: rounded but precise, using 8px to 22px radii depending on component role
- Illustration style: stroke-first icons, data-flow motifs, product-preview compositions instead of generic abstract art

## Typography
- Headings: `Space Grotesk`
- Body/UI text: `Manrope`
- Code/editor text: `JetBrains Mono`

## Color Tokens
### Light theme tokens
- `bg.base`: `#f1eee6`
- `bg.surface`: `#e6e1d6`
- `bg.panel`: `#fcfaf5`
- `bg.elevated`: `#f7f2ea`
- `bg.overlay`: `rgba(15, 17, 21, 0.26)`
- `text.primary`: `#171717`
- `text.secondary`: `#444444`
- `text.muted`: `#6b6b6b`
- `accent.primary`: `#1f3a5f`
- `accent.primary-strong`: `#12263f`
- `accent.secondary`: `#a67c52`
- `accent.warning`: `#b7791f`
- `accent.error`: `#b85c55`
- `accent.success`: `#2f7d57`
- `border.soft`: `rgba(23, 23, 23, 0.08)`
- `border.strong`: `rgba(23, 23, 23, 0.16)`
- `focus.ring`: `rgba(31, 58, 95, 0.22)`

### Dark theme tokens
- `bg.base`: `#0f1115`
- `bg.surface`: `#151922`
- `bg.panel`: `#1a1f29`
- `bg.elevated`: `#202735`
- `bg.overlay`: `rgba(7, 8, 11, 0.7)`
- `text.primary`: `#f3efe7`
- `text.secondary`: `#d6d0c5`
- `text.muted`: `#9c988f`
- `accent.primary`: `#8fb3d9`
- `accent.primary-strong`: `#bdd2ea`
- `accent.secondary`: `#c6a374`
- `accent.warning`: `#d39a42`
- `accent.error`: `#d07c74`
- `accent.success`: `#63b087`
- `border.soft`: `rgba(243, 239, 231, 0.08)`
- `border.strong`: `rgba(243, 239, 231, 0.16)`
- `focus.ring`: `rgba(143, 179, 217, 0.28)`

## Radius Scale
- `sm`: `8px`
- `md`: `12px`
- `lg`: `16px`
- `xl`: `22px`

## Shadow System
- `shadow-soft`: low ambient surface shadow for cards, nav items, and subtle elevation
- `shadow-panel`: stronger panel shadow for featured surfaces and major callouts
- `shadow-modal`: strongest shadow reserved for modal-level overlays and drawers

## Layout Rules
- Max content width for marketing pages: `1280px`
- App shell uses fixed sidebar on desktop and integrated bottom navigation on small screens
- Focused editor routes such as SQL, Python, and Data Modeling exercises can replace the heavier desktop sidebar with a slimmer top app header to maximize working width
- Practice workspaces will use a 3-zone layout on desktop:
  - context column
  - main workspace
  - feedback/output panel
- In focused editor routes, the context and feedback columns should stay sticky with a small top offset so the problem statement and review remain visible while the user scrolls through the central workspace
- Data Modeling is now a builder-first exception within that family: it still uses a sticky context rail, but swaps the sticky right feedback rail for a sticky builder palette and moves validation/review into a full-width surface below the canvas

## Breakpoints
- `sm: 640`
- `md: 768`
- `lg: 1024`
- `xl: 1280`
- `2xl: 1536`

## Motion Rules
- Hover and interaction motion stays calm and under roughly `130ms`
- Panel/modal motion stays restrained and under roughly `220ms`
- No hover lift is required for the premium system
- Motion should reinforce precision and structure, never add playfulness

## Visual Component Defaults
- Panels: flat premium surfaces with visible borders and restrained shadows
- Buttons: dense primary action, lighter ghost action, premium badge-like CTA treatment where needed
- Forms: clean neutral fields with clear focus and error differentiation
- Navigation: premium pill-style links and subdued active states
- Marketing sections: editorial composition with fewer equal-weight cards and more narrative hierarchy
