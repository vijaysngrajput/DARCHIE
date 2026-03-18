import { apiRequest } from "@/lib/api/http";
import type { CandidateLandingView, CandidateTaskView, CurrentUnit, ProgressState, SessionSummary } from "@/lib/types";

export async function createSession(input: { assignmentId: string; assessmentVersionId: string }): Promise<SessionSummary> {
  return apiRequest<SessionSummary>("/sessions", {
    method: "POST",
    body: JSON.stringify({
      assignment_id: input.assignmentId,
      assessment_version_id: input.assessmentVersionId,
    }),
  });
}

export async function startSession(sessionId: string): Promise<SessionSummary> {
  return apiRequest<SessionSummary>(`/sessions/${sessionId}/start`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function fetchSession(sessionId: string): Promise<SessionSummary> {
  return apiRequest<SessionSummary>(`/sessions/${sessionId}`);
}

export async function fetchCurrentUnit(sessionId: string): Promise<CurrentUnit> {
  return apiRequest<CurrentUnit>(`/sessions/${sessionId}/current-unit`);
}

export async function fetchProgress(sessionId: string): Promise<ProgressState> {
  return apiRequest<ProgressState>(`/sessions/${sessionId}/progress`);
}

export async function fetchCandidateLandingView(sessionId: string): Promise<CandidateLandingView> {
  return apiRequest<CandidateLandingView>(`/candidate/sessions/${sessionId}/landing-view`);
}

export async function fetchCandidateTaskView(sessionId: string): Promise<CandidateTaskView> {
  return apiRequest<CandidateTaskView>(`/candidate/sessions/${sessionId}/task-view`);
}
