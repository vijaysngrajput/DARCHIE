# 06 Information Architecture And Sitemap

## Purpose
Define the structure of the public website and authenticated application, including route groups, navigation, and content hierarchy.

## Decisions This Document Owns
- Site and app route structure
- Global navigation
- Major page hierarchy
- Discovery flow into modules

## Inputs / Dependencies
- `docs/01-product/04-prd.md`
- `docs/01-product/05-user-personas-journey-maps.md`

## Required Sections
- Navigation model
- route groups
- sitemap
- route responsibilities

## Output Format
Route and navigation specification.

## Completion Criteria
- Every major feature has a home in the page structure.
- Public website and logged-in app are clearly separated.

## Navigation Model
### Public navigation
- Home
- Practice Modules
- How It Works
- Pricing
- About
- Sign In
- Get Started

### Authenticated navigation
- Dashboard
- Practice
- Mock Interviews
- Progress
- Pricing
- Settings

## Route Groups
### Marketing site
- `/`
- `/modules`
- `/modules/sql`
- `/modules/python`
- `/modules/data-modeling`
- `/modules/pipeline-builder`
- `/how-it-works`
- `/pricing`
- `/about`
- `/signin`
- `/signup`

### App shell
- `/app`
- `/app/dashboard`
- `/app/practice`
- `/app/practice/sql`
- `/app/practice/sql/[exerciseId]`
- `/app/practice/python`
- `/app/practice/python/[exerciseId]`
- `/app/practice/data-modeling`
- `/app/practice/data-modeling/[exerciseId]`
- `/app/practice/pipeline-builder`
- `/app/practice/pipeline-builder/[exerciseId]`
- `/app/mock-interviews`
- `/app/mock-interviews/[sessionId]`
- `/app/progress`
- `/app/progress/module/[moduleId]`
- `/app/settings`
- `/app/billing`

## Sitemap Responsibilities
### Home
- Hero, value proposition, module previews, trust section, CTA

### Practice Modules
- Explain each module, examples, learning outcomes

### Pricing
- Free vs Pro comparison and CTA

### Dashboard
- User summary, recommendations, recent attempts, readiness graph

### Practice Listing Pages
- Filters by module, difficulty, tags, completion status

### Exercise Pages
- Problem statement, workspace, hints, run/submit, result panels

### Progress
- Charts, module summaries, attempt history, weak-area insights

## Discovery Flow
- Public homepage CTA routes to `/app/practice`, where users can enter the practice hub as an open preview.
- The practice hub is intentionally discoverable from both the public homepage CTA and the authenticated app navigation.
- Future auth, persistence, submission gating, and paid-access rules should layer onto this same entry path rather than changing the homepage destination again.
- Sign-up, onboarding, and dashboard flows still exist, but they are not the required first step for discovering practice.

## Preview Access Note
- `/app/practice` may be browsable before full authentication is required.
- The boundary between open preview behavior and restricted features is intentionally deferred for later product definition.
- Later implementation should decide which actions remain open in preview and which require sign-in, persistence, or paid access.

## IA Rules
- Practice modules must be discoverable from both public and authenticated surfaces.
- Each exercise page must keep context visible: title, difficulty, expected skills, timer when enabled.
- Mock interview mode should feel separate from ordinary practice to preserve mental context.
