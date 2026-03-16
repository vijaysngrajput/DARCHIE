# D-ARCHIE Component HLD Blueprint

## 1. Purpose
This document defines the standard blueprint to be used for every component-level High-Level Design (HLD) in D-ARCHIE.

The objective of this blueprint is to ensure that:
- every component HLD follows the same design structure,
- architectural decisions are captured consistently,
- component documents are easy to compare,
- each HLD is complete enough to hand off into LLD and implementation planning,
- boundaries between components remain clear.

This blueprint should be used before creating HLDs for:
- Frontend
- Backend
- Assessment Orchestration
- Assessment Content Management
- Scoring and Evaluation
- Reporting and Analytics
- Identity and Access
- any later supporting modules such as Response Capture and Persistence, Notification/Audit/Support, Coding Sandbox Integration, or AI Evaluation Integration.

## 2. Parent Reference Documents
Every component HLD must be aligned with:
- [`BRD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/BRD.md)
- [`Platform-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/Platform-HLD.md)

The component HLD must not redefine business intent or platform architecture from scratch. It should inherit those decisions and refine only the selected component.

## 3. What Every Component HLD Must Answer
Every component HLD must answer these core questions:
- what does this component own,
- why does this component exist,
- what is inside its boundary,
- what is outside its boundary,
- which upstream and downstream systems interact with it,
- which platform concepts it owns or references,
- what data it reads and writes,
- whether it is system-of-record or read-only for each data area,
- what major runtime flows it handles,
- what failures or recovery conditions it must handle,
- what is intentionally deferred to LLD.

## 4. Standard Document Structure

### 4.1 Document Overview
Must include:
- purpose,
- audience,
- relationship to BRD and Platform HLD,
- scope of the selected component,
- out-of-scope boundaries.

### 4.2 Component Summary
Must include:
- component name,
- short mission statement,
- why the component matters to D-ARCHIE,
- the component’s role in the overall platform workflow.

### 4.3 Goals and Responsibilities
Must clearly define:
- primary responsibilities,
- business and technical goals,
- responsibilities explicitly not owned by the component.

This section should prevent overlap with sibling components.

### 4.4 In Scope / Out of Scope
Must list:
- what the component is expected to do in MVP,
- what is intentionally left to other components,
- what is deferred to future phases.

### 4.5 Actors and Interactions
Must identify:
- user actors who interact with the component directly or indirectly,
- internal platform modules that call or depend on it,
- external systems or providers it depends on,
- event-based integrations if applicable.

### 4.6 Component Boundaries and Dependencies
Must define:
- upstream dependencies,
- downstream dependencies,
- synchronous interactions,
- asynchronous interactions,
- critical integration touchpoints.

This section must explain where the component begins and ends.

### 4.7 Internal Logical Decomposition
Must describe the major internal sub-modules or capability areas inside the component.

Examples:
- API layer
- workflow manager
- policy/rules handler
- persistence adapter
- integration adapter
- reporting read model builder

The HLD must stay conceptual and avoid class-level design.

### 4.8 Runtime Flows
Must include at least one major end-to-end flow that is central to the component.

Examples:
- session start flow
- content publish flow
- scoring flow
- report generation flow
- login and authorization flow

If the component manages workflow or lifecycle, it should also describe:
- key state transitions,
- status changes,
- failure and retry paths at a high level.

### 4.9 High-Level Interfaces and Contracts
Must describe:
- interfaces the component provides,
- interfaces the component consumes,
- high-level operations or responsibilities on each interface,
- whether the interaction is request/response, event-driven, batch, or callback-style.

This section must not contain:
- endpoint-level API design,
- payload schemas,
- database table definitions.

### 4.10 Domain Concepts and Data Ownership
Must map the component against platform concepts and define:
- concepts it owns,
- concepts it updates,
- concepts it references but does not own,
- persistence responsibilities,
- storage type usage such as relational storage, object storage, cache, or events.

It must also state:
- which data it is system-of-record for,
- which data it only reads or derives,
- what records or artifacts it produces.

### 4.11 Quality Attributes
Must include component-specific expectations for:
- security,
- reliability,
- scalability,
- observability,
- auditability if relevant.

The quality attributes should be tied to real component behavior, not generic platform wording.

### 4.12 Risks and Failure Considerations
Must include:
- likely failure modes,
- boundary confusion risks,
- scaling or complexity risks,
- operational concerns,
- mitigation direction at HLD level.

### 4.13 Deferred Decisions for LLD
Must explicitly list what is not yet being decided in the HLD.

Typical deferred areas:
- exact API shapes,
- schema design,
- state enum values,
- algorithm details,
- framework-specific internal implementation,
- job scheduling details.

### 4.14 Handoff to LLD
Must list the next detailed design items expected in the LLD.

Examples:
- entities and relationships,
- API contracts,
- state machine definitions,
- sequence diagrams,
- storage schemas,
- retry rules,
- validation logic,
- permission matrices.

## 5. Required Architectural Decisions in Every Component HLD
Each component HLD must make the following decisions explicit:

### 5.1 Owned Concepts
Which of the platform concepts the component owns or is primarily responsible for.

### 5.2 Dependency Direction
Which components call this component and which components this component calls.

### 5.3 Interaction Model
Which interactions are:
- synchronous,
- asynchronous,
- event-triggered,
- human-review-driven.

