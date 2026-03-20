# 13 Domain Model And Data Model Spec

## Purpose
Define the domain entities, relationships, and persistence model for DARCHIE v1.

## Decisions This Document Owns
- Entity definitions
- key relationships
- lifecycle rules
- data integrity constraints

## Inputs / Dependencies
- `docs/03-architecture/12-low-level-design.md`

## Required Sections
- Entities
- relationships
- lifecycle rules
- storage constraints

## Output Format
Entity and relational model specification.

## Completion Criteria
- Backend schema implementation can begin from this document.

## Core Entities
### User
- identity record from auth provider
- fields: `id`, `email`, `auth_provider`, `created_at`

### UserProfile
- fields: `user_id`, `display_name`, `target_role`, `experience_level`, `goal_focus`, `onboarding_completed_at`

### Subscription
- fields: `id`, `user_id`, `plan`, `status`, `stripe_customer_id`, `stripe_subscription_id`, `current_period_end`

### Exercise
- fields: `id`, `slug`, `title`, `module`, `difficulty`, `estimated_minutes`, `prompt_markdown`, `starter_state`, `evaluation_config`, `is_premium`, `status`

### ExerciseDataset
- fields: `id`, `exercise_id`, `name`, `dataset_type`, `storage_path`, `schema_json`

### Attempt
- fields: `id`, `user_id`, `exercise_id`, `status`, `workspace_state`, `last_saved_at`, `latest_submission_id`

### Submission
- fields: `id`, `attempt_id`, `submitted_payload`, `status`, `queued_at`, `started_at`, `completed_at`

### Evaluation
- fields: `id`, `submission_id`, `score`, `rubric_json`, `feedback_summary`, `feedback_detail_json`, `artifact_json`

### ProgressSnapshot
- fields: `id`, `user_id`, `module`, `completed_count`, `average_score`, `readiness_score`, `updated_at`

### MockInterviewSession
- fields: `id`, `user_id`, `config_json`, `started_at`, `ended_at`, `status`, `summary_json`

## Relationships
- A `User` has one `UserProfile`
- A `User` may have one active `Subscription`
- An `Exercise` has many `ExerciseDataset` records
- A `User` has many `Attempt` records
- An `Attempt` belongs to one `Exercise`
- An `Attempt` has many `Submission` records
- A `Submission` has one `Evaluation`
- A `User` has many `ProgressSnapshot` rows, one per module over time

## Lifecycle Rules
- Draft work is stored on `Attempt`
- Each submit creates a new `Submission`
- Latest attempt summary references the most recent `Submission`
- Progress snapshots are append-friendly for trend analysis, but the current view can be materialized

## Storage Constraints
- `workspace_state` and feedback detail use JSON columns
- datasets live in object storage with metadata in Postgres
- large execution logs should be truncated and summarized before persistence
