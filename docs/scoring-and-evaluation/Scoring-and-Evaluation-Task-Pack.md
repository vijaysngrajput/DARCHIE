# D-ARCHIE Scoring and Evaluation Code Engine Task Pack

Source spec:
- [`Scoring-and-Evaluation-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/scoring-and-evaluation/Scoring-and-Evaluation-CDS.md)

## 1. Evaluation Tasks
1. Create evaluation routes and DTOs from CDS section 5.
2. Create `EvaluationExecutionService`.
3. Create `EvaluationPathResolver`, `RuleBasedEvaluator`, and `RubricEvaluationCoordinator`.

## 2. Review and Aggregation Tasks
1. Create `ManualReviewService`.
2. Create `ScoreAggregationService`.
3. Create `ReadinessStateService`.
4. Implement task, component, and assessment recomputation paths.

## 3. Persistence and Integration Tasks
1. Create ORM models and repositories from CDS sections 3.8 and 3.9.
2. Create content and orchestration clients.
3. Create score and review events from CDS section 3.15.
4. Freeze finalized score payload from CDS section 6.

## 4. Error and Test Tasks
1. Create `errors.py` with HTTP mapping from CDS section 9.
2. Add unit and integration tests from CDS section 10.

## 5. Completion Criteria
- Evaluation-path selection is explicit and testable.
- Finalized score payload is stable for reporting consumption.
- Review completion triggers recomputation.
- Finalized-score event tests pass.
