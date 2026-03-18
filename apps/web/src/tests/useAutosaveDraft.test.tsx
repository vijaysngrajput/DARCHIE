import { act, renderHook } from "@testing-library/react";

import { useAutosaveDraft } from "@/hooks/useAutosaveDraft";

const saveDraftMock = vi.fn(async () => ({ updated_at: new Date().toISOString() }));

vi.mock("@/lib/api/responses", () => ({
  saveDraft: (...args: unknown[]) => saveDraftMock(...args),
}));

describe("useAutosaveDraft", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    saveDraftMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("autosaves after debounce", async () => {
    const { result, rerender } = renderHook(
      ({ payload }) =>
        useAutosaveDraft({
          sessionId: "session-1",
          taskId: "task-1",
          payload,
          attemptNo: 1,
          debounceMs: 200,
        }),
      {
        initialProps: { payload: { answer: "a" } },
      },
    );

    rerender({ payload: { answer: "updated" } });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(250);
    });

    expect(saveDraftMock).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe("saved");
  });
});
