# D-ARCHIE Business Requirements Document (BRD)

## 1. Document Overview

### 1.1 Document Purpose
This Business Requirements Document defines the business problem, product vision, stakeholders, scope, requirements, success criteria, and phased delivery direction for D-ARCHIE.

The purpose of this document is to establish a shared understanding of:
- what business problem D-ARCHIE solves,
- why the product matters,
- who will use it,
- what capabilities must exist in the first version,
- how the platform should evolve across later architecture and implementation phases.

This BRD is intended to be the foundation for the following downstream documents and activities:
- high-level architecture document,
- component-wise high-level design,
- low-level design for each component,
- implementation roadmap,
- task planning and engineering execution.

### 1.2 Product Name
`D-ARCHIE`

Expanded understanding:
- `D` = Data
- `ARCH` = architecture, engineering structure, and system thinking
- `IE` = engineering intelligence / evaluation

### 1.3 Product Summary
D-ARCHIE is a specialized assessment platform for Data Engineers. It evaluates candidates across the full data engineering workflow rather than limiting assessment to isolated coding or syntax-based exercises.

Unlike generic interview tools that mainly test Python, SQL, or coding puzzles independently, D-ARCHIE measures practical engineering capability across coding, data modelling, solution design, data processing, pipeline architecture, monitoring, reporting, and data quality/governance.

The long-term differentiator of the platform is that it can assess not only technical correctness, but also workflow thinking, architecture judgment, production-readiness, and eventually AI-assisted engineering decision-making.

## 2. Business Context

### 2.1 Current Industry Problem
Companies hiring Data Engineers often struggle to measure real job readiness. Existing assessment methods usually suffer from one or more of the following issues:
- over-focus on isolated coding tests,
- lack of end-to-end workflow evaluation,
- weak measurement of architectural thinking,
- no assessment of data modelling quality,
- no simulation of production issues like monitoring, failures, or data quality concerns,
- limited visibility into whether the candidate can convert business requirements into reliable data solutions,
- poor correlation between interview performance and on-the-job performance.

In real data engineering work, engineers are expected to:
- write code,
- design schemas,
- understand source-to-target mappings,
- build and operate pipelines,
- reason about batch and streaming patterns,
- monitor systems,
- ensure data quality,
- support business reporting,
- make practical architecture trade-offs.

Traditional assessment platforms do not capture this full workflow. As a result, companies may hire candidates who perform well in narrow technical tests but underperform in real project execution.

### 2.2 Business Opportunity
There is a clear market need for a role-specific, workflow-based assessment platform that better reflects real-world data engineering responsibilities.

D-ARCHIE addresses this opportunity by:
- evaluating end-to-end engineering capability,
- helping recruiters and hiring managers make stronger hiring decisions,
- reducing false positives from narrow coding-only assessments,
- offering a structured and repeatable evaluation framework,
- creating a differentiated hiring product for the Data Engineering domain.

### 2.3 Why D-ARCHIE Matters
D-ARCHIE matters because strong Data Engineers create business value through reliable data systems, not just through isolated coding ability.

The platform is built on the idea that a strong Data Engineer should be able to:
- implement technical solutions,
- design scalable and maintainable data models,
- convert business needs into system design,
- process and deliver trustworthy data,
- operate production-grade pipelines,
- support downstream business decision-making.

## 3. Problem Statement

Organizations currently lack a realistic, structured, and scalable way to assess Data Engineers across the complete workflow of data engineering. Existing interview tools do not adequately test system design, data flow planning, processing logic, monitoring readiness, reporting alignment, and governance thinking in one connected assessment experience.

This creates hiring inefficiency, inconsistent evaluation quality, and a mismatch between candidate interview performance and actual job capability.

## 4. Vision Statement

D-ARCHIE will become a full-spectrum Data Engineer assessment platform that enables companies to evaluate practical engineering ability across real data workflow stages, combining technical implementation, architecture judgment, reliability thinking, and business-facing data delivery into one structured assessment system.

## 5. Goals and Objectives

### 5.1 Primary Business Goals
- Improve quality of Data Engineer hiring decisions.
- Provide companies with a more realistic candidate evaluation framework.
- Differentiate from generic coding platforms through workflow-based assessment.
- Build a reusable assessment platform that can scale across companies, roles, and assessment formats.
- Establish a foundation for future AI-assisted candidate evaluation.

