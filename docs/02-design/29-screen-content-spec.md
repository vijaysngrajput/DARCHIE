# 29 Screen Content Spec

## Purpose
Define the implemented content hierarchy, section order, and tone patterns for the first DARCHIE pages.

## Decisions This Document Owns
- Page section order
- Headline and subcopy style
- CTA patterns
- Tone rules across marketing and app pages
- Current page-level content expectations

## Inputs / Dependencies
- `docs/01-product/06-information-architecture.md`
- `docs/02-design/26-visual-direction-spec.md`
- `docs/02-design/27-component-style-spec.md`
- implemented frontend in `apps/web`

## Required Sections
- Tone rules
- page-by-page content spec
- CTA rules
- empty/error/loading copy rules

## Output Format
Page content and formatting specification.

## Completion Criteria
- The implemented marketing and app pages can be described accurately from this doc.

## Tone Rules
- Voice: clear, confident, calm, and modern
- Marketing copy should emphasize judgment, realism, and structure over hype
- App copy can be more technical but should stay direct and uncluttered
- Avoid feature-stacked marketing language when one strong idea will do

## Formatting Rules
- Headlines use concise, high-signal phrasing
- Supporting text is typically 1 to 3 short sentences
- Page structure should emphasize one strong message at a time rather than many equal-weight sections
- CTA copy should stay imperative and concise

## Home Page
### Section order
1. Hero with editorial product preview
2. Asymmetrical explanation block
3. Supporting `How it works` and `Why it sticks` layout

### Content rules
- Hero headline should center on stronger data engineering judgment and interview realism
- Hero subcopy should explain the combined SQL, Python, modeling, and pipeline value in a calmer voice
- Right side should present one dominant product preview composition
- Supporting proof beneath the hero should read as compact editorial statements, not equal-weight product cards
- Do not describe extra trust, pricing teaser, workflow demo, or final CTA sections that are not currently implemented

## Modules Page
### Section order
1. Intro header
2. 2x2 module summary grid

### Content rules
- Each module card should explain what the user practices and why that skill matters in interviews
- Current page does not yet include detailed alternating module sections or deeper learning-flow content

## Pricing Page
### Section order
1. Header
2. Three pricing cards

### Content rules
- Emphasize realistic practice and structured feedback as the value proposition
- One center plan should feel clearly featured
- Do not document comparison table or FAQ sections yet because they are not implemented

## About Page
### Section order
1. Mission-style header
2. Supporting narrative content

### Content rules
- Keep tone calm and intentional
- Avoid inflated startup-story language

## Sign In / Sign Up
### Content rules
- Keep pages minimal and quiet
- Headline should reassure and orient
- Visual treatment should feel premium but restrained

## Onboarding
### Content rules
- Onboarding is still shell-level and not yet a full multi-step implemented experience
- Current expectations should remain lightweight until the real onboarding flow is built

## Dashboard
### Section order
1. Page header
2. Three readiness summary cards
3. Momentum panel
4. Featured recommendation panel

### Content rules
- Lead with clarity and momentum
- Keep one strong recommendation visible
- Do not document recent attempts or module progress sections yet because they are not implemented

## Practice Hub
### Section order
1. Intro header
2. Four-module practice grid

### Content rules
- `/app/practice` should read as a module-first practice hub rather than a generic placeholder page
- Each module card should explain the practice mode, interview skill emphasis, difficulty range, and 2 to 3 concrete tags
- Module CTAs should point users into the specific module landing page, not directly into unrelated app areas

## Practice Module Landing Pages
### Section order
1. Page header
2. Two-column overview row with practice summary and recommended starting point
3. Exercise card grid

### Content rules
- Module pages should keep the tone practical and interview-oriented rather than tutorial-like
- The highlighted starting point should feel like the fastest way into the workspace, with one recommended exercise called out clearly
- Exercise cards should summarize difficulty, estimated time, and tags without adding progress or scoring states that are not implemented yet

## Practice Workspaces
### Section order
1. Exercise header
2. Focused exercise layout with sticky prompt rail, central work surface, and sticky review panel
3. Action row directly beneath the editor or module surface
4. Status bar grouped with the editor action area
5. Module-specific reference section below the main editor surface

Data Modeling exception:
- Do not render the route-level exercise header card above the canvas
- Use a full-width prompt section above the workspace, the builder canvas in the main column, a full-height builder palette on the right, and a full-width validation/review surface beneath the canvas

### Content rules
- Workspace copy should emphasize realistic practice, structured review, and legible reasoning
- Prompt content should stay concise and technical; the `Starter hint` block is optional and is currently omitted for Data Modeling
- SQL, Python, and Data Modeling exercise pages should use the slimmer focus-mode app header instead of the full desktop sidebar so the main working surface gets more width
- The right panel should frame results as output, validation, checks, review, or explanation depending on module type
- SQL is now backend-connected for preview execution and structured submission feedback; Python currently mirrors the same layout and interaction rhythm but still uses mocked run/submit states
- Data Modeling now uses a premium hybrid architecture-and-ERD builder with a full-width prompt section, curated palette-driven shape creation, inline in-node editing for entity and shape changes, and real frontend ERD validation before a mocked submit/review step
- Data Modeling should feel spatial and presentational rather than form-driven; avoid documenting a persistent `Entity config` side rail, left inspector, or duplicate action strip for the current implementation
- Avoid documenting Python as fully backend-connected yet, and avoid implying persistence/auth/paywall behavior beyond the current preview slice

## CTA Rules
- Home hero: `Start practicing`
- Home secondary: `Explore modules`
- Pricing featured plan: `Start Pro`
- Pricing non-featured plans: `Choose plan`
- Dashboard recommendation: `Continue`

## Empty, Error, And Loading Copy Rules
### Empty state formula
- Title: clear situation
- Body: one sentence on what this means
- CTA: one next action

### Error state formula
- Title: what failed
- Body: what the user can do next
- CTA when possible: retry or go back

### Loading
- Use contextual labels when needed, such as `Preparing workspace`, `Loading dashboard`, or `Saving draft`
