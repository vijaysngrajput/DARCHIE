# 26 Visual Direction Spec

## Purpose
Define the final implemented visual direction for DARCHIE so design and engineering remain aligned on the premium product character across marketing and app surfaces.

## Decisions This Document Owns
- Final visual theme direction
- Dark and light theme translations
- Color system and palette intent
- Typography hierarchy
- Surface, border, shadow, and texture rules
- Iconography and brand language

## Inputs / Dependencies
- `docs/02-design/07-frontend-ux-strategy.md`
- `docs/02-design/08-design-system-ui-foundations.md`
- `docs/01-product/02-product-vision.md`
- implemented frontend in `apps/web`

## Required Sections
- Theme direction
- color system
- typography
- surfaces and materials
- iconography
- chart and builder color rules

## Output Format
High-fidelity visual design specification.

## Completion Criteria
- Engineers can describe the current UI character without referring back to the code.
- Light and dark theme behavior is explicitly documented as implemented.

## Theme Direction
DARCHIE now follows a `polished enterprise premium` direction rather than a studio-like navy dashboard aesthetic.

Visual character:
- `Polished enterprise premium`
- `Clear and confident`
- calm, technical, and spacious
- premium through restraint, proportion, and hierarchy
- visually rich without obvious decorative excess

## Theme Translation Rules
### Light theme
- Warm, parchment-like foundation rather than bright white
- Softly separated surfaces with visible but restrained contrast
- Accent colors appear as muted navy and gold, not loud brand splashes
- Should feel premium and readable, not empty or washed out

### Dark theme
- Charcoal and graphite base with muted ivory text
- Blue and gold accents are present but restrained
- Surfaces should feel layered through tone and border, not through dramatic glow or heavy gradients
- Must feel equal in quality to light mode rather than acting as the only “designed” theme

## Color System
### Light palette
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

### Dark palette
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

## Color Usage Rules
- Accent colors are used sparingly for emphasis, not everywhere by default
- Most premium UI weight comes from spacing, typography, and surface contrast rather than bold color blocks
- Highlighted surfaces use subtle tinting, not loud fills
- Semantic success, warning, and error colors remain separate from the core accent story
- Color should not be the only indicator of state

## Typography
### Type families
- Headings: `Space Grotesk`
- Body/UI: `Manrope`
- Code and technical metadata: `JetBrains Mono`

### Typography rules
- Headings are compact, assertive, and editorial rather than oversized startup headlines
- Body text is calm, readable, and slightly spacious
- Small uppercase labels are used for metadata, section markers, and premium badge-like UI moments
- Copy should feel more judgment- and clarity-oriented than feature-stacked

## Surfaces And Materials
- Panels are mostly flat premium surfaces
- Gradients are used only as subtle background atmosphere, not as the main panel treatment
- Border lines and muted tonal differences do more work than dramatic shadowing
- Light tinting is used only in highlighted areas and premium CTA/badge surfaces
- Marketing pages should feel structured and editorial rather than grid-heavy and generic

### Radius system
- `sm`: `8px`
- `md`: `12px`
- `lg`: `16px`
- `xl`: `22px`

### Shadow system
- `shadow-soft`: ambient surface shadow
- `shadow-panel`: stronger featured-panel shadow
- `shadow-modal`: strongest modal or overlay shadow

## Iconography And Brand Language
- Use stroke-first iconography consistently
- Prefer technical icons and data-flow metaphors over playful illustration
- The marketing header brand treatment includes a premium icon mark plus a refined wordmark/subtitle relationship
- Badges, pills, and premium CTAs should feel editorial and concise, not noisy or oversized

## Chart And Builder Color Rules
- Charts should use muted, readable categories rather than bright rainbow assignments
- Builder surfaces should rely on neutral panels with state accents for status and selection
- Blue and gold accents can support hierarchy, but should not dominate every visual surface
- Warnings and failures should remain semantically distinct

## Accessibility Visual Rules
- Focus rings must remain visible in both themes
- Surface separation must stay legible in both warm light mode and dark mode
- Premium styling must not reduce contrast or make interaction states ambiguous
