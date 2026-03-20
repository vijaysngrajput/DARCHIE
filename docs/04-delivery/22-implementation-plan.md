# 22 Implementation Plan

## Purpose
Break DARCHIE v1 into buildable milestones, workstreams, dependencies, and execution order.

## Decisions This Document Owns
- Milestone structure
- subsystem sequencing
- critical path
- implementation readiness criteria

## Inputs / Dependencies
- `docs/01-product/04-prd.md`
- `docs/03-architecture/11-high-level-design.md`
- `docs/03-architecture/12-low-level-design.md`
- `docs/04-delivery/20-testing-strategy.md`
- `docs/04-delivery/21-devops-environment-strategy.md`

## Required Sections
- Milestones
- workstreams
- dependencies
- done criteria

## Output Format
Delivery roadmap and build sequence.

## Completion Criteria
- A code engine can execute work in bounded phases.

## Milestone 1: Project Foundation
- Initialize Next.js app, TypeScript, Tailwind, Prisma, Supabase integration
- Set up app shell, marketing shell, auth scaffolding, core design tokens
- Configure CI, linting, testing base, Sentry, analytics stubs

## Milestone 2: Public Website And Auth
- Build home, modules, pricing, about, auth pages
- Implement sign-up, sign-in, onboarding, protected routes
- Seed starter content and metadata framework

## Milestone 3: Dashboard And Catalog
- Implement dashboard, exercise listing, filters, module detail views
- Add progress aggregation scaffolding and recent attempts feed

## Milestone 4: SQL And Python Workspaces
- Implement editor-based workspaces
- Add draft saving, submit flow, result panel, visible feedback
- Integrate isolated execution worker and polling/update path

## Milestone 5: Data Modeling And Pipeline Builder
- Implement React Flow based builder surfaces
- Add entity/node creation, config drawers, validation panels
- Add simulation timeline and submission scoring pipeline

## Milestone 6: Mock Interviews, Billing, And Polish
- Implement timed mixed sessions
- Add pricing entitlements and billing workflow
- Refine progress analytics, upgrade prompts, accessibility, responsive polish

## Cross-Cutting Workstreams
- Content modeling and seed data
- Analytics event instrumentation
- Security and runtime hardening
- Testing expansion by milestone

## Critical Path
- Foundation before auth
- Auth before dashboard and saved progress
- Catalog before exercise pages
- Execution worker before SQL/Python production readiness
- Builder validation engine before data modeling and pipeline scoring

## Definition Of Done Per Milestone
- Code complete
- Tests passing
- docs aligned if implementation changed assumptions
- staging verified
