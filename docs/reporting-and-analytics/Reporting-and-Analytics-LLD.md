# D-ARCHIE Reporting and Analytics Low-Level Design (LLD)

## 1. Purpose
This document defines the implementation-ready design for report read models, candidate scorecards, and basic comparison views.

Parent document:
- [`Reporting-and-Analytics-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/reporting-and-analytics/Reporting-and-Analytics-HLD.md)

## 2. Owned Read Models
- `CandidateScorecardView`
- `ComponentInsightView`
- `AssessmentSummaryView`
- `ComparisonSummaryView`
- `ReportRefreshMarker`

Referenced:
- `Score`
- `Review`
- `Assessment`
- `AssessmentVersion`
- `Component`

## 3. Read Model Refresh Triggers
- `score_finalized`
- `review_completed`
- explicit report refresh job if needed

## 4. Query Groups
- `GET /reports/candidates/{candidateId}`
- `GET /reports/candidates/{candidateId}/components`
- `GET /reports/candidates/{candidateId}/summary`
- `GET /reports/comparisons`

## 5. Output Composition Rules
- Candidate scorecard includes assessment summary plus component summary rows.
- Component insight includes strength/weakness interpretation fields derived from finalized scores only.
- Basic comparison may compare:
  - components within one candidate
  - candidates within a recruiter-visible set
- No cohort benchmarking logic in MVP.

## 6. Refresh Flow
1. Consume finalized score/review update.
2. Load latest finalized outputs.
3. Rebuild candidate read models.
4. Rebuild comparison summaries if affected.
5. Mark refresh complete.

## 7. Access Rules
- Recruiter and hiring manager access filtered by permission scope.
- Candidate-facing self-report is not part of MVP reporting scope unless later enabled.
- Admin has limited inspection access only if granted.

## 8. Storage Ownership
- Reporting read store:
  - scorecards
  - insight views
  - summary views
  - comparison views
- Cache:
  - hot report reads

## 9. Failure and Retry
- Refresh retries are idempotent by candidate/report scope key.
- Stale read model is acceptable briefly if latest finalization is still in-flight, but refresh lag must be observable.
- Comparison refresh failure must not block candidate scorecard refresh.

## 10. Invariants
- Reporting views derive only from finalized scoring outputs.
- Reporting never mutates score semantics.
- Comparison summaries remain basic and non-benchmarking in MVP.

## 11. Observability
- report refresh lag
- report query latency
- stale-view detection markers

## 12. Implementation Readiness Checklist
- read models frozen
- refresh triggers frozen
- access scopes frozen
