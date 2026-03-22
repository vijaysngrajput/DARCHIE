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
- Primary mood: calm slate-neutral light mode, charcoal dark mode, restrained indigo-slate and muted steel accents with selective metallic-gold emphasis on featured surfaces
- Surface treatment: flat premium panels with subtle separation, restrained atmospheric background treatment, and a premium metallic outline path reserved for high-value panels
- Shapes: rounded but precise, using 8px to 22px radii depending on component role
- Illustration style: stroke-first icons, data-flow motifs, product-preview compositions instead of generic abstract art

## Typography
- Headings: `Space Grotesk`
- Body/UI text: `Manrope`
- Code/editor text: `JetBrains Mono`

## Color Tokens
### Light theme tokens
- `bg.base`: `#dddddd`
- `bg.surface`: `#cfd2d9`
- `bg.panel`: `#ebe8ef`
- `bg.elevated`: `#dde0e8`
- `bg.overlay`: `rgba(15, 17, 21, 0.26)`
- `text.primary`: `#43405d`
- `text.secondary`: `#4b586e`
- `text.muted`: `#6a6781`
- `accent.primary`: `#574e6d`
- `accent.primary-strong`: `#43405d`
- `accent.secondary`: `#4b586e`
- `accent.metallic`: `#8a7a5a`
- `accent.metallic-glow`: `rgba(138, 122, 90, 0.22)`
- `accent.warning`: `#b7791f`
- `accent.error`: `#b85c55`
- `accent.success`: `#2f7d57`
- `border.soft`: `rgba(67, 64, 93, 0.12)`
- `border.strong`: `rgba(67, 64, 93, 0.22)`
- `focus.ring`: `rgba(87, 78, 109, 0.22)`

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
- `accent.metallic`: `#d1b27b`
- `accent.metallic-glow`: `rgba(209, 178, 123, 0.2)`
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
- `shadow-soft`: low ambient surface shadow for cards, nav items, and subtle elevation; light mode now keeps a little more sheen so panels do not read as flat
- `shadow-panel`: stronger panel shadow for featured surfaces, major callouts, and metallic-emphasis panels
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
- Data Modeling is now a builder-first exception within that family: it uses a compact full-width prompt plus brainstorming scratchpad above the workspace, a dominant central canvas with a subtle dot-grid drafting background, a full-height builder palette on the right, and validation/review in a full-width surface below the canvas
- Data Modeling should feel canvas-first rather than form-first: prefer inline editing inside selected nodes, contextual edge tools, lightweight shortcut guidance, and generous canvas space over persistent side inspectors or duplicate action bars

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
- Panels: flat premium surfaces with visible borders and restrained shadows; a selective `metallic` premium variant is available for hero panels, key workspace shells, and other featured surfaces
- Buttons: dense primary action, lighter ghost action, premium badge-like CTA treatment where needed, with metallic-gold emphasis reserved for premium or locked-value actions
- Forms: clean neutral fields with clear focus and error differentiation
- Navigation: premium pill-style links and subdued active states
- Marketing sections: editorial composition with fewer equal-weight cards and more narrative hierarchy
