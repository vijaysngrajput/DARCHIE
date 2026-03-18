"use client";

import { useEffect, useRef, useState } from "react";

import { saveDraft } from "@/lib/api/responses";
import type { DraftSaveStatus } from "@/lib/types";

export interface UseAutosaveDraftInput {
  sessionId: string | null;
  taskId: string | null;
  payload: Record<string, unknown>;
  attemptNo: number;
  enabled?: boolean;
  debounceMs?: number;
}

export interface UseAutosaveDraftResult {
  status: DraftSaveStatus;
  error: string | null;
  lastSavedAt: string | null;
  saveNow: () => Promise<void>;
}

export function useAutosaveDraft(input: UseAutosaveDraftInput): UseAutosaveDraftResult {
  const {
    sessionId,
    taskId,
    payload,
    attemptNo,
    enabled = true,
    debounceMs = 900,
  } = input;
  const [status, setStatus] = useState<DraftSaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const previousPayloadRef = useRef<string>(JSON.stringify(payload));

  async function persistDraft() {
    if (!enabled || !sessionId || !taskId) {
      return;
    }
    setStatus("saving");
    setError(null);
    try {
      const result = await saveDraft({
        session_id: sessionId,
        task_id: taskId,
        payload,
        attempt_no: attemptNo,
      });
      previousPayloadRef.current = JSON.stringify(payload);
      setLastSavedAt(result.updated_at);
      setStatus("saved");
    } catch (saveError) {
      setStatus("error");
      setError(saveError instanceof Error ? saveError.message : "Autosave failed.");
    }
  }

  useEffect(() => {
    const serialized = JSON.stringify(payload);
    if (!enabled || !sessionId || !taskId) {
      return;
    }
    if (serialized === previousPayloadRef.current) {
      return;
    }
    setStatus("saving");
    const handle = window.setTimeout(() => {
      void persistDraft();
    }, debounceMs);
    return () => window.clearTimeout(handle);
  }, [attemptNo, debounceMs, enabled, payload, sessionId, taskId]);

  return {
    status,
    error,
    lastSavedAt,
    saveNow: persistDraft,
  };
}
