"use client";

import { useEffect, useState } from "react";

import { fetchCandidateLandingView, startSession } from "@/lib/api/sessions";
import type { CandidateLandingView, CurrentUnit, ProgressState, SessionSummary } from "@/lib/types";

export interface CandidateSessionViewModel {
  session: SessionSummary | null;
  currentUnit: CurrentUnit | null;
  progress: ProgressState | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  startOrResume: () => Promise<SessionSummary>;
  refresh: () => Promise<void>;
}

export function useCandidateSession(sessionId: string): CandidateSessionViewModel {
  const [session, setSession] = useState<SessionSummary | null>(null);
  const [currentUnit, setCurrentUnit] = useState<CurrentUnit | null>(null);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function applyLandingView(view: CandidateLandingView) {
    setSession(view.session);
    setCurrentUnit(view.current_unit);
    setProgress(view.progress);
    setError(null);
  }

  async function load(background = false) {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    if (background && session) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const view = await fetchCandidateLandingView(sessionId);
      await applyLandingView(view);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load session.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void load();
  }, [sessionId]);

  async function startOrResume() {
    const nextSession = await startSession(sessionId);
    setSession(nextSession);
    await load(true);
    return nextSession;
  }

  return {
    session,
    currentUnit,
    progress,
    loading,
    refreshing,
    error,
    startOrResume,
    refresh: async () => load(true),
  };
}
