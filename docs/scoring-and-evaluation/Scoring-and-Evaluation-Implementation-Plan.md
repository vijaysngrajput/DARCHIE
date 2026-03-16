# D-ARCHIE Scoring and Evaluation Implementation Plan

## 1. Objective
Implement evaluation execution, review handling, aggregation, readiness signaling, and finalized score emission.

Primary source docs:
- [`Scoring-and-Evaluation-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/scoring-and-evaluation/Scoring-and-Evaluation-CDS.md)
- [`Scoring-and-Evaluation-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/scoring-and-evaluation/Scoring-and-Evaluation-Task-Pack.md)
- [`Unified-Execution-Backlog.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/platform/Unified-Execution-Backlog.md)

Milestone placement:
- Milestone 6

## 2. Prerequisites and Dependents
Prerequisites:
- backend shell
- orchestration
- response capture
- content runtime payload and rubric metadata

Downstream consumers:
- reporting
- reviewer frontend area
- orchestration readiness flow

## 3. Local Execution Order
- evaluation routes and DTOs
- evaluation execution service
- evaluation path resolver and evaluator classes
- manual review service
- aggregation and readiness services
- ORM models and repositories
- content/orchestration clients
- events and tests

## 4. First Files and Classes
Implement first:
- `router.py`
- `schemas/evaluation.py`
- `evaluation_service.py`
- `path_resolver.py`
- `rule_evaluator.py`

Core classes/interfaces:
- `EvaluationExecutionService`
- `EvaluationPathResolver`
- `RuleBasedEvaluator`
- `RubricEvaluationCoordinator`
- `ManualReviewService`
- `ScoreAggregationService`
- `ReadinessStateService`

## 5. Local Completion Criteria
- evaluation path is explicit and testable
- review flow updates aggregates correctly
- readiness updates are available to orchestration
- finalized score payload is emitted in frozen contract shape
- scoring tests pass

## 6. Handoff
This component hands off:
- finalized score payload to reporting
- readiness updates to orchestration
- review-driven score state to reviewer workflows
