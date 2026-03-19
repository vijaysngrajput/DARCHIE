import React from "react";
import { render, screen } from "@testing-library/react";

import { TaskShell } from "@/components/candidate/TaskShell";

describe("TaskShell", () => {
  it("renders current task details and progress", () => {
    render(
      <TaskShell
        session={{
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
        }}
        currentUnit={{
          session_id: "session-1",
          component_id: "component-1",
          task_id: "task-1",
          task_state: "in_progress",
          gated: false,
          evaluation_mode: "rule_based",
        }}
        progress={{
          session_id: "session-1",
          total_components: 1,
          completed_components: 0,
          total_tasks: 1,
          completed_tasks: 0,
          submitted_tasks: 0,
          current_index: 1,
          percent_complete: 0,
        }}
        value="hello"
        onChange={() => undefined}
        onSaveNow={() => undefined}
        onSubmit={() => undefined}
        autosaveStatus="idle"
        autosaveError={null}
        lastSavedAt={null}
        submitting={false}
        timerLabel="59:59 remaining"
        timerWarning={false}
      />,
    );

    expect(screen.getByText("task-1")).toBeInTheDocument();
    expect(screen.getByText(/0%/)).toBeInTheDocument();
    expect(screen.getByText(/59:59 remaining/)).toBeInTheDocument();
  });
});
