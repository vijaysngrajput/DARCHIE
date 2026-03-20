# 26 Visual Direction Spec

## Purpose
Define the final visual direction for DARCHIE so the frontend can be implemented with a consistent, premium, technical identity across both marketing and authenticated product surfaces.

## Decisions This Document Owns
- Final visual theme direction
- Dark and light theme translations
- Color system and palette intent
- Typography hierarchy
- Surface, border, shadow, and texture rules
- Iconography and illustration language

## Inputs / Dependencies
- `docs/02-design/07-frontend-ux-strategy.md`
- `docs/02-design/08-design-system-ui-foundations.md`
- `docs/01-product/02-product-vision.md`

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
- Designers and engineers can implement the full frontend visual language without inventing new aesthetics.
- Dark and light theme behavior is fully specified.

## Theme Direction
DARCHIE should feel like a high-end technical studio product: precise, calm, and intelligent. The product should not look playful, generic SaaS, or documentation-flat.

Visual character:
- `Technical premium`
- `Clear and confident`
- structured and modern
- atmospheric but restrained
- visually rich without visual noise

## Theme Translation Rules
### Dark theme
- Primary authored theme for workspace-heavy experiences
- Best for builders, code editors, dashboards, and immersive product previews
- Surfaces stack in layers rather than relying on strong shadows alone

### Light theme
- Must preserve the same hierarchy and premium feel
- Uses warm light neutrals instead of pure white
- Accent colors remain consistent with dark theme, only brightness/contrast adapt
- Avoid sterile “white dashboard” feel

## Color System
### Core palette
- `brand.deep-navy`: `#293B5F`
- `brand.steel-blue`: `#47597E`
- `brand.soft-ice`: `#DBE6FD`
- `brand.warm-sand`: `#B2AB8C`
- `brand.ink`: `#2C2E43`

### Dark palette
- `bg.base`: `#2C2E43`
- `bg.surface`: `#293B5F`
- `bg.panel`: `#33486E`
- `bg.elevated`: `#47597E`
- `bg.overlay`: `rgba(23, 26, 40, 0.74)`
- `text.primary`: `#DBE6FD`
- `text.secondary`: `#C9D5EE`
- `text.muted`: `#9EABC2`
- `accent.primary`: `#B2AB8C`
- `accent.primary-strong`: `#9F9775`
- `accent.secondary`: `#DBE6FD`
- `accent.warning`: `#D9A441`
- `accent.error`: `#D46A6A`
- `accent.success`: `#5BB98C`
- `border.soft`: `rgba(219, 230, 253, 0.14)`
- `border.strong`: `rgba(219, 230, 253, 0.24)`
- `focus.ring`: `rgba(178, 171, 140, 0.38)`

### Light palette
- `bg.base`: `#F7F5EF`
- `bg.surface`: `#EEF2FA`
- `bg.panel`: `#DBE6FD`
- `bg.elevated`: `#FFFFFF`
- `bg.overlay`: `rgba(44, 46, 67, 0.18)`
- `text.primary`: `#2C2E43`
- `text.secondary`: `#293B5F`
- `text.muted`: `#5C6780`
- `accent.primary`: `#293B5F`
- `accent.primary-strong`: `#22324F`
- `accent.secondary`: `#B2AB8C`
- `accent.warning`: `#B07B22`
- `accent.error`: `#C45858`
- `accent.success`: `#2F8A60`
- `border.soft`: `rgba(41, 59, 95, 0.10)`
- `border.strong`: `rgba(41, 59, 95, 0.18)`
- `focus.ring`: `rgba(41, 59, 95, 0.22)`

## Color Usage Rules
- `#2C2E43` is the deepest background and anchor tone
- `#293B5F` is the main product structural color for surfaces and primary accents
- `#47597E` is used for elevated surfaces, secondary chrome, dividers, and neutral interaction states
- `#DBE6FD` carries soft contrast, premium light surfaces, and high-legibility text in dark mode
- `#B2AB8C` is the signature premium accent for CTAs, highlight badges, active emphasis, and tasteful callouts
- Use additional semantic colors for success, warning, and error states instead of forcing the core brand palette into all validation scenarios
- Use color with shape and copy; never rely on color alone

## Typography
### Type families
- Headings: `Space Grotesk`
- Body/UI: `Manrope`
- Code and numerical detail: `JetBrains Mono`

### Type scale
- `display-xl`: 64/72, weight 600
- `display-lg`: 52/60, weight 600
- `display-md`: 40/48, weight 600
- `heading-xl`: 32/40, weight 600
- `heading-lg`: 28/36, weight 600
- `heading-md`: 24/32, weight 600
- `heading-sm`: 20/28, weight 600
- `body-lg`: 18/28, weight 500
- `body-md`: 16/24, weight 500
- `body-sm`: 14/22, weight 500
- `label-md`: 14/20, weight 600
- `label-sm`: 12/18, weight 600
- `code-sm`: 13/20, weight 500

### Typography rules
- Headings are compact and assertive, not oversized startup headlines
- Body copy should feel readable and professional, not dense
- Monospace should be reserved for code, metrics, tokens, and structured technical metadata

## Surfaces And Materials
- Use a layered panel system rather than flat sections
- Primary cards and panels use subtle vertical gradients
- Use 1px border lines plus soft shadow blur, not heavy drop shadows
- Backgrounds may include very low-contrast radial gradients or technical grid/noise texture
- Marketing pages should use atmospheric depth more than the app shell

### Radius system
- `sm`: `10px`
- `md`: `14px`
- `lg`: `18px`
- `xl`: `24px`
- Buttons, badges, inputs, tabs: `14px`
- Panels and cards: `18px`
- Hero visuals and featured sections: `24px`

### Shadow system
- `shadow-soft`: `0 8px 24px rgba(8, 14, 28, 0.12)`
- `shadow-panel`: `0 18px 40px rgba(8, 14, 28, 0.18)`
- `shadow-modal`: `0 28px 80px rgba(8, 14, 28, 0.28)`

## Iconography And Illustration
- Use `lucide-react` style icons consistently
- Icons should be stroke-first, clean, and technical
- Use line-diagram visual motifs for pipeline and model storytelling
- Avoid cartoon illustrations, mascots, or abstract SaaS blobs

## Chart And Builder Color Rules
- Charts use blue and teal as primary positive categories
- Use muted grays for baselines and historic comparisons
- Warnings and failures appear only where semantically needed
- Builder nodes should use neutral surfaces with accent-colored status states, not rainbow category clutter

### Builder status colors
- idle: neutral panel tone
- selected: accent primary border + subtle glow
- valid: accent success edge indicator
- warning: accent warning edge indicator
- invalid: accent error edge indicator
- running simulation: accent primary pulse

## Accessibility Visual Rules
- Focus ring always visible on interactive components
- Minimum contrast target consistent with WCAG 2.2 AA
- Active and disabled states must remain distinguishable in both themes
