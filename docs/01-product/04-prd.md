# 04 Product Requirements Document

## Purpose
Define the functional scope, epics, user journeys, acceptance criteria, and release priorities for DARCHIE v1.

## Decisions This Document Owns
- Feature scope for v1
- User-facing modules
- Functional requirements
- Non-goals
- Acceptance criteria at product level

## Inputs / Dependencies
- `docs/01-product/02-product-vision.md`
- `docs/01-product/03-business-review.md`

## Required Sections
- Goals
- user stories
- epics
- requirements
- non-goals
- acceptance criteria

## Output Format
Implementation-facing product requirements document.

## Completion Criteria
- Product and engineering can derive backlog and milestones from this document.
- Scope is prioritized and testable.

## Product Goals
- Enable data engineers to practice realistic interview tasks in one place.
- Help users understand both correctness and reasoning.
- Offer a visual practice layer for pipeline and model design.
- Track readiness across modules and sessions.

## Core User Journeys
1. A new user lands on the site, understands the value proposition, signs up, and selects learning goals.
2. The user enters the dashboard, sees recommended exercises, and starts a module.
3. The user completes a practice task, receives scoring and explanation, and saves progress.
4. The user attempts a timed mock interview and reviews strengths and gaps.
5. The user upgrades after hitting free-tier limits or wanting full access.

## Epics
### Epic 1: Public Website
- Home page
- Product overview
- Module pages
- Pricing page
- About / trust content
- Authentication entry points

### Epic 2: Identity And Onboarding
- Email/password auth plus Google OAuth
- User profile creation
- Goal selection during onboarding
- Skill baseline self-assessment

### Epic 3: Dashboard And Progress
- Overview of module progress
- Recommended next exercises
- Recently attempted work
- Readiness summary

### Epic 4: SQL Practice
- Problem statement, schema browser, editor, run, submit, feedback
- Difficulty tiers and tags
- Expected result validation

### Epic 5: Python Practice
- Problem statement, editor, run, submit, hidden tests, feedback
- Input/output examples
- Time-boxed mode

### Epic 6: Data Modeling Practice
- Visual ERD workspace
- Entity and relationship creation
- Constraints and validation feedback
- Canonical solution comparison

### Epic 7: Visual Pipeline Builder
- Drag-and-drop pipeline canvas
- Node configuration panel
- Connection validation
- Step-by-step simulation and failure explanation

### Epic 8: Mock Interview Mode
- Timed session
- Mixed question sets
- Session scoring and replay

### Epic 9: Monetization Foundations
- Free/pro access tiers
- Upgrade prompts
- Subscription status in app

### Epic 10: Settings And Support
- Profile settings
- Notification preferences
- Contact/support links

## Functional Requirements
### Public Website
- The website must explain the product in interview-first language.
- The website must be responsive and performant.
- The website must provide clear conversion paths to sign up and pricing.

### Auth And Onboarding
- Users must be able to create accounts with email/password and Google.
- Users must choose goals during onboarding.
- The system must create a profile and starter recommendations.

### Practice Modules
- Each module must support browse, attempt, save, review.
- Each exercise must include metadata: skill area, difficulty, tags, expected outcomes.
- Each module must return feedback within one user flow.

### Progress
- Dashboard must display completion metrics by module.
- Users must see recent attempts and saved drafts.
- Users must see readiness trends over time.

### Mock Interviews
- Users must launch a timed practice session.
- The session must mix module types based on selected focus.
- The platform must save final scoring and review notes.

### Monetization
- Free users must encounter usage limits clearly.
- Paid entitlements must unlock premium content and unlimited attempt history.

## Non-Goals
- Building an enterprise hiring platform in v1
- Real-time multi-user collaboration
- Full Spark cluster execution
- User-generated public marketplace content
- Live video coaching

## Release Priority
### Must-have
- Public website
- Auth and onboarding
- Dashboard
- SQL practice
- Python practice
- Data modeling practice
- Visual pipeline builder
- Progress tracking

### Should-have
- Mock interview mode
- Billing-ready architecture and gated premium flows

### Could-have
- Public leaderboards
- Community profile pages

## Product Acceptance Criteria
- A user can sign up, onboard, start an exercise, submit work, get feedback, and revisit the result.
- Each core module has at least one complete end-to-end flow.
- Visual builder supports save, load, validate, and simulate.
- Dashboard reflects attempt history and progress.
- Public website and app share a coherent brand and UX.
