# 27 Component Style Spec

## Purpose
Define the exact implemented styling, states, and formatting behavior for DARCHIE’s core UI components.

## Decisions This Document Owns
- Final component styling rules
- State styling for core UI components
- Formatting and spacing behavior by component
- Premium state presentation

## Inputs / Dependencies
- `docs/02-design/08-design-system-ui-foundations.md`
- `docs/02-design/09-component-finalization.md`
- `docs/02-design/26-visual-direction-spec.md`
- implemented frontend in `apps/web`

## Required Sections
- Core primitives
- shell components
- display components
- state rules
- formatting rules

## Output Format
Implementation-ready component style specification.

## Completion Criteria
- Engineers can match the current component system without inventing new behavior or appearance.

## Core Primitives
### Button
Variants:
- `primary`
- `secondary`
- `ghost`
- `outline`
- `danger`
- `premium-lock`

Base style:
- height `44px` by default
- radius `12px`
- compact, dense label styling
- calm transitions, no hover lift, no pressed translate

State rules:
- `primary`: dense navy in light mode, cool blue in dark mode
- `secondary`: panel-like surface with visible border
- `ghost`: text-led, lighter, and quiet
- `outline`: transparent with strong border definition
- `danger`: semantic red, still visually restrained
- `loading`: stable width with spinner inside the content row
- `disabled`: reduced opacity with no extra motion

Special CTA rule:
- The hero and marketing header `Start practicing` CTA use a premium badge-like treatment based on accent-secondary tinting rather than the default primary button style

### Input
Base style:
- height `44px`
- radius `12px`
- neutral premium field with flat surface
- stronger text legibility than the original soft UI pass

State rules:
- `default`: soft border and clean panel background
- `hover`: stronger border only
- `focus`: visible focus ring with controlled accent border emphasis
- `error`: stronger error border without loud styling
- `disabled`: reduced opacity, no decorative treatment

### Badge
Variants:
- neutral
- info
- success
- warning
- error
- premium

Badge rules:
- smaller uppercase editorial feel
- premium badge uses the shared metallic token family, not a custom one-off gold fill
- badges should read as metadata or emphasis, not mini-buttons

### Panel
Variants:
- default
- elevated
- inset
- highlighted
- danger
- metallic

Panel rules:
- `16px` radius
- flat premium surface language
- visible border always present
- gradients removed from normal usage
- highlighted panel uses subtle tint + border, not strong fill
- metallic panel uses a stronger gold-leaning border plus controlled glow, but should be reserved for featured or high-value surfaces only
- padding varies by context and is often applied at usage sites rather than embedded globally

## Shell Components
### MarketingHeader
- slim sticky header
- premium pill-style menu links on desktop
- branded logo block with icon mark + subtitle
- theme toggle plus sign-in and premium CTA on the right
- header CTA matches hero premium CTA style

### AppSidebar
- fixed on desktop
- quieter active-state treatment using panel surface, shadow, and subtle ring
- reduced decorative treatment compared with the initial version
- summary card at the bottom should feel clean and editorial, not promotional

### MobileNav
- integrated bottom navigation on small screens
- less floating-gadget feel than the original pill-heavy version
- active item uses subtle tinted background and stronger text contrast

### PageHeader
- title, supporting text, right-side action region
- spacing-first composition, less dependence on border dividers
- supports `default`, `dashboard`, and `workspace` variants

## Display Components
### PricingCard
- three-card layout with one featured middle plan
- featured card uses elevated treatment and slightly stronger emphasis
- no comparison table or FAQ styling required yet

### ModuleCard Pattern
- current modules page uses a simple 2x2 premium summary grid
- cards require enough padding and minimum height to avoid underfit content
- description copy should have relaxed line height and visible breathing room

### Dashboard Summary Card
- three readiness summary cards with compact metadata label and strong numeric emphasis
- momentum and featured recommendation panels should feel more editorial than dashboard-widget heavy

## State Rules
### Loading
- keep layout stable
- avoid replacing entire views with loud loading indicators unless app boot is blocked

### Error
- preserve clarity and contrast
- do not introduce visually noisy error surfaces unless the error is primary page content

### Locked / Premium
- premium or locked surfaces should use restrained tinting and value-oriented copy
- avoid punitive or overly promotional treatment

## Formatting Rules
- Use sentence case across labels, cards, and buttons
- Reserve uppercase mostly for small metadata, section markers, and premium badge moments
- CTA labels stay short and decisive
- Typography and spacing should carry more hierarchy than decoration