### 5.2 Product Objectives for Initial Version
- Deliver an MVP that supports structured multi-component assessments.
- Cover all 8 core data engineering capability areas.
- Allow mixed assessment formats such as coding, structured response, design reasoning, scenario analysis, and visual workflow tasks.
- Enable rule-based, rubric-based, and manual-review-compatible scoring.
- Provide recruiter/admin reporting to view candidate strengths and weaknesses by component.
- Prove business value before deeper automation and AI evaluation are introduced.

### 5.3 Long-Term Objectives
- Introduce adaptive assessments.
- Add AI-assisted evaluation for Components 2 to 8.
- Assess how candidates use AI as part of real engineering workflows.
- Support dynamic follow-up questions based on candidate actions.
- Produce richer analytics around candidate capability patterns and benchmarking.

## 6. Stakeholders

### 6.1 Primary Stakeholders
- Product owner / business sponsor
- Hiring companies / recruiters
- Hiring managers
- Data engineering interview panels
- Candidates taking the assessment
- Internal product, design, and engineering teams
- Assessment content creators / reviewers
- Operations or support teams managing platform reliability

### 6.2 Stakeholder Needs

#### Business Sponsor
- clear product differentiation,
- measurable hiring value,
- scalable delivery roadmap,
- adoption-ready platform vision.

#### Recruiters and Hiring Teams
- easy candidate setup,
- structured assessments,
- consistent scoring,
- meaningful reporting,
- fast decision support.

#### Candidates
- realistic assessment flow,
- clear instructions,
- stable and usable interface,
- fair evaluation process,
- relevant and role-aligned challenges.

#### Assessment Authors / Admins
- ability to create and manage content,
- define component structure and follow-up tasks,
- configure scoring rules and rubrics,
- update assessments without engineering dependency for every change.

#### Engineering / Product Teams
- clear functional scope,
- phased architecture decisions,
- modular platform design,
- maintainable implementation approach.

## 7. Target Users and Personas

### 7.1 Candidate Persona
A Data Engineering candidate being assessed for practical capability across implementation, design, architecture, reliability, and business data delivery.

### 7.2 Recruiter Persona
A recruiter or talent acquisition partner who needs standardized, scalable, and interpretable evaluation outcomes for candidate shortlisting.

### 7.3 Hiring Manager Persona
A Data Engineering leader or technical interviewer who needs deeper insight into a candidate's strengths, judgment, and role readiness across multiple dimensions.

### 7.4 Admin / Assessment Designer Persona
An internal user who creates assessment flows, configures content, defines scoring models, and manages component sequencing.

## 8. Product Scope

### 8.1 In Scope for D-ARCHIE Platform
- candidate-facing assessment interface,
- recruiter/admin interface,
- assessment session management,
- multi-component assessment orchestration,
- coding exercises,
- structured form or text-based tasks,
- visual or scenario-driven tasks,
- scoring workflow support,
- result storage and reporting,
- content management for questions and scenarios,
- component-wise performance analysis.

### 8.2 Core Assessment Components

#### 1. Code Component
Assesses direct technical execution using Python, SQL, Spark, or similar technologies.

Capabilities covered:
- coding problem solving,
- query writing,
- logic implementation,
- debugging basic technical solutions.

#### 2. Data Modelling Component
Assesses how candidates design data structures for analytics or operations.

Capabilities covered:
- schema design,
- facts and dimensions,
- normalization and denormalization,
- table relationships,
- storage design trade-offs.

#### 3. Data Designing Component
Assesses how candidates translate business problems into data design solutions.

Capabilities covered:
- source-to-target mapping,
- logical design,
- data flow planning,
- selecting appropriate structures for business use cases.

#### 4. Data Processing Component
Assesses how candidates reason about and implement data transformations and processing logic.

Capabilities covered:
- ETL / ELT thinking,
- transformation logic,
- batch and streaming concepts,
- incremental processing,
- error handling,
- scalability and performance awareness.

#### 5. Data Pipeline Architecture Component
Assesses end-to-end pipeline architecture thinking.

