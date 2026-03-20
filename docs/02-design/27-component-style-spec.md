# 27 Component Style Spec

## Purpose
Define the exact visual styling, states, formatting rules, and interaction expectations for DARCHIE’s core UI components.

## Decisions This Document Owns
- Final component styling rules
- State styling for core UI components
- Formatting and spacing behavior by component
- Locked and premium state presentation

## Inputs / Dependencies
- `docs/02-design/08-design-system-ui-foundations.md`
- `docs/02-design/09-component-finalization.md`
- `docs/02-design/26-visual-direction-spec.md`

## Required Sections
- Core primitives
- shell components
- display components
- state rules
- formatting rules

## Output Format
Implementation-ready component style specification.

## Completion Criteria
- Engineers can build all foundational UI components without inventing appearance or state behavior.

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
- height `44px`
- horizontal padding `16px`
- radius `14px`
- label uses `label-md`
- inline icon gap `8px`

State rules:
- default: crisp border or fill depending on variant
- hover: slight lift and stronger surface contrast
- active: subtle pressed translate with reduced shadow
- focus: visible focus ring token
- disabled: 55 percent opacity, no lift, cursor not-allowed
- loading: spinner replaces leading icon, width stable

### Input
Base style:
- height `46px`
- radius `14px`
- horizontal padding `14px`
- label above field, helper/error text below

State rules:
- default: soft border, neutral panel fill
- hover: stronger border
- focus: accent border + focus ring
- error: error border + error helper text
- success: success border only where explicitly useful
- disabled: muted fill and text

### Textarea
- min height `120px`
- same border/focus treatment as input
- character count optional, right-aligned below field

### Select
- same control height as input
- dropdown panel uses elevated surface and soft border
- selected option uses accent background tint

### Badge
Variants:
- neutral
- info
- success
- warning
- error
- premium

### Tabs
- pill-style segmented group
- active tab uses filled panel with accent-tinted border
- inactive tabs remain low-emphasis but readable

## Shell Components
### MarketingHeader
- sticky after scroll
- transparent on hero, elevated surface once scrolled
- CTA button always visible on desktop

### AppSidebar
- fixed on desktop
- width `280px` expanded, `88px` collapsed
- active item uses accent line + filled background
- section labels use uppercase `label-sm`

### MobileNav
- bottom navigation for app shell on small screens
- max 5 top-level destinations
- active item uses accent icon and label

### PageHeader
- title, supporting text, right-side action region
- supports `default`, `dashboard`, and `workspace` variants

### Panel
Variants:
- default
- elevated
- inset
- highlighted
- danger

Panel rules:
- 18px radius
- 16 to 24px padding depending on density
- visible border always present

## Display Components
### StatCard
- title top-left
- value prominent
- optional delta or trend on lower row
- use restrained accent color, not loud KPI tiles

### FeatureCard
- icon or number marker
- short heading
- 2 to 3 lines of body copy
- optional “learn more” affordance

### ModuleCard
- module title, short description, tags, progress, CTA
- recommended badge optional
- locked state shows premium label and muted CTA

### PricingCard
- highlighted “best value” option uses elevated treatment
- feature list uses icon bullets
- CTA remains inside card body

### EmptyState
- icon or illustration motif
- clear title
- one sentence explanation
- one primary action

## Workspace Components
### ExerciseHeader
- includes title, difficulty badge, timer slot, save state, action buttons
- sticky in workspace views

### PromptPanel
- sticky left panel on desktop
- section dividers for prompt, constraints, hints
- collapsible hints use subtle disclosure motion

### ResultPanel
- tabbed container for output, tests, explanation
- validation and execution messages use consistent banners

### FeedbackSummary
- top score band
- 3 regions:
  - what worked
  - what needs work
  - what to try next

## State Rules
### Loading
- skeletons mimic real layout
- do not replace the whole screen with a spinner unless blocking app initialization

### Error
- error banners anchor near the failed component
- include action-oriented next step copy

### Locked / Premium
- use premium badge and muted blurred or desaturated preview
- show value-oriented copy, not punitive copy

### Empty
- must include one clear next action

## Formatting Rules
- Use sentence case across labels, cards, and buttons
- Keep CTA labels short: 1 to 4 words
- Avoid all-caps except very small nav/meta labels
- Data formatting:
  - percentages: no more than one decimal place
  - durations: use concise units like `25 min`
  - counts: use compact notation only above 1000