### 5.4 Data Responsibility
For each major data area, define whether the component is:
- system-of-record,
- updater/editor,
- consumer/read-only,
- derived-view producer.

### 5.5 Extension Points
State any relevant future extension points, such as:
- AI-assisted evaluation,
- coding sandbox integration,
- SSO/external identity,
- analytics export,
- reviewer workflows,
- policy/rules plugins.

## 6. Standard Diagrams Required
Each component HLD should include the following diagrams.

### 6.1 Component Context Diagram
Shows:
- the selected component,
- direct callers,
- direct dependencies,
- major external systems.

### 6.2 Internal Logical Decomposition Diagram
Shows:
- the major logical parts inside the component,
- how they interact,
- key dependencies.

### 6.3 Primary Runtime Flow Diagram
Shows:
- the most important runtime flow for the component,
- major decisions or handoffs,
- persistence or event touchpoints where relevant.

### 6.4 Optional State Diagram
Required only if the component owns meaningful state or workflow transitions.

Examples:
- session lifecycle,
- content lifecycle,
- review lifecycle,
- score finalization lifecycle.

## 7. Standard Interface Checklist
Every component HLD must explicitly list:

### 7.1 Interfaces Provided
- who calls this component,
- what high-level operations it offers,
- what outcomes it is responsible for.

### 7.2 Interfaces Consumed
- which dependencies it calls,
- why those dependencies are needed,
- what information or action is expected in return.

### 7.3 Events Emitted or Consumed
- important domain or workflow events,
- when they occur,
- which downstream modules depend on them.

### 7.4 Interaction Type
Mark each major interaction as:
- sync request/response,
- async job/event,
- scheduled/background,
- human-review-mediated.

## 8. Standard Data Ownership Checklist
Every component HLD must define:

### 8.1 Owned Entities / Concepts
Which platform concepts or artifacts are primarily owned by this component.

### 8.2 Referenced but Not Owned
Which concepts are required for operation but are managed elsewhere.

### 8.3 Persistence Responsibility
Whether the component writes to:
- relational database,
- object storage,
- cache,
- queue/event bus,
- analytics/read store.

### 8.4 Records / Artifacts Produced
Examples:
- session state,
- content versions,
- response artifacts,
- score outputs,
- review outputs,
- result summaries,
- audit logs,
- notifications.

## 9. Platform Concepts to Map in Every Component HLD
Every component HLD must map itself against these platform-level concepts where relevant:
- `User`
- `Role`
- `Assessment`
- `Assessment Version`
- `Component`
- `Task`
- `Session`
- `Response`
- `Score`
- `Rubric`
- `Review`
- `Result Summary`

If a concept is not relevant, the HLD should explicitly state that it is not owned or materially handled by the component.

## 10. Acceptance Checklist for Any Component HLD
A component HLD is acceptable only if:
- responsibilities are unambiguous,
- boundaries with sibling components are clear,
- major flows are traceable,
- upstream and downstream dependencies are visible,
- storage ownership is clear,
- sync vs async behavior is clear,
- failure and recovery expectations are named,
- extension points are identified where relevant,
- deferred decisions are listed,
- the document is ready to hand off into LLD without major structural gaps.

## 11. Writing Guidance
When writing component HLDs, follow these rules:
- stay above endpoint-level API detail,
- stay above database-table detail,
- avoid framework-specific internal design unless it materially affects architecture,
- use behavior-level descriptions over implementation trivia,
- define boundaries before diving into flows,
- explain ownership clearly to avoid overlap with sibling modules,
- prefer Mermaid diagrams for consistency with the platform HLD.

## 12. Recommended Order for Component HLD Creation
Recommended order:
1. Assessment Orchestration
2. Backend
3. Assessment Content Management
4. Scoring and Evaluation
5. Frontend
6. Reporting and Analytics
7. Identity and Access

Rationale:
- Assessment Orchestration is the strongest dependency anchor because it governs session lifecycle, progression, branching, and component coordination.
- Backend is easier to define once orchestration boundaries are explicit.
- Content, scoring, and frontend designs become clearer after workflow ownership is fixed.

## 13. First Validation Target
The first component that should use this blueprint is:
- `Assessment Orchestration`

Why:
- it coordinates candidate session lifecycle,
- it governs task/component sequencing,
- it handles branching and progression decisions,
- it connects content, response persistence, and scoring,
- it is the highest-leverage module for validating whether this blueprint is complete.

## 14. Suggested Starter Template
The following section order should be copied into each future component HLD:

1. Document Overview
2. Component Summary
3. Goals and Responsibilities
4. In Scope / Out of Scope
5. Actors and Interactions
6. Component Boundaries and Dependencies
7. Internal Logical Decomposition
8. Runtime Flows
9. High-Level Interfaces and Contracts
10. Domain Concepts and Data Ownership
11. Security, Reliability, Scalability, and Observability
12. Risks and Failure Considerations
13. Deferred Decisions for LLD
14. Handoff to LLD
15. Acceptance Checklist

## 15. Executive Summary
This blueprint standardizes how D-ARCHIE component HLDs should be written. It ensures that every component HLD clearly defines ownership, boundaries, dependencies, runtime behavior, data responsibility, and LLD handoff points.

Using this blueprint first will reduce ambiguity, prevent design gaps, and make later HLDs easier to compare, review, and implement.