Capabilities covered:
- ingestion design,
- orchestration thinking,
- storage layers,
- integrations,
- resiliency,
- reprocessing strategy,
- architecture trade-offs.

#### 6. Data Monitoring Component
Assesses production support and observability thinking.

Capabilities covered:
- logs,
- alerts,
- SLA tracking,
- failure handling,
- anomaly detection,
- support readiness.

#### 7. Data Reporting Component
Assesses readiness for downstream business consumption.

Capabilities covered:
- reporting-oriented data preparation,
- metric alignment,
- dashboard readiness,
- stakeholder usability.

#### 8. Data Quality / Governance Component
Assesses data trust and reliability thinking.

Capabilities covered:
- validation rules,
- consistency checks,
- schema awareness,
- lineage understanding,
- governance principles,
- documentation and reliability.

### 8.3 Assessment Flow Characteristics
Assessments may include:
- direct coding exercises,
- question-answer tasks,
- visual design exercises,
- scenario-based reasoning,
- debugging tasks,
- workflow simulations,
- follow-up questions based on previous responses.

Each component may contain:
- sub-components,
- dependent tasks,
- progressive difficulty,
- rubric-specific evaluation criteria.

## 9. Business Requirements

### 9.1 Core Business Requirements

#### BR-01 Role-Specific Assessment
The platform must evaluate Data Engineers in a way that reflects actual workflow responsibilities rather than isolated coding-only checks.

#### BR-02 Multi-Component Coverage
The platform must support assessment across all 8 core components of data engineering capability.

#### BR-03 Structured Assessment Flow
The platform must support sequencing, branching, and progression between multiple tasks and components within one assessment session.

#### BR-04 Mixed Assessment Formats
The platform must support multiple task types including coding, descriptive answers, visual design tasks, architecture reasoning, debugging, and workflow-based evaluation.

#### BR-05 Flexible Scoring
The platform must support rule-based scoring, rubric-based scoring, and manual review support in the first version.

#### BR-06 Recruiter and Hiring Visibility
The platform must provide reporting that shows candidate strengths and weaknesses by component and overall assessment performance.

#### BR-07 Content Manageability
The platform must enable independent creation, maintenance, and update of assessment content without requiring major code changes for each content update.

#### BR-08 Assessment Session Management
The platform must manage candidate sessions, progress tracking, response capture, timing, completion state, and result persistence.

#### BR-09 Extensible Evaluation Model
The platform architecture and product design must leave room for future AI-assisted evaluation and adaptive assessment behavior.

#### BR-10 Business Credibility
The platform must demonstrate clear value over generic coding platforms by producing more realistic and actionable evaluation outputs.

## 10. Functional Requirements at Business Level

### 10.1 Candidate Experience Requirements
- candidate can log in or access an assigned assessment,
- candidate can move through multiple assessment components,
- candidate can submit different response types,
- candidate can work in guided, structured flows,
- candidate can complete tasks with clear instructions,
- candidate progress is saved reliably,
- candidate experience supports realistic engineering workflows as much as practical.

### 10.2 Recruiter / Hiring Team Requirements
- recruiter can assign assessments,
- recruiter can track candidate completion status,
- recruiter can review scores and component-level performance,
- recruiter can view strengths and weaknesses,
- recruiter can access a structured summary for hiring decisions.

### 10.3 Admin / Content Management Requirements
- admin can create assessments,
- admin can define components and sub-components,
- admin can configure task order and dependencies,
- admin can attach scoring rules or rubrics,
- admin can manage question banks and scenarios,
- admin can update assessment content over time.

### 10.4 Evaluation Engine Requirements
- system can deliver tasks component by component,
- system can capture answers in multiple formats,
- system can apply scoring logic where possible,
- system can flag responses for rubric/manual review,
- system can store results in a structured format,
- system can support future AI evaluation extensions.

## 11. Non-Functional Requirements at Business Level

- usability: assessments should be clear and intuitive for candidates and reviewers,
- reliability: assessment progress and submissions should not be easily lost,
- scalability: platform should support increasing candidate volume and expanding content,
- maintainability: content and system modules should be easy to evolve,
- extensibility: future AI-assisted evaluation should be addable without platform redesign,
- security: candidate data, results, and assessment content must be protected,
- auditability: scoring and evaluation outcomes should be traceable,
- performance: candidate interaction should feel responsive and stable,
- configurability: assessments should be composable for different use cases.

