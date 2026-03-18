# D-ARCHIE Frontend High-Level Design (HLD)

## 1. Document Overview

### 1.1 Purpose
This document defines the high-level design for the `Frontend` component in D-ARCHIE.

The purpose of this HLD is to define the single shared web application that:
- provides role-based experiences for all key user types,
- prioritizes candidate assessment-taking workflows for MVP,
- supports recruiter and hiring-manager reporting access,
- supports admin content-management access,
- supports reviewer evaluation/review workflows,
- integrates with the backend API while keeping business logic ownership outside the frontend.

This HLD establishes the frontend as the presentation and interaction layer of D-ARCHIE while keeping workflow, scoring, content, reporting, and identity policy ownership outside its boundary.

### 1.2 Audience
This document is written for:
- solution architects,
- frontend engineers,
- backend engineers integrating frontend-facing APIs,
- product and engineering leads,
- UX and design collaborators,
- future LLD authors.

### 1.3 Relationship to Parent Documents
This component HLD is derived from:
- [`BRD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/BRD.md)
- [`Platform-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/Platform-HLD.md)
- [`Component-HLD-Blueprint.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/Component-HLD-Blueprint.md)
- [`Backend-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/Backend-HLD.md)
- [`Identity-and-Access-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/Identity-and-Access-HLD.md)
- [`Assessment-Orchestration-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/Assessment-Orchestration-HLD.md)
- [`Assessment-Content-Management-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/Assessment-Content-Management-HLD.md)
- [`Scoring-and-Evaluation-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/Scoring-and-Evaluation-HLD.md)
- [`Reporting-and-Analytics-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/Reporting-and-Analytics-HLD.md)

The platform HLD defines a candidate-facing and recruiter/admin-facing frontend capability. The backend HLD defines a single API surface. The identity HLD defines role-aware access context. This document defines the frontend as one shared web application with role-based areas.

### 1.4 Scope
This HLD covers:
- frontend ownership and boundaries,
- one-app role-based frontend structure,
- candidate-first MVP interaction priorities,
- role-based navigation and experience areas,
- frontend integration with backend APIs,
- high-level interaction flows for candidate, recruiter, hiring manager, admin, and reviewer roles,
- quality attributes and failure considerations,
- handoff points for LLD,
- shell-driven UI architecture direction.

This HLD does not cover:
- backend business logic,
- workflow decision ownership,
- scoring or reporting business semantics,
- identity policy ownership,
- component-level frontend code structure,
- endpoint-level API contracts.

Detailed UI screen design, route-to-layout mapping, shell grammar, and design-system rules are defined in [`Frontend-Design-Spec.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-Design-Spec.md).

## 2. Component Summary

### 2.1 Component Name
`Frontend`

### 2.2 Mission Statement
The Frontend is the single shared web application of D-ARCHIE, responsible for delivering role-appropriate user experiences for assessment-taking, result consumption, content administration, and review workflows.

### 2.3 Why This Component Matters
D-ARCHIE depends on a realistic candidate experience and usable internal workflows. The frontend must:
- provide a strong candidate assessment experience,
- keep role-based areas clear and secure,
- support recruiter/hiring-manager insight consumption,
- support admin content authoring workflows,
- support reviewer scoring/review actions,
- integrate with the backend without absorbing platform business logic.

Without a coherent frontend architecture, the platform would feel fragmented across roles and would risk leaking workflow or scoring logic into the UI layer.

### 2.4 Role in the Platform
The frontend acts as:
- the interaction and presentation layer,
- the single web app shell for all roles,
- the coordinator of role-based navigation and client-side experience boundaries,
- the consumer of backend APIs and access context.

It is not the owner of business rules for workflow, scoring, content, identity policy, or reporting generation.

## 3. Goals and Responsibilities

### 3.1 Primary Goals
- deliver a candidate-first MVP user experience,
- provide one coherent role-based web application rather than multiple separate products,
- keep UI concerns separate from backend business logic,
- support autosave, progress visibility, and assessment continuity at a UX level,
- support internal user workflows without compromising candidate flow quality,
- remain extensible for richer interactions in future phases.

### 3.2 Primary Responsibilities
- render role-based areas for:
  - candidate,
  - recruiter,
  - hiring manager,
  - admin / assessment designer,
  - reviewer,
- provide stable shell chrome across protected areas,
- support candidate assessment-taking interactions,
- support recruiter/hiring-manager result-viewing interactions,
- support admin content-management access,
- support reviewer score/review interactions,
- manage role-aware navigation and presentation state,
- interact with backend APIs for all user-facing operations,
- present progress, status, loading, and error states clearly,
- support autosave and recovery UX through backend-integrated patterns.

