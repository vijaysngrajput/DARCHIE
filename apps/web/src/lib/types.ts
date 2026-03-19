export type DraftSaveStatus = "idle" | "saving" | "saved" | "error";
export type CandidateAssignmentState = "invited" | "in_progress" | "completed" | "expired" | "cancelled" | "reopened";

export interface CurrentUser {
  userId: string;
  email?: string;
  displayName?: string;
  roles: string[];
  accessSessionId?: string | null;
  authFresh?: boolean;
  expiresAt?: string | null;
}

export interface SessionSummary {
  session_id: string;
  assignment_id: string;
  assessment_version_id: string;
  session_state: string;
  current_component_id: string | null;
  current_task_id: string | null;
  started_at: string | null;
  expires_at: string | null;
  is_resumable: boolean;
  is_expired: boolean;
  is_completed: boolean;
  next_route: string;
  time_remaining_seconds: number | null;
}

export interface CurrentUnit {
  session_id: string;
  component_id: string | null;
  task_id: string | null;
  task_state: string;
  gated: boolean;
  evaluation_mode: string | null;
}

export interface ProgressState {
  session_id: string;
  total_components: number;
  completed_components: number;
  total_tasks: number;
  completed_tasks: number;
  submitted_tasks: number;
  current_index: number;
  percent_complete: number;
}

export interface CandidateProfile {
  user_id: string;
  email: string | null;
  display_name: string | null;
}

export interface CandidateAssignmentSummary {
  assignment_id: string;
  assessment_version_id: string;
  assignment_state: CandidateAssignmentState;
  invite_expires_at: string | null;
  current_session_id: string | null;
  latest_completed_session_id: string | null;
  latest_progress_summary: ProgressState | null;
  primary_action: string | null;
  primary_route: string | null;
  secondary_action: string | null;
  secondary_route: string | null;
  current_task_id: string | null;
  current_session_expires_at: string | null;
  time_remaining_seconds: number | null;
}

export interface CandidateHomeView {
  candidate_profile: CandidateProfile;
  assignments: CandidateAssignmentSummary[];
}

export interface DraftSaveRequest {
  session_id: string;
  task_id: string;
  payload: Record<string, unknown>;
  attempt_no: number;
}

export interface DraftSaveResult {
  draft_id: string;
  session_id: string;
  task_id: string;
  actor_id: string;
  attempt_no: number;
  payload: Record<string, unknown>;
  updated_at: string;
}

export interface FinalizeResponseRequest {
  session_id: string;
  task_id: string;
  payload: Record<string, unknown>;
  submission_key: string;
  attempt_no: number;
}

export interface FinalizeResponseResult {
  submission_id: string;
  session_id: string;
  task_id: string;
  actor_id: string;
  submission_key: string;
  finalized_at: string;
  checkpoint_milestone: string;
  session_state: string | null;
}

export interface ResponseSummary {
  session_id: string;
  task_id: string;
  actor_id: string;
  draft_exists: boolean;
  draft_attempt_no: number | null;
  finalized: boolean;
  submission_id: string | null;
  artifact_count: number;
  checkpoint_milestone: string | null;
}

export interface CandidateLandingView {
  session: SessionSummary;
  current_unit: CurrentUnit;
  progress: ProgressState;
}

export interface CandidateTaskView extends CandidateLandingView {
  draft: DraftSaveResult | null;
  response_summary: ResponseSummary | null;
}
