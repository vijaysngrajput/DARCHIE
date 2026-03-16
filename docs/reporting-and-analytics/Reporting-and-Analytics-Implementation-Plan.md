# D-ARCHIE Reporting and Analytics Implementation Plan

## 1. Objective
Implement finalized-score-driven reporting read models, scorecards, component insights, and comparison views.

Primary source docs:
- [`Reporting-and-Analytics-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/reporting-and-analytics/Reporting-and-Analytics-CDS.md)
- [`Reporting-and-Analytics-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/reporting-and-analytics/Reporting-and-Analytics-Task-Pack.md)
- [`Implementation-Roadmap.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/platform/Implementation-Roadmap.md)

Milestone placement:
- Milestone 7

## 2. Prerequisites and Dependents
Prerequisites:
- backend shell
- identity scope enforcement
- finalized score payload from scoring

Downstream consumers:
- recruiting frontend area
- hiring-manager decision flows

## 3. Local Execution Order
- report query routes and DTOs
- refresh service
- scorecard service
- component insight service
- comparison summary service
- read-model repositories and models
- scoring/content clients
- tests

## 4. First Files and Classes
Implement first:
- `router.py`
- `schemas/reports.py`
- `schemas/comparisons.py`
- `refresh_service.py`
- `scorecard_service.py`

Core classes/interfaces:
- `ReportRefreshService`
- `CandidateScorecardService`
- `ComponentInsightService`
- `ComparisonSummaryService`
- `ReportingQueryService`

## 5. Local Completion Criteria
- reporting consumes finalized score payload only
- scorecards and insights are queryable
- comparisons respect access scope
- refresh flow is idempotent and tested
- reporting tests pass

## 6. Handoff
This component hands off:
- recruiter and hiring-manager result views to frontend
- read-model refresh markers and audit-relevant refresh events to support services
