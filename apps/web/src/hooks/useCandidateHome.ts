"use client";

import { useEffect, useState } from "react";

import { fetchCandidateHomeView } from "@/lib/api/sessions";
import { ApiError } from "@/lib/api/http";
import type { CandidateHomeView } from "@/lib/types";

export function useCandidateHome() {
  const [view, setView] = useState<CandidateHomeView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const nextView = await fetchCandidateHomeView();
      setView(nextView);
      setError(null);
      setErrorStatus(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load candidate home.");
      setErrorStatus(loadError instanceof ApiError ? loadError.status : null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return { view, loading, error, errorStatus, refresh: load };
}
