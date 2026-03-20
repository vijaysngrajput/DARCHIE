# 17 Content And Curriculum Specification

## Purpose
Define the launch curriculum, exercise taxonomy, authoring standards, and progression design for DARCHIE.

## Decisions This Document Owns
- Launch module coverage
- Difficulty taxonomy
- Exercise metadata standards
- Hint and solution policy
- Progression logic

## Inputs / Dependencies
- `docs/01-product/04-prd.md`
- `docs/01-product/05-user-personas-journey-maps.md`
- `docs/03-architecture/15-practice-engine-specification.md`

## Required Sections
- Curriculum map
- difficulty model
- exercise template
- authoring standards

## Output Format
Structured curriculum and content policy document.

## Completion Criteria
- Content creation can begin without inventing metadata or difficulty rules.
- Launch scope per module is explicit.

## Launch Curriculum
### SQL
- 20 launch exercises
- Focus: joins, aggregations, window functions, CTEs, debugging, performance basics

### Python
- 15 launch exercises
- Focus: data transformation, list/dict processing, parsing, validation, algorithmic fundamentals relevant to ETL

### Data Modeling
- 10 launch exercises
- Focus: entities, keys, normalization, denormalization tradeoffs, fact/dimension thinking

### Pipeline Builder
- 10 launch exercises
- Focus: ingestion, transformation, orchestration, retries, backfills, dependencies, observability

### Mock Interviews
- 8 launch templates
- Mixed module combinations with timed scenarios

## Difficulty Model
- `Foundation`: direct skills, limited ambiguity
- `Interview Ready`: multi-step tasks with realistic constraints
- `Stretch`: tradeoff-heavy, time-pressure, edge cases

## Exercise Metadata Standard
Each exercise must define:
- `id`
- `slug`
- `title`
- `module`
- `difficulty`
- `estimatedMinutes`
- `skills`
- `tags`
- `prompt`
- `starterState`
- `datasetRefs`
- `evaluationConfig`
- `hints`
- `explanation`
- `canonicalSolutionSummary`

## Authoring Standards
- Prompts must reflect plausible interview scenarios.
- Each exercise must test at least one explicit learning objective.
- Hints should unblock without giving away the answer.
- Explanations must discuss tradeoffs, not only final output.
- Canonical solutions may vary, but the evaluation criteria must remain stable.

## Progression Logic
- Users start with goal-based recommendations from onboarding.
- Foundation exercises unlock first.
- Interview Ready exercises are recommended after at least 2 completed exercises in a module.
- Stretch exercises appear after a readiness threshold or manual selection.