## 12. Proposed Solution Overview

The D-ARCHIE solution will likely require five major platform capabilities:

### 12.1 Frontend Application
Used by candidates and platform administrators.

The frontend should support:
- coding editor interactions,
- structured response forms,
- scenario and workflow task presentation,
- visual design workflows where needed,
- navigation across assessment stages,
- recruiter/admin result views.

### 12.2 Backend Application
Responsible for:
- user management,
- assessment assignment,
- session lifecycle management,
- response capture,
- scoring coordination,
- persistence,
- authorization and platform operations.

### 12.3 Assessment Engine
Responsible for:
- delivering questions and scenarios,
- sequencing component flow,
- handling follow-up logic,
- invoking scoring rules,
- storing component-level outputs,
- supporting future AI/rubric evaluation integration.

### 12.4 Content Management Layer
Responsible for:
- creation of components and sub-components,
- question and scenario storage,
- versioning of assessments,
- authoring and maintenance of business logic-linked assessment content.

### 12.5 Reporting and Analytics Layer
Responsible for:
- candidate performance summaries,
- component-wise result analysis,
- recruiter-facing insights,
- comparison and hiring support outputs.

## 13. MVP Definition

### 13.1 MVP Intent
The first version should validate that D-ARCHIE can provide a more realistic, more structured, and more useful Data Engineer assessment experience than generic coding platforms.

### 13.2 MVP Capabilities
- support multi-step assessments,
- include all 8 components at at least foundational depth,
- allow mixed task types,
- capture candidate responses,
- support scoring through rules, rubrics, and manual review where necessary,
- provide recruiter/admin reporting,
- enable content authoring and updates,
- store assessment results for later review.

### 13.3 What the MVP Does Not Need to Fully Solve
- fully automated scoring for every task type,
- mature adaptive assessment logic,
- advanced AI-based judgment,
- complete benchmarking intelligence,
- deep enterprise workflow integrations from day one.

## 14. Future-State Direction

### 14.1 AI-Assisted Evaluation Vision
In later phases, D-ARCHIE should evaluate not only candidate outputs but also how candidates use AI in engineering workflows.

This may include:
- whether the candidate asks strong AI prompts,
- whether they validate AI outputs properly,
- whether AI assistance improves or weakens engineering decisions,
- whether the candidate applies AI responsibly during design, debugging, and documentation tasks.

### 14.2 Adaptive and Dynamic Assessments
Future versions may:
- introduce dynamic follow-up questions,
- adjust difficulty based on prior answers,
- tailor flows by candidate seniority,
- deepen analysis in weak or strong capability areas.

### 14.3 Advanced Analytics
Future analytics may include:
- benchmarking across candidate pools,
- hiring confidence indicators,
- skill heatmaps,
- role-specific scorecards,
- longitudinal assessment insights.

## 15. Benefits

### 15.1 Business Benefits
- better hiring signal,
- reduced interview subjectivity,
- improved recruiter efficiency,
- stronger confidence in candidate selection,
- differentiation in the assessment technology market.

### 15.2 User Benefits

#### For Hiring Teams
- broader and more practical evaluation,
- clearer candidate comparisons,
- better role fit analysis.

#### For Candidates
- more realistic role-aligned assessment,
- opportunity to demonstrate broader engineering capability,
- less over-reliance on puzzle-style testing alone.

## 16. Risks and Challenges

### 16.1 Product Risks
- scoring consistency may be difficult across subjective components,
- visual and workflow-based tasks may require more design effort than standard assessments,
- too much complexity in version 1 may slow delivery,
- candidate experience may suffer if the flow feels overly long or unclear.

### 16.2 Delivery Risks
- unclear boundaries between content, scoring, and platform logic,
- insufficient modular design may make future AI integration expensive,
- content creation effort may become a bottleneck,
- architecture decisions may overfit MVP assumptions.

### 16.3 Mitigation Principles
- keep MVP focused on business validation,
- separate content management from execution logic,
- make scoring models pluggable,
- start with hybrid evaluation instead of forcing full automation,
- design around modular platform components.