### 3.3 Explicitly Not Owned by This Component
- authentication policy semantics,
- authorization policy ownership,
- workflow progression decisions,
- content authoring semantics,
- score generation,
- report-generation logic,
- persistence ownership,
- advanced visual tooling as required MVP behavior.

## 4. In Scope / Out of Scope

### 4.1 In Scope for MVP
- one shared web app,
- role-based shell variants for candidate, recruiting, admin, and reviewer areas,
- candidate assessment-taking flows,
- coding-task, structured-response, and scenario-task interaction shells,
- progress display and autosave-oriented UX,
- report viewing for recruiter/hiring manager,
- content-management access paths for admins,
- review/action access paths for reviewers,
- explicit extension boundaries for richer future interactions.

### 4.2 Out of Scope for MVP
- separate frontend products,
- frontend-owned workflow decisions,
- frontend-owned access-policy decisions,
- heavy visual design tooling as a required MVP capability,
- advanced interactive editors as active MVP behavior,
- endpoint/schema-level API definition.

### 4.3 Deferred to Later Phases
- richer visual diagramming tools,
- collaborative editing experiences,
- more advanced internal dashboards,
- richer offline/resume behavior,
- more advanced adaptive or AI-assisted user interactions.

## 5. Actors and Interactions

### 5.1 User Actors
- Candidate
- Recruiter
- Hiring Manager
- Admin / Assessment Designer
- Reviewer

### 5.2 Internal Platform Actors
- Backend application shell
- Identity and Access
- Assessment Orchestration
- Assessment Content Management
- Scoring and Evaluation
- Reporting and Analytics

### 5.3 External / Supporting Systems
- browser/client runtime,
- observability/error monitoring tooling,
- future richer interaction modules such as diagramming or advanced editors.

### 5.4 Interaction Model Summary
- frontend is the only user-facing application surface in MVP,
- backend provides the single API surface consumed by the frontend,
- frontend uses identity/access context to shape role-aware UX,
- candidate interactions are tightly integrated with orchestration and response flows,
- internal-role experiences rely on content, scoring, and reporting outputs through backend mediation.

## 6. Component Boundaries and Dependencies

### 6.1 Boundary Definition
The frontend begins when a user interacts with the web application and ends when the frontend has rendered the appropriate role-aware experience and exchanged the required state with backend services.

It owns:
- presentation,
- user interaction structure,
- app shell chrome,
- role-based navigation,
- client-side experience state,
- UX handling for autosave/progress/error/loading patterns.

It does not own:
- business-rule evaluation,
- workflow progression,
- authentication policy,
- scoring logic,
- reporting generation,
- persistence or data integrity decisions.

### 6.2 Upstream Dependencies
Upstream actors include:
- browser users in different roles,
- identity context passed through authenticated backend-mediated access.

### 6.3 Downstream Dependencies
The frontend depends on:
- backend API,
- identity/access context,
- orchestration-backed task/session APIs,
- content-backed admin authoring APIs,
- scoring/review-backed reviewer APIs,
- reporting-backed result-view APIs.

## 7. Shell and Area Strategy

### 7.1 Shared Product Strategy
The application must feel like one product with multiple role areas.

High-level shell strategy:
- protected areas use a stable top header,
- protected areas use left navigation on desktop,
- public entry uses a lighter shell,
- utility footer is global and lightweight,
- candidate task-taking uses a specialized workspace inside the shared shell.

### 7.2 Role Areas
- public
- candidate
- recruiting
- admin
- reviewer

Hiring manager uses recruiting area with narrower access.

### 7.3 Candidate-First Priority
The candidate flow is the first detailed UI area and the standard for perceived quality. Candidate-first means:
- strongest polish and continuity,
- stable shell-driven navigation,
- focused assessment workspace,
- minimized layout shift,
- clear progress and save/submit feedback.

## 8. Quality Attributes
The frontend must optimize for:
- clarity,
- continuity,
- shell stability,
- fast perceived navigation,
- role-aware separation,
- recoverable errors,
- responsive behavior across desktop/tablet/mobile.

## 9. Handoff to LLD and Design Spec
The HLD hands off:
- role-area structure,
- shared shell direction,
- frontend boundaries,
- candidate-first quality expectations,
- dependency expectations,
- responsibility split between shell architecture and detailed screen design.

Detailed route inventory, shell variants, layout grammar, design tokens, and component ownership live in [`Frontend-Design-Spec.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-Design-Spec.md).
