# 12 Low-Level Design

## Purpose
Define the internal modules, data flow, request lifecycle, validation logic, and execution states required to implement DARCHIE v1.

## Decisions This Document Owns
- Internal module boundaries
- request flow by feature
- validation and scoring responsibilities
- background processing rules

## Inputs / Dependencies
- `docs/03-architecture/11-high-level-design.md`
- `docs/01-product/04-prd.md`

## Required Sections
- Modules
- request flows
- state machines
- internal contracts

## Output Format
Detailed technical behavior document.

## Completion Criteria
- Engineering can implement modules and service boundaries without inventing core behavior.

## Internal Modules
- `auth`: session resolution, access control, profile bootstrap
- `catalog`: exercise discovery, tags, difficulty filters
- `attempts`: save draft, submit, result retrieval
- `practice-engine`: exercise-specific evaluation orchestration
- `progress`: aggregates module and user metrics
- `billing`: plan checks and entitlements
- `analytics`: event publishing
- `builder-engine`: canvas validation, simulation, scoring

## Request Flows
### Exercise Load Flow
1. Client requests exercise by ID.
2. API resolves authenticated user and entitlement.
3. Catalog returns exercise metadata and starter state.
4. Existing draft attempt is attached if present.
5. Client hydrates workspace.

### Save Draft Flow
1. Client sends current workspace state.
2. API validates payload via Zod schema.
3. Attempts module upserts draft attempt.
4. API returns save timestamp and draft version.

### Submit Flow
1. Client sends attempt snapshot.
2. API creates submission record with `queued` status.
3. Practice engine routes the submission:
   - SQL and Python to execution worker
   - data modeling and pipeline builder to builder engine
4. Result persisted as structured evaluation
5. Progress aggregates are updated asynchronously

## Execution States
- `draft`
- `queued`
- `running`
- `completed`
- `failed_validation`
- `failed_execution`
- `cancelled`

## Internal Contracts
### Practice Engine Input
- user ID
- exercise ID
- module type
- normalized workspace payload
- submission metadata

### Evaluation Output
- status
- score
- rubric breakdown
- user-facing feedback summary
- structured errors
- execution artifacts where applicable

## Builder Validation Logic
### Pipeline Builder
- Node types are checked against allowed adjacency rules
- Graph must be acyclic unless exercise specifically allows loop patterns
- Required config fields must exist before simulation
- A start node and at least one terminal node are required

### Data Modeling
- Entity names must be unique within a workspace
- Primary keys required on all persisted entities
- Foreign keys must point to valid entities and field types
- Validation can flag normalization issues as warnings rather than hard errors

## Background Processing
- Submission evaluation is asynchronous once queued.
- Progress recalculation runs in background after evaluation completion.
- Analytics events are fire-and-forget and should not block UX flows.
