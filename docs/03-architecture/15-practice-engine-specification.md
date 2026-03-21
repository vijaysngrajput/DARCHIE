# 15 Practice Engine Specification

## Purpose
Define how DARCHIE represents, runs, validates, and scores exercises across all modules.

## Decisions This Document Owns
- Exercise runtime model
- evaluation pipeline
- scoring model
- module-specific feedback behavior

## Inputs / Dependencies
- `docs/03-architecture/12-low-level-design.md`
- `docs/03-architecture/13-domain-model-data-model-spec.md`

## Required Sections
- Exercise model
- module runtimes
- scoring
- feedback

## Output Format
Cross-module practice engine specification.

## Completion Criteria
- Each exercise type has a clear runtime and scoring path.

## Exercise Representation
All exercises share a normalized structure:
- `metadata`
- `prompt`
- `starter_state`
- `constraints`
- `evaluation_config`
- `hints`
- `canonical_solution_summary`

## Module Runtime Behavior
### SQL
- User writes SQL against a provided schema and dataset.
- On run: query executes and result preview is returned.
- On submit: authoritative evaluation compares output and optional query-shape heuristics.
- Current first implementation slice runs one SQL preview exercise through the FastAPI backend with a read-only starter sandbox and a later migration path to a dedicated sandboxed MySQL runtime.

### Python
- User writes Python function or script inside a controlled template.
- On run: visible tests and execution output are shown.
- On submit: hidden tests and rubric evaluation are applied.

### Data Modeling
- User creates entities and relationships on a visual canvas.
- On validate: structural and semantic rules are checked.
- On submit: model is scored against expected relationships, keys, and design tradeoffs.

### Pipeline Builder
- User assembles node graph on a DAG-style canvas.
- On validate: graph rules and configuration checks run.
- On simulate: timeline playback shows execution order and failures.
- On submit: graph structure, correctness, and explanation rubric are scored.

## Scoring Model
Each submission yields:
- `correctness_score` from 0 to 100
- `structure_score` from 0 to 100
- `efficiency_or_design_score` from 0 to 100 when relevant
- `overall_score` as weighted result

Suggested weight defaults:
- SQL: 70 correctness, 20 structure, 10 efficiency
- Python: 70 correctness, 20 code quality, 10 edge-case handling
- Data modeling: 50 correctness, 30 structure, 20 design tradeoffs
- Pipeline builder: 45 correctness, 25 dependency logic, 20 reliability design, 10 explanation quality

## Feedback Output
Each evaluation must return:
- top-line score
- rubric breakdown
- what worked well
- key issues
- next best improvement
- optional sample reasoning summary

## Anti-Abuse Rules
- Limit runs and submissions per minute
- Reject payloads above configured size
- Strip unsupported libraries and system access from Python runtime
- Prevent network access from execution environments
- SQL preview sandbox should restrict the first slice to single-statement SELECT-style queries and reject destructive commands
