# D-ARCHIE Reporting and Analytics Component Design Spec (CDS)

## 1. Purpose
This document converts the reporting LLD into code-generation-ready design for the Python FastAPI backend.

Parent documents:
- [`Reporting-and-Analytics-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/reporting-and-analytics/Reporting-and-Analytics-HLD.md)
- [`Reporting-and-Analytics-LLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/reporting-and-analytics/Reporting-and-Analytics-LLD.md)
- [`Scoring-and-Evaluation-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/scoring-and-evaluation/Scoring-and-Evaluation-CDS.md)

## 2. Target Package Layout
```text
services/api/app/
  modules/
    reporting_analytics/
      router.py
      dependencies.py
      refresh_service.py
      scorecard_service.py
      insight_service.py
      comparison_service.py
      query_service.py
      repositories.py
      models.py
      schemas/
        reports.py
        comparisons.py
      clients/
        scoring_client.py
        content_client.py
      events.py
      errors.py
```

## 3. Module Responsibilities
### 3.1 `refresh_service.py`
- Define `ReportRefreshService`.
- Own refresh orchestration when finalized scoring updates arrive.

### 3.2 `scorecard_service.py`
- Define `CandidateScorecardService`.
- Build candidate scorecards and overall summaries from finalized score payloads.

### 3.3 `insight_service.py`
- Define `ComponentInsightService`.
- Build component-level strengths and weaknesses views.

### 3.4 `comparison_service.py`
- Define `ComparisonSummaryService`.
- Build basic comparison views for permitted recruiter/hiring-manager scopes.

### 3.5 `query_service.py`
- Define `ReportingQueryService`.
- Serve report queries against reporting read models.

### 3.6 `repositories.py`
- Define repositories for:
  - `CandidateScorecardViewRepository`
  - `ComponentInsightViewRepository`
  - `AssessmentSummaryViewRepository`
  - `ComparisonSummaryViewRepository`
  - `ReportRefreshMarkerRepository`

### 3.7 `models.py`
- Define ORM models:
  - `CandidateScorecardViewModel`
  - `ComponentInsightViewModel`
  - `AssessmentSummaryViewModel`
  - `ComparisonSummaryViewModel`
  - `ReportRefreshMarkerModel`

### 3.8 `schemas/reports.py`
- `CandidateScorecardResponse`
- `ComponentInsightResponse`
- `AssessmentSummaryResponse`

### 3.9 `schemas/comparisons.py`
- `ComparisonSummaryResponse`
- `ReportRefreshRequest`

### 3.10 `clients/scoring_client.py`
- `ReportingScoringClient` for finalized score payload lookup.

### 3.11 `clients/content_client.py`
- `ReportingContentClient` for component labels and structural metadata where needed.

### 3.12 `events.py`
- `ReportRefreshRequestedEvent`
- `ReportViewRefreshedEvent`

### 3.13 `errors.py`
- `ReportNotFoundError`
- `ReportRefreshFailedError`
- `ComparisonScopeDeniedError`

## 4. Class and Method Contracts
```python
class ReportRefreshService:
    def refresh_for_finalized_score(self, finalized_score_payload: dict) -> None: ...
    def refresh_candidate_views(self, candidate_id: str, assessment_version_id: str) -> None: ...

class CandidateScorecardService:
    def build_scorecard(self, candidate_id: str, finalized_score_payload: dict) -> CandidateScorecardResponse: ...

class ComponentInsightService:
    def build_component_insights(self, candidate_id: str, finalized_score_payload: dict) -> list[ComponentInsightResponse]: ...

class ComparisonSummaryService:
    def build_comparison(self, actor_id: str, candidate_ids: list[str]) -> ComparisonSummaryResponse: ...

class ReportingQueryService:
    def get_candidate_scorecard(self, candidate_id: str, actor_id: str) -> CandidateScorecardResponse: ...
    def get_component_insights(self, candidate_id: str, actor_id: str) -> list[ComponentInsightResponse]: ...
    def get_assessment_summary(self, candidate_id: str, actor_id: str) -> AssessmentSummaryResponse: ...
```

## 5. API-to-Code Mapping
| Endpoint | Router Function | Service Method |
| --- | --- | --- |
| `GET /reports/candidates/{candidate_id}` | `get_candidate_scorecard` | `ReportingQueryService.get_candidate_scorecard` |
| `GET /reports/candidates/{candidate_id}/components` | `get_component_insights` | `ReportingQueryService.get_component_insights` |
| `GET /reports/candidates/{candidate_id}/summary` | `get_assessment_summary` | `ReportingQueryService.get_assessment_summary` |
| `GET /reports/comparisons` | `get_comparison_summary` | `ComparisonSummaryService.build_comparison` |

## 6. Canonical Reporting Input Contract
- Reporting must consume the finalized score payload from [`Scoring-and-Evaluation-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/scoring-and-evaluation/Scoring-and-Evaluation-CDS.md#L101).
- Reporting must never derive views from non-finalized score state.

## 7. Repository Contracts
```python
class CandidateScorecardViewRepository(Protocol):
    def upsert(self, model: CandidateScorecardViewModel) -> CandidateScorecardViewModel: ...
    def get_by_candidate(self, candidate_id: str) -> CandidateScorecardViewModel | None: ...
```

## 8. Dependency Injection
- `dependencies.py` must expose:
  - `get_report_refresh_service`
  - `get_reporting_query_service`
  - `get_comparison_summary_service`

## 9. Error Mapping
| Domain Error | HTTP Status |
| --- | --- |
| `ReportNotFoundError` | 404 |
| `ComparisonScopeDeniedError` | 403 |
| `ReportRefreshFailedError` | 500 |

## 10. Tests to Generate
- Unit:
  - `test_scorecard_service.py`
  - `test_component_insight_service.py`
  - `test_comparison_service.py`
- Integration:
  - `test_report_query_routes.py`
  - `test_score_finalized_refresh_flow.py`
  - `test_comparison_scope_access.py`
- Fixtures:
  - finalized score payload fixture
  - report read-model fixtures
  - recruiter and hiring-manager access fixtures

## 11. Code Engine Acceptance
A code engine implementing this CDS must generate read-model refresh and query services, keep reporting strictly downstream of finalized scores, and provide tests for scorecard generation, component insight generation, comparison access control, and finalized-score-triggered refresh behavior.
