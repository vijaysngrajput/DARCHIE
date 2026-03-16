# Backend Domain Modules

## What This Is
This folder contains the backend business domains for D-ARCHIE.

Current state:
- each domain has a placeholder router and dependency file
- deeper services, schemas, repositories, and models will be implemented domain by domain

## Domains
- `identity_access`
- `assessment_orchestration`
- `assessment_content_management`
- `response_capture`
- `scoring_evaluation`
- `reporting_analytics`
- `support_services`

## How Modules Are Wired
All module routers are registered from `app/api/router.py`.
Each module should later expose:
- router
- dependencies
- services
- repositories
- schemas
- errors
