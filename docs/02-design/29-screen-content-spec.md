# 29 Screen Content Spec

## Purpose
Define the exact section structure, copy patterns, formatting rules, and content hierarchy for the first DARCHIE pages.

## Decisions This Document Owns
- Page section order
- Headline and subcopy style
- CTA patterns
- Empty-state messaging format
- Tone rules across marketing and app pages

## Inputs / Dependencies
- `docs/01-product/06-information-architecture.md`
- `docs/02-design/26-visual-direction-spec.md`
- `docs/02-design/27-component-style-spec.md`

## Required Sections
- Tone rules
- page-by-page content spec
- CTA rules
- empty/error copy rules

## Output Format
Page content and formatting specification.

## Completion Criteria
- The first frontend pages can be implemented with aligned structure and copy without needing ad hoc content decisions.

## Tone Rules
- Voice: clear, confident, modern, helpful
- Avoid jargon-heavy academic wording on marketing pages
- App copy can be more technical but should remain direct
- Do not use hype-heavy startup phrases

## Formatting Rules
- Headlines use short, high-signal phrasing
- Supporting text is 1 to 3 short sentences
- Section intros should not exceed 2 lines on desktop unless justified
- CTA copy should be imperative and concise

## Home Page
### Section order
1. Hero
2. Product proof strip
3. Why DARCHIE section
4. Module overview
5. Workflow demo section
6. Trust / credibility section
7. Pricing teaser
8. Final CTA

### Content rules
- Hero headline: explain interview-first value clearly
- Hero subcopy: combine coding, modeling, and pipeline practice in one sentence cluster
- Right side: product UI preview, not abstract art
- Product proof strip: 3 to 4 concise capability highlights

## Modules Page
### Section order
1. Intro header
2. Module comparison grid
3. Detailed module sections
4. Learning flow section
5. CTA

### Content rules
- Each module block should answer:
  - what you practice
  - how it works
  - what interview skill it improves

## Pricing Page
### Section order
1. Header
2. Pricing cards
3. Feature comparison
4. FAQ
5. CTA

### Content rules
- Emphasize value through realistic practice and feedback
- Avoid aggressive pricing tricks

## About Page
### Section order
1. Mission header
2. Why the product exists
3. Product philosophy
4. Long-term vision
5. CTA

## Sign In / Sign Up
### Content rules
- Keep pages minimal and quiet
- Headline should reassure and orient
- Social sign-in optional placement below primary form

## Onboarding
### Step structure
1. Role/goal selection
2. Experience level
3. Priority skill areas
4. Recommendation confirmation

### Content rules
- one decision cluster per step
- progress indicator always visible
- support text explains why each answer matters

## Dashboard
### Section order
1. Welcome header
2. Readiness summary cards
3. Recommended next actions
4. Recent attempts
5. Module progress grid

### Content rules
- lead with momentum and clarity
- show one strong “start here” recommendation

## CTA Rules
- Home: `Start practicing`
- Modules: `Explore the modules`
- Pricing: `Get started`
- Dashboard recommendation: `Continue`
- Locked flows: `Unlock Pro`

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
- Use quiet contextual labels like `Preparing workspace`, `Loading dashboard`, `Saving draft`