## 17. Assumptions

- companies want a more realistic way to assess Data Engineers,
- all 8 components are valuable as part of one connected assessment model,
- mixed task types are necessary to evaluate real-world engineering capability,
- not all components need fully automated scoring in MVP,
- AI-assisted evaluation will be strategically important in future phases,
- recruiter/admin reporting is a key adoption driver,
- modular architecture is required to support phased growth.

## 18. Constraints

- MVP should avoid solving every advanced feature at once,
- subjective evaluation areas may require manual review support,
- content quality will strongly influence platform credibility,
- assessment duration must balance realism with candidate fatigue,
- system design should support future flexibility without unnecessary early complexity.

## 19. Success Metrics

### 19.1 Business Success Metrics
- hiring teams perceive D-ARCHIE as more relevant than generic coding assessments,
- recruiters can make faster and more confident screening decisions,
- candidate evaluation quality improves across workflow-based criteria,
- pilot customers see clearer strengths/weaknesses visibility.

### 19.2 Product Success Metrics
- assessment completion rate,
- component-wise submission rate,
- recruiter/report usage rate,
- scoring turnaround time,
- content reusability rate,
- pilot satisfaction feedback,
- conversion from pilot to continued usage.

## 20. Phased Documentation and Delivery Path

The software process for D-ARCHIE should follow this sequence:

### Phase 1: Finalize BRD
Objective:
- define the business problem,
- confirm product scope,
- establish success criteria,
- align stakeholders and delivery intent.

Deliverable:
- this BRD document.

### Phase 2: Finalize High-Level Design (Platform Level)
Objective:
- define the overall system view and working model,
- identify major modules,
- define key interactions,
- establish deployment and architecture direction at a high level.

Expected outputs:
- system context diagram,
- major module breakdown,
- platform interaction overview,
- high-level data flow,
- technology direction assumptions.

### Phase 3: Finalize High-Level Design for Each Component
Objective:
- define the HLD for frontend, backend, assessment engine, content management, reporting, and other major modules,
- clarify boundaries and interfaces between modules.

Expected outputs:
- module responsibility definitions,
- component interactions,
- API/domain boundaries,
- storage responsibility mapping,
- integration points.

### Phase 4: Finalize Low-Level Design for Each HLD Component
Objective:
- convert each component HLD into implementable design details.

Expected outputs:
- entity definitions,
- API contracts,
- workflow states,
- scoring logic design,
- data schemas,
- sequence flows,
- detailed behavior notes.

### Phase 5: Implementation Plan
Objective:
- define delivery phases, milestones, dependencies, and sequencing.

Expected outputs:
- release roadmap,
- engineering phase plan,
- dependency matrix,
- milestone-based implementation sequence.

### Phase 6: Task List by LLD Area
Objective:
- break each LLD component into actionable engineering tasks.

Expected outputs:
- epics,
- features,
- stories,
- technical tasks,
- testing tasks,
- deployment/support tasks.

### Phase 7: Implementation and Validation
Objective:
- build, test, validate, and iterate.

Expected outputs:
- implemented platform modules,
- tested workflows,
- feedback-based improvement loop,
- readiness for MVP release and later enhancements.

## 21. Recommended Next Documents

The next documents that should be created after this BRD are:

1. Platform HLD document
2. Frontend HLD
3. Backend HLD
4. Assessment Engine HLD
5. Content Management HLD
6. Reporting and Analytics HLD
7. Component-wise LLD documents
8. MVP implementation roadmap
9. Engineering task backlog

## 22. Executive Summary

D-ARCHIE is a workflow-based Data Engineer assessment platform designed to solve a real hiring gap: companies cannot reliably assess practical end-to-end data engineering capability through generic coding platforms alone.

The platform addresses this by evaluating candidates across 8 core components:
- code,
- data modelling,
- data designing,
- data processing,
- data pipeline architecture,
- data monitoring,
- data reporting,
- data quality / governance.

The first version should focus on proving business value through structured multi-component assessments, flexible scoring, content manageability, and recruiter-facing reporting. Later versions can expand into AI-assisted evaluation, adaptive assessment behavior, and richer analytics.

This document establishes the business foundation required to move into architecture and engineering planning.
