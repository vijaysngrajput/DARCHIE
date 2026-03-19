import { act, renderHook, waitFor } from "@testing-library/react";

import { useCandidateSession } from "@/hooks/useCandidateSession";

const fetchCandidateLandingViewMock = vi.fn(async () => ({
  session: {
    session_id: "session-1",
    assignment_id: "assignment-1",
    assessment_version_id: "assessment-v1",
    session_state: "created",
    current_component_id: "component-1",
    current_task_id: "task-1",
    started_at: null,
    expires_at: null,
    is_resumable: true,
    is_expired: false,
    is_completed: false,
    next_route: "/candidate/sessions/session-1",
    time_remaining_seconds: null,
  },
  current_unit: {
    session_id: "session-1",
    component_id: "component-1",
    task_id: "task-1",
    task_state: "in_progress",
    gated: false,
    evaluation_mode: "rule_based",
  },
  progress: {
    session_id: "session-1",
    total_components: 1,
    completed_components: 0,
    total_tasks: 1,
    completed_tasks: 0,
    submitted_tasks: 0,
    current_index: 1,
    percent_complete: 0,
  },
}));
const startSessionMock = vi.fn(async () => ({
  session_id: "session-1",
  assignment_id: "assignment-1",
  assessment_version_id: "assessment-v1",
  session_state: "active",
  current_component_id: "component-1",
  current_task_id: "task-1",
  started_at: "2026-03-18T00:00:00Z",
  expires_at: "2026-03-18T01:00:00Z",
  is_resumable: true,
  is_expired: false,
  is_completed: false,
  next_route: "/candidate/sessions/session-1/task",
  time_remaining_seconds: 3600,
}));
const resumeSessionMock = vi.fn(async () => ({
  session_id: "session-1",
  assignment_id: "assignment-1",
  assessment_version_id: "assessment-v1",
  session_state: "active",
  current_component_id: "component-1",
  current_task_id: "task-1",
  started_at: "2026-03-18T00:00:00Z",
  expires_at: "2026-03-18T01:00:00Z",
  is_resumable: true,
  is_expired: false,
  is_completed: false,
  next_route: "/candidate/sessions/session-1/task",
  time_remaining_seconds: 3500,
}));

vi.mock("@/lib/api/sessions", () => ({
  fetchCandidateLandingView: (...args: unknown[]) => fetchCandidateLandingViewMock(...args),
  startSession: (...args: unknown[]) => startSessionMock(...args),
  resumeSession: (...args: unknown[]) => resumeSessionMock(...args),
}));

describe("useCandidateSession", () => {
  beforeEach(() => {
    fetchCandidateLandingViewMock.mockClear();
    startSessionMock.mockClear();
    resumeSessionMock.mockClear();
  });

  it("loads the candidate session view model and can start the session", async () => {
    const { result } = renderHook(() => useCandidateSession("session-1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.session?.session_id).toBe("session-1");
    expect(result.current.currentUnit?.task_id).toBe("task-1");
    expect(result.current.progress?.percent_complete).toBe(0);

    await act(async () => {
      await result.current.startOrResume();
    });

    expect(startSessionMock).toHaveBeenCalledWith("session-1");
    expect(fetchCandidateLandingViewMock).toHaveBeenCalledTimes(2);
  });
});
