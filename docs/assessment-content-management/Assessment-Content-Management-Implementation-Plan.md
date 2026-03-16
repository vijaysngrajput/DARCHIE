# D-ARCHIE Assessment Content Management Implementation Plan

## 1. Objective
Implement governed assessment authoring, version lifecycle, publish flow, and immutable runtime payload generation.

Primary source docs:
- [`Assessment-Content-Management-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/assessment-content-management/Assessment-Content-Management-CDS.md)
- [`Assessment-Content-Management-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/assessment-content-management/Assessment-Content-Management-Task-Pack.md)
- [`Implementation-Roadmap.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/platform/Implementation-Roadmap.md)

Milestone placement:
- Milestone 5

## 2. Prerequisites and Dependents
Prerequisites:
- backend shell

Downstream consumers:
- orchestration runtime content reads
- scoring rubric and evaluation metadata reads
- admin frontend authoring area

## 3. Local Execution Order
- authoring routes and DTOs
- authoring service
- version lifecycle service
- validation service
- publish service
- runtime payload service
- ORM models and repositories
- events and dependencies
- unit and integration tests

## 4. First Files and Classes
Implement first:
- `router.py`
- `schemas/authoring.py`
- `authoring_service.py`
- `version_service.py`
- `validation_service.py`

Core classes/interfaces:
- `AssessmentAuthoringService`
- `AssessmentVersionService`
- `ContentValidationService`
- `ContentPublishService`
- `RuntimePayloadService`

## 5. Local Completion Criteria
- draft/in-review/published lifecycle is enforced
- publish is blocked by validation failures
- published runtime payload is immutable
- runtime payload is consumable by orchestration and scoring
- content tests pass

## 6. Handoff
This component hands off:
- published runtime payload to orchestration
- rubric/evaluation metadata to scoring
- authoring and publish capabilities to admin flows
