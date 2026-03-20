# 02 Product Vision

## Purpose
Define the product thesis, problem statement, target user, value proposition, differentiation, and v1 scope boundaries for DARCHIE.

## Decisions This Document Owns
- Why the product exists
- Who the product serves first
- What problem is being solved in v1
- What the product will and will not do initially
- The positioning statement for all later documents

## Inputs / Dependencies
- `docs/00-governance/01-master-index.md`

## Required Sections
- Problem statement
- Product thesis
- Target users
- Differentiation
- v1 scope
- Non-goals

## Output Format
Narrative strategy document with explicit product boundaries and success framing.

## Completion Criteria
- The product can be described in one sentence and one paragraph.
- v1 scope is narrow enough to ship, but broad enough to validate the thesis.
- Later docs can use this as a stable source of truth.

## Product Statement
DARCHIE is an interview practice platform for aspiring and mid-level data engineers that combines coding practice, SQL exercises, data modeling, and visual pipeline design into one realistic learning environment.

## Problem Statement
Current interview prep for data engineers is fragmented. Candidates can practice SQL on one platform, coding on another, and may watch tutorials for ETL and data modeling, but they rarely get a single environment that reflects how data engineering interviews actually test system thinking.

This leads to three core problems:
- Candidates over-train on syntax and under-train on architecture and reasoning.
- Visual pipeline and data-model design practice is mostly missing.
- Existing learning tools do not connect code, schema design, orchestration, and tradeoff thinking in one flow.

## Product Thesis
If data engineers can practice the same combination of skills that interviews actually test, inside an interactive environment with visual builders, guided feedback, and progress tracking, then they will prepare more effectively and perceive the platform as more valuable than standalone question banks.

## Primary User
### V1 primary persona
- Job-seeking data engineers
- Profile: 0 to 6 years of experience, preparing for screening rounds, take-home tasks, and system-design style interview rounds
- Typical goals: improve confidence, identify weak areas, practice realistic scenarios, and build muscle memory

### Secondary future users
- Training cohorts and bootcamps
- Hiring teams and recruiting functions

These secondary segments are out of scope for v1 feature prioritization.

## User Value Proposition
DARCHIE helps job-seeking data engineers prepare for interviews in one place by combining realistic SQL, Python, data modeling, and visual ETL exercises with immediate feedback and progress tracking.

## Differentiation
DARCHIE is not another SQL question bank and not a generic ETL tool. It is differentiated by:
- Interview-first product design
- Visual pipeline and data model builders as first-class learning tools
- Unified practice experience across multiple data engineering skill categories
- Scenario-based exercises rather than isolated syntax drills
- Feedback designed around interview readiness, not only correctness

## V1 Scope
### Included in v1
- Public marketing website
- User authentication and onboarding
- Dashboard and progress tracking
- SQL practice module
- Python practice module
- Data modeling practice module
- Visual pipeline builder practice module
- Mock interview mode with timed exercises
- Guided hints, explanations, and review feedback
- Basic account settings and billing-ready architecture

### Excluded from v1
- Hiring-team assessment workflows
- Live interviewer collaboration
- Full notebook environment
- Production cloud warehouse integrations
- Real Spark cluster execution
- Team workspaces
- Rich AI tutoring beyond targeted feedback summaries

## Product Principles
- Practice should feel realistic, not academic.
- Visual understanding matters as much as code output.
- Each module should teach both mechanics and tradeoffs.
- The app should feel approachable for learners but credible to experienced engineers.
- The platform should progressively reveal complexity instead of overwhelming new users.

## Success Definition For V1
- Users can sign up and complete at least one exercise in each core module.
- Users can save progress and revisit completed work.
- The visual pipeline builder helps users understand execution order, dependencies, and common failure points.
- The product is implementation-ready for a code engine without unresolved strategy gaps.
