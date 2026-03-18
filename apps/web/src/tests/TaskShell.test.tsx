import React from "react";
import { render, screen } from "@testing-library/react";

import { TaskShell } from "@/components/candidate/TaskShell";

describe("TaskShell", () => {
  it("renders current task details and progress", () => {
    render(
      <TaskShell
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
      />,
    );

    expect(screen.getByText("task-1")).toBeInTheDocument();
    expect(screen.getByText(/0%/)).toBeInTheDocument();
  });
});
