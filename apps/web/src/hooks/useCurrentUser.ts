"use client";

import { useEffect, useState } from "react";

import { fetchCurrentUser } from "@/lib/api/auth";
import { clearAuthSession, readAuthSession, writeAuthSession } from "@/lib/auth/storage";
import type { CurrentUser } from "@/lib/types";

export function useCurrentUser(): { user: CurrentUser | null; loading: boolean; error: string | null } {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function resolveCurrentUser() {
      const storedUser = readAuthSession();
      if (!storedUser) {
        setUser(null);
        setError(null);
        setLoading(false);
        return;
      }

      setUser(storedUser);
      setLoading(false);
      setError(null);

      try {
        const liveUser = await fetchCurrentUser();
        const nextUser: CurrentUser = {
          ...storedUser,
          ...liveUser,
          accessSessionId: liveUser.accessSessionId ?? storedUser.accessSessionId ?? null,
          expiresAt: liveUser.expiresAt ?? storedUser.expiresAt ?? null,
          authFresh: false,
        };
        writeAuthSession(nextUser);
        setUser(nextUser);
      } catch (currentUserError) {
        clearAuthSession();
        setUser(null);
        setError(currentUserError instanceof Error ? currentUserError.message : "Unable to verify current user.");
      }
    }

    void resolveCurrentUser();
  }, []);

  return { user, loading, error };
}
