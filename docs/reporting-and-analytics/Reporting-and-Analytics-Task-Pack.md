# D-ARCHIE Reporting and Analytics Code Engine Task Pack

Source spec:
- [`Reporting-and-Analytics-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/reporting-and-analytics/Reporting-and-Analytics-CDS.md)

## 1. Refresh and Query Tasks
1. Create report query routes and DTOs from CDS section 5.
2. Create `ReportRefreshService`.
3. Create `ReportingQueryService`.

## 2. View Builder Tasks
1. Create `CandidateScorecardService`.
2. Create `ComponentInsightService`.
3. Create `ComparisonSummaryService`.
4. Keep all view generation strictly based on finalized score payloads.

## 3. Persistence and Integration Tasks
1. Create reporting read-model ORM models and repositories.
2. Create scoring and content clients.
3. Create refresh and view-refreshed events.

## 4. Error and Test Tasks
1. Create `errors.py` with HTTP mapping from CDS section 9.
2. Add unit and integration tests from CDS section 10.

## 5. Completion Criteria
- Reporting consumes finalized score payload only.
- Read models are query-ready and refreshable.
- Comparison scope checks are enforced.
- Refresh and report-query tests pass.
