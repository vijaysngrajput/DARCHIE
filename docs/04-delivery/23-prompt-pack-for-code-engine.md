# 23 Prompt Pack For Code Engine

## Purpose
Convert the planning pack into subsystem-level implementation prompts for a code engine.

## Decisions This Document Owns
- Prompt slicing strategy
- prompt inputs
- expected output by implementation batch

## Inputs / Dependencies
- `docs/04-delivery/22-implementation-plan.md`
- Relevant product, design, and architecture documents

## Required Sections
- Prompt principles
- batch prompts
- acceptance notes

## Output Format
Prompt handoff document.

## Completion Criteria
- A code engine can be prompted subsystem by subsystem without missing context.

## Prompt Principles
- Each prompt must include goal, scope, constraints, relevant docs, and acceptance criteria.
- Each prompt should focus on one subsystem or milestone slice.
- Prompts should request code changes plus verification steps.

## Prompt Batch 1: Foundation
Build the initial Next.js 15 application with TypeScript, Tailwind CSS, Prisma, Supabase integration, app and marketing route groups, shared layout shells, base design tokens, and CI-friendly project setup. Follow the docs for IA, UX, design system, HLD, and implementation plan.

## Prompt Batch 2: Public Website And Auth
Implement the public marketing pages, responsive navigation, pricing page, about page, sign-up/sign-in screens, onboarding flow, protected route handling, and profile bootstrap according to product, IA, UX, and API docs.

## Prompt Batch 3: Dashboard And Catalog
Implement dashboard, exercise catalog pages, filters, recommendation cards, recent attempts feed, and progress summaries with mocked or seeded data if backend endpoints are not complete.

## Prompt Batch 4: SQL And Python Practice
Implement the SQL and Python workspaces with Monaco editor, prompt panel, result panel, draft save flow, submission flow, and evaluation status handling. Integrate against the API contracts and execution worker.

## Prompt Batch 5: Data Modeling Builder
Implement the data modeling canvas, entity card, relationship creation, validation summary, autosave, and submission scoring path according to the visual builder spec.

## Prompt Batch 6: Pipeline Builder
Implement the drag-and-drop ETL builder using React Flow, node palette, config drawer, validation panel, simulation timeline, and submission flow according to the builder interaction and practice engine specs.

## Prompt Batch 7: Billing, Mock Interviews, And Polish
Implement billing status and checkout flow, mock interview mode, progress enhancements, responsive polish, accessibility fixes, analytics, and release-level QA improvements.

## Acceptance Notes
- Every prompt should reference the exact docs it depends on.
- No prompt should invent product behavior outside the planning pack.
- If implementation uncovers gaps, update docs first before proceeding.
